import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistAuth = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    persistAuth(data.token, data.user);
    return data.user;
  };

  const register = async (username, email, password) => {
    const { data } = await authAPI.register({ username, email, password });
    persistAuth(data.token, data.user);
    return data.user;
  };

  // Restore session on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authAPI
      .getMe()
      .then(({ data }) => {
        const u = {
          id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          score: data.user.score,
        };
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
