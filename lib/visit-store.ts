// Forensic visit tracking storage for the /custom-proposal lander.
// Table: public.visit_events (see supabase/visit_events.sql). RLS on, service-role-only access.
// Server rows: event='landing'. Browser rows: event=<behaviour event>, source:'browser'.

const SUPABASE_URL = process.env.SUPABASE_URL || "https://aaavvfttkesdzblttmby.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type VisitEventRow = {
  visit_id: string;
  event: string;
  client_ts?: string | null;
  payload: Record<string, unknown>;
};

export const BROWSER_EVENT_WHITELIST = new Set([
  "landing", // tracker landing beacon for static campaign pages; server-enriched in the route
  "page_loaded",
  "page_visible",
  "visible_3_seconds",
  "visible_5_seconds",
  "visible_10_seconds",
  "first_pointer_or_touch",
  "first_click",
  "first_scroll",
  "scroll_depth",
  "cta_visible",
  "cta_clicked",
  "form_opened", // questionnaire overlay opened (10-day-business-upgrade)
  "form_success", // questionnaire completed successfully
  "video_interaction",
  "page_hidden",
  "page_visible_again",
  "page_exit",
]);

function serviceHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY as string,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function insertVisitEvent(row: VisitEventRow): Promise<boolean> {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[visit] SUPABASE_SERVICE_ROLE_KEY missing; event dropped:", row.event);
    return false;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visit_events`, {
      method: "POST",
      headers: serviceHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify([row]),
    });
    if (!res.ok) {
      console.error("[visit] insert failed", res.status, (await res.text().catch(() => "")).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[visit] insert error", err);
    return false;
  }
}

/** Server-side landing record: one row per /custom-proposal request. Evidence only, no bot labelling. */
export async function recordLanding(opts: {
  visitId: string;
  serverTs: string;
  searchParams: Record<string, string | string[] | undefined>;
  headers: Headers;
  renderMs: number;
}): Promise<void> {
  const { visitId, serverTs, searchParams, headers, renderMs } = opts;
  const h = headers;
  const firstIp = (v: string | null) => (v ? v.split(",")[0].trim() : null);

  const query: Record<string, string> = {};
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string" && v.length <= 300) query[k] = v;
  }
  const utm: Record<string, string> = {};
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith("utm_")) utm[k] = v;
  }

  const host = h.get("x-forwarded-host") || h.get("host") || "www.t3labs.tech";
  const proto = h.get("x-forwarded-proto") || "https";
  const qs = new URLSearchParams(query).toString();
  const url = `${proto}://${host}/custom-proposal${qs ? `?${qs}` : ""}`;

  const payload: Record<string, unknown> = {
    source: "server",
    url,
    fbclid: query.fbclid ?? null,
    utm,
    query,
    referrer: h.get("referer"),
    ip: firstIp(h.get("x-forwarded-for")) || h.get("x-real-ip"),
    user_agent: h.get("user-agent"),
    accept_language: h.get("accept-language"),
    client_hints: {
      "sec-ch-ua": h.get("sec-ch-ua"),
      "sec-ch-ua-mobile": h.get("sec-ch-ua-mobile"),
      "sec-ch-ua-platform": h.get("sec-ch-ua-platform"),
    },
    sec_fetch: {
      site: h.get("sec-fetch-site"),
      mode: h.get("sec-fetch-mode"),
      dest: h.get("sec-fetch-dest"),
      user: h.get("sec-fetch-user"),
    },
    geo: {
      country: h.get("x-vercel-ip-country"),
      region: h.get("x-vercel-ip-country-region"),
      city: h.get("x-vercel-ip-city"),
    },
    cdn: {
      // Vercel request id (region + ray). ASN/ISP + WAF bot score are NOT exposed by Vercel.
      request_id: h.get("x-vercel-id"),
      deployment_url: h.get("x-vercel-deployment-url"),
    },
    http_status: 200,
    request_phase_ms: renderMs,
    server_ts: serverTs,
  };

  await insertVisitEvent({ visit_id: visitId, event: "landing", client_ts: null, payload });
}

/** Server-side request context attached to tracker landing beacons (static pages with no server render).
 * Mirrors the /custom-proposal recordLanding capture: IP, UA, client hints, sec-fetch, geo, Vercel request id. */
