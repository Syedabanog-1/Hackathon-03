# Kafka K8s Setup — Reference

> Loaded on-demand only. Not loaded at skill startup.

## Helm Chart

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install kafka bitnami/kafka --version 26.x.x \
  --namespace kafka --create-namespace \
  --set replicaCount=1 \
  --set zookeeper.enabled=false \
  --set kraft.enabled=true
```

## Topics

| Topic | Producer | Consumer |
|-------|----------|----------|
| student-events | Frontend | Triage service |
| tutor-requests | Triage | Specialist agents |
| tutor-responses | Specialists | Frontend |
| progress-updates | Progress service | DB writer |
| struggle-alerts | Progress service | Teacher dashboard |

## Common Issues

- **Pods Pending**: `kubectl describe pod -n kafka` → check Events for resource issue
- **OOMKilled**: Increase Minikube memory: `minikube start --memory=10240`
- **Topic creation fails**: Wait for broker ready: `kubectl rollout status -n kafka`

## Verify Kafka Manually

```bash
kubectl exec -it kafka-0 -n kafka -- kafka-topics.sh \
  --bootstrap-server localhost:9092 --list
```
