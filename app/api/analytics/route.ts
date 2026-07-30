 import { NextResponse } from "next/server";
 
 /**
  * Fetches analytics data from Vercel Analytics REST API.
  * Requires VERCEL_TOKEN and VERCEL_PROJECT_ID env vars.
  * If not configured, returns a friendly error so the dashboard still renders.
  */
 export async function GET() {
   const token = process.env.VERCEL_TOKEN;
   const projectId = process.env.VERCEL_PROJECT_ID;
   const teamId = process.env.VERCEL_TEAM_ID;
 
   if (!token || !projectId) {
     return NextResponse.json(
       {
         error: "Analytics not configured. Set VERCEL_TOKEN and VERCEL_PROJECT_ID env vars.",
         configured: false,
       },
       { status: 200 }
     );
   }
 
   const teamParam = teamId ? `&teamId=${teamId}` : "";
   const baseUrl = "https://api.vercel.com/v4/analytics";
 
   try {
     // Fetch multiple data points in parallel
     const [visitorsRes, topPagesRes, topReferrersRes, countriesRes] = await Promise.all([
       // Visitors over last 30 days
       fetch(
         `${baseUrl}/visitors?projectId=${projectId}${teamParam}&range=30d`,
         { headers: { Authorization: `Bearer ${token}` } }
       ),
       // Top pages
       fetch(
         `${baseUrl}/top/paths?projectId=${projectId}${teamParam}&range=30d&limit=10`,
         { headers: { Authorization: `Bearer ${token}` } }
       ),
       // Top referrers
       fetch(
         `${baseUrl}/top/referrers?projectId=${projectId}${teamParam}&range=30d&limit=10`,
         { headers: { Authorization: `Bearer ${token}` } }
       ),
       // Top countries
       fetch(
         `${baseUrl}/top/countries?projectId=${projectId}${teamParam}&range=30d&limit=10`,
         { headers: { Authorization: `Bearer ${token}` } }
       ),
     ]);
 
     if (!visitorsRes.ok) {
       const errText = await visitorsRes.text();
       console.error("Vercel Analytics API error:", visitorsRes.status, errText);
       return NextResponse.json(
         { error: "Failed to fetch analytics data.", configured: true },
         { status: 502 }
       );
     }
 
     const visitors = await visitorsRes.json();
     const topPages = topPagesRes.ok ? await topPagesRes.json() : { data: [] };
     const topReferrers = topReferrersRes.ok ? await topReferrersRes.json() : { data: [] };
     const countries = countriesRes.ok ? await countriesRes.json() : { data: [] };
 
     return NextResponse.json({
       configured: true,
       visitors: visitors.data || [],
       topPages: topPages.data || [],
       topReferrers: topReferrers.data || [],
       countries: countries.data || [],
       fetchedAt: new Date().toISOString(),
     });
   } catch (err) {
     console.error("Analytics API error:", err);
     return NextResponse.json(
       { error: "Failed to fetch analytics data.", configured: true },
       { status: 500 }
     );
   }
 }
