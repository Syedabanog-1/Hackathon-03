import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/editor", "/quiz", "/teacher"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  // better-auth v1.5.1 sets: better-auth.session_token (dot) or better-auth-session_token (hyphen)
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("better-auth-session_token") ||
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("__Host-better-auth.session_token");

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/quiz/:path*", "/teacher/:path*"],
};
