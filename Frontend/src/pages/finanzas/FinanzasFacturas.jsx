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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Visibility, Search, Clear, FilterAlt } from '@mui/icons-material';
import Header from '../../components/Header';

// TODO: reemplazar con finanzasService.getFacturas()
const MOCK_FACTURAS = [
  { IdFactura: 1,  IdPedido: 1,  NombreCliente: 'Ana García',     FechaFactura: '2025-03-14', Subtotal: 304.35, Impuesto: 45.65,  Total: 350.00 },
  { IdFactura: 2,  IdPedido: 3,  NombreCliente: 'María Pérez',    FechaFactura: '2025-03-13', Subtotal: 678.26, Impuesto: 101.74, Total: 780.00 },
  { IdFactura: 3,  IdPedido: 4,  NombreCliente: 'José Martínez',  FechaFactura: '2025-03-13', Subtotal: 82.61,  Impuesto: 12.39,  Total: 95.00  },
  { IdFactura: 4,  IdPedido: 7,  NombreCliente: 'Sofia Mendoza',  FechaFactura: '2025-03-10', Subtotal: 52.17,  Impuesto: 7.83,   Total: 60.00  },
  { IdFactura: 5,  IdPedido: 8,  NombreCliente: 'Luis Castillo',  FechaFactura: '2025-02-28', Subtotal: 260.87, Impuesto: 39.13,  Total: 300.00 },
  { IdFactura: 6,  IdPedido: 9,  NombreCliente: 'Elena Vásquez',  FechaFactura: '2025-02-20', Subtotal: 130.43, Impuesto: 19.57,  Total: 150.00 },
  { IdFactura: 7,  IdPedido: 10, NombreCliente: 'Roberto Flores', FechaFactura: '2025-02-10', Subtotal: 434.78, Impuesto: 65.22,  Total: 500.00 },
];

function FinanzasFacturas() {
  const [search, setSearch]         = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [detalle, setDetalle]       = useState(null);

  // Filtro combinado (client-side)
  const filtered = MOCK_FACTURAS.filter((f) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      f.NombreCliente.toLowerCase().includes(q) ||
      String(f.IdFactura).includes(q) ||
      String(f.IdPedido).includes(q);

    const fecha = new Date(f.FechaFactura);
    const matchDesde = !fechaDesde || fecha >= new Date(fechaDesde);
    const matchHasta = !fechaHasta || fecha <= new Date(fechaHasta);

    return matchSearch && matchDesde && matchHasta;
  });

  const totalFiltrado = filtered.reduce((sum, f) => sum + f.Total, 0);

  const limpiarFiltros = () => {
    setSearch('');
    setFechaDesde('');
    setFechaHasta('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="warning.dark" sx={{ mb: 1 }}>
          Facturas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {filtered.length} de {MOCK_FACTURAS.length} facturas — Total filtrado: L.{totalFiltrado.toFixed(2)}
        </Typography>

        {/* Filtros */}
        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FilterAlt fontSize="small" color="action" />
              <TextField
                size="small"
                label="Buscar cliente, # factura o # pedido"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 260 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                size="small"
                label="Desde"
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 160 }}
              />
              <TextField
                size="small"
                label="Hasta"
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 160 }}
              />
              {(search || fechaDesde || fechaHasta) && (
                <IconButton size="small" onClick={limpiarFiltros} title="Limpiar filtros">
                  <Clear fontSize="small" />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card elevation={2}>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}># Factura</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}># Pedido</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Subtotal</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Impuesto (ISV)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Detalle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((f) => (
                  <TableRow key={f.IdFactura} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>#{f.IdFactura}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">#{f.IdPedido}</Typography>
                    </TableCell>
                    <TableCell>{f.NombreCliente}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(f.FechaFactura).toLocaleDateString('es-HN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">L.{f.Subtotal.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary' }}>
                      L.{f.Impuesto.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={700} color="warning.dark">
                        L.{f.Total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => setDetalle(f)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No se encontraron facturas.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Dialog: Detalle de factura */}
      <Dialog
        open={Boolean(detalle)}
        onClose={() => setDetalle(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={600}>Factura #{detalle?.IdFactura}</DialogTitle>
        <DialogContent dividers>
          {detalle && (
            <Grid container spacing={1.5}>
              {[
                ['# Pedido',   `#${detalle.IdPedido}`],
                ['Cliente',    detalle.NombreCliente],
                ['Fecha',      new Date(detalle.FechaFactura).toLocaleDateString('es-HN')],
                ['Subtotal',   `L.${detalle.Subtotal.toFixed(2)}`],
                ['Impuesto',   `L.${detalle.Impuesto.toFixed(2)}`],
                ['Total',      `L.${detalle.Total.toFixed(2)}`],
              ].map(([label, value]) => (
                <Grid key={label} size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" fontWeight={label === 'Total' ? 700 : 400}
                    color={label === 'Total' ? 'warning.dark' : 'text.primary'}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDetalle(null)} variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FinanzasFacturas;
