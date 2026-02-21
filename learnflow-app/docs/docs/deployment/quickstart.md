---
sidebar_position: 1
---

# Quickstart Deployment

Deploy the complete LearnFlow platform from scratch using a single prompt per component.

## Prerequisites

```bash
# Verify all tools installed
docker --version      # ≥ 24.0
minikube version      # ≥ 1.32
kubectl version       # ≥ 1.28
helm version          # ≥ 3.14
claude --version      # any
```

## Step 1: Start Cluster

```bash
minikube start --cpus=4 --memory=8192 --driver=docker
kubectl cluster-info  # Should show running cluster
```

## Step 2: Create Secrets

```bash
# Set environment variables first
export OPENAI_API_KEY="sk-..."
export DATABASE_URL="postgresql://..."
export QDRANT_URL="https://..."
export QDRANT_API_KEY="..."
export BETTER_AUTH_SECRET="$(openssl rand -base64 32)"

# Create K8s secrets
bash learnflow-app/infra/secrets/create-secrets.sh
```

## Step 3: Deploy Infrastructure

```bash
# Foundation
claude "Check Kubernetes cluster health using k8s-foundation skill"

# Kafka
claude "Deploy Kafka using kafka-k8s-setup skill"

# PostgreSQL
claude "Deploy PostgreSQL using postgres-k8s-setup skill"
```

## Step 4: Deploy Dapr

```bash
# Install Dapr
dapr init --kubernetes --wait

# Apply Dapr components
kubectl apply -f learnflow-app/infra/dapr-components/
```

## Step 5: Deploy Services

```bash
# Deploy all 7 FastAPI services
claude "Deploy triage service using fastapi-dapr-agent skill"
claude "Deploy concepts service using fastapi-dapr-agent skill"
claude "Deploy debug service using fastapi-dapr-agent skill"
claude "Deploy exercise service using fastapi-dapr-agent skill"
claude "Deploy progress service using fastapi-dapr-agent skill"
claude "Deploy code-review service using fastapi-dapr-agent skill"
claude "Deploy code-sandbox service using fastapi-dapr-agent skill"
```

## Step 6: Deploy Frontend

```bash
claude "Deploy Next.js frontend using nextjs-k8s-deploy skill"
```

## Step 7: Deploy API Gateway

```bash
claude "Deploy Kong API gateway using k8s-foundation skill"
```

## Step 8: Deploy Documentation

```bash
claude "Deploy documentation using docusaurus-deploy skill"
```

## Access

```bash
MINIKUBE_IP=$(minikube ip)
echo "Frontend: http://$MINIKUBE_IP:30080"
echo "Docs:     http://$MINIKUBE_IP:30090"
```
