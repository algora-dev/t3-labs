import { NextRequest, NextResponse } from "next/server";

/**
 * Password-protects /dashboard.
 * Access via /dashboard?p=<password> sets a cookie for subsequent requests.
 * No env var needed - password is inline.
 */

const DASHBOARD_PASSWORD = "T3Labs2026!";
const COOKIE_NAME = "t3-dashboard-auth";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname !== "/dashboard") {
    return NextResponse.next();
  }

  // Check cookie
  const cookieAuth = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieAuth === DASHBOARD_PASSWORD) {
    return NextResponse.next();
  }

  // Check URL param (?p=password)
  const urlParam = searchParams.get("p");
  if (urlParam === DASHBOARD_PASSWORD) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, DASHBOARD_PASSWORD, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return res;
  }

  // Not authenticated - show login page
  return NextResponse.rewrite(new URL("/dashboard/login", req.url));
}

export const config = {
  matcher: ["/dashboard"],
};
