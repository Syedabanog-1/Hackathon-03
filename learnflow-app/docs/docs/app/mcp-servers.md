---
sidebar_position: 4
---

# MCP Servers

## Qdrant Vector Database

LearnFlow uses **Qdrant** as the real MCP data source for student knowledge vectors.

### Collection: `student_knowledge`

Each vector represents a student's knowledge state for a Python topic:

```json
{
  "id": "uuid",
  "vector": [0.1, 0.2, ...],  // 128-dim embedding
  "payload": {
    "student_id": "uuid",
    "topic": "for-loops",
    "mastery_score": 0.35,
    "error_count": 3,
    "last_activity": "2026-02-18T..."
  }
}
```

### MCP Code Execution Pattern

```python
from mcp_client import MCPClient

client = MCPClient()  # reads QDRANT_URL + QDRANT_API_KEY from env

# Filter client-side: 1000 records → 5 results → ~15 tokens in context
all_students = client.scroll("student_knowledge", limit=1000)
struggling = [s for s in all_students if s["mastery_score"] < 0.40][:5]

print(f"✓ {len(struggling)} struggling students identified")
```

### Token Efficiency

| Approach | Tokens |
|----------|--------|
| Direct Qdrant MCP call (1000 records) | ~50,000 |
| Script filter → 5 results | ~15 |
| **Reduction** | **99.97%** |

## How Progress Service Uses Qdrant

1. Student completes exercise → `progress-updates` Kafka topic
2. Progress service upserts mastery vector to Qdrant
3. Struggle detection queries Qdrant for low-mastery students
4. Teacher dashboard shows top 5 struggling students
