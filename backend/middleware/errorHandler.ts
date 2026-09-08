import type { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger.js';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { path: string; message: string }>;
}

export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  logger.error({ err, url: req.originalUrl, method: req.method }, 'Request error');

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    res.status(400).json({
      success: false,
      message: 'Duplicate entry detected'
    });
    return;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid data format'
    });
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
