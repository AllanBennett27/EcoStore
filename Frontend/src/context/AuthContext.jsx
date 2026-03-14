import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });
      const { usuario, rol } = res.data;
      setUser({ name: usuario, email, role: rol.toLowerCase() });
      return { success: true, role: rol.toLowerCase() };
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

  const logout = () => setUser(null);

  const clearError = () => setError(null);

  const isAdmin = user?.role?.includes('admin') ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
