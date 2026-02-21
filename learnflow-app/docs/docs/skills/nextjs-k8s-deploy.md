---
sidebar_label: nextjs-k8s-deploy
---

# nextjs-k8s-deploy

**Phase 4 | Frontend | ≤150 tokens**

Scaffold, build, and deploy Next.js 14 application with Monaco editor to Kubernetes.

## Usage

```bash
claude "Deploy Next.js frontend using nextjs-k8s-deploy skill"
```

## Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `scaffold.sh` | Generate Next.js app skeleton | `✓ Next.js scaffolded` |
| `build.sh` | Docker build + minikube image load | `✓ Frontend image built` |
| `deploy.sh` | kubectl apply k8s/ (deployment + service + configmap) | `✓ Frontend deployed` |
| `verify.sh` | Check pod Running + HTTP 200 | `✓ Frontend healthy on :30080` |

## Features

- **Monaco Editor** — VS Code-like Python code editor in browser
- **Better Auth** — Email/password authentication with student/teacher roles
- **Chat Panel** — Real-time tutoring conversations with AI agents
- **Progress Dashboard** — 8-module Python curriculum with mastery bars
- **Quiz System** — Python knowledge assessment with mastery updates
- **Teacher Dashboard** — Struggle alerts and exercise generation

## Access

- Frontend: `http://$(minikube ip):30080`
- Default port: NodePort 30080
