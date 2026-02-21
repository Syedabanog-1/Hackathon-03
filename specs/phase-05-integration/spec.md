# Feature Specification: Phase 05 — MCP Code Execution Skill

**Feature Branch**: `phase-05-integration`
**Created**: 2026-02-18
**Status**: Draft

## User Scenarios & Testing

### User Story 1 — Demonstrate token-efficient MCP data processing (Priority: P1)

Agent uses `mcp-code-execution` skill to call an MCP data source, filter
results inside a script, and return only the minimal summary to context.

**Why this priority**: This is the core technical differentiator of the
hackathon. Judges specifically evaluate token efficiency.

**Independent Test**: Measure context tokens before and after skill execution.
Verify ≥ 80% reduction vs. direct MCP call.

**Acceptance Scenarios**:

1. **Given** a data source with 1000 records, **When** agent runs
   mcp-code-execution skill, **Then** only 5 filtered records appear in context.
2. **Given** Kafka running, **When** MCP script polls pending student events,
   **Then** only summary ("5 pending events") returns to context.

---

### User Story 2 — Kong API Gateway routes traffic (Priority: P2)

Kong routes `/api/v1/*` to the correct microservice; JWT auth enforced.

**Acceptance Scenarios**:

1. **Given** Kong deployed, **When** request hits `/api/v1/tutor`, **Then**
   Kong routes to triage service and student JWT is validated.

---

### Edge Cases

- MCP server not running → script must detect and fail fast with clear message.
- Data source returns empty set → script must handle gracefully.

## Requirements

### Functional Requirements

- **FR-001**: mcp-code-execution MUST demonstrate filtering in script (not agent)
  using **real Qdrant REST API** (URL + API key from K8s Secret, sourced from `.env`).
- **FR-002**: Script MUST return ≤ 30 tokens of output for any data source.
- **FR-003**: Skill MUST include a token comparison report (before vs. after) as
  a table in REFERENCE.md: Direct call tokens | Script pattern tokens | Reduction %.
- **FR-004**: Kong API Gateway MUST be deployed via Helm and configured.
- **FR-005**: JWT plugin MUST be active on all `/api/v1/*` routes.
- **FR-006**: MCP client MUST wrap all data fetches (no raw tool calls).
- **FR-007**: Qdrant collection `student_knowledge` MUST be created; `filter_demo.py`
  queries it with a filter (e.g., mastery_score < 0.4), returns only count summary.

### Key Entities

- **MCP Script**: Python script that calls MCP server as API, filters data.
- **Kong Route**: Maps URL pattern to upstream K8s service.
- **JWT Consumer**: Student/teacher identity verified at gateway.

## Clarifications

### Session 2026-02-18

- Q: Which real MCP server data source to use? → A: Qdrant vector DB (already provisioned via .env); `filter_demo.py` calls Qdrant REST API, filters student knowledge vectors with mastery_score < 0.4, returns only count summary to agent context.

## Success Criteria

- **SC-001**: Skill demonstrates ≥ 80% token reduction with documented proof.
- **SC-002**: Kong routes all service traffic correctly.
- **SC-003**: JWT validation rejects unauthenticated requests with 401.
- **SC-004**: MCP pattern reusable for any data source by swapping script.
- **SC-005**: Works on both Claude Code and Goose (cross-agent).
