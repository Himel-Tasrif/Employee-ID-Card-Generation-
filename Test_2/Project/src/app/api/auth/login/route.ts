// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyUser, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
    }

    const user = await verifyUser(identifier, password);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid username/email or password" }, { status: 401 });
    }

    const token = signToken(user);
    const res = NextResponse.json({ ok: true, user });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Login failed" }, { status: 400 });
  }
}
