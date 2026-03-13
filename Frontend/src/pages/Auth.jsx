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
  Checkbox,
  FormControlLabel,
  Divider,
  Link,
} from "@mui/material";
import {
  EnergySavingsLeaf,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginData.email, loginData.password);
    navigate("/");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register(registerData.name, registerData.email, registerData.password);
    navigate("/");
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
      }}
    >
      <Card
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 4,
          overflow: "visible",
        }}
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
            }}
          >
            <EnergySavingsLeaf sx={{ fontSize: 36, color: "#fff" }} />
          </Box>
          <Typography variant="h4" fontWeight={700} color="primary.dark">
            Ecostore
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tu tienda ecologica en linea
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            mx: 3,
            mt: 1,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 2,
            },
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
              <TextField
                fullWidth
                label="Correo electronico"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Contrasena"
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={handleLoginChange}
                margin="normal"
                InputProps={{
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
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={<Checkbox size="small" color="primary" />}
                  label={<Typography variant="body2">Recordarme</Typography>}
                />
                <Link
                  href="#"
                  variant="body2"
                  color="primary"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  Olvidaste tu contrasena?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  mb: 1,
                  py: 1.4,
                  fontSize: "1rem",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
                  },
                }}
              >
                Iniciar Sesion
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
                  onClick={() => setTab(1)}
                >
                  Registrate aqui
                </Link>
              </Typography>
            </Box>
          )}

          {/* Register Form */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <TextField
                fullWidth
                label="Nombre completo"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Correo electronico"
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Contrasena"
                name="password"
                type={showPassword ? "text" : "password"}
                value={registerData.password}
                onChange={handleRegisterChange}
                margin="normal"
                InputProps={{
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
                }}
              />
              <TextField
                fullWidth
                label="Confirmar contrasena"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  mb: 1,
                  py: 1.4,
                  fontSize: "1rem",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(46, 125, 50, 0.4)",
                  },
                }}
              >
                Crear Cuenta
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
                  onClick={() => setTab(0)}
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
