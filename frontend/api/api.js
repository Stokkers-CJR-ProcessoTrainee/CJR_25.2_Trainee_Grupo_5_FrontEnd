import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(email, password) {
  const res = await api.post('/login', { email, password });
  return res.data;
}

export async function register(name, username, email, password_hash) {
  const res = await api.post('user/register', {name, username, email, password_hash});
  return res.data;
}

export async function forgotPassword(email) {
  const res = await api.post('/login/forgot', { email });
  return res.data;
}

export async function verifyCode(email, code) {
  const res = await api.post('/login/verify', { email, code });
  return res.data;
}

export async function resetPassword(userId, newPassword) {
  const res = await api.post('/login/reset', { userId, newPassword });
  return res.data;
}

export async function updateData(id, data) {
  const res = await api.post('/user/update', {id, data})
  return res.data;
}