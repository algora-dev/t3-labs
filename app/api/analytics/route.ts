import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN;

const RANGES: Record<string, { from: string; to: string }> = {
  "7d": { from: "7d", to: "now" },
  "30d": { from: "30d", to: "now" },
  "90d": { from: "90d", to: "now" },
};

export async function GET(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("x-dashboard-key");
  if (!DASHBOARD_TOKEN || authHeader !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json(
      { error: "Analytics not configured. Set VERCEL_TOKEN, VERCEL_PROJECT_ID, and VERCEL_TEAM_ID env vars." },
      { status: 500 }
    );
  }

  const rangeParam = req.nextUrl.searchParams.get("range") || "30d";
  const range = RANGES[rangeParam] || RANGES["30d"];

  const baseUrl = `https://vercel.com/api/v2/projects/${VERCEL_PROJECT_ID}/analytics`;
  const teamParam = VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : "";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
  };

  try {
    // Fetch all metrics in parallel
    const [visitorsRes, pagesRes, referrersRes, countriesRes, browsersRes, devicesRes, timeseriesRes] =
      await Promise.all([
        fetch(`${baseUrl}/visitors?from=${range.from}&to=${range.to}${teamParam}`, { headers }),
        fetch(`${baseUrl}/pages?from=${range.from}&to=${range.to}${teamParam}`, { headers }),
        fetch(`${baseUrl}/referrers?from=${range.from}&to=${range.to}${teamParam}`, { headers }),
        fetch(`${baseUrl}/countries?from=${range.from}&to=${range.to}${teamParam}`, { headers }),
        fetch(`${baseUrl}/browsers?from=${range.from}&to=${range.to}${teamParam}`, { headers }),
        fetch(`${baseUrl}/devices?from=${range.from}&to=${range.to}${teamParam}`, { headers }),
        fetch(`${baseUrl}/timeseries?from=${range.from}&to=${range.to}${teamParam}`, { headers }),
      ]);

    const [visitors, pages, referrers, countries, browsers, devices, timeseries] =
      await Promise.all([
        visitorsRes.json(),
        pagesRes.json(),
        referrersRes.json(),
        countriesRes.json(),
        browsersRes.json(),
        devicesRes.json(),
        timeseriesRes.json(),
      ]);

    // Calculate totals
    const totalVisitors = visitors?.data?.reduce(
      (sum: number, item: { visitors: number }) => sum + item.visitors,
      0
    ) || 0;
    const totalPageViews = pages?.data?.reduce(
      (sum: number, item: { visitors: number }) => sum + item.visitors,
      0
    ) || 0;

    return NextResponse.json({
      totalVisitors,
      totalPageViews,
      visitors: timeseries?.data || [],
      topPages: pages?.data?.slice(0, 10) || [],
      topReferrers: referrers?.data?.slice(0, 10) || [],
      topCountries: countries?.data?.slice(0, 10) || [],
      topBrowsers: browsers?.data?.slice(0, 5) || [],
      topDevices: devices?.data?.slice(0, 5) || [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch analytics: " + (err as Error).message },
      { status: 500 }
    );
  }
}
