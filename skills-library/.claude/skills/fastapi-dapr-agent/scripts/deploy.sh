#!/usr/bin/env bash
# fastapi-dapr-agent: deploy.sh
# Apply K8s manifests and wait for rollout.
# Usage: ./deploy.sh <service-name>
set -euo pipefail

SERVICE_NAME="${1:-}"
if [ -z "$SERVICE_NAME" ]; then
  echo "✗ Usage: deploy.sh <service-name>"
  exit 1
fi

MANIFEST_DIR="learnflow-app/services/${SERVICE_NAME}-service/k8s"
DAPR_DIR="learnflow-app/services/${SERVICE_NAME}-service/dapr"
NAMESPACE="learnflow"

# Ensure learnflow namespace exists
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f - &>/dev/null

# Apply K8s manifests
kubectl apply -f "$MANIFEST_DIR/" -n "$NAMESPACE" &>/dev/null

# Apply Dapr subscription if exists
if [ -d "$DAPR_DIR" ]; then
  kubectl apply -f "$DAPR_DIR/" -n "$NAMESPACE" &>/dev/null
fi

# Wait for rollout
kubectl rollout status deployment/"$SERVICE_NAME" -n "$NAMESPACE" --timeout=120s &>/dev/null

echo "✓ ${SERVICE_NAME} deployed (namespace: ${NAMESPACE})"
