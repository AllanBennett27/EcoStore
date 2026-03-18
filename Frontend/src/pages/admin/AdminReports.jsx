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
import { useEffect } from 'react';
import {
  Inventory,
  Category,
  AttachMoney,
  TrendingUp,
  Image as ImageIcon,
} from '@mui/icons-material';
import Header from '../../components/Header';
import { useProducts } from '../../context/ProductsContext';

function StatCard({ icon, title, value, color }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} color={color}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function AdminReports() {
  const { adminProducts: products, loadAdminProducts } = useProducts();

  useEffect(() => {
    loadAdminProducts().catch(() => {});
  }, []);

  const totalProducts = products.length;
  const categoriesMap = {};
  products.forEach((p) => {
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
  });
  const totalCategories = Object.keys(categoriesMap).length;
  const avgPrice =
    totalProducts > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
      : 0;
  const maxPrice = totalProducts > 0 ? Math.max(...products.map((p) => p.price)) : 0;
  const minPrice = totalProducts > 0 ? Math.min(...products.map((p) => p.price)) : 0;

  const sortedByPrice = [...products].sort((a, b) => b.price - a.price);
  const topExpensive = sortedByPrice.slice(0, 5);
  const topCheapest = [...products].sort((a, b) => a.price - b.price).slice(0, 5);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
          Reportes
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<Inventory sx={{ fontSize: 28, color: '#2e7d32' }} />}
              title="Total Productos"
              value={totalProducts}
              color="#2e7d32"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<Category sx={{ fontSize: 28, color: '#1565c0' }} />}
              title="Categorias"
              value={totalCategories}
              color="#1565c0"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<AttachMoney sx={{ fontSize: 28, color: '#e65100' }} />}
              title="Precio Promedio"
              value={`L.${avgPrice.toFixed(2)}`}
              color="#e65100"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<TrendingUp sx={{ fontSize: 28, color: '#6a1b9a' }} />}
              title="Rango de Precios"
              value={`L.${minPrice.toFixed(0)} - L.${maxPrice.toFixed(0)}`}
              color="#6a1b9a"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Products per Category */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Productos por Categoria
                </Typography>
                <Table size="small">
                  <TableBody>
                    {Object.entries(categoriesMap)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, count]) => (
                        <TableRow key={category}>
                          <TableCell sx={{ border: 0, pl: 0 }}>
                            <Typography variant="body2">{category}</Typography>
                          </TableCell>
                          <TableCell sx={{ border: 0 }} align="right">
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {count}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Most Expensive */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Productos mas Caros
                </Typography>
                <Table size="small">
                  <TableBody>
                    {topExpensive.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell sx={{ border: 0, pl: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ImageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                              {p.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ border: 0 }} align="right">
                          <Typography variant="body2" fontWeight={600} color="primary.dark">
                            L.{p.price.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Cheapest */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Productos mas Economicos
                </Typography>
                <Table size="small">
                  <TableBody>
                    {topCheapest.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell sx={{ border: 0, pl: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ImageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                              {p.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ border: 0 }} align="right">
                          <Typography variant="body2" fontWeight={600} color="primary.dark">
                            L.{p.price.toFixed(2)}
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

export default AdminReports;
