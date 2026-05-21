# Online Code Judge — API Documentation

**Base URL (local):** `http://localhost:5000/api`  
**Base URL (production):** `https://YOUR-SERVICE.onrender.com/api`

All JSON responses use this shape:

**Success**
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Authentication:** Protected routes require header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Plain text — server alive |
| GET | `/api/health` | No | JSON health check |

**Example — GET `/api/health`**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": { "status": "ok" }
}
```

---

## Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Sign in |
| GET | `/me` | Yes | Current user profile |

### POST `/api/auth/register`

**Body**
```json
{
  "username": "coder123",
  "email": "user@example.com",
  "password": "secret12"
}
```

**Success (201)**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbG...",
    "user": {
      "id": "...",
      "username": "coder123",
      "email": "user@example.com",
      "role": "user",
      "score": 0
    }
  }
}
```

### POST `/api/auth/login`

**Body**
```json
{
  "email": "user@example.com",
  "password": "secret12"
}
```

**Success (200)** — same `data.token` + `data.user` shape as register.

### GET `/api/auth/me`

**Success (200)**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "coder123",
      "email": "user@example.com",
      "role": "user",
      "score": 10,
      "solvedProblems": []
    }
  }
}
```

---

## Problems — `/api/problems`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | List problems (query: `difficulty`, `tag`, `search`) |
| GET | `/slug/:slug` | No | Get by slug |
| GET | `/:id` | Optional | Get by ID (admin sees hidden tests) |
| POST | `/` | Admin | Create problem |
| PUT | `/:id` | Admin | Update problem |
| DELETE | `/:id` | Admin | Delete problem |

### GET `/api/problems?difficulty=Easy&search=array`

**Success**
```json
{
  "success": true,
  "message": "Problems fetched successfully",
  "data": {
    "count": 2,
    "problems": [ { "_id": "...", "title": "...", "difficulty": "Easy" } ]
  }
}
```

### POST `/api/problems` (admin)

**Body (example)**
```json
{
  "title": "Two Sum",
  "description": "Find two numbers...",
  "constraints": "1 <= n <= 10^4",
  "sampleInput": "4\n2 7 11 15\n9",
  "sampleOutput": "0 1",
  "difficulty": "Easy",
  "tags": ["array", "hash"],
  "hiddenTestCases": [
    { "input": "3\n3 2 4\n6", "output": "1 2" }
  ]
}
```

---

## Submissions — `/api/submissions`

All routes require JWT.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Submit code for judging |
| GET | `/me` | Current user's submissions |
| GET | `/problem/:problemId` | Submissions for one problem |
| GET | `/:id` | Single submission (owner or admin) |

### POST `/api/submissions`

**Body**
```json
{
  "problemId": "665f1a2b3c4d5e6f7a8b9c0d",
  "code": "print(input())",
  "language": "python"
}
```

**Languages:** `cpp`, `python`, `java`, `javascript`

**Success (201)**
```json
{
  "success": true,
  "message": "Submission evaluated successfully",
  "data": {
    "submission": {
      "_id": "...",
      "verdict": "Accepted",
      "runtime": 0.12,
      "memory": 10240,
      "errorMessage": ""
    }
  }
}
```

**Verdicts:** `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Compilation Error`, `Runtime Error`, `Pending`

---

## Leaderboard — `/api/leaderboard`

| Method | Path | Auth | Query |
|--------|------|------|-------|
| GET | `/` | No | `limit` (default 50, max 100) |

**Success**
```json
{
  "success": true,
  "message": "Leaderboard fetched successfully",
  "data": {
    "leaderboard": [
      { "rank": 1, "username": "alice", "score": 30, "solvedCount": 3 }
    ]
  }
}
```

---

## Contests — `/api/contests`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | List contests |
| GET | `/:id` | No | Contest detail |
| POST | `/` | Admin | Create contest |

---

## HTTP status codes

| Code | When |
|------|------|
| 200 | OK |
| 201 | Created (register, submission, create problem) |
| 400 | Validation / duplicate / bad ID |
| 401 | Missing or invalid JWT |
| 403 | Not admin / not owner |
| 404 | Resource not found |
| 500 | Server error |

---

## Frontend note

The React app axios interceptor **unwraps** `data` into `response.data`, so pages use `response.data.token` instead of `response.data.data.token`. Postman and curl use the raw format above.

Import the collection from [`postman/Online-Code-Judge.postman_collection.json`](./postman/Online-Code-Judge.postman_collection.json).
