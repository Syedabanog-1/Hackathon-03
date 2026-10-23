import axios from "axios";

// ---------------------------------------------------------------------------
// Backend API base URL
// Server-side: KONG_URL (not exposed to browser)
// Client-side: NEXT_PUBLIC_KONG_URL (injected at build time)
// Both fall back to localhost:8000 for local dev.
// ---------------------------------------------------------------------------
const KONG_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_KONG_URL || "http://localhost:8000"
    : process.env.KONG_URL ||
      process.env.NEXT_PUBLIC_KONG_URL ||
      "http://localhost:8000";

export const api = axios.create({
  baseURL: KONG_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach session token from cookie on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find(
        (r) =>
          r.startsWith("better-auth.session_token=") ||
          r.startsWith("better-auth-session_token=")
      )
      ?.split("=")[1];
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function detectIntent(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.match(/error|bug|fix|crash|exception|traceback/)) return "error";
  if (lower.match(/exercise|practice|quiz|challenge|problem/)) return "exercise";
  if (lower.match(/review|check my code|feedback/)) return "review";
  if (lower.match(/progress|score|mastery|level/)) return "progress";
  return "explain";
}

export async function sendTutorMessage(message: string) {
  const { data } = await api.post("/api/v1/tutor", {
    message,
    intent: detectIntent(message),
  });
  return data as { reply: string; agent: string };
}

export async function executeCode(code: string) {
  // Uses the consolidated API /api/v1/execute endpoint
  const { data } = await api.post("/api/v1/execute", { code });
  return data as { output?: string; error?: string; execution_time?: number; stdout?: string; stderr?: string };
}

export async function getProgress(userId = "me") {
  const { data } = await api.get(`/api/v1/progress/${userId}`);
  return data as {
    modules: { name: string; slug?: string; percentage: number; level: string }[];
    streak: number;
    xp: number;
  };
}

export async function saveProgress(
  moduleSlug: string,
  scores: { quizScore?: number; exerciseScore?: number; codeScore?: number }
) {
  const { data } = await api.post("/api/v1/progress/event", {
    action: "exercise_submitted",
    metadata: { moduleSlug, ...scores },
  });
  return data as { success: boolean };
}

export async function getExercises(topic: string) {
  const { data } = await api.get(
    `/api/v1/exercises?topic=${encodeURIComponent(topic)}`
  );
  return data as { exercises: { id: string; prompt: string; difficulty: string }[] };
}

export async function getStruggleAlerts() {
  const { data } = await api.get("/api/v1/progress/alerts");
  return data as {
    alerts: {
      studentId: string;
      topic: string;
      triggerType: string;
      timestamp: string;
    }[];
  };
}

export async function postStruggleAlert(
  studentId: string,
  topic: string,
  triggerType: string
) {
  const { data } = await api.post("/api/v1/progress/event", {
    user_id: studentId,
    action: triggerType,
    metadata: { topic },
  });
  return data as { success: boolean };
}
