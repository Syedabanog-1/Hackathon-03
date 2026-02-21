---
sidebar_label: fastapi-dapr-agent
---

# fastapi-dapr-agent

**Phase 3 | Backend Services | ≤150 tokens**

Scaffold, build, and deploy FastAPI microservices with Dapr sidecars on Kubernetes.

## Usage

```bash
claude "Create triage service using fastapi-dapr-agent skill"
claude "Deploy all LearnFlow services using fastapi-dapr-agent skill"
```

## Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `scaffold.py <name> <topics>` | Generate service boilerplate | `✓ Service scaffolded: <name>` |
| `build.sh <name>` | Docker build + minikube load | `✓ Image built: <name>:latest` |
| `deploy.sh <name>` | kubectl apply k8s/ + dapr/ | `✓ Service deployed: <name>` |
| `verify.sh <name>` | Check pod Running + /health | `✓ <name> healthy` |

## Services Deployed

| Service | Kafka Topic | Purpose |
|---------|-------------|---------|
| triage-service | student-events | Routes queries to specialists |
| concepts-service | tutor-requests | Explains Python concepts |
| debug-service | tutor-requests | Debugs errors with hints |
| code-review-service | tutor-requests | PEP 8 + quality analysis |
| exercise-service | exercise-requests | Generates + grades exercises |
| progress-service | progress-updates | Tracks mastery scores |
| code-sandbox-service | — | Executes Python safely |

## Success Criteria

- All 7 service pods Running
- Each `/health` endpoint returns `{"status": "healthy"}`
- Dapr sidecar injected in each pod
