import { useState, useMemo } from 'react';
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
} from '@mui/material';
import { Search, Clear, Edit, ManageAccounts } from '@mui/icons-material';
import Header from '../../components/Header';

// ---------------------------------------------------------------------------
// Role configuration
// ---------------------------------------------------------------------------
const ROLES = [
  { value: 'usuario',  label: 'Usuario',  color: 'default' },
  { value: 'admin',    label: 'Admin',    color: 'error'   },
  { value: 'ventas',   label: 'Ventas',   color: 'success' },
  { value: 'finanzas', label: 'Finanzas', color: 'warning' },
];

const roleConfig = Object.fromEntries(ROLES.map((r) => [r.value, r]));

// ---------------------------------------------------------------------------
// Mock users – replace with real API call when the endpoint is ready
// const MOCK_USERS = await usuariosService.getAll()
// ---------------------------------------------------------------------------
const INITIAL_USERS = [
  { id: 1, name: 'Ana García',      email: 'ana@ecostore.hn',     role: 'admin'    },
  { id: 2, name: 'Carlos López',    email: 'carlos@ecostore.hn',  role: 'ventas'   },
  { id: 3, name: 'María Torres',    email: 'maria@ecostore.hn',   role: 'finanzas' },
  { id: 4, name: 'José Martínez',   email: 'jose@ecostore.hn',    role: 'usuario'  },
  { id: 5, name: 'Laura Reyes',     email: 'laura@ecostore.hn',   role: 'ventas'   },
  { id: 6, name: 'Pedro Sánchez',   email: 'pedro@ecostore.hn',   role: 'usuario'  },
  { id: 7, name: 'Sofía Mendoza',   email: 'sofia@ecostore.hn',   role: 'finanzas' },
  { id: 8, name: 'Diego Herrera',   email: 'diego@ecostore.hn',   role: 'usuario'  },
  { id: 9, name: 'Valentina Cruz',  email: 'vale@ecostore.hn',    role: 'ventas'   },
  { id: 10, name: 'Andrés Flores',  email: 'andres@ecostore.hn',  role: 'usuario'  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function RoleManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, user: null, newRole: '' });

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

  const confirmEdit = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editDialog.user.id ? { ...u, role: editDialog.newRole } : u
      )
    );
    closeEdit();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        {/* ── Header ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <ManageAccounts sx={{ fontSize: 30, color: 'primary.dark' }} />
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            Gestión de Roles
          </Typography>
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
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length > 0 ? (
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

                      {/* Edit button */}
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
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
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No se encontraron usuarios para "{search}".
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
