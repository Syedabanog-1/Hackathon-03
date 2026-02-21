import os
import json
import ast
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dapr.clients import DaprClient
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=Code Review Service, version=1.0.0)

PUBSUB_NAME = os.getenv(PUBSUB_NAME, pubsub)


class CodeReviewRequest(BaseModel):
    user_id: str
    code: str
    language: str = python
    level: str = beginner
    context: dict = {}


class ReviewIssue(BaseModel):
    line: int
    severity: str
    message: str
    suggestion: str


class CodeReviewResponse(BaseModel):
    user_id: str
    overall_score: int
    issues: list[ReviewIssue]
    strengths: list[str]
    improvements: list[str]
    refactored_snippet: str


def analyze_python_code(code: str) -> dict:
    issues = []
    strengths = []
    improvements = []
    score = 100

    try:
        ast.parse(code)
        strengths.append(Code is syntactically valid Python)
    except SyntaxError as e:
        issues.append(ReviewIssue(line=e.lineno or 0, severity=error, message=fSyntax error: {e.msg}, suggestion=Fix the syntax error before proceeding))
        score -= 30

    lines = code.split(\n)
    for i, line in enumerate(lines, 1):
        if len(line) > 79:
            issues.append(ReviewIssue(line=i, severity=warning, message=fLine {i} exceeds 79 characters (PEP 8), suggestion=Break long lines for readability))
            score -= 2

    if def  in code:
        strengths.append(Code uses functions — good for reusability)
    else:
        improvements.append(Consider wrapping logic in functions for reusability)

    if # in code or '"""' in code:
        strengths.append(Code includes comments or docstrings)
    else:
        improvements.append(Add docstrings and comments to explain your code)

    if try in code and except in code:
        strengths.append(Error handling with try/except is present)
    else:
        improvements.append(Add try/except blocks for robust error handling)

    score = max(0, min(100, score))
    return {score: score, issues: issues, strengths: strengths, improvements: improvements}


@app.get(/health)
async def health():
    return {status: healthy, service: code-review-service}


@app.post(/review, response_model=CodeReviewResponse)
async def review_code(request: CodeReviewRequest):
    logger.info(fReviewing code for user {request.user_id}, language={request.language})
    if request.language == python:
        analysis = analyze_python_code(request.code)
    else:
        analysis = {score: 75, issues: [], strengths: [Code submitted], improvements: [fStatic analysis for {request.language} not yet available]}

    response = CodeReviewResponse(
        user_id=request.user_id,
        overall_score=analysis[score],
        issues=analysis[issues],
        strengths=analysis[strengths],
        improvements=analysis[improvements],
        refactored_snippet=# Refactored version would appear here with AI assistance,
    )
    try:
        with DaprClient() as dapr:
            dapr.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name=learnflow.progress.update,
                data=json.dumps({user_id: request.user_id, action: code_reviewed, score: analysis[score]}),
                data_content_type=application/json,
            )
    except Exception as exc:
        logger.warning(fProgress publish failed: {exc})
    return response


@app.post(/dapr/subscribe)
async def subscribe():
    return [
        {pubsubname: pubsub, topic: learnflow.code_review, route: /review}
    ]


if __name__ == __main__:
    import uvicorn
    uvicorn.run(app, host=0.0.0.0, port=8002)
