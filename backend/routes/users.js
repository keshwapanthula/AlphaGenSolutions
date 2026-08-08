import { Router } from 'express';
import { getSupervisors, getUserById, getUsers, updateUser } from '../controllers/userController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/supervisors', getSupervisors); // any authenticated user
router.get('/', requireRole('admin'), getUsers);
router.get('/:id', requireRole('admin', 'supervisor'), getUserById);
router.put('/:id', requireRole('admin'), updateUser);

export default router;
