---
sidebar_position: 2
---

# Phase-by-Phase Build

Each phase has its own specification, plan, and tasks in `specs/`.

## Phase 1: Foundation
**Goal**: Cluster ready, AGENTS.md generated, namespaces created

```bash
claude "Generate AGENTS.md using agents-md-gen skill"
claude "Check cluster health using k8s-foundation skill"
```

Success: `kubectl cluster-info` returns cluster info

## Phase 2: Infrastructure
**Goal**: Kafka + PostgreSQL deployed

```bash
claude "Deploy Kafka using kafka-k8s-setup skill"
claude "Deploy PostgreSQL using postgres-k8s-setup skill"
```

Success: All Kafka pods Running, 6 topics created, PostgreSQL ready

## Phase 3: Backend Services
**Goal**: 7 FastAPI microservices with Dapr

```bash
claude "Deploy all LearnFlow services using fastapi-dapr-agent skill"
```

Success: All 7 service `/health` endpoints return 200

## Phase 4: Frontend
**Goal**: Next.js frontend with Monaco editor

```bash
claude "Deploy Next.js frontend using nextjs-k8s-deploy skill"
```

Success: Frontend accessible at `:30080`, login works

## Phase 5: Integration
**Goal**: MCP servers connected, real Qdrant data

```bash
python skills-library/.claude/skills/mcp-code-execution/scripts/filter_demo.py
```

Success: Token reduction demo shows ≥80% reduction

## Phase 6: Documentation
**Goal**: Docusaurus site deployed

```bash
claude "Deploy documentation using docusaurus-deploy skill"
```

Success: Docs accessible at `:30090`

## Phase 7: Full LearnFlow Build
**Goal**: Complete demo scenario works end-to-end

Success: Student can chat with tutor, run code, take quiz, teacher sees alerts
