import api from "./axios.js";

export const authAPI = {
  register: (data) => api.post("auth/register", data),
  login: (data) => api.post("auth/login", data),
  getMe: () => api.get("auth/me"),
};

export const problemsAPI = {
  getAll: (params) => api.get("problems", { params }),
  getById: (id) => api.get(`problems/${id}`),
  create: (data) => api.post("problems", data),
  update: (id, data) => api.put(`problems/${id}`, data),
  delete: (id) => api.delete(`problems/${id}`),
};

export const submissionsAPI = {
  submit: (data) => api.post("submissions", data),
  getMine: () => api.get("submissions/me"),
  getByProblem: (problemId) => api.get(`submissions/problem/${problemId}`),
};

export const leaderboardAPI = {
  get: (limit = 50) => api.get("leaderboard", { params: { limit } }),
};

export const contestsAPI = {
  getAll: () => api.get("contests"),
};
