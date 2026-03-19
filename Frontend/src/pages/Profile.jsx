import { useState, useEffect } from "react";
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment,
  Alert, Avatar, Divider, Grid, IconButton, Tooltip, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import {
  Person, Phone, Email, Save, LocationOn, Add, Edit, Delete, Star,
  CreditCard, Payments,
} from "@mui/icons-material";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { direccionService, metodoPagoService } from "../services/api";

const DIR_EMPTY = { Calle: "", Ciudad: "", Departamento: "", Pais: "", CodigoPostal: "", EsPrincipal: false };

function validateDireccion(d) {
  const e = {};
  if (!d.Calle.trim())        e.Calle        = "Requerido.";
  if (!d.Ciudad.trim())       e.Ciudad       = "Requerido.";
  if (!d.Departamento.trim()) e.Departamento = "Requerido.";
  if (!d.Pais.trim())         e.Pais         = "Requerido.";
  return e;
}

function Profile() {
  const { user, updateUser } = useAuth();

  // ── Perfil personal ──
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nombre:   user?.name      || "",
    apellido: user?.apellido  || "",
    telefono: user?.telefono  || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ name: form.nombre, apellido: form.apellido, telefono: form.telefono });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Direcciones de envío ──
  const [dirs, setDirs]             = useState([]);
  const [dirLoading, setDirLoading] = useState(true);
  const [dirDialog, setDirDialog]   = useState(false);
  const [editingDir, setEditingDir] = useState(null);
  const [dirForm, setDirForm]       = useState(DIR_EMPTY);
  const [dirErrors, setDirErrors]   = useState({});
  const [dirSaving, setDirSaving]   = useState(false);

  useEffect(() => {
    direccionService.getAll()
      .then((res) => setDirs(res.data ?? []))
      .catch(() => {})
      .finally(() => setDirLoading(false));
  }, []);

  const openNew = () => {
    setEditingDir(null);
    setDirForm({ ...DIR_EMPTY, EsPrincipal: dirs.length === 0 });
    setDirErrors({});
    setDirDialog(true);
  };

  const openEdit = (d) => {
    setEditingDir(d);
    setDirForm({
      Calle: d.calle, Ciudad: d.ciudad, Departamento: d.departamento,
      Pais: d.pais, CodigoPostal: d.codigoPostal ?? "", EsPrincipal: d.esPrincipal,
    });
    setDirErrors({});
    setDirDialog(true);
  };

  const handleDirFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDirForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (dirErrors[name]) setDirErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSaveDir = async () => {
    const e = validateDireccion(dirForm);
    if (Object.keys(e).length > 0) { setDirErrors(e); return; }
    setDirSaving(true);
    try {
      if (editingDir) {
        const res = await direccionService.update(editingDir.idDireccion, dirForm);
        const updated = res.data;
        setDirs((p) => p.map((d) => {
          if (d.idDireccion === editingDir.idDireccion) return updated;
          if (updated.esPrincipal) return { ...d, esPrincipal: false };
          return d;
        }));
      } else {
        const res = await direccionService.create(dirForm);
        const created = res.data;
        setDirs((p) => {
          const base = created.esPrincipal ? p.map((d) => ({ ...d, esPrincipal: false })) : p;
          return [...base, created];
        });
      }
      setDirDialog(false);
    } catch {
      setDirErrors({ general: "Error al guardar la dirección." });
    } finally {
      setDirSaving(false);
    }
  };

  const handleDeleteDir = async (id) => {
    try {
      await direccionService.delete(id);
      setDirs((p) => p.filter((d) => d.idDireccion !== id));
    } catch { /* silencioso */ }
  };

  const handleSetPrincipal = async (id) => {
    try {
      await direccionService.setPrincipal(id);
      setDirs((p) => p.map((d) => ({ ...d, esPrincipal: d.idDireccion === id })));
    } catch { /* silencioso */ }
  };

  // ── Métodos de pago ──
  const CARD_EMPTY = { numero: "", titular: "", vencimiento: "", cvv: "" };
  const [metodos, setMetodos]               = useState([]);
  const [metodoLoading, setMetodoLoading]   = useState(true);
  const [metodoDialog, setMetodoDialog]     = useState(false);
  const [editingMetodo, setEditingMetodo]   = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("tarjeta");
  const [card, setCard]                     = useState(CARD_EMPTY);
  const [cardEsPrincipal, setCardEsPrincipal] = useState(false);
  const [cardErrors, setCardErrors]         = useState({});
  const [cardSaving, setCardSaving]         = useState(false);

  useEffect(() => {
    metodoPagoService.getAll()
      .then((res) => setMetodos(res.data ?? []))
      .catch(() => {})
      .finally(() => setMetodoLoading(false));
  }, []);

  const formatCardNumber = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "numero") value = formatCardNumber(value);
    if (name === "cvv")    value = value.replace(/\D/g, "").slice(0, 4);
    setCard((p) => ({ ...p, [name]: value }));
    if (cardErrors[name]) setCardErrors((p) => ({ ...p, [name]: "" }));
  };

  const openMetodoDialog = (m = null) => {
    setEditingMetodo(m);
    setCardErrors({});
    if (m) {
      setTipoSeleccionado(m.tipo);
      setCard({ ...CARD_EMPTY, titular: m.proveedor ?? "" });
      setCardEsPrincipal(m.esPrincipal);
    } else {
      setCard(CARD_EMPTY);
      setTipoSeleccionado("tarjeta");
      setCardEsPrincipal(metodos.length === 0);
    }
    setMetodoDialog(true);
  };

  const handleSaveMetodo = async () => {
    if (tipoSeleccionado === "tarjeta") {
      const e = {};
      const digits = card.numero.replace(/\s/g, "");
      if (!editingMetodo && (!digits || digits.length < 16)) e.numero = "Debe tener 16 dígitos.";
      if (!card.titular.trim()) e.titular = "Requerido.";
      if (!editingMetodo && !card.vencimiento) e.vencimiento = "Requerido.";
      if (!editingMetodo && (!card.cvv || card.cvv.length < 3)) e.cvv = "Mínimo 3 dígitos.";
      if (Object.keys(e).length > 0) { setCardErrors(e); return; }
    }
    setCardSaving(true);
    try {
      const dto = tipoSeleccionado === "tarjeta"
        ? {
            Tipo: "tarjeta",
            UltimosDigitos: editingMetodo
              ? (card.numero.replace(/\s/g, "").slice(-4) || editingMetodo.ultimosDigitos)
              : card.numero.replace(/\s/g, "").slice(-4),
            Proveedor: card.titular,
            EsPrincipal: cardEsPrincipal,
          }
        : { Tipo: "efectivo", EsPrincipal: cardEsPrincipal };

      if (editingMetodo) {
        await metodoPagoService.delete(editingMetodo.idMetodo);
      }
      const res = await metodoPagoService.create(dto);
      const created = res.data;
      setMetodos((p) => {
        const filtered = editingMetodo ? p.filter((m) => m.idMetodo !== editingMetodo.idMetodo) : p;
        const base = created.esPrincipal ? filtered.map((m) => ({ ...m, esPrincipal: false })) : filtered;
        return [...base, created];
      });
      setMetodoDialog(false);
    } catch {
      setCardErrors({ general: "Error al guardar el método de pago." });
    } finally {
      setCardSaving(false);
    }
  };

  const handleDeleteMetodo = async (id) => {
    try {
      await metodoPagoService.delete(id);
      setMetodos((p) => p.filter((m) => m.idMetodo !== id));
    } catch { /* silencioso */ }
  };

  const handleSetMetodoPrincipal = async (id) => {
    try {
      await metodoPagoService.setPrincipal(id);
      setMetodos((p) => p.map((m) => ({ ...m, esPrincipal: m.idMetodo === id })));
    } catch { /* silencioso */ }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />

      <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 5, display: "flex", flexDirection: "column", gap: 3 }}>

        {/* Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 28, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary.dark">Mi Perfil</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>

        {/* ── Fila superior: Info personal (izq) + Métodos de pago (der) ── */}
        <Grid container spacing={3} alignItems="stretch">
          {/* Información personal */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Información personal</Typography>
                <Divider sx={{ mb: 3 }} />
                {saved && <Alert severity="success" sx={{ mb: 3 }}>Perfil actualizado correctamente.</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField fullWidth label="Nombre" name="nombre" value={form.nombre}
                    onChange={handleChange} required sx={{ mb: 2 }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment> } }} />
                  <TextField fullWidth label="Apellido" name="apellido" value={form.apellido}
                    onChange={handleChange} required sx={{ mb: 1 }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment> } }} />
                  <TextField fullWidth label="Correo electrónico" value={user?.email || ""} disabled margin="normal"
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email color="disabled" /></InputAdornment> } }} />
                  <TextField fullWidth label="Teléfono (opcional)" name="telefono" value={form.telefono}
                    onChange={handleChange} margin="normal"
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><Phone color="primary" /></InputAdornment> } }} />
                  <Button type="submit" variant="contained" size="large" startIcon={<Save />}
                    sx={{ mt: 3, py: 1.3, borderRadius: 3, boxShadow: "0 4px 12px rgba(46,125,50,0.3)" }}>
                    Guardar cambios
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Métodos de pago */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>Métodos de pago</Typography>
                  <Button size="small" startIcon={<Add />} onClick={() => openMetodoDialog()}>Nuevo</Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {metodoLoading ? (
                  <CircularProgress size={24} />
                ) : metodos.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <CreditCard sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No tienes métodos de pago guardados.
                    </Typography>
                    <Button variant="outlined" startIcon={<Add />} onClick={() => openMetodoDialog()}
                      sx={{ borderStyle: "dashed", borderRadius: 2 }}>
                      Agregar método de pago
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {metodos.map((m) => (
                      <Box key={m.idMetodo} sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        border: "1px solid", borderRadius: 2, px: 2, py: 1.5,
                        borderColor: m.esPrincipal ? "primary.main" : "grey.300",
                        bgcolor: m.esPrincipal ? "primary.50" : "transparent",
                      }}>
                        {m.tipo === "tarjeta"
                          ? <CreditCard sx={{ color: m.esPrincipal ? "primary.main" : "text.disabled", flexShrink: 0 }} />
                          : <Payments sx={{ color: m.esPrincipal ? "primary.main" : "text.disabled", flexShrink: 0 }} />}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                            <Typography variant="body2" fontWeight={600}>
                              {m.tipo === "tarjeta" ? `Tarjeta ···· ${m.ultimosDigitos ?? "????"}` : "Efectivo"}
                            </Typography>
                            {m.esPrincipal && (
                              <Chip label="Principal" size="small" color="primary" variant="outlined"
                                icon={<Star sx={{ fontSize: "12px !important" }} />}
                                sx={{ height: 18, fontSize: 10 }} />
                            )}
                          </Box>
                          {m.tipo === "tarjeta" && m.proveedor && (
                            <Typography variant="caption" color="text.secondary">{m.proveedor}</Typography>
                          )}
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                          {!m.esPrincipal && (
                            <Tooltip title="Marcar como principal">
                              <IconButton size="small" color="primary" onClick={() => handleSetMetodoPrincipal(m.idMetodo)}>
                                <Star fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => openMetodoDialog(m)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" color="error" onClick={() => handleDeleteMetodo(m.idMetodo)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ── Direcciones de envío (full width) ── */}
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Direcciones de envío</Typography>
              <Button size="small" startIcon={<Add />} onClick={openNew}>Nueva</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {dirLoading ? (
              <CircularProgress size={24} />
            ) : dirs.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <LocationOn sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No tienes direcciones guardadas.
                </Typography>
                <Button variant="outlined" startIcon={<Add />} onClick={openNew}
                  sx={{ borderStyle: "dashed", borderRadius: 2 }}>
                  Agregar dirección
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {dirs.map((d) => (
                  <Box key={d.idDireccion} sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    border: "1px solid", borderRadius: 2, px: 2, py: 1.5,
                    borderColor: d.esPrincipal ? "primary.main" : "grey.300",
                    bgcolor: d.esPrincipal ? "primary.50" : "transparent",
                  }}>
                    <LocationOn sx={{ color: d.esPrincipal ? "primary.main" : "text.disabled", flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                        <Typography variant="body2" fontWeight={600}>
                          {d.pais}, {d.ciudad}, {d.calle}
                        </Typography>
                        {d.esPrincipal && (
                          <Chip label="Principal" size="small" color="primary" variant="outlined"
                            icon={<Star sx={{ fontSize: "12px !important" }} />}
                            sx={{ height: 18, fontSize: 10 }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {d.departamento}{d.codigoPostal ? ` · CP ${d.codigoPostal}` : ""}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                      {!d.esPrincipal && (
                        <Tooltip title="Marcar como principal">
                          <IconButton size="small" color="primary" onClick={() => handleSetPrincipal(d.idDireccion)}>
                            <Star fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(d)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => handleDeleteDir(d.idDireccion)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* ── Modal: Nueva / Editar dirección ── */}
      <Dialog open={dirDialog} onClose={() => setDirDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle fontWeight={700}>{editingDir ? "Editar dirección" : "Nueva dirección"}</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          {dirErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{dirErrors.general}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Calle / Dirección" name="Calle"
                value={dirForm.Calle} onChange={handleDirFormChange}
                error={Boolean(dirErrors.Calle)} helperText={dirErrors.Calle}
                placeholder="Col. Palmira, Calle Principal #12" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Ciudad" name="Ciudad"
                value={dirForm.Ciudad} onChange={handleDirFormChange}
                error={Boolean(dirErrors.Ciudad)} helperText={dirErrors.Ciudad} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Departamento" name="Departamento"
                value={dirForm.Departamento} onChange={handleDirFormChange}
                error={Boolean(dirErrors.Departamento)} helperText={dirErrors.Departamento} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="País" name="Pais"
                value={dirForm.Pais} onChange={handleDirFormChange}
                error={Boolean(dirErrors.Pais)} helperText={dirErrors.Pais} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Código Postal (opcional)" name="CodigoPostal"
                value={dirForm.CodigoPostal} onChange={handleDirFormChange} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch name="EsPrincipal" checked={dirForm.EsPrincipal}
                    onChange={handleDirFormChange} color="primary" />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Star sx={{ fontSize: 18, color: dirForm.EsPrincipal ? "primary.main" : "text.disabled" }} />
                    <Typography variant="body2">Establecer como dirección principal</Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDirDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveDir} loading={dirSaving}>
            {editingDir ? "Guardar cambios" : "Agregar dirección"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Nuevo / Editar método de pago ── */}
      <Dialog open={metodoDialog} onClose={() => setMetodoDialog(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle fontWeight={700}>
          {editingMetodo ? "Editar método de pago" : "Agregar método de pago"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          {cardErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{cardErrors.general}</Alert>}
          <ToggleButtonGroup value={tipoSeleccionado} exclusive
            onChange={(_, v) => { if (v) setTipoSeleccionado(v); }}
            fullWidth sx={{ mb: 3 }}>
            <ToggleButton value="tarjeta" sx={{ gap: 1, py: 1.2 }}>
              <CreditCard fontSize="small" /> Tarjeta
            </ToggleButton>
            <ToggleButton value="efectivo" sx={{ gap: 1, py: 1.2 }}>
              <Payments fontSize="small" /> Efectivo
            </ToggleButton>
          </ToggleButtonGroup>

          {tipoSeleccionado === "tarjeta" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField fullWidth size="small"
                label={editingMetodo ? `Nuevo número (actual: ···· ${editingMetodo.ultimosDigitos ?? "?"})` : "Número de tarjeta"}
                name="numero" value={card.numero} onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                required={!editingMetodo}
                error={Boolean(cardErrors.numero)} helperText={cardErrors.numero}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><CreditCard color="primary" /></InputAdornment> } }} />
              <TextField fullWidth size="small" label="Titular" name="titular"
                value={card.titular} onChange={handleCardChange}
                error={Boolean(cardErrors.titular)} helperText={cardErrors.titular} />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField fullWidth size="small" label="Vencimiento" name="vencimiento"
                  type="month" value={card.vencimiento} onChange={handleCardChange}
                  required={!editingMetodo}
                  error={Boolean(cardErrors.vencimiento)} helperText={cardErrors.vencimiento}
                  slotProps={{ inputLabel: { shrink: true } }} />
                <TextField fullWidth size="small" label="CVV" name="cvv"
                  value={card.cvv} onChange={handleCardChange}
                  required={!editingMetodo}
                  error={Boolean(cardErrors.cvv)} helperText={cardErrors.cvv} />
              </Box>
            </Box>
          )}

          {tipoSeleccionado === "efectivo" && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Payments sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Se registrará efectivo como método de pago.
              </Typography>
            </Box>
          )}

          <FormControlLabel sx={{ mt: 2 }}
            control={
              <Switch checked={cardEsPrincipal}
                onChange={(e) => setCardEsPrincipal(e.target.checked)} color="primary" />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Star sx={{ fontSize: 18, color: cardEsPrincipal ? "primary.main" : "text.disabled" }} />
                <Typography variant="body2">Establecer como método principal</Typography>
              </Box>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setMetodoDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveMetodo} loading={cardSaving}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
