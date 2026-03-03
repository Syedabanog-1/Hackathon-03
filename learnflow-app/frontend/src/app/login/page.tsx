"use client";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint =
      mode === "login" ? "/api/auth/sign-in/email" : "/api/auth/sign-up/email";

    const body =
      mode === "login"
        ? { email, password }
        : { email, password, name, role };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let data: { message?: string; user?: { role?: string }; role?: string } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        // server returned non-JSON
      }
      if (!res.ok) throw new Error(data.message || `Server error (${res.status}) — please try again`);
      const serverRole = data?.user?.role || data?.role || role;
      const dest = serverRole === "teacher" ? "/teacher" : "/dashboard";
      setSuccess(mode === "signup" ? "Account created! Redirecting…" : "Signed in! Redirecting…");
      window.location.href = dest;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-md">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            LearnFlow
          </div>
          <p className="text-gray-500 text-sm">AI-powered Python tutoring platform</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h2 className="text-xl font-bold mb-1 text-white">
            {mode === "login" ? "Welcome back 👋" : "Create your account"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {mode === "login"
              ? "Sign in to continue learning Python"
              : "Join thousands of students learning Python with AI"}
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-950/60 border border-red-800 rounded-lg text-red-300 text-sm flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 bg-green-950/60 border border-green-800 rounded-lg text-green-300 text-sm flex items-start gap-2">
              <span>✓</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    required placeholder="Your name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wide">
                    I am a…
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["student", "teacher"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                          role === r
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        {r === "student" ? "🎓 Student" : "👨‍🏫 Teacher"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wide">
                Email
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wide">
                Password
              </label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg font-semibold text-white transition-colors shadow-lg shadow-blue-900/30"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-800 text-center text-sm text-gray-500">
            {mode === "login" ? "New to LearnFlow? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
