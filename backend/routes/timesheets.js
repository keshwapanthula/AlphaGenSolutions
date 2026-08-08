import { Router } from 'express';
import { body } from 'express-validator';
import {
    approveTimesheet,
    createTimesheet,
    getTimesheetById,
    getTimesheets,
    rejectTimesheet,
    submitTimesheet,
    updateTimesheet
} from '../controllers/timesheetController.js';
import { protect, requireRole } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

router.use(protect); // all timesheet routes require login

const entryValidation = body('entries')
  .isArray({ min: 1 })
  .withMessage('At least one entry is required');

router.get('/', getTimesheets);
router.get('/:id', getTimesheetById);

router.post(
  '/',
  requireRole('employee'),
  [
    body('weekOf').notEmpty().withMessage('Week date is required').isISO8601(),
    entryValidation,
    body('entries.*.date').isISO8601().withMessage('Each entry needs a valid date'),
    body('entries.*.taskDescription').notEmpty().withMessage('Task description is required'),
    body('entries.*.hoursWorked').isFloat({ min: 0.25, max: 24 }).withMessage('Hours must be between 0.25 and 24')
  ],
  handleValidationErrors,
  createTimesheet
);

router.put(
  '/:id',
  requireRole('employee'),
  [
    entryValidation,
    body('entries.*.date').isISO8601().withMessage('Each entry needs a valid date'),
    body('entries.*.taskDescription').notEmpty().withMessage('Task description is required'),
    body('entries.*.hoursWorked').isFloat({ min: 0.25, max: 24 }).withMessage('Hours must be between 0.25 and 24')
  ],
  handleValidationErrors,
  updateTimesheet
);

router.post('/:id/submit', requireRole('employee'), submitTimesheet);

router.post(
  '/:id/approve',
  requireRole('supervisor', 'admin'),
  approveTimesheet
);

router.post(
  '/:id/reject',
  requireRole('supervisor', 'admin'),
  [body('supervisorNotes').notEmpty().withMessage('Rejection reason is required')],
  handleValidationErrors,
  rejectTimesheet
);

export default router;
