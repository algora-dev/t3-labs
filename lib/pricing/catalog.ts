import fs from 'fs';
import path from 'path';

/** Server-side pricing catalogue loader (pricing.json is the only price source). */

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  unit: 'm2' | 'lm' | 'count' | 'fixed';
  rate: number;
  minimumCharge: number;
  description: string;
  includes: string[];
  excludes: string[];
  active: boolean;
}

export interface PricingCatalog {
  catalogVersion: string;
  currency: string;
  symbol: string;
  taxLabel: string | null;
  note: string;
  items: CatalogItem[];
}

let cached: PricingCatalog | null = null;

export function getCatalog(): PricingCatalog {
  if (!cached) {
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'data', 'apex-roofing', 'pricing.json'),
      'utf-8'
    );
    cached = JSON.parse(raw) as PricingCatalog;
  }
  return cached;
}

export function getActiveItems(): CatalogItem[] {
  return getCatalog().items.filter((i) => i.active);
}

export function getItemById(id: string): CatalogItem | null {
  return getCatalog().items.find((i) => i.id === id && i.active) ?? null;
}

/**
 * Resolve an id or natural-language query (e.g. "concrete tile") to a catalogue item.
 * Exact id match first, then name/keyword matching.
 */
export function findItem(query: string): CatalogItem | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const byId = getItemById(q);
  if (byId) return byId;

  const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);
  let best: { item: CatalogItem; score: number } | null = null;
  for (const item of getActiveItems()) {
    const haystack = `${item.name} ${item.category} ${item.description}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (t.length < 3) continue;
      if (haystack.includes(t)) score += t.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }
  return best?.item ?? null;
}
