import { useState } from 'react';
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
  Chip,
  Button,
} from '@mui/material';
import {
  ShoppingBag,
  HourglassEmpty,
  LocalShipping,
  WarningAmber,
  ArrowForward,
} from '@mui/icons-material';
import Header from '../../components/Header';

// TODO: reemplazar con ventasService.getPedidos() cuando el backend esté listo
const MOCK_PEDIDOS = [
  { IdPedido: 1, NombreCliente: 'Ana García',    FechaPedido: '2025-03-14', EstadoPedido: 'Pendiente',  Total: 350.00, CantidadItems: 3 },
  { IdPedido: 2, NombreCliente: 'Carlos López',  FechaPedido: '2025-03-14', EstadoPedido: 'Procesando', Total: 120.50, CantidadItems: 1 },
  { IdPedido: 3, NombreCliente: 'María Pérez',   FechaPedido: '2025-03-13', EstadoPedido: 'Enviado',    Total: 780.00, CantidadItems: 5 },
  { IdPedido: 4, NombreCliente: 'José Martínez', FechaPedido: '2025-03-13', EstadoPedido: 'Entregado',  Total: 95.00,  CantidadItems: 2 },
  { IdPedido: 5, NombreCliente: 'Laura Torres',  FechaPedido: '2025-03-12', EstadoPedido: 'Cancelado',  Total: 210.00, CantidadItems: 4 },
];

const MOCK_STOCK_BAJO = 3; // productos con stock < 5

const STATUS_COLORS = {
  Pendiente:  'warning',
  Procesando: 'info',
  Enviado:    'primary',
  Entregado:  'success',
  Cancelado:  'error',
};

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

function VentasDashboard() {
  const navigate = useNavigate();
  const [pedidos] = useState(MOCK_PEDIDOS);

  const totalPedidos   = pedidos.length;
  const pendientes     = pedidos.filter((p) => p.EstadoPedido === 'Pendiente').length;
  const enviados       = pedidos.filter((p) => p.EstadoPedido === 'Enviado').length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="success.dark" sx={{ mb: 3 }}>
          Panel de Ventas
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<ShoppingBag sx={{ fontSize: 28, color: '#2e7d32' }} />}
              title="Total Pedidos"
              value={totalPedidos}
              color="#2e7d32"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<HourglassEmpty sx={{ fontSize: 28, color: '#e65100' }} />}
              title="Pendientes"
              value={pendientes}
              color="#e65100"
              subtitle="Requieren atención"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<LocalShipping sx={{ fontSize: 28, color: '#1565c0' }} />}
              title="Enviados"
              value={enviados}
              color="#1565c0"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<WarningAmber sx={{ fontSize: 28, color: '#f57f17' }} />}
              title="Stock Bajo"
              value={MOCK_STOCK_BAJO}
              color="#f57f17"
              subtitle="Productos con stock &lt; 5"
            />
          </Grid>
        </Grid>

        {/* Recent Orders */}
        <Card elevation={2}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Pedidos Recientes
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/ventas/pedidos')}
              >
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
                    <TableRow key={p.IdPedido} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>#{p.IdPedido}</Typography>
                      </TableCell>
                      <TableCell>{p.NombreCliente}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default VentasDashboard;
