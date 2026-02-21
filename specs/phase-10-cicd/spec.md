# Feature Specification: Phase 10 — Continuous Delivery (Argo CD + GitHub Actions)

**Feature Branch**: `phase-10-cicd`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Merge to main triggers automatic K8s deployment (Priority: P1)

A developer merges a PR to main. GitHub Actions builds Docker images, pushes to
registry, updates Helm values, and Argo CD syncs the changes to the K8s cluster
automatically — zero manual kubectl commands.

**Acceptance Scenarios**:

1. **Given** PR merged to main, **When** GitHub Actions workflow runs,
   **Then** Docker images built, pushed, and Helm chart values updated in ≤ 5 min.
2. **Given** values updated, **When** Argo CD detects drift, **Then** cluster
   synced automatically within 3 minutes.
3. **Given** failed build, **When** GitHub Actions fails, **Then** deployment
   blocked; Slack/notification sent; cluster unchanged.

---

### User Story 2 — Argo CD dashboard shows live deployment status (Priority: P2)

Team member opens Argo CD UI and sees all LearnFlow services, their sync status,
health, and recent deployments.

**Acceptance Scenarios**:

1. **Given** Argo CD deployed, **When** UI accessed, **Then** all services shown
   as Healthy/Synced with live pod status.

---

## Requirements

### Functional Requirements

- **FR-001**: GitHub Actions workflow MUST build and push images on main branch push.
- **FR-002**: Argo CD MUST be deployed to K8s and configured to watch learnflow-app repo.
- **FR-003**: Helm charts MUST be stored in learnflow-app/charts/ for GitOps.
- **FR-004**: Argo CD MUST auto-sync on git push (no manual sync button needed).
- **FR-005**: Rollback MUST be possible via `argocd app rollback` CLI.
- **FR-006**: GitHub Actions MUST run skill-based tests before deployment.

## Success Criteria

- **SC-001**: Git push → deployed in < 10 min end-to-end.
- **SC-002**: Argo CD UI shows all services Healthy.
- **SC-003**: Rollback restores previous version in < 2 min.
- **SC-004**: Pipeline uses skill-wrapped scripts; no raw kubectl in CI YAML.
