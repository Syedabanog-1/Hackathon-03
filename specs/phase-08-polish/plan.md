# Implementation Plan: Phase 08 — Polish & Demo Readiness

**Branch**: `phase-08-polish` | **Date**: 2026-02-18 | **Spec**: specs/phase-08-polish/spec.md

## Summary

Polish all skills and application for submission: verify quality gates, write
READMEs, confirm demo scenario, and submit the hackathon form.

## Technical Context

**Language/Version**: Markdown, Bash (verification scripts)
**Primary Dependencies**: All Phase 01-07 skills complete
**Testing**: Run full demo scenario end-to-end; verify all quality gates
**Target Platform**: Minikube + deployed K8s cluster
**Constraints**: No new features; polish and verify only

## Constitution Check

- [x] **Principle I**: Skills already complete; this phase verifies them.
- [x] **Principle II**: Token gate verification included.
- [x] **Principle III**: Cross-agent test on Claude Code + Goose.
- [x] **Principle IV**: All pods Running; probes verified.
- [x] **Principle V**: Spec approved before polish work.
- [x] **Principle VI**: Full demo runs from single session of prompts.
- [x] **Principle VII**: skills-library and learnflow-app remain separated.

## Quality Gate Checklist

| Gate | Check | Pass Criteria |
|------|-------|---------------|
| Skill Gate | SKILL.md ≤ 150 tokens each | `wc -w SKILL.md` ≤ 150 |
| Autonomy Gate | Single prompt deploys on Claude Code AND Goose | Both agents verified |
| Token Gate | MCP pattern ≥ 80% reduction | Documented in REFERENCE.md |
| K8s Gate | All pods Running; health probes pass | `kubectl get pods -A` all Running |
| Arch Gate | No secrets hardcoded; Dapr patterns correct | Code review |
| SDD Gate | spec → plan → tasks chain complete all 8 phases | File existence check |

## Complexity Tracking

No constitution violations.
