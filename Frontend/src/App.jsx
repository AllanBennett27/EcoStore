import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/ProductForm";
import AdminReports from "./pages/admin/AdminReports";
import RoleManagement from "./pages/admin/RoleManagement";
import AdminGuard from "./components/AdminGuard";
import VentasDashboard from "./pages/ventas/VentasDashboard";
import VentasPedidos from "./pages/ventas/VentasPedidos";
import VentasStock from "./pages/ventas/VentasStock";
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
          <CartProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
              <Route path="/admin/products/new" element={<AdminGuard><ProductForm /></AdminGuard>} />
              <Route
                path="/admin/products/edit/:id"
                element={<AdminGuard><ProductForm /></AdminGuard>}
              />
              <Route path="/admin/reports" element={<AdminGuard><AdminReports /></AdminGuard>} />
              <Route path="/admin/roles" element={<AdminGuard><RoleManagement /></AdminGuard>} />
              <Route path="/ventas" element={<VentasDashboard />} />
              <Route path="/ventas/pedidos" element={<VentasPedidos />} />
              <Route path="/ventas/stock" element={<VentasStock />} />
              <Route path="/finanzas" element={<FinanzasDashboard />} />
              <Route path="/finanzas/facturas" element={<FinanzasFacturas />} />
              <Route path="/finanzas/reportes" element={<FinanzasReportes />} />
            </Routes>
            <AuthSnackbar />
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
