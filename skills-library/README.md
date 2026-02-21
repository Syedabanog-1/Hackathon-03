# Skills Library — Hackathon III

> **The Skills are the product.**
> Reusable intelligence that teaches AI agents to build cloud-native applications.

## What is this?

A library of **SKILL.md + scripts** pairs that work on:
- **Claude Code** (`claude "prompt using skill-name skill"`)
- **Goose** (`goose "prompt using skill-name skill"`)
- **OpenAI Codex** (same format, no modification needed)

## Skills

| Skill | Phase | Purpose | Tokens |
|-------|-------|---------|--------|
| `agents-md-gen` | 1 | Generate AGENTS.md | ≤100 |
| `k8s-foundation` | 1 | Cluster health, namespaces, manifest apply, Kong | ≤150 |
| `kafka-k8s-setup` | 2 | Deploy Kafka via Helm + topics | ≤120 |
| `postgres-k8s-setup` | 2 | Deploy PostgreSQL + migrations | ≤120 |
| `fastapi-dapr-agent` | 3 | Scaffold FastAPI+Dapr services | ≤150 |
| `nextjs-k8s-deploy` | 4 | Scaffold + deploy Next.js app | ≤150 |
| `mcp-code-execution` | 5 | MCP token efficiency pattern | ≤100 |
| `docusaurus-deploy` | 6 | Build + deploy docs site | ≤120 |

## Usage Pattern

```bash
# With Claude Code
claude "Deploy Kafka using kafka-k8s-setup skill"

# With Goose
goose "Deploy Kafka using kafka-k8s-setup skill"
```

Both commands produce identical results. This is the gold standard.

## MCP Code Execution Philosophy

```
Traditional:  MCP tool call → 50,000 tokens in context
This library: Script wraps MCP → 10 tokens in context

Reduction: 80-98%
```

## Directory Structure

```
skills-library/
├── README.md
└── .claude/
    └── skills/
        ├── agents-md-gen/
        │   ├── SKILL.md          ← agent loads this (~100 tokens)
        │   └── scripts/
        │       └── generate.py   ← does all work (0 tokens)
        ├── k8s-foundation/
        ├── kafka-k8s-setup/
        ├── postgres-k8s-setup/
        ├── fastapi-dapr-agent/
        ├── nextjs-k8s-deploy/
        ├── mcp-code-execution/
        └── docusaurus-deploy/
```

## Prerequisites

- Minikube: `minikube start --cpus=4 --memory=8192 --driver=docker`
- kubectl, Helm 3+, Docker
- Claude Code or Goose
- Python 3.12+

## Evaluation

Judges test by:
1. Wiping the Minikube cluster
2. Running a single prompt per component
3. Verifying everything deploys autonomously

**Gold standard**: Zero manual intervention, end-to-end.
