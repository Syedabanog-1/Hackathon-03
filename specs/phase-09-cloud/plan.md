# Implementation Plan: Phase 09 — Cloud Deployment

**Branch**: `phase-09-cloud` | **Date**: 2026-02-18 | **Spec**: specs/phase-09-cloud/spec.md

## Summary

Deploy LearnFlow to a managed cloud Kubernetes cluster using the same skills
from Phases 01-07 (kubeconfig context swap only). Swap in-cluster PostgreSQL
for Neon serverless DB. Configure TLS ingress.

## Technical Context

**Language/Version**: Bash, Helm 3.x, kubectl
**Primary Dependencies**: Cloud K8s (AKS/GKE/OKE), Neon PostgreSQL, cert-manager
**Storage**: Neon (cloud) instead of bitnami/postgresql Helm chart
**Testing**: HTTP health checks via public URL; TLS verification
**Target Platform**: Cloud Kubernetes (production-grade)
**Constraints**: Secrets in K8s Secrets only; no hardcoded credentials

## Constitution Check

- [x] **Principle I**: Same skills, only kubeconfig context differs.
- [x] **Principle II**: No context bloat added; patterns unchanged.
- [x] **Principle III**: Cross-agent: same prompts work on cloud context.
- [x] **Principle IV**: Cloud-native: managed K8s, Neon DB, TLS ingress.
- [x] **Principle V**: Spec approved.
- [x] **Principle VI**: Single prompt switches context and redeploys.
- [x] **Principle VII**: Skills unchanged; only environment config differs.

## Architecture Decisions

### Cloud Provider Options (choose one)

| Provider | Cluster | Notes |
|----------|---------|-------|
| Azure AKS | `az aks create` | Free trial available |
| Google GKE | `gcloud container clusters create` | $300 free credit |
| Oracle OKE | `oci ce cluster create` | Always Free tier |

### PostgreSQL → Neon

`postgres-k8s-setup` skill `migrate.py` reads `DATABASE_URL` env var.
In cloud mode: set `DATABASE_URL=postgres://user:pass@neon.tech/learnflow`.
In-cluster Helm chart skipped when `NEON_MODE=true`.

## Complexity Tracking

No constitution violations.
