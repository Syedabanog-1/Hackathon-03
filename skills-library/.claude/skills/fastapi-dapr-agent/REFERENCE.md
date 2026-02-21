# FastAPI + Dapr Agent — Reference

> Loaded on-demand only.

## Dapr Annotations (K8s Deployment)

```yaml
annotations:
  dapr.io/enabled: "true"
  dapr.io/app-id: "SERVICE_NAME"
  dapr.io/app-port: "8000"
  dapr.io/log-level: "info"
```

## Dapr Pub/Sub Component

```yaml
# dapr-components/kafka-pubsub.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka.kafka.svc.cluster.local:9092"
  - name: consumerGroup
    value: "learnflow"
```

## Service Message Contract

```json
// student-events topic message
{
  "studentId": "uuid",
  "sessionId": "uuid",
  "intent": "explain|error|exercise|review|progress",
  "content": "user message text",
  "codeSnippet": "optional Python code",
  "timestamp": "ISO8601"
}
```

## Agent Routing (Triage)

| intent | Routes to |
|--------|-----------|
| explain | concepts-service |
| error | debug-service |
| exercise | exercise-service |
| review | code-review-service |
| progress | progress-service |

## FastAPI Health Endpoint

All services MUST expose:
```python
@app.get("/health")
async def health():
    return {"status": "ok", "service": SERVICE_NAME}
```
