import User from '../models/User.js';

// GET /api/users  — admin only
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .populate('supervisorId', 'firstName lastName email')
      .sort({ lastName: 1 });

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/supervisors  — list active supervisors (used when assigning)
export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: { $in: ['supervisor', 'admin'] }, isActive: true })
      .select('firstName lastName email department employeeId')
      .sort({ lastName: 1 });

    res.json({ success: true, supervisors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('supervisorId', 'firstName lastName email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id  — admin assigns supervisor, updates department etc.
export const updateUser = async (req, res) => {
  try {
    const { supervisorId, department, employeeId, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { supervisorId, department, employeeId, isActive },
      { new: true, runValidators: true }
    ).populate('supervisorId', 'firstName lastName email');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
