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
  const [redirecting, setRedirecting] = useState(false);

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
      try { if (text) data = JSON.parse(text); } catch { /* non-JSON */ }
      if (!res.ok) throw new Error(data.message || `Error ${res.status} — please try again`);
      setSuccess(mode === "signup" ? "Account created! Taking you home…" : "Signed in! Taking you home…");
      setRedirecting(true);
      setTimeout(() => { window.location.href = "/"; }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-2xl mb-4 shadow-lg shadow-blue-900/40">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-white">LearnFlow</h1>
          <p className="text-gray-500 text-sm mt-1">AI-powered Python learning</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === m
                  ? "bg-gray-700 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Redirect success screen */}
        {redirecting && (
          <div className="bg-gray-900 border border-green-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-400 font-semibold text-lg">
              {mode === "signup" ? "Account created!" : "Signed in!"}
            </p>
            <p className="text-gray-500 text-sm mt-1">Taking you home…</p>
          </div>
        )}

        {/* Card */}
        {!redirecting && <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2.5 bg-green-900/40 border border-green-700 rounded-lg text-green-300 text-sm flex items-center gap-2">
              <span className="shrink-0">✓</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Full Name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    required placeholder="Your name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">I am a…</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["student", "teacher"] as const).map((r) => (
                      <button
                        key={r} type="button" onClick={() => setRole(r)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                          role === r
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300"
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
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="mt-1 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-colors text-sm"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>}

        {!redirecting && (
          <p className="mt-4 text-center text-xs text-gray-600">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
}
