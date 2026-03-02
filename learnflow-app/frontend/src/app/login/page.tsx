"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint =
      mode === "login" ? "/api/auth/sign-in/email" : "/api/auth/sign-up/email";

    const body =
      mode === "login"
        ? { email, password }
        : { email, password, name, role };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let data: { message?: string } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        // server returned non-JSON (empty body or HTML error page)
      }
      if (!res.ok) throw new Error(data.message || `Server error (${res.status}) — please try again`);
      router.push(role === "teacher" ? "/teacher" : "/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold mb-1">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {mode === "login" ? "Sign in to LearnFlow" : "Join LearnFlow to start learning Python"}
          </p>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-900/40 border border-red-700 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    required placeholder="Your name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Role</label>
                  <select
                    value={role} onChange={(e) => setRole(e.target.value as "student" | "teacher")}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="mt-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="text-blue-400 hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
