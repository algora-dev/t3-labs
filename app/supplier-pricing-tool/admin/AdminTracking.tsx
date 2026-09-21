'use client';

// Admin > Tracking, restructured around customer types:
// - Opportunities: known contacts quoting repeatedly without ordering
// - Trade customers (login + tier pricing), known customers (email, no
//   login), anonymous usage (no email - outcome untrackable)
// - Quotes + signups + leaderboard in scrollable containers (~8-10 rows)
// Reads tracking events the tool logs, merged with sample activity.

import { useEffect, useMemo, useState } from 'react';
import type { SupplierConfig } from '../supplierConfig';
import type { AdminData, TrackingEvent } from '../adminData';
import { readEvents, withDemoEvents } from '../adminData';
import { SectionCard } from './AdminPanel';

interface CustomerStats {
  email: string;
  quotes: number;
  totalValue: number;
  orders: number;
  converted: number;
  enquiries: number;
  lastActiveAt: string;
}

function summariseCustomers(events: TrackingEvent[]): Map<string, CustomerStats> {
  const byEmail = new Map<string, CustomerStats>();
  const touch = (email: string, at: string) => {
    let s = byEmail.get(email);
    if (!s) {
      s = { email, quotes: 0, totalValue: 0, orders: 0, converted: 0, enquiries: 0, lastActiveAt: at };
      byEmail.set(email, s);
    }
    if (at > s.lastActiveAt) s.lastActiveAt = at;
    return s;
  };
  for (const e of events) {
    if (e.type === 'quote' && e.email) {
      const s = touch(e.email, e.createdAt);
      s.quotes += 1;
      s.totalValue += e.total;
    } else if (e.type === 'action' && e.email) {
      const s = touch(e.email, e.createdAt);
      if (e.action === 'order') s.orders += 1;
      else if (e.action === 'convert') s.converted += 1;
      else s.enquiries += 1;
    }
  }
  return byEmail;
}

