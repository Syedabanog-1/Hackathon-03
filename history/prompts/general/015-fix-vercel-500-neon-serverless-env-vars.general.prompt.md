---
id: "015"
title: "Fix Vercel 500 Neon Serverless Env Vars"
stage: general
date: "2026-03-02"
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Syedabanog-1
command: "fix vercel 500 server error about environmental variable"
labels: ["vercel", "500-error", "neon", "serverless", "better-auth", "env-vars"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - learnflow-app/frontend/src/lib/auth.ts
  - learnflow-app/frontend/package.json
tests: []
---

## Prompt

at vercel i'm finding server error 500 saying about environmental variable fix it

## Response

### Root Causes Found
1. `pg.Pool` with undefined `DATABASE_URL` → silent broken pool → 500 on any auth request
2. `pg` package not serverless-compatible with Neon on Vercel — needs `@neondatabase/serverless`

### Fixes Applied (commit 3f96723)
1. Replaced `pg.Pool` with `@neondatabase/serverless` Pool in `auth.ts`
2. Added `neonConfig.webSocketConstructor = ws` for Node.js serverless compatibility
3. Added explicit `DATABASE_URL` guard — throws clear error if env var missing
4. Added `@neondatabase/serverless` and `ws` to package.json dependencies

### User Action Required
Must set these 4 env vars on Vercel dashboard (Settings → Environment Variables):
- DATABASE_URL = postgresql://neondb_owner:...@neon.tech/neondb?sslmode=require
- BETTER_AUTH_SECRET = 5fc3b99ce750b0f46b290d1d2b550451e9295e523629a180708836ed228f8663
- BETTER_AUTH_URL = https://hackathon-03-mauve.vercel.app
- NEXT_PUBLIC_KONG_URL = https://hackathon-03-production.up.railway.app
Then trigger redeploy on Vercel.
