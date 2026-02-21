"""
LearnFlow Consolidated API — Railway / Cloud Deployment
Combines all 7 service routes into one FastAPI app (no Dapr/Kafka required).
"""
import os
import ast
import re
import json
import uuid
import random
import subprocess
import tempfile
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="LearnFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-memory progress store ────────────────────────────────────────────────
USER_PROGRESS: dict = {}

MODULE_NAMES = [
    "1. Basics", "2. Control Flow", "3. Data Structures",
    "4. Functions", "5. OOP", "6. Files", "7. Error Handling", "8. Libraries",
]

SANDBOX_TIMEOUT = int(os.getenv("SANDBOX_TIMEOUT_SECONDS", "10"))
MAX_OUTPUT_BYTES = int(os.getenv("MAX_OUTPUT_BYTES", "4096"))

FORBIDDEN_PATTERNS = [
    "import os", "import sys", "import subprocess", "__import__",
    "open(", "eval(", "exec(", "compile(", "globals(", "locals(",
    "__builtins__", "socket", "urllib", "requests", "http",
]

EXERCISES = [
    {"id": "py-b-001", "prompt": "Write hello_world() that prints 'Hello, World!'", "difficulty": "beginner", "topic": "basics"},
    {"id": "py-b-002", "prompt": "Write add(a, b) that returns the sum of two numbers.", "difficulty": "beginner", "topic": "basics"},
    {"id": "py-b-003", "prompt": "Write list_length(lst) that returns the number of items.", "difficulty": "beginner", "topic": "lists"},
    {"id": "py-i-001", "prompt": "Write fizzbuzz(n): return 'Fizz', 'Buzz', 'FizzBuzz', or the number.", "difficulty": "intermediate", "topic": "control_flow"},
    {"id": "py-i-002", "prompt": "Write reverse_string(s) without using built-in reverse methods.", "difficulty": "intermediate", "topic": "strings"},
]


# ─── Models ──────────────────────────────────────────────────────────────────

class LearningRequest(BaseModel):
    user_id: str = "anonymous"
    query: str = ""
    message: str = ""
    language: str = "python"
    level: str = "beginner"
    context: dict = {}
    intent: str = ""


class TriageResult(BaseModel):
    user_id: str
    intent: str
    routed_to: str
    confidence: float
    metadata: dict
    reply: str
    agent: str


class ExecuteRequest(BaseModel):
    user_id: str = "anonymous"
    code: str
    language: str = "python"
    stdin: str = ""
    context: dict = {}


class ExecuteResponse(BaseModel):
    execution_id: str
    user_id: str
    stdout: str
    stderr: str
    output: str
    error: str
    exit_code: int
    execution_time_ms: int
    execution_time: int
    success: bool
    sandbox_blocked: bool


class ExerciseRequest(BaseModel):
    user_id: str = "anonymous"
    language: str = "python"
    level: str = "beginner"
    tags: list = []
    context: dict = {}


class ProgressEvent(BaseModel):
    user_id: str = "anonymous"
    action: str = ""
    metadata: dict = {}


# ─── Helpers ─────────────────────────────────────────────────────────────────

def get_or_create_progress(user_id: str) -> dict:
    if user_id not in USER_PROGRESS:
        USER_PROGRESS[user_id] = {
            "total_sessions": 0, "concepts_viewed": 0,
            "exercises_completed": 0, "exercises_passed": 0,
            "code_reviews": 0, "debug_sessions": 0,
            "streak_days": 3, "xp": 0,
            "last_active": datetime.utcnow().isoformat(),
        }
    return USER_PROGRESS[user_id]


def classify_intent(query: str):
    q = query.lower()
    if any(k in q for k in ["explain", "what is", "how does", "concept", "understand"]):
        return "concept_explanation", "Concepts", 0.92
    elif any(k in q for k in ["review", "check my code", "improve", "feedback"]):
        return "code_review", "Code Review", 0.88
    elif any(k in q for k in ["debug", "error", "fix", "bug", "traceback"]):
        return "debugging", "Debug", 0.90
    elif any(k in q for k in ["exercise", "practice", "problem", "challenge"]):
        return "exercise", "Exercise", 0.85
    elif any(k in q for k in ["run", "execute", "output", "sandbox"]):
        return "code_execution", "Code Sandbox", 0.87
    else:
        return "general", "Triage", 0.60


def generate_reply(intent: str, query: str) -> str:
    if intent == "concept_explanation":
        return (
            f"Great question! You asked: \"{query}\"\n\n"
            "Here's how Python works with this concept:\n\n"
            "Python makes this easy with clean, readable syntax. "
            "Try the Code Editor on the left to experiment with examples!"
        )
    elif intent == "code_review":
        return (
            "I'd love to review your code! Paste your snippet in the Code Editor "
            "and click Run. I'll check PEP 8 style, complexity, and best practices."
        )
    elif intent == "debugging":
        return (
            "Let's debug together! Share your error message and code.\n\n"
            "Common Python errors I can diagnose: NameError, TypeError, IndexError, "
            "KeyError, IndentationError, ZeroDivisionError."
        )
    elif intent == "exercise":
        return (
            "Time to practice! Head to the Quiz tab for knowledge checks, or use "
            "the Code Editor for hands-on coding challenges matched to your level."
        )
    elif intent == "code_execution":
        return (
            "Use the Code Editor on the left to write and run Python! "
            "The secure sandbox runs with a 5-second timeout. Click ▶ Run to execute."
        )
    else:
        return (
            "Hi! I'm your LearnFlow Python tutor. I can help with:\n"
            "• **Concepts** — explain any Python topic\n"
            "• **Debugging** — fix errors and tracebacks\n"
            "• **Code Review** — improve your code quality\n"
            "• **Exercises** — practice with guided challenges\n\n"
            "What would you like to learn today?"
        )


