#!/usr/bin/env bash
# postgres-k8s-setup: deploy.sh
# Deploy PostgreSQL via Helm. Idempotent.
set -euo pipefail

NAMESPACE="postgres"
RELEASE="postgresql"

# Password MUST come from env var or K8s Secret — never hardcoded
# Set POSTGRES_PASSWORD in .env or K8s Secret before running
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"
if [ -z "$POSTGRES_PASSWORD" ]; then
  echo "✗ POSTGRES_PASSWORD env var not set. Export it before running."
  exit 1
fi

# Ensure Bitnami repo
if ! helm repo list 2>/dev/null | grep -q "bitnami"; then
  helm repo add bitnami https://charts.bitnami.com/bitnami &>/dev/null
fi
helm repo update &>/dev/null

helm upgrade --install "$RELEASE" bitnami/postgresql \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --set auth.database=learnflow \
  --set auth.username=learnflow \
  --set auth.password="${POSTGRES_PASSWORD}" \
  --set primary.persistence.size=2Gi \
  --wait --timeout=5m \
  &>/dev/null

echo "✓ PostgreSQL deployed (namespace: ${NAMESPACE})"
