import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, Alert,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import Header from '../../components/Header';
import { viewsService } from '../../services/api';

function VentasCarritos() {
  const [carritos, setCarritos] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(null);

  useEffect(() => {
    viewsService.getCarritosActivos()
      .then((res) => setCarritos(res.data))
      .catch(() => setError('No se pudieron cargar los carritos activos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ShoppingCart color="success" />
          <Typography variant="h5" fontWeight={700} color="success.dark">
            Carritos Activos
          </Typography>
        </Box>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
        {error   && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {carritos.length} carrito{carritos.length !== 1 ? 's' : ''} con items pendientes
            </Typography>

            <Card elevation={2}>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}># Carrito</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Fecha Creación</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Items</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carritos.map((c) => (
                      <TableRow key={c.idCarrito} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>#{c.idCarrito}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {c.nombre} {c.apellido}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(c.fechaCreacion).toLocaleDateString('es-HN')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={c.totalItems} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                    {carritos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No hay carritos activos.</Typography>
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
    </Box>
  );
}

export default VentasCarritos;
