import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Save, ArrowBack, Image as ImageIcon, Add } from '@mui/icons-material';
import Header from '../../components/Header';
import { useProducts } from '../../context/ProductsContext';
import { categoriasService } from '../../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: '',
};

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById, saving } = useProducts();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  // Nueva categoría
  const [catDialog, setCatDialog]     = useState(false);
  const [catForm, setCatForm]         = useState({ NombreCategoria: '', Descripcion: '' });
  const [catError, setCatError]       = useState('');
  const [catSaving, setCatSaving]     = useState(false);

  useEffect(() => {
    categoriasService
      .getAll()
      .then((res) => setCategories(res.data))
      .catch(() => setError('No se pudieron cargar las categorias.'));
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    getProductById(Number(id))
      .then((product) => {
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          imageUrl: product.imageUrl || '',
          categoryId: String(product.categoryId),
        });
        setError(null);
      })
      .catch(() => setError('No se pudo cargar el producto.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveCategoria = async () => {
    if (!catForm.NombreCategoria.trim()) { setCatError('El nombre es requerido.'); return; }
    if (!catForm.Descripcion.trim())     { setCatError('La descripción es requerida.'); return; }
    setCatSaving(true);
    setCatError('');
    try {
      const res = await categoriasService.create(catForm);
      const nueva = res.data;
      setCategories((prev) => [...prev, nueva]);
      setForm((prev) => ({ ...prev, categoryId: String(nueva.idCategoria) }));
      setCatForm({ NombreCategoria: '', Descripcion: '' });
      setCatDialog(false);
    } catch {
      setCatError('No se pudo crear la categoría.');
    } finally {
      setCatSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: form.name.trim(),
      descripcion: form.description.trim(),
      precio: Number(form.price) || 0,
      imagenUrl: form.imageUrl.trim(),
      idCategoria: Number(form.categoryId),
    };

    try {
      if (isEdit) {
        await updateProduct(Number(id), payload);
      } else {
        await addProduct(payload);
      }
      navigate('/admin/products');
    } catch {
      setError('No se pudo guardar el producto.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Button
            component={RouterLink}
            to="/admin/products"
            startIcon={<ArrowBack />}
            size="small"
          >
            Volver
          </Button>
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            {isEdit ? 'Editar producto' : 'Agregar producto'}
          </Typography>
        </Box>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Nombre del producto"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Descripcion"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Precio (L)"
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      required
                      inputProps={{ min: 0, step: '0.01' }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        select
                        label="Categoría"
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.idCategoria} value={String(cat.idCategoria)}>
                            {cat.nombreCategoria}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Nueva categoría">
                        <Button
                          variant="outlined"
                          sx={{ minWidth: 42, px: 0 }}
                          onClick={() => { setCatForm({ NombreCategoria: '', Descripcion: '' }); setCatError(''); setCatDialog(true); }}
                        >
                          <Add />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="URL de imagen"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Vista previa
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: '#f1f8e9',
                        borderRadius: 3,
                        minHeight: 220,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {form.imageUrl ? (
                        <Box
                          component="img"
                          src={form.imageUrl}
                          alt={form.name || 'Vista previa'}
                          sx={{ width: '100%', height: 220, objectFit: 'cover' }}
                        />
                      ) : (
                        <ImageIcon sx={{ fontSize: 72, color: 'primary.main' }} />
                      )}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button component={RouterLink} to="/admin/products" variant="outlined">
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        disabled={saving}
                      >
                        {saving ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      {/* ── Dialog nueva categoría ── */}
      <Dialog open={catDialog} onClose={() => setCatDialog(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle fontWeight={700}>Nueva categoría</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {catError && <Alert severity="error">{catError}</Alert>}
          <TextField
            fullWidth size="small" label="Nombre"
            value={catForm.NombreCategoria}
            onChange={(e) => setCatForm((p) => ({ ...p, NombreCategoria: e.target.value }))}
          />
          <TextField
            fullWidth size="small" label="Descripción" multiline rows={3}
            value={catForm.Descripcion}
            onChange={(e) => setCatForm((p) => ({ ...p, Descripcion: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCatDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveCategoria} disabled={catSaving}>
            {catSaving ? 'Guardando...' : 'Crear categoría'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductForm;
