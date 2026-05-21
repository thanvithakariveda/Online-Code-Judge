# Online Code Judge

Full-stack coding practice platform (React + Express + MongoDB + Judge0).

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite 6, Tailwind, Axios, Monaco Editor |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcrypt |
| Database | MongoDB (Atlas in production) |
| Deploy | Vercel (frontend), Render (backend) |

## Quick start (local)

```bash
# Backend
cd backend
cp .env.example .env   # edit MONGODB_URI, JWT_SECRET, JUDGE0_API_KEY
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/API.md](docs/API.md) | REST API reference |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel + Render + Atlas setup |
| [docs/TESTING_CHECKLIST.md](docs/TESTING_CHECKLIST.md) | Manual QA checklist |
| [docs/postman/](docs/postman/) | Postman collection + environments |

### Postman

1. Import `docs/postman/Online-Code-Judge.postman_collection.json`
2. Import `docs/postman/Local.postman_environment.json` or `Production.postman_environment.json`
3. Run **Auth → Register** or **Login** (saves `token` automatically)
4. Run protected requests

## Environment variables

**Backend** — see [backend/.env.example](backend/.env.example)

**Frontend** — see [frontend/.env.example](frontend/.env.example)

Production:

- Render: `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, Judge0 keys
- Vercel: `VITE_API_URL=https://your-api.onrender.com`

## Project structure

```
online-code-judge/
├── backend/          Express API
├── frontend/         React SPA
└── docs/             API docs, Postman, deployment, testing
```

## License

MIT
