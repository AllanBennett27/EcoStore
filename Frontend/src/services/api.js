import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5263',
});

export const productosService = {
  getAll: () => api.get('/api/productos'),
};

export const authService = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/registrar', data),
};

export default api;
