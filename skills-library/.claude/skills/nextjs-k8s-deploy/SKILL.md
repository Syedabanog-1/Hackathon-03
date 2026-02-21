---
name: nextjs-k8s-deploy
description: Scaffold Next.js 14 app with Monaco editor, build Docker image, deploy to Kubernetes
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# nextjs-k8s-deploy

## When to Use
- Deploying the LearnFlow student-facing frontend
- Setting up Monaco code editor on Kubernetes
- Re-deploying frontend after UI changes

## Instructions

1. Scaffold the Next.js application:
   ```
   bash .claude/skills/nextjs-k8s-deploy/scripts/scaffold.sh
   ```
2. Build Docker image inside Minikube:
   ```
   bash .claude/skills/nextjs-k8s-deploy/scripts/build.sh
   ```
3. Deploy to Kubernetes:
   ```
   bash .claude/skills/nextjs-k8s-deploy/scripts/deploy.sh
   ```
4. Verify and get URL:
   ```
   bash .claude/skills/nextjs-k8s-deploy/scripts/verify.sh
   ```

## Validation
- [ ] "✓ Next.js frontend scaffolded" in output
- [ ] "✓ Frontend image built" in output
- [ ] "✓ Frontend deployed" in output
- [ ] "✓ Frontend accessible at http://..." in verify output
- [ ] Monaco editor loads at /editor path
