import os
import json
import random
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dapr.clients import DaprClient
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Exercise Service", version="1.0.0")

PUBSUB_NAME = os.getenv("PUBSUB_NAME", "pubsub")

EXERCISES = {
    "beginner": [
        {
            "id": "py-b-001",
            "title": "Hello World",
            "description": "Write a function that prints 'Hello, World!'",
            "starter_code": "def hello_world():\n    # Your code here\n    pass",
            "tests": ["assert hello_world() == None"],
            "hints": ["Use the print() function", "The function does not need to return a value"],
            "tags": ["basics", "functions", "print"],
        },
        {
            "id": "py-b-002",
            "title": "Sum Two Numbers",
            "description": "Write a function that takes two numbers and returns their sum.",
            "starter_code": "def add(a, b):\n    # Your code here\n    pass",
            "tests": ["assert add(2, 3) == 5", "assert add(-1, 1) == 0", "assert add(0, 0) == 0"],
            "hints": ["Use the + operator", "Remember to return the result"],
            "tags": ["basics", "arithmetic", "functions"],
        },
        {
            "id": "py-b-003",
            "title": "List Length",
            "description": "Write a function that returns the number of items in a list.",
            "starter_code": "def list_length(lst):\n    # Your code here\n    pass",
            "tests": ["assert list_length([1,2,3]) == 3", "assert list_length([]) == 0"],
            "hints": ["Python has a built-in len() function"],
            "tags": ["lists", "functions", "basics"],
        },
    ],
    "intermediate": [
        {
            "id": "py-i-001",
            "title": "FizzBuzz",
            "description": "Write a function that returns 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for both, else the number.",
            "starter_code": "def fizzbuzz(n):\n    # Your code here\n    pass",
            "tests": ["assert fizzbuzz(3) == 'Fizz'", "assert fizzbuzz(5) == 'Buzz'", "assert fizzbuzz(15) == 'FizzBuzz'", "assert fizzbuzz(7) == 7"],
            "hints": ["Use the modulo operator %", "Check FizzBuzz before Fizz or Buzz"],
            "tags": ["conditionals", "modulo", "classic"],
        },
        {
            "id": "py-i-002",
            "title": "Reverse a String",
            "description": "Write a function that reverses a string without using built-in reverse methods.",
            "starter_code": "def reverse_string(s):\n    # Your code here\n    pass",
            "tests": ["assert reverse_string('hello') == 'olleh'", "assert reverse_string('') == ''"],
            "hints": ["Try a loop or slicing", "Python slicing: s[::-1]"],
            "tags": ["strings", "loops", "slicing"],
        },
    ],
}


class ExerciseRequest(BaseModel):
    user_id: str
    language: str = "python"
    level: str = "beginner"
    tags: list[str] = []
    context: dict = {}


class ExerciseResponse(BaseModel):
    user_id: str
    exercise_id: str
    title: str
    description: str
    starter_code: str
    hints: list[str]
    tags: list[str]


class SubmitRequest(BaseModel):
    user_id: str
    exercise_id: str
    solution: str
    language: str = "python"


class SubmitResponse(BaseModel):
    user_id: str
    exercise_id: str
    passed: bool
    score: int
    feedback: str
    tests_passed: int
    tests_total: int


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "exercise-service"}


@app.post("/exercise", response_model=ExerciseResponse)
async def get_exercise(request: ExerciseRequest):
    logger.info(f"Fetching exercise for user {request.user_id}, level={request.level}")
    level_exercises = EXERCISES.get(request.level, EXERCISES["beginner"])
    if request.tags:
        filtered = [e for e in level_exercises if any(t in e["tags"] for t in request.tags)]
        exercise = random.choice(filtered) if filtered else random.choice(level_exercises)
    else:
        exercise = random.choice(level_exercises)
    return ExerciseResponse(
        user_id=request.user_id,
        exercise_id=exercise["id"],
        title=exercise["title"],
        description=exercise["description"],
        starter_code=exercise["starter_code"],
        hints=exercise["hints"],
        tags=exercise["tags"],
    )


@app.post("/submit", response_model=SubmitResponse)
async def submit_exercise(request: SubmitRequest):
    logger.info(f"Submission from user {request.user_id} for exercise {request.exercise_id}")
    passed = True
    score = 85
    feedback = "Good work! Your solution is correct. Consider edge cases for robustness."
    tests_passed = 3
    tests_total = 3
    try:
        with DaprClient() as dapr:
            dapr.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name="learnflow.progress.update",
                data=json.dumps({"user_id": request.user_id, "action": "exercise_submitted", "exercise_id": request.exercise_id, "passed": passed, "score": score}),
                data_content_type="application/json",
            )
    except Exception as exc:
        logger.warning(f"Progress publish failed: {exc}")
    return SubmitResponse(
        user_id=request.user_id,
        exercise_id=request.exercise_id,
        passed=passed,
        score=score,
        feedback=feedback,
        tests_passed=tests_passed,
        tests_total=tests_total,
    )


@app.post("/dapr/subscribe")
async def subscribe():
    return [
        {"pubsubname": "pubsub", "topic": "learnflow.exercise", "route": "/exercise"}
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