export function AdminTracking({ cfg, slug, admin }: { cfg: SupplierConfig; slug: string; admin: AdminData }) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);

  useEffect(() => {
    const load = () => setEvents(withDemoEvents(readEvents(slug), cfg));
    load();
    window.addEventListener('qc-spt-events-changed', load);
    return () => window.removeEventListener('qc-spt-events-changed', load);
  }, [slug, cfg]);

  const quotes = useMemo(() => events.filter((e): e is Extract<TrackingEvent, { type: 'quote' }> => e.type === 'quote'), [events]);
  const signups = useMemo(() => events.filter((e): e is Extract<TrackingEvent, { type: 'signup' }> => e.type === 'signup'), [events]);
  const customers = useMemo(() => summariseCustomers(events), [events]);

  const tradeEmails = useMemo(() => new Set(admin.customers.map(c => c.email.toLowerCase())), [admin.customers]);
  const tierById = useMemo(() => new Map(admin.tiers.map(t => [t.id, t.name])), [admin.tiers]);

  const trade = [...customers.values()].filter(s => tradeEmails.has(s.email.toLowerCase()));
  const known = [...customers.values()].filter(s => !tradeEmails.has(s.email.toLowerCase()));
  const anonymousQuotes = quotes.filter(q => !q.email);

  const orderedQuotes = quotes.length ? quotes.filter(q => q.email && customers.get(q.email)?.orders) .length : 0;
  // "Left on the table": total quoted value minus the value from customers who ordered.
  const totalQuoteValue = quotes.reduce((s, q) => s + q.total, 0);
  const orderedValue = [...customers.values()].filter(s => s.orders > 0).reduce((sum, s) => sum + s.totalValue, 0);
  const onTheTable = Math.max(0, totalQuoteValue - orderedValue);
  const avgQuote = quotes.length ? totalQuoteValue / quotes.length : 0;

  const opportunities = known
    .filter(s => s.orders === 0 && s.quotes >= 3)
    .sort((a, b) => b.totalValue - a.totalValue);

  // Per-section headline metrics.
  const tradeQuotes = trade.reduce((s, c) => s + c.quotes, 0);
  const tradeOrders = trade.reduce((s, c) => s + c.orders, 0);
  const knownQuotes = known.reduce((s, c) => s + c.quotes, 0);
  const knownOrders = known.reduce((s, c) => s + c.orders, 0);
  const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

  // product leaderboard: productId -> quoted count + name lookup
  const byId = useMemo(() => new Map(cfg.products.map(p => [p.id, p.name])), [cfg.products]);
  const leaderboard = useMemo(() => {
    const counts = new Map<string, number>();
    for (const q of quotes) {
      for (const [pid, qty] of Object.entries(q.productCounts)) {
        counts.set(pid, (counts.get(pid) ?? 0) + (qty > 0 ? 1 : 0));
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [quotes]);
  const max = leaderboard[0]?.[1] ?? 1;

  const sortedQuotes = useMemo(() => [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [quotes]);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB');
  const fmtDateTime = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="space-y-4">
      {/* Headline numbers */}
      <SectionCard title="Overview" desc="Last 30 days, including sample activity. Your own test quotes merge in on top.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Quotes created', value: String(quotes.length) },
            { label: 'Became orders', value: quotes.length ? `${Math.round((orderedQuotes / quotes.length) * 100)}%` : '-' },
            { label: 'Average quote', value: `${cfg.currency}${avgQuote.toFixed(0)}` },
            { label: "Left on the table", value: `${cfg.currency}${Math.round(onTheTable).toLocaleString()}` },
            { label: 'Anonymous usage', value: `${anonymousQuotes.length} quotes` },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Opportunities - the reach-out hook */}
      <SectionCard title={`Opportunities (${opportunities.length})`} desc={`${opportunities.length} known contacts with 3+ quotes and no orders - ${cfg.currency}${opportunities.reduce((s, o) => s + o.totalValue, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} of reachable quoted value waiting for a call.`}>
        {opportunities.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">No open opportunities right now.</p>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th className="py-1.5 pr-2 font-medium">Contact</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Quotes</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Quoted value</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Orders</th>
                  <th className="py-1.5 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map(s => (
                  <tr key={s.email} className="border-b border-slate-100">
                    <td className="py-1.5 pr-2 text-slate-900">{s.email}</td>
                    <td className="py-1.5 pr-2 text-right text-slate-600">{s.quotes}</td>
                    <td className="py-1.5 pr-2 text-right font-semibold text-slate-900">{cfg.currency}{s.totalValue.toFixed(0)}</td>
                    <td className="py-1.5 pr-2 text-right">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">none - reach out</span>
                    </td>
                    <td className="py-1.5 text-xs text-slate-400">{fmtDate(s.lastActiveAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Trade customers */}
      <SectionCard title={`Trade customers (${trade.length})`} desc={`Trade accounts created ${tradeQuotes} quotes - ${tradeOrders} became orders (${pct(tradeOrders, tradeQuotes)}%). Full visibility: quotes, conversions, orders.`}>
        {trade.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">No trade customer activity yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th className="py-1.5 pr-2 font-medium">Email</th>
                  <th className="py-1.5 pr-2 font-medium">Tier</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Quotes</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Value</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Orders</th>
                  <th className="py-1.5 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {trade.sort((a, b) => b.totalValue - a.totalValue).map(s => {
                  const customer = admin.customers.find(c => c.email.toLowerCase() === s.email.toLowerCase());
                  return (
                    <tr key={s.email} className="border-b border-slate-100">
                      <td className="py-1.5 pr-2 text-slate-900">{s.email}</td>
                      <td className="py-1.5 pr-2"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">{customer ? tierById.get(customer.tierId ?? '') ?? 'Trade' : 'Trade'}</span></td>
                      <td className="py-1.5 pr-2 text-right text-slate-600">{s.quotes}</td>
                      <td className="py-1.5 pr-2 text-right font-semibold text-slate-900">{cfg.currency}{s.totalValue.toFixed(0)}</td>
                      <td className="py-1.5 pr-2 text-right text-slate-600">{s.orders}</td>
                      <td className="py-1.5 text-xs text-slate-400">{fmtDate(s.lastActiveAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Known customers */}
      <SectionCard title={`Known customers (${known.length})`} desc={`Known contacts created ${knownQuotes} quotes - ${knownOrders} became orders (${pct(knownOrders, knownQuotes)}%). Average quote ${cfg.currency}${avgQuote.toFixed(0)}.`}>
        {known.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">No known-customer activity yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th className="py-1.5 pr-2 font-medium">Email</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Quotes</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Value</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Converted</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Orders</th>
                  <th className="py-1.5 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {known.sort((a, b) => b.totalValue - a.totalValue).map(s => (
                  <tr key={s.email} className="border-b border-slate-100">
                    <td className="py-1.5 pr-2 text-slate-900">{s.email}</td>
                    <td className="py-1.5 pr-2 text-right text-slate-600">{s.quotes}</td>
                    <td className="py-1.5 pr-2 text-right font-semibold text-slate-900">{cfg.currency}{s.totalValue.toFixed(0)}</td>
                    <td className="py-1.5 pr-2 text-right text-slate-600">{s.converted}</td>
                    <td className="py-1.5 pr-2 text-right">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.orders > 0 ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-slate-100 text-slate-400'}`}>
                        {s.orders > 0 ? `${s.orders} ordered` : 'no orders'}
                      </span>
                    </td>
                    <td className="py-1.5 text-xs text-slate-400">{fmtDate(s.lastActiveAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Anonymous usage */}
      <SectionCard title={`Anonymous usage (${anonymousQuotes.length} quotes)`} desc={`They made ${anonymousQuotes.length} quotes worth ${cfg.currency}${Math.round(anonymousQuotes.reduce((s, q) => s + q.total, 0)).toLocaleString()} - and that is as much info as you get without an email. A signup prompt converts these into known customers.`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs text-slate-500">Quotes</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{anonymousQuotes.length}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs text-slate-500">Quoted value</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{cfg.currency}{anonymousQuotes.reduce((s, q) => s + q.total, 0).toFixed(0)}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs text-slate-500">Share of all quotes</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{quotes.length ? Math.round((anonymousQuotes.length / quotes.length) * 100) : 0}%</div>
          </div>
        </div>
      </SectionCard>

      {/* All quotes - scrollable */}
      <SectionCard title="Quotes" desc={`${quotes.length} quotes created - scroll to browse.`}>
        {quotes.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">No quotes yet - complete a pricing to the output in the tool.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th className="py-1.5 pr-2 font-medium">Created</th>
                  <th className="py-1.5 pr-2 font-medium">Email</th>
                  <th className="py-1.5 pr-2 font-medium">Type</th>
                  <th className="py-1.5 pr-2 font-medium text-right">Items</th>
                  <th className="py-1.5 font-medium text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {sortedQuotes.map((q, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1.5 pr-2 text-xs text-slate-500">{fmtDateTime(q.createdAt)}</td>
                    <td className="py-1.5 pr-2 text-slate-600">{q.email ?? <span className="text-slate-400">anonymous</span>}</td>
                    <td className="py-1.5 pr-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${q.email ? (tradeEmails.has(q.email.toLowerCase()) ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600') : 'bg-slate-100 text-slate-400'}`}>
                        {q.email ? (tradeEmails.has(q.email.toLowerCase()) ? 'Trade' : 'Known') : 'Anonymous'}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-right text-slate-600">{q.itemCount}</td>
                    <td className="py-1.5 text-right font-semibold text-slate-900">{q.currency}{q.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Most quoted products" desc="Every time a product appears in a finished pricing, it counts once here.">
        {leaderboard.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">No product data yet.</p>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-1.5">
            {leaderboard.map(([pid, count]) => (
              <div key={pid} className="flex items-center gap-3">
                <span className="w-56 truncate text-sm text-slate-700">{byId.get(pid) ?? '(removed product)'}</span>
                <div className="flex-1 h-5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.round((count / max) * 100)}%` }} />
                </div>
                <span className="w-16 text-right text-xs font-semibold text-slate-600">{count}×</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title={`Signups (${signups.length})`} desc="Emails captured from the call-to-action popup.">
        {signups.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-3">No signups yet.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th className="py-1.5 pr-2 font-medium">Name</th>
                  <th className="py-1.5 pr-2 font-medium">Email</th>
                  <th className="py-1.5 font-medium">Captured</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1.5 pr-2 text-slate-900">{s.name || '-'}</td>
                    <td className="py-1.5 pr-2 text-slate-600">{s.email}</td>
                    <td className="py-1.5 text-xs text-slate-400">{fmtDateTime(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
