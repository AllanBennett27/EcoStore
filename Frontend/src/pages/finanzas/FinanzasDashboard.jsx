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
  Button,
} from '@mui/material';
import {
  Receipt,
  AttachMoney,
  AccountBalance,
  EmojiEvents,
  ArrowForward,
} from '@mui/icons-material';
import Header from '../../components/Header';

// TODO: reemplazar con finanzasService.getFacturas(), finanzasService.getIngresosMes(), finanzasService.getTopProductos()
const MOCK_FACTURAS = [
  { IdFactura: 1, IdPedido: 1, NombreCliente: 'Ana García',    FechaFactura: '2025-03-14', Subtotal: 304.35, Impuesto: 45.65,  Total: 350.00 },
  { IdFactura: 2, IdPedido: 3, NombreCliente: 'María Pérez',   FechaFactura: '2025-03-13', Subtotal: 678.26, Impuesto: 101.74, Total: 780.00 },
  { IdFactura: 3, IdPedido: 4, NombreCliente: 'José Martínez', FechaFactura: '2025-03-13', Subtotal: 82.61,  Impuesto: 12.39,  Total: 95.00  },
  { IdFactura: 4, IdPedido: 7, NombreCliente: 'Sofia Mendoza', FechaFactura: '2025-03-10', Subtotal: 52.17,  Impuesto: 7.83,   Total: 60.00  },
];

const MOCK_TOP_PRODUCTO = { NombreProducto: 'Aceite de Oliva Orgánico', TotalVendido: 24 };

const mesActual = new Date().getMonth() + 1;
const anioActual = new Date().getFullYear();

const ingresosMes = MOCK_FACTURAS
  .filter((f) => {
    const d = new Date(f.FechaFactura);
    return d.getMonth() + 1 === mesActual && d.getFullYear() === anioActual;
  })
  .reduce((acc, f) => ({ total: acc.total + f.Total, impuesto: acc.impuesto + f.Impuesto }), { total: 0, impuesto: 0 });

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
  const [facturas] = useState(MOCK_FACTURAS);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="warning.dark" sx={{ mb: 3 }}>
          Panel de Finanzas
        </Typography>

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
              subtitle={`${new Date().toLocaleString('es-HN', { month: 'long', year: 'numeric' })}`}
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
              value={MOCK_TOP_PRODUCTO.TotalVendido}
              color="#6a1b9a"
              subtitle={MOCK_TOP_PRODUCTO.NombreProducto}
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
                    <TableCell sx={{ fontWeight: 600 }}># Pedido</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Subtotal</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Impuesto</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturas.slice(0, 5).map((f) => (
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

export default FinanzasDashboard;
