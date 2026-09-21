'use client';

// Supplier admin panel: branded login gate + sidebar shell. Sections live
// in their own files (AdminProducts, AdminTrade, AdminTeam, AdminTracking,
// AdminCta); this file owns auth state, layout and the Settings section.
// Everything is demo-grade (sessionStorage auth, localStorage data) and
// per-supplier branded from the def - same template for every deployment.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SupplierConfig } from '../supplierConfig';
import {
  defaultConfig, readStoredConfig, writeStoredConfig, resetStoredConfig, SupplierConfigProvider,
} from '../supplierConfig';
import { getSupplierDef } from '../supplierDefs';
import { adminAuthKey, readAdminData, writeAdminData, resetAdminData, readEvents, withDemoEvents, type AdminData, type TrackingEvent } from '../adminData';
import { AdminProducts } from './AdminProducts';
import { AdminTrade } from './AdminTrade';
import { AdminTeam } from './AdminTeam';
import { AdminTracking } from './AdminTracking';
import { AdminCta } from './AdminCta';

type SectionKey = 'dashboard' | 'products' | 'trade' | 'team' | 'tracking' | 'cta' | 'settings';

export function AdminPanel({ slug }: { slug: string }) {
  const def = getSupplierDef(slug);
  const brand = def.brandColor;
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(adminAuthKey(slug)) === '1');
  }, [slug]);

  if (authed === null) {
    return <main className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading admin...</main>;
  }
  if (!authed) {
    return <AdminLogin slug={slug} brand={brand} logo={def.logoDarkUrl ?? def.logoUrl} name={def.name} onLogin={() => setAuthed(true)} />;
  }
  return <AdminHome slug={slug} onLogout={() => { window.sessionStorage.removeItem(adminAuthKey(slug)); setAuthed(false); }} />;
}

// ---- login ----

function AdminLogin({ slug, brand, logo, name, onLogin }: { slug: string; brand: string; logo: string | null; name: string; onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Demo auth: any non-empty credentials accepted.
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password.');
      return;
    }
    window.sessionStorage.setItem(adminAuthKey(slug), '1');
    onLogin();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: brand }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={name} className="h-12 w-auto object-contain" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white" style={{ backgroundColor: brand }}>
              {name.slice(0, 1)}
            </span>
          )}
          <h1 className="mt-4 text-lg font-bold text-slate-900">Supplier Admin</h1>
          <p className="mt-1 text-xs text-slate-500">Sign in to manage {name}</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" placeholder="Password" />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: brand }}>
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              // Demo shortcut: one click straight into the demo admin (any credentials work).
              window.sessionStorage.setItem(adminAuthKey(slug), '1');
              onLogin();
            }}
            className="w-full rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View the demo admin
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-slate-400">Demo build - any email and password signs in.</p>
        <div className="mt-3 border-t border-slate-100 pt-3 text-center">
          <Link href={slug === 'burton-roofing' ? '/supplier-pricing-tool' : `/supplier-pricing-tool/${slug}`} className="text-xs font-medium text-slate-400 hover:text-slate-600 transition">
            Back to the pricing tool
          </Link>
        </div>
      </div>
    </main>
  );
}

// ---- shell ----

