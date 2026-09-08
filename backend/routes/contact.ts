import express, { type NextFunction, type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { protect, requireRole } from '../middleware/auth.js';
import { handleValidationErrors, validateContact } from '../middleware/validation.js';
import Contact from '../models/Contact.js';
import { sendContactEmail } from '../utils/emailService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', validateContact, handleValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, company, message } = req.body;

    // Get client information
    const ipAddress = (req.headers['x-forwarded-for'] as string | undefined) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const databaseAvailable = mongoose.connection.readyState === 1;
    let contact = null;

    if (databaseAvailable) {
      // Create contact entry in database when MongoDB is available
      contact = await Contact.create({
        name,
        email,
        company,
        message,
        ipAddress,
        userAgent
      });
    }

    // Send email notification
    try {
      await sendContactEmail({
        name,
        email,
        company,
        message,
        submittedAt: contact?.createdAt ?? new Date()
      });
    } catch (emailError) {
      logger.error({ err: emailError }, 'Email sending failed');
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: contact?._id || null,
        name,
        email,
        submittedAt: contact?.createdAt || new Date().toISOString(),
        savedToDatabase: databaseAvailable
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/contact - Get all contacts (for admin use)
router.get('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected'
      });
    }

    const status = req.query.status as string | undefined;
    const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
    const limit = parseInt(String(req.query.limit ?? '10'), 10) || 10;

    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent'); // Hide sensitive data

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/contact/:id - Get single contact
router.get('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected'
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
});

export default router;
