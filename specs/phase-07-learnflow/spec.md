# Feature Specification: Phase 07 — LearnFlow Complete Application

**Feature Branch**: `phase-07-learnflow`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Student chats with Python tutor and runs code (Priority: P1)

Maya (student) logs in, sees her dashboard at Module 2 Loops 60%, asks the
tutor how for loops work, gets an explanation with code examples, writes a
loop in Monaco editor, runs it, and gets feedback from the Code Review agent.

**Acceptance Scenarios**:

1. **Given** Maya is logged in, **When** she types "How do for loops work?",
   **Then** Concepts agent responds with explanation + runnable example.
2. **Given** Maya writes `for i in range(5): print(i)`, **When** she clicks Run,
   **Then** code executes in sandbox (5s timeout, 50MB), output shown.
3. **Given** Maya runs correct loop, **When** Code Review agent evaluates,
   **Then** mastery for "loops" topic increases by calculated amount.

---

### User Story 2 — Teacher receives struggle alert and assigns exercises (Priority: P2)

James struggles with list comprehensions (3 wrong answers). Teacher Mr. Rodriguez
receives alert, views James's code attempts, prompts agent to generate easy
exercises, assigns with one click.

**Acceptance Scenarios**:

1. **Given** James fails 3 times on list comprehensions, **When** system evaluates,
   **Then** struggle alert sent to teacher via Kafka `struggle-alerts` topic.
2. **Given** teacher prompts "Create easy exercises on list comprehensions",
   **Then** Exercise agent generates 3 exercises graded automatically.
3. **Given** exercises assigned, **When** James completes them,
   **Then** mastery score updates and struggle alert clears.

---

### User Story 3 — Student takes quiz and mastery score updates (Priority: P3)

Maya takes a quiz on loops, gets 4/5, mastery updates to 68% (Learning level).

**Acceptance Scenarios**:

1. **Given** quiz triggered, **When** Maya answers 4/5 correct,
   **Then** mastery = weighted(40% exercise + 30% quiz + 20% code + 10% streak).

---

### Edge Cases

- Code sandbox timeout → return "✗ Execution timeout (5s limit)" to student.
- Kafka consumer lag > 5s → log warning but don't block student response.
- Student types "I don't understand" → triggers struggle detection.
- Kong Ingress backend names MUST match K8s Service names exactly (`triage-service`, `code-sandbox-service`, `progress-service`, `exercise-service`) — mismatch causes 503 on all API routes.

## Clarifications

### Session 2026-03-03

- Q: How should the AI tutor be powered on Netlify (no K8s/Kong available)? → A: Direct Anthropic API call from a Next.js `/api/tutor` route — no Kong dependency.
- Q: When a student clicks a module on the dashboard, what should happen? → A: Expand in-place to show topics list with a "Start topic" button that opens the editor.
- Q: What context should the AI tutor include per message? → A: Always include current topic name + current code in the editor as system context.
- Q: Where should progress data be stored/fetched on Netlify? → A: Neon PostgreSQL via Next.js API routes (DB already connected via Better Auth).
- Q: What should the editor pre-load when a topic is started? → A: A starter code template specific to that topic.

**FR-010 (Netlify)**: AI tutor MUST call Anthropic API directly from `/api/tutor` Next.js route; system prompt MUST include current topic name and editor code.
**FR-011 (Netlify)**: Dashboard module cards MUST expand in-place on click to reveal topics list; each topic has a "Start" button that navigates to `/editor?topic=<topicId>` with a pre-loaded starter code template.
**FR-012 (Netlify)**: Progress data (mastery scores, module completion) MUST be persisted in Neon PostgreSQL and fetched via `/api/progress` Next.js route; Kong gateway NOT required.

### Session 2026-02-21

- Q: What is the primary deployment target environment? → A: Minikube local — `imagePullPolicy: Never`; all images built via `eval $(minikube docker-env)` before `docker build`; cloud (Phase 09) is deferred.
- Q: Have Docker images been built yet? → A: No — all 8 images (7 backend services + frontend) must be built inside Minikube's Docker environment before deployment.
- Q: Is Minikube running? → A: No (Stopped) — must start with `minikube start --cpus=4 --memory=8192 --driver=docker` before any build or deploy step.
- Q: Docker Desktop only has 5,927 MB — spec requires 8,192 MB. How to resolve? → A: Increase Docker Desktop memory limit to 6,144 MB (6 GB) in Docker Desktop Settings › Resources › Memory, then start with `minikube start --cpus=4 --memory=6144 --driver=docker`.
- Q: Kong `routes.yaml` references service names `triage`, `code-sandbox`, `progress`, `exercise` but actual K8s Services are named `triage-service`, `code-sandbox-service`, `progress-service`, `exercise-service` — fix now or rename? → A: Fix `routes.yaml` now — updated all 4 backend names to match K8s Service names (avoids 503s at runtime).

**FR-009**: All Docker images MUST be built inside Minikube's Docker environment (`eval $(minikube docker-env)`) so `imagePullPolicy: Never` resolves correctly on all K8s pods.

## Requirements

### Functional Requirements

- **FR-001**: All 7 services (6 AI agents + code-sandbox) MUST be deployed via fastapi-dapr-agent skill.
- **FR-002**: Kafka topics (6): `student-events`, `tutor-requests`,
  `tutor-responses`, `progress-updates`, `struggle-alerts`,
  `exercise-requests` MUST exist.
- **FR-003**: Code sandbox MUST enforce 5s timeout and 50MB memory.
- **FR-004**: Standard library imports only; no network or filesystem access.
- **FR-005**: Mastery calculation: 40% exercises + 30% quiz + 20% code + 10% streak.
- **FR-006**: Struggle detection: same error 3+, stuck > 10 min, quiz < 50%,
  "I don't understand", 5+ failed executions.
- **FR-007**: All services MUST be built and deployed using skills only.
- **FR-008**: Commit messages MUST credit agent and skill used.

### Key Entities

- **Student**: userId, name, email, moduleProgress{}, streakDays
- **Module**: moduleId, name, topics[], lessons[]
- **Progress**: studentId, topicId, masteryScore, exerciseCount, quizScores[]
- **StruggleAlert**: studentId, topicId, triggerType, timestamp, resolved
- **Exercise**: exerciseId, topicId, difficulty, prompt, testCases[], solution

## Success Criteria

- **SC-001**: Full demo scenario (Part 8 of hackathon doc) runs end-to-end.
- **SC-002**: All services deployed via skills with zero manual coding.
- **SC-003**: Mastery calculation produces correct weighted score.
- **SC-004**: Struggle detection fires within 30s of trigger condition.
- **SC-005**: Teacher can assign exercises within 2 clicks after alert.
- **SC-006**: Code sandbox executes safely within constraints.
