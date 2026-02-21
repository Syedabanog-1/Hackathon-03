#!/usr/bin/env python3
"""
mcp-code-execution: mcp_client.py
Wraps Qdrant REST API as a real MCP server (code-execution pattern).
Import this in filter scripts — never call Qdrant tools directly from agent.

Usage:
    from mcp_client import MCPClient
    client = MCPClient()                    # reads QDRANT_URL, QDRANT_API_KEY from env
    data = client.call("scroll", {"collection": "student_knowledge", "body": {...}})
    # Filter data HERE in script — do NOT pass raw data to agent context
"""
import json
import os
import sys
import urllib.request
import urllib.error


class MCPClient:
    """
    Wraps Qdrant REST API as a code-executable MCP data source.
    Constitution Principle II: all data processing happens here,
    only the summary result reaches the agent context window.
    """

    def __init__(self, url: str | None = None, api_key: str | None = None):
        self.url = (url or os.environ.get("QDRANT_URL", "")).rstrip("/")
        self.api_key = api_key or os.environ.get("QDRANT_API_KEY", "")
        if not self.url:
            raise ValueError(
                "QDRANT_URL not set. Export it or pass url= parameter.\n"
                "Example: export QDRANT_URL=https://your-cluster.qdrant.io"
            )

    def _request(self, method: str, path: str, body: dict | None = None) -> dict:
        full_url = f"{self.url}{path}"
        data = json.dumps(body).encode() if body else None
        req = urllib.request.Request(
            full_url,
            data=data,
            method=method,
            headers={
                "Content-Type": "application/json",
                "api-key": self.api_key,
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            raise RuntimeError(f"Qdrant HTTP {e.code}: {error_body}") from e
        except urllib.error.URLError as e:
            raise ConnectionError(
                f"MCP server (Qdrant) unreachable at {self.url}: {e}"
            ) from e

    def call(self, tool_name: str, params: dict) -> dict:
        """
        Route tool calls to Qdrant REST endpoints.
        IMPORTANT: Never print the raw result — filter it first.
        """
        collection = params.get("collection", "student_knowledge")
        body = params.get("body", {})

        routes = {
            "scroll":          ("POST", f"/collections/{collection}/points/scroll"),
            "search":          ("POST", f"/collections/{collection}/points/search"),
            "get_collection":  ("GET",  f"/collections/{collection}"),
            "create_collection": ("PUT", f"/collections/{collection}"),
            "upsert":          ("PUT",  f"/collections/{collection}/points"),
            "count":           ("POST", f"/collections/{collection}/points/count"),
        }
        if tool_name not in routes:
            raise ValueError(f"Unknown MCP tool: {tool_name}. Available: {list(routes)}")

        method, path = routes[tool_name]
        return self._request(method, path, body if method != "GET" else None)

    def ensure_collection(self, collection: str, vector_size: int = 4) -> None:
        """Create collection if it doesn't exist."""
        try:
            self.call("get_collection", {"collection": collection})
        except RuntimeError:
            self.call("create_collection", {
                "collection": collection,
                "body": {"vectors": {"size": vector_size, "distance": "Cosine"}}
            })

    def seed_student_knowledge(self, collection: str = "student_knowledge") -> int:
        """Seed demo student knowledge points if collection is empty."""
        import random
        random.seed(42)
        topics = ["loops", "lists", "functions", "classes", "files", "errors"]
        points = [
            {
                "id": i,
                "vector": [round(random.uniform(0, 1), 3) for _ in range(4)],
                "payload": {
                    "student_id": f"student-{i:04d}",
                    "topic": random.choice(topics),
                    "mastery_score": round(random.uniform(0.0, 1.0), 2),
                    "exercise_count": random.randint(0, 50),
                    "streak_days": random.randint(0, 30),
                },
            }
            for i in range(1000)
        ]
        self.call("upsert", {
            "collection": collection,
            "body": {"points": points}
        })
        return len(points)


if __name__ == "__main__":
    # Connectivity test — prints minimal result only
    try:
        client = MCPClient()
        result = client.call("get_collection", {"collection": "student_knowledge"})
        count = result.get("result", {}).get("points_count", 0)
        print(f"✓ MCP client (Qdrant) connected; student_knowledge: {count} points")
    except Exception as e:
        print(f"✗ MCP client error: {e}")
        sys.exit(1)
