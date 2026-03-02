import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function POST(req: NextRequest) {
  try {
    return await handler.POST(req);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth] POST error:", msg);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    return await handler.GET(req);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth] GET error:", msg);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
