import { NextResponse } from "next/server";

/**
 * Fetches analytics data from Vercel Web Analytics REST API.
 * Uses /v1/query/web-analytics/visits/aggregate and /visits/count endpoints.
 * Requires VERCEL_TOKEN and VERCEL_PROJECT_ID env vars.
 */
export async function GET() {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID || "algora-devs-projects";

  if (!token || !projectId) {
    return NextResponse.json(
      {
        error: "Analytics not configured. Set VERCEL_TOKEN and VERCEL_PROJECT_ID env vars.",
        configured: false,
      },
      { status: 200 }
    );
  }

  const aggregateUrl = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
  const countUrl = "https://api.vercel.com/v1/query/web-analytics/visits/count";

  // Calculate date range (last 30 days)
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceMs = since.getTime();
  const untilMs = until.getTime();
  const headers = { Authorization: `Bearer ${token}` };

  // Build URL with proper query params (use URLSearchParams for correct encoding)
  function buildAggregateUrl(by: string, limit: number = 10) {
    const params = new URLSearchParams();
    params.set("projectId", projectId!);
    params.set("teamId", teamId);
    params.set("since", String(sinceMs));
    params.set("until", String(untilMs));
    params.set("by", by);
    params.set("limit", String(limit));
    return `${aggregateUrl}?${params.toString()}`;
  }

  function buildCountUrl() {
    const params = new URLSearchParams();
    params.set("projectId", projectId!);
    params.set("teamId", teamId);
    params.set("since", String(sinceMs));
    params.set("until", String(untilMs));
    return `${countUrl}?${params.toString()}`;
  }

  try {
    const [visitorsRes, topPagesRes, topReferrersRes, countriesRes, countRes] = await Promise.all([
      // Daily visitors over last 30 days
      fetch(buildAggregateUrl("day", 30), { headers }),
      // Top pages by requestPath
      fetch(buildAggregateUrl("requestPath", 10), { headers }),
      // Top referrers
      fetch(buildAggregateUrl("referrerHostname", 10), { headers }),
      // Top countries
      fetch(buildAggregateUrl("country", 10), { headers }),
      // Total counts
      fetch(buildCountUrl(), { headers }),
    ]);

    if (!visitorsRes.ok) {
      const errText = await visitorsRes.text();
      console.error("Vercel Analytics API error:", visitorsRes.status, errText);
      return NextResponse.json(
        { error: `Analytics API error: ${visitorsRes.status} - ${errText}`, configured: true },
        { status: 502 }
      );
    }

    const visitorsData = await visitorsRes.json();
    const topPagesData = topPagesRes.ok ? await topPagesRes.json() : { data: [] };
    const topReferrersData = topReferrersRes.ok ? await topReferrersRes.json() : { data: [] };
    const countriesData = countriesRes.ok ? await countriesRes.json() : { data: [] };
    const countData = countRes.ok ? await countRes.json() : { data: { pageviews: 0, visitors: 0 } };

    return NextResponse.json({
      configured: true,
      totals: countData.data || { pageviews: 0, visitors: 0 },
      visitors: visitorsData.data || [],
      topPages: topPagesData.data || [],
      topReferrers: topReferrersData.data || [],
      countries: countriesData.data || [],
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
