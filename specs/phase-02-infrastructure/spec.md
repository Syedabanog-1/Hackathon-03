# Feature Specification: Phase 02 — Infrastructure Skills

**Feature Branch**: `phase-02-infrastructure`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Deploy Apache Kafka on Kubernetes (Priority: P1)

A developer prompts the agent: "Deploy Kafka on my cluster using
kafka-k8s-setup skill." The agent executes the deploy script (Helm),
then the verify script, and returns "✓ Kafka deployed, 3/3 pods running."

**Why this priority**: Kafka is the event backbone for all LearnFlow
microservices. Nothing else can be wired up until Kafka is running.

**Independent Test**: After single prompt, run `kubectl get pods -n kafka`.
All pods must be in Running state.

**Acceptance Scenarios**:

1. **Given** Minikube running with 4 CPUs / 8 GB RAM, **When** agent runs
   kafka-k8s-setup skill, **Then** all Kafka pods are Running (KRaft mode — no separate Zookeeper).
2. **Given** Kafka is running, **When** verify script runs, **Then** output
   is "✓ All 3 pods running" (not full pod JSON).
3. **Given** topic creation requested, **When** deploy script runs,
   **Then** all 6 topics are created: `student-events`, `tutor-requests`,
   `tutor-responses`, `progress-updates`, `struggle-alerts`, `exercise-requests`.

---

### User Story 2 — Deploy PostgreSQL on Kubernetes (Priority: P2)

Agent deploys PostgreSQL via Helm, runs schema migrations, and confirms
database connectivity.

**Why this priority**: User data, progress tracking, and code submissions
require a persistent relational store before any backend service can start.

**Independent Test**: After single prompt, run `kubectl get pods -n postgres`.
Database pod Running; connection test returns "✓ Database reachable."

**Acceptance Scenarios**:

1. **Given** Minikube running, **When** agent runs postgres-k8s-setup skill,
   **Then** PostgreSQL pod is Running and PVC is bound.
2. **Given** deployment done, **When** migration script runs, **Then** output
   is "✓ Migrations applied: 3 tables created."

---

### Edge Cases

- Insufficient Minikube memory → deploy script must output actionable message.
- Helm repo not added → script must add bitnami repo automatically.
- PVC stuck Pending → verify script must detect and report storage class issue.

## Requirements

### Functional Requirements

- **FR-001**: kafka-k8s-setup MUST deploy Kafka via `helm install bitnami/kafka`.
- **FR-002**: kafka-k8s-setup MUST create 6 topics: `student-events`,
  `tutor-requests`, `tutor-responses`, `progress-updates`,
  `struggle-alerts`, `exercise-requests`.
- **FR-003**: kafka-k8s-setup MUST verify all Kafka pods reach Running state.
- **FR-004**: postgres-k8s-setup MUST deploy PostgreSQL via Helm.
- **FR-005**: postgres-k8s-setup MUST run SQL migrations for LearnFlow schema.
- **FR-006**: postgres-k8s-setup MUST confirm database TCP connectivity.
- **FR-007**: Both skills MUST output only minimal status (no JSON dumps).
- **FR-008**: Both skills MUST be idempotent (re-run safe).

### Key Entities

- **Kafka Topic**: Named event stream; producers publish, consumers subscribe.
- **PostgreSQL Schema**: Tables for users, progress, submissions, exercises.

## Success Criteria

- **SC-001**: Kafka deploys and all pods Running within 5 minutes via skill.
- **SC-002**: Kafka verify returns ≤ 2 lines of output.
- **SC-003**: PostgreSQL deploys and migrations apply via single prompt.
- **SC-004**: Both skills are idempotent (second run is a no-op or safe update).
- **SC-005**: Cross-agent: identical deployment outcome on Claude Code & Goose.
