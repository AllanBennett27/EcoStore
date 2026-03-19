import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles: array de roles permitidos, ej. ['ventas', 'admin']
function RoleGuard({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;

  const userRole = user.role?.toLowerCase() ?? '';
  const allowed  = roles.map((r) => r.toLowerCase());

  if (!allowed.includes(userRole)) return <Navigate to="/" replace />;

  return children;
}

export default RoleGuard;
