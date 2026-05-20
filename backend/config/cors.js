import cors from 'cors';

/**
 * Build allowed origins from CLIENT_URL and ALLOWED_ORIGINS (comma-separated).
 * Localhost is always allowed for development.
 */
function parseAllowedOrigins() {
  const raw = [process.env.CLIENT_URL, process.env.ALLOWED_ORIGINS]
    .filter(Boolean)
    .join(',');

  const origins = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((origin) => {
      if (/^https?:\/\//i.test(origin)) {
        return origin.replace(/\/$/, '');
      }
      return `https://${origin.replace(/\/$/, '')}`;
    });

  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174');
  }

  return [...new Set(origins)];
}

function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin) return true;

  const normalized = origin.replace(/\/$/, '');
  if (allowedOrigins.includes(normalized)) return true;

  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
  } catch {
    /* ignore invalid origin */
  }

  return false;
}

export function getCorsOptions() {
  const allowedOrigins = parseAllowedOrigins();

  return {
    origin(origin, callback) {
      if (isAllowedOrigin(origin, allowedOrigins)) {
        return callback(null, true);
      }
      console.warn('CORS blocked:', origin, '| allowed:', allowedOrigins);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

export function corsMiddleware() {
  const options = getCorsOptions();
  return [cors(options), cors(options)];
}
