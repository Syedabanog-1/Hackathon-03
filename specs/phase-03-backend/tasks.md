# Tasks: Phase 03 — Backend Services Skill

**Input**: specs/phase-03-backend/spec.md + plan.md
**Prerequisites**: Phase 02 complete; Kafka + PostgreSQL running; Dapr initialized

## Phase 1: fastapi-dapr-agent Skill

**Goal**: Skill scaffolds any FastAPI+Dapr service from a single prompt.

- [ ] T001 Create `skills-library/.claude/skills/fastapi-dapr-agent/SKILL.md`
  - ≤ 150 tokens; references scaffold.py, build.sh, deploy.sh, verify.sh
  - Accepts parameter: SERVICE_NAME
- [ ] T002 Create `skills-library/.claude/skills/fastapi-dapr-agent/REFERENCE.md`
  - Dapr annotations, Kafka pub/sub component config, FastAPI patterns
- [ ] T003 Create `scripts/scaffold.py`
  - Accepts `--service-name` argument
  - Generates: main.py, requirements.txt, Dockerfile, k8s/deployment.yaml,
    k8s/service.yaml, dapr/subscription.yaml
  - Templates embedded as Python strings
  - Print "✓ Scaffolded SERVICE_NAME service (6 files)"
- [ ] T004 Create `scripts/build.sh`
  - `eval $(minikube docker-env)`
  - `docker build -t SERVICE_NAME:latest .`
  - Print "✓ Image SERVICE_NAME:latest built"
- [ ] T005 Create `scripts/deploy.sh`
  - `kubectl apply -f k8s/`
  - `kubectl rollout status deployment/SERVICE_NAME`
  - Print "✓ SERVICE_NAME deployed, pod Running"
- [ ] T006 Create `scripts/verify.sh`
  - Check pod Running with 2/2 containers (app + dapr)
  - Print "✓ SERVICE_NAME: 2/2 containers ready"

---

## Phase 2: Deploy All 6 LearnFlow Services (US1 + US2)

- [ ] T007 Test: "Create triage service using fastapi-dapr-agent skill"
- [ ] T008 Verify: triage pod Running 2/2; `curl /health` returns 200
- [ ] T009 [P] Deploy: "Create concepts service using fastapi-dapr-agent skill"
- [ ] T010 [P] Deploy: "Create code-review service using fastapi-dapr-agent skill"
- [ ] T011 [P] Deploy: "Create debug service using fastapi-dapr-agent skill"
- [ ] T012 [P] Deploy: "Create exercise service using fastapi-dapr-agent skill"
- [ ] T013 [P] Deploy: "Create progress service using fastapi-dapr-agent skill"
- [ ] T014 Deploy: "Create code-sandbox service using fastapi-dapr-agent skill"
- [ ] T015 Implement code sandbox: 5s timeout, 50MB memory, stdlib only
  - Use `subprocess.run` with `timeout=5`, `resource.setrlimit`
- [ ] T016 [P] Test on Goose: "Create triage service using fastapi-dapr-agent skill"
  - Must produce identical result

---

## Phase 3: Dapr Components

- [ ] T017 Create Dapr pub/sub component `kafka-pubsub.yaml` in learnflow-app/infra/dapr-components/
- [ ] T018 Create Dapr state store component `postgres-state.yaml`
- [ ] T019 Apply Dapr components via k8s-foundation skill: prompt "Apply Dapr
  components from learnflow-app/infra/dapr-components/" — agent invokes
  `k8s-foundation` skill; add `scripts/apply_manifests.sh` to k8s-foundation
  that wraps `kubectl apply -f $1` (never call raw kubectl in tasks directly)
- [ ] T020 Send test event to `student-events` topic; verify Triage routes it

---

## Phase 4: Commit

- [ ] T021 Commit all services: "Claude: deployed 7 services using fastapi-dapr-agent skill"
