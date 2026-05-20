import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

const safeJSONParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    safeJSONParse(localStorage.getItem("user"))
  );

  const [token, setToken] = useState(() =>
    localStorage.getItem("token") || null
  );

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { user, token } = res.data;

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
    }

    return res.data;
  };

  // REGISTER
  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);