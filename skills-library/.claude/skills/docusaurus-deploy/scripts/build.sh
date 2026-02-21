#!/usr/bin/env bash
# docusaurus-deploy: build.sh
set -euo pipefail
eval "$(minikube docker-env)"
docker build -t learnflow-docs:latest learnflow-app/docs &>/dev/null
echo "✓ Docs image built (learnflow-docs:latest)"
