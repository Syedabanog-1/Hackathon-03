---
sidebar_label: docusaurus-deploy
---

# docusaurus-deploy

**Phase 6 | Documentation | ≤120 tokens**

Scaffold Docusaurus v3 documentation site, build Docker image, and deploy to Kubernetes.

## Usage

```bash
claude "Deploy documentation using docusaurus-deploy skill"
```

## Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `scaffold.sh` | Create Docusaurus site with skill docs | `✓ Docusaurus scaffolded (7 skill pages + architecture)` |
| `build.sh` | Docker build + minikube image load | `✓ Docs image built` |
| `deploy.sh` | kubectl apply k8s/docs-deployment.yaml | `✓ Docs deployed at http://...:30090` |

## Access

- Documentation: `http://$(minikube ip):30090`
- Default port: NodePort 30090

## Success Criteria

- Docs pod Running in `learnflow` namespace
- All 8 skill pages accessible
- Architecture diagram visible
