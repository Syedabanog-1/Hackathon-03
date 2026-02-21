# Skill Development Guide

## The Golden Rule

```
SKILL.md = instructions (≤ 150 tokens)
scripts/ = all execution (0 tokens)
output   = minimal summary (≤ 30 tokens)
```

Never put logic in SKILL.md. Never dump data to agent context.

## Skill Structure

```
.claude/skills/<skill-name>/
├── SKILL.md        ← YAML frontmatter + minimal instructions
├── REFERENCE.md    ← Deep docs (loaded on-demand, not at startup)
└── scripts/
    ├── deploy.sh   ← Infrastructure commands
    ├── verify.py   ← Status check, returns minimal output
    └── *.py / *.sh ← Any supporting scripts
```

## SKILL.md Template

```yaml
---
name: skill-name
description: One-line description for agent discovery
tools: [computer, bash]
allowed-tools: [computer, bash]
---

# skill-name

## When to Use
- Bullet point trigger 1
- Bullet point trigger 2

## Instructions

1. Run: `command step 1`
2. Run: `command step 2`
3. Confirm ✓ in output.

## Validation
- [ ] "✓ Expected output" appears
- [ ] Output is ≤ 3 lines
```

## The Verify Script Pattern

```python
#!/usr/bin/env python3
"""Always use this pattern for verification scripts."""
import subprocess, json, sys

def main():
    # 1. Fetch full data via subprocess (stays in script)
    result = subprocess.run(["kubectl", "get", "...", "-o", "json"],
                           capture_output=True, text=True)

    # 2. Process data IN THE SCRIPT (never dump to stdout)
    data = json.loads(result.stdout)
    items = data.get("items", [])
    running = sum(1 for item in items if is_running(item))

    # 3. Return ONLY the summary (this is what agent sees)
    if running == len(items):
        print(f"✓ All {len(items)} pods running")
    else:
        print(f"✗ {running}/{len(items)} pods running")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

## Anti-Patterns to Avoid

```python
# ❌ WRONG: Raw JSON in context
result = subprocess.run(["kubectl", ...])
print(result.stdout)  # ← dumps thousands of tokens to context

# ✅ CORRECT: Process and summarize
data = json.loads(result.stdout)
print(f"✓ {count_running(data)} pods running")  # ← ~5 tokens
```

## Token Budget

| Component | Token Budget |
|-----------|-------------|
| SKILL.md total | ≤ 150 tokens |
| REFERENCE.md | 0 (on-demand) |
| scripts/ | 0 (executed) |
| Success output | ≤ 30 tokens |
| Error output | ≤ 50 tokens |

## Cross-Agent Testing Checklist

Before marking a skill complete:
- [ ] `claude "prompt using skill-name skill"` → ✓
- [ ] `goose "prompt using skill-name skill"` → identical ✓
- [ ] Token count in SKILL.md ≤ 150
- [ ] Skill is idempotent (second run safe)
- [ ] Error messages are actionable (not generic)
