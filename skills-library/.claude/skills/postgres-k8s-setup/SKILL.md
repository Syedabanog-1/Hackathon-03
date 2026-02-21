---
name: postgres-k8s-setup
description: Deploy PostgreSQL on Kubernetes via Helm, run LearnFlow schema migrations, verify connectivity
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# postgres-k8s-setup

## When to Use
- Setting up LearnFlow database on Kubernetes
- Applying schema migrations after code changes
- Recreating database after cluster reset

## Instructions

1. Deploy PostgreSQL:
   ```
   bash .claude/skills/postgres-k8s-setup/scripts/deploy.sh
   ```
2. Run schema migrations:
   ```
   python .claude/skills/postgres-k8s-setup/scripts/migrate.py
   ```
3. Verify connectivity:
   ```
   python .claude/skills/postgres-k8s-setup/scripts/verify.py
   ```

## Validation
- [ ] "✓ PostgreSQL deployed" in output
- [ ] "✓ Migrations applied: 5 tables ready" in output
- [ ] "✓ PostgreSQL ready, DB reachable" in verify output
- [ ] Output ≤ 3 lines total
