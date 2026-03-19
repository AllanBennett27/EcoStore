import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/ProductForm";
import AdminReports from "./pages/admin/AdminReports";
import RoleManagement from "./pages/admin/RoleManagement";
import AdminGuard from "./components/AdminGuard";
import RoleGuard from "./components/RoleGuard";
import VentasDashboard from "./pages/ventas/VentasDashboard";
import VentasPedidos from "./pages/ventas/VentasPedidos";
import VentasStock from "./pages/ventas/VentasStock";
import VentasClientes from "./pages/ventas/VentasClientes";
import VentasCarritos from "./pages/ventas/VentasCarritos";
import FinanzasDashboard from "./pages/finanzas/FinanzasDashboard";
import FinanzasFacturas from "./pages/finanzas/FinanzasFacturas";
import FinanzasReportes from "./pages/finanzas/FinanzasReportes";

function AuthSnackbar() {
  const { notification, closeNotification } = useAuth();
  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={3500}
      onClose={closeNotification}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={closeNotification}
        severity={notification?.severity ?? "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <FavoritosProvider>
          <CartProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
              <Route path="/admin/products/new" element={<AdminGuard><ProductForm /></AdminGuard>} />
              <Route
                path="/admin/products/edit/:id"
                element={<AdminGuard><ProductForm /></AdminGuard>}
              />
              <Route path="/admin/reports" element={<AdminGuard><AdminReports /></AdminGuard>} />
              <Route path="/admin/roles" element={<AdminGuard><RoleManagement /></AdminGuard>} />
              <Route path="/ventas" element={<RoleGuard roles={['ventas','admin']}><VentasDashboard /></RoleGuard>} />
              <Route path="/ventas/pedidos" element={<RoleGuard roles={['ventas','admin']}><VentasPedidos /></RoleGuard>} />
              <Route path="/ventas/stock" element={<RoleGuard roles={['ventas','admin']}><VentasStock /></RoleGuard>} />
              <Route path="/ventas/clientes" element={<RoleGuard roles={['ventas','admin']}><VentasClientes /></RoleGuard>} />
              <Route path="/ventas/carritos" element={<RoleGuard roles={['ventas','admin']}><VentasCarritos /></RoleGuard>} />
              <Route path="/finanzas" element={<RoleGuard roles={['finanzas','admin']}><FinanzasDashboard /></RoleGuard>} />
              <Route path="/finanzas/facturas" element={<RoleGuard roles={['finanzas','admin']}><FinanzasFacturas /></RoleGuard>} />
              <Route path="/finanzas/reportes" element={<RoleGuard roles={['finanzas','admin']}><FinanzasReportes /></RoleGuard>} />
            </Routes>
            <AuthSnackbar />
          </CartProvider>
          </FavoritosProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
