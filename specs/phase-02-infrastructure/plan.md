# Implementation Plan: Phase 02 — Infrastructure Skills

**Branch**: `phase-02-infrastructure` | **Date**: 2026-02-18 | **Spec**: specs/phase-02-infrastructure/spec.md

## Summary

Build `kafka-k8s-setup` and `postgres-k8s-setup` skills that deploy Kafka and
PostgreSQL on Kubernetes via Helm, create required topics and schema, and
verify infrastructure health with minimal context output.

## Technical Context

**Language/Version**: Python 3.12, Bash 5+, Helm 3.x
**Primary Dependencies**: Helm, kubectl, Bitnami Helm repo, psycopg2-binary
**Storage**: PostgreSQL (persistent volume via Minikube)
**Testing**: Verify pods Running; test Kafka topic creation; test DB connection
**Target Platform**: Kubernetes (Minikube)
**Performance Goals**: Deploy < 5 min; verify output ≤ 3 lines
**Constraints**: Must be idempotent; no secrets in scripts
**Scale/Scope**: 2 skills, 6 scripts total

## Constitution Check

- [x] **Principle I**: SKILL.md ≤ 150 tokens; Helm/kubectl in scripts only.
- [x] **Principle II**: No raw data dumps; verify.py returns minimal summary.
- [x] **Principle III**: Cross-agent compatible.
- [x] **Principle IV**: Helm charts, K8s namespaces, PVC, health probes.
- [x] **Principle V**: Spec approved.
- [x] **Principle VI**: Single prompt deploys full infrastructure.
- [x] **Principle VII**: Skills in skills-library, no app config hardcoded.

## Project Structure

```text
skills-library/.claude/skills/
├── kafka-k8s-setup/
│   ├── SKILL.md
│   ├── REFERENCE.md
│   └── scripts/
│       ├── deploy.sh        # helm install kafka
│       ├── create_topics.sh # kafka-topics.sh create
│       └── verify.py        # check pod status, return minimal
└── postgres-k8s-setup/
    ├── SKILL.md
    ├── REFERENCE.md
    └── scripts/
        ├── deploy.sh        # helm install postgresql
        ├── migrate.py       # run SQL migrations
        └── verify.py        # test DB connection
```

## Architecture Decisions

### Kafka Deployment

- Namespace: `kafka`
- Helm chart: `bitnami/kafka` (KRaft mode, no separate Zookeeper in newer versions)
- Replicas: 1 (Minikube) → 3 (production)
- Topics created via `kafka-topics.sh` inside broker pod

### PostgreSQL Deployment

- Namespace: `postgres`
- Helm chart: `bitnami/postgresql`
- Database: `learnflow`
- Migrations: embedded SQL in `migrate.py` using psycopg2

### Token Efficiency Pattern

`verify.py` imports json, calls kubectl via subprocess, counts Running pods,
prints ONLY the summary line. JSON data never enters agent context.

## Complexity Tracking

No constitution violations.
