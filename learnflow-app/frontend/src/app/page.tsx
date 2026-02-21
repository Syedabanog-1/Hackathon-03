import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 text-center">
      <div className="max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          LearnFlow
        </h1>
        <p className="text-xl text-gray-400 mb-2">AI-powered Python tutoring platform</p>
        <p className="text-sm text-gray-600 mb-10">
          Chat with expert AI agents · Write &amp; run code · Track mastery · Get personalised exercises
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
            Get Started
          </Link>
          <Link href="/dashboard" className="px-8 py-3 border border-gray-600 hover:border-blue-400 rounded-lg font-semibold transition-colors">
            View Dashboard
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6 text-left">
          {[
            { icon: "🤖", title: "6 AI Agents", desc: "Triage, Concepts, Debug, Code Review, Exercise, Progress" },
            { icon: "⚡", title: "Live Sandbox", desc: "Run Python instantly in a secure 5s timeout sandbox" },
            { icon: "📈", title: "Mastery Tracking", desc: "Weighted scores across 8 curriculum modules" },
          ].map((f) => (
            <div key={f.title} className="card">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
