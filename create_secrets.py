"""
create_secrets.py — Create K8s secrets for LearnFlow from environment variables.

Usage:
  export DATABASE_URL="postgres://..."
  export OPENAI_API_KEY="sk-..."
  export QDRANT_URL="https://..."
  export QDRANT_API_KEY="eyJ..."
  export BETTER_AUTH_SECRET="..."
  python create_secrets.py

NEVER hardcode secrets here — read from env or .env file.
"""
import os
import subprocess
import sys

required = ["DATABASE_URL", "OPENAI_API_KEY", "QDRANT_URL", "QDRANT_API_KEY", "BETTER_AUTH_SECRET"]
missing = [k for k in required if not os.environ.get(k)]
if missing:
    print(f"✗ Missing env vars: {', '.join(missing)}")
    print("  Export them or load from .env before running.")
    sys.exit(1)

cmd = [
    "kubectl", "create", "secret", "generic", "learnflow-secrets",
    "--namespace=learnflow",
    f"--from-literal=DATABASE_URL={os.environ['DATABASE_URL']}",
    f"--from-literal=OPENAI_API_KEY={os.environ['OPENAI_API_KEY']}",
    f"--from-literal=QDRANT_URL={os.environ['QDRANT_URL']}",
    f"--from-literal=QDRANT_API_KEY={os.environ['QDRANT_API_KEY']}",
    f"--from-literal=BETTER_AUTH_SECRET={os.environ['BETTER_AUTH_SECRET']}",
    "--dry-run=client", "-o", "yaml"
]
result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print("FAIL dry-run:", result.stderr)
    sys.exit(1)

apply = subprocess.run(["kubectl", "apply", "-f", "-"], input=result.stdout, capture_output=True, text=True)
print(apply.stdout or apply.stderr)