export function serverTrackerContext(headers: Headers): Record<string, unknown> {
  const h = headers;
  const firstIp = (v: string | null) => (v ? v.split(",")[0].trim() : null);
  return {
    ip: firstIp(h.get("x-forwarded-for")) || h.get("x-real-ip"),
    user_agent: h.get("user-agent"),
    accept_language: h.get("accept-language"),
    client_hints: {
      "sec-ch-ua": h.get("sec-ch-ua"),
      "sec-ch-ua-mobile": h.get("sec-ch-ua-mobile"),
      "sec-ch-ua-platform": h.get("sec-ch-ua-platform"),
    },
    sec_fetch: {
      site: h.get("sec-fetch-site"),
      mode: h.get("sec-fetch-mode"),
      dest: h.get("sec-fetch-dest"),
      user: h.get("sec-fetch-user"),
    },
    geo: {
      country: h.get("x-vercel-ip-country"),
      region: h.get("x-vercel-ip-country-region"),
      city: h.get("x-vercel-ip-city"),
    },
    cdn: { request_id: h.get("x-vercel-id") },
    server_ts: new Date().toISOString(),
  };
}

/** Minimal stats/timeline reader for the token-protected GET endpoint.
 * Default response: landing counts + behavioural aggregates (CTA clicks, video plays) last 24h. */
export async function queryVisitData(params: { visitId?: string }): Promise<Record<string, unknown>> {
  if (!SUPABASE_SERVICE_ROLE_KEY) return { error: "service key not configured" };

  const base = `${SUPABASE_URL}/rest/v1/visit_events`;
  const select = "select=id,visit_id,event,client_ts,created_at,payload";

  const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

  if (params.visitId) {
    const res = await fetch(
      `${base}?${select}&visit_id=eq.${encodeURIComponent(params.visitId)}&order=id.asc&limit=1000`,
      { headers: serviceHeaders() },
    );
    const rows = res.ok ? await res.json() : [];
    return { visit_id: params.visitId, events: rows };
  }

  const [totalRes, dayRes, recentRes, behaviourRes, ctaRes, pageRes] = await Promise.all([
    fetch(`${base}?select=id&event=eq.landing`, { headers: serviceHeaders({ Prefer: "count=exact", Range: "0-0" }) }),
    fetch(`${base}?select=id&event=eq.landing&created_at=gte.${since24h}`, { headers: serviceHeaders({ Prefer: "count=exact", Range: "0-0" }) }),
    fetch(`${base}?${select}&event=eq.landing&order=id.desc&limit=50`, { headers: serviceHeaders() }),
    // Behavioural event counts (last 24h): cta_visible/cta_clicked, video_interaction, engagement timers, etc.
    fetch(`${base}?select=event&event=neq.landing&created_at=gte.${since24h}&order=id.asc&limit=5000`, { headers: serviceHeaders() }),
    // Latest CTA clicks + video interactions with full detail.
    fetch(`${base}?${select}&event=in.(cta_clicked,video_interaction)&order=id.desc&limit=50`, { headers: serviceHeaders() }),
    // Landing payloads (last 24h) for the per-page breakdown.
    fetch(`${base}?select=payload&event=eq.landing&created_at=gte.${since24h}&order=id.desc&limit=2000`, { headers: serviceHeaders() }),
  ]);

  const total = parseInt((totalRes.headers.get("content-range") || "0-0/0").split("/")[1] || "0", 10);
  const last24h = parseInt((dayRes.headers.get("content-range") || "0-0/0").split("/")[1] || "0", 10);
  const recent = recentRes.ok ? await recentRes.json() : [];

  const behaviourRows: Array<{ event: string }> = behaviourRes.ok ? await behaviourRes.json() : [];
  const events_24h: Record<string, number> = {};
  for (const row of behaviourRows) events_24h[row.event] = (events_24h[row.event] || 0) + 1;
  const recent_cta_video = ctaRes.ok ? await ctaRes.json() : [];

  // Per-page landing breakdown (last 24h): tracker pages set payload.page
  // (e.g. "10-day-business-upgrade"); legacy /custom-proposal rows are matched by payload.url.
  const pageRows: Array<{ payload?: Record<string, unknown> }> = pageRes.ok ? await pageRes.json() : [];
  const landings_by_page_24h: Record<string, number> = {};
  for (const row of pageRows) {
    const p = row.payload || {};
    const env = p.env && typeof p.env === "object" ? (p.env as Record<string, unknown>) : {};
    let page = "other";
    if (typeof p.page === "string") page = p.page;
    else if (typeof env.page === "string") page = env.page;
    else if (typeof p.url === "string" && (p.url as string).includes("/custom-proposal")) page = "custom-proposal";
    landings_by_page_24h[page] = (landings_by_page_24h[page] || 0) + 1;
  }

  return {
    total_landings: total,
    landings_last_24h: last24h,
    landings_by_page_24h,
    events_24h,
    recent_cta_video,
    recent_landings: recent,
  };
}
