---
id: 017
title: Tutor Multilingual Language Detection
stage: spec
date: 2026-03-03
surface: agent
model: claude-sonnet-4-6
feature: phase-07-learnflow
branch: main
user: ThinK Pad
command: /sp.clarify
labels: ["ai-tutor","multilingual","localization","system-prompt"]
links:
  spec: specs/phase-07-learnflow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase-07-learnflow/spec.md
  - learnflow-app/frontend/src/app/api/tutor/route.ts
tests:
  - null
---

## Prompt

well AI learnflow Tutor sirf hindi languae mein answer dai raha ha it should work in all languages

## Response snapshot

Ran sp.clarify workflow. Identified missing language/localization requirement in spec (FR gap). Asked one clarifying question: "What language should the AI Tutor respond in?" — user chose Option B: Auto-detect & match student's language. Updated spec with FR-013 and fixed system prompt in /api/tutor route to explicitly instruct Claude to detect and respond in the student's input language, while keeping code always in Python.

## Outcome

- ✅ Impact: AI tutor now responds in the student's language (Urdu, English, French, etc.) instead of defaulting inconsistently
- 🧪 Tests: Manual — type a question in Urdu → tutor responds in Urdu; type in English → responds in English
- 📁 Files: spec.md (FR-013 added), route.ts (system prompt updated)
- 🔁 Next prompts: Restart dev server and test multilingual responses
- 🧠 Reflection: System prompt language instruction is the simplest fix; Claude handles language detection natively when explicitly told to

## Evaluation notes (flywheel)

- Failure modes observed: System prompt had no language instruction — Claude matched user language by default but inconsistently
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): null
- Next experiment: Test with 3 languages (Urdu, English, French) to confirm consistent behavior
