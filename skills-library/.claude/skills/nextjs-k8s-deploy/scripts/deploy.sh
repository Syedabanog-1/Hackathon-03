#!/usr/bin/env bash
# nextjs-k8s-deploy: deploy.sh
# Deploy frontend to Kubernetes.
set -euo pipefail

NAMESPACE="learnflow"
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f - &>/dev/null
kubectl apply -f learnflow-app/frontend/k8s/ -n "$NAMESPACE" &>/dev/null
kubectl rollout status deployment/frontend -n "$NAMESPACE" --timeout=120s &>/dev/null
echo "✓ Frontend deployed (namespace: ${NAMESPACE})"
