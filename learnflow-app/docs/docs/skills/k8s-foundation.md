---
sidebar_label: k8s-foundation
---

# k8s-foundation

**Phase 1 | Foundation | ≤150 tokens**

Kubernetes cluster health, namespace creation, manifest application, and Kong API Gateway deployment.

## Usage

```bash
claude "Check Kubernetes cluster health using k8s-foundation skill"
claude "Deploy Kong API gateway using k8s-foundation skill"
claude "Apply manifests using k8s-foundation skill"
```

## Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `check_cluster.sh` | Verify cluster is healthy | `✓ Cluster healthy: N nodes` |
| `create_namespace.sh <ns>` | Create K8s namespace | `✓ Namespace created: <ns>` |
| `apply_manifests.sh <path>` | Apply K8s manifests | `✓ Manifests applied: <path>` |
| `kong_deploy.sh` | Install Kong via Helm | `✓ Kong deployed on port 30000` |

## Success Criteria

- `kubectl cluster-info` returns cluster info
- `kubectl get nodes` shows Ready nodes
- Kong pod Running in `kong` namespace
