---
name: fastapi-dapr-agent
description: Scaffold, build, and deploy a FastAPI + Dapr microservice to Kubernetes
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# fastapi-dapr-agent

## When to Use
- Creating any LearnFlow AI agent service (triage, concepts, debug, etc.)
- Adding a new microservice to the platform
- Re-deploying a service after changes

## Instructions

Provide SERVICE_NAME (e.g., triage, concepts, debug, exercise, progress, code-review).

1. Scaffold the service:
   ```
   python .claude/skills/fastapi-dapr-agent/scripts/scaffold.py --service-name SERVICE_NAME
   ```
2. Build Docker image (inside Minikube):
   ```
   bash .claude/skills/fastapi-dapr-agent/scripts/build.sh SERVICE_NAME
   ```
3. Deploy to Kubernetes:
   ```
   bash .claude/skills/fastapi-dapr-agent/scripts/deploy.sh SERVICE_NAME
   ```
4. Verify pod running with Dapr sidecar:
   ```
   bash .claude/skills/fastapi-dapr-agent/scripts/verify.sh SERVICE_NAME
   ```

## Validation
- [ ] "✓ Scaffolded SERVICE_NAME (6 files)" in output
- [ ] "✓ Image SERVICE_NAME:latest built" in output
- [ ] "✓ SERVICE_NAME deployed" in output
- [ ] "✓ SERVICE_NAME: 2/2 containers ready" in verify output
