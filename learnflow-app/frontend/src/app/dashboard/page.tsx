"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { MODULES } from "@/lib/topics";

const DEFAULT_MODULES = MODULES.map((m) => ({ name: m.name, slug: m.slug, percentage: 0 }));

export default function DashboardPage() {
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    import("@/lib/api")
      .then(({ getProgress }) =>
        getProgress()
          .then((d) => {
            if (d.modules?.length) {
              setModules(
                MODULES.map((mod, i) => ({
                  name: mod.name,
                  slug: mod.slug,
                  percentage: d.modules[i]?.percentage ?? 0,
                }))
              );
            }
            if (d.streak) setStreak(d.streak);
          })
          .catch(() => {/* use defaults */})
      )
      .finally(() => setLoading(false));
  }, []);

  const overall = Math.round(modules.reduce((s, m) => s + m.percentage, 0) / modules.length);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Track your Python mastery · click any module to explore topics</p>
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
          <div className="flex flex-col gap-2">
            {modules.map((m) => {
              const modDef = MODULES.find((md) => md.slug === m.slug)!;
              const isOpen = expanded === m.slug;
              return (
                <div key={m.slug} className="rounded-lg border border-gray-800 overflow-hidden">
                  {/* Module header — clickable */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : m.slug)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <span className="text-gray-400 text-xs w-4">{isOpen ? "▾" : "▸"}</span>
                    <div className="flex-1">
                      <ProgressBar module={m.name} percentage={m.percentage} />
                    </div>
                  </button>

                  {/* Expanded topics list */}
                  {isOpen && (
                    <div className="border-t border-gray-800 bg-gray-900/50 px-4 py-3 flex flex-col gap-2">
                      <p className="text-xs text-gray-500 mb-1">Topics in this module:</p>
                      {modDef.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-colors"
                        >
                          <span className="text-sm text-gray-200">{topic.name}</span>
                          <Link
                            href={`/editor?topic=${topic.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                          >
                            Start ▶
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
