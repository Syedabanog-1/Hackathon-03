import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://user:pass@localhost/db",
  ssl: { rejectUnauthorized: false },
  max: 1,
});

// ---------------------------------------------------------------------------
// resolveBaseURL
//
// Better Auth REQUIRES that `baseURL` exactly matches the origin of every
// incoming auth request. A mismatch is the *only* cause of "invalid origin".
//
// Priority chain (first non-empty value wins):
//   1. BETTER_AUTH_URL        — set this in Netlify / Vercel env dashboard
//   2. NEXT_PUBLIC_APP_URL    — public Next.js env, also set in dashboard
//   3. VERCEL_URL             — auto-injected by Vercel (server-side only)
//   4. http://localhost:3000  — local dev fallback
//
// Trailing slashes are always stripped for consistent comparison.
// ---------------------------------------------------------------------------
function resolveBaseURL(): string {
  // Explicit env vars take top priority
  if (process.env.BETTER_AUTH_URL?.trim()) {
    return process.env.BETTER_AUTH_URL.trim().replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_APP_URL?.trim()) {
    return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "");
  }

  // VERCEL_URL is auto-set by Vercel for every deployment (incl. previews).
  // It does NOT include the https:// prefix — we add it here.
  if (process.env.VERCEL_URL?.trim()) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }

  return "http://localhost:3000";
}

const baseURL = resolveBaseURL();

// ---------------------------------------------------------------------------
// buildTrustedOrigins
//
// Every URL that could send auth requests must be listed here.
// Better Auth checks the incoming `Origin` header against this list.
// ---------------------------------------------------------------------------
function buildTrustedOrigins(): string[] {
  const origins = new Set<string>([
    // ── Netlify ──────────────────────────────────────────────────────────────
    "https://hack03.netlify.app",

    // ── Vercel (all known deployment slugs) ──────────────────────────────────
    "https://learnflow-app.vercel.app",
    "https://learnflow-app-two.vercel.app",
    "https://hackathon-03-sandy.vercel.app",
    "https://hackathon-03-mauve.vercel.app",
    "https://hackathon-03-git-main-syedabanog-1.vercel.app",
    // Vercel auto-generates preview URLs — cover the common pattern:
    "https://hackathon-03.vercel.app",

    // ── Local dev ────────────────────────────────────────────────────────────
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    // ── Always include whatever baseURL resolves to ───────────────────────────
    baseURL,
  ]);

  // Env-var driven origins — these let you add a new deployment URL
  // without touching code. Set them in your deployment dashboard.

  if (process.env.BETTER_AUTH_URL?.trim()) {
    origins.add(process.env.BETTER_AUTH_URL.trim().replace(/\/$/, ""));
  }

  if (process.env.NEXT_PUBLIC_APP_URL?.trim()) {
    origins.add(process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, ""));
  }

  // VERCEL_URL — auto-injected per-deployment (no protocol)
  if (process.env.VERCEL_URL?.trim()) {
    origins.add(`https://${process.env.VERCEL_URL.trim()}`);
  }

  // VERCEL_BRANCH_URL — branch-specific preview URL
  if (process.env.VERCEL_BRANCH_URL?.trim()) {
    origins.add(`https://${process.env.VERCEL_BRANCH_URL.trim()}`);
  }

  // VERCEL_PROJECT_PRODUCTION_URL — stable production URL on Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) {
    origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`);
  }

  // ALLOWED_ORIGINS — comma-separated escape hatch for any other URL
  if (process.env.ALLOWED_ORIGINS?.trim()) {
    process.env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
      .forEach((o) => origins.add(o));
  }

  return [...origins].filter(Boolean);
}

export const auth = betterAuth({
  database: new PostgresDialect({ pool }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()], // sets cookies correctly in Next.js serverless / edge
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
        required: false,
        input: true,
      },
    },
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "learnflow-dev-secret-change-in-prod",
  baseURL,
  trustedOrigins: buildTrustedOrigins(),
});

export type Session = typeof auth.$Infer.Session;
