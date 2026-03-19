import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { checkoutService, direccionService, metodoPagoService } from '../services/api';
import {
  Box, Typography, Button, Card, CardContent, TextField, Divider, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, ToggleButton,
  ToggleButtonGroup, Chip, Alert, Radio, RadioGroup, FormControlLabel,
  CircularProgress, IconButton, Tooltip, Switch,
} from '@mui/material';
import {
  ArrowBack, CheckCircle, ShoppingBag, Add, CreditCard, Payments,
  LocationOn, Star, Edit, Delete,
} from '@mui/icons-material';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ISV_RATE = 0.15;

// ── Imagen del producto ──────────────────────────────────────────────────────
function ProductThumb({ product }) {
  if (product.imageUrl) {
    return (
      <Box component="img" src={product.imageUrl} alt={product.name}
        sx={{ width: 52, height: 52, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }} />
    );
  }
  return (
    <Box sx={{
      width: 52, height: 52, borderRadius: 2, flexShrink: 0,
      bgcolor: product.color ?? '#f1f8e9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Typography sx={{ fontSize: 26 }}>{product.emoji ?? '🛍️'}</Typography>
    </Box>
  );
}

// ── Validación de tarjeta ────────────────────────────────────────────────────
const CARD_EMPTY = { numero: '', titular: '', vencimiento: '', cvv: '' };

function validateCard(card) {
  const e = {};
  const digits = card.numero.replace(/\s/g, '');
  if (!digits)                 e.numero      = 'Requerido.';
  else if (digits.length < 16) e.numero      = 'Debe tener 16 dígitos.';
  if (!card.titular.trim())    e.titular     = 'Requerido.';
  if (!card.vencimiento)       e.vencimiento = 'Requerido.';
  if (!card.cvv)               e.cvv         = 'Requerido.';
  else if (card.cvv.length < 3) e.cvv        = 'Mínimo 3 dígitos.';
  return e;
}

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

const DIR_EMPTY = { Calle: '', Ciudad: '', Departamento: '', Pais: '', CodigoPostal: '', EsPrincipal: false };

function validateDireccion(d) {
  const e = {};
  if (!d.Calle.trim())        e.Calle        = 'Requerido.';
  if (!d.Ciudad.trim())       e.Ciudad       = 'Requerido.';
  if (!d.Departamento.trim()) e.Departamento = 'Requerido.';
  if (!d.Pais.trim())         e.Pais         = 'Requerido.';
  return e;
}

// ── Componente principal ─────────────────────────────────────────────────────
function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Datos básicos de entrega
  const [form, setForm] = useState({
    nombre:   user?.name  ?? '',
    correo:   user?.email ?? '',
    telefono: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Direcciones guardadas
  const [savedDirs, setSavedDirs]         = useState([]);
  const [selectedDirId, setSelectedDirId] = useState('new'); // 'new' o idDireccion
  const [newDir, setNewDir]               = useState(DIR_EMPTY);
  const [dirErrors, setDirErrors]         = useState({});
  const [dirLoading, setDirLoading]       = useState(true);

  // Métodos de pago guardados
  const [savedMetodos, setSavedMetodos]     = useState([]);
  const [selectedMetodoId, setSelectedMetodoId] = useState('new');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('tarjeta');
  const [card, setCard]                     = useState(CARD_EMPTY);
  const [cardEsPrincipal, setCardEsPrincipal] = useState(false);
  const [cardErrors, setCardErrors]         = useState({});
  const [metodoLoading, setMetodoLoading]   = useState(true);

  // Diálogos
  const [dirDialog, setDirDialog]     = useState(false);
  const [editingDir, setEditingDir]   = useState(null); // null = nueva, objeto = editar
  const [pagoDialog, setPagoDialog]   = useState(false);

  // Estado pedido
  const [loading, setLoading]       = useState(false);
  const [pedido, setPedido]         = useState(null);
  const [stockAviso, setStockAviso] = useState(false);
  const connectionRef               = useRef(null);

  // ── Cargar direcciones y métodos al montar ──
  useEffect(() => {
    direccionService.getAll()
      .then((res) => {
        const dirs = res.data ?? [];
        setSavedDirs(dirs);
        const principal = dirs.find((d) => d.esPrincipal);
        if (principal) setSelectedDirId(String(principal.idDireccion));
        else if (dirs.length > 0) setSelectedDirId(String(dirs[0].idDireccion));
      })
      .catch(() => {})
      .finally(() => setDirLoading(false));

    metodoPagoService.getAll()
      .then((res) => {
        const metodos = res.data ?? [];
        setSavedMetodos(metodos);
        const principal = metodos.find((m) => m.esPrincipal);
        if (principal) setSelectedMetodoId(String(principal.idMetodo));
        else if (metodos.length > 0) setSelectedMetodoId(String(metodos[0].idMetodo));
      })
      .catch(() => {})
      .finally(() => setMetodoLoading(false));
  }, []);

  // ── SignalR ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/cartHub', { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();
    connection.on('StockActualizado', () => setStockAviso(true));
    connection.start().catch(() => {});
    connectionRef.current = connection;
    return () => { connection.stop(); };
  }, []);

  const shipping = cartTotal > 500 ? 0 : 50;
  const isv      = cartTotal * ISV_RATE;
  const total    = cartTotal + shipping + isv;

  // ── Handlers entrega ──
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: '' }));
  };

  const validateForm = () => {
    const e = {};
    if (!form.nombre.trim())   e.nombre   = 'Requerido.';
    if (!form.correo.trim())   e.correo   = 'Requerido.';
    if (!form.telefono.trim()) e.telefono = 'Requerido.';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers dirección ──
  const handleNewDirChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDir((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (dirErrors[name]) setDirErrors((p) => ({ ...p, [name]: '' }));
  };

  const openNewDirDialog = () => {
    setEditingDir(null);
    setNewDir({ ...DIR_EMPTY, EsPrincipal: savedDirs.length === 0 });
    setDirErrors({});
    setDirDialog(true);
  };

  const openEditDirDialog = (d) => {
    setEditingDir(d);
    setNewDir({ Calle: d.calle, Ciudad: d.ciudad, Departamento: d.departamento, Pais: d.pais, CodigoPostal: d.codigoPostal ?? '', EsPrincipal: d.esPrincipal });
    setDirErrors({});
    setDirDialog(true);
  };

  const handleSaveDireccion = async () => {
    const e = validateDireccion(newDir);
    if (Object.keys(e).length > 0) { setDirErrors(e); return; }
    try {
      if (editingDir) {
        const res = await direccionService.update(editingDir.idDireccion, newDir);
        const updated = res.data;
        setSavedDirs((p) => p.map((d) => {
          if (d.idDireccion === editingDir.idDireccion) return updated;
          if (updated.esPrincipal) return { ...d, esPrincipal: false };
          return d;
        }));
      } else {
        const res = await direccionService.create(newDir);
        const created = res.data;
        setSavedDirs((p) => {
          const base = created.esPrincipal ? p.map((d) => ({ ...d, esPrincipal: false })) : p;
          return [...base, created];
        });
        setSelectedDirId(String(created.idDireccion));
      }
      setNewDir(DIR_EMPTY);
      setDirDialog(false);
    } catch {
      setDirErrors({ general: 'Error al guardar la dirección.' });
    }
  };

  const handleDeleteDireccion = async (id) => {
    try {
      await direccionService.delete(id);
      setSavedDirs((p) => p.filter((d) => d.idDireccion !== id));
      if (selectedDirId === String(id)) {
        const remaining = savedDirs.filter((d) => d.idDireccion !== id);
        setSelectedDirId(remaining.length > 0 ? String(remaining[0].idDireccion) : 'new');
      }
    } catch { /* silencioso */ }
  };

  // ── Handlers método de pago ──
  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === 'numero') value = formatCardNumber(value);
    if (name === 'cvv')    value = value.replace(/\D/g, '').slice(0, 4);
    setCard((p) => ({ ...p, [name]: value }));
    if (cardErrors[name]) setCardErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSaveMetodo = async () => {
    if (tipoSeleccionado === 'tarjeta') {
      const e = validateCard(card);
      if (Object.keys(e).length > 0) { setCardErrors(e); return; }
    }
    try {
      const dto = tipoSeleccionado === 'tarjeta'
        ? {
            Tipo: 'tarjeta',
            UltimosDigitos: card.numero.replace(/\s/g, '').slice(-4),
            Proveedor: card.titular,
            EsPrincipal: cardEsPrincipal,
          }
        : { Tipo: 'efectivo', EsPrincipal: cardEsPrincipal };

      const res = await metodoPagoService.create(dto);
      const created = res.data;
      setSavedMetodos((p) => {
        const base = created.esPrincipal ? p.map((m) => ({ ...m, esPrincipal: false })) : p;
        return [...base, created];
      });
      setSelectedMetodoId(String(created.idMetodo));
      setCard(CARD_EMPTY);
      setCardEsPrincipal(false);
      setPagoDialog(false);
    } catch {
      setCardErrors({ general: 'Error al guardar el método de pago.' });
    }
  };

  // ── Confirmar pedido ──
  const handleConfirm = async () => {
    if (!validateForm()) return;

    const needDir = selectedDirId === 'new' || savedDirs.length === 0;
    if (needDir) {
      const e = validateDireccion(newDir);
      if (Object.keys(e).length > 0) { setDirErrors(e); setDirDialog(true); return; }
    }

    const needMetodo = selectedMetodoId === 'new' || savedMetodos.length === 0;
    if (needMetodo) {
      setFormErrors((p) => ({ ...p, metodo: 'Debes agregar un método de pago.' }));
      return;
    }

    setLoading(true);
    try {
      const res = await checkoutService.confirmar();
      const { idPedido, total: totalReal } = res.data;
      await clearCart();
      setPedido({ numero: idPedido, total: totalReal ?? total, fecha: new Date() });
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al procesar el pedido. Intenta de nuevo.';
      setFormErrors((p) => ({ ...p, general: msg }));
    } finally {
      setLoading(false);
    }
  };

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (pedido) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Box sx={{ maxWidth: 520, mx: 'auto', px: 3, py: 10, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>¡Pedido confirmado!</Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Tu pedido <strong>#{pedido.numero}</strong> ha sido recibido.
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Fecha: {pedido.fecha.toLocaleDateString('es-HN', { dateStyle: 'long' })}
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mt: 2, mb: 4 }}>
            Total pagado: L.{pedido.total.toFixed(2)}
          </Typography>
          <Button variant="contained" size="large" startIcon={<ShoppingBag />}
            onClick={() => navigate('/products')} sx={{ borderRadius: 3, px: 4 }}>
            Seguir comprando
          </Button>
        </Box>
      </Box>
    );
  }

  const selectedDir    = savedDirs.find((d) => String(d.idDireccion) === selectedDirId);
  const selectedMetodo = savedMetodos.find((m) => String(m.idMetodo) === selectedMetodoId);

  // ── Checkout form ────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/cart')} sx={{ mb: 2 }}>
          Volver al carrito
        </Button>

        {stockAviso && (
          <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setStockAviso(false)}>
            El stock de algún producto cambió mientras procesabas tu pedido. Verifica tu carrito.
          </Alert>
        )}

        <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
          Finalizar compra
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

          {/* ── Columna izquierda ── */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Datos de contacto */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
                  Información de contacto
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Nombre completo"
                      name="nombre" value={form.nombre} onChange={handleFormChange}
                      error={Boolean(formErrors.nombre)} helperText={formErrors.nombre} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Correo electrónico"
                      name="correo" value={form.correo} onChange={handleFormChange}
                      error={Boolean(formErrors.correo)} helperText={formErrors.correo} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Teléfono"
                      name="telefono" value={form.telefono} onChange={handleFormChange}
                      error={Boolean(formErrors.telefono)} helperText={formErrors.telefono}
                      placeholder="+504 9999-9999" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Dirección de envío */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>Dirección de envío</Typography>
                  <Button size="small" startIcon={<Add />} onClick={openNewDirDialog}>
                    Nueva
                  </Button>
                </Box>

                {dirLoading ? (
                  <CircularProgress size={24} />
                ) : savedDirs.length === 0 ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      No tienes direcciones guardadas.
                    </Typography>
                    <Button variant="outlined" startIcon={<Add />}
                      onClick={openNewDirDialog}
                      sx={{ borderStyle: 'dashed', borderRadius: 2 }}>
                      Agregar dirección
                    </Button>
                    {formErrors.direccion && (
                      <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                        {formErrors.direccion}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <RadioGroup value={selectedDirId} onChange={(e) => setSelectedDirId(e.target.value)}>
                    {savedDirs.map((d) => (
                      <Box key={d.idDireccion} sx={{
                        display: 'flex', alignItems: 'center',
                        border: '1px solid', borderRadius: 2, px: 1.5, mb: 1,
                        borderColor: String(d.idDireccion) === selectedDirId ? 'primary.main' : 'grey.300',
                        bgcolor: String(d.idDireccion) === selectedDirId ? 'primary.50' : 'transparent',
                      }}>
                        <FormControlLabel
                          value={String(d.idDireccion)}
                          control={<Radio size="small" />}
                          label={
                            <Box sx={{ py: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight={600}>
                                  {d.pais}, {d.ciudad}, {d.calle}
                                </Typography>
                                {d.esPrincipal && (
                                  <Chip label="Principal" size="small" color="primary" variant="outlined"
                                    icon={<Star sx={{ fontSize: '12px !important' }} />}
                                    sx={{ height: 18, fontSize: 10, ml: 0.5 }} />
                                )}
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {d.departamento}{d.codigoPostal ? ` · CP ${d.codigoPostal}` : ''}
                              </Typography>
                            </Box>
                          }
                          sx={{ flex: 1, m: 0 }}
                        />
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEditDirDialog(d); }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteDireccion(d.idDireccion); }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Método de pago */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>Método de pago</Typography>
                  <Button size="small" startIcon={<Add />} onClick={() => { setCard(CARD_EMPTY); setCardErrors({}); setTipoSeleccionado('tarjeta'); setCardEsPrincipal(savedMetodos.length === 0); setPagoDialog(true); }}>
                    Nuevo
                  </Button>
                </Box>

                {metodoLoading ? (
                  <CircularProgress size={24} />
                ) : savedMetodos.length === 0 ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      No tienes métodos de pago guardados.
                    </Typography>
                    <Button variant="outlined" startIcon={<Add />}
                      onClick={() => { setCard(CARD_EMPTY); setCardErrors({}); setTipoSeleccionado('tarjeta'); setCardEsPrincipal(true); setPagoDialog(true); }}
                      sx={{ borderStyle: 'dashed', borderRadius: 2 }}>
                      Agregar método de pago
                    </Button>
                    {formErrors.metodo && (
                      <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                        {formErrors.metodo}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <RadioGroup value={selectedMetodoId} onChange={(e) => setSelectedMetodoId(e.target.value)}>
                    {savedMetodos.map((m) => (
                      <Box key={m.idMetodo} sx={{
                        display: 'flex', alignItems: 'center',
                        border: '1px solid', borderRadius: 2, px: 1.5, mb: 1,
                        borderColor: String(m.idMetodo) === selectedMetodoId ? 'primary.main' : 'grey.300',
                        bgcolor: String(m.idMetodo) === selectedMetodoId ? 'primary.50' : 'transparent',
                      }}>
                        <FormControlLabel
                          value={String(m.idMetodo)}
                          control={<Radio size="small" />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                              {m.tipo === 'tarjeta'
                                ? <CreditCard sx={{ fontSize: 20, color: 'primary.main' }} />
                                : <Payments sx={{ fontSize: 20, color: 'success.main' }} />}
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography variant="body2" fontWeight={600}>
                                    {m.tipo === 'tarjeta' ? `Tarjeta ···· ${m.ultimosDigitos ?? '????'}` : 'Efectivo'}
                                  </Typography>
                                  {m.esPrincipal && (
                                    <Chip label="Principal" size="small" color="primary" variant="outlined"
                                      icon={<Star sx={{ fontSize: '12px !important' }} />}
                                      sx={{ height: 18, fontSize: 10 }} />
                                  )}
                                </Box>
                                {m.tipo === 'tarjeta' && m.proveedor && (
                                  <Typography variant="caption" color="text.secondary">{m.proveedor}</Typography>
                                )}
                              </Box>
                            </Box>
                          }
                          sx={{ flex: 1, m: 0 }}
                        />
                      </Box>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Productos (solo desktop) */}
            <Card elevation={1} sx={{ display: { xs: 'none', md: 'block' } }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Productos ({cartItems.length})
                </Typography>
                {cartItems.map(({ product, quantity }) => (
                  <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <ProductThumb product={product} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={500} noWrap>{product.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        L.{Number(product.price).toFixed(2)} × {quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="primary.dark">
                      L.{(Number(product.price) * quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>

          {/* ── Resumen y confirmación ── */}
          <Card elevation={2} sx={{
            width: { xs: '100%', md: 340 }, minWidth: { md: 340 },
            alignSelf: 'flex-start', position: { md: 'sticky' }, top: { md: 80 },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Resumen del pedido</Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Items en móvil */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                {cartItems.map(({ product, quantity }) => (
                  <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <ProductThumb product={product} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" fontWeight={500} noWrap display="block">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">× {quantity}</Typography>
                    </Box>
                    <Typography variant="caption" fontWeight={600} color="primary.dark">
                      L.{(Number(product.price) * quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ mb: 2 }} />
              </Box>

              {/* Dirección seleccionada */}
              {selectedDir && (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                    <LocationOn sx={{ fontSize: 14, color: 'primary.main' }} />
                    <Typography variant="caption" fontWeight={600} color="primary.main">Envío a</Typography>
                  </Box>
                  <Typography variant="caption" display="block">
                    {selectedDir.pais}, {selectedDir.ciudad}, {selectedDir.calle}
                  </Typography>
                </Box>
              )}

              {/* Método seleccionado */}
              {selectedMetodo && (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                    {selectedMetodo.tipo === 'tarjeta'
                      ? <CreditCard sx={{ fontSize: 14, color: 'primary.main' }} />
                      : <Payments sx={{ fontSize: 14, color: 'success.main' }} />}
                    <Typography variant="caption" fontWeight={600} color="primary.main">Pago</Typography>
                  </Box>
                  <Typography variant="caption">
                    {selectedMetodo.tipo === 'tarjeta'
                      ? `Tarjeta ···· ${selectedMetodo.ultimosDigitos ?? '????'}`
                      : 'Efectivo contra entrega'}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ mb: 2 }} />

              {[
                ['Subtotal', `L.${cartTotal.toFixed(2)}`],
                ['Envío',    shipping === 0 ? 'Gratis' : `L.${shipping.toFixed(2)}`],
                ['ISV (15%)', `L.${isv.toFixed(2)}`],
              ].map(([label, value]) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                  <Typography color="text.secondary">{label}</Typography>
                  <Typography fontWeight={500}
                    color={label === 'Envío' && shipping === 0 ? 'success.main' : 'text.primary'}>
                    {value}
                  </Typography>
                </Box>
              ))}

              {shipping > 0 && (
                <Typography variant="caption" color="primary.main" sx={{ display: 'block', mb: 1 }}>
                  Envío gratis en compras mayores a L.500.00
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  L.{total.toFixed(2)}
                </Typography>
              </Box>

              {formErrors.general && (
                <Alert severity="error" sx={{ mb: 1.5 }}>{formErrors.general}</Alert>
              )}

              <Button variant="contained" fullWidth size="large"
                onClick={handleConfirm} loading={loading}
                sx={{
                  py: 1.4, fontSize: '1rem', borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                  '&:hover': { boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)' },
                }}>
                Confirmar pedido
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ── Modal: Nueva dirección ──────────────────────────────────────────── */}
      <Dialog open={dirDialog} onClose={() => setDirDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle fontWeight={700}>{editingDir ? 'Editar dirección' : 'Nueva dirección de envío'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          {dirErrors.general && <Alert severity="error" sx={{ mb: 2 }}>{dirErrors.general}</Alert>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth size="small" label="Calle / Dirección"
                name="Calle" value={newDir.Calle} onChange={handleNewDirChange}
                error={Boolean(dirErrors.Calle)} helperText={dirErrors.Calle}
                placeholder="Col. Palmira, Calle Principal #12" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="Ciudad"
                name="Ciudad" value={newDir.Ciudad} onChange={handleNewDirChange}
                error={Boolean(dirErrors.Ciudad)} helperText={dirErrors.Ciudad} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="Departamento"
                name="Departamento" value={newDir.Departamento} onChange={handleNewDirChange}
                error={Boolean(dirErrors.Departamento)} helperText={dirErrors.Departamento} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="País"
                name="Pais" value={newDir.Pais} onChange={handleNewDirChange}
                error={Boolean(dirErrors.Pais)} helperText={dirErrors.Pais} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="Código Postal (opcional)"
                name="CodigoPostal" value={newDir.CodigoPostal} onChange={handleNewDirChange} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch name="EsPrincipal" checked={newDir.EsPrincipal} onChange={handleNewDirChange} color="primary" />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 18, color: newDir.EsPrincipal ? 'primary.main' : 'text.disabled' }} />
                    <Typography variant="body2">Establecer como dirección principal</Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDirDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveDireccion}>
            {editingDir ? 'Guardar cambios' : 'Agregar dirección'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Nuevo método de pago ─────────────────────────────────────── */}
      <Dialog open={pagoDialog} onClose={() => setPagoDialog(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle fontWeight={700}>Agregar método de pago</DialogTitle>
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

          {tipoSeleccionado === 'tarjeta' && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth size="small" label="Número de tarjeta"
                  name="numero" value={card.numero} onChange={handleCardChange}
                  error={Boolean(cardErrors.numero)} helperText={cardErrors.numero}
                  placeholder="1234 5678 9012 3456"
                  slotProps={{ input: { startAdornment: <CreditCard sx={{ mr: 1, color: 'text.disabled' }} fontSize="small" /> } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth size="small" label="Nombre del titular"
                  name="titular" value={card.titular} onChange={handleCardChange}
                  error={Boolean(cardErrors.titular)} helperText={cardErrors.titular}
                  placeholder="Como aparece en la tarjeta" />
              </Grid>
              <Grid size={{ xs: 7 }}>
                <TextField fullWidth size="small" label="Vencimiento"
                  name="vencimiento" type="month" value={card.vencimiento}
                  onChange={handleCardChange}
                  error={Boolean(cardErrors.vencimiento)} helperText={cardErrors.vencimiento}
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 5 }}>
                <TextField fullWidth size="small" label="CVV"
                  name="cvv" value={card.cvv} onChange={handleCardChange}
                  error={Boolean(cardErrors.cvv)} helperText={cardErrors.cvv}
                  placeholder="123" slotProps={{ htmlInput: { maxLength: 4 } }} />
              </Grid>
            </Grid>
          )}

          {tipoSeleccionado === 'efectivo' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Payments sx={{ fontSize: 48, color: 'success.main', mb: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Pagarás en efectivo al recibir tu pedido.
              </Typography>
              <Chip label="Pago contra entrega" color="success" size="small" sx={{ mt: 1.5 }} />
            </Box>
          )}

          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch checked={cardEsPrincipal} onChange={(e) => setCardEsPrincipal(e.target.checked)} color="primary" />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Star sx={{ fontSize: 18, color: cardEsPrincipal ? 'primary.main' : 'text.disabled' }} />
                <Typography variant="body2">Establecer como método principal</Typography>
              </Box>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPagoDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveMetodo}>
            {tipoSeleccionado === 'tarjeta' ? 'Guardar tarjeta' : 'Confirmar efectivo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Checkout;
