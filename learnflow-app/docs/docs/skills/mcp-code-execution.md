---
sidebar_label: mcp-code-execution
---

# mcp-code-execution

**Phase 5 | Integration | ≤100 tokens**

Demonstrates the MCP Code Execution Pattern: wrapping Qdrant MCP calls in Python scripts to achieve 80–98% token reduction.

## The Problem

Direct MCP tool calls flood the agent context:

```
TOOL CALL: qdrant.scroll(collection="students", limit=1000)
→ Returns 1,000 records: ~50,000 tokens in context
```

## The Solution

Script filters client-side, only result enters context:

```python
# mcp_client.py wraps REST API
client = MCPClient()  # reads QDRANT_URL from env
all_records = client.scroll("student_knowledge", limit=1000)
struggling = [r for r in all_records if r["mastery_score"] < 0.40]
print(f"✓ 5 struggling students identified")  # Only this enters context
```

## Scripts

| Script | Purpose | Tokens Returned |
|--------|---------|----------------|
| `mcp_client.py` | Qdrant REST client | 0 (library) |
| `filter_demo.py` | Demo: filter 1000→5 records | ~15 tokens |
| `kong_deploy.sh` | *(moved to k8s-foundation)* | N/A |

## Token Comparison

| Approach | Tokens |
|----------|--------|
| Direct MCP call (1000 records) | ~50,000 |
| Script with filter | ~15 |
| **Reduction** | **99.97%** |

## Usage

```bash
python skills-library/.claude/skills/mcp-code-execution/scripts/filter_demo.py
```

Output: `✓ Token demo: 1000 records fetched, 5 returned to context (99.97% reduction)`
