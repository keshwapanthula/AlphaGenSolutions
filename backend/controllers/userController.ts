import type { Request, Response } from 'express';
import User from '../models/User.js';
import { errorMessage } from '../types/index.js';
import { getPagination } from '../utils/pagination.js';

// GET /api/users?page=&limit=  — admin only
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skip, limit, meta } = getPagination(req);
    const filter = { isActive: true };

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('supervisorId', 'firstName lastName email')
        .sort({ lastName: 1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    res.json({ success: true, count: users.length, pagination: meta(total), users });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// GET /api/users/supervisors  — list active supervisors (used when assigning)
export const getSupervisors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const supervisors = await User.find({ role: { $in: ['supervisor', 'admin'] }, isActive: true })
      .select('firstName lastName email department employeeId')
      .sort({ lastName: 1 });

    res.json({ success: true, supervisors });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).populate('supervisorId', 'firstName lastName email');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// PUT /api/users/:id  — admin assigns supervisor, updates department etc.
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { supervisorId, department, employeeId, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { supervisorId, department, employeeId, isActive },
      { new: true, runValidators: true }
    ).populate('supervisorId', 'firstName lastName email');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};
