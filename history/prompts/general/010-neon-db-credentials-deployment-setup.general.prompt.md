---
id: "010"
title: Neon DB Credentials Deployment Setup
stage: general
date: 2026-02-21
surface: agent
model: claude-sonnet-4-6
feature: phase-07-learnflow
branch: main
user: syeda-gulzar-bano
command: /sp.clarify
labels: ["neon","database","credentials","security","vercel","deployment"]
links:
  spec: specs/phase-07-learnflow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - .env.example (FIXED — removed real credentials, replaced with placeholders)
tests:
  - .env.example contains no real passwords or tokens
---

## Prompt

DATABASE_UR='postgresql://neondb_owner:npg_JF6HWpor5xTZ@ep-orange-mud-aisqb5wn-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

## Response snapshot

User provided Neon DATABASE_URL via /sp.clarify context (with typo: DATABASE_UR instead of DATABASE_URL).
Identified security risk: real credentials were written into .env.example which is tracked by git.
Immediately cleaned .env.example (replaced real values with placeholders) and pushed to GitHub.
Provided exact Vercel env var values and Neon SQL Editor migration steps.

## Outcome

- ✅ Security: Real credentials removed from .env.example (commit 3c6d347)
- 📋 Action required: User must set Vercel env vars manually (never paste credentials in chat)
- 🔑 Recommendation: Rotate the Neon password after this session (credentials were exposed in .env.example)
