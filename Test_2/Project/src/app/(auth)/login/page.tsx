"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Login failed");
      }
      setMsg({ type: "success", text: "Signed in successfully" });
      window.location.href = "/";
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <img src="/image.png" alt="Axzons" className="h-12 w-auto mb-2" />
          <h1 className="text-xl font-semibold text-gray-900">Sign in to Axzons</h1>
          <p className="text-sm text-gray-600 mt-1">Use your email or username</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Username / Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jdoe or jdoe@company.com"
              required
            />
          </div>

          {/* Password with eye toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPw ? "Hide password" : "Show password"}
                title={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Message */}
          {msg && (
            <div
              className={`text-sm rounded-md px-3 py-2 ${
                msg.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {msg.text}
            </div>
          )}

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-sm text-gray-600 text-center">
            No account?{" "}
            <a href="/signup" className="text-blue-700 hover:underline">
              Create one
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
