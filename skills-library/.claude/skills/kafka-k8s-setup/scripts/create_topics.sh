#!/usr/bin/env bash
# kafka-k8s-setup: create_topics.sh
# Creates LearnFlow Kafka topics inside the broker pod.
set -euo pipefail

NAMESPACE="kafka"
TOPICS=("student-events" "tutor-requests" "tutor-responses" "progress-updates" "struggle-alerts")

# Wait for Kafka broker pod to be ready
BROKER_POD=$(kubectl get pods -n "$NAMESPACE" -l app.kubernetes.io/name=kafka \
  --no-headers -o custom-columns=":metadata.name" 2>/dev/null | head -1)

if [ -z "$BROKER_POD" ]; then
  echo "✗ No Kafka broker pod found in namespace ${NAMESPACE}"
  exit 1
fi

# Wait until broker is ready
kubectl wait pod "$BROKER_POD" -n "$NAMESPACE" \
  --for=condition=Ready --timeout=120s &>/dev/null

CREATED=0
for TOPIC in "${TOPICS[@]}"; do
  kubectl exec "$BROKER_POD" -n "$NAMESPACE" -- \
    kafka-topics.sh \
    --bootstrap-server localhost:9092 \
    --create --if-not-exists \
    --topic "$TOPIC" \
    --partitions 3 \
    --replication-factor 1 \
    &>/dev/null && CREATED=$((CREATED + 1))
done

echo "✓ ${CREATED} topics created: ${TOPICS[*]}"
