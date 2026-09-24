import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "t3-internal-auth";

export async function POST(request: NextRequest) {
  const expectedUsername = process.env.T3_ADMIN_USERNAME;
  const expectedPassword = process.env.T3_ADMIN_PASSWORD;
  const sessionToken = process.env.T3_ADMIN_SESSION_TOKEN;

  if (!expectedUsername || !expectedPassword || !sessionToken) {
    return NextResponse.json(
      { ok: false, error: "Internal dashboard authentication is not configured." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null) as
    | { username?: string; password?: string; next?: string }
    | null;

  if (body?.username !== expectedUsername || body?.password !== expectedPassword) {
    return NextResponse.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
  }

  const nextPath = body?.next?.startsWith("/dashboard") && !body.next.startsWith("//")
    ? body.next
    : "/dashboard";

  const response = NextResponse.json({ ok: true, next: nextPath });
  response.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
