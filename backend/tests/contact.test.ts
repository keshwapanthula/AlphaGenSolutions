import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../app.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';

const contactPayload = {
  name: 'Jane Client',
  email: 'jane.client@example.com',
  company: 'Client Co',
  message: 'I want to discuss an AI modernization project.'
};

const createAdminToken = async () => {
  await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'Password1',
    role: 'admin'
  });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'Password1' });

  return res.body.token as string;
};

beforeAll(async () => {
  await mongoose.connection.asPromise();
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('contact API security', () => {
  it('allows public contact submissions', async () => {
    const res = await request(app).post('/api/contact').send(contactPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.savedToDatabase).toBe(true);
  });

  it('blocks unauthenticated contact list access', async () => {
    await Contact.create(contactPayload);

    const res = await request(app).get('/api/contact');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('allows admins to list contacts', async () => {
    await Contact.create(contactPayload);
    const token = await createAdminToken();

    const res = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.contacts).toHaveLength(1);
  });
});
