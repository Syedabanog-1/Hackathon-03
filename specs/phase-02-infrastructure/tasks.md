# Tasks: Phase 02 — Infrastructure Skills

**Input**: specs/phase-02-infrastructure/spec.md + plan.md
**Prerequisites**: Phase 01 complete; Minikube running with ≥ 4 CPUs / 8GB RAM

## Phase 1: Kafka Skill (US1)

**Goal**: Single prompt deploys Kafka with topics on Kubernetes.

- [ ] T001 Create `skills-library/.claude/skills/kafka-k8s-setup/SKILL.md`
  - ≤ 150 tokens; references deploy.sh, create_topics.sh, verify.py
- [ ] T002 Create `skills-library/.claude/skills/kafka-k8s-setup/REFERENCE.md`
  - Kafka concepts, Helm chart options, topic config (loaded on-demand)
- [ ] T003 Create `scripts/deploy.sh`
  - `helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update`
  - `helm upgrade --install kafka bitnami/kafka -n kafka --create-namespace`
  - Wait for rollout: `kubectl rollout status deployment/kafka -n kafka`
- [ ] T004 Create `scripts/create_topics.sh`
  - Use `kubectl exec` to run kafka-topics.sh inside broker pod
  - Create: student-events, tutor-requests, tutor-responses, progress-updates, struggle-alerts, exercise-requests
  - Print "✓ 6 topics created"
- [ ] T005 Create `scripts/verify.py`
  - `import subprocess, json`
  - Call `kubectl get pods -n kafka -o json` via subprocess
  - Count Running pods; print `✓ All N pods running` or `✗ N/M pods running`
  - NEVER print raw JSON
- [ ] T006 Test on Claude Code: "Deploy Kafka using kafka-k8s-setup skill"
- [ ] T007 [P] Test on Goose: same prompt
- [ ] T008 Verify: `kubectl get pods -n kafka` shows all Running
- [ ] T009 Verify: verify.py output ≤ 2 lines

**Checkpoint**: Kafka deployed, topics created, both agents work ✓

---

## Phase 2: PostgreSQL Skill (US2)

**Goal**: Single prompt deploys PostgreSQL and runs schema migrations.

- [ ] T010 Create `skills-library/.claude/skills/postgres-k8s-setup/SKILL.md`
  - ≤ 150 tokens; references deploy.sh, migrate.py, verify.py
- [ ] T011 Create `skills-library/.claude/skills/postgres-k8s-setup/REFERENCE.md`
- [ ] T012 Create `scripts/deploy.sh`
  - `helm upgrade --install postgresql bitnami/postgresql -n postgres --create-namespace`
  - Set DB name: learnflow, with password from K8s secret
- [ ] T013 Create `scripts/migrate.py`
  - Connect via psycopg2 using env vars (POSTGRES_HOST, POSTGRES_PASSWORD)
  - Run CREATE TABLE statements for: users, modules, progress, struggle_alerts, exercises
  - Print "✓ Migrations applied: 5 tables ready"
- [ ] T014 Create `scripts/verify.py`
  - Check pod Running + test DB connection
  - Print "✓ PostgreSQL ready, DB reachable"
- [ ] T015 Test on Claude Code: "Deploy PostgreSQL using postgres-k8s-setup skill"
- [ ] T016 [P] Test on Goose: same prompt
- [ ] T017 Verify migrations applied: `kubectl exec -n postgres postgres-pod -- psql -U postgres -c "\dt"`

**Checkpoint**: PostgreSQL running with LearnFlow schema ✓

---

## Phase 3: Integration Verification

- [ ] T018 Run both skills in sequence via single session
- [ ] T019 Confirm Kafka and PostgreSQL in same cluster, different namespaces
- [ ] T020 Commit: "Claude: deployed Kafka using kafka-k8s-setup skill" + "Claude: deployed PostgreSQL using postgres-k8s-setup skill"
