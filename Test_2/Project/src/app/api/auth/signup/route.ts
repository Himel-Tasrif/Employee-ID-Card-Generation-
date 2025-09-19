// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createUser, validatePassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, username, password } = await req.json();

    if (!name || !email || !username || !password) {
      return NextResponse.json({ ok: false, error: "Missing fields." }, { status: 400 });
    }

    const { ok, rules } = validatePassword(password);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Weak password", rules }, { status: 400 });
    }

    await createUser(name, email, username, password);
    return NextResponse.json({ ok: true, message: "Account created. Please sign in." }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Signup failed" }, { status: 400 });
  }
}
