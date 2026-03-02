---
id: "014"
title: "Netlify Deployment Form Fields Guide"
stage: general
date: "2026-03-02"
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Syedabanog-1
command: "/sp.analyze — netlify deployment form fill guide"
labels: ["netlify", "deployment", "env-vars", "build-settings"]
links:
  spec: specs/phase-09-cloud/spec.md
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

## Prompt

https://app.netlify.com/start/repos/Syedabanog-1%2FHackathon-03 fill all field to see this app

## Response

Provided exact Netlify deployment form values:
- Base directory: learnflow-app/frontend
- Build command: npm install --legacy-peer-deps && npm run build
- Publish directory: learnflow-app/frontend/.next
- Branch: main
- Env vars: BETTER_AUTH_SECRET, DATABASE_URL, NEXT_PUBLIC_KONG_URL (BETTER_AUTH_URL set post-deploy)

Note: sp.analyze was triggered but user intent was Netlify form configuration assistance.
Post-deploy: user must set BETTER_AUTH_URL and trigger redeploy.
Railway CORS update needed once Netlify URL is known.
