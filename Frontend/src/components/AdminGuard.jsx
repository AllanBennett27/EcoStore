import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminGuard({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminGuard;
