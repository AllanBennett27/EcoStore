import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Receipt,
  AttachMoney,
  AccountBalance,
  EmojiEvents,
  ArrowForward,
} from '@mui/icons-material';
import Header from '../../components/Header';
import { viewsService } from '../../services/api';

function StatCard({ icon, title, value, color, subtitle }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
        <Box
          sx={{
            width: 56, height: 56, borderRadius: 3,
            bgcolor: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight={700} color={color}>{value}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function FinanzasDashboard() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [topProducto, setTopProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      viewsService.getFacturacion(),
      viewsService.getVentasPorProducto(),
    ])
      .then(([facRes, prodRes]) => {
        setFacturas(facRes.data ?? []);
        const productos = prodRes.data ?? [];
        if (productos.length > 0) {
          const top = productos.reduce((a, b) => (b.totalVendido > a.totalVendido ? b : a));
          setTopProducto(top);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();

  const ingresosMes = facturas
    .filter((f) => {
      const d = new Date(f.fechaFactura);
      return d.getMonth() + 1 === mesActual && d.getFullYear() === anioActual;
    })
    .reduce(
      (acc, f) => ({ total: acc.total + f.total, impuesto: acc.impuesto + f.impuesto }),
      { total: 0, impuesto: 0 }
    );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="warning.dark" sx={{ mb: 3 }}>
          Panel de Finanzas
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="warning" />
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<Receipt sx={{ fontSize: 28, color: '#1565c0' }} />}
                  title="Total Facturas"
                  value={facturas.length}
                  color="#1565c0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<AttachMoney sx={{ fontSize: 28, color: '#2e7d32' }} />}
                  title="Ingresos del Mes"
                  value={`L.${ingresosMes.total.toFixed(2)}`}
                  color="#2e7d32"
                  subtitle={new Date().toLocaleString('es-HN', { month: 'long', year: 'numeric' })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<AccountBalance sx={{ fontSize: 28, color: '#e65100' }} />}
                  title="Impuestos del Mes"
                  value={`L.${ingresosMes.impuesto.toFixed(2)}`}
                  color="#e65100"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<EmojiEvents sx={{ fontSize: 28, color: '#6a1b9a' }} />}
                  title="Producto Top"
                  value={topProducto ? topProducto.totalVendido : '—'}
                  color="#6a1b9a"
                  subtitle={topProducto?.nombreProducto}
                />
              </Grid>
            </Grid>

            {/* Recent Invoices */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Facturas Recientes
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/finanzas/facturas')}
                  >
                    Ver todas
                  </Button>
                </Box>

                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell sx={{ fontWeight: 600 }}># Factura</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Subtotal</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Impuesto</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {facturas.slice(0, 5).map((f) => (
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
                          <TableCell align="right">L.{Number(f.subtotal).toFixed(2)}</TableCell>
                          <TableCell align="right" sx={{ color: 'text.secondary' }}>
                            L.{Number(f.impuesto).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={700} color="warning.dark">
                              L.{Number(f.total).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {facturas.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                            No hay facturas registradas
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
}

export default FinanzasDashboard;
