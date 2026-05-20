import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const data = res.data;

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }

    return data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
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