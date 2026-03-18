import { useState } from 'react';
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
} from '@mui/material';
import { Search, Clear, WarningAmber } from '@mui/icons-material';
import Header from '../../components/Header';

// TODO: reemplazar con ventasService.getStock()
const MOCK_STOCK = [
  { IdProducto: 1,  NombreProducto: 'Aceite de Oliva Orgánico',  Categoria: 'Alimentos Orgánicos',  StockActual: 12, FechaActualizacion: '2025-03-14', EstadoProducto: 'Activo' },
  { IdProducto: 2,  NombreProducto: 'Shampoo Natural',           Categoria: 'Cuidado Personal',     StockActual: 3,  FechaActualizacion: '2025-03-13', EstadoProducto: 'Activo' },
  { IdProducto: 3,  NombreProducto: 'Té Verde Orgánico',         Categoria: 'Bebidas Naturales',    StockActual: 20, FechaActualizacion: '2025-03-12', EstadoProducto: 'Activo' },
  { IdProducto: 4,  NombreProducto: 'Quinoa Premium',            Categoria: 'Alimentos Orgánicos',  StockActual: 0,  FechaActualizacion: '2025-03-11', EstadoProducto: 'Activo' },
  { IdProducto: 5,  NombreProducto: 'Jabón de Lavanda',          Categoria: 'Cuidado Personal',     StockActual: 8,  FechaActualizacion: '2025-03-10', EstadoProducto: 'Activo' },
  { IdProducto: 6,  NombreProducto: 'Almendras Orgánicas',       Categoria: 'Alimentos Orgánicos',  StockActual: 2,  FechaActualizacion: '2025-03-10', EstadoProducto: 'Activo' },
  { IdProducto: 7,  NombreProducto: 'Camiseta de Algodón',       Categoria: 'Ropa Sostenible',      StockActual: 15, FechaActualizacion: '2025-03-09', EstadoProducto: 'Activo' },
  { IdProducto: 8,  NombreProducto: 'Maceta Ecológica',          Categoria: 'Hogar Ecológico',      StockActual: 4,  FechaActualizacion: '2025-03-08', EstadoProducto: 'Activo' },
  { IdProducto: 9,  NombreProducto: 'Semillas de Chía',          Categoria: 'Alimentos Orgánicos',  StockActual: 30, FechaActualizacion: '2025-03-07', EstadoProducto: 'Activo' },
  { IdProducto: 10, NombreProducto: 'Bolsa Reutilizable',        Categoria: 'Hogar Ecológico',      StockActual: 1,  FechaActualizacion: '2025-03-06', EstadoProducto: 'Inactivo' },
];

const STOCK_BAJO = 5;

function StockChip({ stock }) {
  if (stock === 0)       return <Chip label="Sin stock"  color="error"   size="small" />;
  if (stock < STOCK_BAJO) return <Chip label="Stock bajo" color="warning" size="small" />;
  return                        <Chip label="Disponible" color="success" size="small" />;
}

function VentasStock() {
  const [search, setSearch] = useState('');

  const query    = search.trim().toLowerCase();
  const filtered = MOCK_STOCK.filter(
    (s) =>
      !query ||
      s.NombreProducto.toLowerCase().includes(query) ||
      s.Categoria.toLowerCase().includes(query)
  );

  const stockBajo = MOCK_STOCK.filter((s) => s.StockActual < STOCK_BAJO).length;

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
              {filtered.length} de {MOCK_STOCK.length} productos
            </Typography>
          </Box>
          {stockBajo > 0 && (
            <Chip
              icon={<WarningAmber />}
              label={`${stockBajo} producto(s) con stock bajo`}
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        <TextField
          size="small"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3, mt: 2, minWidth: 300 }}
          InputProps={{
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
                  <TableCell sx={{ fontWeight: 600 }} align="center">Estado Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Última Actualización</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Estado Producto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow
                    key={s.IdProducto}
                    hover
                    sx={{
                      '&:last-child td': { border: 0 },
                      bgcolor: s.StockActual < STOCK_BAJO ? 'warning.50' : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {s.StockActual < STOCK_BAJO && (
                          <Tooltip title="Stock bajo o agotado">
                            <WarningAmber fontSize="small" color="warning" />
                          </Tooltip>
                        )}
                        <Typography variant="body2" fontWeight={500}>
                          {s.NombreProducto}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{s.Categoria}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        fontWeight={700}
                        color={s.StockActual === 0 ? 'error.main' : s.StockActual < STOCK_BAJO ? 'warning.dark' : 'success.dark'}
                      >
                        {s.StockActual}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <StockChip stock={s.StockActual} />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {new Date(s.FechaActualizacion).toLocaleDateString('es-HN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={s.EstadoProducto}
                        color={s.EstadoProducto === 'Activo' ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No se encontraron productos.</Typography>
                    </TableCell>
                  </TableRow>
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
