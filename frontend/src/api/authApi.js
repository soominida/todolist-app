import { httpClient } from '@/lib/httpClient';

export async function register(email, password) {
  const res = await httpClient.post('/auth/register', { email, password });
  return res.data ?? res;
}

export async function login(email, password) {
  const res = await httpClient.post('/auth/login', { email, password });
  return res.data ?? res;
}

export async function getMe() {
  const res = await httpClient.get('/auth/me');
  return res.data ?? res;
}
