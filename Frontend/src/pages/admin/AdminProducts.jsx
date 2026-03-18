import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  InputAdornment,
  TextField,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  ExpandMore,
  Category,
  Search,
  Clear,
  VisibilityOff,
  Visibility,
  Image as ImageIcon,
} from '@mui/icons-material';
import Header from '../../components/Header';
import { useProducts } from '../../context/ProductsContext';

function AdminProducts() {
  const {
    adminProducts,
    adminLoading,
    saving,
    error,
    loadAdminProducts,
    hideProduct,
    activateProduct,
  } = useProducts();

  const [statusDialog, setStatusDialog] = useState({ open: false, product: null });
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAdminProducts().catch(() => {});
  }, []);

  const handleAccordion = (category) => (_, isExpanded) => {
    setExpanded(isExpanded ? category : false);
  };

  const handleStatusClick = (product) => {
    setStatusDialog({ open: true, product });
  };

  const handleStatusConfirm = async () => {
    if (statusDialog.product) {
      if (statusDialog.product.status === 'Activo') {
        await hideProduct(statusDialog.product.id);
      } else {
        await activateProduct(statusDialog.product.id);
      }
    }
    setStatusDialog({ open: false, product: null });
  };

  const handleStatusCancel = () => {
    setStatusDialog({ open: false, product: null });
  };

  const query = search.trim().toLowerCase();
  const filtered = query
    ? adminProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    : adminProducts;

  const grouped = filtered.reduce((acc, product) => {
    const category = product.category || 'Sin categoria';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            Administrar Productos
          </Typography>
          <Button
            component={RouterLink}
            to="/admin/products/new"
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
          >
            Agregar producto
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filtered.length} de {adminProducts.length} productos en {categories.length} categorias
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, descripcion o categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
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

        {adminLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="error">
              No se pudieron cargar los productos: {error}
            </Typography>
          </Paper>
        ) : categories.map((category) => (
          <Accordion
            key={category}
            expanded={expanded === category}
            onChange={handleAccordion(category)}
            sx={{ mb: 1.5, borderRadius: '12px !important', overflow: 'hidden', '&:before': { display: 'none' } }}
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: '#fff' }} />}
              sx={{
                bgcolor: 'primary.dark',
                color: '#fff',
                '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5 },
              }}
            >
              <Category fontSize="small" />
              <Typography fontWeight={600}>{category}</Typography>
              <Badge badgeContent={grouped[category].length} color="success" sx={{ ml: 1 }} />
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 440, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Precio</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grouped[category].map((product) => (
                      <TableRow key={product.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#f1f8e9',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden',
                              }}
                            >
                              {product.imageUrl ? (
                                <Box
                                  component="img"
                                  src={product.imageUrl}
                                  alt={product.name}
                                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <ImageIcon fontSize="small" color="primary" />
                              )}
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {product.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{ maxWidth: 400, display: 'block' }}
                              >
                                {product.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={product.status}
                            size="small"
                            color={product.status === 'Activo' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="primary.dark">
                            L.{Number(product.price).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            component={RouterLink}
                            to={`/admin/products/edit/${product.id}`}
                            color="primary"
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            color={product.status === 'Activo' ? 'warning' : 'success'}
                            size="small"
                            onClick={() => handleStatusClick(product)}
                            disabled={saving}
                          >
                            {product.status === 'Activo' ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}

        {!adminLoading && !error && categories.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            {query ? (
              <>
                <Typography color="text.secondary">
                  No se encontraron productos para "{search}".
                </Typography>
                <Button onClick={() => setSearch('')} sx={{ mt: 2 }}>
                  Limpiar busqueda
                </Button>
              </>
            ) : (
              <Typography color="text.secondary">
                No hay productos registrados.
              </Typography>
            )}
          </Paper>
        )}
      </Box>

      <Dialog
        open={statusDialog.open}
        onClose={handleStatusCancel}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={600}>
          {statusDialog.product?.status === 'Activo' ? 'Ocultar producto' : 'Activar producto'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {statusDialog.product?.status === 'Activo'
              ? `Estas seguro de que deseas ocultar "${statusDialog.product?.name}"?`
              : `Estas seguro de que deseas activar "${statusDialog.product?.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleStatusCancel}>Cancelar</Button>
          <Button
            onClick={handleStatusConfirm}
            color={statusDialog.product?.status === 'Activo' ? 'warning' : 'success'}
            variant="contained"
            disabled={saving}
          >
            {statusDialog.product?.status === 'Activo' ? 'Ocultar' : 'Activar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminProducts;
