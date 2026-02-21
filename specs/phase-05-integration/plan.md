# Implementation Plan: Phase 05 — MCP Code Execution Skill

**Branch**: `phase-05-integration` | **Date**: 2026-02-18 | **Spec**: specs/phase-05-integration/spec.md

## Summary

Build `mcp-code-execution` skill demonstrating the Anthropic MCP Code Execution
pattern — wrapping MCP calls in Python scripts that filter data client-side
and return only minimal results, achieving ≥ 80% token reduction.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**: mcp (Python SDK), subprocess, json
**Storage**: N/A
**Testing**: Token count before vs. after; Kong routing test
**Target Platform**: Any (skill runs locally; deploys Kong to K8s)
**Performance Goals**: ≥ 80% token reduction; Kong proxy < 50ms overhead
**Constraints**: MCP server must be reachable; Kong Helm chart compatible
**Scale/Scope**: 1 skill, 3 scripts; Kong Helm deployment

## Constitution Check

- [x] **Principle I**: SKILL.md ≤ 150 tokens; scripts handle all MCP calls.
- [x] **Principle II** (CORE): Scripts filter before returning to context. Token budget documented.
- [x] **Principle III**: Cross-agent.
- [x] **Principle IV**: Kong deployed via Helm on K8s.
- [x] **Principle V**: Spec approved.
- [x] **Principle VI**: Single prompt demonstrates pattern + deploys Kong.
- [x] **Principle VII**: mcp_client.py is generic (swap any MCP server).

## Project Structure

```text
skills-library/.claude/skills/
└── mcp-code-execution/
    ├── SKILL.md
    ├── REFERENCE.md
    └── scripts/
        ├── mcp_client.py    # Generic MCP server wrapper
        ├── filter_demo.py   # Demo: fetches 1000 rows, returns 5
        └── kong_deploy.sh   # Deploy Kong via Helm + configure routes

learnflow-app/infra/
└── kong/
    ├── values.yaml          # Kong Helm values
    └── routes.yaml          # Kong route configurations
```

## MCP Code Execution Pattern Implementation

```
Before (direct):
  TOOL CALL: source.getData() → 10,000 rows → context (50k tokens)

After (skill + script):
  Script: allRows = mcp.getData(); filtered = [r for r in allRows if ...]
  Agent sees: "✓ 5 matching records returned" (10 tokens)
```

`filter_demo.py` documents token count before/after in its output.

## Kong Configuration

Routes:
- `/api/v1/tutor` → triage-service
- `/api/v1/execute` → code-sandbox-service
- `/api/v1/progress` → progress-service
- `/api/v1/exercises` → exercise-service

Plugins: JWT (all routes), rate-limiting (execute: 10/min per student).

## Complexity Tracking

No constitution violations.
