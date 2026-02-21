import axios from "axios";

const KONG_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_KONG_URL || "http://localhost:8000"
    : process.env.KONG_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: KONG_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("better-auth.session_token="))
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
  const { data } = await api.post("/api/v1/execute", { code });
  return data as { output?: string; error?: string; execution_time?: number };
}

export async function getProgress(studentId = "me") {
  const { data } = await api.get(`/api/v1/progress/${studentId}`);
  return data as {
    modules: { name: string; percentage: number; level: string }[];
    streak: number;
  };
}

export async function getExercises(topic: string) {
  const { data } = await api.get(`/api/v1/exercises?topic=${encodeURIComponent(topic)}`);
  return data as { exercises: { id: string; prompt: string; difficulty: string }[] };
}

export async function getStruggleAlerts() {
  const { data } = await api.get("/api/v1/progress/alerts");
  return data as {
    alerts: { studentId: string; topic: string; triggerType: string; timestamp: string }[];
  };
}
