# Feature Specification: Phase 03 — Backend Services Skill

**Feature Branch**: `phase-03-backend`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Scaffold FastAPI + Dapr microservice (Priority: P1)

Agent receives: "Create triage service using fastapi-dapr-agent skill."
It scaffolds a FastAPI app, adds Dapr sidecar config, Dockerfile, and K8s
manifest — all without any manual coding.

**Why this priority**: The Triage Agent is the entry point for all student
queries and routes to specialist agents. All agent services follow this pattern.

**Independent Test**: After single prompt, `kubectl get pods` shows triage
service Running; `curl /health` returns 200.

**Acceptance Scenarios**:

1. **Given** skill prompt with service name "triage", **When** agent runs
   fastapi-dapr-agent skill, **Then** directory `services/triage-service/`
   is created with FastAPI app, Dockerfile, and K8s deployment manifest.
2. **Given** service scaffolded, **When** agent deploys to K8s, **Then**
   pod is Running with Dapr sidecar injected.
3. **Given** Kafka running, **When** triage service starts, **Then** it
   subscribes to `student-events` topic via Dapr pub/sub.

---

### User Story 2 — Deploy all 7 LearnFlow services (Priority: P2)

Using the same fastapi-dapr-agent skill, agent creates all 7 services:
Triage, Concepts, Code Review, Debug, Exercise, Progress, and Code Sandbox.

**Acceptance Scenarios**:

1. **Given** skill supports `--service-name` parameter, **When** agent runs
   skill 7 times, **Then** 7 independent service directories are created.
2. **Given** all services deployed, **When** Triage publishes to Kafka,
   **Then** correct specialist service receives routed message.

---

### Edge Cases

- Service name collision → script must detect existing directory and skip.
- Dapr not initialized → script must check `dapr init` and report.
- Docker build failure → script must surface build logs, not swallow errors.

## Requirements

### Functional Requirements

- **FR-001**: fastapi-dapr-agent skill MUST scaffold: `main.py`, `Dockerfile`,
  `k8s/deployment.yaml`, `dapr/subscription.yaml`.
- **FR-002**: Scaffold MUST include Dapr annotations in K8s deployment.
- **FR-003**: Each service MUST expose `/health` endpoint returning `{"status":"ok"}`.
- **FR-004**: Services MUST subscribe to Kafka topics via Dapr pub/sub component.
- **FR-005**: Skill MUST accept service name as parameter.
- **FR-006**: Docker image MUST be built and pushed to Minikube's registry.
- **FR-007**: Skill MUST deploy and verify pod reaches Running state.

### Key Entities

- **Agent Service**: FastAPI app + Dapr sidecar + Kafka subscription.
- **Triage Agent**: Routes `student-events` to specialist by intent.
- **Specialist Agent**: Concepts, CodeReview, Debug, Exercise, Progress.

## Success Criteria

- **SC-001**: Single prompt scaffolds complete service in < 30 seconds.
- **SC-002**: Service pod Running with 2/2 containers (app + dapr sidecar).
- **SC-003**: All 7 services deployable from 7 prompts using same skill (6 AI agents + code-sandbox).
- **SC-004**: Triage correctly routes test event to Concepts agent.
- **SC-005**: Works on both Claude Code and Goose.
