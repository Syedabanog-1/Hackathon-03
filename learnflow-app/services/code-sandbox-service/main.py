import os
import json
import uuid
import subprocess
import tempfile
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dapr.clients import DaprClient
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Code Sandbox Service", version="1.0.0")

PUBSUB_NAME = os.getenv("PUBSUB_NAME", "kafka-pubsub")
SANDBOX_TIMEOUT = int(os.getenv("SANDBOX_TIMEOUT_SECONDS", "10"))
MAX_OUTPUT_BYTES = int(os.getenv("MAX_OUTPUT_BYTES", "4096"))

ALLOWED_LANGUAGES = {"python": {"image": "python:3.11-slim", "cmd": ["python"], "ext": ".py"}}

FORBIDDEN_PATTERNS = [
    "import os", "import sys", "import subprocess", "__import__",
    "open(", "eval(", "exec(", "compile(", "globals(", "locals(",
    "__builtins__", "socket", "urllib", "requests", "http",
]


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
    output: str           # frontend alias for stdout
    error: str            # frontend alias for stderr
    exit_code: int
    execution_time_ms: int
    execution_time: int   # frontend alias for execution_time_ms
    success: bool
    sandbox_blocked: bool


def is_code_safe(code: str) -> tuple[bool, str]:
    for pattern in FORBIDDEN_PATTERNS:
        if pattern in code:
            return False, f"Forbidden pattern detected: '{pattern}'. System access is not allowed in the sandbox."
    return True, ""


def execute_python_safe(code: str, stdin: str) -> dict:
    import time
    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as f:
        f.write(code)
        tmp_path = f.name
    start = time.time()
    try:
        result = subprocess.run(
            ["python", tmp_path],
            input=stdin,
            capture_output=True,
            text=True,
            timeout=SANDBOX_TIMEOUT,
        )
        elapsed_ms = int((time.time() - start) * 1000)
        stdout = result.stdout[:MAX_OUTPUT_BYTES]
        stderr = result.stderr[:MAX_OUTPUT_BYTES]
        return {"stdout": stdout, "stderr": stderr, "exit_code": result.returncode, "execution_time_ms": elapsed_ms}
    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": f"Execution timed out after {SANDBOX_TIMEOUT} seconds.",
            "exit_code": -1,
            "execution_time_ms": SANDBOX_TIMEOUT * 1000,
        }
    except Exception as exc:
        return {"stdout": "", "stderr": str(exc), "exit_code": -1, "execution_time_ms": 0}
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "code-sandbox-service"}


@app.post("/execute", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest):
    exec_id = str(uuid.uuid4())[:8]
    logger.info(f"Execute [{exec_id}] user={request.user_id} lang={request.language}")

    if request.language not in ALLOWED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Language '{request.language}' not supported. Allowed: {list(ALLOWED_LANGUAGES.keys())}",
        )

    safe, reason = is_code_safe(request.code)
    if not safe:
        logger.warning(f"Sandbox blocked [{exec_id}]: {reason}")
        return ExecuteResponse(
            execution_id=exec_id,
            user_id=request.user_id,
            stdout="",
            stderr=reason,
            output="",
            error=reason,
            exit_code=-1,
            execution_time_ms=0,
            execution_time=0,
            success=False,
            sandbox_blocked=True,
        )

    result = execute_python_safe(request.code, request.stdin)
    success = result["exit_code"] == 0

    try:
        with DaprClient() as dapr:
            dapr.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name="learnflow.progress.update",
                data=json.dumps({"user_id": request.user_id, "action": "code_executed", "success": success}),
                data_content_type="application/json",
            )
    except Exception as exc:
        logger.warning(f"Progress publish failed: {exc}")

    return ExecuteResponse(
        execution_id=exec_id,
        user_id=request.user_id,
        stdout=result["stdout"],
        stderr=result["stderr"],
        output=result["stdout"],          # frontend reads this
        error=result["stderr"],           # frontend reads this
        exit_code=result["exit_code"],
        execution_time_ms=result["execution_time_ms"],
        execution_time=result["execution_time_ms"],   # frontend reads this
        success=success,
        sandbox_blocked=False,
    )


@app.post("/api/v1/execute", response_model=ExecuteResponse)
async def execute_endpoint(request: ExecuteRequest):
    """Kong gateway route alias — delegates to /execute."""
    return await execute_code(request)


@app.post("/dapr/subscribe")
async def subscribe():
    return [
        {"pubsubname": PUBSUB_NAME, "topic": "learnflow.code_execution", "route": "/execute"}
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
