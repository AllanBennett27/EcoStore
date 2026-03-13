import { useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { AddShoppingCart, Add, Remove, ArrowBack } from "@mui/icons-material";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Header />
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h5" color="text.secondary">
            Producto no encontrado
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            sx={{ mt: 3 }}
          >
            Volver a productos
          </Button>
        </Box>
      </Box>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />

      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        {/* Back button + Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Button
            component={RouterLink}
            to="/products"
            startIcon={<ArrowBack />}
            size="small"
          >
            Volver
          </Button>
          <Breadcrumbs>
            <Link
              component={RouterLink}
              to="/products"
              underline="hover"
              color="primary"
            >
              Productos
            </Link>
            <Typography color="text.secondary">{product.category}</Typography>
            <Typography color="text.primary" fontWeight={500}>
              {product.name}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Product Image */}
          <Box
            sx={{
              flex: 1,
              bgcolor: product.color,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              position: "relative",
            }}
          >
            <Typography sx={{ fontSize: 140 }}>{product.emoji}</Typography>
          </Box>

          {/* Product Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="primary.main" fontWeight={600}>
              {product.category}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
              {product.name}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="primary.dark"
              sx={{ mt: 2 }}
            >
              L.{product.price.toFixed(2)}
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Descripcion
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8 }}
            >
              {product.fullDescription}
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            {/* Quantity Selector */}
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
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography
                  sx={{
                    px: 2.5,
                    py: 0.5,
                    fontWeight: 600,
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1rem",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
                },
              }}
            >
              Agregar al carrito
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductDetail;
