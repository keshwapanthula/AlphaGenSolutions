// Dev-only seed routes — never mounted in production
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

const SEED_USERS = [
  {
    firstName: 'Alice',
    lastName: 'Supervisor',
    email: 'supervisor@test.com',
    password: 'Password1',
    role: 'supervisor',
    department: 'Engineering',
    employeeId: 'SUP-001',
  },
  {
    firstName: 'Bob',
    lastName: 'Employee',
    email: 'employee@test.com',
    password: 'Password1',
    role: 'employee',
    department: 'Engineering',
    employeeId: 'EMP-001',
  },
  {
    firstName: 'Carol',
    lastName: 'Admin',
    email: 'admin@test.com',
    password: 'Password1',
    role: 'admin',
    department: 'Management',
    employeeId: 'ADM-001',
  },
];

// POST /api/dev/seed — create test users, skip any that already exist
router.post('/seed', async (req, res) => {
  const results = [];

  for (const data of SEED_USERS) {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      results.push({ email: data.email, status: 'already exists' });
      continue;
    }
    await User.create(data);
    results.push({ email: data.email, role: data.role, password: data.password, status: 'created' });
  }

  // Wire employee to supervisor after both exist
  const supervisor = await User.findOne({ email: 'supervisor@test.com' });
  const employee = await User.findOne({ email: 'employee@test.com' });
  if (supervisor && employee && !employee.supervisorId) {
    await User.findByIdAndUpdate(employee._id, { supervisorId: supervisor._id });
  }

  res.json({ success: true, results });
});

// DELETE /api/dev/seed — wipe all test users
router.delete('/seed', async (req, res) => {
  const emails = SEED_USERS.map((u) => u.email);
  const { deletedCount } = await User.deleteMany({ email: { $in: emails } });
  res.json({ success: true, deletedCount });
});

// GET /api/dev/users — list all users (no passwords)
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').lean();
  res.json({ success: true, count: users.length, users });
});

export default router;
