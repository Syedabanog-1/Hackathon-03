# Tasks: Phase 06 — Documentation Skill

**Input**: specs/phase-06-docs/spec.md + plan.md
**Prerequisites**: All previous phases complete

## Phase 1: docusaurus-deploy Skill

- [ ] T001 Create `skills-library/.claude/skills/docusaurus-deploy/SKILL.md`
  - ≤ 150 tokens; references scaffold.sh, build.sh, deploy.sh
- [ ] T002 Create `scripts/scaffold.sh`
  - `npx create-docusaurus@latest docs classic --typescript`
  - Copy skill markdown docs from skills-library/docs/ → docs/docs/skills/
  - Generate architecture.md with LearnFlow system diagram (ASCII)
  - Print "✓ Docusaurus scaffolded (7 skill pages + architecture)"
- [ ] T003 Create `scripts/build.sh`
  - `eval $(minikube docker-env)`
  - Build Dockerfile (node build + nginx serve)
  - Print "✓ Docs image built"
- [ ] T004 Create `scripts/deploy.sh`
  - `kubectl apply -f learnflow-app/docs/k8s/docs-deployment.yaml`
  - Print "✓ Docs deployed at <URL>"

---

## Phase 2: Write Skill Documentation Pages

- [ ] T005 [P] Write `docs/docs/skills/agents-md-gen.md`
- [ ] T006 [P] Write `docs/docs/skills/kafka-k8s-setup.md`
- [ ] T007 [P] Write `docs/docs/skills/postgres-k8s-setup.md`
- [ ] T008 [P] Write `docs/docs/skills/fastapi-dapr-agent.md`
- [ ] T009 [P] Write `docs/docs/skills/mcp-code-execution.md`
- [ ] T010 [P] Write `docs/docs/skills/nextjs-k8s-deploy.md`
- [ ] T011 [P] Write `docs/docs/skills/docusaurus-deploy.md`
- [ ] T012 Write `docs/docs/architecture.md` with ASCII LearnFlow diagram

---

## Phase 3: Deploy and Verify

- [ ] T013 Test on Claude Code: "Deploy documentation using docusaurus-deploy skill"
- [ ] T014 [P] Test on Goose: same prompt
- [ ] T015 Access docs URL; verify all 7 skill pages navigable
- [ ] T016 Commit: "Claude: deployed Docusaurus documentation using docusaurus-deploy skill"
