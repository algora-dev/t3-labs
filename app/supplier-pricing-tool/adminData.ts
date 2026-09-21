// Demo-grade admin data layer for the supplier pricing tool: trade tiers,
// trade customers (email -> tier), team members, CTA settings, admin
// feature flags and tracking events. localStorage-backed per supplier with
// same-tab change events (same pattern as supplierConfig). Production swaps
// this module for API calls - the shapes stay identical.

import type { SupplierConfig } from './supplierConfig';

export interface TradeTier {
  id: string;
  name: string;
  discountPct: number;
}

export interface TradeCustomer {
  email: string;
  tierId: string | null;
  status: 'invited' | 'active';
  addedAt: string;
  lastLoginAt: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor';
  status: 'active' | 'invited';
}

export interface CtaSettings {
  enabled: boolean;
  discountPct: number;
  headline: string;
  body: string;
  buttonLabel: string;
}

/** Admin feature blocks - upsell toggles. All on = full-feature demo. */
export interface AdminFeatures {
  products: boolean;
  tradePricing: boolean;
  team: boolean;
  tracking: boolean;
  cta: boolean;
}

/** A product library - a user-defined folder grouping products so large
 *  catalogues stay navigable (e.g. Roof coverings, Fixings, or a
 *  compatibility library bundling everything that works together). */
export interface ProductLibrary {
  id: string;
  name: string;
  productIds: string[];
}

export interface AdminData {
  tiers: TradeTier[];
  customers: TradeCustomer[];
  team: TeamMember[];
  cta: CtaSettings;
  features: AdminFeatures;
  libraries: ProductLibrary[];
}

/** Tracking events (quote created / signup captured). */
export interface QuoteEvent {
  type: 'quote';
  createdAt: string;
  email: string | null;
  itemCount: number;
  total: number;
  currency: string;
  /** productId -> quoted quantity (drives the product leaderboard) */
  productCounts: Record<string, number>;
}

export interface SignupEvent {
  type: 'signup';
  createdAt: string;
  email: string;
  name: string;
}

export type TrackingEvent = QuoteEvent | SignupEvent | ActionEvent;

/** End-of-flow actions: what the user did with the output. 'convert' =
 *  opened the customer quote builder, 'order' = sent an order request,
 *  'enquiry' = requested a supplier quote. Lets the owner see whether a
 *  customer priced, quoted and actually ordered. */
export interface ActionEvent {
  type: 'action';
  action: 'convert' | 'order' | 'enquiry';
  createdAt: string;
  email: string | null;
  total: number;
}

/** Per-customer aggregate for the tracking view. */
export interface CustomerSummary {
  email: string;
  outputs: number;
  totalValue: number;
  converted: number;
  ordered: number;
  lastActiveAt: string;
}

export function customerSummaries(events: TrackingEvent[]): CustomerSummary[] {
  const byEmail = new Map<string, CustomerSummary>();
  const get = (email: string, at: string) => {
    let s = byEmail.get(email);
    if (!s) { s = { email, outputs: 0, totalValue: 0, converted: 0, ordered: 0, lastActiveAt: at }; byEmail.set(email, s); }
    if (at > s.lastActiveAt) s.lastActiveAt = at;
    return s;
  };
  for (const ev of events) {
    const email = (ev.type === 'signup' ? ev.email : ev.email) ?? 'anonymous';
    const s = get(email, ev.createdAt);
    if (ev.type === 'quote') { s.outputs += 1; s.totalValue += ev.total; }
    else if (ev.type === 'action') {
      if (ev.action === 'convert') s.converted += 1;
      if (ev.action === 'order') { s.ordered += 1; s.totalValue += 0; }
    }
  }
  return [...byEmail.values()].sort((a, b) => b.totalValue - a.totalValue);
}

export const DEFAULT_CTA: CtaSettings = {
  enabled: true,
  discountPct: 5,
  headline: 'Get {pct}% off this job',
  body: 'Join the pricing list - we\'ll email your saving code plus a copy of this pricing.',
  buttonLabel: 'Send my {pct}% saving code',
};

function defaultTeam(supplierName: string): TeamMember[] {
  return [{ id: 'tm-1', name: 'Owner', email: `owner@${supplierName.toLowerCase().replace(/[^a-z]+/g, '')}.co.uk`, role: 'Owner', status: 'active' }];
}

/** Prebuilt libraries derived from product categories so the Products page
 *  demonstrates library organisation out of the box. */
