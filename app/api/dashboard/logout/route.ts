import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "t3-internal-auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/dashboard/login", request.url), 303);
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
