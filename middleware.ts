 import { NextRequest, NextResponse } from "next/server";
 
 /**
  * Password-protects /dashboard using DASHBOARD_PASSWORD env var.
  * Access via /dashboard?p=<password> sets a cookie for subsequent requests.
  */
 export function middleware(req: NextRequest) {
   const { pathname, searchParams } = req.nextUrl;
 
   if (pathname !== "/dashboard") {
     return NextResponse.next();
   }
 
   const password = process.env.DASHBOARD_PASSWORD;
 
   if (!password) {
     return NextResponse.next();
   }
 
   const cookieAuth = req.cookies.get("t3-dashboard-auth")?.value;
   if (cookieAuth === password) {
     return NextResponse.next();
   }
 
   const urlParam = searchParams.get("p");
   if (urlParam === password) {
     const res = NextResponse.next();
     res.cookies.set("t3-dashboard-auth", password, {
       httpOnly: true,
       secure: true,
       sameSite: "strict",
       maxAge: 60 * 60 * 24 * 30,
       path: "/",
     });
     return res;
   }
 
   return NextResponse.rewrite(new URL("/dashboard/login", req.url));
 }
 
 export const config = {
   matcher: ["/dashboard"],
 };
