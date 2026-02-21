---
name: docusaurus-deploy
description: Scaffold Docusaurus v3 documentation site with skill docs, build, and deploy to Kubernetes
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# docusaurus-deploy

## When to Use
- Publishing LearnFlow skill documentation
- Deploying the project documentation site
- Updating documentation after skill changes

## Instructions

1. Scaffold Docusaurus site with skill docs:
   ```
   bash .claude/skills/docusaurus-deploy/scripts/scaffold.sh
   ```
2. Build Docker image:
   ```
   bash .claude/skills/docusaurus-deploy/scripts/build.sh
   ```
3. Deploy to Kubernetes:
   ```
   bash .claude/skills/docusaurus-deploy/scripts/deploy.sh
   ```

## Validation
- [ ] "✓ Docusaurus scaffolded (7 skill pages + architecture)" in output
- [ ] "✓ Docs image built" in output
- [ ] "✓ Docs deployed at http://..." in output
- [ ] All 7 skill pages accessible in browser
