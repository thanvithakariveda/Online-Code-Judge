import api from "./axios.js";

// AUTH
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// PROBLEMS
export const problemsAPI = {
  getAll: async (params) => {
    const res = await api.get("/problems", { params });
    return res.data.data || [];
  },
};