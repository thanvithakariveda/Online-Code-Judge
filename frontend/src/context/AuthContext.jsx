import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services.js';
import { AUTH_STORAGE } from '../constants/routes.js';

const AuthContext = createContext(null);

/**
 * Auth state: JWT stored in localStorage, attached to API requests via axios interceptor.
 * On app load, if a token exists we call GET /auth/me to refresh the user profile.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE.USER);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistAuth = (token, userData) => {
    localStorage.setItem(AUTH_STORAGE.TOKEN, token);
    localStorage.setItem(AUTH_STORAGE.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE.TOKEN);
    localStorage.removeItem(AUTH_STORAGE.USER);
    setUser(null);
  }, []);

  /** Update cached user (navbar score, dashboard) */
  const updateUser = useCallback((userData) => {
    if (!userData) return;
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE.USER, JSON.stringify(userData));
  }, []);

  /** Refresh profile from API (e.g. after solving a problem) */
  const refreshUser = useCallback(async () => {
    const { data } = await authAPI.getMe();
    if (data.user) {
      updateUser(data.user);
    }
    return data.user;
  }, [updateUser]);

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

  // Restore session on mount when token exists
  useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE.TOKEN);
    if (!token) {
      setLoading(false);
      return;
    }

    authAPI
      .getMe()
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem(AUTH_STORAGE.USER, JSON.stringify(data.user));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAdmin: user?.role === 'admin',
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
