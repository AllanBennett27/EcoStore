import { useState } from 'react';
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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Add, Edit, Delete, ExpandMore, Category, Search, Clear } from '@mui/icons-material';
import Header from '../../components/Header';
import { useProducts } from '../../context/ProductsContext';

function AdminProducts() {
  const { products, deleteProduct } = useProducts();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const handleAccordion = (category) => (_, isExpanded) => {
    setExpanded(isExpanded ? category : false);
  };

  const handleDeleteClick = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.product) {
      deleteProduct(deleteDialog.product.id);
    }
    setDeleteDialog({ open: false, product: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, product: null });
  };

  // Filter + group products by category
  const query = search.trim().toLowerCase();
  const filtered = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    : products;

  const grouped = filtered.reduce((acc, product) => {
    const cat = product.category || 'Sin categoría';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Title + Add button */}
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
          {filtered.length} de {products.length} productos en {categories.length} categorías
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, descripción o categoría..."
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

        {/* Grouped by category */}
        {categories.map((category) => (
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
              <Badge
                badgeContent={grouped[category].length}
                color="success"
                sx={{ ml: 1 }}
              />
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 440, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Precio</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grouped[category].map((product) => (
                      <TableRow
                        key={product.id}
                        hover
                        sx={{ '&:last-child td': { border: 0 } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: product.color,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Typography sx={{ fontSize: 20 }}>{product.emoji}</Typography>
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
                        <TableCell align="right">
                          <Typography fontWeight={600} color="primary.dark">
                            L.{product.price.toFixed(2)}
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
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Delete fontSize="small" />
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

        {categories.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            {query ? (
              <>
                <Typography color="text.secondary">
                  No se encontraron productos para "{search}".
                </Typography>
                <Button onClick={() => setSearch('')} sx={{ mt: 2 }}>
                  Limpiar búsqueda
                </Button>
              </>
            ) : (
              <>
                <Typography color="text.secondary">No hay productos registrados.</Typography>
                <Button
                  component={RouterLink}
                  to="/admin/products/new"
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Agregar el primer producto
                </Button>
              </>
            )}
          </Paper>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={600}>Eliminar producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estas seguro de que deseas eliminar "{deleteDialog.product?.name}"?
            Esta accion no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminProducts;
