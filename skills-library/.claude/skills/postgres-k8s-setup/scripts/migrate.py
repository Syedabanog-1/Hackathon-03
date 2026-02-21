#!/usr/bin/env python3
"""
postgres-k8s-setup: migrate.py
Run LearnFlow schema migrations.
- If DATABASE_URL env var is set: connect to Neon PostgreSQL directly
- Otherwise: port-forward to in-cluster PostgreSQL
"""
import subprocess
import os
import sys
import time
import pathlib

# Port-forward fallback config
PG_PORT = "5433"
NAMESPACE = "postgres"
RELEASE = "postgresql"

SQL_FILE = pathlib.Path(__file__).parent.parent.parent.parent.parent.parent / \
    "learnflow-app/infra/postgres/migrate.sql"

MIGRATIONS_INLINE = [
    """
    CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        image TEXT,
        role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        expires_at TIMESTAMPTZ NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip_address TEXT,
        user_agent TEXT,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        access_token TEXT,
        refresh_token TEXT,
        id_token TEXT,
        password TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        topic TEXT NOT NULL,
        module_number INTEGER NOT NULL DEFAULT 1,
        mastery_score DECIMAL(4,3) NOT NULL DEFAULT 0.000,
        exercise_score DECIMAL(4,3) NOT NULL DEFAULT 0.000,
        quiz_score DECIMAL(4,3) NOT NULL DEFAULT 0.000,
        code_quality_score DECIMAL(4,3) NOT NULL DEFAULT 0.000,
        streak_days INTEGER NOT NULL DEFAULT 0,
        last_activity TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(student_id, topic)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS code_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        code TEXT NOT NULL,
        output TEXT,
        error TEXT,
        execution_time_ms INTEGER,
        topic TEXT,
        success BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS struggle_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        trigger_type TEXT NOT NULL,
        topic TEXT,
        details JSONB,
        resolved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS dapr_state (
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        isbinary BOOLEAN NOT NULL DEFAULT FALSE,
        insertdate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updatedate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        etag TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
        PRIMARY KEY (key)
    );
    """,
]


def run_migrations():
    try:
        import psycopg2  # type: ignore
    except ImportError:
        print("✗ psycopg2 not installed. Run: pip install psycopg2-binary")
        sys.exit(1)

    database_url = os.environ.get("DATABASE_URL")
    pf = None

    if database_url:
        # Connect to Neon PostgreSQL directly via DATABASE_URL
        conn = psycopg2.connect(database_url)
    else:
        # Start port-forward for in-cluster PostgreSQL
        pf = subprocess.Popen(
            ["kubectl", "port-forward", f"svc/{RELEASE}", f"{PG_PORT}:5432",
             "-n", NAMESPACE],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        time.sleep(2)
        conn = psycopg2.connect(
            host="127.0.0.1",
            port=int(PG_PORT),
            dbname="learnflow",
            user="learnflow",
            password=os.environ.get("POSTGRES_PASSWORD", "learnflow_secret"),
        )

    try:
        conn.autocommit = True
        cur = conn.cursor()

        applied = 0
        for sql in MIGRATIONS_INLINE:
            cur.execute(sql.strip())
            applied += 1

        cur.close()
        conn.close()
        print(f"✓ Migrations applied: {applied} tables ready")

    except Exception as e:
        print(f"✗ Migration failed: {e}")
        sys.exit(1)
    finally:
        if pf:
            pf.terminate()


if __name__ == "__main__":
    run_migrations()
