import crypto from 'node:crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database.js';
import docs from './docs/openapi.js';
import { errorHandler } from './middleware/errorHandler.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import devRoutes from './routes/dev.js';
import timesheetRoutes from './routes/timesheets.js';
import userRoutes from './routes/users.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB (idempotent – safe to call multiple times)
connectDB();

// Initialize Express app
const app = express();

// Structured request logging with correlation IDs
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => (req.headers['x-request-id'] as string | undefined) || crypto.randomUUID(),
    redact: ['req.headers.authorization', 'req.headers.cookie'],
    autoLogging: { ignore: (req) => req.url === '/api/health' }
  })
);

// Security Middleware
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS Configuration
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser + Cookie Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '', 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '', 10) || 5,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS ?? '', 10) || 15 * 60 * 1000,
  max: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS ?? '', 10) || 20,
  message: 'Too many AI chat requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to contact and auth routes
app.use('/api/contact', limiter);
app.use('/api/ai/chat', aiLimiter);
app.use('/api/auth/login', limiter);
app.use('/api/auth/register', limiter);
app.use('/api/auth/forgot-password', limiter);

const getServiceStatus = () => {
  const databaseConnected = mongoose.connection.readyState === 1;
  const emailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  return {
    database: databaseConnected ? 'connected' : 'disconnected',
    email: emailConfigured ? 'configured' : 'missing-configuration',
    contactSubmissionSafeMode: !databaseConnected
  };
};

// Root route — API info and pointers
app.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'AlphaGen Solutions API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health',
    endpoints: ['/api/ai', '/api/auth', '/api/contact', '/api/timesheets', '/api/users']
  });
});

// Health Check Route
app.get('/api/health', (_req, res) => {
  const services = getServiceStatus();

  res.status(200).json({
    success: true,
    message: 'AlphaGen Solutions API is running',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services
  });
});

// Readiness route for deployment platforms and uptime checks
app.get('/api/readiness', (_req, res) => {
  const services = getServiceStatus();
  const ready = services.database === 'connected' || services.email === 'configured';

  res.status(ready ? 200 : 503).json({
    success: ready,
    status: ready ? 'ready' : 'not-ready',
    message: ready
      ? 'At least one contact delivery path is available.'
      : 'Neither database nor email service is available.',
    timestamp: new Date().toISOString(),
    services
  });
});

// Basic operational status for maintenance dashboards
app.get('/api/status', (_req, res) => {
  const memory = process.memoryUsage();
  res.status(200).json({
    success: true,
    nodeVersion: process.version,
    platform: process.platform,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryMB: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024)
    },
    services: getServiceStatus()
  });
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/users', userRoutes);

// Interactive API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));
app.get('/api-docs.json', (_req, res) => res.json(docs));

// Dev-only helpers (never available in production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRoutes);
}

// 404 Handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Report unhandled errors to Sentry when configured (before our error handler)
if (process.env.SENTRY_DSN) {
  const { Sentry } = await import('./instrument.js');
  Sentry.setupExpressErrorHandler(app);
}

// Error Handler Middleware (must be last)
app.use(errorHandler);

export default app;
