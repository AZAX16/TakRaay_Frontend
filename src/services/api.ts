import axios from 'axios';

const api = axios.create({
  baseURL: 'https://karboard.chbkn.run/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن token به هر request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

export default api;
