import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert,
} from '@mui/material';
import { TrendingUp, EmojiEvents } from '@mui/icons-material';
import Header from '../../components/Header';
import { viewsService } from '../../services/api';

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Agrupa filas diarias en resumen mensual
function agruparPorMes(filas) {
  const map = {};
  filas.forEach(({ fecha, totalPedidos, ingresos }) => {
    const d   = new Date(fecha);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!map[key]) map[key] = { anio: d.getFullYear(), mes: d.getMonth() + 1, totalPedidos: 0, ingresos: 0 };
    map[key].totalPedidos += totalPedidos;
    map[key].ingresos     += ingresos;
  });
  return Object.values(map).sort((a, b) => a.anio - b.anio || a.mes - b.mes);
}

function FinanzasReportes() {
  const [topProductos, setTopProductos] = useState([]);
  const [ingresosMes,  setIngresosMes]  = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error,   setError]             = useState(null);

  useEffect(() => {
    Promise.all([
      viewsService.getVentasPorProducto(),
      viewsService.getVentasPorFecha(),
    ])
      .then(([prodRes, fechaRes]) => {
        setTopProductos(prodRes.data.slice(0, 5));
        setIngresosMes(agruparPorMes(fechaRes.data));
      })
      .catch(() => setError('No se pudieron cargar los reportes.'))
      .finally(() => setLoading(false));
  }, []);

  const totalAnual = ingresosMes.reduce((sum, m) => sum + m.ingresos, 0);
  const mejorMes   = [...ingresosMes].sort((a, b) => b.ingresos - a.ingresos)[0];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="warning.dark" sx={{ mb: 3 }}>
          Reportes Financieros
        </Typography>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
        {error   && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <Grid container spacing={3}>

            {/* Ingresos por mes */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TrendingUp color="warning" />
                    <Typography variant="h6" fontWeight={600}>Ingresos por Mes</Typography>
                  </Box>

                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Mes</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="center">Pedidos</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="right">Ingresos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ingresosMes.map((m) => (
                          <TableRow
                            key={`${m.anio}-${m.mes}`}
                            hover
                            sx={{
                              '&:last-child td': { border: 0 },
                              bgcolor: mejorMes?.mes === m.mes && mejorMes?.anio === m.anio
                                ? 'warning.50' : 'inherit',
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {MESES[m.mes]} {m.anio}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">{m.totalPedidos}</TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={700} color="warning.dark">
                                L.{m.ingresos.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell colSpan={2}>
                            <Typography variant="body2" fontWeight={700}>Total General</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={700} color="warning.dark">
                              L.{totalAnual.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Top productos más vendidos */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EmojiEvents color="warning" />
                    <Typography variant="h6" fontWeight={600}>Productos Más Vendidos</Typography>
                  </Box>

                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">Uds.</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Ingresos</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProductos.map((p, i) => (
                        <TableRow key={p.idProducto} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700}
                              color={i === 0 ? 'warning.dark' : 'text.secondary'}>
                              {i + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 130 }}>
                              {p.nombreProducto}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>{p.totalVendido}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="success.dark">
                              L.{p.ingresosGenerados.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default FinanzasReportes;
