# PostgreSQL K8s Setup — Reference

> Loaded on-demand only.

## Helm Chart

```bash
helm upgrade --install postgresql bitnami/postgresql \
  --namespace postgres --create-namespace \
  --set auth.database=learnflow \
  --set auth.username=learnflow \
  --set auth.password=learnflow_secret \
  --set primary.persistence.size=2Gi
```

## LearnFlow Schema

Tables created by migrate.py:
- `users` — student and teacher accounts
- `modules` — 8 Python curriculum modules
- `progress` — mastery scores per student per topic
- `struggle_alerts` — triggered when student is stuck
- `exercises` — generated coding challenges

## Connection

```
Host:     postgresql.postgres.svc.cluster.local
Port:     5432
Database: learnflow
User:     learnflow
Password: from K8s secret postgresql (key: postgres-password)
```

## Common Issues

- **PVC Pending**: `kubectl describe pvc -n postgres` → check storage class
- **Auth failed**: Verify secret: `kubectl get secret postgresql -n postgres -o yaml`
- **Connection refused**: Wait for pod: `kubectl rollout status statefulset/postgresql -n postgres`
