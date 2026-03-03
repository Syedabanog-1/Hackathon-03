import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS learnflow_alerts (
      id SERIAL PRIMARY KEY,
      student_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      trigger_type TEXT NOT NULL,
      resolved BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function GET() {
  try {
    await ensureTable();
    const { rows } = await pool.query(
      `SELECT student_id AS "studentId", topic, trigger_type AS "triggerType", created_at AS "timestamp"
       FROM learnflow_alerts WHERE resolved = FALSE ORDER BY created_at DESC LIMIT 50`
    );
    return NextResponse.json({ alerts: rows });
  } catch {
    return NextResponse.json({ alerts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { studentId, topic, triggerType } = await req.json();
    if (!studentId || !topic || !triggerType) {
      return NextResponse.json({ error: "studentId, topic, triggerType required" }, { status: 400 });
    }
    await ensureTable();
    await pool.query(
      `INSERT INTO learnflow_alerts (student_id, topic, trigger_type) VALUES ($1, $2, $3)`,
      [studentId, topic, triggerType]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save alert" }, { status: 500 });
  }
}
