import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Alert,
} from "@mui/material";
import {
  EnergySavingsLeaf,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Home,
  LocationOn,
  Public,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const EMPTY_REGISTER = {
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  confirmPassword: "",
  telefono: "",
  departamento: "",
  pais: "",
};

function Auth() {
  const navigate = useNavigate();
  const { login, register, loading, error, clearError } = useAuth();
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER);

  const handleTabChange = (_, v) => {
    setTab(v);
    clearError();
    setRegisterSuccess(false);
  };

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const passwordMismatch =
    registerData.confirmPassword !== "" &&
    registerData.password !== registerData.confirmPassword;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      const role = result.role;
      if (role.includes("admin"))    navigate("/admin/products");
      else if (role.includes("ventas"))   navigate("/ventas");
      else if (role.includes("finanzas")) navigate("/finanzas");
      else navigate("/");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (passwordMismatch) return;
    const result = await register({
      nombre:       registerData.nombre,
      apellido:     registerData.apellido,
      correo:       registerData.correo,
      password:     registerData.password,
      telefono:     registerData.telefono || "",
      departamento: registerData.departamento,
      pais:         registerData.pais,
    });
    if (result.success) {
      setRegisterSuccess(true);
      setRegisterData(EMPTY_REGISTER);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #1b5e20 0%, #2e7d32 30%, #4caf50 60%, #81c784 100%)",
        padding: 2,
        position: "relative",
      }}
    >
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          color: "#fff",
          "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
        }}
      >
        <Home sx={{ fontSize: 36, fontWeight: 900 }} />
      </IconButton>
      <Card
        elevation={12}
        sx={{ width: "100%", maxWidth: 560, borderRadius: 4, overflow: "visible" }}
      >
        {/* Branding */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 4,
            pb: 1,
          }}
        >
          <Box
            onClick={() => navigate("/")}
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
              boxShadow: "0 4px 14px rgba(46, 125, 50, 0.4)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: "0 6px 18px rgba(46, 125, 50, 0.55)",
              },
            }}
          >
            <EnergySavingsLeaf sx={{ fontSize: 36, color: "#fff" }} />
          </Box>
          <Typography variant="h4" fontWeight={700} color="primary.dark">
            EcoStore
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tu tienda ecologica en linea
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mx: 3,
            mt: 1,
            "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
          }}
        >
          <Tab label="Iniciar Sesion" sx={{ fontWeight: 600 }} />
          <Tab label="Registrarse" sx={{ fontWeight: 600 }} />
        </Tabs>

        <Divider />

        <CardContent sx={{ px: 4, py: 3 }}>
          {/* Login Form */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleLoginSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                size="small"
                label="Correo electronico"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                margin="normal"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Contrasena"
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={handleLoginChange}
                margin="normal"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 1,
                  py: 1.2,
                  fontSize: "1rem",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                  "&:hover": { boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)" },
                }}
              >
                {loading ? "Iniciando..." : "Iniciar Sesion"}
              </Button>

              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                No tienes una cuenta?{" "}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  color="primary"
                  fontWeight={600}
                  underline="hover"
                  onClick={() => handleTabChange(null, 1)}
                >
                  Registrate aqui
                </Link>
              </Typography>
            </Box>
          )}

          {/* Register Form */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleRegisterSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {registerSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Cuenta creada exitosamente. Inicia sesion.
                </Alert>
              )}

              {/* Nombre | Apellido */}
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nombre"
                  name="nombre"
                  value={registerData.nombre}
                  onChange={handleRegisterChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Apellido"
                  name="apellido"
                  value={registerData.apellido}
                  onChange={handleRegisterChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Telefono (opcional)"
                name="telefono"
                value={registerData.telefono}
                onChange={handleRegisterChange}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Ubicación */}
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Departamento"
                  name="departamento"
                  value={registerData.departamento}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="País"
                  name="pais"
                  value={registerData.pais}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Public color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Correo electronico"
                name="correo"
                type="email"
                value={registerData.correo}
                onChange={handleRegisterChange}
                margin="normal"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Contrasena"
                name="password"
                type={showPassword ? "text" : "password"}
                value={registerData.password}
                onChange={handleRegisterChange}
                margin="normal"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Confirmar contrasena"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                margin="normal"
                required
                error={passwordMismatch}
                helperText={passwordMismatch ? "Las contrasenas no coinciden" : ""}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || passwordMismatch}
                sx={{
                  mt: 3,
                  mb: 1,
                  py: 1.2,
                  fontSize: "1rem",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                  "&:hover": { boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)" },
                }}
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </Button>

              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Ya tienes una cuenta?{" "}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  color="primary"
                  fontWeight={600}
                  underline="hover"
                  onClick={() => handleTabChange(null, 0)}
                >
                  Inicia sesion
                </Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Auth;
