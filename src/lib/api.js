const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? 'https://amateur-s-cantus-backend-1.onrender.com'
  : '';

import { getToken } from './auth';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

function toUrl(path) {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function apiFetch(path, options = {}) {
  const url = toUrl(path);

  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (ADMIN_KEY && !headers.has('x-admin-key')) {
    headers.set('x-admin-key', ADMIN_KEY);
  }
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = hasBody && typeof FormData !== 'undefined' && options.body instanceof FormData;

  let body = options.body;
  if (hasBody && !isFormData) {
    const isString = typeof body === 'string';
    const isSearchParams = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;
    const isBlob = typeof Blob !== 'undefined' && body instanceof Blob;
    const isArrayBuffer = typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer;
    if (!isString && !isSearchParams && !isBlob && !isArrayBuffer && typeof body === 'object') {
      body = JSON.stringify(body);
    }
  }

  if (!isFormData && hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
    body,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');

  if (!res.ok) {
    const message = (data && data.message) ? data.message : `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    err.retryAfter = res.headers.get('retry-after') || null;
    throw err;
  }

  return data;
}
