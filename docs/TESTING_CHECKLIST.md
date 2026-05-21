# Testing Checklist

Use this after local changes or before/after production deploy.  
Import [`postman/Online-Code-Judge.postman_collection.json`](./postman/Online-Code-Judge.postman_collection.json) for API tests.

---

## Environment setup

- [ ] Backend `.env` has `MONGODB_URI`, `JWT_SECRET`
- [ ] Backend running: `cd backend && npm run dev`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Postman environment `Local` selected (`baseUrl` = `http://localhost:5000/api`)

---

## API — Health

- [ ] `GET /api/health` → `success: true`, `data.status: "ok"`

---

## API — Auth

- [ ] `POST /auth/register` with new user → 201, `data.token` present
- [ ] `POST /auth/register` duplicate email → 400
- [ ] `POST /auth/login` valid credentials → 200, `data.token` present
- [ ] `POST /auth/login` wrong password → 401
- [ ] `GET /auth/me` with Bearer token → 200, `data.user`
- [ ] `GET /auth/me` without token → 401

---

## API — Problems

- [ ] `GET /problems` → list with `data.count`
- [ ] `GET /problems?difficulty=Easy` → filtered list
- [ ] `GET /problems/:id` → single problem (no hidden tests for user)
- [ ] `POST /problems` as admin → 201
- [ ] `POST /problems` as regular user → 403
- [ ] `PUT /problems/:id` as admin → 200
- [ ] `DELETE /problems/:id` as admin → 200

---

## API — Submissions (requires Judge0 key)

- [ ] `POST /submissions` with valid code → verdict returned
- [ ] `POST /submissions` without token → 401
- [ ] `POST /submissions` invalid `language` → 400
- [ ] `GET /submissions/me` → user's submissions

---

## API — Leaderboard

- [ ] `GET /leaderboard` → `data.leaderboard` array with `rank`, `username`, `score`
- [ ] `GET /leaderboard?limit=5` → max 5 entries

---

## Frontend — Auth flow

- [ ] Register new account → redirect to dashboard, toast success
- [ ] Logout → token cleared, navbar shows Login
- [ ] Login → dashboard loads
- [ ] Visit `/login` while logged in → redirect to dashboard
- [ ] Visit `/dashboard` logged out → redirect to login
- [ ] Refresh page while logged in → session restored (`/auth/me`)

---

## Frontend — Problems & submit

- [ ] `/problems` loads list, search and difficulty filter work
- [ ] Open problem detail → description and sample I/O show
- [ ] Submit without login → toast “Please login”
- [ ] Submit logged in → verdict panel updates
- [ ] Wrong code → `Wrong Answer` or error verdict

---

## Frontend — Dashboard & submissions

- [ ] Dashboard shows score, solved count, recent submissions
- [ ] Dashboard handles API failure (error state, not blank crash)
- [ ] `/submissions` shows history table

---

## Frontend — Admin (admin user only)

- [ ] `/admin/problems` blocked for non-admin → redirect dashboard
- [ ] Create problem with hidden test cases → appears in list
- [ ] Edit and delete problem work

---

## Production deploy verification

- [ ] Render: all env vars set (`CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, Judge0)
- [ ] Vercel: `VITE_API_URL` = Render host (no `/api` suffix required)
- [ ] `GET https://YOUR-API.onrender.com/api/health` OK
- [ ] Register on live Vercel URL works (no CORS error in DevTools)
- [ ] Network tab shows requests to `.../api/auth/register` (with `/api` prefix)

---

## Sign-off

| Tester | Date | Environment | Pass/Fail |
|--------|------|-------------|-----------|
|        |      | Local / Prod |           |
