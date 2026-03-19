import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const api = setupCache(axios.create({ baseURL: '' }), {
  ttl: 2 * 60 * 1000, // 2 minutos de caché para GETs
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
  getAll:    ()  => api.get('/api/productos',          { cache: false }),
  getActive: ()  => api.get('/api/productos/activos',  { cache: false }),
  getById:   (id) => api.get(`/api/productos/${id}`,   { cache: false }),
  create: (data) => api.post('/api/productos', data),
  update: (id, data) => api.put(`/api/productos/${id}`, data),
  hide: (id) => api.patch(`/api/productos/${id}/ocultar`),
  activate: (id) => api.patch(`/api/productos/${id}/activar`),
};

export const categoriasService = {
  getAll:  ()     => api.get('/api/categorias'),
  create:  (data) => api.post('/api/categorias', data),
};

export const authService = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/registrar', data),
};

export const usuariosService = {
  getAll:        ()                 => api.get('/api/usuarios', { cache: false }),
  updateRole:    (idUsuario, idRol) => api.patch('/api/usuarios/role', { idUsuario, idRol }),
  create:        (data)             => api.post('/api/usuarios', data),
  toggleEstado:  (id)               => api.patch(`/api/usuarios/${id}/estado`),
};

export const carritoService = {
  get:     ()                          => api.get('/api/carrito', { cache: false }),
  agregar: (productoId, cantidad, precio) =>
    api.post('/api/carrito/agregar', { productoId, cantidad, precio }),
  eliminar: (productoId) =>
    api.delete(`/api/carrito/eliminar/${productoId}`),
};

export const viewsService = {
  getVentasPorProducto: () => api.get('/api/views/ventas-por-producto'),
  getVentasPorUsuario:  () => api.get('/api/views/ventas-por-usuario'),
  getStockBajo:         () => api.get('/api/views/stock-bajo'),
  getDetallePedidos:    () => api.get('/api/views/detalle-pedidos'),
  getDetallePedido:     (id) => api.get(`/api/views/detalle-pedidos/${id}`),
  getFacturacion:       () => api.get('/api/views/facturacion'),
  getCarritosActivos:   () => api.get('/api/views/carritos-activos'),
  getVentasPorFecha:    () => api.get('/api/views/ventas-por-fecha'),
};

export const favoritosService = {
  getAll:  ()           => api.get('/api/favoritos'),
  add:     (idProducto) => api.post('/api/favoritos', { idProducto }),
  remove:  (idProducto) => api.delete(`/api/favoritos/${idProducto}`),
};

export const inventarioService = {
  getAll:        ()   => api.get('/api/inventario'),
  getByProducto: (id) => api.get(`/api/inventario/${id}`),
};

export const ventasService = {
  getPedidos:       ()              => api.get('/api/ventas/pedidos'),
  getDetallePedido: (id)            => api.get(`/api/ventas/pedidos/${id}/detalle`),
  getStock:         ()              => api.get('/api/ventas/stock'),
  updateEstado:     (id, estado)    => api.put(`/api/ventas/pedidos/${id}/estado`, { nuevoEstado: estado }),
};

export const checkoutService = {
  confirmar: (idDireccion, idMetodo) =>
    api.post('/api/checkout/confirmar', { idDireccion, idMetodo }),
};

export const direccionService = {
  getAll:       ()         => api.get('/api/direcciones', { cache: false }),
  create:       (data)     => api.post('/api/direcciones', data),
  update:       (id, data) => api.put(`/api/direcciones/${id}`, data),
  delete:       (id)       => api.delete(`/api/direcciones/${id}`),
  setPrincipal: (id)       => api.patch(`/api/direcciones/${id}/principal`),
};

export const metodoPagoService = {
  getAll:       ()     => api.get('/api/metodos-pago', { cache: false }),
  create:       (data) => api.post('/api/metodos-pago', data),
  delete:       (id)   => api.delete(`/api/metodos-pago/${id}`),
  setPrincipal: (id)   => api.patch(`/api/metodos-pago/${id}/principal`),
};

export const finanzasService = {
  getFacturas:     ()  => api.get('/api/finanzas/facturas'),
  getFacturaById:  (id) => api.get(`/api/finanzas/facturas/${id}`),
  getIngresosMes:  ()  => api.get('/api/finanzas/ingresos/mes'),
  getTopProductos: ()  => api.get('/api/finanzas/productos/top'),
};

export default api;
