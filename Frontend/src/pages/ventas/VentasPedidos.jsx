import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Visibility, Edit, Search, Clear } from '@mui/icons-material';
import Header from '../../components/Header';

// TODO: reemplazar con ventasService.getPedidos() y ventasService.getDetallePedido(id)
const MOCK_PEDIDOS = [
  { IdPedido: 1, NombreCliente: 'Ana García',     CorreoCliente: 'ana@mail.com',    FechaPedido: '2025-03-14', EstadoPedido: 'Pendiente',  Total: 350.00, CantidadItems: 3 },
  { IdPedido: 2, NombreCliente: 'Carlos López',   CorreoCliente: 'carlos@mail.com', FechaPedido: '2025-03-14', EstadoPedido: 'Procesando', Total: 120.50, CantidadItems: 1 },
  { IdPedido: 3, NombreCliente: 'María Pérez',    CorreoCliente: 'maria@mail.com',  FechaPedido: '2025-03-13', EstadoPedido: 'Enviado',    Total: 780.00, CantidadItems: 5 },
  { IdPedido: 4, NombreCliente: 'José Martínez',  CorreoCliente: 'jose@mail.com',   FechaPedido: '2025-03-13', EstadoPedido: 'Entregado',  Total: 95.00,  CantidadItems: 2 },
  { IdPedido: 5, NombreCliente: 'Laura Torres',   CorreoCliente: 'laura@mail.com',  FechaPedido: '2025-03-12', EstadoPedido: 'Cancelado',  Total: 210.00, CantidadItems: 4 },
  { IdPedido: 6, NombreCliente: 'Pedro Ramírez',  CorreoCliente: 'pedro@mail.com',  FechaPedido: '2025-03-11', EstadoPedido: 'Pendiente',  Total: 445.00, CantidadItems: 6 },
  { IdPedido: 7, NombreCliente: 'Sofia Mendoza',  CorreoCliente: 'sofia@mail.com',  FechaPedido: '2025-03-10', EstadoPedido: 'Entregado',  Total: 60.00,  CantidadItems: 1 },
];

const MOCK_DETALLES = {
  1: [
    { IdDetalle: 1, NombreProducto: 'Aceite de Oliva Orgánico', Cantidad: 2, PrecioUnitario: 120.00, Subtotal: 240.00 },
    { IdDetalle: 2, NombreProducto: 'Shampoo Natural',          Cantidad: 1, PrecioUnitario: 110.00, Subtotal: 110.00 },
  ],
  2: [
    { IdDetalle: 3, NombreProducto: 'Té Verde Orgánico',        Cantidad: 1, PrecioUnitario: 120.50, Subtotal: 120.50 },
  ],
  3: [
    { IdDetalle: 4, NombreProducto: 'Quinoa Premium',           Cantidad: 3, PrecioUnitario: 100.00, Subtotal: 300.00 },
    { IdDetalle: 5, NombreProducto: 'Jabón de Lavanda',         Cantidad: 2, PrecioUnitario: 80.00,  Subtotal: 160.00 },
    { IdDetalle: 6, NombreProducto: 'Almendras Orgánicas',      Cantidad: 1, PrecioUnitario: 320.00, Subtotal: 320.00 },
  ],
};

const STATUS_COLORS = {
  Pendiente:  'warning',
  Procesando: 'info',
  Enviado:    'primary',
  Entregado:  'success',
  Cancelado:  'error',
};

const ESTADOS = ['Todos', 'Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];

function VentasPedidos() {
  const [pedidos, setPedidos]           = useState(MOCK_PEDIDOS);
  const [search, setSearch]             = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [detailDialog, setDetailDialog] = useState({ open: false, pedido: null });
  const [estadoDialog, setEstadoDialog] = useState({ open: false, pedido: null, nuevoEstado: '' });

  // Filtros
  const filtered = pedidos.filter((p) => {
    const matchEstado = filtroEstado === 'Todos' || p.EstadoPedido === filtroEstado;
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      p.NombreCliente.toLowerCase().includes(q) ||
      String(p.IdPedido).includes(q) ||
      p.CorreoCliente.toLowerCase().includes(q);
    return matchEstado && matchSearch;
  });

  // Detalle dialog
  const handleVerDetalle = (pedido) => setDetailDialog({ open: true, pedido });
  const handleCloseDetalle = () => setDetailDialog({ open: false, pedido: null });

  // Estado dialog
  const handleAbrirEstado = (pedido) =>
    setEstadoDialog({ open: true, pedido, nuevoEstado: pedido.EstadoPedido });
  const handleCambiarEstado = () => {
    // TODO: llamar ventasService.updateEstado(estadoDialog.pedido.IdPedido, estadoDialog.nuevoEstado)
    setPedidos((prev) =>
      prev.map((p) =>
        p.IdPedido === estadoDialog.pedido.IdPedido
          ? { ...p, EstadoPedido: estadoDialog.nuevoEstado }
          : p
      )
    );
    setEstadoDialog({ open: false, pedido: null, nuevoEstado: '' });
  };

  const detalles = detailDialog.pedido ? (MOCK_DETALLES[detailDialog.pedido.IdPedido] ?? []) : [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="success.dark" sx={{ mb: 1 }}>
          Gestión de Pedidos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {filtered.length} de {pedidos.length} pedidos
        </Typography>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <TextField
            size="small"
            placeholder="Buscar por cliente, correo o # pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
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
                  <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.IdPedido} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>#{p.IdPedido}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{p.NombreCliente}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.CorreoCliente}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(p.FechaPedido).toLocaleDateString('es-HN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.EstadoPedido}
                        color={STATUS_COLORS[p.EstadoPedido] ?? 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color="success.dark">
                        L.{p.Total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{p.CantidadItems}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        title="Ver detalle"
                        onClick={() => handleVerDetalle(p)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        title="Cambiar estado"
                        onClick={() => handleAbrirEstado(p)}
                        disabled={p.EstadoPedido === 'Cancelado' || p.EstadoPedido === 'Entregado'}
                      >
                        <Edit fontSize="small" />
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
      </Box>

      {/* Dialog: Detalle del pedido */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetalle}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={600}>
          Detalle del Pedido #{detailDialog.pedido?.IdPedido} — {detailDialog.pedido?.NombreCliente}
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
                {detalles.map((d) => (
                  <TableRow key={d.IdDetalle} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>{d.NombreProducto}</TableCell>
                    <TableCell align="center">{d.Cantidad}</TableCell>
                    <TableCell align="right">L.{d.PrecioUnitario.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color="success.dark">
                        L.{d.Subtotal.toFixed(2)}
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
          <Button onClick={handleCloseDetalle} variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Cambiar estado */}
      <Dialog
        open={estadoDialog.open}
        onClose={() => setEstadoDialog({ open: false, pedido: null, nuevoEstado: '' })}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={600}>
          Cambiar Estado — Pedido #{estadoDialog.pedido?.IdPedido}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Nuevo Estado</InputLabel>
            <Select
              label="Nuevo Estado"
              value={estadoDialog.nuevoEstado}
              onChange={(e) => setEstadoDialog((prev) => ({ ...prev, nuevoEstado: e.target.value }))}
            >
              {['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEstadoDialog({ open: false, pedido: null, nuevoEstado: '' })}>
            Cancelar
          </Button>
          <Button onClick={handleCambiarEstado} variant="contained" color="success">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VentasPedidos;
