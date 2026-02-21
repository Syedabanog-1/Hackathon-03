#!/usr/bin/env bash
# nextjs-k8s-deploy: verify.sh
# Check pod Running and print accessible URL.
set -euo pipefail

NAMESPACE="learnflow"
POD_READY=$(kubectl get pods -n "$NAMESPACE" -l app=frontend \
  --no-headers -o custom-columns=":status.phase" 2>/dev/null | grep -c "Running" || echo "0")

if [ "$POD_READY" -gt 0 ]; then
  URL=$(minikube service frontend-svc -n "$NAMESPACE" --url 2>/dev/null || echo "http://localhost:30080")
  echo "✓ Frontend accessible at ${URL}"
else
  echo "✗ Frontend pod not Running — check: kubectl get pods -n ${NAMESPACE}"
  exit 1
fi
