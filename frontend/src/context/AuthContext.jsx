import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
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

  const isAuthenticated = !!token;

  // LOGIN (FIXED)
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const data = res.data;

      const loggedUser = data?.user;
      const accessToken = data?.token;

      if (loggedUser) {
        localStorage.setItem("user", JSON.stringify(loggedUser));
        setUser(loggedUser);
      }

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  // REGISTER
  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);