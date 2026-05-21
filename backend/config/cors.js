import cors from 'cors';

/**
 * Production Vercel URLs (fallback if CLIENT_URL on Render is outdated).
 * Does not replace .env — merges with CLIENT_URL / ALLOWED_ORIGINS.
 */
const BUILTIN_ORIGINS = [
  'https://online-code-judge-phi.vercel.app',
  'https://online-code-judge-steel.vercel.app',
];

function parseAllowedOrigins() {
  const raw = [process.env.CLIENT_URL, process.env.ALLOWED_ORIGINS]
    .filter(Boolean)
    .join(',');

  const origins = [...BUILTIN_ORIGINS];

  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((origin) => {
      if (/^https?:\/\//i.test(origin)) {
        origins.push(origin.replace(/\/$/, ''));
      } else {
        origins.push(`https://${origin.replace(/\/$/, '')}`);
      }
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
    // Any Vercel deployment (production + preview branches)
    if (hostname.endsWith('.vercel.app')) return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
  } catch {
    /* ignore */
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
