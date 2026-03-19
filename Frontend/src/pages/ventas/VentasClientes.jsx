import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField,
  InputAdornment, IconButton, CircularProgress, Alert, Chip,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import Header from '../../components/Header';
import { viewsService } from '../../services/api';

function VentasClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    viewsService.getVentasPorUsuario()
      .then((res) => setClientes(res.data))
      .catch(() => setError('No se pudieron cargar los clientes.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clientes.filter((c) => {
    const q = search.trim().toLowerCase();
    return !q ||
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q);
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="success.dark" sx={{ mb: 1 }}>
          Clientes por Ventas
        </Typography>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
        {error   && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filtered.length} de {clientes.length} clientes
            </Typography>

            <Box sx={{ mb: 3 }}>
              <TextField
                size="small"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 300 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: search && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearch('')}>
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Card elevation={2}>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Pedidos</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Total Gastado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((c, i) => (
                      <TableRow key={c.idUsuario} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}
                            color={i === 0 ? 'success.dark' : 'text.secondary'}>
                            {i + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {c.nombre} {c.apellido}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={c.totalPedidos} size="small" color="info" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={700} color="success.dark">
                            L.{c.totalGastado.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No se encontraron clientes.</Typography>
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

export default VentasClientes;
