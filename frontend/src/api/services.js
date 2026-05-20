import api from "./axios.js";

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const problemsAPI = {
  getAll: async () => {
    const res = await api.get("/problems");
    return res.data || {};
  },
};

export const submissionsAPI = {
  getMine: async () => {
    const res = await api.get("/submissions/me");
    return res.data || {};
  },
};