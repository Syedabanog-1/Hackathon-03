#!/usr/bin/env python3
"""
postgres-k8s-setup: verify.py
MCP Code Execution Pattern: checks pod status + DB connectivity,
returns ONLY a minimal status line. Never dumps raw data to context.
"""
import subprocess
import json
import sys
import time
import os

NAMESPACE = "postgres"
PG_PORT = "5434"


def check_pod():
    result = subprocess.run(
        ["kubectl", "get", "pods", "-n", NAMESPACE, "-o", "json"],
        capture_output=True, text=True, timeout=15
    )
    if result.returncode != 0:
        return False

    # Process in script — never send raw JSON to context
    data = json.loads(result.stdout)
    pods = data.get("items", [])
    return any(
        p.get("status", {}).get("phase") == "Running"
        for p in pods
    )


def check_db():
    try:
        import psycopg2  # type: ignore
    except ImportError:
        return False, "psycopg2 not installed"

    pf = subprocess.Popen(
        ["kubectl", "port-forward", "svc/postgresql", f"{PG_PORT}:5432", "-n", NAMESPACE],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    time.sleep(2)

    try:
        conn = psycopg2.connect(
            host="127.0.0.1", port=int(PG_PORT),
            dbname="learnflow", user="learnflow",
            password=os.environ.get("POSTGRES_PASSWORD", "learnflow_secret"),
            connect_timeout=5
        )
        conn.close()
        return True, None
    except Exception as e:
        return False, str(e)
    finally:
        pf.terminate()


def main():
    pod_ok = check_pod()
    if not pod_ok:
        print(f"✗ No PostgreSQL pod Running in namespace {NAMESPACE}")
        sys.exit(1)

    db_ok, err = check_db()
    if db_ok:
        print("✓ PostgreSQL ready, DB reachable")
        sys.exit(0)
    else:
        print(f"✗ PostgreSQL pod Running but DB unreachable: {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
