import os
import re
import json
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dapr.clients import DaprClient
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Debug Service", version="1.0.0")

PUBSUB_NAME = os.getenv("PUBSUB_NAME", "pubsub")

ERROR_PATTERNS = {
    r"NameError: name '(.+)' is not defined": {
        "cause": "Variable or function '{0}' is used before it is defined.",
        "fix": "Ensure '{0}' is assigned before using it. Check for typos in the variable name.",
        "example": "# Wrong:\nprint(x)\n# Right:\nx = 10\nprint(x)",
    },
    r"TypeError: unsupported operand type\(s\) for (.+): '(.+)' and '(.+)'": {
        "cause": "You tried to perform a {0} operation between incompatible types: {1} and {2}.",
        "fix": "Convert types before the operation. Use int(), str(), or float() as appropriate.",
        "example": "# Wrong:\nresult = 'hello' + 5\n# Right:\nresult = 'hello' + str(5)",
    },
    r"IndexError: list index out of range": {
        "cause": "You accessed a list index that does not exist.",
        "fix": "Check list length with len() before accessing index. Use range(len(lst)) in loops.",
        "example": "lst = [1, 2, 3]\n# Wrong: lst[5]\n# Right: lst[2] or if 5 < len(lst): lst[5]",
    },
    r"KeyError: '?(.+)'?": {
        "cause": "The dictionary key '{0}' does not exist.",
        "fix": "Use dict.get(key, default) to safely access keys, or check 'key in dict' first.",
        "example": "d = {'a': 1}\n# Safe: d.get('b', 0)",
    },
    r"IndentationError": {
        "cause": "Python code has inconsistent or incorrect indentation.",
        "fix": "Use 4 spaces per indentation level consistently. Do not mix tabs and spaces.",
        "example": "def foo():\n    return 1  # 4 spaces",
    },
    r"ZeroDivisionError": {
        "cause": "Division by zero is not allowed.",
        "fix": "Check that the divisor is not zero before dividing.",
        "example": "if denominator != 0:\n    result = numerator / denominator",
    },
}


def diagnose_error(error_text: str, code: str) -> dict:
    for pattern, info in ERROR_PATTERNS.items():
        match = re.search(pattern, error_text)
        if match:
            groups = match.groups()
            cause = info["cause"].format(*groups) if groups else info["cause"]
            fix = info["fix"].format(*groups) if groups else info["fix"]
            return {"error_type": match.group(0).split(":")[0], "cause": cause, "fix": fix, "example": info["example"], "confidence": 0.90}
    return {
        "error_type": "UnknownError",
        "cause": "Could not automatically classify this error.",
        "fix": "Read the traceback carefully; check Stack Overflow or Python docs for the specific error message.",
        "example": "# Review the error message and line number",
        "confidence": 0.40,
    }


class DebugRequest(BaseModel):
    user_id: str
    code: str
    error: str
    language: str = "python"
    level: str = "beginner"
    context: dict = {}


class DebugResponse(BaseModel):
    user_id: str
    error_type: str
    cause: str
    fix: str
    corrected_code: str
    example: str
    confidence: float


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "debug-service"}


@app.post("/debug", response_model=DebugResponse)
async def debug_code(request: DebugRequest):
    logger.info(f"Debugging for user {request.user_id}: {request.error[:80]}")
    diagnosis = diagnose_error(request.error, request.code)
    response = DebugResponse(
        user_id=request.user_id,
        error_type=diagnosis["error_type"],
        cause=diagnosis["cause"],
        fix=diagnosis["fix"],
        corrected_code="# Corrected code would appear here with AI-assisted fix",
        example=diagnosis["example"],
        confidence=diagnosis["confidence"],
    )
    try:
        with DaprClient() as dapr:
            dapr.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name="learnflow.progress.update",
                data=json.dumps({"user_id": request.user_id, "action": "debug_session", "error_type": diagnosis["error_type"]}),
                data_content_type="application/json",
            )
    except Exception as exc:
        logger.warning(f"Progress publish failed: {exc}")
    return response


@app.post("/dapr/subscribe")
async def subscribe():
    return [
        {"pubsubname": "pubsub", "topic": "learnflow.debugging", "route": "/debug"}
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
