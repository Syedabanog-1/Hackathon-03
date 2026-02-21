import os
import json
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dapr.clients import DaprClient
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Progress Service", version="1.0.0")

PUBSUB_NAME = os.getenv("PUBSUB_NAME", "pubsub")
STATE_STORE = os.getenv("STATE_STORE_NAME", "statestore")

USER_PROGRESS: dict[str, dict] = {}


class ProgressEvent(BaseModel):
    user_id: str
    action: str
    metadata: dict = {}


class ProgressResponse(BaseModel):
    user_id: str
    total_sessions: int
    concepts_viewed: int
    exercises_completed: int
    exercises_passed: int
    code_reviews: int
    debug_sessions: int
    streak_days: int
    level: str
    xp: int
    last_active: str


def get_or_create_progress(user_id: str) -> dict:
    if user_id not in USER_PROGRESS:
        USER_PROGRESS[user_id] = {
            "total_sessions": 0,
            "concepts_viewed": 0,
            "exercises_completed": 0,
            "exercises_passed": 0,
            "code_reviews": 0,
            "debug_sessions": 0,
            "streak_days": 0,
            "xp": 0,
            "last_active": datetime.utcnow().isoformat(),
        }
    return USER_PROGRESS[user_id]


def compute_level(xp: int) -> str:
    if xp < 100:
        return "beginner"
    elif xp < 500:
        return "intermediate"
    elif xp < 1500:
        return "advanced"
    else:
        return "expert"


def apply_action(progress: dict, action: str, metadata: dict) -> dict:
    progress["total_sessions"] += 1
    progress["last_active"] = datetime.utcnow().isoformat()
    if action == "concept_viewed":
        progress["concepts_viewed"] += 1
        progress["xp"] += 10
    elif action == "code_reviewed":
        progress["code_reviews"] += 1
        progress["xp"] += 15
    elif action == "debug_session":
        progress["debug_sessions"] += 1
        progress["xp"] += 20
    elif action == "exercise_submitted":
        progress["exercises_completed"] += 1
        progress["xp"] += 25
        if metadata.get("passed"):
            progress["exercises_passed"] += 1
            progress["xp"] += 25
    return progress


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "progress-service"}


@app.get("/progress/{user_id}", response_model=ProgressResponse)
async def get_progress(user_id: str):
    progress = get_or_create_progress(user_id)
    return ProgressResponse(
        user_id=user_id,
        total_sessions=progress["total_sessions"],
        concepts_viewed=progress["concepts_viewed"],
        exercises_completed=progress["exercises_completed"],
        exercises_passed=progress["exercises_passed"],
        code_reviews=progress["code_reviews"],
        debug_sessions=progress["debug_sessions"],
        streak_days=progress["streak_days"],
        level=compute_level(progress["xp"]),
        xp=progress["xp"],
        last_active=progress["last_active"],
    )


@app.post("/progress/event")
async def record_progress_event(event: ProgressEvent):
    logger.info(f"Progress event: user={event.user_id} action={event.action}")
    progress = get_or_create_progress(event.user_id)
    apply_action(progress, event.action, event.metadata)
    USER_PROGRESS[event.user_id] = progress
    return {"status": "recorded", "xp": progress["xp"], "level": compute_level(progress["xp"])}


@app.post("/dapr/subscribe")
async def subscribe():
    return [
        {"pubsubname": "pubsub", "topic": "learnflow.progress.update", "route": "/progress/event"}
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
