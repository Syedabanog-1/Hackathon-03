#!/usr/bin/env bash
# fastapi-dapr-agent: verify.sh
# Check pod Running with 2/2 containers (app + dapr sidecar).
# Usage: ./verify.sh <service-name>
set -euo pipefail

SERVICE_NAME="${1:-}"
NAMESPACE="learnflow"

if [ -z "$SERVICE_NAME" ]; then
  echo "✗ Usage: verify.sh <service-name>"
  exit 1
fi

# Get container count for running pod (expected: 2 = app + dapr-proxy)
READY=$(kubectl get pods -n "$NAMESPACE" -l "app=${SERVICE_NAME}" \
  --no-headers -o custom-columns=":status.containerStatuses[*].ready" 2>/dev/null \
  | tr ',' '\n' | grep -c "true" || echo "0")

if [ "$READY" -ge 2 ]; then
  echo "✓ ${SERVICE_NAME}: 2/2 containers ready"
else
  echo "✗ ${SERVICE_NAME}: ${READY}/2 containers ready — check: kubectl describe pod -n ${NAMESPACE} -l app=${SERVICE_NAME}"
  exit 1
fi
