---
sidebar_position: 2
---

# Microservices

All 7 services follow the same pattern: **FastAPI + Dapr sidecar + Kafka pub/sub**.

## Service Map

| Service | Port | Kafka Subscription | Purpose |
|---------|------|--------------------|---------|
| triage-service | 8001 | student-events | Routes queries to specialist agents |
| concepts-service | 8002 | tutor-requests | Explains Python concepts |
| debug-service | 8003 | tutor-requests | Parses errors, provides debugging hints |
| code-review-service | 8004 | tutor-requests | PEP 8 + code quality analysis |
| exercise-service | 8005 | exercise-requests | Generates and grades challenges |
| progress-service | 8006 | progress-updates | Tracks mastery, detects struggle |
| code-sandbox-service | 8007 | — | Safe Python execution (5s/50MB) |

## Common Endpoints

Each service exposes:

```
GET  /health              → {"status": "healthy", "service": "<name>"}
POST /dapr/subscribe      → Dapr subscription registration
POST /events/<topic>      → Dapr event handler
```

## Triage Routing Logic

```
student message intent
├── "explain" / "how" / "what" / "understand"  → Concepts
├── "error" / "debug" / "traceback" / "why"    → Debug
├── "review" / "check" / "fix" / "improve"     → Code Review
├── "quiz" / "exercise" / "practice" / "test"  → Exercise
└── "progress" / "score" / "mastery" / "level" → Progress
```

## Struggle Detection Triggers

Progress service fires `struggle-alerts` when:
- Same error type 3+ times
- Quiz score < 50%
- 5+ failed code executions in a row
- Student sends "I don't understand" or "I'm stuck"

## Code Sandbox Security

- Timeout: 5 seconds
- Memory: 50MB limit
- No file system access (except `/tmp`)
- No network access
- Standard library only (MVP)
