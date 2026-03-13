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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import { useProducts } from '../../context/ProductsContext';

function AdminProducts() {
  const { products, deleteProduct } = useProducts();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

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
            mb: 3,
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
          {products.length} productos registrados
        </Typography>

        {/* Products Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.dark' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Producto</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Categoria</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }} align="right">Precio</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{ '&:last-child td': { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: product.color,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: 24 }}>{product.emoji}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 300, display: 'block' }}>
                          {product.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" variant="outlined" color="primary" />
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
