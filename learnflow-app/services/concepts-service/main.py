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

app = FastAPI(title=Concepts Service, version=1.0.0)

PUBSUB_NAME = os.getenv(PUBSUB_NAME, pubsub)
OPENAI_API_KEY = os.getenv(OPENAI_API_KEY, )


class ConceptRequest(BaseModel):
    user_id: str
    query: str
    language: str = python
    level: str = beginner
    context: dict = {}


class ConceptResponse(BaseModel):
    user_id: str
    concept: str
    explanation: str
    examples: list[str]
    related_topics: list[str]
    difficulty: str


CONCEPT_DB = {
    list: {
        explanation: A list is an ordered, mutable collection of items in Python. Lists can hold items of different types and support indexing, slicing, and various built-in methods.,
        examples: [fruits = ['apple', 'banana', 'cherry'], numbers = [1, 2, 3, 4, 5], mixed = [1, 'hello', True, 3.14]],
        related: [tuple, dictionary, set, comprehension],
    },
    function: {
        explanation: A function is a reusable block of code that performs a specific task. Functions are defined with 'def', accept parameters, and can return values.,
        examples: [def greet(name):\n    return f'Hello, {name}!', def add(a, b):\n    return a + b],
        related: [lambda, decorator, recursion, closure],
    },
    class: {
        explanation: A class is a blueprint for creating objects. It encapsulates data (attributes) and behavior (methods) together, enabling object-oriented programming.,
        examples: [class Dog:\n    def __init__(self, name):\n        self.name = name],
        related: [inheritance, polymorphism, encapsulation, instance],
    },
}


def find_concept(query: str) -> dict:
    query_lower = query.lower()
    for key, data in CONCEPT_DB.items():
        if key in query_lower:
            return {concept: key, **data}
    return {
        concept: general,
        explanation: fExplanation for: {query}. This concept relates to programming fundamentals.,
        examples: [# Example code here],
        related: [variables, data types, control flow],
    }


@app.get(/health)
async def health():
    return {status: healthy, service: concepts-service}


@app.post(/explain, response_model=ConceptResponse)
async def explain_concept(request: ConceptRequest):
    logger.info(fExplaining concept for user {request.user_id}: {request.query[:80]})
    data = find_concept(request.query)
    response = ConceptResponse(
        user_id=request.user_id,
        concept=data[concept],
        explanation=data[explanation],
        examples=data[examples],
        related_topics=data[related],
        difficulty=request.level,
    )
    try:
        with DaprClient() as dapr:
            dapr.publish_event(
                pubsub_name=PUBSUB_NAME,
                topic_name=learnflow.progress.update,
                data=json.dumps({user_id: request.user_id, action: concept_viewed, concept: data[concept]}),
                data_content_type=application/json,
            )
    except Exception as exc:
        logger.warning(fProgress publish failed: {exc})
    return response


@app.post(/dapr/subscribe)
async def subscribe():
    return [
        {pubsubname: pubsub, topic: learnflow.concept_explanation, route: /explain}
    ]


if __name__ == __main__:
    import uvicorn
    uvicorn.run(app, host=0.0.0.0, port=8001)
