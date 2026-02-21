# Feature Specification: Phase 01 — Foundation Skills

**Feature Branch**: `phase-01-foundation`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Generate AGENTS.md for any repository (Priority: P1)

A developer runs a single prompt asking an AI agent to generate `AGENTS.md`
for their repository. The agent loads the `agents-md-gen` skill, executes
`scripts/generate.py`, and produces a valid AGENTS.md without any manual steps.

**Why this priority**: AGENTS.md is required so all downstream AI agents
understand the repo structure and conventions. It unblocks every other skill.

**Independent Test**: Run `claude "Generate AGENTS.md for this repository"` in
`skills-library/`. Verify AGENTS.md is created and non-empty.

**Acceptance Scenarios**:

1. **Given** the `agents-md-gen` skill is in `.claude/skills/`, **When** agent
   receives prompt "Generate AGENTS.md", **Then** `AGENTS.md` is created with
   repo structure and conventions documented.
2. **Given** AGENTS.md exists, **When** skill runs again, **Then** it overwrites
   with updated content (idempotent).

---

### User Story 2 — Verify Kubernetes cluster health (Priority: P2)

A developer prompts the agent to check cluster health before any deployment.
The `k8s-foundation` skill executes `scripts/check_cluster.sh` and returns a
minimal status summary.

**Why this priority**: All infrastructure skills depend on a healthy cluster.
This is the prerequisite gate for Phases 2–7.

**Independent Test**: Run prompt "Check Kubernetes cluster health". Agent must
report node status and namespace list in ≤ 20 tokens of output.

**Acceptance Scenarios**:

1. **Given** Minikube is running, **When** agent runs k8s-foundation skill,
   **Then** output shows "✓ Cluster healthy", "✓ N nodes Ready".
2. **Given** cluster is down, **When** skill runs, **Then** output shows
   "✗ Cluster unreachable" and exits non-zero.

---

### Edge Cases

- What if Docker is not running? Script must output actionable error message.
- What if `kubectl` is not in PATH? Script must detect and report.

## Requirements

### Functional Requirements

- **FR-001**: `agents-md-gen` MUST scan repo directory tree and write AGENTS.md.
- **FR-002**: AGENTS.md MUST include: repo purpose, directory structure,
  conventions, and agent usage instructions.
- **FR-003**: `k8s-foundation` MUST check `kubectl cluster-info` and report.
- **FR-004**: Both skills MUST work on Claude Code AND Goose (cross-agent).
- **FR-005**: SKILL.md for each skill MUST be ≤ 150 tokens.
- **FR-006**: Scripts MUST return minimal output (≤ 30 tokens for success).

### Key Entities

- **Skill**: SKILL.md + scripts/ directory pair in `.claude/skills/<name>/`.
- **AGENTS.md**: Repository convention file consumed by AI agents.

## Clarifications

### Session 2026-02-18

- Q: What is the execution environment for scripts on Windows? → A: WSL2 Ubuntu is installed and ready; all skill scripts execute in WSL bash environment.
- Q: What is the Docker/Minikube status? → A: Docker Desktop installed and running; Minikube not yet started — `minikube start --cpus=4 --memory=8192 --driver=docker` must be run in WSL before K8s skills execute.
- Q: What is the implementation build order? → A: Phase by phase in order (01→07→08); skills built first, then learnflow-app consumes them.

**FR-007**: All scripts MUST be written as bash (WSL2/Ubuntu) scripts; Windows
paths are accessed via `/mnt/d/...` prefix inside WSL.

## Success Criteria

### Measurable Outcomes

- **SC-001**: agents-md-gen produces valid AGENTS.md from single prompt.
- **SC-002**: k8s-foundation checks cluster in < 5 seconds and returns ≤ 3 lines.
- **SC-003**: Both skills produce identical results on Claude Code and Goose.
- **SC-004**: SKILL.md token count verified ≤ 150 tokens each.
