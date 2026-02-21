---
name: mcp-code-execution
description: Demonstrate MCP Code Execution token-efficiency pattern and deploy Kong API Gateway
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# mcp-code-execution

## When to Use
- Demonstrating token efficiency to judges
- Wrapping any MCP data source call in a script
- Deploying Kong API Gateway for LearnFlow

## Instructions

1. Run token efficiency demonstration:
   ```
   python .claude/skills/mcp-code-execution/scripts/filter_demo.py
   ```
2. Deploy Kong API Gateway:
   ```
   bash .claude/skills/mcp-code-execution/scripts/kong_deploy.sh
   ```
3. Confirm output shows ✓ and token reduction proof.

## Pattern Summary

```
BEFORE: agent calls MCP tool → full dataset in context (50k tokens)
AFTER:  script calls MCP API → filters data → "✓ 5 records" (~10 tokens)
Result: 98% token reduction
```

## Validation
- [ ] filter_demo.py shows token comparison proof
- [ ] "✓ Kong deployed, 4 routes configured" in output
- [ ] JWT auth rejects unauthenticated request with 401
