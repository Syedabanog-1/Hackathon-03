# Tasks: Phase 01 — Foundation Skills

**Input**: specs/phase-01-foundation/spec.md + plan.md
**Prerequisites**: Minikube running, Claude Code installed, Goose installed

## Phase 1: Setup

- [ ] T001 Create `skills-library/` directory with `.claude/skills/` structure
- [ ] T002 Initialize `skills-library/` as git repo with README.md
- [ ] T003 [P] Create `learnflow-app/` directory and initialize git repo

---

## Phase 2: Foundational — agents-md-gen Skill (US1)

**Goal**: Single prompt generates AGENTS.md for any repository.

### Implementation

- [ ] T004 Create `skills-library/.claude/skills/agents-md-gen/SKILL.md`
  - YAML frontmatter: name, description, tools, allowed-tools
  - ≤ 150 tokens; references scripts/generate.py
- [ ] T005 Create `skills-library/.claude/skills/agents-md-gen/scripts/generate.py`
  - Walk repo directory tree (os.walk)
  - Extract README.md first 5 lines if exists
  - Write AGENTS.md with: purpose, structure, conventions, agent-usage
  - Print: `✓ AGENTS.md generated (X sections)`
- [ ] T006 Test on Claude Code: prompt "Generate AGENTS.md for skills-library"
- [ ] T007 [P] Test on Goose: same prompt, verify identical output
- [ ] T008 Verify AGENTS.md exists and has non-empty content
- [ ] T009 Measure SKILL.md token count (must be ≤ 150)

**Checkpoint**: agents-md-gen works autonomously on both Claude Code and Goose ✓

---

## Phase 3: Foundational — k8s-foundation Skill (US2)

**Goal**: Single prompt checks cluster health and creates namespaces.

### Implementation

- [ ] T010 Create `skills-library/.claude/skills/k8s-foundation/SKILL.md`
  - ≤ 150 tokens; references check_cluster.sh and create_namespace.sh
- [ ] T011 Create `scripts/check_cluster.sh`
  - Run `kubectl cluster-info` and `kubectl get nodes --no-headers`
  - Parse exit code; print "✓ Cluster healthy, N nodes Ready" or "✗ Unreachable"
  - Exit 0 or 1 accordingly
- [ ] T012 Create `scripts/create_namespace.sh`
  - Accept $1 as namespace name
  - `kubectl create namespace $1 --dry-run=client -o yaml | kubectl apply -f -`
  - Print "✓ Namespace $1 ready"
- [ ] T013 Test on Claude Code: prompt "Check Kubernetes cluster health"
- [ ] T014 [P] Test on Goose: same prompt, verify identical output
- [ ] T015 Verify output is ≤ 3 lines

**Checkpoint**: k8s-foundation works on both agents, output ≤ 3 lines ✓

---

## Phase 4: Polish & Verification

- [ ] T016 Create `skills-library/README.md` with skill directory documentation
- [ ] T017 [P] Create `skills-library/docs/skill-development-guide.md`
- [ ] T018 Commit: "Claude: created foundation skills via agents-md-gen and k8s-foundation skills"

## Dependencies

- T005 depends on T004 (SKILL.md must exist before testing)
- T006 depends on T005 (script must exist before Claude test)
- T007 depends on T005 (parallel with T006)
- T013 depends on T011, T012
- T014 depends on T011, T012 (parallel with T013)
