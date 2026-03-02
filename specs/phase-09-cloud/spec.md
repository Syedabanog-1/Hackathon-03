# Feature Specification: Phase 09 — Cloud Deployment

**Feature Branch**: `phase-09-cloud`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Deploy LearnFlow to cloud Kubernetes (Priority: P1)

The same skills used in Minikube deploy LearnFlow to a managed cloud K8s cluster
(Azure AKS, Google GKE, or Oracle OKE). No skill modification required —
only the kubeconfig context changes.

**Acceptance Scenarios**:

1. **Given** cloud K8s cluster provisioned, **When** skill prompts are run
   against cloud context, **Then** all services deploy identically to Minikube.
2. **Given** cloud deployment, **When** public URL accessed, **Then** LearnFlow
   is reachable from the internet with valid HTTPS.

---

### User Story 2 — PostgreSQL uses Neon (cloud-native managed DB) (Priority: P2)

In production, replace Minikube PostgreSQL with Neon serverless PostgreSQL.
Migration script connects to Neon instead of in-cluster pod.

**Acceptance Scenarios**:

1. **Given** NEON_DATABASE_URL env var set, **When** postgres-k8s-setup skill runs
   with cloud mode flag, **Then** migrations run against Neon, not local pod.

---

## Requirements

### Functional Requirements

- **FR-001**: Skills MUST work against cloud K8s context (just kubeconfig swap).
- **FR-002**: Cloud deployment MUST use Neon PostgreSQL (not in-cluster Postgres).
- **FR-003**: All secrets MUST be stored in K8s Secrets (not .env files in cloud).
- **FR-004**: Ingress MUST be configured with TLS (cert-manager or cloud LB).
- **FR-005**: Cloud cluster MUST have ≥ 4 CPU / 8 GB RAM per node.

## Clarifications

### Session 2026-03-02

- Q: What is the actual cloud deployment platform? → A: Vercel (frontend) + Railway (backend API) — not Kubernetes. Architecture pivot from K8s to PaaS for hackathon delivery speed.
- Q: What is the Railway backend URL? → A: https://hackathon-03-production.up.railway.app
- Q: Has setup-db.sql been run in Neon? → A: Yes — migration executed 2026-03-02; all 4 Better Auth tables confirmed present (user, session, account, verification) in neondb.
- **FR-006**: Frontend MUST set `NEXT_PUBLIC_KONG_URL=https://hackathon-03-production.up.railway.app` on Vercel so all API calls (tutor, execute, progress, exercises) route to Railway.
- **FR-007**: Railway backend MUST have `ALLOWED_ORIGINS=https://hackathon-03-mauve.vercel.app` env var set so CORS allows the Vercel frontend.

---

## Success Criteria

- **SC-001**: LearnFlow accessible via public HTTPS URL from cloud cluster.
- **SC-002**: Neon database migration runs via skill prompt.
- **SC-003**: All quality gates pass on cloud cluster (same criteria as Phase 08).
- **SC-004**: Works on Azure AKS, GKE, or Oracle OKE (at least one provider).
