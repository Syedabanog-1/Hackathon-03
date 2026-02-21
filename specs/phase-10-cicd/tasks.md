# Tasks: Phase 10 — Continuous Delivery (Argo CD + GitHub Actions)

**Input**: specs/phase-10-cicd/spec.md + plan.md
**Prerequisites**: Phase 09 complete; learnflow-app on GitHub; cloud cluster running

## Phase 1: Argo CD Deployment

- [ ] T001 Deploy Argo CD using k8s-foundation skill:
  "Deploy Argo CD to learnflow cluster using k8s-foundation skill"
  - Wraps: `helm upgrade --install argocd argo/argo-cd -n argocd --create-namespace`
  - Print "✓ Argo CD deployed; UI at https://<cluster-ip>:443"
- [ ] T002 Create Argo CD Application resource pointing to learnflow-app/charts/
  - Auto-sync enabled; prune enabled
- [ ] T003 Verify Argo CD UI shows all services Healthy/Synced

---

## Phase 2: Helm Charts for GitOps

- [ ] T004 Convert each service's k8s/ manifests to Helm chart in learnflow-app/charts/
  - One chart per service (triage, concepts, code-review, debug, exercise, progress, sandbox)
  - values.yaml: image.tag = "latest" (CI will update this)
- [ ] T005 Add learnflow-app/charts/kafka/ and learnflow-app/charts/postgres/ wrappers
- [ ] T006 Commit: "Claude: converted K8s manifests to Helm charts for GitOps"

---

## Phase 3: GitHub Actions CI Pipeline

- [ ] T007 Create `.github/workflows/ci.yaml` in learnflow-app:
  - Trigger: push to main
  - Steps: docker build → push to ghcr.io → update charts/*/values.yaml (image.tag)
  - Commit values.yaml changes back to repo → Argo CD auto-detects and syncs
- [ ] T008 Create `.github/workflows/test.yaml`:
  - Run skill verification scripts (verify.sh/verify.py for each service)
  - Block deploy if tests fail
- [ ] T009 Add GitHub secrets: GHCR_TOKEN, KUBE_CONFIG (base64 encoded)

---

## Phase 4: End-to-End Pipeline Test

- [ ] T010 Make a small code change; push to main branch
- [ ] T011 Observe GitHub Actions run; verify images pushed to ghcr.io
- [ ] T012 Observe Argo CD auto-sync; verify new pods rolling out
- [ ] T013 Test rollback: `argocd app rollback learnflow` via k8s-foundation skill
- [ ] T014 Commit: "Claude: CI/CD pipeline active via Argo CD + GitHub Actions"
