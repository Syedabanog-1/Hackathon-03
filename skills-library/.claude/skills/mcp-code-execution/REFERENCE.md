# MCP Code Execution Pattern — Reference

> Loaded on-demand only.

## The Token Problem (Why This Matters)

| Approach | Tokens in Context | Available for Work |
|----------|------------------|--------------------|
| 1 MCP server (5 tools) | ~10,000 tokens | 90% |
| 3 MCP servers (15 tools) | ~30,000 tokens | 70% |
| 5 MCP servers (25 tools) | ~50,000 tokens | 50% |
| Skills + Scripts | ~500 tokens | 97% |

## The Solution: Code Execution

```python
# BEFORE (inefficient — full dataset in context):
# TOOL CALL: source.getData() → 10,000 rows in context (~500,000 chars)

# AFTER (efficient — filter in script, return minimal):
all_rows = mcp_client.call("getData", {})           # in script
struggling = [r for r in all_rows if r["mastery"] < 0.4]  # in script
print(f"✓ {len(struggling)} struggling students found")     # to context
```

## Anthropic Engineering Blog Reference

Source: https://www.anthropic.com/engineering/code-execution-with-mcp

Key insight: Treat MCP servers as Code APIs. Script does processing;
only the result summary enters the agent's context window.

## Kong Routes (LearnFlow)

| Path | Upstream Service | Auth |
|------|-----------------|------|
| /api/v1/tutor | triage-service:8000 | JWT |
| /api/v1/execute | code-sandbox-service:8000 | JWT |
| /api/v1/progress | progress-service:8000 | JWT |
| /api/v1/exercises | exercise-service:8000 | JWT |
