# Implementation Plan: Phase 10 — Continuous Delivery

**Branch**: `phase-10-cicd` | **Date**: 2026-02-18 | **Spec**: specs/phase-10-cicd/spec.md

## Summary

Set up GitOps-based CD using Argo CD watching learnflow-app repo + GitHub Actions
for CI (build, test, push images). Helm charts stored in repo for Argo CD to sync.

## Technical Context

**Language/Version**: YAML (GitHub Actions), Helm 3.x, Argo CD 2.x
**Primary Dependencies**: Argo CD, GitHub Container Registry (ghcr.io), Helm
**Storage**: Git repo as source of truth (GitOps)
**Testing**: Push test commit; verify auto-deploy within 10 min
**Target Platform**: Cloud K8s (Phase 09 cluster)
**Constraints**: No raw kubectl in CI; all K8s ops via Helm or Argo CD

## Constitution Check

- [x] **Principle I**: argocd-app-deployment skill wraps all Argo CD operations.
- [x] **Principle II**: No context bloat; CI logs not dumped to agent.
- [x] **Principle III**: Skills cross-agent compatible.
- [x] **Principle IV**: GitOps pattern; stateless; cloud-native.
- [x] **Principle V**: Spec approved.
- [x] **Principle VI**: Single `git push` triggers full autonomous deployment.
- [x] **Principle VII**: CI/CD config lives in learnflow-app/.github/; skills in skills-library.

## Architecture Decisions

### GitOps Flow

```
git push main
  → GitHub Actions: docker build → push ghcr.io → update charts/values.yaml
  → Argo CD watches repo → detects values.yaml change → kubectl apply via Helm
  → Pods rolling update → health checks pass → sync complete
```

### Argo CD Installation

Deployed to `argocd` namespace via Helm: `argoproj/argo-cd`.
App configured to watch `learnflow-app` repo at `charts/` path.

## Complexity Tracking

No constitution violations.
