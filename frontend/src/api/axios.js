import axios from "axios";
import { getApiBaseUrl } from "./config.js";
import { AUTH_STORAGE, ROUTES } from "../constants/routes.js";
const apiBase = getApiBaseUrl();

if (!apiBase && import.meta.env.PROD) {
  console.error(
    "VITE_API_URL is not set. In Vercel add: https://online-code-judge-final.onrender.com"
  );
}

const api = axios.create({
  baseURL: apiBase || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Paths must be relative (no leading /) so baseURL /api is preserved */
function ensureRelativePath(url) {
  if (!url) return url;
  return String(url).replace(/^\/+/, "");
}

/**
 * Unwrap backend standard response { success, message, data } so pages
 * can keep using response.data.token, response.data.problems, etc.
 */
function unwrapResponse(body) {
  if (body && typeof body === "object" && body.success === true && body.data !== undefined) {
    return { success: body.success, message: body.message, ...body.data };
  }
  return body;
}

api.interceptors.request.use((config) => {
  config.url = ensureRelativePath(config.url);

  const token = localStorage.getItem(AUTH_STORAGE.TOKEN);  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => {
    res.data = unwrapResponse(res.data);
    return res;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE.TOKEN);
      localStorage.removeItem(AUTH_STORAGE.USER);

      if (!window.location.pathname.includes(ROUTES.LOGIN)) {
        window.location.href = ROUTES.LOGIN;
      }
    }    return Promise.reject(error);
  }
);

export default api;
