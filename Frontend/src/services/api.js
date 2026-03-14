import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productosService = {
  getAll: () => api.get('/api/productos'),
};

export const categoriasService = {
  getAll: () => api.get('/api/categorias'),
};

export const authService = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/registrar', data),
};

export default api;
