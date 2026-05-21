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
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

function ensureRelativePath(url) {
  if (!url) return url;
  return String(url).replace(/^\/+/, "");
}

function unwrapResponse(body) {
  if (body && typeof body === "object" && body.success === true && body.data !== undefined) {
    return { success: body.success, message: body.message, ...body.data };
  }
  return body;
}

/** User-friendly message for failed requests (CORS, timeout, API errors) */
export function getErrorMessage(error, fallback = "Request failed") {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") return "Server is slow or waking up — please try again.";
  if (!error.response) return "Cannot reach API — check your connection or try again in a moment.";
  return fallback;
}

api.interceptors.request.use((config) => {
  config.url = ensureRelativePath(config.url);

  const token = localStorage.getItem(AUTH_STORAGE.TOKEN);
  if (token) {
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
    }
    return Promise.reject(error);
  }
);

export default api;
