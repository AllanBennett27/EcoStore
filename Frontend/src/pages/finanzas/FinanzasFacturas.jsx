import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, TextField,
  InputAdornment, Grid, CircularProgress, Alert,
} from '@mui/material';
import { Visibility, Search, Clear, FilterAlt } from '@mui/icons-material';
import Header from '../../components/Header';
import { viewsService } from '../../services/api';

function FinanzasFacturas() {
  const [facturas, setFacturas]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [detalle, setDetalle]       = useState(null);

  useEffect(() => {
    viewsService.getFacturacion()
      .then((res) => setFacturas(res.data))
      .catch(() => setError('No se pudieron cargar las facturas.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = facturas.filter((f) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      f.cliente.toLowerCase().includes(q) ||
      String(f.idFactura).includes(q);

    const fecha = new Date(f.fechaFactura);
    const matchDesde = !fechaDesde || fecha >= new Date(fechaDesde);
    const matchHasta = !fechaHasta || fecha <= new Date(fechaHasta);

    return matchSearch && matchDesde && matchHasta;
  });

  const totalFiltrado = filtered.reduce((sum, f) => sum + f.total, 0);

  const limpiarFiltros = () => { setSearch(''); setFechaDesde(''); setFechaHasta(''); };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="warning.dark" sx={{ mb: 1 }}>
          Facturas
        </Typography>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
        {error   && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filtered.length} de {facturas.length} facturas — Total filtrado: L.{totalFiltrado.toFixed(2)}
            </Typography>

            {/* Filtros */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <FilterAlt fontSize="small" color="action" />
                  <TextField
                    size="small"
                    label="Buscar cliente o # factura"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 260 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField size="small" label="Desde" type="date" value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }} sx={{ width: 160 }} />
                  <TextField size="small" label="Hasta" type="date" value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }} sx={{ width: 160 }} />
                  {(search || fechaDesde || fechaHasta) && (
                    <IconButton size="small" onClick={limpiarFiltros}>
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
                      <TableRow key={f.idFactura} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>#{f.idFactura}</Typography>
                        </TableCell>
                        <TableCell>{f.cliente}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(f.fechaFactura).toLocaleDateString('es-HN')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">L.{f.subtotal.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ color: 'text.secondary' }}>
                          L.{f.impuesto.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={700} color="warning.dark">
                            L.{f.total.toFixed(2)}
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
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No se encontraron facturas.</Typography>
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

      {/* Dialog: Detalle de factura */}
      <Dialog open={Boolean(detalle)} onClose={() => setDetalle(null)}
        maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle fontWeight={600}>Factura #{detalle?.idFactura}</DialogTitle>
        <DialogContent dividers>
          {detalle && (
            <Grid container spacing={1.5}>
              {[
                ['Cliente',  detalle.cliente],
                ['Fecha',    new Date(detalle.fechaFactura).toLocaleDateString('es-HN')],
                ['Subtotal', `L.${detalle.subtotal.toFixed(2)}`],
                ['Impuesto', `L.${detalle.impuesto.toFixed(2)}`],
                ['Total',    `L.${detalle.total.toFixed(2)}`],
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
