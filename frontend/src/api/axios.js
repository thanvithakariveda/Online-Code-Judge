import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// attach token safely
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ❌ NO JSON.parse

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;