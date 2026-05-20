import axios from "axios";
import { AUTH_STORAGE, ROUTES } from "../constants/routes.js";

const api = axios.create({
  baseURL: "https://online-code-judge-final.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/** keep relative paths */
function ensureRelativePath(url) {
  if (!url) return url;
  return String(url).replace(/^\/+/, "");
}

function unwrapResponse(body) {
  if (
    body &&
    typeof body === "object" &&
    body.success === true &&
    body.data !== undefined
  ) {
    return {
      success: body.success,
      message: body.message,
      ...body.data,
    };
  }

  return body;
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