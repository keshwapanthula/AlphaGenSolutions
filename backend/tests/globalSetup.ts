import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

// Runs in the main process before workers spawn — env vars are inherited by test workers
export async function setup() {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.JWT_SECRET = 'test-secret-key-for-vitest-runs-only';
  process.env.NODE_ENV = 'test';
  process.env.RATE_LIMIT_MAX_REQUESTS = '1000';
}

export async function teardown() {
  if (mongod) await mongod.stop();
}
