/**
 * Validates required environment variables on startup.
 * Fails fast so production misconfiguration is obvious in Render logs.
 */
const REQUIRED = ['MONGODB_URI', 'JWT_SECRET'];

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL?.trim()) {
    console.warn(
      'Warning: CLIENT_URL is not set. CORS will allow localhost only in production.'
    );
  }
}
