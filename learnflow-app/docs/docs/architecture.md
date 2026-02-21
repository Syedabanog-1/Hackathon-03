---
sidebar_position: 2
---

# Architecture

## Overview

```
┌─────────────────────────────────────────────────────┐
│                  KUBERNETES CLUSTER                  │
│                                                      │
│  ┌──────────┐    ┌─────────────────────────────┐    │
│  │ Next.js  │───▶│      Kong API Gateway        │    │
│  │ Frontend │    └──────────────┬──────────────┘    │
│  └──────────┘                   │                    │
│                    ┌────────────▼────────────┐       │
│                    │    Triage Service        │       │
│                    │    (FastAPI + Dapr)      │       │
│                    └────────────┬────────────┘       │
│                 ┌───────────────┼──────────────┐     │
│          ┌──────▼──┐  ┌────────▼──┐  ┌────────▼─┐  │
│          │Concepts │  │  Debug    │  │ Exercise │  │
│          │ Service │  │  Service  │  │  Service │  │
│          └─────────┘  └───────────┘  └──────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              Apache Kafka                     │   │
│  │  student-events │ tutor-requests │ progress   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │   PostgreSQL     │  │      Docusaurus Docs      │ │
│  │   (Neon DB)      │  │      (Port 30090)         │ │
│  └──────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| AI Agents | Claude Code, Goose | Execute skills to build the app |
| Frontend | Next.js 14 + Monaco | Student/Teacher UI with code editor |
| Auth | Better Auth | Email/password, role-based (student/teacher) |
| API Gateway | Kong | JWT auth, routing to microservices |
| Services | FastAPI + Dapr | 7 AI tutoring microservices |
| Messaging | Apache Kafka | Event-driven async communication |
| State | Neon PostgreSQL | User data, progress, code submissions |
| Vector DB | Qdrant | Student knowledge vectors (MCP source) |
| Orchestration | Kubernetes (Minikube) | Container orchestration |
| Docs | Docusaurus | This site |

## Kafka Topics

| Topic | Publisher | Subscribers |
|-------|-----------|-------------|
| `student-events` | Frontend/Triage | Triage, Progress |
| `tutor-requests` | Triage | Concepts, Debug |
| `tutor-responses` | All agents | Frontend via Triage |
| `progress-updates` | Progress | Dashboard |
| `struggle-alerts` | Progress | Teacher dashboard |
| `exercise-requests` | Exercise | Frontend |

## AI Agent Routing

```
Student message → Triage Agent
├── "explain" / "how" / "what" → Concepts Agent
├── "error" / "debug" / "why" → Debug Agent
├── "review" / "check" / "fix" → Code Review Agent
├── "quiz" / "exercise" / "practice" → Exercise Agent
└── "progress" / "score" / "mastery" → Progress Agent
```

## Dapr Sidecars

Each microservice uses Dapr for:
- **Pub/Sub**: Kafka topic subscriptions
- **State**: PostgreSQL state store via `learnflow-state` component
- **Service invocation**: Direct service-to-service calls
