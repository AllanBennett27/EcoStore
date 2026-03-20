import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Clear, WarningAmber, AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import Header from '../../components/Header';
import { inventarioService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const STOCK_BAJO = 5;

function getEstadoStock(stock) {
  if (stock === 0)        return { label: 'Sin stock',  color: 'error'   };
  if (stock < STOCK_BAJO) return { label: 'Stock bajo', color: 'warning' };
  return                         { label: 'Disponible', color: 'success' };
}

function VentasStock() {
  const { isAdmin }           = useAuth();
  const [stock, setStock]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [ajustando, setAjustando] = useState(null);

  useEffect(() => {
    inventarioService.getAll()
      .then((res) => setStock(res.data))
      .catch(() => setError('No se pudo cargar el inventario.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAjustar = async (idProducto, delta) => {
    setAjustando(idProducto);
    try {
      const res = await inventarioService.ajustar(idProducto, delta);
      const updated = res.data;
      setStock((prev) =>
        prev.map((s) => s.idProducto === idProducto
          ? { ...s, stockActual: updated.stockActual, fechaActualizacion: updated.fechaActualizacion }
          : s
        )
      );
    } catch {
      setError('No se pudo ajustar el stock.');
    } finally {
      setAjustando(null);
    }
  };

  const query    = search.trim().toLowerCase();
  const filtered = stock.filter(
    (s) =>
      !query ||
      s.nombreProducto.toLowerCase().includes(query) ||
      s.categoria.toLowerCase().includes(query)
  );

  const stockBajo = stock.filter((s) => s.stockActual < STOCK_BAJO).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="success.dark">
              Stock de Productos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filtered.length} de {stock.length} productos
            </Typography>
          </Box>
          {stockBajo > 0 && (
            <Chip
              icon={<WarningAmber />}
              label={`${stockBajo} producto(s) con stock bajo o agotado`}
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TextField
          size="small"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3, mt: 2, minWidth: 300 }}
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

        <Card elevation={2}>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Stock Actual</TableCell>
                  {isAdmin && <TableCell sx={{ fontWeight: 600 }} align="center">Ajustar</TableCell>}
                  <TableCell sx={{ fontWeight: 600 }} align="center">Estado Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Última Actualización</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Estado Producto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} align="center" sx={{ py: 5 }}>
                      <CircularProgress size={28} color="success" />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {search ? `No se encontraron productos para "${search}".` : 'No hay productos en inventario.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => {
                    const estadoStock = getEstadoStock(s.stockActual);
                    const esAlerta    = s.stockActual < STOCK_BAJO;
                    return (
                      <TableRow
                        key={s.idInventario}
                        hover
                        sx={{
                          '&:last-child td': { border: 0 },
                          bgcolor: esAlerta ? 'warning.50' : 'inherit',
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {esAlerta && (
                              <Tooltip title={s.stockActual === 0 ? 'Sin stock' : 'Stock bajo'}>
                                <WarningAmber fontSize="small" color="warning" />
                              </Tooltip>
                            )}
                            <Typography variant="body2" fontWeight={500}>
                              {s.nombreProducto}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{s.categoria}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            fontWeight={700}
                            color={
                              s.stockActual === 0
                                ? 'error.main'
                                : s.stockActual < STOCK_BAJO
                                ? 'warning.dark'
                                : 'success.dark'
                            }
                          >
                            {s.stockActual}
                          </Typography>
                        </TableCell>
                        {isAdmin && (
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <Tooltip title="Disminuir stock">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    disabled={ajustando === s.idProducto || s.stockActual === 0}
                                    onClick={() => handleAjustar(s.idProducto, -1)}
                                  >
                                    <RemoveCircleOutline fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Aumentar stock">
                                <IconButton
                                  size="small"
                                  color="success"
                                  disabled={ajustando === s.idProducto}
                                  onClick={() => handleAjustar(s.idProducto, 1)}
                                >
                                  <AddCircleOutline fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        )}
                        <TableCell align="center">
                          <Chip
                            label={estadoStock.label}
                            color={estadoStock.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {new Date(s.fechaActualizacion).toLocaleDateString('es-HN')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={s.estadoProducto}
                            color={s.estadoProducto === 'Activo' ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Box>
  );
}

export default VentasStock;
