import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../app.js';

const validUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test.user@example.com',
  password: 'Password1',
  department: 'Engineering'
};

beforeAll(async () => {
  // app.js kicks off connectDB() on import; wait until the connection is live
  await mongoose.connection.asPromise();
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('POST /api/auth/register', () => {
  it('creates an account and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
    expect(res.body.user.role).toBe('employee');
    expect(res.body.user.password).toBeUndefined();
    expect(res.headers['set-cookie']?.[0]).toMatch(/token=/);
  });

  it('rejects duplicate emails with 409', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects weak passwords with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: 'weakpass' });

    expect(res.status).toBe(400);
  });

  it('never grants the admin role on self-registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('employee');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']?.[0]).toMatch(/token=/);
  });

  it('rejects a wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'WrongPass1' });

    expect(res.status).toBe(401);
  });

  it('rejects an unknown email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password1' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user with a Bearer token', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(validUser.email);
  });

  it('returns the current user with the auth cookie', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const cookie = reg.headers['set-cookie'];
    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(validUser.email);
  });

  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/refresh', () => {
  const getCookie = (res, name) =>
    res.headers['set-cookie']?.find((c) => c.startsWith(`${name}=`));

  it('issues a new access token from a valid refresh cookie', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const refreshCookie = getCookie(reg, 'refreshToken');
    expect(refreshCookie).toBeDefined();

    const res = await request(app).post('/api/auth/refresh').set('Cookie', refreshCookie);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(getCookie(res, 'token')).toBeDefined();
    expect(getCookie(res, 'refreshToken')).toBeDefined(); // rotated
  });

  it('rejects refresh without a cookie', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });

  it('rejects an access token used as refresh token', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `refreshToken=${reg.body.token}`);

    expect(res.status).toBe(401);
  });
});

describe('CSRF protection', () => {
  it('blocks cookie-authenticated state-changing requests without the CSRF header', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const tokenCookie = reg.headers['set-cookie'].find((c) => c.startsWith('token='));

    const res = await request(app)
      .post('/api/timesheets')
      .set('Cookie', tokenCookie)
      .send({ weekOf: '2026-09-07', entries: [] });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/csrf/i);
  });

  it('allows the same request when the CSRF header is present', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const tokenCookie = reg.headers['set-cookie'].find((c) => c.startsWith('token='));

    const res = await request(app)
      .post('/api/timesheets')
      .set('Cookie', tokenCookie)
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ weekOf: '2026-09-07', entries: [] });

    expect(res.status).not.toBe(403); // fails validation (400), not CSRF
  });

  it('does not require the header for Bearer-token requests', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);

    const res = await request(app)
      .post('/api/timesheets')
      .set('Authorization', `Bearer ${reg.body.token}`)
      .send({ weekOf: '2026-09-07', entries: [] });

    expect(res.status).not.toBe(403);
  });
});

describe('password reset flow', () => {
  it('returns a generic response for unknown emails (no enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.resetToken).toBeUndefined();
  });

  it('resets the password with a valid token and revokes refresh tokens', async () => {
    const reg = await request(app).post('/api/auth/register').send(validUser);
    const refreshCookie = reg.headers['set-cookie'].find((c) => c.startsWith('refreshToken='));

    const forgot = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: validUser.email });
    expect(forgot.body.resetToken).toBeDefined(); // exposed in test env only

    const reset = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: forgot.body.resetToken, password: 'NewPassword2' });
    expect(reset.status).toBe(200);

    // old password no longer works, new one does
    const oldLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'NewPassword2' });
    expect(newLogin.status).toBe(200);

    // pre-reset refresh token is revoked (tokenVersion bumped)
    const refresh = await request(app).post('/api/auth/refresh').set('Cookie', refreshCookie);
    expect(refresh.status).toBe(401);
  });

  it('rejects an invalid reset token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'bogus-token', password: 'NewPassword2' });

    expect(res.status).toBe(400);
  });

  it('used tokens cannot be reused', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const forgot = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: validUser.email });

    await request(app)
      .post('/api/auth/reset-password')
      .send({ token: forgot.body.resetToken, password: 'NewPassword2' });

    const reuse = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: forgot.body.resetToken, password: 'NewPassword3' });

    expect(reuse.status).toBe(400);
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the auth cookie', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']?.[0]).toMatch(/token=;/);
  });
});
