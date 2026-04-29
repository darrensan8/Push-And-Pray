import type { AuthResponse, EventItem, StatsResponse } from '../types/api';

const API_BASE_URL = 'https://push-and-pray-production.up.railway.app';
const TOKEN_KEY = 'pushandpray_jwt';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

const authHeaders = () => {
  const token = tokenStore.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ensureSuccess = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json() as Promise<T>;
};

export const api = {
  register: (data: { username: string; email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((res) => ensureSuccess<{ message: string }>(res)),

  login: async (data: { username: string; password: string }) => {
    const form = new URLSearchParams();
    form.set('username', data.username);
    form.set('password', data.password);

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });

    return ensureSuccess<AuthResponse>(res);
  },

  getEvents: () =>
    fetch(`${API_BASE_URL}/events/`, {
      headers: { ...authHeaders() }
    }).then((res) => ensureSuccess<EventItem[]>(res)),

  createEvent: (data: { event_type: string; repository: string; payload: string }) =>
    fetch(`${API_BASE_URL}/events/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data)
    }).then((res) => ensureSuccess<EventItem>(res)),

  getStats: () =>
    fetch(`${API_BASE_URL}/stats/`, {
      headers: { ...authHeaders() }
    }).then((res) => ensureSuccess<StatsResponse>(res))
};
