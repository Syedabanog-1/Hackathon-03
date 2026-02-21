#!/usr/bin/env bash
# k8s-foundation: check_cluster.sh
# MCP Code Execution Pattern: parses kubectl output, returns minimal result.
set -euo pipefail

if ! command -v kubectl &>/dev/null; then
  echo "✗ kubectl not found. Install kubectl and configure kubeconfig."
  exit 1
fi

# Check cluster-info (suppress full URL output)
if ! kubectl cluster-info &>/dev/null; then
  echo "✗ Cluster unreachable. Run: minikube start --cpus=4 --memory=8192"
  exit 1
fi

# Count ready nodes
READY_NODES=$(kubectl get nodes --no-headers 2>/dev/null | grep -c " Ready" || echo "0")
TOTAL_NODES=$(kubectl get nodes --no-headers 2>/dev/null | wc -l | tr -d ' ')

if [ "$READY_NODES" -gt 0 ]; then
  echo "✓ Cluster healthy"
  echo "✓ Nodes: ${READY_NODES}/${TOTAL_NODES} Ready"
else
  echo "✗ No nodes Ready. Check: kubectl get nodes"
  exit 1
fi
