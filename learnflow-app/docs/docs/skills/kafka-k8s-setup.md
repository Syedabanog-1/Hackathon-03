---
sidebar_label: kafka-k8s-setup
---

# kafka-k8s-setup

**Phase 2 | Infrastructure | ≤120 tokens**

Deploy Apache Kafka on Kubernetes via Helm and create the 6 LearnFlow topics.

## Usage

```bash
claude "Deploy Kafka using kafka-k8s-setup skill"
```

## Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `deploy.sh` | Helm install Kafka in KRaft mode | `✓ Kafka deployed to namespace 'kafka'` |
| `create_topics.sh` | Create 6 LearnFlow topics | `✓ 6 topics created` |
| `verify.py` | Check all pods Running | `✓ All N pods running` |

## Topics Created

1. `student-events` — Student actions and queries
2. `tutor-requests` — Routed to specialist agents
3. `tutor-responses` — Agent responses back to frontend
4. `progress-updates` — Mastery score changes
5. `struggle-alerts` — Teacher notifications
6. `exercise-requests` — Generated exercises

## Success Criteria

- All Kafka pods in Running state
- `kafka.kafka.svc.cluster.local:9092` reachable
- 6 topics created and listable
