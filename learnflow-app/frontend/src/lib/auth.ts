import { betterAuth } from "better-auth";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required for @neondatabase/serverless in Node.js / Vercel serverless functions
neonConfig.webSocketConstructor = ws;

// Use a placeholder during build time — real value must be set in Vercel env vars.
// The pool only makes an actual connection when a request hits the auth API route.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@placeholder/placeholder",
});

export const auth = betterAuth({
  database: { db: pool, type: "pg" },
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "student", required: false },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "learnflow-dev-secret-change-in-prod",
  baseURL: process.env.BETTER_AUTH_URL || "https://hackathon-03-sandy.vercel.app",
  trustedOrigins: [
    "https://hackathon-03-sandy.vercel.app",
    "https://hackathon-03-mauve.vercel.app",
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
});

export type Session = typeof auth.$Infer.Session;
