# Feature Specification: Phase 08 — Polish & Demo Readiness

**Feature Branch**: `phase-08-polish`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Full demo scenario runs end-to-end in < 5 min (Priority: P1)

A judge wipes the cluster and re-deploys the entire LearnFlow platform using
only skill-driven prompts. The demo scenario from Part 8 of the hackathon doc
runs completely without manual intervention.

**Acceptance Scenarios**:

1. **Given** fresh Minikube cluster, **When** all skill prompts are run in order,
   **Then** full platform is running in < 5 minutes.
2. **Given** Maya demo scenario, **When** run end-to-end, **Then** all 9 steps
   complete: login → chat → code → quiz → mastery → struggle → teacher → exercises → restore.

---

### User Story 2 — Documentation site is live and comprehensive (Priority: P2)

Docusaurus site is deployed, all 7 skill pages accessible, architecture diagram
present, and skill-development-guide included.

**Acceptance Scenarios**:

1. **Given** docs URL, **When** judge opens it, **Then** sees 7 skill pages +
   architecture overview + skill development guide.

---

## Requirements

### Functional Requirements

- **FR-001**: skills-library README.md MUST describe all 8 skills with usage examples.
- **FR-002**: learnflow-app README.md MUST include: demo steps, architecture diagram,
  and submission checklist.
- **FR-003**: All skills MUST pass the Autonomy Gate: single prompt → deployed.
- **FR-004**: All skills MUST pass the Token Gate: MCP pattern ≥ 80% reduction.
- **FR-005**: Submission form MUST be completed at forms.gle/Mrhf9XZsuXN4rWJf7.
- **FR-006**: Commit history in learnflow-app MUST follow agent commit convention.
- **FR-007**: AGENTS.md MUST be present in both repositories.

## Success Criteria

- **SC-001**: Judge can re-deploy from scratch using only skill prompts.
- **SC-002**: Demo scenario completes in < 5 min from clean cluster.
- **SC-003**: Docusaurus site accessible with all 7 skill pages.
- **SC-004**: Submission form submitted before deadline.
- **SC-005**: All quality gates (Skill, Autonomy, Token, K8s, Arch, SDD) green.
