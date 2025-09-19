// src/app/(auth)/signup/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function pwRules(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const rules = useMemo(() => pwRules(password), [password]);
  const allOk = Object.values(rules).every(Boolean);

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(null), 2500);
      return () => clearTimeout(t);
    }
  }, [msg]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        username: username.trim().toLowerCase(),
        password,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      setMsg({ type: "error", text: json.error || "Signup failed" });
      return;
    }

    setMsg({ type: "success", text: "Account created. Please sign in." });
    setTimeout(() => router.push("/login"), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center px-4">
      {/* toast */}
      {msg && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow ${
            msg.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <img src="/image.png" alt="Axzons HomeCare" className="h-12 w-auto mb-2" />
          <h1 className="text-xl font-semibold text-gray-900">Create your Axzons account</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Full name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Username (lowercase)</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your-username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
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

          <button
            type="submit"
            disabled={!allOk}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition"
            title={!allOk ? "Password does not meet all requirements" : ""}
          >
            Create account
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a className="text-blue-600 hover:underline" href="/login">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
