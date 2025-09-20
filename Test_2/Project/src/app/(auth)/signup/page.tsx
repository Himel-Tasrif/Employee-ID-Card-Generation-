"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";

type RuleState = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // lowercase recommended
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const rules: RuleState = useMemo(
    () => ({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const allGood = Object.values(rules).every(Boolean);

  useEffect(() => {
    setMsg(null);
  }, [name, username, email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!allGood) {
      setMsg({ type: "error", text: "Please meet all password requirements." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Sign up failed");
      }
      setMsg({ type: "success", text: "Account created successfully. Redirecting…" });
      window.location.href = "/login";
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Sign up failed" });
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
          <h1 className="text-xl font-semibold text-gray-900">Create your Axzons account</h1>
          <p className="text-sm text-gray-600 mt-1">All fields are required</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jdoe"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Use lowercase letters/numbers (e.g., jdoe)</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@company.com"
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
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="At least 8 characters"
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

            {/* Live checklist */}
            {/* Live checklist */}
            <ul className="mt-2 text-xs space-y-1">
              <li className={rules.length ? "text-green-600" : "text-red-600"}>
                • At least 8 characters
              </li>
              <li className={rules.upper ? "text-green-600" : "text-red-600"}>
                • At least one uppercase letter (A–Z)
              </li>
              <li className={rules.lower ? "text-green-600" : "text-red-600"}>
                • At least one lowercase letter (a–z)
              </li>
              <li className={rules.number ? "text-green-600" : "text-red-600"}>
                • At least one number (0–9)
              </li>
              <li className={rules.special ? "text-green-600" : "text-red-600"}>
                • At least one special character (!@#$%…)
              </li>
            </ul>
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
            <UserPlus className="w-4 h-4" />
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-700 hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-green-600" : "text-gray-500"}`}>
      <span
        className={`inline-block w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-gray-400"}`}
        aria-hidden
      />
      {text}
    </li>
  );
}
