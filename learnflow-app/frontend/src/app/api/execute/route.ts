import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code?.trim()) {
    return NextResponse.json({ output: "(no output)", error: "No code provided" });
  }

  try {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [{ content: code }],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Execution service unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const stdout = data.run?.stdout ?? "";
    const stderr = data.run?.stderr ?? "";
    const exitCode = data.run?.code ?? 0;

    return NextResponse.json({
      output: stdout || (exitCode !== 0 ? stderr : "(no output)"),
      error: exitCode !== 0 ? stderr : undefined,
      execution_time: data.run?.wall_time,
    });
  } catch {
    return NextResponse.json({ error: "Execution timed out or failed" }, { status: 502 });
  }
}
