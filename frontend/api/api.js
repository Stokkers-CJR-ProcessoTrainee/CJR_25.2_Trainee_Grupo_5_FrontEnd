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

export async function register(nome, username, email, password, password_confirm) {
  const res = await api.post('/register');
  return res.data;
}