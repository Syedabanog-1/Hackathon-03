import { betterAuth } from "better-auth";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// WebSocket mode required — HTTP mode (poolQueryViaFetch) does not support transactions
// Better Auth uses transactions on signup (user + account + session inserts)
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:pass@localhost/db",
});

export const auth = betterAuth({
  database: { db: pool, type: "pg" },
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "student", required: false, input: true },
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
