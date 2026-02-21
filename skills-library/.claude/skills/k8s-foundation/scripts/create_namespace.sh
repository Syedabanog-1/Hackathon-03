#!/usr/bin/env bash
# k8s-foundation: create_namespace.sh
# Usage: ./create_namespace.sh <namespace>
# Idempotent: creates namespace if it doesn't exist.
set -euo pipefail

NAMESPACE="${1:-}"
if [ -z "$NAMESPACE" ]; then
  echo "✗ Usage: create_namespace.sh <namespace>"
  exit 1
fi

# --dry-run=client + apply is idempotent
kubectl create namespace "$NAMESPACE" \
  --dry-run=client -o yaml 2>/dev/null | kubectl apply -f - &>/dev/null

echo "✓ Namespace ${NAMESPACE} ready"
