const BASE: string = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

type Method = 'GET' | 'POST' | 'PUT';

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'employee' | 'supervisor' | 'admin';
  employeeId?: string;
  department?: string;
}

interface FetchResult<T> {
  res: Response;
  data: T & { message?: string };
}

const doFetch = async <T>(method: Method, path: string, body?: unknown): Promise<FetchResult<T>> => {
  const opts: RequestInit = {
    method,
    credentials: 'include', // send cookies
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // CSRF protection header required by the API
    }
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  return { res, data };
};

const request = async <T = Record<string, unknown>>(method: Method, path: string, body?: unknown): Promise<T> => {
  let { res, data } = await doFetch<T>(method, path, body);

  // Access token expired — silently refresh once, then retry
  if (res.status === 401 && path !== '/api/auth/refresh' && path !== '/api/auth/login') {
    const refreshed = await doFetch('POST', '/api/auth/refresh');
    if (refreshed.res.ok) {
      ({ res, data } = await doFetch<T>(method, path, body));
    }
  }

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  get: <T = Record<string, unknown>>(path: string) => request<T>('GET', path),
  post: <T = Record<string, unknown>>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T = Record<string, unknown>>(path: string, body?: unknown) => request<T>('PUT', path, body)
};
