---
sidebar_label: agents-md-gen
---

# agents-md-gen

**Phase 1 | Foundation | ≤100 tokens**

Generates an `AGENTS.md` file describing repository structure and conventions for AI coding agents.

## Usage

```bash
# Claude Code
claude "Generate AGENTS.md using agents-md-gen skill"

# Goose
goose "Generate AGENTS.md using agents-md-gen skill"
```

## What It Does

1. Scans repository structure (directories, key files)
2. Detects tech stack from `package.json`, `requirements.txt`, etc.
3. Writes `AGENTS.md` with repo conventions for AI agents

## Output

```
✓ AGENTS.md generated (247 tokens)
```

## Files

- `SKILL.md` — Agent instructions (≤100 tokens)
- `scripts/generate.py` — Scans repo, generates AGENTS.md content

## Success Criteria

- `AGENTS.md` present at repo root
- Contains: Project Overview, Directory Structure, Tech Stack, Development Commands
