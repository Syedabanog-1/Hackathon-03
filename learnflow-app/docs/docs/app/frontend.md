---
sidebar_position: 3
---

# Frontend

## Tech Stack

- **Next.js 14** — App router, TypeScript, standalone output
- **Monaco Editor** — VS Code-like Python editor in browser
- **Better Auth** — Email/password auth with student/teacher roles
- **Tailwind CSS** — Utility-first styling

## Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in / Sign up (student or teacher) |
| `/dashboard` | Student | 8 Python modules with progress bars |
| `/editor` | Student | Monaco editor + AI chat panel |
| `/quiz` | Student | Python knowledge quiz |
| `/teacher` | Teacher | Struggle alerts + exercise generation |

## Authentication Flow

```
POST /api/auth/sign-up  → Creates user with role (student/teacher)
POST /api/auth/sign-in  → Returns session cookie
GET  /api/auth/session  → Returns current user
```

Auth middleware protects `/dashboard`, `/editor`, `/quiz`, `/teacher`.
Teachers accessing student routes are redirected to `/teacher`.

## Code Execution Flow

```
Monaco Editor → Run button
  → POST /api/v1/execute (via Kong)
  → code-sandbox-service
  → subprocess.run(["python3", ...], timeout=5)
  → Output displayed in editor panel
```

## AI Chat Flow

```
Chat panel → Send message
  → detectIntent(message)       # client-side keyword matching
  → POST /api/v1/tutor (Kong)
  → triage-service              # routes to specialist
  → specialist agent (OpenAI)
  → response displayed in chat
```
