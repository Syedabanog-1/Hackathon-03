#!/bin/bash
# apply_manifests.sh — Wraps kubectl apply for skill-driven manifest application
# Usage: ./apply_manifests.sh <manifest-dir-or-file>
# Constitution IV: No raw kubectl apply outside a skill script.

set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "✗ Usage: apply_manifests.sh <path-to-manifest-or-dir>"
  exit 1
fi

if [[ ! -e "$TARGET" ]]; then
  echo "✗ Path not found: $TARGET"
  exit 1
fi

kubectl apply -f "$TARGET"
EXIT=$?

if [[ $EXIT -eq 0 ]]; then
  echo "✓ Manifests applied: $TARGET"
else
  echo "✗ kubectl apply failed (exit $EXIT) for: $TARGET"
  exit $EXIT
fi
