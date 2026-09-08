import type { Request, Response } from 'express';
import Timesheet from '../models/Timesheet.js';
import User from '../models/User.js';
import { errorMessage } from '../types/index.js';
import { getPagination } from '../utils/pagination.js';

// Derive Monday of the week for a given date string
const getWeekBounds = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as week start
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);
  return { weekStartDate: monday, weekEndDate: sunday };
};

// GET /api/timesheets?page=&limit=&status=  — employee: own sheets; supervisor: team sheets
export const getTimesheets = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> =
      req.user!.role === 'employee'
        ? { employeeId: req.user!.id }
        : { supervisorId: req.user!.id };

    if (req.query.status) filter.status = req.query.status;

    const { skip, limit, meta } = getPagination(req);

    const [timesheets, total] = await Promise.all([
      Timesheet.find(filter)
        .populate('employeeId', 'firstName lastName employeeId department')
        .sort({ weekStartDate: -1 })
        .skip(skip)
        .limit(limit),
      Timesheet.countDocuments(filter)
    ]);

    res.json({ success: true, count: timesheets.length, pagination: meta(total), timesheets });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// GET /api/timesheets/:id
export const getTimesheetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const timesheet = await Timesheet.findById(req.params.id)
      .populate('employeeId', 'firstName lastName employeeId department')
      .populate('supervisorId', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName');

    if (!timesheet) {
      res.status(404).json({ success: false, message: 'Timesheet not found' });
      return;
    }

    const isOwner = timesheet.employeeId._id.toString() === req.user!.id;
    const isSupervisor = timesheet.supervisorId._id.toString() === req.user!.id;
    if (!isOwner && !isSupervisor && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.json({ success: true, timesheet });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// POST /api/timesheets  — employee creates/saves draft
export const createTimesheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { weekOf, entries, employeeNotes } = req.body;

    const employee = await User.findById(req.user!.id);
    if (!employee?.supervisorId) {
      res.status(400).json({ success: false, message: 'No supervisor assigned. Contact admin.' });
      return;
    }

    const { weekStartDate, weekEndDate } = getWeekBounds(weekOf);

    const existing = await Timesheet.findOne({ employeeId: req.user!.id, weekStartDate });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'A timesheet already exists for this week',
        timesheetId: existing._id
      });
      return;
    }

    const timesheet = await Timesheet.create({
      employeeId: req.user!.id,
      supervisorId: employee.supervisorId,
      weekStartDate,
      weekEndDate,
      entries,
      employeeNotes,
      status: 'draft'
    });

    res.status(201).json({ success: true, timesheet });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// PUT /api/timesheets/:id  — employee updates draft
export const updateTimesheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) {
      res.status(404).json({ success: false, message: 'Timesheet not found' });
      return;
    }

    if (timesheet.employeeId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    if (timesheet.status !== 'draft') {
      res.status(400).json({ success: false, message: 'Only draft timesheets can be edited' });
      return;
    }

    const { entries, employeeNotes } = req.body;
    if (entries) timesheet.entries = entries;
    if (employeeNotes !== undefined) timesheet.employeeNotes = employeeNotes;

    await timesheet.save();
    res.json({ success: true, timesheet });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// POST /api/timesheets/:id/submit  — employee submits for approval
export const submitTimesheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) {
      res.status(404).json({ success: false, message: 'Timesheet not found' });
      return;
    }

    if (timesheet.employeeId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    if (timesheet.status !== 'draft') {
      res.status(400).json({ success: false, message: 'Only draft timesheets can be submitted' });
      return;
    }

    timesheet.status = 'submitted';
    timesheet.submittedAt = new Date();
    await timesheet.save();

    res.json({ success: true, message: 'Timesheet submitted for approval', timesheet });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// POST /api/timesheets/:id/approve  — supervisor approves
export const approveTimesheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) {
      res.status(404).json({ success: false, message: 'Timesheet not found' });
      return;
    }

    if (timesheet.supervisorId.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    if (timesheet.status !== 'submitted') {
      res.status(400).json({ success: false, message: 'Only submitted timesheets can be approved' });
      return;
    }

    timesheet.status = 'approved';
    timesheet.reviewedAt = new Date();
    timesheet.set('reviewedBy', req.user!.id);
    timesheet.supervisorNotes = req.body.supervisorNotes || '';
    await timesheet.save();

    res.json({ success: true, message: 'Timesheet approved', timesheet });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};

// POST /api/timesheets/:id/reject  — supervisor rejects
export const rejectTimesheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) {
      res.status(404).json({ success: false, message: 'Timesheet not found' });
      return;
    }

    if (timesheet.supervisorId.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    if (timesheet.status !== 'submitted') {
      res.status(400).json({ success: false, message: 'Only submitted timesheets can be rejected' });
      return;
    }

    if (!req.body.supervisorNotes) {
      res.status(400).json({ success: false, message: 'Rejection reason is required' });
      return;
    }

    timesheet.status = 'rejected';
    timesheet.reviewedAt = new Date();
    timesheet.set('reviewedBy', req.user!.id);
    timesheet.supervisorNotes = req.body.supervisorNotes;
    await timesheet.save();

    res.json({ success: true, message: 'Timesheet rejected', timesheet });
  } catch (err) {
    res.status(500).json({ success: false, message: errorMessage(err) });
  }
};
