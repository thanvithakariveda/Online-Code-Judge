# Environment Variables Reference

## Backend (`backend/.env`)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | HTTP port (Render sets automatically) |
| `NODE_ENV` | No | `development` | `production` on Render |
| `MONGODB_URI` | **Yes** | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | **Yes** | random 32+ chars | Signs auth tokens |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `CLIENT_URL` | Prod: **Yes** | `https://app.vercel.app` | CORS allowed origin(s), comma-separated |
| `ALLOWED_ORIGINS` | No | `https://preview.vercel.app` | Extra CORS origins |
| `JUDGE0_API_URL` | No | `https://judge0-ce.p.rapidapi.com` | Judge0 base URL |
| `JUDGE0_API_KEY` | For submissions | RapidAPI key | Required to run code |
| `JUDGE0_HOST` | No | `judge0-ce.p.rapidapi.com` | RapidAPI host header |
| `SEED_ADMIN_EMAIL` | No | `admin@codejudge.com` | Used by `npm run seed` only |

Copy template:
```bash
cp backend/.env.example backend/.env
```

---

## Frontend (`frontend/.env`)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Prod: **Yes** | `https://api.onrender.com` | Backend host; `/api` appended in code |

**Local:** leave empty — Vite proxies `/api` → `http://localhost:5000`

Copy template:
```bash
cp frontend/.env.example frontend/.env
```

---

## Render dashboard (backend)

Set all backend variables from the table above. Minimum for production:

```
NODE_ENV=production
MONGODB_URI=...
JWT_SECRET=...
CLIENT_URL=https://YOUR.vercel.app
JUDGE0_API_KEY=...
```

---

## Vercel dashboard (frontend)

```
VITE_API_URL=https://YOUR.onrender.com
```

Redeploy after changing `VITE_*` variables.
