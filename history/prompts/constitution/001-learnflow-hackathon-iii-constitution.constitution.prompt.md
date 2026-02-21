---
id: 001
title: LearnFlow Hackathon III Constitution
stage: constitution
date: 2026-02-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: syeda-gulzar-bano
command: sp.constitution
labels: ["constitution", "hackathon", "skills-first", "mcp", "kubernetes", "learnflow"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - specs/phase-01-foundation/spec.md
  - specs/phase-01-foundation/plan.md
  - specs/phase-01-foundation/tasks.md
  - specs/phase-02-infrastructure/spec.md
  - specs/phase-02-infrastructure/plan.md
  - specs/phase-02-infrastructure/tasks.md
  - specs/phase-03-backend/spec.md
  - specs/phase-03-backend/plan.md
  - specs/phase-03-backend/tasks.md
  - specs/phase-04-frontend/spec.md
  - specs/phase-04-frontend/plan.md
  - specs/phase-04-frontend/tasks.md
  - specs/phase-05-integration/spec.md
  - specs/phase-05-integration/plan.md
  - specs/phase-05-integration/tasks.md
  - specs/phase-06-docs/spec.md
  - specs/phase-06-docs/plan.md
  - specs/phase-06-docs/tasks.md
  - specs/phase-07-learnflow/spec.md
  - specs/phase-07-learnflow/plan.md
  - specs/phase-07-learnflow/tasks.md
  - skills-library/.claude/skills/agents-md-gen/SKILL.md
  - skills-library/.claude/skills/agents-md-gen/scripts/generate.py
  - skills-library/.claude/skills/k8s-foundation/SKILL.md
  - skills-library/.claude/skills/k8s-foundation/scripts/check_cluster.sh
  - skills-library/.claude/skills/k8s-foundation/scripts/create_namespace.sh
  - skills-library/.claude/skills/kafka-k8s-setup/SKILL.md
  - skills-library/.claude/skills/kafka-k8s-setup/REFERENCE.md
  - skills-library/.claude/skills/kafka-k8s-setup/scripts/deploy.sh
  - skills-library/.claude/skills/kafka-k8s-setup/scripts/create_topics.sh
  - skills-library/.claude/skills/kafka-k8s-setup/scripts/verify.py
  - skills-library/.claude/skills/postgres-k8s-setup/SKILL.md
  - skills-library/.claude/skills/postgres-k8s-setup/REFERENCE.md
  - skills-library/.claude/skills/postgres-k8s-setup/scripts/deploy.sh
  - skills-library/.claude/skills/postgres-k8s-setup/scripts/migrate.py
  - skills-library/.claude/skills/postgres-k8s-setup/scripts/verify.py
  - skills-library/.claude/skills/fastapi-dapr-agent/SKILL.md
  - skills-library/.claude/skills/fastapi-dapr-agent/REFERENCE.md
  - skills-library/.claude/skills/fastapi-dapr-agent/scripts/scaffold.py
  - skills-library/.claude/skills/fastapi-dapr-agent/scripts/build.sh
  - skills-library/.claude/skills/fastapi-dapr-agent/scripts/deploy.sh
  - skills-library/.claude/skills/fastapi-dapr-agent/scripts/verify.sh
  - skills-library/.claude/skills/mcp-code-execution/SKILL.md
  - skills-library/.claude/skills/mcp-code-execution/REFERENCE.md
  - skills-library/.claude/skills/mcp-code-execution/scripts/mcp_client.py
  - skills-library/.claude/skills/mcp-code-execution/scripts/filter_demo.py
  - skills-library/.claude/skills/mcp-code-execution/scripts/kong_deploy.sh
  - skills-library/.claude/skills/nextjs-k8s-deploy/SKILL.md
  - skills-library/.claude/skills/nextjs-k8s-deploy/scripts/scaffold.sh
  - skills-library/.claude/skills/nextjs-k8s-deploy/scripts/build.sh
  - skills-library/.claude/skills/nextjs-k8s-deploy/scripts/deploy.sh
  - skills-library/.claude/skills/nextjs-k8s-deploy/scripts/verify.sh
  - skills-library/.claude/skills/docusaurus-deploy/SKILL.md
  - skills-library/.claude/skills/docusaurus-deploy/scripts/scaffold.sh
  - skills-library/.claude/skills/docusaurus-deploy/scripts/build.sh
  - skills-library/.claude/skills/docusaurus-deploy/scripts/deploy.sh
  - skills-library/README.md
  - skills-library/docs/skill-development-guide.md
  - learnflow-app/README.md
  - learnflow-app/infra/dapr-components/kafka-pubsub.yaml
  - learnflow-app/infra/dapr-components/postgres-state.yaml
  - learnflow-app/infra/kong/routes.yaml
tests:
  - Manual: claude "Generate AGENTS.md" → AGENTS.md created
  - Manual: claude "Deploy Kafka using kafka-k8s-setup skill" → pods Running
  - Manual: claude "Deploy PostgreSQL using postgres-k8s-setup skill" → DB ready
  - Manual: claude "Create triage service using fastapi-dapr-agent skill" → pod 2/2
---

## Prompt

Hackathon III: Reusable Intelligence and Cloud-Native Mastery.

[Full hackathon description provided — build LearnFlow AI-powered Python tutoring
platform using Skills-First Development methodology with MCP Code Execution pattern.
Create constitution, then perform remaining specifyplus commands for each phase.
For each phase folder, create skills and agents where essential, then by using
skills and agents fulfill requirement for each phase.]

## Response snapshot

Created complete hackathon project structure:

1. **Constitution** (v1.0.0): 7 core principles ratified
   - Skills-First Development, MCP Code Execution, Cross-Agent Compatibility,
     Cloud-Native Architecture, SDD, Agentic Autonomy, Separation of Concerns

2. **Phase Specs** (7 phases × 3 files = 21 SDD artifacts):
   - phase-01-foundation through phase-07-learnflow
   - Each with spec.md, plan.md, tasks.md

3. **Skills Library** (8 skills, 25 scripts):
   - agents-md-gen, k8s-foundation, kafka-k8s-setup, postgres-k8s-setup,
     fastapi-dapr-agent, mcp-code-execution, nextjs-k8s-deploy, docusaurus-deploy

4. **LearnFlow App Structure**:
   - Infra: Dapr components, Kong routes
   - README with deployment instructions

## Outcome

- ✅ Impact: Full hackathon project scaffolded end-to-end via SDD pipeline
- 🧪 Tests: Skills ready for manual testing with Claude Code and Goose
- 📁 Files: 60+ files created across skills-library, learnflow-app, specs/
- 🔁 Next prompts: Run `claude "Generate AGENTS.md for skills-library"` to test first skill
- 🧠 Reflection: Skills follow MCP Code Execution pattern correctly — SKILL.md ≤ 150 tokens, scripts do all work

## Evaluation notes

- Failure modes observed: none yet (pre-execution)
- Graders run: N/A
- Prompt variant: full hackathon spec → complete project scaffold
- Next experiment: Execute kafka-k8s-setup on live Minikube to validate deploy.sh
