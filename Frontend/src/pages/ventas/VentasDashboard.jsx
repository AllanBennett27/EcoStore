import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, CircularProgress,
} from '@mui/material';
import { ShoppingBag, HourglassEmpty, LocalShipping, WarningAmber, ArrowForward } from '@mui/icons-material';
import Header from '../../components/Header';
import { viewsService } from '../../services/api';

const STATUS_COLORS = {
  Pendiente:  'warning',
  Procesando: 'info',
  Enviado:    'primary',
  Entregado:  'success',
  Cancelado:  'error',
};

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

function StatCard({ icon, title, value, color, subtitle }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
        <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight={700} color={color}>{value}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
}

function VentasDashboard() {
  const navigate = useNavigate();
  const [lineas,    setLineas]    = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      viewsService.getDetallePedidos(),
      viewsService.getStockBajo(),
    ])
      .then(([pedRes, stockRes]) => {
        setLineas(pedRes.data);
        setStockBajo(stockRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const pedidos   = useMemo(() => agruparPedidos(lineas), [lineas]);
  const pendientes = pedidos.filter((p) => p.estadoPedido === 'Pendiente').length;
  const enviados   = pedidos.filter((p) => p.estadoPedido === 'Enviado').length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="success.dark" sx={{ mb: 3 }}>
          Panel de Ventas
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={<ShoppingBag sx={{ fontSize: 28, color: '#2e7d32' }} />}
                  title="Total Pedidos" value={pedidos.length} color="#2e7d32" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={<HourglassEmpty sx={{ fontSize: 28, color: '#e65100' }} />}
                  title="Pendientes" value={pendientes} color="#e65100" subtitle="Requieren atención" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={<LocalShipping sx={{ fontSize: 28, color: '#1565c0' }} />}
                  title="Enviados" value={enviados} color="#1565c0" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={<WarningAmber sx={{ fontSize: 28, color: '#f57f17' }} />}
                  title="Stock Bajo" value={stockBajo.length} color="#f57f17"
                  subtitle="Productos con stock < 10" />
              </Grid>
            </Grid>

            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>Pedidos Recientes</Typography>
                  <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/ventas/pedidos')}>
                    Ver todos
                  </Button>
                </Box>

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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pedidos.slice(0, 5).map((p) => (
                        <TableRow key={p.idPedido} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell><Typography variant="body2" fontWeight={600}>#{p.idPedido}</Typography></TableCell>
                          <TableCell>{p.cliente}</TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(p.fechaPedido).toLocaleDateString('es-HN')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={p.estadoPedido} color={STATUS_COLORS[p.estadoPedido] ?? 'default'} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600} color="success.dark">L.{p.total.toFixed(2)}</Typography>
                          </TableCell>
                          <TableCell align="center">{p.totalItems}</TableCell>
                        </TableRow>
                      ))}
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

export default VentasDashboard;
