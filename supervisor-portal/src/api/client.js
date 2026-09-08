const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

const doFetch = async (method, path, body) => {
  const opts = {
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

const request = async (method, path, body) => {
  let { res, data } = await doFetch(method, path, body);

  // Access token expired — silently refresh once, then retry
  if (res.status === 401 && path !== '/api/auth/refresh' && path !== '/api/auth/login') {
    const refreshed = await doFetch('POST', '/api/auth/refresh');
    if (refreshed.res.ok) {
      ({ res, data } = await doFetch(method, path, body));
    }
  }

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body)
};
