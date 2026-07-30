import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

/**
 * Password-protects /dashboard.
 * Access via /dashboard?p=<password> sets a cookie for subsequent requests.
 * Password is hashed in code so no env var needed.
 */

const DASHBOARD_PASSWORD_HASH = createHash("sha256")
  .update("T3Labs2026!")
  .digest("hex");

const COOKIE_NAME = "t3-dashboard-auth";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname !== "/dashboard") {
    return NextResponse.next();
  }

  // Check cookie
  const cookieAuth = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieAuth === DASHBOARD_PASSWORD_HASH) {
    return NextResponse.next();
  }

  // Check URL param (?p=password)
  const urlParam = searchParams.get("p");
  if (urlParam) {
    const hashed = createHash("sha256").update(urlParam).digest("hex");
    if (hashed === DASHBOARD_PASSWORD_HASH) {
      const res = NextResponse.next();
      res.cookies.set(COOKIE_NAME, DASHBOARD_PASSWORD_HASH, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      return res;
    }
  }

  // Not authenticated - show login page
  return NextResponse.rewrite(new URL("/dashboard/login", req.url));
}

export const config = {
  matcher: ["/dashboard"],
};
