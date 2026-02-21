#!/usr/bin/env bash
# nextjs-k8s-deploy: build.sh
# Build Next.js Docker image inside Minikube's Docker daemon.
set -euo pipefail

eval "$(minikube docker-env)"
docker build -t learnflow-frontend:latest learnflow-app/frontend &>/dev/null
echo "✓ Frontend image built (learnflow-frontend:latest)"
