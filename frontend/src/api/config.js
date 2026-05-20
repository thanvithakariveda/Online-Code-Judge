/**
 * Resolves API base URL. Backend routes are always under /api.
 * Vercel: set VITE_API_URL to https://your-service.onrender.com (with or without /api)
 * Local dev: omit or use /api to use Vite proxy → localhost:5000
 */
export function getApiBaseUrl() {
  const raw = (import.meta.env.VITE_API_URL || "").trim();

  if (!raw) {
    return import.meta.env.DEV ? "/api" : "";
  }

  if (raw.startsWith("/")) {
    const path = raw.replace(/\/+$/, "");
    return path.endsWith("/api") ? path : `${path}/api`;
  }

  try {
    const { origin } = new URL(raw);
    return `${origin}/api`;
  } catch {
    const base = raw.replace(/\/+$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
  }
}
