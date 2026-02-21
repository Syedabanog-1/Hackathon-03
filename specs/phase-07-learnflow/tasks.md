# Tasks: Phase 07 — LearnFlow Complete Application

**Input**: specs/phase-07-learnflow/spec.md + plan.md
**Prerequisites**: All skills from Phases 01–06 complete and tested

## Phase 1: Full Cluster Bootstrap via Skills

- [X] T001 Generate AGENTS.md: "Generate AGENTS.md for learnflow-app"
- [X] T002 Check cluster: "Check Kubernetes cluster health"
- [X] T003 Create namespaces: kafka, postgres, learnflow, kong, monitoring
- [X] T004 Deploy Kafka: "Deploy Kafka using kafka-k8s-setup skill" (Strimzi learnflow-kafka-combined-0 Running)
- [X] T005 Deploy PostgreSQL: "Deploy PostgreSQL using postgres-k8s-setup skill" (postgresql-0 Running, 8 tables migrated)
- [X] T006 Verify all infra pods Running before proceeding

**Checkpoint**: Infrastructure ready ✓

---

## Phase 2: Deploy All Services (US1 — Student Tutor Flow)

- [X] T007 "Create triage service using fastapi-dapr-agent skill" (2/2 Running)
- [X] T008 "Create concepts service using fastapi-dapr-agent skill" (2/2 Running)
- [X] T009 [P] "Create code-review service using fastapi-dapr-agent skill" (2/2 Running)
- [X] T010 [P] "Create debug service using fastapi-dapr-agent skill" (2/2 Running)
- [X] T011 [P] "Create exercise service using fastapi-dapr-agent skill" (2/2 Running)
- [X] T012 "Create progress service using fastapi-dapr-agent skill" (2/2 Running)
- [X] T013 "Create code-sandbox service using fastapi-dapr-agent skill" (2/2 Running)
- [X] T014 Apply Dapr components via k8s-foundation skill (kafka-pubsub + learnflow-state applied)
- [X] T015 Deploy Kong: "Deploy Kong API gateway using k8s-foundation skill" (2/2 Running, JWT auth active)

**Checkpoint**: All 7 services Running; Kong routing active ✓

---

## Phase 3: Frontend + Docs (US1 continued)

- [X] T016 "Deploy Next.js frontend using nextjs-k8s-deploy skill" (1/1 Running, homepage served)
- [ ] T017 "Deploy documentation using docusaurus-deploy skill"
- [ ] T018 Test /editor page → write Python → run → output shown
- [ ] T019 Test /dashboard page → mastery scores load from progress service

**Checkpoint**: Full student UI working ✓

---

## Phase 4: Struggle Detection & Teacher Flow (US2)

- [ ] T020 Using fastapi-dapr-agent skill, instruct agent: "Add struggle detection
  to progress-service: publish to struggle-alerts topic when — same error 3+,
  stuck > 10 min, quiz < 50%, user says I don't understand, 5+ failed executions"
  (agent writes code via skill; no manual coding)
- [ ] T021 Implement teacher dashboard page: /teacher
  - Displays live struggle alerts from progress service
- [ ] T022 Test: Submit 3 wrong answers → struggle alert fires → teacher sees alert
- [ ] T023 Test: Teacher prompts "Create exercises on list comprehensions"
  → exercise-service generates 3 exercises → teacher assigns

**Checkpoint**: Teacher flow working ✓

---

## Phase 5: Mastery Calculation (US3)

- [ ] T024 Using fastapi-dapr-agent skill, instruct agent: "Add mastery calculation
  to progress-service: mastery = 0.4*exercise + 0.3*quiz + 0.2*code_quality +
  0.1*streak; store result in PostgreSQL progress table via Dapr state store"
  (agent writes code via skill; no manual coding)
- [ ] T025 Implement mastery levels: Beginner (0-40%), Learning (41-70%),
  Proficient (71-90%), Mastered (91-100%)
- [ ] T026 Test: Quiz 4/5 → mastery updates correctly
- [ ] T027 Display mastery level badge in frontend dashboard

---

## Phase 6: Demo Scenario Validation

- [ ] T028 Run full Part 8 demo scenario end-to-end
  - Maya logs in → sees Module 2 Loops 60%
  - Maya asks "How do for loops work?" → Concepts responds
  - Maya writes loop → runs → Code Review rates
  - Maya takes quiz 4/5 → mastery 68%
  - James fails 3× → struggle alert sent
  - Teacher sees alert → generates exercises → assigns
  - James completes → mastery restored
- [ ] T029 Record demo run time (target: < 5 min from fresh cluster)

---

## Phase 7: Commit History

- [ ] T030 Each service commit: "Claude: deployed <service> using fastapi-dapr-agent skill"
- [ ] T031 Final commit: "Goose: LearnFlow v1.0 fully deployed via skills"
