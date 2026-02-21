-- LearnFlow PostgreSQL Schema Migration
-- Run via: postgres-k8s-setup skill (scripts/migrate.py)

-- Better Auth tables
CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP WITH TIME ZONE,
    refresh_token_expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "verification" (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LearnFlow application tables
CREATE TABLE IF NOT EXISTS progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    module_number INTEGER NOT NULL CHECK (module_number BETWEEN 1 AND 8),
    mastery_score DECIMAL(4,3) NOT NULL DEFAULT 0.000 CHECK (mastery_score BETWEEN 0 AND 1),
    exercise_score DECIMAL(4,3) NOT NULL DEFAULT 0.000,
    quiz_score DECIMAL(4,3) NOT NULL DEFAULT 0.000,
    code_quality_score DECIMAL(4,3) NOT NULL DEFAULT 0.000,
    streak_days INTEGER NOT NULL DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, topic)
);

CREATE TABLE IF NOT EXISTS code_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    output TEXT,
    error TEXT,
    execution_time_ms INTEGER,
    topic TEXT,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS struggle_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('repeated_error', 'stuck_exercise', 'low_quiz', 'help_request', 'failed_executions')),
    topic TEXT,
    details JSONB,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Dapr state store table
CREATE TABLE IF NOT EXISTS dapr_state (
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    isbinary BOOLEAN NOT NULL DEFAULT FALSE,
    insertdate TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedate TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    etag TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    PRIMARY KEY (key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_progress_student ON progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_topic ON progress(topic);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON code_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_struggle_student ON struggle_events(student_id);
CREATE INDEX IF NOT EXISTS idx_struggle_resolved ON struggle_events(resolved) WHERE resolved = FALSE;
