import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

// ✅ SAFE PARSE (PREVENTS CRASH)
const safeParse = (value) => {
  try {
    if (!value || value === "undefined" || value === "null") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user"))
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const data = res.data;

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);