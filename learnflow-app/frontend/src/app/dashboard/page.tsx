"use client";
import { useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";

const DEFAULT_MODULES = [
  { name: "1. Basics", percentage: 75 },
  { name: "2. Control Flow", percentage: 60 },
  { name: "3. Data Structures", percentage: 45 },
  { name: "4. Functions", percentage: 30 },
  { name: "5. OOP", percentage: 10 },
  { name: "6. Files", percentage: 0 },
  { name: "7. Error Handling", percentage: 0 },
  { name: "8. Libraries", percentage: 0 },
];

export default function DashboardPage() {
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [streak, setStreak] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api").then(({ getProgress }) =>
      getProgress()
        .then((d) => {
          if (d.modules?.length) setModules(d.modules.map((m: {name: string; percentage: number}) => ({ name: m.name, percentage: m.percentage })));
          if (d.streak) setStreak(d.streak);
        })
        .catch(() => {/* use defaults */})
        .finally(() => setLoading(false))
    );
  }, []);

  const overall = Math.round(modules.reduce((s, m) => s + m.percentage, 0) / modules.length);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Track your Python mastery across 8 modules</p>
        </div>
        <div className="flex gap-3">
          <div className="card text-center px-6">
            <div className="text-2xl font-bold text-blue-400">{overall}%</div>
            <div className="text-xs text-gray-500">Overall</div>
          </div>
          <div className="card text-center px-6">
            <div className="text-2xl font-bold text-orange-400">🔥 {streak}</div>
            <div className="text-xs text-gray-500">Day streak</div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Python Curriculum Progress</h2>
        {loading ? (
          <div className="text-gray-500 text-sm animate-pulse">Loading progress…</div>
        ) : (
          <div className="flex flex-col gap-4">
            {modules.map((m) => (
              <ProgressBar key={m.name} module={m.name} percentage={m.percentage} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/editor" className="card hover:border-blue-600 transition-colors cursor-pointer">
          <div className="text-xl mb-1">⚡</div>
          <div className="font-semibold">Code Editor</div>
          <div className="text-sm text-gray-500">Write and run Python with AI feedback</div>
        </Link>
        <Link href="/quiz" className="card hover:border-green-600 transition-colors cursor-pointer">
          <div className="text-xl mb-1">🧪</div>
          <div className="font-semibold">Take a Quiz</div>
          <div className="text-sm text-gray-500">Test your knowledge and boost mastery</div>
        </Link>
      </div>
    </div>
  );
}
