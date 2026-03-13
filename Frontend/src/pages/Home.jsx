import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { EnergySavingsLeaf, ArrowForward } from '@mui/icons-material';
import Header from '../components/Header';

const categories = [
  { name: 'Alimentos Organicos', emoji: '🥗', color: '#e8f5e9' },
  { name: 'Cuidado Personal', emoji: '🧴', color: '#f3e5f5' },
  { name: 'Hogar Ecologico', emoji: '🏡', color: '#e0f2f1' },
  { name: 'Bebidas Naturales', emoji: '🍵', color: '#fff8e1' },
  { name: 'Ropa Sostenible', emoji: '👕', color: '#e3f2fd' },
  { name: 'Jardineria', emoji: '🌱', color: '#f1f8e9' },
];

function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #4caf50 100%)',
          color: '#fff',
          py: { xs: 6, md: 8 },
          px: 3,
          textAlign: 'center',
        }}
      >
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <EnergySavingsLeaf sx={{ fontSize: 56 }} />
          </Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Bienvenido a Ecostore
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, lineHeight: 1.8, mb: 3 }}
          >
            Cada compra que realizas tiene un impacto en el planeta. Al elegir productos
            ecologicos y sostenibles, contribuyes a reducir la contaminacion, conservar
            los recursos naturales y proteger la biodiversidad. Los productos eco-friendly
            no solo son mejores para el medio ambiente, sino tambien para tu salud y la de
            tu familia, ya que estan libres de quimicos daninos y toxinas. Juntos podemos
            construir un futuro mas verde, un producto a la vez.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/products')}
            sx={{
              bgcolor: '#fff',
              color: 'primary.dark',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Ver todos los productos
          </Button>
        </Box>
      </Box>

      {/* Categories Section */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 6 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary.dark"
          textAlign="center"
          gutterBottom
        >
          Explora nuestras categorias
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}
        >
          Encuentra productos ecologicos organizados por categoria.
          Selecciona la que mas te interese para comenzar.
        </Typography>

        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid key={cat.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.15)',
                  },
                }}
              >
                <CardActionArea onClick={() => handleCategoryClick(cat.name)}>
                  <Box
                    sx={{
                      bgcolor: cat.color,
                      height: 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px 12px 0 0',
                    }}
                  >
                    <Typography sx={{ fontSize: 64 }}>{cat.emoji}</Typography>
                  </Box>
                  <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                    <Typography variant="h6" fontWeight={600} color="primary.dark">
                      {cat.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
