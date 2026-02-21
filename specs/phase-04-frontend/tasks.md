# Tasks: Phase 04 — Frontend Skill

**Input**: specs/phase-04-frontend/spec.md + plan.md
**Prerequisites**: Phase 03 complete; all backend services running; Kong deployed

## Phase 1: nextjs-k8s-deploy Skill

- [ ] T001 Create `skills-library/.claude/skills/nextjs-k8s-deploy/SKILL.md`
  - ≤ 150 tokens; references scaffold.sh, build.sh, deploy.sh, verify.sh
- [ ] T002 Create `skills-library/.claude/skills/nextjs-k8s-deploy/REFERENCE.md`
  - Next.js 14 app router, Monaco editor integration, multi-stage Docker
- [ ] T003 Create `scripts/scaffold.sh`
  - `npx create-next-app@14 frontend --typescript --tailwind --app`
  - `cd frontend && npm install @monaco-editor/react`
  - Generate pages: `app/page.tsx`, `app/dashboard/page.tsx`,
    `app/editor/page.tsx`, `app/quiz/page.tsx`
  - Generate components: `CodeEditor.tsx`, `ChatPanel.tsx`, `ProgressBar.tsx`
  - Generate Dockerfile (multi-stage), k8s/deployment.yaml, k8s/service.yaml
  - Print "✓ Next.js frontend scaffolded (4 pages, 3 components)"
- [ ] T004 Create `scripts/build.sh`
  - `eval $(minikube docker-env)`
  - `docker build -t learnflow-frontend:latest ./frontend`
  - Print "✓ Frontend image built"
- [ ] T005 Create `scripts/deploy.sh`
  - `kubectl apply -f frontend/k8s/`
  - `kubectl rollout status deployment/frontend`
  - Print "✓ Frontend deployed"
- [ ] T006 Create `scripts/verify.sh`
  - `minikube service frontend-svc --url`
  - Print "✓ Frontend accessible at <URL>"

---

## Phase 2: Deploy Frontend (US1)

- [ ] T007 Test on Claude Code: "Deploy Next.js frontend using nextjs-k8s-deploy skill"
- [ ] T008 Access frontend URL; verify home page loads
- [ ] T009 Navigate to /editor; verify Monaco renders with Python highlighting
- [ ] T010 [P] Test on Goose: same prompt, verify identical deployment
- [ ] T011 Verify pod Running; build completed without errors

---

## Phase 3: Authentication (Better Auth) — FR-008, FR-009

- [ ] T012 Install Better Auth: add to scaffold.sh — `npm install better-auth`
  - Configure `lib/auth.ts` with student/teacher roles
  - Configure `app/api/auth/[...all]/route.ts`
  - Generate `/login` page with email + password form
  - Add session middleware protecting /dashboard, /editor, /quiz, /teacher
  - Print "✓ Better Auth configured (2 roles: student, teacher)"
- [ ] T013 Add `/teacher` page to scaffold.sh output
  - Teacher-only: view class struggle alerts, assign exercises
  - Redirect non-teacher role to /dashboard
- [ ] T014 Create K8s ConfigMap `frontend-config` in scaffold output:
  - `KONG_URL: http://kong-proxy.kong.svc.cluster.local`
  - frontend reads via `process.env.KONG_URL`

---

## Phase 4: Frontend–Backend Integration

- [ ] T015 Test CodeEditor → Run button → Kong → code-sandbox → result displayed
- [ ] T016 Test ChatPanel → tutor message → Kong → triage → concepts response
- [ ] T017 Test login flow: student credentials → JWT → protected route accessible

---

## Phase 5: Commit

- [ ] T018 Commit: "Claude: deployed Next.js frontend with Better Auth using nextjs-k8s-deploy skill"
