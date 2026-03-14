import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
import { Person, Phone, Home, Email, Save } from "@mui/icons-material";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.name || "",
    apellido: user?.apellido || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      name: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono,
      direccion: form.direccion,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />

      <Box sx={{ maxWidth: 600, mx: "auto", px: 3, py: 5 }}>
        {/* Avatar + name display */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "primary.main",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary.dark">
              Mi Perfil
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Informacion personal
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {saved && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Perfil actualizado correctamente.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Correo electronico"
                value={user?.email || ""}
                disabled
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Telefono (opcional)"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Direccion (opcional)"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                sx={{
                  mt: 3,
                  py: 1.3,
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                  "&:hover": { boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)" },
                }}
              >
                Guardar cambios
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Profile;
