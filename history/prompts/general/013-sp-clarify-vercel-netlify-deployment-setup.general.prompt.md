---
id: "013"
title: "SP Clarify Vercel Netlify Deployment Setup"
stage: general
date: "2026-03-02"
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Syedabanog-1
command: "/sp.clarify — is analyze complete and implement done will app responsive at vercel deployment"
labels: ["sp.clarify", "netlify", "vercel", "railway", "neon", "deployment", "better-auth"]
links:
  spec: specs/phase-09-cloud/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - learnflow-app/frontend/netlify.toml
  - learnflow-app/frontend/package.json
  - specs/phase-09-cloud/spec.md
tests: []
---

## Prompt

is analyze complete and implement done will app responsive at vercel deployment
(followed by: deploy app on netlify)

## Response

### Clarification Questions Asked (3 of 5)
1. Q: Railway backend URL? → A: https://hackathon-03-production.up.railway.app
2. Q: Has setup-db.sql been run in Neon? → A: Ran migration directly via psycopg2 — all 4 Better Auth tables confirmed (user, session, account, verification)
3. Q: Vercel env vars set? → A: Not yet (b selected) — provided exact values to paste

### Netlify Deployment Setup
- Created learnflow-app/frontend/netlify.toml with @netlify/plugin-nextjs
- Added @netlify/plugin-nextjs to package.json devDependencies
- Committed and pushed as b738855
- Provided step-by-step Netlify deploy instructions
- Env vars needed: BETTER_AUTH_URL, BETTER_AUTH_SECRET, DATABASE_URL, NEXT_PUBLIC_KONG_URL

### Spec Updated
- specs/phase-09-cloud/spec.md: added Clarifications section with Railway URL,
  DB migration status, FR-006 (NEXT_PUBLIC_KONG_URL), FR-007 (ALLOWED_ORIGINS)

### Status Summary
- Analysis: COMPLETE (sp.analyze done, 4 critical fixes implemented)
- DB Migration: COMPLETE (4 tables created in Neon)
- Code fixes: COMPLETE (CORS, Dockerfile, login JSON error, BETTER_AUTH_URL)
- Vercel env vars: PENDING (user must set manually)
- Netlify config: COMPLETE (netlify.toml created and pushed)
- Railway CORS: Will need ALLOWED_ORIGINS update once Netlify URL is known
