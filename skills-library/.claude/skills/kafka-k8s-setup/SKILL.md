---
name: kafka-k8s-setup
description: Deploy Apache Kafka on Kubernetes via Helm, create LearnFlow topics, verify pods
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# kafka-k8s-setup

## When to Use
- Setting up event-driven messaging for LearnFlow microservices
- Deploying Kafka for the first time on the cluster
- Recreating Kafka after cluster reset

## Instructions

1. Deploy Kafka:
   ```
   bash .claude/skills/kafka-k8s-setup/scripts/deploy.sh
   ```
2. Create LearnFlow topics:
   ```
   bash .claude/skills/kafka-k8s-setup/scripts/create_topics.sh
   ```
3. Verify pods running:
   ```
   python .claude/skills/kafka-k8s-setup/scripts/verify.py
   ```
4. All output must show ✓. If ✗ appears, check REFERENCE.md.

## Validation
- [ ] "✓ Kafka deployed" in output
- [ ] "✓ 5 topics created" in output
- [ ] "✓ All N pods running" in verify output
- [ ] Output ≤ 4 lines total
