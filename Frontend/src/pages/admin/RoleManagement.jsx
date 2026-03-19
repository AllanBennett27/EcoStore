import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Clear, Edit, ManageAccounts, PersonAdd } from '@mui/icons-material';
import Header from '../../components/Header';
import { usuariosService } from '../../services/api';

// ---------------------------------------------------------------------------
// Role configuration  (id debe coincidir con id_rol en la BD)
// ---------------------------------------------------------------------------
const ROLES = [
  { value: 'usuario',  label: 'Usuario',  color: 'default', id: 2 },
  { value: 'admin',    label: 'Admin',    color: 'error',   id: 1 },
  { value: 'ventas',   label: 'Ventas',   color: 'success', id: 3 },
  { value: 'finanzas', label: 'Finanzas', color: 'warning', id: 4 },
];

const roleConfig = Object.fromEntries(ROLES.map((r) => [r.value, r]));

// Mapea idRol (número) al value del ROLES config
const ROLE_BY_ID = { 1: 'admin', 2: 'usuario', 3: 'ventas', 4: 'finanzas' };

// Mapea un UsuarioDto de la API al formato interno del componente
const mapUsuario = (u) => ({
  id:    u.idUsuario,
  name:  `${u.nombre} ${u.apellido}`,
  email: u.correo,
  role:  ROLE_BY_ID[u.idRol] ?? u.nombreRol?.toLowerCase() ?? 'usuario',
  estado: u.estado,
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function RoleManagement() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [editDialog, setEditDialog]   = useState({ open: false, user: null, newRole: '' });
  const [createDialog, setCreateDialog] = useState(false);
  const [createForm, setCreateForm]   = useState({ nombre: '', apellido: '', correo: '', password: '', telefono: '', direccion: '', idRol: 2 });
  const [createErrors, setCreateErrors] = useState({});
  const [creating, setCreating]       = useState(false);

  useEffect(() => {
    usuariosService.getAll()
      .then((res) => setUsers(res.data.map(mapUsuario)))
      .catch(() => setError('No se pudo cargar la lista de usuarios.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter users by name or email
  const query = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      query
        ? users.filter(
            (u) =>
              u.name.toLowerCase().includes(query) ||
              u.email.toLowerCase().includes(query) ||
              u.role.toLowerCase().includes(query)
          )
        : users,
    [users, query]
  );

  // Role counts for the summary row
  const counts = useMemo(
    () =>
      ROLES.reduce((acc, r) => {
        acc[r.value] = users.filter((u) => u.role === r.value).length;
        return acc;
      }, {}),
    [users]
  );

  // Dialog handlers
  const openEdit = (user) =>
    setEditDialog({ open: true, user, newRole: user.role });

  const closeEdit = () =>
    setEditDialog({ open: false, user: null, newRole: '' });

  const confirmEdit = async () => {
    const roleObj = ROLES.find((r) => r.value === editDialog.newRole);
    if (!roleObj) return;

    try {
      await usuariosService.updateRole(editDialog.user.id, roleObj.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editDialog.user.id ? { ...u, role: editDialog.newRole } : u
        )
      );
    } catch {
      setError('No se pudo actualizar el rol. Intenta de nuevo.');
    }
    closeEdit();
  };

  const handleToggleEstado = async (user, nuevoEstado) => {
    if (nuevoEstado === user.estado) return;
    try {
      await usuariosService.toggleEstado(user.id);
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, estado: nuevoEstado } : u)
      );
    } catch {
      setError('No se pudo cambiar el estado del usuario.');
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((p) => ({ ...p, [name]: value }));
    if (createErrors[name]) setCreateErrors((p) => ({ ...p, [name]: '' }));
  };

  const validateCreate = () => {
    const e = {};
    if (!createForm.nombre.trim())   e.nombre   = 'Requerido.';
    if (!createForm.apellido.trim()) e.apellido = 'Requerido.';
    if (!createForm.correo.trim())   e.correo   = 'Requerido.';
    if (!createForm.password.trim()) e.password = 'Requerido.';
    else if (createForm.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    setCreateErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateSubmit = async () => {
    if (!validateCreate()) return;
    setCreating(true);
    try {
      await usuariosService.create(createForm);
      // Recargar lista para mostrar el nuevo usuario
      const res = await usuariosService.getAll();
      setUsers(res.data.map(mapUsuario));
      setCreateDialog(false);
      setCreateForm({ nombre: '', apellido: '', correo: '', password: '', telefono: '', direccion: '', idRol: 2 });
    } catch (err) {
      const msg = err.response?.data?.message ?? 'No se pudo crear el usuario.';
      setCreateErrors((p) => ({ ...p, correo: msg }));
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        {/* ── Header ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ManageAccounts sx={{ fontSize: 30, color: 'primary.dark' }} />
            <Typography variant="h5" fontWeight={700} color="primary.dark">
              Gestión de Roles
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setCreateDialog(true)}>
            Nuevo Usuario
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Asigna roles a los usuarios registrados en la plataforma.
        </Typography>

        {/* ── Role summary chips ── */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          {ROLES.map((r) => (
            <Chip
              key={r.value}
              label={`${r.label}: ${counts[r.value]}`}
              color={r.color}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>

        {/* ── Search ── */}
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, correo o rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {filtered.length} de {users.length} usuarios
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

        {/* ── Users table with scrollbar (~10 rows visible) ── */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: 460,
            overflow: 'auto',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.dark', color: '#fff' }}>
                  Usuario
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.dark', color: '#fff' }}>
                  Correo
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, bgcolor: 'primary.dark', color: '#fff' }}
                >
                  Rol
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, bgcolor: 'primary.dark', color: '#fff' }}
                >
                  Estado
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, bgcolor: 'primary.dark', color: '#fff' }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filtered.length > 0 ? (
                filtered.map((user) => {
                  const rc = roleConfig[user.role] ?? { label: user.role, color: 'default' };
                  return (
                    <TableRow key={user.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      {/* Avatar + name */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: 'primary.light',
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>

                      {/* Role chip */}
                      <TableCell align="center">
                        <Chip
                          label={rc.label}
                          color={rc.color}
                          size="small"
                          sx={{ fontWeight: 600, minWidth: 80 }}
                        />
                      </TableCell>

                      {/* Estado dropdown */}
                      <TableCell align="center">
                        <Select
                          size="small"
                          value={user.estado}
                          onChange={(e) => handleToggleEstado(user, e.target.value)}
                          sx={{
                            minWidth: 130,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            bgcolor: user.estado === 'Activo' ? 'success.50' : 'grey.100',
                            color: user.estado === 'Activo' ? 'success.dark' : 'text.secondary',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: user.estado === 'Activo' ? 'success.main' : 'grey.400',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: user.estado === 'Activo' ? 'success.dark' : 'grey.600',
                            },
                          }}
                        >
                          <MenuItem value="Activo">
                            <Chip label="Activo" color="success" size="small" sx={{ fontWeight: 600, cursor: 'pointer' }} />
                          </MenuItem>
                          <MenuItem value="Desactivado">
                            <Chip label="Desactivado" color="default" size="small" sx={{ fontWeight: 600, cursor: 'pointer' }} />
                          </MenuItem>
                        </Select>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          title="Cambiar rol"
                          onClick={() => openEdit(user)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No se encontraron usuarios para "{search}".
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ── Create User Dialog ── */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Nuevo Usuario</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth size="small" label="Nombre" name="nombre"
                value={createForm.nombre} onChange={handleCreateChange}
                error={Boolean(createErrors.nombre)} helperText={createErrors.nombre} />
              <TextField fullWidth size="small" label="Apellido" name="apellido"
                value={createForm.apellido} onChange={handleCreateChange}
                error={Boolean(createErrors.apellido)} helperText={createErrors.apellido} />
            </Box>
            <TextField fullWidth size="small" label="Correo electrónico" name="correo"
              type="email" value={createForm.correo} onChange={handleCreateChange}
              error={Boolean(createErrors.correo)} helperText={createErrors.correo} />
            <TextField fullWidth size="small" label="Contraseña" name="password"
              type="password" value={createForm.password} onChange={handleCreateChange}
              error={Boolean(createErrors.password)} helperText={createErrors.password} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth size="small" label="Teléfono (opcional)" name="telefono"
                value={createForm.telefono} onChange={handleCreateChange} />
              <TextField fullWidth size="small" label="Dirección (opcional)" name="direccion"
                value={createForm.direccion} onChange={handleCreateChange} />
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Rol</InputLabel>
              <Select label="Rol" name="idRol" value={createForm.idRol}
                onChange={handleCreateChange}>
                {ROLES.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    <Chip label={r.label} color={r.color} size="small"
                      sx={{ fontWeight: 600, mr: 1 }} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateSubmit} disabled={creating}
            startIcon={creating ? <CircularProgress size={16} color="inherit" /> : <PersonAdd />}>
            {creating ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Role Dialog ── */}
      <Dialog
        open={editDialog.open}
        onClose={closeEdit}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 340 } }}
      >
        <DialogTitle fontWeight={700}>Cambiar Rol</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          {editDialog.user && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.light', fontWeight: 700 }}>
                  {editDialog.user.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{editDialog.user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {editDialog.user.email}
                  </Typography>
                </Box>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Rol</InputLabel>
                <Select
                  label="Rol"
                  value={editDialog.newRole}
                  onChange={(e) =>
                    setEditDialog((prev) => ({ ...prev, newRole: e.target.value }))
                  }
                >
                  {ROLES.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      <Chip
                        label={r.label}
                        color={r.color}
                        size="small"
                        sx={{ fontWeight: 600, mr: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEdit}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={confirmEdit}
            disabled={editDialog.newRole === editDialog.user?.role}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RoleManagement;
