// Must be imported before any other module so Sentry can instrument them.
// No-op unless SENTRY_DSN is set.
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1)
  });
}

export const sentryEnabled = Boolean(process.env.SENTRY_DSN);
export { Sentry };
