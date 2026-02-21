# Tasks: Phase 05 — MCP Code Execution Skill

**Input**: specs/phase-05-integration/spec.md + plan.md
**Prerequisites**: Phase 02 complete; Kafka running; kubectl working

## Phase 1: mcp-code-execution Skill

**Goal**: Demonstrate MCP Code Execution pattern with ≥ 80% token reduction.

- [ ] T001 Create `skills-library/.claude/skills/mcp-code-execution/SKILL.md`
  - ≤ 150 tokens; explains pattern; references mcp_client.py, filter_demo.py
- [ ] T002 Create `skills-library/.claude/skills/mcp-code-execution/REFERENCE.md`
  - Anthropic MCP Code Execution blog pattern; token budget table
- [ ] T003 Create `scripts/mcp_client.py`
  - Generic MCP server wrapper class
  - `connect(server_url)`, `call(tool_name, params)` methods
  - Returns raw result (processed by caller)
  - Never prints raw data
- [ ] T004 Create `scripts/filter_demo.py`
  - Fetch from **real Qdrant REST API** via MCPClient (QDRANT_URL + QDRANT_API_KEY from env)
  - Ensure `student_knowledge` collection exists; seed 1000 records if empty
  - Filter: students with mastery_score < 0.40 (struggling); return top 5 sorted
  - Print ONLY: "✓ Token demo: 1,000 records fetched, 5 returned to context"
  - Print reduction stats: before tokens | after tokens | % saved (≤ 30 tokens total)
- [ ] T005 Test on Claude Code: "Demonstrate MCP code execution pattern"
- [ ] T006 [P] Test on Goose: same prompt
- [ ] T007 Document token reduction ratio in REFERENCE.md

---

## Phase 2: Kong API Gateway

- [ ] T008 Move Kong deployment to k8s-foundation skill (Separation of Concerns):
  Create `skills-library/.claude/skills/k8s-foundation/scripts/kong_deploy.sh`
  - `helm repo add kong https://charts.konghq.com && helm repo update`
  - `helm upgrade --install kong kong/kong -n kong --create-namespace`
  - Wait for Kong pod Running
  - Apply route configs: `kubectl apply -f learnflow-app/infra/kong/routes.yaml`
  - Print "✓ Kong deployed, 4 routes configured"
  (NOTE: Remove kong_deploy.sh from mcp-code-execution/scripts/ — wrong location)
- [ ] T009 Create `learnflow-app/infra/kong/values.yaml` (Helm values)
- [ ] T010 Create `learnflow-app/infra/kong/routes.yaml` (Kong Ingress resources)
  - Routes: /api/v1/tutor → triage, /api/v1/execute → sandbox,
    /api/v1/progress → progress, /api/v1/exercises → exercise
- [ ] T011 Test: Kong routes request to triage service
- [ ] T012 Test: JWT plugin rejects unauthenticated request with 401

---

## Phase 3: Commit

- [ ] T013 Commit: "Claude: demonstrated MCP code execution pattern; deployed Kong via mcp-code-execution skill"