function AdminHome({ slug, onLogout }: { slug: string; onLogout: () => void }) {
  const [cfg, setCfg] = useState<SupplierConfig>(() => defaultConfig(slug));
  const [admin, setAdmin] = useState<AdminData>(() => readAdminData(slug, defaultConfig(slug)));
  const [section, setSection] = useState<SectionKey>('dashboard');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const base = defaultConfig(slug);
    setCfg(readStoredConfig(slug) ?? base);
    setAdmin(readAdminData(slug, base));
  }, [slug]);

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const saveAll = () => {
    writeStoredConfig(cfg);
    writeAdminData(slug, admin);
    flashSaved();
  };

  const resetDemo = () => {
    if (!window.confirm('Reset this demo back to defaults? Pricing, products and settings changes in this browser will be cleared.')) return;
    resetStoredConfig(slug);
    resetAdminData(slug);
    window.location.reload();
  };

  const sections: { key: SectionKey; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    ...(admin.features.products ? [{ key: 'products' as SectionKey, label: 'Products' }] : []),
    ...(admin.features.tradePricing ? [{ key: 'trade' as SectionKey, label: 'Trade pricing' }] : []),
    ...(admin.features.team ? [{ key: 'team' as SectionKey, label: 'Team' }] : []),
    ...(admin.features.tracking ? [{ key: 'tracking' as SectionKey, label: 'Tracking' }] : []),
    ...(admin.features.cta ? [{ key: 'cta' as SectionKey, label: 'Call to action' }] : []),
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-black/20" style={{ backgroundColor: cfg.headerColor ?? cfg.brandColor }}>
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {cfg.logoDarkUrl || cfg.logoUrl ? (
              <span className={"flex items-center justify-center " + (cfg.logoWhiteBox ? "rounded-lg bg-white px-2 py-1" : "")}>
                {/* eslint-disable-next-line @nextjs/next/no-img-element */}
                <img src={cfg.logoDarkUrl ?? cfg.logoUrl ?? undefined} alt={cfg.name} className={(cfg.logoWhiteBox ? "h-9 " : "h-8 ") + "w-auto object-contain"} />
              </span>
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold" style={{ color: cfg.brandColor }}>{cfg.name.slice(0, 1)}</span>
            )}
            <span className="text-sm font-semibold text-white">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-green-300">Saved</span>}
            <button onClick={saveAll} className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition">Save changes</button>
            <button onClick={resetDemo} title="Reset all demo changes made in this browser" className="rounded-full border border-white/50 px-3.5 py-1.5 text-xs font-medium text-white hover:border-white transition">Reset demo</button>
            <Link href={slug === 'burton-roofing' ? '/supplier-pricing-tool' : `/supplier-pricing-tool/${slug}`} className="rounded-full border border-white/50 px-3.5 py-1.5 text-xs font-medium text-white hover:border-white transition">View tool</Link>
            <button onClick={onLogout} className="rounded-full border border-white/50 px-3.5 py-1.5 text-xs font-medium text-white hover:border-white transition">Log out</button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-57px)]">
        <nav className="w-56 flex-shrink-0 border-r border-slate-200 bg-white px-3 py-4 hidden md:block">
          <div className="flex flex-col gap-1 sticky top-16">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`w-full whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${section === s.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 hover:border hover:border-slate-200'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>
        <nav className="md:hidden border-b border-slate-200 bg-white px-4 py-2 flex gap-1 overflow-x-auto w-full">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-medium transition ${section === s.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="flex-1 min-w-0 px-4 md:px-8 py-6 space-y-4 pb-16">
          {section === 'dashboard' && <Dashboard cfg={cfg} admin={admin} slug={slug} />}
          {section === 'products' && <AdminProducts cfg={cfg} setCfg={setCfg} admin={admin} setAdmin={setAdmin} />}
          {section === 'trade' && <AdminTrade admin={admin} setAdmin={setAdmin} cfg={cfg} />}
          {section === 'team' && <AdminTeam admin={admin} setAdmin={setAdmin} />}
          {section === 'tracking' && <AdminTracking cfg={cfg} slug={slug} admin={admin} />}
          {section === 'cta' && <AdminCta admin={admin} setAdmin={setAdmin} />}
          {section === 'settings' && <Settings slug={slug} cfg={cfg} setCfg={setCfg} admin={admin} setAdmin={setAdmin} onReset={flashSaved} />}
        </div>
      </div>
    </main>
  );
}

export function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {desc && <p className="mt-0.5 text-xs text-slate-400">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

// ---- dashboard ----

function Dashboard({ cfg, admin, slug }: { cfg: SupplierConfig; admin: AdminData; slug: string }) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);

  useEffect(() => {
    const load = () => setEvents(withDemoEvents(readEvents(slug), cfg));
    load();
    window.addEventListener('qc-spt-events-changed', load);
    return () => window.removeEventListener('qc-spt-events-changed', load);
  }, [slug, cfg]);

  const quotes = events.filter((e): e is Extract<TrackingEvent, { type: 'quote' }> => e.type === 'quote');
  const signups = events.filter((e): e is Extract<TrackingEvent, { type: 'signup' }> => e.type === 'signup');
  const actions = events.filter((e): e is Extract<TrackingEvent, { type: 'action' }> => e.type === 'action');
  const value = quotes.reduce((s, q) => s + q.total, 0);
  const ordered = actions.filter((a) => a.action === 'order').length;
  const conversion = quotes.length ? Math.round((ordered / quotes.length) * 100) : 0;

  const stats = [
    { label: 'Products', value: String(cfg.products.length), show: admin.features.products },
    { label: 'Trade customers', value: String(admin.customers.length), show: admin.features.tradePricing },
    { label: 'Team members', value: String(admin.team.length), show: admin.features.team },
    { label: 'Quotes created', value: String(quotes.length), show: admin.features.tracking },
    { label: 'Quote value', value: `${cfg.currency}${value.toFixed(2)}`, show: admin.features.tracking },
    { label: 'Signups captured', value: String(signups.length), show: admin.features.tracking },
    { label: 'Order conversion', value: quotes.length ? `${conversion}%` : '-', show: admin.features.tracking },
  ].filter(s => s.show);

  const recent = [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  const describeEvent = (e: TrackingEvent): { icon: string; text: string; detail: string } => {
    if (e.type === 'quote') return { icon: 'Q', text: 'Quote created', detail: `${e.itemCount} items - ${e.currency}${e.total.toFixed(2)}${e.email ? ` - ${e.email}` : ''}` };
    if (e.type === 'signup') return { icon: 'S', text: 'Trade signup', detail: `${e.name} - ${e.email}` };
    const labels = { convert: 'Converted to quote', order: 'Order request sent', enquiry: 'Enquiry sent' } as const;
    return { icon: e.action === 'order' ? 'O' : e.action === 'convert' ? 'C' : 'E', text: labels[e.action], detail: e.email ? e.email : '' };
  };
  const timeAgo = (iso: string) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.round(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Overview" desc={`Live snapshot for ${cfg.name}. Changes you make here update the pricing tool instantly in this browser - and auto-reset after 24 hours.`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="mt-1 text-xl font-semibold text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
      {admin.features.tracking && (
        <SectionCard title="Recent activity" desc="What your customers have been doing in the tool. Open the pricing tool in another tab, complete a job, and watch it appear here.">
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-3">No activity yet - complete a pricing in the tool to see it here.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((e, i) => {
                const d = describeEvent(e);
                return (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{d.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{d.text}</p>
                      {d.detail && <p className="truncate text-xs text-slate-500">{d.detail}</p>}
                    </div>
                    <span className="text-xs text-slate-400">{timeAgo(e.createdAt)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      )}
      <SectionCard title="Feature plan" desc="Every module below can be switched on or off per deployment - use Settings to demo different tiers.">
        <div className="flex flex-wrap gap-2">
          {[
            ['Products', admin.features.products], ['Trade pricing', admin.features.tradePricing],
            ['Team', admin.features.team], ['Tracking', admin.features.tracking], ['Call to action', admin.features.cta],
          ].map(([label, on]) => (
            <span key={label as string} className={`rounded-full px-3 py-1 text-xs font-medium ${on ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-slate-100 text-slate-400'}`}>
              {label as string}{on ? ' - on' : ' - off'}
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ---- settings ----

function Settings({ slug, cfg, setCfg, admin, setAdmin, onReset }: {
  slug: string; cfg: SupplierConfig; setCfg: (fn: (c: SupplierConfig) => SupplierConfig) => void;
  admin: AdminData; setAdmin: (fn: (a: AdminData) => AdminData) => void; onReset: () => void;
}) {
  const inputCls = 'mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';
  return (
    <div className="space-y-4">
      <SectionCard title="Branding & wording">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">Supplier name</label>
            <input type="text" value={cfg.name} onChange={e => setCfg(c => ({ ...c, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Tagline</label>
            <input type="text" value={cfg.tagline} onChange={e => setCfg(c => ({ ...c, tagline: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Blanket trade discount (%)</label>
            <input type="number" min="0" max="80" step="0.5" value={cfg.discountPct} onChange={e => setCfg(c => ({ ...c, discountPct: parseFloat(e.target.value) || 0 }))} className={inputCls} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={cfg.poweredBy} onChange={e => setCfg(c => ({ ...c, poweredBy: e.target.checked }))} className="h-4 w-4 accent-slate-900" />
          Powered by QuoteCore+ (off = white-label)
        </label>
      </SectionCard>
      <SectionCard title="Plan modules (internal)" desc="For QuoteCore+ use - we set which modules a customer's deployment includes when we build their version. Demos run with everything on; toggling here previews a lower tier.">
        <div className="grid gap-2 md:grid-cols-2">
          {([
            ['products', 'Products manager', 'Add, edit and remove catalog products and pricing.'],
            ['tradePricing', 'Trade pricing', 'Trade tiers + customer email list with tier assignment.'],
            ['team', 'Team', 'Add team members, invite and reset passwords.'],
            ['tracking', 'Tracking', 'Quotes created, values, signups and product leaderboard.'],
            ['cta', 'Call to action', 'Configure the end-of-flow email-capture popup offer.'],
          ] as const).map(([key, label, desc]) => (
            <label key={key} className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 cursor-pointer transition ${admin.features[key] ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
              <input type="checkbox" checked={admin.features[key]} onChange={e => setAdmin(a => ({ ...a, features: { ...a.features, [key]: e.target.checked } }))} className="mt-0.5 h-4 w-4 accent-slate-900" />
              <span>
                <span className="block text-sm font-medium text-slate-900">{label}</span>
                <span className="block mt-0.5 text-xs text-slate-500">{desc}</span>
              </span>
            </label>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Reset" desc="Restore this supplier's demo defaults (branding, catalog, admin data).">
        <button
          onClick={() => { resetStoredConfig(slug); resetAdminData(slug); setCfg(() => defaultConfig(slug)); setAdmin(() => readAdminData(slug, defaultConfig(slug))); onReset(); }}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-400 transition"
        >
          Reset to defaults
        </button>
      </SectionCard>
    </div>
  );
}
