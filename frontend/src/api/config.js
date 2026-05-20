export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;

  // DEFAULT SAFE VALUE (IMPORTANT FIX)
  const fallback = "https://online-code-judge-2.onrender.com";

  if (!raw || raw.trim() === "") {
    return fallback;
  }

  return raw.replace(/\/+$/, "");
}