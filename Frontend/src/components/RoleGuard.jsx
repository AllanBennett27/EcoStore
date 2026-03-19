import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles: array de roles permitidos, ej. ['ventas', 'admin']
function RoleGuard({ children, roles }) {
  const { user, isAdmin, isVentas, isFinanzas } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;

  const flagMap = { admin: isAdmin, ventas: isVentas, finanzas: isFinanzas };
  const allowed = roles.some((r) => flagMap[r.toLowerCase()]);

  if (!allowed) return <Navigate to="/" replace />;

  return children;
}

export default RoleGuard;
