import { Pool } from "pg";
import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ status: "error", error: "DATABASE_URL not set" }, { status: 500 });
  }
  try {
    const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false }, max: 1 });
    const result = await pool.query('SELECT COUNT(*) FROM "user"');
    await pool.end();
    return NextResponse.json({
      status: "ok",
      db: "connected",
      users: result.rows[0].count,
      env: {
        DATABASE_URL: "set",
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "set" : "missing",
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "missing",
        NEXT_PUBLIC_KONG_URL: process.env.NEXT_PUBLIC_KONG_URL || "missing",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
