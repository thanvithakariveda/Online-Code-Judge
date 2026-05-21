# Deployment Guide — Vercel + Render + MongoDB Atlas

## Architecture

| Service | Host | Role |
|---------|------|------|
| Frontend | Vercel | React SPA (`dist/`) |
| Backend | Render | Node.js Express API |
| Database | MongoDB Atlas | Persistent data |
| Code execution | Judge0 (RapidAPI) | Run user submissions |

---

## 1. MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → add user with password.
3. **Network Access** → allow `0.0.0.0/0` (or Render IPs) for development.
4. **Connect** → copy connection string:
   ```
   mongodb+srv://USER:PASS@cluster.mongodb.net/online-code-judge
   ```

---

## 2. Render (backend)

1. Connect your GitHub repo.
2. **Root directory:** `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. **Environment variables:**

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | Long random string (32+ chars) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `https://YOUR-APP.vercel.app` (no trailing slash) |
| `JUDGE0_API_URL` | `https://judge0-ce.p.rapidapi.com` |
| `JUDGE0_API_KEY` | Your RapidAPI key |
| `JUDGE0_HOST` | `judge0-ce.p.rapidapi.com` |

6. Deploy and note your URL, e.g. `https://online-code-judge-final.onrender.com`
7. Test: open `https://YOUR-SERVICE.onrender.com/api/health`

**Optional:** Run seed once locally or via Render shell:
```bash
npm run seed
```
Creates admin user (see `backend/utils/seed.js`).

---

## 3. Vercel (frontend)

1. Import repo from GitHub.
2. **Root directory:** `frontend`
3. **Framework:** Vite
4. **Build command:** `npm run build`
5. **Output directory:** `dist`
6. **Environment variable:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com` |

Host only is fine — the app appends `/api` automatically.

7. Deploy. `vercel.json` already includes SPA rewrites.

---

## 4. CORS checklist

- Render `CLIENT_URL` must **exactly** match your Vercel origin: `https://xxx.vercel.app`
- Include `https://` — no path, no trailing slash
- Redeploy backend after changing `CLIENT_URL`

---

## 5. Local development

**Backend** (`backend/.env` from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-code-judge
JWT_SECRET=dev_secret_change_me
CLIENT_URL=http://localhost:5173
JUDGE0_API_KEY=your_key
```

```bash
cd backend
npm install
npm run dev
```

**Frontend** — leave `VITE_API_URL` empty in `.env` (uses Vite proxy to `:5000`):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| Register fails / CORS | Set `CLIENT_URL` on Render; redeploy |
| API 404 on Vercel domain | Set `VITE_API_URL` to Render host; redeploy frontend |
| Submissions always error | Set `JUDGE0_API_KEY` on Render |
| Cold start slow (free tier) | First request after idle may take 30–60s |
| 401 after login | Check `JWT_SECRET` is set and stable across deploys |

---

## 7. Production URLs (example)

Replace with your actual URLs:

- Frontend: `https://online-code-judge-phi.vercel.app`
- Backend: `https://online-code-judge-final.onrender.com/api`
- Health: `https://online-code-judge-final.onrender.com/api/health`
