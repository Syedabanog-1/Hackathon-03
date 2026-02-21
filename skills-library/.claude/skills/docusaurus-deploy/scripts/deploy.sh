#!/usr/bin/env bash
# docusaurus-deploy: deploy.sh
set -euo pipefail
NAMESPACE="learnflow"
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f - &>/dev/null
kubectl apply -f learnflow-app/docs/k8s/ -n "$NAMESPACE" &>/dev/null
kubectl rollout status deployment/docs -n "$NAMESPACE" --timeout=120s &>/dev/null
URL=$(minikube service docs-svc -n "$NAMESPACE" --url 2>/dev/null || echo "http://localhost:30090")
echo "✓ Docs deployed at ${URL}"
