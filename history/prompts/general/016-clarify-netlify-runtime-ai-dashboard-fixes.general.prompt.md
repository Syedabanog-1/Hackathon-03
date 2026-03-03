---
id: "016"
title: Clarify Netlify Runtime AI Dashboard Fixes
stage: general
date: 2026-03-03
surface: agent
model: claude-sonnet-4-6
feature: phase-07-learnflow
branch: main
user: Syedabanog-1
command: /sp.clarify
labels: ["clarify","netlify","ai-tutor","dashboard","progress","runtime"]
links:
  spec: specs/phase-07-learnflow/spec.md
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - specs/phase-07-learnflow/spec.md
tests:
  - "null"
---

## Prompt

runtime par i check ai assistant answer nhi daita ha sirf apna introduction kr waraha ha and dash board par topic ki detail nhi arahi ha sirf index ha ur age biggner likha huwa ha kise bhi topic mein deep dive kaisy krein

## Response snapshot

5-question clarification session run against phase-07-learnflow spec. Key gaps identified:
1. ChatPanel calls Kong gateway (unreachable on Netlify) → tutor only shows intro
2. Dashboard fetches progress from Kong (unreachable) → only static Beginner labels
3. No topic expand/deep-dive UX defined in spec

Answers accepted:
- A1: AI tutor → direct Anthropic API call from Next.js `/api/tutor` route
- A2: Dashboard modules expand in-place → topics list + "Start topic" → editor
- A3: Tutor context = current topic + editor code in every message
- A4: Progress data → Neon PostgreSQL via Next.js API route
- A5: Editor pre-load → starter code template per topic

Spec updated: FR-010, FR-011, FR-012 added under Session 2026-03-03.

## Outcome

- ✅ Impact: Spec now captures Netlify-specific runtime requirements; unblocks implementation of AI tutor and dashboard deep-dive
- 🧪 Tests: none run (clarification session only)
- 📁 Files: specs/phase-07-learnflow/spec.md updated
- 🔁 Next prompts: implement FR-010 (AI tutor API route), FR-011 (dashboard expand), FR-012 (progress DB)
- 🧠 Reflection: Kong gateway assumption was baked into frontend but never flagged as Netlify-incompatible

## Evaluation notes (flywheel)

- Failure modes observed: Kong dependency invisible in spec; Netlify deployment context not captured
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment: add Netlify-vs-K8s deployment mode as explicit spec dimension in constitution
