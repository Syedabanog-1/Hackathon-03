import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 text-center">
      <div className="max-w-3xl w-full">
        {/* Hero */}
        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-800 bg-blue-950/50 text-blue-400 text-xs font-medium">
          🚀 AI-Powered Python Learning
        </div>
        <h1 className="text-6xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent leading-tight">
          LearnFlow
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-3 font-medium">
          Master Python with expert AI tutors
        </p>
        <p className="text-sm text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Chat with AI agents · Write &amp; run code in the browser · Track mastery across 8 modules · Get personalised exercises
        </p>

        {/* CTA — single entry point */}
        <div className="flex gap-3 justify-center flex-wrap mb-16">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors text-white"
          >
            Get Started →
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: "🤖",
              title: "6 AI Agents",
              desc: "Triage, Concepts, Debug, Code Review, Exercise & Progress — each specialised for a different learning need",
            },
            {
              icon: "⚡",
              title: "Live Code Sandbox",
              desc: "Run Python instantly in the browser with a secure 5-second timeout sandbox — no setup required",
            },
            {
              icon: "📈",
              title: "Mastery Tracking",
              desc: "Weighted scores across 8 curriculum modules — quiz, exercises, code quality & streak all count",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold text-white mb-2">{f.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
