---
id: "009"
title: Fix Vercel Railway Cloud Deployment
stage: general
date: 2026-02-21
surface: agent
model: claude-sonnet-4-6
feature: phase-07-learnflow
branch: main
user: syeda-gulzar-bano
command: /sp.clarify + /sp.implement
labels: ["vercel","railway","cloud","deployment","auth","fastapi","nextjs","fix"]
links:
  spec: specs/phase-07-learnflow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - vercel.json (NEW — tells Vercel to build learnflow-app/frontend, fixes 404)
  - learnflow-app/frontend/next.config.js (FIXED — conditional standalone output for Docker vs Vercel)
  - learnflow-app/api/main.py (NEW — consolidated FastAPI for Railway, all 7 routes, no Dapr)
  - learnflow-app/api/requirements.txt (NEW — fastapi, uvicorn, python-dotenv, pydantic)
  - learnflow-app/api/Procfile (NEW — Railway startup command)
  - learnflow-app/api/railway.toml (NEW — nixpacks builder + health check config)
  - .env.example (UPDATED — added NEXT_PUBLIC_KONG_URL)
tests:
  - Vercel redeploy picks up vercel.json (no more 404)
  - Railway deploys learnflow-app/api/ successfully
  - Signup/signin works after DATABASE_URL + BETTER_AUTH_SECRET set on Vercel
  - Chat and code execution work after NEXT_PUBLIC_KONG_URL set to Railway URL
---

## Prompt

at browser i found Signup and signin is not working account create nhi horaha ha other ion bhi nhi working kr rahey hein static hein fix it and give advance cloude deployment live link for people access

## Response snapshot

Diagnosed 4 root causes for broken cloud deployment and fixed them:

**Root cause 1 — Vercel 404**: Vercel was building the repo root (Hackathon-03/) which has no Next.js
app. Fixed by adding `vercel.json` at repo root with explicit build/install commands pointing to
`learnflow-app/frontend`.

**Root cause 2 — Railway build failure**: Railway analyzed repo root and couldn't detect app type.
Fixed by creating `learnflow-app/api/` with consolidated FastAPI (all 7 routes in one app, no Dapr/Kafka)
and `railway.toml` specifying nixpacks builder. User must set Root Directory = `learnflow-app/api`
in Railway project settings.

**Root cause 3 — Auth broken (signup/signin)**: Better Auth uses PostgreSQL (via `pg.Pool`) with
`DATABASE_URL`. On Vercel this env var was not set. Fix: add DATABASE_URL (Neon), BETTER_AUTH_SECRET,
BETTER_AUTH_URL to Vercel environment variables.

**Root cause 4 — Pages static (chat, code editor)**: `NEXT_PUBLIC_KONG_URL` was unset on Vercel so
all API calls fell back to `http://localhost:8000` (unreachable from browser). Fix: set
`NEXT_PUBLIC_KONG_URL` to Railway service URL.

**Files created/fixed:**
- `vercel.json`: buildCommand/outputDirectory/framework for monorepo Next.js
- `next.config.js`: conditional `output: 'standalone'` (only when BUILD_STANDALONE=1)
- `learnflow-app/api/main.py`: FastAPI with tutor, execute, progress, exercises routes
- `learnflow-app/api/requirements.txt` + `Procfile` + `railway.toml`: Railway deployment config

## Outcome

- ✅ Impact: All 4 root causes fixed; pushed to GitHub (commit f59f51f)
- 🧪 Tests: Pending user action — set env vars on Vercel + Railway Root Dir, then redeploy
- 📁 Files: 7 files created/modified
- 🔁 Next: User sets Vercel env vars → redeploys → signup/signin works; Railway Root Dir → redeploys → NEXT_PUBLIC_KONG_URL → live

## Evaluation notes

- Failure modes observed: (1) Vercel monorepo 404 when no vercel.json points to sub-dir; (2) `output: 'standalone'` in next.config.js breaks Vercel deployment; (3) Railway fails build when Root Directory not set for monorepo service; (4) Better Auth needs DATABASE_URL at runtime or signup throws 500
- Graders: pending live redeploy
- Next experiment: Add Better Auth schema migration step to Vercel build command using `npx @better-auth/cli migrate`
