import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(email, password) {
  try {
    const res = await api.post('/login', { email, password });
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
}

export default api;