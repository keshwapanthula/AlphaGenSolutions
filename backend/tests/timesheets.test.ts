import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../app.js';
import User from '../models/User.js';

let supervisorToken;
let employeeToken;
let outsiderToken;

const register = async (overrides) => {
  const res = await request(app).post('/api/auth/register').send({
    firstName: 'Test',
    lastName: 'User',
    password: 'Password1',
    department: 'Engineering',
    ...overrides
  });
  return res.body;
};

const weekOf = '2026-09-07'; // a Monday
const validEntries = [
  { date: '2026-09-07', taskDescription: 'Feature work', hoursWorked: 8 },
  { date: '2026-09-08', taskDescription: 'Code review', hoursWorked: 6.5 }
];

const createDraft = () =>
  request(app)
    .post('/api/timesheets')
    .set('Authorization', `Bearer ${employeeToken}`)
    .send({ weekOf, entries: validEntries });

beforeAll(async () => {
  // app.js kicks off connectDB() on import; wait until the connection is live
  await mongoose.connection.asPromise();
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();

  const supervisor = await register({ email: 'sup@example.com', role: 'supervisor' });
  const employee = await register({ email: 'emp@example.com' });
  const outsider = await register({ email: 'other@example.com' });

  supervisorToken = supervisor.token;
  employeeToken = employee.token;
  outsiderToken = outsider.token;

  // wire employee to supervisor
  await User.findByIdAndUpdate(employee.user.id, { supervisorId: supervisor.user.id });
});

describe('timesheet lifecycle', () => {
  it('requires authentication', async () => {
    const res = await request(app).get('/api/timesheets');
    expect(res.status).toBe(401);
  });

  it('employee creates a draft timesheet', async () => {
    const res = await createDraft();

    expect(res.status).toBe(201);
    expect(res.body.timesheet.status).toBe('draft');
    expect(res.body.timesheet.entries).toHaveLength(2);
  });

  it('rejects a second timesheet for the same week', async () => {
    await createDraft();
    const res = await createDraft();

    expect(res.status).toBe(409);
  });

  it('rejects creation without a supervisor assigned', async () => {
    const res = await request(app)
      .post('/api/timesheets')
      .set('Authorization', `Bearer ${outsiderToken}`)
      .send({ weekOf, entries: validEntries });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/supervisor/i);
  });

  it('rejects invalid hours', async () => {
    const res = await request(app)
      .post('/api/timesheets')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ weekOf, entries: [{ date: weekOf, taskDescription: 'x', hoursWorked: 30 }] });

    expect(res.status).toBe(400);
  });

  it('full flow: draft → submit → approve', async () => {
    const draft = await createDraft();
    const id = draft.body.timesheet._id;

    const submit = await request(app)
      .post(`/api/timesheets/${id}/submit`)
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(submit.status).toBe(200);
    expect(submit.body.timesheet.status).toBe('submitted');

    const approve = await request(app)
      .post(`/api/timesheets/${id}/approve`)
      .set('Authorization', `Bearer ${supervisorToken}`)
      .send({ supervisorNotes: 'Looks good' });
    expect(approve.status).toBe(200);
    expect(approve.body.timesheet.status).toBe('approved');
  });

  it('rejection requires a reason', async () => {
    const draft = await createDraft();
    const id = draft.body.timesheet._id;
    await request(app).post(`/api/timesheets/${id}/submit`).set('Authorization', `Bearer ${employeeToken}`);

    const noReason = await request(app)
      .post(`/api/timesheets/${id}/reject`)
      .set('Authorization', `Bearer ${supervisorToken}`)
      .send({});
    expect(noReason.status).toBe(400);

    const rejected = await request(app)
      .post(`/api/timesheets/${id}/reject`)
      .set('Authorization', `Bearer ${supervisorToken}`)
      .send({ supervisorNotes: 'Missing Friday hours' });
    expect(rejected.status).toBe(200);
    expect(rejected.body.timesheet.status).toBe('rejected');
  });

  it('cannot approve a draft that was never submitted', async () => {
    const draft = await createDraft();
    const id = draft.body.timesheet._id;

    const res = await request(app)
      .post(`/api/timesheets/${id}/approve`)
      .set('Authorization', `Bearer ${supervisorToken}`);

    expect(res.status).toBe(400);
  });

  it('cannot edit a submitted timesheet', async () => {
    const draft = await createDraft();
    const id = draft.body.timesheet._id;
    await request(app).post(`/api/timesheets/${id}/submit`).set('Authorization', `Bearer ${employeeToken}`);

    const res = await request(app)
      .put(`/api/timesheets/${id}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ entries: validEntries });

    expect(res.status).toBe(400);
  });
});

describe('timesheet RBAC', () => {
  it('employees cannot approve timesheets', async () => {
    const draft = await createDraft();
    const id = draft.body.timesheet._id;
    await request(app).post(`/api/timesheets/${id}/submit`).set('Authorization', `Bearer ${employeeToken}`);

    const res = await request(app)
      .post(`/api/timesheets/${id}/approve`)
      .set('Authorization', `Bearer ${employeeToken}`);

    expect(res.status).toBe(403);
  });

  it('supervisors cannot create timesheets', async () => {
    const res = await request(app)
      .post('/api/timesheets')
      .set('Authorization', `Bearer ${supervisorToken}`)
      .send({ weekOf, entries: validEntries });

    expect(res.status).toBe(403);
  });

  it('an unrelated user cannot read someone else\'s timesheet', async () => {
    const draft = await createDraft();
    const id = draft.body.timesheet._id;

    const res = await request(app)
      .get(`/api/timesheets/${id}`)
      .set('Authorization', `Bearer ${outsiderToken}`);

    expect(res.status).toBe(403);
  });

  it('employee list only contains their own timesheets', async () => {
    await createDraft();

    const res = await request(app)
      .get('/api/timesheets')
      .set('Authorization', `Bearer ${outsiderToken}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});
