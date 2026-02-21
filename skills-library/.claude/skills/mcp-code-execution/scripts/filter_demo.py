#!/usr/bin/env python3
"""
mcp-code-execution: filter_demo.py
Demonstrates the MCP Code Execution token-efficiency pattern using REAL Qdrant.

BEFORE (direct MCP tool call — BAD):
  TOOL CALL: qdrant.scroll(collection="student_knowledge", limit=1000)
  → 1,000 records × ~200 chars ≈ 50,000 tokens dumped into agent context

AFTER (this pattern — GOOD):
  Script fetches from Qdrant REST API, filters in Python,
  returns ONLY a summary line (~15 tokens) to agent context.

Token reduction: ~99.97%
"""
import os
import sys

# Add scripts dir to path for mcp_client import
sys.path.insert(0, os.path.dirname(__file__))
from mcp_client import MCPClient


def main():
    # ── Step 1: Connect to real Qdrant MCP server ──────────────────────────
    try:
        client = MCPClient()
    except ValueError as e:
        print(f"✗ {e}")
        sys.exit(1)

    collection = "student_knowledge"

    # ── Step 2: Ensure collection exists and has data ───────────────────────
    client.ensure_collection(collection, vector_size=4)

    # Check if seeding needed
    count_result = client.call("count", {"collection": collection})
    total_count = count_result.get("result", {}).get("count", 0)

    if total_count < 100:
        seeded = client.seed_student_knowledge(collection)
        total_count = seeded

    # ── Step 3: Fetch ALL records via Qdrant scroll (stays in script) ───────
    # Direct call would dump all records into agent context — we DON'T do that
    # Instead: script receives data, filters, returns summary only

    scroll_result = client.call("scroll", {
        "collection": collection,
        "body": {
            "limit": total_count,
            "with_payload": True,
            "with_vector": False,
            "filter": {
                "must": [
                    {"key": "mastery_score", "range": {"lt": 0.40}}
                ]
            }
        }
    })

    # ── Step 4: Filter in script — NEVER print raw records ─────────────────
    points = scroll_result.get("result", {}).get("points", [])
    struggling = sorted(points, key=lambda p: p["payload"]["mastery_score"])
    top5 = struggling[:5]

    # ── Step 5: ONLY this summary reaches agent context (~15 tokens) ────────
    token_before = total_count * 50     # approx tokens if all records in context
    token_after = 15                    # this summary line
    reduction = (1 - token_after / token_before) * 100 if token_before else 0

    # ── Step 5: ONE summary line to agent context (≤ 30 tokens — FR-002) ─────
    print(f"✓ {total_count:,} records → {len(top5)} struggling students ({reduction:.0f}% token reduction)")

    # Verbose detail only when requested (never reaches agent context by default)
    if "--verbose" in sys.argv:
        print(f"  Before: {token_before:,} tokens | After: {token_after} tokens")
        for p in top5:
            pay = p["payload"]
            print(f"  • {pay['student_id']}: {pay['mastery_score']*100:.0f}% on {pay['topic']}")

    # Exit 0 = success
    sys.exit(0)


if __name__ == "__main__":
    main()
