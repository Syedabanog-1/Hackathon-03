import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function POST(req: NextRequest) {
  try {
    const res = await handler.POST(req);
    // Capture and expose Better Auth's own error body
    if (res.status >= 400) {
      const text = await res.text();
      console.error("[auth POST]", res.status, text);
      let msg = `Auth error ${res.status}`;
      try {
        const json = JSON.parse(text);
        msg = json.message || json.error || json.code || text || msg;
      } catch {
        msg = text || msg;
      }
      return NextResponse.json({ message: msg }, { status: res.status });
    }
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth POST throw]", msg);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    return await handler.GET(req);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
