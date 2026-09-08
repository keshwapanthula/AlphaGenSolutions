import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { type IUser } from '../models/User.js';
import { errorMessage } from '../types/index.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import logger from '../utils/logger.js';

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const refreshSecret = (): string => (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string;

const signAccessToken = (userId: unknown): string =>
  jwt.sign({ id: String(userId) }, process.env.JWT_SECRET as string, { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions);

const signRefreshToken = (user: IUser): string =>
  jwt.sign({ id: String(user._id), type: 'refresh', tv: user.tokenVersion ?? 0 }, refreshSecret(), {
    expiresIn: REFRESH_EXPIRES
  } as jwt.SignOptions);

const baseCookie = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax'
});

const REFRESH_COOKIE_PATH = '/api/auth/refresh';

const setAuthCookies = (res: Response, user: IUser): string => {
  const accessToken = signAccessToken(user._id);
  res.cookie('token', accessToken, { ...baseCookie(), maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', signRefreshToken(user), {
    ...baseCookie(),
    path: REFRESH_COOKIE_PATH, // only sent to the refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return accessToken;
};

const publicUser = (user: IUser) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  employeeId: user.employeeId,
  department: user.department
});

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role, employeeId, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    // Only admins may create supervisor/admin accounts; first user defaults to employee
    const safeRole = ['employee', 'supervisor'].includes(role) ? role : 'employee';

    const user = await User.create({ firstName, lastName, email, password, role: safeRole, employeeId, department });

    const token = setAuthCookies(res, user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: publicUser(user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = setAuthCookies(res, user);

    res.json({
      success: true,
      token,
      user: publicUser(user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// POST /api/auth/refresh — rotate the refresh token and issue a new access token
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'No refresh token' });
      return;
    }

    const decoded = jwt.verify(refreshToken, refreshSecret()) as { id: string; type?: string; tv?: number };
    if (decoded.type !== 'refresh') {
      res.status(401).json({ success: false, message: 'Invalid token type' });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive || (user.tokenVersion ?? 0) !== decoded.tv) {
      res.status(401).json({ success: false, message: 'Refresh token revoked' });
      return;
    }

    const token = setAuthCookies(res, user);
    res.json({ success: true, token });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// POST /api/auth/logout
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token', baseCookie());
  res.clearCookie('refreshToken', { ...baseCookie(), path: REFRESH_COOKIE_PATH });
  res.json({ success: true, message: 'Logged out successfully' });
};

// POST /api/auth/forgot-password — always 200 to prevent user enumeration
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const genericResponse = {
    success: true,
    message: 'If that email is registered, a reset link has been sent.'
  };

  try {
    const user = await User.findOne({ email: req.body.email, isActive: true });
    if (!user) {
      res.json(genericResponse);
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const frontendUrl = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim();
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendPasswordResetEmail({ to: user.email, firstName: user.firstName, resetUrl });
    } else {
      logger.warn({ email: user.email }, 'Email not configured — reset link not sent');
    }

    // Expose the token only in tests — never in real environments
    if (process.env.NODE_ENV === 'test') {
      res.json({ ...genericResponse, resetToken: rawToken });
      return;
    }

    res.json(genericResponse);
  } catch (err) {
    logger.error({ err }, 'forgot-password failed');
    res.json(genericResponse); // still generic — don't leak internals
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      return;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1; // revoke all refresh tokens
    await user.save();

    res.json({ success: true, message: 'Password updated. Please log in with your new password.' });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).populate('supervisorId', 'firstName lastName email');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};
