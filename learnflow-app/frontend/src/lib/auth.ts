import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";

// better-auth v1.5.1 requires Kysely's PostgresDialect — NOT { db: pool, type: "pg" }
// The old { db: pool, type: "pg" } syntax expected a Kysely instance as db, which caused 500
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:pass@localhost/db",
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export const auth = betterAuth({
  database: new PostgresDialect({ pool }),
  emailAndPassword: { enabled: true },
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
  baseURL: process.env.BETTER_AUTH_URL || "https://hack03.netlify.app",
  trustedOrigins: [
    "https://hack03.netlify.app",
    "https://learnflow-app.vercel.app",
    "https://hackathon-03-sandy.vercel.app",
    "https://hackathon-03-mauve.vercel.app",
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
});

export type Session = typeof auth.$Infer.Session;
