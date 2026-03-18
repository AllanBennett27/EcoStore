import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import Header from '../../components/Header';
import { useProducts } from '../../context/ProductsContext';

const categories = [
  'Alimentos Organicos',
  'Cuidado Personal',
  'Hogar Ecologico',
  'Bebidas Naturales',
  'Ropa Sostenible',
  'Jardineria',
];

const colorOptions = [
  { label: 'Verde claro', value: '#e8f5e9' },
  { label: 'Amarillo claro', value: '#fff8e1' },
  { label: 'Naranja claro', value: '#fff3e0' },
  { label: 'Morado claro', value: '#f3e5f5' },
  { label: 'Azul claro', value: '#e3f2fd' },
  { label: 'Verde menta', value: '#e0f2f1' },
  { label: 'Verde lima', value: '#f1f8e9' },
  { label: 'Cafe claro', value: '#efebe9' },
];

const emptyForm = {
  name: '',
  description: '',
  fullDescription: '',
  price: '',
  category: '',
  emoji: '',
  color: '#e8f5e9',
};

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProducts();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isEdit) {
      const product = products.find((p) => p.id === Number(id));
      if (product) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          name: product.name,
          description: product.description,
          fullDescription: product.fullDescription || '',
          price: String(product.price),
          category: product.category,
          emoji: product.emoji,
          color: product.color || '#e8f5e9',
        });
      }
    }
  }, [id, isEdit, products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price) || 0,
      rating: 0,
      reviews: 0,
    };

    if (isEdit) {
      updateProduct(Number(id), productData);
    } else {
      addProduct(productData);
    }
    navigate('/admin/products');
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
            <Box component="form" onSubmit={handleSubmit}>
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
                    label="Descripcion corta"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Descripcion completa"
                    name="fullDescription"
                    value={form.fullDescription}
                    onChange={handleChange}
                    multiline
                    rows={4}
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
                  <TextField
                    fullWidth
                    select
                    label="Categoria"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Emoji del producto"
                    name="emoji"
                    value={form.emoji}
                    onChange={handleChange}
                    required
                    helperText="Ejemplo: 🍯 🧼 🌱"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Color de fondo"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    required
                  >
                    {colorOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: opt.value,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                          {opt.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Preview */}
                {form.emoji && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Vista previa
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: form.color,
                        borderRadius: 3,
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: 64 }}>{form.emoji}</Typography>
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      component={RouterLink}
                      to="/admin/products"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      sx={{
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                      }}
                    >
                      {isEdit ? 'Guardar cambios' : 'Crear producto'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ProductForm;
