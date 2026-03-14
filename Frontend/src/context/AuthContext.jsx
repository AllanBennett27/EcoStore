import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Support common JWT claim names
    return {
      name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        || payload.name || payload.unique_name || '',
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
        || payload.email || '',
      role: (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        || payload.role || payload.roles || '').toLowerCase(),
    };
  } catch {
    return null;
  }
}

function restoreSession() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); // { message, severity }

  const closeNotification = () => setNotification(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });
      const { token } = res.data;

      const claims = decodeToken(token);
      const userData = {
        name: claims?.name || email,
        email: claims?.email || email,
        role: claims?.role || '',
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setNotification({ message: `¡Bienvenido, ${userData.name || userData.email}!`, severity: 'success' });

      return { success: true, role: userData.role };
    } catch (err) {
      const msg = err.response?.data || 'Correo o contraseña incorrectos.';
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data || 'Error al registrarse.';
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setNotification({ message: 'Sesión cerrada correctamente.', severity: 'info' });
  };

  const clearError = () => setError(null);

  const updateUser = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin = user?.role?.includes('admin') ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError, updateUser, isAdmin, notification, closeNotification }}>
      {children}
    </AuthContext.Provider>
  );
}
