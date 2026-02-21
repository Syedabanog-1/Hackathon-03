# Implementation Plan: Phase 01 — Foundation Skills

**Branch**: `phase-01-foundation` | **Date**: 2026-02-18 | **Spec**: specs/phase-01-foundation/spec.md

## Summary

Build two foundation skills (`agents-md-gen`, `k8s-foundation`) that establish
the SKILL.md + scripts/ pattern, generate AGENTS.md for any repository, and
verify Kubernetes cluster health — enabling all subsequent phases.

## Technical Context

**Language/Version**: Python 3.12, Bash 5+
**Primary Dependencies**: kubectl, Minikube, Python stdlib (os, pathlib, subprocess)
**Storage**: N/A (file generation only)
**Testing**: Manual skill invocation on Claude Code and Goose
**Target Platform**: Linux (WSL on Windows), macOS
**Performance Goals**: SKILL.md ≤ 150 tokens; script output ≤ 30 tokens
**Constraints**: No external Python packages; pure stdlib only
**Scale/Scope**: 2 skills, 4 scripts total

## Constitution Check

- [x] **Principle I** (Skills-First): SKILL.md ≤ 150 tokens; scripts do all work.
- [x] **Principle II** (MCP): No MCP calls in this phase; N/A.
- [x] **Principle III** (Cross-Agent): Skills work on Claude Code + Goose.
- [x] **Principle IV** (Cloud-Native): k8s-foundation uses kubectl, not raw API.
- [x] **Principle V** (SDD): spec.md approved before this plan.
- [x] **Principle VI** (Autonomy): Single prompt per skill.
- [x] **Principle VII** (Separation): Skills in skills-library only.

## Project Structure

### Documentation

```text
specs/phase-01-foundation/
├── spec.md
├── plan.md              (this file)
└── tasks.md
```

### Source Code

```text
skills-library/
├── README.md
└── .claude/
    └── skills/
        ├── agents-md-gen/
        │   ├── SKILL.md
        │   └── scripts/
        │       └── generate.py
        └── k8s-foundation/
            ├── SKILL.md
            └── scripts/
                ├── check_cluster.sh
                └── create_namespace.sh
```

## Architecture Decisions

### agents-md-gen Design

`generate.py` walks the repo directory tree, extracts folder names and README
snippets, and writes AGENTS.md. It does NOT use any LLM call — purely
deterministic script. Output: `✓ AGENTS.md generated (X sections)`.

### k8s-foundation Design

`check_cluster.sh` runs `kubectl cluster-info` and `kubectl get nodes`,
parses exit codes, and prints a 3-line summary. `create_namespace.sh`
accepts namespace name as argument and creates it if not exists.

## Complexity Tracking

No constitution violations.
