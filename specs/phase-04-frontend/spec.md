# Feature Specification: Phase 04 — Frontend Skill

**Feature Branch**: `phase-04-frontend`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Deploy Next.js app with Monaco editor to Kubernetes (Priority: P1)

Agent scaffolds Next.js 14 application with Monaco code editor embedded,
builds a Docker image, and deploys to Kubernetes.

**Why this priority**: Students need the UI to write code, chat with tutors,
and view progress. This is the primary student-facing interface.

**Independent Test**: After single prompt, access `minikube service frontend-svc`
in browser; Monaco editor loads and a Python snippet can be typed.

**Acceptance Scenarios**:

1. **Given** nextjs-k8s-deploy skill triggered, **When** agent runs script,
   **Then** Next.js project created in `frontend/`, Docker image built.
2. **Given** image built, **When** deploy script runs, **Then** pod Running
   and service exposed via NodePort.
3. **Given** page loads, **When** student visits `/editor`, **Then** Monaco
   editor renders with Python syntax highlighting.

---

### User Story 2 — Student dashboard shows progress (Priority: P2)

Dashboard page shows module completion percentages and mastery levels
(Beginner/Learning/Proficient/Mastered).

**Acceptance Scenarios**:

1. **Given** student logs in, **When** dashboard loads, **Then** all 8 modules
   shown with progress percentages from API.

---

### Edge Cases

- Minikube image registry not enabled → script must enable addon automatically.
- npm build fails → script must surface error, not silently fail.

## Requirements

### Functional Requirements

- **FR-001**: nextjs-k8s-deploy MUST scaffold Next.js 14 with TypeScript.
- **FR-002**: Monaco editor MUST be installed and configured for Python.
- **FR-003**: Dockerfile MUST use multi-stage build (builder + runner).
- **FR-004**: K8s Deployment + Service MUST be created.
- **FR-005**: Skill MUST build image in Minikube's Docker environment.
- **FR-006**: Frontend MUST have pages: `/`, `/login`, `/dashboard`, `/editor`,
  `/quiz`, `/teacher`.
- **FR-007**: API client MUST connect to backend services via Kong Gateway URL
  (K8s ConfigMap `frontend-config` key `KONG_URL`; read via `process.env.KONG_URL`).
- **FR-008**: Authentication MUST use Better Auth framework; `/login` page
  handles student and teacher login; JWT issued by Better Auth and passed to Kong.
- **FR-009**: Protected routes (`/dashboard`, `/editor`, `/quiz`, `/teacher`)
  MUST redirect unauthenticated users to `/login`.

## Clarifications

### Session 2026-02-18

- Q: How should Better Auth be set up? → A: Email/password login using Neon PostgreSQL (existing DATABASE_URL) as the auth store; Better Auth creates `auth_*` tables in the same Neon DB; JWTs issued by Better Auth are forwarded to Kong for validation.

**FR-010**: Better Auth MUST use `DATABASE_URL` from K8s Secret (sourced from `.env`)
as its database adapter; no separate auth database required.

### Key Entities

- **Student Dashboard**: Progress overview per module.
- **Code Editor**: Monaco editor with Python highlighting and run button.
- **Chat Interface**: Real-time chat with tutor agents.

## Success Criteria

- **SC-001**: Single prompt deploys Next.js to K8s with Monaco editor.
- **SC-002**: Pod Running; page accessible via minikube service URL.
- **SC-003**: Monaco editor renders Python code with syntax highlighting.
- **SC-004**: Build and deploy completes in < 5 minutes.
- **SC-005**: Works on both Claude Code and Goose.
- **SC-006**: Better Auth login flow works; JWT stored in session; protected
  routes return 401 without valid token.
- **SC-007**: Teacher role sees `/teacher` dashboard; student role cannot access it.
