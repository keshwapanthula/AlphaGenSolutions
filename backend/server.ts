import './instrument.js'; // must load first for Sentry instrumentation
import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'AlphaGen Solutions API started');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled Promise Rejection');
  process.exit(1);
});
