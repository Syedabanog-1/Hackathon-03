#!/bin/bash
# install-argocd.sh — Install Argo CD on Minikube
# Part of Phase 10: Continuous Deployment
set -euo pipefail

echo "Installing Argo CD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "Waiting for Argo CD pods..."
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=5m

# Get initial admin password
ARGOCD_PASSWORD=$(kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d)

echo "✓ Argo CD installed"
echo "  URL: kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "  Username: admin"
echo "  Password: ${ARGOCD_PASSWORD}"
echo ""
echo "Apply LearnFlow app:"
echo "  kubectl apply -f learnflow-app/infra/argocd/learnflow-app.yaml"
