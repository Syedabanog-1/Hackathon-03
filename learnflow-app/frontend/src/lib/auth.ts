import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const auth = betterAuth({
  database: { db: pool, type: "pg" },
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "student", required: false },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "learnflow-dev-secret-change-in-prod",
  baseURL: process.env.BETTER_AUTH_URL || "https://hackathon-03-mauve.vercel.app",
  trustedOrigins: [
    "https://hackathon-03-mauve.vercel.app",
    "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
