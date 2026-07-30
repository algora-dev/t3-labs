"use client";

import { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  T3 Labs Analytics Dashboard                                        */
/*  Password-protected via URL param: /dashboard?key=YOUR_TOKEN        */
/*  Pulls from Vercel Analytics API                                    */
/* ------------------------------------------------------------------ */

const VERCEL_PROJECT_ID = "prj_t3-labs"; // Will be set via env
const VERCEL_TEAM = "algora-devs-projects";

type MetricData = {
  totalVisitors?: number;
  totalPageViews?: number;
  visitors?: Array<{ date: string; visitors: number }>;
  topPages?: Array<{ path: string; visitors: number }>;
  topReferrers?: Array<{ referrer: string; visitors: number }>;
  topCountries?: Array<{ country: string; visitors: number }>;
  topBrowsers?: Array<{ browser: string; visitors: number }>;
  topDevices?: Array<{ device: string; visitors: number }>;
};

export default function DashboardClient({
  expectedToken,
}: {
  expectedToken: string | undefined;
}) {
  const [authed, setAuthed] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<MetricData | null>(null);
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  // Check URL for key on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    if (key && expectedToken && key === expectedToken) {
      setAuthed(true);
    }
  }, [expectedToken]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analytics?range=${range}`, {
        headers: { "x-dashboard-key": expectedToken || "" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to fetch analytics");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [expectedToken, range]);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  // Login form
  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0a0b10] p-6">
        <div className="w-full max-w-sm p-8 border border-[#1a1c24] rounded-2xl bg-[#111318]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 grid place-items-center rounded-lg bg-[#d7ff00] text-[#0a0b10] font-bold text-sm">
              T3
            </div>
            <div>
              <h1 className="text-white text-lg font-semibold">T3 Labs</h1>
              <p className="text-[#6f7584] text-xs">Analytics Dashboard</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputKey && expectedToken && inputKey === expectedToken) {
                setAuthed(true);
                const url = new URL(window.location.href);
                url.searchParams.set("key", inputKey);
                window.history.replaceState({}, "", url.toString());
              } else {
                setError("Invalid key");
              }
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[#9aa0af] text-sm font-medium">
                Access key
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter access key"
                className="w-full px-3.5 py-3 border border-[#2a2d38] rounded-lg bg-[#0a0b10] text-white text-base outline-none focus:border-[#d7ff00] transition-colors"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[#e03e3e] text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center px-5 py-3 rounded-lg bg-[#d7ff00] text-[#0a0b10] text-sm font-semibold hover:brightness-110 transition-all"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#0a0b10] text-white p-6 md:p-10">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 grid place-items-center rounded-lg bg-[#d7ff00] text-[#0a0b10] font-bold text-sm">
              T3
            </div>
            <div>
              <h1 className="text-lg font-semibold">t3labs.tech</h1>
              <p className="text-[#6f7584] text-xs">Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  range === r
                    ? "bg-[#d7ff00] text-[#0a0b10]"
                    : "bg-[#111318] text-[#6f7584] hover:text-white border border-[#2a2d38]"
                }`}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 border border-[#e03e3e]/30 rounded-xl bg-[#e03e3e]/10">
            <p className="text-[#e03e3e] text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-[#d7ff00] text-xs font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid place-items-center py-20">
            <div className="w-8 h-8 border-2 border-[#2a2d38] border-t-[#d7ff00] rounded-full animate-spin" />
          </div>
        )}

        {/* Data */}
        {!loading && data && (
          <div className="flex flex-col gap-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Visitors"
                value={data.totalVisitors?.toLocaleString() || "-"}
              />
              <StatCard
                label="Page Views"
                value={data.totalPageViews?.toLocaleString() || "-"}
              />
              <StatCard
                label="Top Country"
                value={data.topCountries?.[0]?.country || "-"}
              />
              <StatCard
                label="Top Referrer"
                value={data.topReferrers?.[0]?.referrer || "Direct"}
              />
            </div>

            {/* Two column layout */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Top pages */}
              <Panel title="Top Pages">
                {data.topPages?.length ? (
                  <Table
                    headers={["Path", "Visitors"]}
                    rows={data.topPages.map((p) => ({
                      cells: [p.path, p.visitors.toLocaleString()],
                      highlight: p.path,
                    }))}
                  />
                ) : (
                  <EmptyState />
                )}
              </Panel>

              {/* Top referrers */}
              <Panel title="Top Referrers">
                {data.topReferrers?.length ? (
                  <Table
                    headers={["Source", "Visitors"]}
                    rows={data.topReferrers.map((r) => ({
                      cells: [r.referrer || "Direct", r.visitors.toLocaleString()],
                    }))}
                  />
                ) : (
                  <EmptyState />
                )}
              </Panel>

              {/* Top countries */}
              <Panel title="Top Countries">
                {data.topCountries?.length ? (
                  <Table
                    headers={["Country", "Visitors"]}
                    rows={data.topCountries.map((c) => ({
                      cells: [c.country, c.visitors.toLocaleString()],
                    }))}
                  />
                ) : (
                  <EmptyState />
                )}
              </Panel>

              {/* Top devices */}
              <Panel title="Devices & Browsers">
                {data.topDevices?.length ? (
                  <Table
                    headers={["Device", "Visitors"]}
                    rows={[
                      ...data.topDevices.map((d) => ({
                        cells: [d.device, d.visitors.toLocaleString()],
                      })),
                      ...(data.topBrowsers || []).map((b) => ({
                        cells: [`${b.browser} (browser)`, b.visitors.toLocaleString()],
                      })),
                    ]}
                  />
                ) : (
                  <EmptyState />
                )}
              </Panel>
            </div>

            {/* Visitor chart */}
            {data.visitors?.length ? (
              <Panel title="Visitor Trend">
                <VisitorChart data={data.visitors} />
              </Panel>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 border border-[#1a1c24] rounded-xl bg-[#111318]">
      <p className="text-[#6f7584] text-xs font-medium uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 border border-[#1a1c24] rounded-xl bg-[#111318]">
      <h2 className="text-[#9aa0af] text-sm font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<{ cells: string[]; highlight?: string }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1a1c24]">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`text-left py-2.5 px-1 font-medium text-[#6f7584] text-xs uppercase tracking-wider ${
                  i === 0 ? "text-left" : "text-right"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[#1a1c24] last:border-0 hover:bg-[#1a1c24]/50 transition-colors"
            >
              {row.cells.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2.5 px-1 ${
                    j === 0
                      ? "text-white font-medium"
                      : "text-[#9aa0af] text-right tabular-nums"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-8 text-center">
      <p className="text-[#6f7584] text-sm">No data yet</p>
    </div>
  );
}

function VisitorChart({ data }: { data: Array<{ date: string; visitors: number }> }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.visitors), 1);
  const width = 100;
  const height = 40;
  const step = width / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - (d.visitors / max) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-32"
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7ff00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d7ff00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${width},${height} L 0,${height} Z`}
          fill="url(#chart-fill)"
        />
        <path d={pathD} fill="none" stroke="#d7ff00" strokeWidth="0.5" />
      </svg>
      <div className="flex justify-between mt-2 text-[#6f7584] text-xs">
        <span>{new Date(data[0].date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
        <span>{new Date(data[data.length - 1].date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
      </div>
    </div>
  );
}
