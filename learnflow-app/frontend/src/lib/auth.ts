import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:pass@localhost/db",
  ssl: { rejectUnauthorized: false },
  max: 1,
});

// ---------------------------------------------------------------------------
// Resolve the canonical base URL for Better Auth.
//
// Priority (highest → lowest):
//   1. BETTER_AUTH_URL  — explicitly set in Netlify / Vercel env vars
//   2. NEXT_PUBLIC_APP_URL — next.js public env (set in deployment dashboard)
//   3. VERCEL_URL       — auto-injected by Vercel for every deployment/preview
//   4. localhost:3000   — local development fallback
//
// Trailing slashes are stripped so Better Auth comparisons are consistent.
// ---------------------------------------------------------------------------
function resolveBaseURL(): string {
  const candidates = [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const c of candidates) {
    if (c && c.trim() && !c.includes("localhost:3000") === false) {
      return c.replace(/\/$/, "");
    }
    if (c && c.trim()) return c.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

const baseURL = resolveBaseURL();

// ---------------------------------------------------------------------------
// Build the full list of trusted origins.
// This list is checked against the incoming request's Origin header.
// A mismatch is the sole cause of the "invalid origin" error.
// ---------------------------------------------------------------------------
function buildTrustedOrigins(): string[] {
  const origins = new Set<string>([
    // ── Netlify deployments ─────────────────────────────────────────────────
    "https://hack03.netlify.app",

    // ── Vercel deployments (add yours here if the project name changes) ─────
    "https://learnflow-app.vercel.app",
    "https://learnflow-app-two.vercel.app",
    "https://hackathon-03-sandy.vercel.app",
    "https://hackathon-03-mauve.vercel.app",
    "https://hackathon-03-git-main-syedabanog-1.vercel.app",

    // ── Local development ───────────────────────────────────────────────────
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    // ── Always trust whatever baseURL resolves to ───────────────────────────
    baseURL,
  ]);

  // BETTER_AUTH_URL from env (strip trailing slash for consistency)
  if (process.env.BETTER_AUTH_URL) {
    origins.add(process.env.BETTER_AUTH_URL.replace(/\/$/, ""));
  }

  // NEXT_PUBLIC_APP_URL from env
  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.add(process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""));
  }

  // VERCEL_URL is the auto-injected preview URL (no protocol prefix)
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  // VERCEL_BRANCH_URL covers branch-specific preview deployments
  if (process.env.VERCEL_BRANCH_URL) {
    origins.add(`https://${process.env.VERCEL_BRANCH_URL}`);
  }

  // Comma-separated extra origins — set ALLOWED_ORIGINS in your dashboard
  // to cover any deployment URL not listed above without a code change.
  if (process.env.ALLOWED_ORIGINS) {
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
  plugins: [nextCookies()], // required — sets cookies properly in Next.js serverless
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
  secret: process.env.BETTER_AUTH_SECRET || "learnflow-dev-secret-change-in-prod",
  baseURL,
  trustedOrigins: buildTrustedOrigins(),
});

export type Session = typeof auth.$Infer.Session;
