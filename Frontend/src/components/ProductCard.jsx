import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";

function ProductCard({ product, onAddToCart }) {
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
          boxShadow: "0 8px 24px rgba(46, 125, 50, 0.15)",
        },
      }}
    >
      {/* Product Image Placeholder */}
      <Box
        component={RouterLink}
        to={`/products/${product.id}`}
        sx={{
          height: 200,
          bgcolor: product.color || "primary.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "12px 12px 0 0",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        <Typography sx={{ fontSize: 64, filter: "grayscale(0)" }}>
          {product.emoji}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {product.category}
        </Typography>
        <Typography
          component={RouterLink}
          to={`/products/${product.id}`}
          variant="h6"
          fontWeight={600}
          sx={{
            mt: 0.5,
            lineHeight: 1.3,
            display: "block",
            textDecoration: "none",
            color: "text.primary",
            "&:hover": { color: "primary.main" },
          }}
        >
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {product.description}
        </Typography>
      </CardContent>

      <CardActions
        sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}
      >
        <Typography variant="h6" fontWeight={700} color="primary.dark">
          L.{product.price.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddShoppingCart />}
          onClick={() => onAddToCart(product)}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(46, 125, 50, 0.25)",
          }}
        >
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
