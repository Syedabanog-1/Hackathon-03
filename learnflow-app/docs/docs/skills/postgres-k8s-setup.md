---
sidebar_label: postgres-k8s-setup
---

# postgres-k8s-setup

**Phase 2 | Infrastructure | ≤120 tokens**

Deploy PostgreSQL on Kubernetes (or connect to Neon) and run schema migrations.

## Usage

```bash
claude "Deploy PostgreSQL using postgres-k8s-setup skill"
```

## Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `deploy.sh` | Helm install PostgreSQL | `✓ PostgreSQL deployed` |
| `migrate.py` | Run schema migrations | `✓ Migrations complete: N tables` |
| `verify.py` | Verify connectivity | `✓ PostgreSQL ready` |

## Schema Created

- `users` — Student/teacher accounts (Better Auth)
- `progress` — Per-topic mastery scores (0.0–1.0)
- `code_submissions` — Student code history
- `sessions` — Better Auth session store
- `dapr_state` — Dapr state store table

## Success Criteria

- PostgreSQL pod Running (or Neon URL reachable)
- `learnflow` database exists with 5 tables
- `dapr_state` table created for Dapr state store
