---
sidebar_position: 1
---

# Skills Overview

All LearnFlow components are built using **Skills** — the emerging industry standard for teaching AI agents capabilities.

## The MCP Code Execution Pattern

```
Traditional:  MCP tool call → 50,000 tokens in context
This library: Script wraps MCP → 10 tokens in context

Reduction: 80-98%
```

## Skill Structure

```
.claude/skills/<skill-name>/
├── SKILL.md          ← Agent loads this (~100 tokens)
├── REFERENCE.md      ← Loaded on-demand (0 tokens normally)
└── scripts/
    ├── deploy.sh     ← Executes (0 tokens — never loaded)
    └── verify.py     ← Executes (0 tokens — never loaded)
```

## Available Skills

| Skill | Phase | Token Budget | Purpose |
|-------|-------|--------------|---------|
| `agents-md-gen` | 1 | ≤100 | Generate AGENTS.md |
| `k8s-foundation` | 1 | ≤150 | Cluster health, namespaces, manifests, Kong |
| `kafka-k8s-setup` | 2 | ≤120 | Deploy Kafka + create topics |
| `postgres-k8s-setup` | 2 | ≤120 | Deploy PostgreSQL + migrations |
| `fastapi-dapr-agent` | 3 | ≤150 | Scaffold FastAPI+Dapr microservices |
| `nextjs-k8s-deploy` | 4 | ≤150 | Deploy Next.js frontend |
| `mcp-code-execution` | 5 | ≤100 | Wrap MCP calls in scripts |
| `docusaurus-deploy` | 6 | ≤120 | Build + deploy docs site |

## Cross-Agent Compatibility

All skills work on **Claude Code**, **Goose**, and **OpenAI Codex** from the same `.claude/skills/` directory:

```bash
# Claude Code
claude "Deploy Kafka using kafka-k8s-setup skill"

# Goose
goose "Deploy Kafka using kafka-k8s-setup skill"
```
