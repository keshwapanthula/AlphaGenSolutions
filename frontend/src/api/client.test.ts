import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from './client';

const jsonResponse = (status: number, body: Record<string, unknown> = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body)
});

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api client', () => {
  it('sends credentials and the CSRF header on every request', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(200, { success: true }));

    await api.get('/api/auth/me');

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.credentials).toBe('include');
    expect(opts.headers['X-Requested-With']).toBe('XMLHttpRequest');
    expect(opts.headers['Content-Type']).toBe('application/json');
  });

  it('serializes the body for POST requests', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(200, { success: true }));

    await api.post('/api/auth/login', { email: 'a@b.com', password: 'x' });

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ email: 'a@b.com', password: 'x' });
  });

  it('silently refreshes once on 401 and retries the original request', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(401, { message: 'Not authenticated' })) // original
      .mockResolvedValueOnce(jsonResponse(200, { success: true })) // refresh
      .mockResolvedValueOnce(jsonResponse(200, { timesheets: [] })); // retry

    const data = await api.get('/api/timesheets');

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch.mock.calls[1][0]).toContain('/api/auth/refresh');
    expect(data).toEqual({ timesheets: [] });
  });

  it('throws the API message when refresh also fails', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(401, { message: 'Not authenticated' }))
      .mockResolvedValueOnce(jsonResponse(401, { message: 'No refresh token' }));

    await expect(api.get('/api/timesheets')).rejects.toThrow('Not authenticated');
    expect(mockFetch).toHaveBeenCalledTimes(2); // no retry when refresh fails
  });

  it('does not attempt a refresh for failed logins', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(401, { message: 'Invalid email or password' }));

    await expect(api.post('/api/auth/login', { email: 'a@b.com', password: 'bad' }))
      .rejects.toThrow('Invalid email or password');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('throws a generic error when the response has no message', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.reject(new Error('no body')) });

    await expect(api.get('/api/health')).rejects.toThrow('Request failed');
  });
});
