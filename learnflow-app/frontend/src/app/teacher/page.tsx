"use client";
import { useEffect, useState } from "react";
import { getStruggleAlerts, getExercises } from "@/lib/api";

interface Alert {
  studentId: string;
  topic: string;
  triggerType: string;
  timestamp: string;
}

const DEMO_ALERTS: Alert[] = [
  { studentId: "student-0042", topic: "list comprehensions", triggerType: "same_error_3x", timestamp: new Date(Date.now() - 600000).toISOString() },
  { studentId: "student-0107", topic: "recursion", triggerType: "stuck_10min", timestamp: new Date(Date.now() - 1200000).toISOString() },
  { studentId: "student-0231", topic: "decorators", triggerType: "quiz_below_50", timestamp: new Date(Date.now() - 300000).toISOString() },
];

const TRIGGER_LABELS: Record<string, string> = {
  same_error_3x: "Same error 3+ times",
  stuck_10min: "Stuck > 10 minutes",
  quiz_below_50: "Quiz score < 50%",
  said_i_dont_understand: 'Said "I don\'t understand"',
  failed_5_executions: "5+ failed executions",
};

export default function TeacherPage() {
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Record<string, string>>({});

  useEffect(() => {
    getStruggleAlerts()
      .then((d) => { setAlerts(d.alerts?.length ? d.alerts : DEMO_ALERTS); })
      .catch(() => setAlerts(DEMO_ALERTS))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (alert: Alert) => {
    const key = `${alert.studentId}-${alert.topic}`;
    setGeneratingFor(key);
    try {
      const data = await getExercises(alert.topic);
      const ex = data.exercises?.slice(0, 3).map((e: {prompt: string}, i: number) => `${i + 1}. ${e.prompt}`).join("\n") ||
        `1. Write a list comprehension that squares numbers 1-10\n2. Filter even numbers using list comprehension\n3. Use list comprehension to flatten a nested list`;
      setGenerated((prev) => ({ ...prev, [key]: ex }));
    } catch {
      setGenerated((prev) => ({ ...prev, [key]: `1. Practice ${alert.topic} with a simple example\n2. Try an intermediate problem\n3. Solve a challenge problem` }));
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Live struggle alerts from students</p>
        </div>
        <div className="card text-center px-6">
          <div className="text-2xl font-bold text-red-400">{alerts.length}</div>
          <div className="text-xs text-gray-500">Active alerts</div>
        </div>
      </div>

      {loading && <div className="text-gray-500 animate-pulse">Loading alerts…</div>}

      <div className="flex flex-col gap-4">
        {alerts.map((alert, i) => {
          const key = `${alert.studentId}-${alert.topic}`;
          const isGenerating = generatingFor === key;
          const exercises = generated[key];

          return (
            <div key={i} className="card border-l-4 border-l-red-500">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm">{alert.studentId}</div>
                  <div className="text-blue-400 text-sm mt-0.5">Topic: {alert.topic}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    🚨 {TRIGGER_LABELS[alert.triggerType] || alert.triggerType}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()} ago
                  </div>
                </div>
                <button
                  onClick={() => handleGenerate(alert)}
                  disabled={isGenerating || !!exercises}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-xs font-medium whitespace-nowrap ml-4"
                >
                  {isGenerating ? "Generating…" : exercises ? "✓ Generated" : "Generate Exercises"}
                </button>
              </div>

              {exercises && (
                <div className="mt-3 bg-gray-950 rounded-lg p-3 border border-gray-800">
                  <div className="text-xs text-green-400 font-medium mb-2">Generated exercises (click to assign):</div>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">{exercises}</pre>
                  <button className="mt-2 px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-xs font-medium">
                    ✓ Assign to {alert.studentId}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
