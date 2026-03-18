import { useEffect, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  Card,
  CardActionArea,
  CircularProgress,
} from "@mui/material";
import {
  AddShoppingCart,
  Add,
  Remove,
  ArrowBack,
  EnergySavingsLeaf,
  Recycling,
  VerifiedUser,
  LocalShipping,
  Image as ImageIcon,
} from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";

const ecoBadges = [
  { icon: <EnergySavingsLeaf sx={{ fontSize: 15 }} />, label: "100% Natural" },
  { icon: <Recycling sx={{ fontSize: 15 }} />, label: "Eco Friendly" },
  { icon: <VerifiedUser sx={{ fontSize: 15 }} />, label: "Certificado" },
];

const features = [
  { icon: <LocalShipping sx={{ fontSize: 20, color: "primary.main" }} />, text: "Envio rapido a todo el pais" },
  { icon: <VerifiedUser sx={{ fontSize: 20, color: "primary.main" }} />, text: "Garantia de calidad organica" },
  { icon: <Recycling sx={{ fontSize: 20, color: "primary.main" }} />, text: "Empaque 100% biodegradable" },
  { icon: <EnergySavingsLeaf sx={{ fontSize: 20, color: "primary.main" }} />, text: "Sin quimicos ni conservantes" },
];

function RelatedCard({ product, navigate }) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(46,125,50,0.18)" },
      }}
    >
      <CardActionArea onClick={() => navigate(`/products/${product.id}`)}>
        <Box
          sx={{
            bgcolor: "#f1f8e9",
            height: 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {product.imageUrl ? (
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <ImageIcon sx={{ fontSize: 52, color: "primary.main" }} />
          )}
        </Box>
        <Box sx={{ p: 1.5 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="primary.dark" fontWeight={700}>
            L.{Number(product.price).toFixed(2)}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, getProductById } = useProducts();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductById(Number(id))
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const related = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
        <Footer />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Header />
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h5" color="text.secondary">
            Producto no encontrado
          </Typography>
          <Button component={RouterLink} to="/products" variant="contained" sx={{ mt: 3 }}>
            Volver a productos
          </Button>
        </Box>
        <Footer />
      </Box>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }
    setQuantity(1);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ flex: 1 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Button component={RouterLink} to="/products" startIcon={<ArrowBack />} size="small">
              Volver
            </Button>
            <Breadcrumbs>
              <Link component={RouterLink} to="/products" underline="hover" color="primary">
                Productos
              </Link>
              <Typography color="text.secondary">{product.category}</Typography>
              <Typography color="text.primary" fontWeight={500}>
                {product.name}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  bgcolor: "#f1f8e9",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 380,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.15)",
                  }}
                />
                {product.imageUrl ? (
                  <Box
                    component="img"
                    src={product.imageUrl}
                    alt={product.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
                  />
                ) : (
                  <ImageIcon
                    sx={{
                      fontSize: 140,
                      zIndex: 1,
                      color: "primary.main",
                      filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))",
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                {ecoBadges.map((badge) => (
                  <Chip
                    key={badge.label}
                    icon={badge.icon}
                    label={badge.label}
                    size="small"
                    sx={{
                      bgcolor: "#e8f5e9",
                      color: "primary.dark",
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: "primary.main" },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Chip
                label={product.category}
                size="small"
                sx={{ bgcolor: "#e8f5e9", color: "primary.dark", fontWeight: 600, mb: 1 }}
              />
              <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.2 }}>
                {product.name}
              </Typography>

              <Typography variant="h3" fontWeight={800} color="primary.dark" sx={{ mt: 2 }}>
                L.{Number(product.price).toFixed(2)}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Descripcion
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2.5 }}>
                {features.map((feature) => (
                  <Box key={feature.text} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {feature.icon}
                    <Typography variant="body2" color="text.secondary">
                      {feature.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Cantidad:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <IconButton size="small" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2.5, py: 0.5, fontWeight: 600, minWidth: 40, textAlign: "center" }}>
                    {quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => setQuantity((q) => q + 1)}>
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                  "&:hover": { boxShadow: "0 6px 20px rgba(46, 125, 50, 0.4)" },
                }}
              >
                Agregar al carrito - L.{(Number(product.price) * quantity).toFixed(2)}
              </Button>
            </Box>
          </Box>

          {related.length > 0 && (
            <Box sx={{ mt: 7 }}>
              <Typography variant="h5" fontWeight={700} color="primary.dark" gutterBottom>
                Tambien te puede interesar
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {related.map((item) => (
                  <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <RelatedCard product={item} navigate={navigate} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

export default ProductDetail;
