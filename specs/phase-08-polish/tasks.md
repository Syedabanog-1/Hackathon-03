# Tasks: Phase 08 — Polish & Demo Readiness

**Input**: specs/phase-08-polish/spec.md + plan.md
**Prerequisites**: All Phases 01–07 complete and verified

## Phase 1: Quality Gate Verification

- [ ] T001 Verify all SKILL.md token counts ≤ 150: run `wc -w` on each SKILL.md
- [ ] T002 [P] Verify cross-agent: re-run each skill on Goose; confirm identical output
- [ ] T003 Verify MCP token reduction: confirm filter_demo.py shows ≥ 80% reduction
- [ ] T004 [P] Verify all K8s pods Running: `kubectl get pods -A` via k8s-foundation skill
- [ ] T005 Verify no hardcoded secrets: grep scripts/ for password/secret/token patterns
- [ ] T006 Verify all 10 phase spec/plan/tasks files exist (phases 01–10)

**Checkpoint**: All 6 quality gates green ✓

---

## Phase 2: README & Documentation Polish

- [ ] T007 Write `skills-library/README.md`: describe all 8 skills with example prompts
- [ ] T008 Write `learnflow-app/README.md`:
  - Architecture diagram (ASCII)
  - Demo steps (numbered, skill-prompt format)
  - Tech stack table
- [ ] T009 [P] Generate AGENTS.md: "Generate AGENTS.md for skills-library"
- [ ] T010 [P] Generate AGENTS.md: "Generate AGENTS.md for learnflow-app"
- [ ] T011 Verify Docusaurus site accessible; all 7 skill pages navigable
- [ ] T012 Write `skills-library/docs/skill-development-guide.md` if not present

**Checkpoint**: Both READMEs complete; AGENTS.md in both repos ✓

---

## Phase 3: Demo Dry-Run

- [ ] T013 Wipe cluster: `minikube delete && minikube start --cpus=4 --memory=8192`
- [ ] T014 Run full deployment from scratch using only skill prompts (Phase 07 sequence)
- [ ] T015 Run Part 8 demo scenario end-to-end; record time (target: < 5 min)
- [ ] T016 Fix any failures found; re-run until clean pass

**Checkpoint**: Full demo runs cleanly from fresh cluster ✓

---

## Phase 4: Final Commit

- [ ] T017 Final commit in learnflow-app: "Claude: LearnFlow v1.0 polish complete"
- [ ] T018 [P] Final commit in skills-library: "Claude: all 8 skills production-ready"
