import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CardMedia,
  IconButton,
} from "@mui/material";
import {
  AddShoppingCart,
  EnergySavingsLeaf,
  Image as ImageIcon,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useFavoritos } from "../context/FavoritosContext";

function ProductCard({ product, onAddToCart }) {
  const { user, isAdmin, isVentas, isFinanzas } = useAuth();
  const isStaff = isAdmin || isVentas || isFinanzas;
  const { isFavorito, toggleFavorito } = useFavoritos();
  const esFav = isFavorito(product.id);

  const handleFavorito = (e) => {
    e.preventDefault(); // evitar navegar al detalle
    toggleFavorito(product.id);
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(46, 125, 50, 0.18)",
        },
      }}
    >
      <Box
        component={RouterLink}
        to={`/products/${product.id}`}
        sx={{
          height: 200,
          bgcolor: "#f1f8e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "12px 12px 0 0",
          textDecoration: "none",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {product.imageUrl ? (
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImageIcon sx={{ fontSize: 64, color: "primary.main" }} />
        )}

        {/* Chip categoría */}
        <Chip
          icon={<EnergySavingsLeaf sx={{ fontSize: "14px !important", color: "#fff !important" }} />}
          label={product.category}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            bgcolor: "rgba(27,94,32,0.85)",
            color: "#fff",
            fontSize: "0.68rem",
            fontWeight: 600,
            height: 22,
            backdropFilter: "blur(4px)",
          }}
        />

        {/* Corazón — solo para clientes */}
        {user && !isStaff && (
          <IconButton
            onClick={handleFavorito}
            sx={{
              position: "absolute",
              top: 4,
              right: 18,
              bgcolor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              p: 0.5,
            }}
          >
            {esFav
              ? <Favorite sx={{ fontSize: 30, color: "error.main" }} />
              : <FavoriteBorder sx={{ fontSize: 30, color: "error.light" }} />
            }
          </IconButton>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1, pt: 1.5 }}>
        <Typography
          component={RouterLink}
          to={`/products/${product.id}`}
          variant="subtitle1"
          fontWeight={600}
          sx={{
            display: "block",
            textDecoration: "none",
            color: "text.primary",
            lineHeight: 1.3,
            mb: 0.5,
            "&:hover": { color: "primary.main" },
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {product.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="caption" color="text.disabled" sx={{ display: "block", lineHeight: 1 }}>
            Precio
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ lineHeight: 1.2 }}>
            L.{Number(product.price).toFixed(2)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 0.3, fontWeight: 500 }}
            color={product.stock === 0 ? "error.main" : product.stock <= 5 ? "warning.main" : "success.main"}
          >
            Stock Disponible: {product.stock}
          </Typography>
        </Box>
        {!isStaff && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddShoppingCart />}
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(46, 125, 50, 0.25)",
              "&:hover": { boxShadow: "0 4px 12px rgba(46, 125, 50, 0.35)" },
            }}
          >
            {product.stock === 0 ? "Sin stock" : "Agregar"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default ProductCard;
