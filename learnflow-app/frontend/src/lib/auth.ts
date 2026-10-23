import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:pass@localhost/db",
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export const auth = betterAuth({
  database: new PostgresDialect({ pool }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],   // required — sets cookies properly in Next.js serverless
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
  // baseURL must match the domain the app is actually served from — a mismatch
  // between this and the real request origin is what produces "invalid origin".
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  trustedOrigins: [
    "https://hack03.netlify.app",
    "https://learnflow-app.vercel.app",
    "https://learnflow-app-two.vercel.app",
    "https://hackathon-03-sandy.vercel.app",
    "https://hackathon-03-mauve.vercel.app",
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL.replace(/\/$/, "")] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    // Allow any extra origins via env, comma-separated (mirrors the FastAPI backend's ALLOWED_ORIGINS pattern)
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean) : []),
  ],
});

export type Session = typeof auth.$Infer.Session;
