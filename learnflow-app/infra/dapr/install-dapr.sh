#!/bin/bash
# install-dapr.sh — Install Dapr on Kubernetes
# Part of Phase 3: Backend Services
set -euo pipefail

echo "Installing Dapr on Kubernetes..."

# Check dapr CLI is installed
if ! command -v dapr &>/dev/null; then
  echo "Installing Dapr CLI..."
  curl -fsSL https://raw.githubusercontent.com/dapr/cli/master/install/install.sh | bash
fi

# Init Dapr on Kubernetes
dapr init --kubernetes --wait

# Apply Dapr components
kubectl create namespace learnflow --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f learnflow-app/infra/dapr-components/

echo "✓ Dapr installed on Kubernetes"
echo "  Components applied: kafka-pubsub, learnflow-state"
dapr status -k | head -5