function defaultLibraries(cfg: SupplierConfig): ProductLibrary[] {
  const byComp = new Map<string, string[]>();
  for (const p of cfg.products) {
    const c = p.component ?? 'other';
    if (!byComp.has(c)) byComp.set(c, []);
    byComp.get(c)!.push(p.id);
  }
  const label: Record<string, string> = {
    covering: 'Roof coverings',
    underlay: 'Underlays',
    fixing: 'Fixings',
    ridge: 'Roof components', hip: 'Roof components', valley: 'Roof components',
    barge: 'Roof components', gutter: 'Roof components', downpipe: 'Roof components',
    other: 'Other products',
  };
  const seen = new Map<string, ProductLibrary>();
  for (const [comp, ids] of byComp) {
    const name = label[comp] ?? 'Other products';
    const existing = seen.get(name);
    if (existing) existing.productIds.push(...ids);
    else seen.set(name, { id: `lib-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`, name, productIds: [...ids] });
  }
  return [...seen.values()];
}

export function defaultAdminData(cfg: SupplierConfig): AdminData {
  return {
    tiers: [
      { id: 't1', name: 'Trade Tier 1', discountPct: 5 },
      { id: 't2', name: 'Trade Tier 2', discountPct: Math.max(cfg.discountPct, 10) },
    ],
    customers: [],
    team: defaultTeam(cfg.name),
    cta: { ...DEFAULT_CTA },
    features: { products: true, tradePricing: true, team: true, tracking: true, cta: true },
    libraries: defaultLibraries(cfg),
  };
}

const key = (slug: string) => `qc-spt-${slug}-admin-v2`;
const eventsKey = (slug: string) => `qc-spt-${slug}-events-v1`;
export const adminAuthKey = (slug: string) => `qc-spt-${slug}-admin-auth`;

export function readAdminData(slug: string, cfg: SupplierConfig): AdminData {
  if (typeof window === 'undefined') return defaultAdminData(cfg);
  try {
    const raw = window.localStorage.getItem(key(slug));
    if (!raw) return defaultAdminData(cfg);
    const parsed = JSON.parse(raw) as Partial<AdminData>;
    const base = defaultAdminData(cfg);
    // Merge stored libraries with fresh defaults: keep stored ones (renamed /
    // user-created), re-add any default library that was deleted, and absorb
    // newly added products into the default libraries.
    const storedLibs = Array.isArray(parsed.libraries) ? parsed.libraries : [];
    const mergedLibs = [...storedLibs];
    for (const def of base.libraries) {
      const existing = mergedLibs.find(l => l.id === def.id);
      if (existing) {
        // absorb products not present in any stored library (new defaults)
        const assigned = new Set(mergedLibs.flatMap(l => l.productIds));
        for (const pid of def.productIds) if (!assigned.has(pid)) existing.productIds.push(pid);
      } else {
        mergedLibs.push(def);
      }
    }
    return {
      tiers: Array.isArray(parsed.tiers) && parsed.tiers.length > 0 ? parsed.tiers : base.tiers,
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
      team: Array.isArray(parsed.team) && parsed.team.length > 0 ? parsed.team : base.team,
      cta: { ...base.cta, ...(parsed.cta ?? {}) },
      features: { ...base.features, ...(parsed.features ?? {}) },
      libraries: mergedLibs,
    };
  } catch {
    return defaultAdminData(cfg);
  }
}

export function writeAdminData(slug: string, data: AdminData) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key(slug), JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('qc-spt-admin-changed'));
  } catch { /* ignore */ }
}

export function resetAdminData(slug: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key(slug));
  window.dispatchEvent(new CustomEvent('qc-spt-admin-changed'));
}

// ---- events ----

export function readEvents(slug: string): TrackingEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(eventsKey(slug));
    return raw ? (JSON.parse(raw) as TrackingEvent[]) : [];
  } catch {
    return [];
  }
}

export function logEvent(slug: string, ev: TrackingEvent) {
  if (typeof window === 'undefined') return;
  try {
    const all = readEvents(slug);
    all.unshift(ev);
    // demo-grade cap so localStorage never balloons
    window.localStorage.setItem(eventsKey(slug), JSON.stringify(all.slice(0, 200)));
    window.dispatchEvent(new CustomEvent('qc-spt-events-changed'));
  } catch { /* ignore */ }
}

// ---- sample tracking data ----

