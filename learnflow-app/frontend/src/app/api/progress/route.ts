import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { auth } from "@/lib/auth";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const MODULE_SLUGS = [
  "basics",
  "control-flow",
  "data-structures",
  "functions",
  "oop",
  "files",
  "error-handling",
  "libraries",
];

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS learnflow_progress (
      user_id TEXT NOT NULL,
      module_slug TEXT NOT NULL,
      quiz_score FLOAT NOT NULL DEFAULT 0,
      exercise_score FLOAT NOT NULL DEFAULT 0,
      code_score FLOAT NOT NULL DEFAULT 0,
      streak_days INT NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, module_slug)
    )
  `);
}

function computeMastery(row: { quiz_score: number; exercise_score: number; code_score: number; streak_days: number }) {
  const streakBonus = Math.min(row.streak_days * 10, 100);
  return Math.round(
    0.4 * row.exercise_score +
    0.3 * row.quiz_score +
    0.2 * row.code_score +
    0.1 * streakBonus
  );
}

function masteryLevel(pct: number) {
  if (pct >= 91) return "Mastered";
  if (pct >= 71) return "Proficient";
  if (pct >= 41) return "Learning";
  return "Beginner";
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id ?? "anonymous";

    await ensureTable();
    const { rows } = await pool.query(
      `SELECT module_slug, quiz_score, exercise_score, code_score, streak_days
       FROM learnflow_progress WHERE user_id = $1`,
      [userId]
    );

    const modules = MODULE_SLUGS.map((slug) => {
      const row = rows.find((r: { module_slug: string }) => r.module_slug === slug);
      if (!row) return { slug, percentage: 0, level: "Beginner" };
      const percentage = computeMastery(row);
      return { slug, percentage, level: masteryLevel(percentage) };
    });

    const streak = rows[0]?.streak_days ?? 0;
    return NextResponse.json({ modules, streak });
  } catch {
    return NextResponse.json({ modules: MODULE_SLUGS.map((slug) => ({ slug, percentage: 0, level: "Beginner" })), streak: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id ?? "anonymous";

    const { moduleSlug, quizScore, exerciseScore, codeScore } = await req.json();
    if (!moduleSlug) {
      return NextResponse.json({ error: "moduleSlug required" }, { status: 400 });
    }

    await ensureTable();
    await pool.query(
      `INSERT INTO learnflow_progress (user_id, module_slug, quiz_score, exercise_score, code_score, streak_days, updated_at)
       VALUES ($1, $2, COALESCE($3, 0), COALESCE($4, 0), COALESCE($5, 0), 1, NOW())
       ON CONFLICT (user_id, module_slug) DO UPDATE SET
         quiz_score     = CASE WHEN $3::float IS NOT NULL THEN $3 ELSE learnflow_progress.quiz_score END,
         exercise_score = CASE WHEN $4::float IS NOT NULL THEN $4 ELSE learnflow_progress.exercise_score END,
         code_score     = CASE WHEN $5::float IS NOT NULL THEN $5 ELSE learnflow_progress.code_score END,
         streak_days    = learnflow_progress.streak_days + 1,
         updated_at     = NOW()`,
      [userId, moduleSlug, quizScore ?? null, exerciseScore ?? null, codeScore ?? null]
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}
