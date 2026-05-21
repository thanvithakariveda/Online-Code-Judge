# Online Code Judge

**Full-stack online coding judge** — register, solve problems in the browser, submit code for automatic judging, earn points, and climb the leaderboard.

**Author:** Thanvitha Kari Veda  
**Repository:** https://github.com/thanvithakariveda/Online-Code-Judge  
**License:** MIT

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project structure](#project-structure)
6. [Local setup](#local-setup)
7. [Environment variables](#environment-variables)
8. [Production deployment](#production-deployment)
9. [API documentation](#api-documentation)
10. [Authentication](#authentication)
11. [Scoring system](#scoring-system)
12. [Scripts](#scripts)
13. [Testing checklist](#testing-checklist)
14. [Troubleshooting](#troubleshooting)

---

## Overview

Online Code Judge is a web application similar to LeetCode or CodeChef. Users create an account, browse coding problems by difficulty, write solutions in a built-in code editor (Monaco), and submit code. The backend runs test cases using **Judge0** and returns verdicts (Accepted, Wrong Answer, etc.). Points are awarded for first-time accepted solves.

**Example live URLs:**

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://online-code-judge-phi.vercel.app |
| Backend API (Render) | https://online-code-judge-final.onrender.com/api |

---

## Features

- User registration and login (JWT)
- Problem catalog with categories (Easy / Medium / Hard) and search
- Monaco code editor — C++, Python, Java, JavaScript
- Automatic judging (sample + hidden test cases)
- Verdicts: Accepted, Wrong Answer, TLE, CE, RE
- Dashboard with score, solved count, submissions
- Leaderboard ranked by score
- Admin panel to manage problems

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite 6, React Router v6, Tailwind CSS, Axios, Monaco Editor |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcryptjs |
| Database | MongoDB (Atlas in production) |
| Code runner | Judge0 CE (free) or RapidAPI Judge0 (optional) |
| Deploy | Vercel (frontend), Render (backend) |

---

## Architecture

```
┌─────────────┐     HTTPS      ┌─────────────┐     ┌──────────────┐
│   Vercel    │ ─────────────► │   Render    │ ───►│ MongoDB Atlas│
│  React SPA  │   /api/*       │  Express    │     │   Database   │
└─────────────┘                └──────┬──────┘     └──────────────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │  Judge0 CE  │
                               │ (code run)  │
                               └─────────────┘
```

---

## Project structure

```
online-code-judge/
├── backend/
│   ├── config/          # DB, CORS, env
│   ├── controllers/     # Auth, problems, submissions, leaderboard
│   ├── middleware/      # JWT auth, admin, errors
│   ├── models/          # User, Problem, Submission, Contest
│   ├── routes/
│   ├── services/        # Judge0, code runner, evaluation
│   ├── utils/           # Seed, API responses
│   ├── validators/
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/         # Axios + API services
│       ├── components/  # Navbar, editor, guards
│       ├── pages/       # Home, Login, Problems, Dashboard
│       ├── context/     # AuthContext
│       └── routes/
└── README.md            # This file
```

---

## Local setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-code-judge
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
JUDGE0_API_KEY=
```

```bash
npm install
npm run dev
```

Runs at http://localhost:5000

Optional seed:

```bash
npm run seed
# Admin: admin@codejudge.com / admin123
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Leave `frontend/.env` empty for local dev (Vite proxies `/api` to port 5000).

Open http://localhost:5173

---

## Environment variables

### Backend (Render / local)

| Variable | Required | Description |
|----------|----------|-------------|
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | JWT signing secret |
| CLIENT_URL | Prod: Yes | Vercel URL for CORS, e.g. https://your-app.vercel.app |
| JUDGE0_API_KEY | No | Empty = free ce.judge0.com |
| PORT | No | Default 5000 |
| NODE_ENV | No | production on Render |

### Frontend (Vercel / local)

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | Prod: Yes | Render host, e.g. https://your-api.onrender.com |

---

## Production deployment

### 1. MongoDB Atlas

1. Create cluster at https://www.mongodb.com/atlas
2. Create database user
3. Network Access → allow 0.0.0.0/0 (or specific IPs)
4. Copy connection string: `mongodb+srv://USER:PASS@cluster.mongodb.net/online-code-judge`

### 2. Render (backend)

| Setting | Value |
|---------|--------|
| Root directory | backend |
| Build command | npm install |
| Start command | npm start |

Environment variables:

```
NODE_ENV=production
MONGODB_URI=<atlas-uri>
JWT_SECRET=<long-random-string>
CLIENT_URL=https://your-app.vercel.app
```

Do not set JUDGE0_API_KEY to placeholder text — leave empty for free Judge0.

Test: https://your-api.onrender.com/api/health

### 3. Vercel (frontend)

| Setting | Value |
|---------|--------|
| Root directory | frontend |
| Build command | npm run build |
| Output directory | dist |

Environment variable:

```
VITE_API_URL=https://your-api.onrender.com
```

Redeploy after any env change.

### 4. Git push

```bash
git add .
git commit -m "Deploy online code judge"
git push origin main
```

---

## API documentation

**Base URL:** `https://your-api.onrender.com/api` (local: `http://localhost:5000/api`)

**Response format:**

Success:
```json
{ "success": true, "message": "...", "data": { } }
```

Error:
```json
{ "success": false, "message": "..." }
```

**Auth header (protected routes):**
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /health | No | Health check |
| POST | /auth/register | No | Register |
| POST | /auth/login | No | Login |
| GET | /auth/me | Yes | Profile |
| GET | /problems | No | List problems |
| GET | /problems/:id | Optional | Problem by ID |
| POST | /problems | Admin | Create problem |
| PUT | /problems/:id | Admin | Update problem |
| DELETE | /problems/:id | Admin | Delete problem |
| POST | /submissions | Yes | Submit code |
| GET | /submissions/me | Yes | My submissions |
| GET | /leaderboard | No | Leaderboard |

### Register

`POST /api/auth/register`

```json
{
  "username": "coder123",
  "email": "user@example.com",
  "password": "secret12"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "secret12"
}
```

Returns `data.token` and `data.user`.

### Submit code

`POST /api/submissions`

```json
{
  "problemId": "665f1a2b3c4d5e6f7a8b9c0d",
  "code": "import sys\nprint(sys.stdin.read().strip()[::-1])",
  "language": "python"
}
```

Languages: `cpp`, `python`, `java`, `javascript`

Success response includes `data.submission.verdict`, `data.scoreAwarded`, `data.user` (updated score).

---

## Authentication

1. User registers or logs in → receives JWT.
2. Token stored in browser localStorage.
3. Axios sends `Authorization: Bearer <token>` on protected routes.
4. Backend validates JWT and attaches user to request.
5. Admin routes require `role: admin`.

---

## Scoring system

| Event | Points |
|-------|--------|
| First Accepted solve on a problem | +10 |
| Solving same problem again | 0 |

Score shown in navbar, dashboard, and leaderboard.

---

## Scripts

**Backend**

| Command | Description |
|---------|-------------|
| npm run dev | Development (nodemon) |
| npm start | Production |
| npm run seed | Seed admin + problems |

**Frontend**

| Command | Description |
|---------|-------------|
| npm run dev | Dev server :5173 |
| npm run build | Production build |
| npm run preview | Preview build |

---

## Testing checklist

- [ ] Register new user
- [ ] Login / logout
- [ ] Browse problems (categories)
- [ ] Open problem, submit code
- [ ] Accepted → +10 points in navbar
- [ ] Dashboard shows score and problems
- [ ] Leaderboard loads
- [ ] Production: no CORS errors in browser console

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Register/login CORS error | Set CLIENT_URL on Render to exact Vercel URL |
| API wrong URL | Set VITE_API_URL on Vercel, redeploy |
| Judge0 API key error | Delete JUDGE0_API_KEY on Render (use free CE) |
| Wrong Answer | Code output must match expected; use starter solution |
| Points not updating | Redeploy latest code; points on first Accepted only |
| Render slow first load | Free tier cold start ~30–60s |

---

## Sample problems (auto-seeded)

| Title | Difficulty |
|-------|------------|
| Two Sum | Easy |
| Reverse String | Easy |
| Maximum Subarray | Medium |
| Valid Parentheses | Medium |

---

## License

MIT — free to use for learning and portfolio projects.
