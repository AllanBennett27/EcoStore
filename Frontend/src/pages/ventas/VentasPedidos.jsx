import { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, InputAdornment, CircularProgress, Alert,
} from '@mui/material';
import { Visibility, Search, Clear } from '@mui/icons-material';
import Header from '../../components/Header';
import { viewsService } from '../../services/api';

const STATUS_COLORS = {
  Pendiente:  'warning',
  Procesando: 'info',
  Enviado:    'primary',
  Entregado:  'success',
  Cancelado:  'error',
};

const ESTADOS = ['Todos', 'Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];

// Agrupa líneas de detalle en resumen por pedido
function agruparPedidos(lineas) {
  const map = {};
  lineas.forEach((l) => {
    if (!map[l.idPedido]) {
      map[l.idPedido] = {
        idPedido:    l.idPedido,
        cliente:     l.cliente,
        fechaPedido: l.fechaPedido,
        estadoPedido: l.estadoPedido,
        total:       0,
        totalItems:  0,
      };
    }
    map[l.idPedido].total      += l.subtotal;
    map[l.idPedido].totalItems += l.cantidad;
  });
  return Object.values(map).sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
}

function VentasPedidos() {
  const [lineas, setLineas]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error,   setError]             = useState(null);
  const [search,  setSearch]            = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [detallePedido, setDetallePedido] = useState(null); // idPedido seleccionado

  useEffect(() => {
    viewsService.getDetallePedidos()
      .then((res) => setLineas(res.data))
      .catch(() => setError('No se pudieron cargar los pedidos.'))
      .finally(() => setLoading(false));
  }, []);

  const pedidos = useMemo(() => agruparPedidos(lineas), [lineas]);

  const filtered = pedidos.filter((p) => {
    const matchEstado = filtroEstado === 'Todos' || p.estadoPedido === filtroEstado;
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      p.cliente.toLowerCase().includes(q) ||
      String(p.idPedido).includes(q);
    return matchEstado && matchSearch;
  });

  // Líneas del pedido seleccionado para el dialog
  const detalles = detallePedido
    ? lineas.filter((l) => l.idPedido === detallePedido.idPedido)
    : [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="success.dark" sx={{ mb: 1 }}>
          Gestión de Pedidos
        </Typography>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
        {error   && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filtered.length} de {pedidos.length} pedidos
            </Typography>

            {/* Filtros */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <TextField
                size="small"
                placeholder="Buscar por cliente o # pedido..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 300 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: search && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearch('')}>
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {ESTADOS.map((estado) => (
                  <Chip
                    key={estado}
                    label={estado}
                    clickable
                    color={filtroEstado === estado ? (STATUS_COLORS[estado] ?? 'primary') : 'default'}
                    variant={filtroEstado === estado ? 'filled' : 'outlined'}
                    onClick={() => setFiltroEstado(estado)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Tabla */}
            <Card elevation={2}>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}># Pedido</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Items</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Detalle</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.idPedido} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>#{p.idPedido}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{p.cliente}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(p.fechaPedido).toLocaleDateString('es-HN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.estadoPedido}
                            color={STATUS_COLORS[p.estadoPedido] ?? 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="success.dark">
                            L.{p.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{p.totalItems}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary"
                            onClick={() => setDetallePedido(p)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No se encontraron pedidos.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </>
        )}
      </Box>

      {/* Dialog: Detalle del pedido */}
      <Dialog open={Boolean(detallePedido)} onClose={() => setDetallePedido(null)}
        maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle fontWeight={600}>
          Detalle del Pedido #{detallePedido?.idPedido} — {detallePedido?.cliente}
        </DialogTitle>
        <DialogContent dividers>
          {detalles.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Cant.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Precio Unit.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detalles.map((d, i) => (
                  <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>{d.nombreProducto}</TableCell>
                    <TableCell align="center">{d.cantidad}</TableCell>
                    <TableCell align="right">L.{d.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color="success.dark">
                        L.{d.subtotal.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              Sin detalles disponibles para este pedido.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDetallePedido(null)} variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VentasPedidos;
