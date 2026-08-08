const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

const request = async (method, path, body) => {
  const opts = {
    method,
    credentials: 'include', // send cookies
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body)
};
