# Online Code Judge

A full-stack coding platform similar to **LeetCode** and **CodeChef**. Practice problems, submit code in multiple languages, get instant verdicts via **Judge0**, and compete on the leaderboard.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Monaco Editor, Axios |
| Backend | Node.js, Express, MongoDB, JWT |
| Execution | Judge0 API |
| Deploy | Vercel (frontend), Render (backend), MongoDB Atlas |

## Project Structure

```
online-code-judge/
├── backend/                 # Express REST API
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, admin, errors
│   ├── models/              # User, Problem, Submission, Contest
│   ├── routes/              # API routes
│   ├── services/            # Judge0 integration
│   ├── utils/               # Seed script, helpers
│   ├── server.js            # Entry point
│   ├── Dockerfile
│   └── .env.example
├── frontend/                # React SPA
│   ├── src/
│   │   ├── api/             # Axios client & services
│   │   ├── components/      # Navbar, Sidebar, Editor, etc.
│   │   ├── context/         # Auth (localStorage JWT)
│   │   ├── pages/           # All screens
│   │   └── utils/           # Templates, verdict helpers
│   ├── vercel.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local, Atlas, or Docker)
- **Judge0** API key ([RapidAPI Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)) or self-hosted Judge0

## Installation

### 1. Clone and install dependencies

```bash
cd online-code-judge

cd backend
npm install
cp .env.example .env

cd ../frontend
npm install
cp .env.example .env
```

### 2. Configure backend (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-code-judge
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_HOST=judge0-ce.p.rapidapi.com
```

### 3. Configure frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed database (optional)

```bash
cd backend
npm run seed
```

Creates admin user: `admin@codejudge.com` / `admin123` and sample problems.

### 5. Run development servers

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**

## MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist your IP.
3. Set `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/online-code-judge`

## Judge0 API Setup

### Option A: RapidAPI (recommended for beginners)

1. Sign up at [RapidAPI](https://rapidapi.com/).
2. Subscribe to [Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce).
3. Copy your API key to `JUDGE0_API_KEY` in backend `.env`.

### Option B: Self-hosted Docker

See [Judge0 GitHub](https://github.com/judge0/judge0). Set `JUDGE0_API_URL` to your instance URL.

## Deployment

- **Frontend:** Deploy `frontend/` to Vercel with `VITE_API_URL` pointing to your API.
- **Backend:** Deploy `backend/` to Render with env vars from `.env.example`.
- **Database:** MongoDB Atlas connection string in Render.

## Admin

After seeding: login as `admin@codejudge.com` / `admin123` → `/admin/problems`

## License

MIT
