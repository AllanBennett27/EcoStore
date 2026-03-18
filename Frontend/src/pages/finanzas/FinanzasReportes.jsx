import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { TrendingUp, EmojiEvents } from '@mui/icons-material';
import Header from '../../components/Header';

// TODO: reemplazar con finanzasService.getIngresosMes() y finanzasService.getTopProductos()
const MOCK_INGRESOS_MES = [
  { Anio: 2025, Mes: 1,  TotalFacturas: 8,  TotalSubtotal: 2608.70, TotalImpuesto: 391.30, TotalIngresos: 3000.00 },
  { Anio: 2025, Mes: 2,  TotalFacturas: 12, TotalSubtotal: 4260.87, TotalImpuesto: 639.13, TotalIngresos: 4900.00 },
  { Anio: 2025, Mes: 3,  TotalFacturas: 4,  TotalSubtotal: 1117.39, TotalImpuesto: 167.61, TotalIngresos: 1285.00 },
];

const MOCK_TOP_PRODUCTOS = [
  { IdProducto: 1, NombreProducto: 'Aceite de Oliva Orgánico', Categoria: 'Alimentos Orgánicos', TotalVendido: 24, TotalGenerado: 2880.00 },
  { IdProducto: 3, NombreProducto: 'Té Verde Orgánico',        Categoria: 'Bebidas Naturales',   TotalVendido: 18, TotalGenerado: 2169.00 },
  { IdProducto: 9, NombreProducto: 'Semillas de Chía',         Categoria: 'Alimentos Orgánicos', TotalVendido: 15, TotalGenerado: 1125.00 },
  { IdProducto: 5, NombreProducto: 'Jabón de Lavanda',         Categoria: 'Cuidado Personal',    TotalVendido: 12, TotalGenerado: 960.00  },
  { IdProducto: 7, NombreProducto: 'Camiseta de Algodón',      Categoria: 'Ropa Sostenible',     TotalVendido: 10, TotalGenerado: 1500.00 },
];

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function FinanzasReportes() {
  const totalAnual = MOCK_INGRESOS_MES.reduce((sum, m) => sum + m.TotalIngresos, 0);
  const mejorMes   = [...MOCK_INGRESOS_MES].sort((a, b) => b.TotalIngresos - a.TotalIngresos)[0];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="warning.dark" sx={{ mb: 3 }}>
          Reportes Financieros
        </Typography>

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
                        <TableCell sx={{ fontWeight: 600 }} align="center">Facturas</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Subtotal</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Impuesto</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {MOCK_INGRESOS_MES.map((m) => (
                        <TableRow
                          key={`${m.Anio}-${m.Mes}`}
                          hover
                          sx={{
                            '&:last-child td': { border: 0 },
                            bgcolor: mejorMes?.Mes === m.Mes ? 'warning.50' : 'inherit',
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {MESES[m.Mes]} {m.Anio}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{m.TotalFacturas}</TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              L.{m.TotalSubtotal.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              L.{m.TotalImpuesto.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={700} color="warning.dark">
                              L.{m.TotalIngresos.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Total row */}
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell colSpan={4}>
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

          {/* Top productos */}
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
                    {MOCK_TOP_PRODUCTOS.map((p, i) => (
                      <TableRow key={p.IdProducto} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color={i === 0 ? 'warning.dark' : 'text.secondary'}
                          >
                            {i + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 130 }}>
                            {p.NombreProducto}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{p.Categoria}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={600}>{p.TotalVendido}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="success.dark">
                            L.{p.TotalGenerado.toFixed(2)}
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
      </Box>
    </Box>
  );
}

export default FinanzasReportes;
