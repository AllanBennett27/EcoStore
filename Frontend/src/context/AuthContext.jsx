import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
    const name = role === 'admin' ? 'Administrador' : email.split('@')[0];
    setUser({ name, email, role });
    return true;
  };

  const register = (name, email, password) => {
    setUser({ name, email, role: 'customer' });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
