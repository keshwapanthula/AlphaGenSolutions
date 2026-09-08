import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);

    logger.info({ host: conn.connection.host, db: conn.connection.name }, 'MongoDB connected');
    return true;
  } catch (error) {
    logger.warn({ err: error instanceof Error ? error.message : error }, 'MongoDB unavailable, continuing without database');
    return false;
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB error');
});

export default connectDB;
