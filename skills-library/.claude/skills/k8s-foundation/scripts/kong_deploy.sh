#!/bin/bash
# kong_deploy.sh — Deploy Kong API Gateway via Helm on Kubernetes
# Usage: ./kong_deploy.sh [routes-yaml-path]
# Moved from mcp-code-execution to k8s-foundation (Separation of Concerns fix)

set -euo pipefail

ROUTES_YAML="${1:-learnflow-app/infra/kong/routes.yaml}"
NAMESPACE="kong"

echo "→ Adding Kong Helm repo..."
helm repo add kong https://charts.konghq.com 2>/dev/null || true
helm repo update

echo "→ Deploying Kong API Gateway..."
helm upgrade --install kong kong/kong \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --set ingressController.installCRDs=false \
  --set proxy.type=NodePort \
  --wait --timeout=3m

echo "→ Waiting for Kong pod..."
kubectl rollout status deployment/kong-kong -n "$NAMESPACE" --timeout=120s

if [[ -f "$ROUTES_YAML" ]]; then
  echo "→ Applying route configs..."
  kubectl apply -f "$ROUTES_YAML"
  echo "✓ Kong deployed, routes applied from $ROUTES_YAML"
else
  echo "✓ Kong deployed (no routes file at $ROUTES_YAML — apply manually)"
fi