/** Small deterministic PRNG so the sample data is stable between renders. */
function seededPrng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const SAMPLE_EMAILS = [
  'mike@harwoodroofing.co.uk', 'sarah.j@premierjones.co.uk', 'dan@dtfdevelopments.co.uk',
  'enquiries@barkerandson.co.uk', 'keith@nwrooflines.co.uk', 'amy@vaultconstructions.co.uk',
  'paul.odonnell@podbuilders.co.uk', 'info@summitroofingltd.co.uk', 'tom@kestrelandco.co.uk',
  'helen@qubebuild.co.uk', 'chris@apexhomeimprovements.co.uk', 'sam@riverstoneprop.co.uk',
];

/** Sample activity so the tracking dashboard shows what a live deployment
 *  looks like (87 quotes over ~30 days, signups, conversions, orders).
 *  Deterministic: same numbers every render. Real events merge on top. */
export function withDemoEvents(real: TrackingEvent[], cfg: SupplierConfig): TrackingEvent[] {
  const rand = seededPrng(42);
  const products = cfg.products;
  if (products.length === 0) return real;
  // Weight so the first covering product is clearly the most popular.
  const weights = products.map((p, i) => (p.component === 'covering' ? 10 : 3) - Math.min(i, 5) * 0.4);
  const totalW = weights.reduce((s, w) => s + Math.max(w, 0.5), 0);

  const events: TrackingEvent[] = [];
  const QUOTES = 87;
  const now = Date.now();
  for (let i = 0; i < QUOTES; i++) {
    const email = SAMPLE_EMAILS[Math.floor(rand() * SAMPLE_EMAILS.length)];
    const daysAgo = Math.floor(rand() * 30);
    const createdAt = new Date(now - daysAgo * 86400000 - Math.floor(rand() * 86400000)).toISOString();
    // Most quotes are small repairs; a few are big re-roofs.
    const big = rand() < 0.18;
    const total = big ? 6000 + rand() * 12000 : 300 + rand() * 2800;
    const productCounts: Record<string, number> = {};
    const items = 1 + Math.floor(rand() * 4);
    for (let j = 0; j < items; j++) {
      let pick = rand() * totalW;
      let pid = products[0].id;
      for (let k = 0; k < products.length; k++) {
        pick -= Math.max(weights[k], 0.5);
        if (pick <= 0) { pid = products[k].id; break; }
      }
      productCounts[pid] = (productCounts[pid] ?? 0) + 1;
    }
    events.push({ type: 'quote', createdAt, email, itemCount: Object.keys(productCounts).length, total: Math.round(total * 100) / 100, currency: cfg.currency, productCounts });
    if (rand() < 0.36) {
      events.push({ type: 'action', action: 'convert', createdAt: new Date(new Date(createdAt).getTime() + 3600000).toISOString(), email, total: Math.round(total) });
    }
    if (rand() < 0.16) {
      events.push({ type: 'action', action: 'order', createdAt: new Date(new Date(createdAt).getTime() + 86400000).toISOString(), email, total: Math.round(total) });
    }
    if (rand() < 0.05) {
      events.push({ type: 'action', action: 'enquiry', createdAt: new Date(new Date(createdAt).getTime() + 7200000).toISOString(), email, total: 0 });
    }
  }
  const names = ['Mike Harwood', 'Sarah Jones', 'Dan Fletcher', 'Alex Barker', 'Keith Noble', 'Amy Chu', 'Paul O\u2019Donnell', 'Tom Kestrel'];
  for (let i = 0; i < 22; i++) {
    const email = SAMPLE_EMAILS[Math.floor(rand() * SAMPLE_EMAILS.length)];
    events.push({ type: 'signup', createdAt: new Date(now - Math.floor(rand() * 30) * 86400000).toISOString(), email, name: names[Math.floor(rand() * names.length)] });
  }
  // Real activity on top (most recent first)
  return [...real, ...events];
}

// ---- trade resolution ----

/** Effective trade discount for a (possibly anonymous) tool user:
 *  customer-tier discount when their email is on the list, otherwise the
 *  supplier's blanket discount. */
export function effectiveTrade(cfg: SupplierConfig, admin: AdminData, email?: string | null): { pct: number; label: string | null } {
  const customer = email ? admin.customers.find(c => c.email.toLowerCase() === email.toLowerCase()) : undefined;
  if (customer) {
    const tier = admin.tiers.find(t => t.id === customer.tierId);
    if (tier) return { pct: tier.discountPct, label: `${tier.name} (-${tier.discountPct}%)` };
  }
  return { pct: cfg.discountPct || 0, label: cfg.discountPct > 0 ? `trade pricing (-${cfg.discountPct}%)` : null };
}

/** Fill {pct} placeholders in CTA copy. */
export function ctaText(text: string, pct: number): string {
  return text.replace(/\{pct\}/g, String(pct));
}