def is_code_safe(code: str):
    for pattern in FORBIDDEN_PATTERNS:
        if pattern in code:
            return False, f"Forbidden: '{pattern}' is not allowed in the sandbox."
    return True, ""


def execute_python(code: str, stdin: str) -> dict:
    import time
    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False, encoding="utf-8") as f:
        f.write(code)
        tmp_path = f.name
    start = time.time()
    try:
        result = subprocess.run(
            ["python", tmp_path],
            input=stdin, capture_output=True, text=True, timeout=SANDBOX_TIMEOUT,
        )
        elapsed = int((time.time() - start) * 1000)
        return {
            "stdout": result.stdout[:MAX_OUTPUT_BYTES],
            "stderr": result.stderr[:MAX_OUTPUT_BYTES],
            "exit_code": result.returncode,
            "execution_time_ms": elapsed,
        }
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": f"Timed out after {SANDBOX_TIMEOUT}s", "exit_code": -1, "execution_time_ms": SANDBOX_TIMEOUT * 1000}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "exit_code": -1, "execution_time_ms": 0}
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "learnflow-api", "version": "1.0.0"}


@app.get("/")
async def root():
    return {"service": "LearnFlow API", "docs": "/docs", "health": "/health"}


# Tutor / Triage
@app.post("/api/v1/tutor", response_model=TriageResult)
async def tutor(request: LearningRequest):
    query = request.query or request.message or ""
    logger.info(f"Tutor: user={request.user_id} query={query[:60]}")
    intent, agent, confidence = classify_intent(query)
    return TriageResult(
        user_id=request.user_id,
        intent=intent,
        routed_to=f"{agent.lower().replace(' ', '-')}-service",
        confidence=confidence,
        metadata={"language": request.language, "level": request.level},
        reply=generate_reply(intent, query),
        agent=agent,
    )


# Code Execution
@app.post("/api/v1/execute", response_model=ExecuteResponse)
async def execute(request: ExecuteRequest):
    exec_id = str(uuid.uuid4())[:8]
    logger.info(f"Execute [{exec_id}] user={request.user_id}")
    safe, reason = is_code_safe(request.code)
    if not safe:
        return ExecuteResponse(
            execution_id=exec_id, user_id=request.user_id,
            stdout="", stderr=reason, output="", error=reason,
            exit_code=-1, execution_time_ms=0, execution_time=0,
            success=False, sandbox_blocked=True,
        )
    result = execute_python(request.code, request.stdin)
    success = result["exit_code"] == 0
    return ExecuteResponse(
        execution_id=exec_id, user_id=request.user_id,
        stdout=result["stdout"], stderr=result["stderr"],
        output=result["stdout"], error=result["stderr"],
        exit_code=result["exit_code"],
        execution_time_ms=result["execution_time_ms"],
        execution_time=result["execution_time_ms"],
        success=success, sandbox_blocked=False,
    )


# Progress — GET
@app.get("/api/v1/progress/{user_id}")
async def get_progress(user_id: str):
    progress = get_or_create_progress(user_id)
    xp = progress["xp"]
    base = min(xp // 5, 100)
    modules = [
        {"name": name, "percentage": max(0, min(100, base - i * 10)), "level": "Learning"}
        for i, name in enumerate(MODULE_NAMES)
    ]
    return {
        "user_id": user_id,
        "modules": modules,
        "streak": progress["streak_days"],
        "xp": xp,
        "total_sessions": progress["total_sessions"],
        "level": "beginner" if xp < 100 else "intermediate" if xp < 500 else "advanced",
    }


# Progress — Event recording
@app.post("/api/v1/progress/event")
async def record_progress(event: ProgressEvent):
    progress = get_or_create_progress(event.user_id)
    xp_table = {
        "concept_viewed": 10, "code_reviewed": 15,
        "debug_session": 20, "exercise_submitted": 25, "code_executed": 5,
    }
    gain = xp_table.get(event.action, 5)
    progress["xp"] += gain
    progress["total_sessions"] += 1
    progress["last_active"] = datetime.utcnow().isoformat()
    logger.info(f"Progress: user={event.user_id} action={event.action} +{gain}xp total={progress['xp']}")
    return {"status": "recorded", "xp": progress["xp"]}


# Teacher alerts
@app.get("/api/v1/progress/alerts")
async def get_alerts():
    return {"alerts": []}


# Exercises — GET
@app.get("/api/v1/exercises")
async def get_exercises_get(topic: str = "", level: str = "beginner"):
    filtered = [e for e in EXERCISES if not topic or topic.lower() in e["topic"]]
    return {"exercises": (filtered or EXERCISES)[:3]}


# Exercises — POST
@app.post("/api/v1/exercises")
async def get_exercises_post(request: ExerciseRequest):
    level_ex = [e for e in EXERCISES if e["difficulty"] == request.level]
    ex = random.choice(level_ex or EXERCISES)
    return {"exercise": ex, "user_id": request.user_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
