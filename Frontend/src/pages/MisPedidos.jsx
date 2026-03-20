import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Chip, CircularProgress, Alert, Divider,
  Accordion, AccordionSummary, AccordionDetails, Table,
  TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, Button, Snackbar,
} from '@mui/material';
import {
  ExpandMore, ShoppingBag, ArrowBack, Receipt,
  CheckCircle, LocalShipping, Pending, Loop, Cancel,
} from '@mui/icons-material';
import * as signalR from '@microsoft/signalr';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { viewsService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ESTADO_CONFIG = {
  Confirmado: { color: 'warning', icon: <Pending        sx={{ fontSize: 16 }} /> },
  Procesando: { color: 'info',    icon: <Loop           sx={{ fontSize: 16 }} /> },
  Enviado:    { color: 'primary', icon: <LocalShipping  sx={{ fontSize: 16 }} /> },
  Entregado:  { color: 'success', icon: <CheckCircle   sx={{ fontSize: 16 }} /> },
  Cancelado:  { color: 'error',   icon: <Cancel         sx={{ fontSize: 16 }} /> },
};

function EstadoChip({ estado }) {
  const cfg = ESTADO_CONFIG[estado] ?? { color: 'default', icon: null };
  return (
    <Chip
      label={estado}
      color={cfg.color}
      size="small"
      icon={cfg.icon}
      sx={{ fontWeight: 600 }}
    />
  );
}

function MisPedidos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [toast, setToast]       = useState(null); // { idPedido, nuevoEstado }
  const connRef                 = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }

    viewsService.getDetallePedidos()
      .then((res) => {
        const rows = res.data ?? [];

        // Filtrar solo los pedidos del usuario actual
        const mios = rows.filter((r) => r.cliente === user.name);

        // Agrupar por idPedido
        const mapa = {};
        mios.forEach((r) => {
          if (!mapa[r.idPedido]) {
            mapa[r.idPedido] = {
              idPedido:     r.idPedido,
              fechaPedido:  r.fechaPedido,
              estadoPedido: r.estadoPedido,
              items: [],
              total: 0,
            };
          }
          mapa[r.idPedido].items.push({
            nombre:        r.nombreProducto,
            cantidad:      r.cantidad,
            precioUnitario: r.precioUnitario,
            subtotal:      r.subtotal,
          });
          mapa[r.idPedido].total += Number(r.subtotal);
        });

        // Ordenar más reciente primero
        const lista = Object.values(mapa).sort(
          (a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido)
        );
        setPedidos(lista);
      })
      .catch(() => setError('No se pudo cargar el historial de pedidos.'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  // ── SignalR: escuchar cambios de estado en tiempo real
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/cartHub', token ? { accessTokenFactory: () => token } : {})
      .withAutomaticReconnect()
      .build();

    connection.on('EstadoPedidoActualizado', ({ idPedido, nuevoEstado }) => {
      setPedidos((prev) =>
        prev.map((p) =>
          p.idPedido === idPedido ? { ...p, estadoPedido: nuevoEstado } : p
        )
      );
      // Solo mostrar toast si el pedido pertenece al usuario
      setPedidos((prev) => {
        const esMio = prev.some((p) => p.idPedido === idPedido);
        if (esMio) setToast({ idPedido, nuevoEstado });
        return prev;
      });
    });

    connection.start().catch(() => {/* sin conexión SignalR — silencioso */});
    connRef.current = connection;

    return () => { connection.stop(); };
  }, [user]);

  // ── Estadísticas rápidas
  const totalGastado  = pedidos.reduce((s, p) => s + p.total, 0);
  const entregados    = pedidos.filter((p) => p.estadoPedido === 'Entregado').length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box sx={{ flex: 1, maxWidth: 900, mx: 'auto', width: '100%', p: 3 }}>

        <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
          Seguir comprando
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Receipt sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            Mis Pedidos
          </Typography>
        </Box>

        {/* Estadísticas rápidas */}
        {!loading && pedidos.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            {[
              { label: 'Total de pedidos', value: pedidos.length },
              { label: 'Entregados',        value: entregados },
              { label: 'Total gastado',     value: `L.${totalGastado.toFixed(2)}` },
            ].map(({ label, value }) => (
              <Box
                key={label}
                sx={{
                  flex: 1, minWidth: 140, p: 2, borderRadius: 3,
                  bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" fontWeight={800} color="primary.dark">{value}</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && pedidos.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ShoppingBag sx={{ fontSize: 72, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no tienes pedidos
            </Typography>
            <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 1, borderRadius: 3 }}>
              Ver productos
            </Button>
          </Box>
        )}

        {/* Lista de pedidos */}
        {pedidos.map((pedido) => (
          <Accordion
            key={pedido.idPedido}
            elevation={2}
            sx={{ mb: 2, borderRadius: '12px !important', '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3, py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, flexWrap: 'wrap' }}>
                {/* Número de pedido */}
                <Box>
                  <Typography variant="caption" color="text.secondary">Pedido</Typography>
                  <Typography fontWeight={700} color="primary.dark">#{pedido.idPedido}</Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                {/* Fecha */}
                <Box>
                  <Typography variant="caption" color="text.secondary">Fecha</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Date(pedido.fechaPedido).toLocaleDateString('es-HN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                {/* Productos */}
                <Box>
                  <Typography variant="caption" color="text.secondary">Productos</Typography>
                  <Typography variant="body2" fontWeight={500}>{pedido.items.length} artículo(s)</Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                {/* Total */}
                <Box>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="body2" fontWeight={700} color="primary.dark">
                    L.{pedido.total.toFixed(2)}
                  </Typography>
                </Box>

                {/* Estado — separado a la derecha */}
                <Box sx={{ ml: 'auto', mr: 1 }}>
                  <EstadoChip estado={pedido.estadoPedido} />
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#fafafa', borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                      <TableCell align="right"  sx={{ fontWeight: 700 }}>Precio unitario</TableCell>
                      <TableCell align="right"  sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedido.items.map((item, i) => (
                      <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell align="center">{item.cantidad}</TableCell>
                        <TableCell align="right">L.{Number(item.precioUnitario).toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                          L.{Number(item.subtotal).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Fila de total */}
                    <TableRow sx={{ bgcolor: '#f1f8e9' }}>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 700 }}>Total del pedido</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.dark', fontSize: '1rem' }}>
                        L.{pedido.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Footer />

      {/* Notificación en tiempo real */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={6000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity="info"
          variant="filled"
          sx={{ width: '100%', fontWeight: 600 }}
        >
          Estado de Pedido #{toast?.idPedido} actualizado a{' '}
          <strong>{toast?.nuevoEstado}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MisPedidos;
