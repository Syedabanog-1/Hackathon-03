#!/usr/bin/env python3
"""
kafka-k8s-setup: verify.py
MCP Code Execution Pattern: fetches full pod JSON via kubectl,
processes it in script, returns ONLY a minimal status line.
Never dumps raw JSON into agent context.
"""
import subprocess
import json
import sys

NAMESPACE = "kafka"


def get_pods_status():
    result = subprocess.run(
        ["kubectl", "get", "pods", "-n", NAMESPACE, "-o", "json"],
        capture_output=True, text=True, timeout=15
    )
    if result.returncode != 0:
        return 0, 0, result.stderr.strip()

    # Process data in script — never send raw JSON to context
    data = json.loads(result.stdout)
    pods = data.get("items", [])
    total = len(pods)
    running = sum(
        1 for p in pods
        if p.get("status", {}).get("phase") == "Running"
    )
    return running, total, None


def main():
    running, total, error = get_pods_status()

    if error:
        print(f"✗ Error checking Kafka pods: {error}")
        sys.exit(1)

    if total == 0:
        print(f"✗ No Kafka pods found in namespace {NAMESPACE}")
        sys.exit(1)

    if running == total:
        print(f"✓ All {total} Kafka pods running")
        sys.exit(0)
    else:
        print(f"✗ {running}/{total} Kafka pods running — check: kubectl get pods -n {NAMESPACE}")
        sys.exit(1)


if __name__ == "__main__":
    main()
