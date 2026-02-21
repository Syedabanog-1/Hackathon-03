---
sidebar_position: 1
---

# LearnFlow — Skills-First AI Tutoring

LearnFlow is an **AI-powered Python tutoring platform** built entirely by AI agents (Claude Code + Goose) using reusable skills. No application code was written manually.

## The Skills-First Approach

Every component of LearnFlow was created using the **MCP Code Execution Pattern**:

```
Single Prompt → Agent loads SKILL.md (~100 tokens)
              → Script executes (0 tokens in context)
              → Minimal result returned (~15 tokens)
              → Task complete
```

**Token reduction: 80–98%** compared to direct MCP tool calls.

## Quick Start

```bash
# 1. Start Minikube
minikube start --cpus=4 --memory=8192 --driver=docker

# 2. Create secrets from .env
source .env && bash learnflow-app/infra/secrets/create-secrets.sh

# 3. Deploy infrastructure
claude "Deploy Kafka using kafka-k8s-setup skill"
claude "Deploy PostgreSQL using postgres-k8s-setup skill"

# 4. Deploy services
claude "Deploy all LearnFlow services using fastapi-dapr-agent skill"

# 5. Deploy frontend
claude "Deploy Next.js frontend using nextjs-k8s-deploy skill"

# 6. Deploy API gateway
claude "Deploy Kong using k8s-foundation skill"

# 7. Deploy docs
claude "Deploy documentation using docusaurus-deploy skill"
```

## Access the App

| Service | URL |
|---------|-----|
| Frontend | http://$(minikube ip):30080 |
| Docs | http://$(minikube ip):30090 |

## What You Can Do

- **Students**: Chat with Python tutor, write & run code, take quizzes, view progress
- **Teachers**: Monitor class progress, receive struggle alerts, generate exercises
