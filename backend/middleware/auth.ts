import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import type { Role } from '../types/index.js';

const CSRF_SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.token as string | undefined;
    let fromCookie = Boolean(token);

    // Also accept Bearer token header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      fromCookie = false;
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // CSRF defense: cookie-authenticated state-changing requests must carry a
    // custom header (cross-site pages can't set one without passing CORS preflight)
    if (fromCookie && !CSRF_SAFE_METHODS.has(req.method) && req.headers['x-requested-with'] !== 'XMLHttpRequest') {
      res.status(403).json({ success: false, message: 'Missing CSRF protection header' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User no longer exists or is inactive' });
      return;
    }

    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// requireRole('supervisor', 'admin') — call after protect
export const requireRole = (...roles: Role[]): RequestHandler => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${roles.join(' or ')}`
    });
    return;
  }
  next();
};
