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
    return res.data || {};
  },
};

// SUBMISSIONS
export const submissionsAPI = {
  getMine: async () => {
    const res = await api.get("/submissions/me");
    return res.data || {};
  },
};

// LEADERBOARD
export const leaderboardAPI = {
  get: async () => {
    const res = await api.get("/leaderboard");
    return res.data || {};
  },
};