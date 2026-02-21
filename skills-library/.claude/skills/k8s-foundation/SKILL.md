---
name: k8s-foundation
description: K8s cluster health, namespaces, manifest apply, Kong deploy
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# k8s-foundation

## When to Use
- Before any infrastructure deployment
- Applying K8s manifests (wraps kubectl apply)
- Deploying Kong API Gateway
- Creating namespaces

## Instructions

1. Check cluster: `bash scripts/check_cluster.sh`
2. Create namespaces: `bash scripts/create_namespace.sh <name>`
3. Apply manifests: `bash scripts/apply_manifests.sh <path>`
4. Deploy Kong: `bash scripts/kong_deploy.sh [routes.yaml]`

Confirm all output lines show ✓.

## Validation
- [ ] "✓ Cluster healthy" in output
- [ ] Namespaces show "✓ Namespace X ready"
- [ ] Manifests show "✓ Manifests applied"
- [ ] Kong shows "✓ Kong deployed"
