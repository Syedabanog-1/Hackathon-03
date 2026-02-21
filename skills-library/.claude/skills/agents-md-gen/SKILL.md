---
name: agents-md-gen
description: Generate AGENTS.md file describing repository structure and conventions for AI agents
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# agents-md-gen

## When to Use
- Repository needs AGENTS.md for AI agent context
- Setting up a new project for Claude Code or Goose
- Updating repo conventions after structural changes

## Instructions

1. Run the generator script:
   ```
   python .claude/skills/agents-md-gen/scripts/generate.py
   ```
2. Confirm output says `✓ AGENTS.md generated`.
3. Review AGENTS.md exists at repo root.

## Validation
- [ ] AGENTS.md exists at repository root
- [ ] File contains: Purpose, Structure, Conventions, Agent Usage sections
- [ ] Output was ≤ 3 lines (no raw dumps)
