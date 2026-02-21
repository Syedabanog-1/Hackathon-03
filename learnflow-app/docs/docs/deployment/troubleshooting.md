---
sidebar_position: 3
---

# Troubleshooting

## Minikube Won't Start

```bash
# Check Docker is running
docker ps

# Reset Minikube
minikube delete
minikube start --cpus=4 --memory=8192 --driver=docker
```

## Pods Stuck in Pending

```bash
kubectl describe pod <pod-name> -n learnflow
# Check Events section for: Insufficient memory/CPU, PVC issues
minikube config set memory 8192
minikube stop && minikube start
```

## Kafka Topics Not Created

```bash
kubectl get pods -n kafka
kubectl exec -it kafka-0 -n kafka -- kafka-topics.sh \
  --bootstrap-server localhost:9092 --list
```

## Frontend Can't Reach Backend

```bash
# Verify Kong is running
kubectl get pods -n kong
# Check routes
kubectl get ingress -n learnflow
# Test Kong directly
curl http://$(minikube ip):30000/api/v1/tutor
```

## Service Unhealthy

```bash
kubectl logs <pod-name> -n learnflow -c <service-name>
kubectl logs <pod-name> -n learnflow -c daprd  # Dapr sidecar logs
```

## Better Auth Errors

```bash
# Verify DATABASE_URL secret
kubectl get secret learnflow-secrets -n learnflow -o jsonpath='{.data.DATABASE_URL}' | base64 -d
# Tables should exist: users, sessions
```

## Qdrant Connection Failed

```bash
# Test Qdrant connectivity
python -c "
import os, urllib.request
url = os.environ['QDRANT_URL'] + '/collections'
req = urllib.request.Request(url)
req.add_header('api-key', os.environ['QDRANT_API_KEY'])
print(urllib.request.urlopen(req).read()[:200])
"
```
