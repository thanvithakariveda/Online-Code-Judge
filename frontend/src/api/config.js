export function getApiBaseUrl() {
  const raw = (import.meta.env.VITE_API_URL || "").trim();

  if (!raw) {
    return import.meta.env.DEV
      ? "http://localhost:5000"
      : "";
  }

  return raw.replace(/\/+$/, "");
}