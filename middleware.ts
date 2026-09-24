import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "t3-internal-auth";

/**
 * Protects the internal /dashboard area, including the pricing configurator.
 * Credentials and the opaque session token live in Vercel environment variables.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = process.env.T3_ADMIN_SESSION_TOKEN;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const authenticated = Boolean(sessionToken && cookie === sessionToken);

  if (pathname === "/dashboard/login") {
    if (authenticated) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (authenticated) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/dashboard/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
