#!/usr/bin/env bash
# fastapi-dapr-agent: build.sh
# Build Docker image inside Minikube's Docker daemon.
# Usage: ./build.sh <service-name>
set -euo pipefail

SERVICE_NAME="${1:-}"
if [ -z "$SERVICE_NAME" ]; then
  echo "✗ Usage: build.sh <service-name>"
  exit 1
fi

SERVICE_DIR="learnflow-app/services/${SERVICE_NAME}-service"

if [ ! -d "$SERVICE_DIR" ]; then
  echo "✗ Service directory not found: ${SERVICE_DIR}. Run scaffold.py first."
  exit 1
fi

# Build inside Minikube's Docker environment (no registry push needed)
eval "$(minikube docker-env)"
docker build -t "${SERVICE_NAME}:latest" "$SERVICE_DIR" &>/dev/null

echo "✓ Image ${SERVICE_NAME}:latest built"
