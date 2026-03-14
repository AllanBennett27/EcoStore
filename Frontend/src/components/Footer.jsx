import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Link,
  Divider,
} from "@mui/material";
import { EnergySavingsLeaf, LocationOn } from "@mui/icons-material";
import { categoriasService } from "../services/api";

const quickLinks = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/products" },
  { label: "Carrito", to: "/cart" },
  { label: "Mi Perfil", to: "/profile" },
];

function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriasService.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #1b5e20 0%, #0a3d0a 100%)",
        color: "#fff",
        pt: 6,
        pb: 2,
        mt: "auto",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <EnergySavingsLeaf sx={{ fontSize: 32, color: "#81c784" }} />
              <Typography variant="h5" fontWeight={700}>
                EcoStore
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}
            >
              Tu destino para productos sostenibles y ecologicos. Cada compra es
              un paso hacia un planeta mas verde y un futuro mejor para todos.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#81c784" }}>
              Navegacion
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.875rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#a5d6a7" },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Categories */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#81c784" }}>
              Categorias
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {categories.map((cat) => {
                const name = cat.nombreCategoria ?? cat.nombre ?? cat;
                return (
                  <Link
                    key={name}
                    component={RouterLink}
                    to={`/products?category=${encodeURIComponent(name)}`}
                    underline="none"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.875rem",
                      transition: "color 0.2s",
                      "&:hover": { color: "#a5d6a7" },
                    }}
                  >
                    {name}
                  </Link>
                );
              })}
            </Box>
          </Grid>

          {/* Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>
              Base de Datos 2
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, mt: 0.5, color: "#81c784" }}>
              Ubicacion
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn sx={{ fontSize: 18, color: "#81c784" }} />
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Ceutec Honduras
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} EcoStore. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Hecho con 💚 para un planeta mejor
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
