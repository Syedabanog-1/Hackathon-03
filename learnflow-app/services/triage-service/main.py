import os
import json
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dapr.clients import DaprClient
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Triage Service", version="1.0.0")

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
PUBSUB_NAME = os.getenv("PUBSUB_NAME", "kafka-pubsub")


class LearningRequest(BaseModel):
    user_id: str = "anonymous"
    query: str = ""
    message: str = ""   # frontend alias for query
    language: str = "python"
    level: str = "beginner"
    context: dict = {}
    intent: str = ""    # frontend hint (we classify ourselves)


class TriageResult(BaseModel):
    user_id: str
    intent: str
    routed_to: str
    confidence: float
    metadata: dict
    reply: str          # synchronous chat reply for frontend
    agent: str          # agent name label for frontend


def classify_intent(query: str) -> tuple[str, str, float]:
    query_lower = query.lower()
    if any(k in query_lower for k in ["explain", "what is", "how does", "concept", "understand"]):
        return "concept_explanation", "concepts-service", 0.92
    elif any(k in query_lower for k in ["review", "check my code", "improve", "feedback"]):
        return "code_review", "code-review-service", 0.88
    elif any(k in query_lower for k in ["debug", "error", "fix", "bug", "traceback"]):
        return "debugging", "debug-service", 0.90
    elif any(k in query_lower for k in ["exercise", "practice", "problem", "challenge"]):
        return "exercise", "exercise-service", 0.85
    elif any(k in query_lower for k in ["run", "execute", "output", "sandbox"]):
        return "code_execution", "code-sandbox-service", 0.87
    else:
        return "general", "concepts-service", 0.60


def generate_tutor_reply(intent: str, query: str) -> str:
    """Generate a synchronous reply for the frontend chat."""
    if intent == "concept_explanation":
        return (
            f"Great question about Python! I've routed your query to our Concepts Agent.\n\n"
            f"You asked: \"{query}\"\n\n"
            "Our Concepts Agent specialises in clear, example-driven explanations. "
            "With OpenAI configured, you'll get a full AI-powered explanation here. "
            "Try the Code Editor on the left to experiment with code examples!"
        )
    elif intent == "code_review":
        return (
            "I'd love to review your code! Paste your snippet in the Code Editor on the left "
            "and click Run. Our Code Review Agent checks PEP 8 style, complexity, and best practices. "
            "Share the code here too and I'll route it for a detailed review."
        )
    elif intent == "debugging":
        return (
            "Let's debug this together! Share your error message and code.\n\n"
            "Our Debug Agent can diagnose: NameError, TypeError, IndexError, KeyError, "
            "IndentationError, ZeroDivisionError — and many more common Python errors."
        )
    elif intent == "exercise":
        return (
            "Time to practice! Head to the Quiz tab for knowledge checks, or use the Code Editor "
            "for hands-on coding. Our Exercise Agent has beginner, intermediate, and advanced "
            "Python challenges matched to your skill level."
        )
    elif intent == "code_execution":
        return (
            "Use the Code Editor on the left to write and run Python! "
            "The secure sandbox runs your code with a 5-second timeout. "
            "Click the green Run button to execute — output appears below the editor."
        )
    else:
        return (
            "Hello! I'm your LearnFlow Python tutor. I can help you with:\n"
            "• **Concepts** — explain any Python topic clearly\n"
            "• **Debugging** — fix errors and tracebacks\n"
            "• **Code Review** — improve your code quality\n"
            "• **Exercises** — practice with guided challenges\n\n"
            "What would you like to learn today?"
        )


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "triage-service"}


@app.post("/triage", response_model=TriageResult)
async def triage_request(request: LearningRequest):
    effective_query = request.query or request.message or ""
    logger.info(f"Triaging request for user {request.user_id}: {effective_query[:80]}")
    intent, routed_to, confidence = classify_intent(effective_query)
    reply = generate_tutor_reply(intent, effective_query)
    agent = routed_to.replace("-service", "").title()
    result = TriageResult(
        user_id=request.user_id,
        intent=intent,
        routed_to=routed_to,
        confidence=confidence,
        metadata={"language": request.language, "level": request.level},
        reply=reply,
        agent=agent,
    )
    try:
        with DaprClient() as dapr:
            dapr.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name=f"learnflow.{intent}",
                data=json.dumps({
                    "user_id": request.user_id,
                    "query": effective_query,
                    "language": request.language,
                    "level": request.level,
                    "context": request.context,
                }),
                data_content_type="application/json",
            )
            logger.info(f"Published to topic learnflow.{intent}")
    except Exception as exc:
        logger.warning(f"Dapr publish failed (continuing): {exc}")
    return result


@app.post("/api/v1/tutor", response_model=TriageResult)
async def tutor_endpoint(request: LearningRequest):
    """Kong gateway route alias — delegates to /triage."""
    return await triage_request(request)


@app.post("/dapr/subscribe")
async def subscribe():
    return []


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
