import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingBag,
  ArrowBack,
  RemoveShoppingCart,
  Lock,
  Image as ImageIcon,
} from "@mui/icons-material";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useCart();
  const { user } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Busca el stock actual del producto en ProductsContext (actualizado en tiempo real)
  const getStock = (productId) =>
    products.find((p) => p.id === productId)?.stock ?? Infinity;

  const filteredItems = cartItems.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.product.name.toLowerCase().includes(q) ||
      item.product.description.toLowerCase().includes(q)
    );
  });

  const shipping = cartTotal > 500 ? 0 : 50;
  const total = cartTotal + shipping;

  if (!user) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Header showSearch searchValue={search} onSearchChange={setSearch} />
        <Box sx={{ textAlign: "center", py: 12, px: 2 }}>
          <Lock sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Tu carrito esta vacio
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Inicia sesion para ver tus compras y gestionar tu carrito.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/auth")}
            sx={{ borderRadius: 3, px: 4, boxShadow: "0 4px 12px rgba(46,125,50,0.3)" }}
          >
            Iniciar sesion
          </Button>
          <Box sx={{ mt: 2 }}>
            <Button
              component={RouterLink}
              to="/products"
              startIcon={<ShoppingBag />}
              color="inherit"
            >
              Ver productos
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Header showSearch searchValue={search} onSearchChange={setSearch} />
        <Box sx={{ textAlign: "center", py: 10 }}>
          <RemoveShoppingCart
            sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Tu carrito esta vacio
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Agrega productos ecologicos para comenzar tu compra.
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            sx={{ borderRadius: 3 }}
          >
            Ver productos
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header showSearch searchValue={search} onSearchChange={setSearch} />

      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            Carrito de compras ({cartItems.length}{" "}
            {cartItems.length === 1 ? "producto" : "productos"})
          </Typography>
          <Button
            color="error"
            startIcon={<RemoveShoppingCart />}
            onClick={clearCart}
          >
            Vaciar carrito
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Cart Items */}
          <Box sx={{ flex: 1 }}>
            {filteredItems.map(({ product, quantity }) => {
              const stock        = getStock(product.id);
              const excedeLimite = stock !== Infinity && quantity > stock;
              return (
                <Card
                  key={product.id}
                  elevation={1}
                  sx={{
                    mb: 2, borderRadius: 3,
                    border: excedeLimite ? '1px solid' : 'none',
                    borderColor: excedeLimite ? 'error.main' : 'transparent',
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      py: 2,
                      "&:last-child": { pb: 2 },
                    }}
                  >
                    {/* Product Image */}
                    <Box
                      component={RouterLink}
                      to={`/products/${product.id}`}
                      sx={{
                        width: 80, height: 80, minWidth: 80,
                        bgcolor: "#f1f8e9", borderRadius: 2,
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none", overflow: "hidden",
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
                        <ImageIcon sx={{ fontSize: 40, color: "primary.main" }} />
                      )}
                    </Box>

                    {/* Product Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        component={RouterLink}
                        to={`/products/${product.id}`}
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          textDecoration: "none",
                          color: "text.primary",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {product.description}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight={500}>
                        L.{Number(product.price).toFixed(2)} c/u
                      </Typography>
                      {/* Stock disponible */}
                      {stock !== Infinity && (
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color={
                            stock === 0 ? "error.main"
                            : stock <= 5 ? "warning.main"
                            : "success.main"
                          }
                        >
                          {stock === 0
                            ? "Sin stock"
                            : excedeLimite
                            ? `Solo quedan ${stock} en stock`
                            : `Stock disponible: ${stock}`}
                        </Typography>
                      )}
                    </Box>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        display: "flex", alignItems: "center",
                        border: "1px solid", borderColor: "divider", borderRadius: 2,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 1.5, fontWeight: 600, minWidth: 32, textAlign: "center" }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        disabled={stock !== Infinity && quantity >= stock}
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Subtotal */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="primary.dark"
                      sx={{ minWidth: 90, textAlign: "right" }}
                    >
                      L.{(Number(product.price) * quantity).toFixed(2)}
                    </Typography>

                    {/* Remove */}
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Delete />
                    </IconButton>
                  </CardContent>
                </Card>
              );
            })}

            <Button
              component={RouterLink}
              to="/products"
              startIcon={<ArrowBack />}
              sx={{ mt: 1 }}
            >
              Seguir comprando
            </Button>
          </Box>

          {/* Order Summary */}
          <Card
            elevation={2}
            sx={{
              width: { xs: "100%", md: 340 },
              minWidth: { md: 340 },
              borderRadius: 3,
              alignSelf: "flex-start",
              position: { md: "sticky" },
              top: { md: 80 },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Resumen del pedido
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight={500}>
                  L.{cartTotal.toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography color="text.secondary">Envio</Typography>
                <Typography
                  fontWeight={500}
                  color={shipping === 0 ? "success.main" : "text.primary"}
                >
                  {shipping === 0 ? "Gratis" : `L.${shipping.toFixed(2)}`}
                </Typography>
              </Box>

              {shipping > 0 && (
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ display: "block", mb: 1.5 }}
                >
                  Envio gratis en compras mayores a L.500.00
                </Typography>
              )}

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  L.{total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/checkout')}
                sx={{
                  py: 1.4,
                  fontSize: "1rem",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
                  },
                }}
              >
                Proceder al pago
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default Cart;
