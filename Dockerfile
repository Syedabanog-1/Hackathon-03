FROM python:3.11-slim
WORKDIR /app
COPY learnflow-app/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY learnflow-app/api/ .
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
