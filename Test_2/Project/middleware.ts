// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "axzons_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static & auth routes
  const isPublic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/remove_bg"); // your Flask UI proxy if any

  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
