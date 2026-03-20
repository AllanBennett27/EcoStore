import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  InputBase,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  EnergySavingsLeaf,
  Search,
  ShoppingCart,
  AccountCircle,
  Logout,
  Person,
  Inventory,
  Assessment,
  ManageAccounts,
  PointOfSale,
  AccountBalance,
  LocationOn,
  People,
  ShoppingCartCheckout,
  WarningAmber,
  Receipt,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header({ showSearch = false, showCart = true, searchValue = "", onSearchChange }) {
  const { cartCount, clearCart } = useCart();
  const { user, isAdmin, isVentas, isFinanzas, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    clearCart();
    navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "primary.dark" }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Branding */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <EnergySavingsLeaf sx={{ fontSize: 32 }} />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            EcoStore
          </Typography>
        </Box>

        {/* Location widget — visible solo cuando hay sesión */}
        {user && (user.ciudad || user.pais) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
            <LocationOn sx={{ color: "rgba(255,255,255,0.85)", fontSize: 22, flexShrink: 0 }} />
            <Box sx={{ lineHeight: 1.2 }}>
              {user.ciudad && (
                <Typography variant="caption" sx={{ display: "block", color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {user.ciudad}
                </Typography>
              )}
              {user.pais && (
                <Typography variant="caption" sx={{ display: "block", color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>
                  {user.pais}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Search Bar - only on products and cart pages */}
        {showSearch && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                px: 2,
                width: "100%",
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
              }}
            >
              <Search sx={{ color: "rgba(255,255,255,0.7)", mr: 1 }} />
              <InputBase
                placeholder="Buscar productos..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{
                  color: "#fff",
                  flex: 1,
                  py: 0.8,
                  "& ::placeholder": { color: "rgba(255,255,255,0.7)" },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Spacer when no search bar */}
        {!showSearch && <Box sx={{ flex: 1 }} />}

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {!isAdmin && !isVentas && !isFinanzas && showCart && (
            <IconButton
              color="inherit"
              onClick={() => navigate("/cart")}
            >
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          )}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                sx: { borderRadius: 1, minWidth: 200, mt: 1 },
              },
            }}
          >
            {user ? (
              <>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Mi perfil
                </MenuItem>
                {!isAdmin && !isVentas && !isFinanzas && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/mis-pedidos"); }}>
                    <ListItemIcon>
                      <Receipt fontSize="small" color="primary" />
                    </ListItemIcon>
                    Mis pedidos
                  </MenuItem>
                )}
                {isAdmin && <Divider />}
                {isAdmin && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/products"); }}>
                    <ListItemIcon>
                      <Inventory fontSize="small" color="primary" />
                    </ListItemIcon>
                    Panel Admin
                  </MenuItem>
                )}
                {isAdmin && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/reports"); }}>
                    <ListItemIcon>
                      <Assessment fontSize="small" color="primary" />
                    </ListItemIcon>
                    Reportes
                  </MenuItem>
                )}
                {isAdmin && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/roles"); }}>
                    <ListItemIcon>
                      <ManageAccounts fontSize="small" color="primary" />
                    </ListItemIcon>
                    Gestión de Roles
                  </MenuItem>
                )}
                {isAdmin && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/concurrencia"); }}>
                    <ListItemIcon>
                      <WarningAmber fontSize="small" color="error" />
                    </ListItemIcon>
                    Logs de Concurrencia
                  </MenuItem>
                )}
                {(isAdmin || isVentas) && <Divider />}
                {(isAdmin || isVentas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/ventas"); }}>
                    <ListItemIcon>
                      <PointOfSale fontSize="small" color="success" />
                    </ListItemIcon>
                    Panel de Ventas
                  </MenuItem>
                )}
                {(isAdmin || isVentas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/ventas/pedidos"); }}>
                    <ListItemIcon>
                      <PointOfSale fontSize="small" color="success" />
                    </ListItemIcon>
                    Gestión de Pedidos
                  </MenuItem>
                )}
                {(isAdmin || isVentas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/ventas/stock"); }}>
                    <ListItemIcon>
                      <Inventory fontSize="small" color="success" />
                    </ListItemIcon>
                    Stock de Productos
                  </MenuItem>
                )}
                {(isAdmin || isVentas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/ventas/clientes"); }}>
                    <ListItemIcon>
                      <People fontSize="small" color="success" />
                    </ListItemIcon>
                    Clientes por Ventas
                  </MenuItem>
                )}
                {(isAdmin || isVentas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/ventas/carritos"); }}>
                    <ListItemIcon>
                      <ShoppingCartCheckout fontSize="small" color="success" />
                    </ListItemIcon>
                    Carritos Activos
                  </MenuItem>
                )}
                {(isAdmin || isFinanzas) && <Divider />}
                {(isAdmin || isFinanzas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/finanzas"); }}>
                    <ListItemIcon>
                      <AccountBalance fontSize="small" color="warning" />
                    </ListItemIcon>
                    Panel de Finanzas
                  </MenuItem>
                )}
                {(isAdmin || isFinanzas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/finanzas/facturas"); }}>
                    <ListItemIcon>
                      <AccountBalance fontSize="small" color="warning" />
                    </ListItemIcon>
                    Facturas
                  </MenuItem>
                )}
                {(isAdmin || isFinanzas) && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/finanzas/reportes"); }}>
                    <ListItemIcon>
                      <Assessment fontSize="small" color="warning" />
                    </ListItemIcon>
                    Reportes Financieros
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  Cerrar sesion
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => { handleMenuClose(); navigate("/auth"); }}>
                <ListItemIcon>
                  <Person fontSize="small" color="primary" />
                </ListItemIcon>
                Iniciar sesion
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
