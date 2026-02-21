#!/usr/bin/env bash
# kafka-k8s-setup: deploy.sh
# Deploy Apache Kafka via Helm (KRaft mode, no Zookeeper).
# Idempotent: uses helm upgrade --install.
set -euo pipefail

NAMESPACE="kafka"
RELEASE="kafka"

# Add Bitnami repo if not present
if ! helm repo list 2>/dev/null | grep -q "bitnami"; then
  helm repo add bitnami https://charts.bitnami.com/bitnami &>/dev/null
fi
helm repo update &>/dev/null

# Deploy Kafka (KRaft mode)
helm upgrade --install "$RELEASE" bitnami/kafka \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --set replicaCount=1 \
  --set controller.replicaCount=1 \
  --set zookeeper.enabled=false \
  --wait --timeout=5m \
  &>/dev/null

echo "✓ Kafka deployed (namespace: ${NAMESPACE})"
