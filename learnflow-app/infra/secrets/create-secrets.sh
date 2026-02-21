#!/bin/bash
# create-secrets.sh — Create K8s Secrets from .env file values
# Run from repo root after setting env vars or sourcing .env
# Usage: source .env && bash learnflow-app/infra/secrets/create-secrets.sh

set -euo pipefail

NAMESPACE="learnflow"
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic learnflow-secrets \
  --namespace="$NAMESPACE" \
  --from-literal=DATABASE_URL="${DATABASE_URL}" \
  --from-literal=OPENAI_API_KEY="${OPENAI_API_KEY}" \
  --from-literal=QDRANT_URL="${QDRANT_URL}" \
  --from-literal=QDRANT_API_KEY="${QDRANT_API_KEY}" \
  --from-literal=BETTER_AUTH_SECRET="${BETTER_AUTH_SECRET:-$(openssl rand -base64 32)}" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "✓ learnflow-secrets created in namespace $NAMESPACE"
