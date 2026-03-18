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

export const carritoService = {
  agregar: (productoId, cantidad, precio) =>
    api.post('/api/carrito/agregar', { productoId, cantidad, precio }),
  eliminar: (productoId) =>
    api.delete(`/api/carrito/eliminar/${productoId}`),
};

export const ventasService = {
  getPedidos:       ()              => api.get('/api/ventas/pedidos'),
  getDetallePedido: (id)            => api.get(`/api/ventas/pedidos/${id}/detalle`),
  getStock:         ()              => api.get('/api/ventas/stock'),
  updateEstado:     (id, estado)    => api.put(`/api/ventas/pedidos/${id}/estado`, { nuevoEstado: estado }),
};

export const finanzasService = {
  getFacturas:     ()  => api.get('/api/finanzas/facturas'),
  getFacturaById:  (id) => api.get(`/api/finanzas/facturas/${id}`),
  getIngresosMes:  ()  => api.get('/api/finanzas/ingresos/mes'),
  getTopProductos: ()  => api.get('/api/finanzas/productos/top'),
};

export default api;
