#!/usr/bin/env bash
# docusaurus-deploy: scaffold.sh
# Scaffold Docusaurus v3 with LearnFlow skill documentation.
set -euo pipefail

DOCS_DIR="learnflow-app/docs"

if [ -d "$DOCS_DIR" ]; then
  echo "✓ Docs directory exists, skipping scaffold"
  exit 0
fi

npx create-docusaurus@3 "$DOCS_DIR" classic --typescript &>/dev/null

cd "$DOCS_DIR"

# Create skill documentation pages
mkdir -p docs/skills

cat > docs/intro.md << 'EOF'
---
sidebar_position: 1
---
# LearnFlow Skills Library

LearnFlow is built using the **Skills-First Development** methodology.
Every component is created by AI agents (Claude Code, Goose) instructed by skills.

## Architecture

All skills follow the MCP Code Execution Pattern:
- **SKILL.md** (~100 tokens) — instructions only
- **scripts/** — all heavy lifting, executed outside context
- **REFERENCE.md** — deep docs loaded on-demand

## Available Skills

| Skill | Phase | Purpose |
|-------|-------|---------|
| agents-md-gen | 1 | Generate AGENTS.md |
| k8s-foundation | 1 | Cluster health check |
| kafka-k8s-setup | 2 | Deploy Kafka |
| postgres-k8s-setup | 2 | Deploy PostgreSQL |
| fastapi-dapr-agent | 3 | Scaffold microservices |
| mcp-code-execution | 5 | Token efficiency pattern |
| nextjs-k8s-deploy | 4 | Deploy frontend |
| docusaurus-deploy | 6 | Deploy documentation |
EOF

for SKILL in agents-md-gen k8s-foundation kafka-k8s-setup postgres-k8s-setup \
             fastapi-dapr-agent mcp-code-execution nextjs-k8s-deploy docusaurus-deploy; do
  cat > "docs/skills/${SKILL}.md" << SKILL_EOF
---
sidebar_label: ${SKILL}
---
# ${SKILL}

Skill located at: \`.claude/skills/${SKILL}/\`

## Usage

\`\`\`bash
# Claude Code
claude "Deploy using ${SKILL} skill"

# Goose
goose "Deploy using ${SKILL} skill"
\`\`\`

## Files

- \`SKILL.md\` — Agent instructions (≤ 150 tokens)
- \`REFERENCE.md\` — Deep documentation (on-demand)
- \`scripts/\` — Execution scripts (0 tokens in context)

See the SKILL.md in the skills-library repository for full documentation.
SKILL_EOF
done

# Dockerfile for static serving
cat > Dockerfile << 'DOCKERFILE_EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKERFILE_EOF

# K8s manifest
mkdir -p k8s
cat > k8s/docs-deployment.yaml << 'K8S_EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docs
  namespace: learnflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: docs
  template:
    metadata:
      labels:
        app: docs
    spec:
      containers:
      - name: docs
        image: learnflow-docs:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: docs-svc
  namespace: learnflow
spec:
  type: NodePort
  selector:
    app: docs
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30090
K8S_EOF

cd - &>/dev/null
echo "✓ Docusaurus scaffolded (7 skill pages + architecture)"
