'use client';

import { useState, useMemo, type CSSProperties } from 'react';
import type { ThemeConfig } from '@quote-core/roof-takeoff';
import type { PriceListConfig, PriceListItem } from "./price-list.config";

interface PriceListPageProps {
  theme: ThemeConfig;
  config: PriceListConfig;
}

export function PriceListPage({ theme, config }: PriceListPageProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(config.products.map(p => p.category)));
    return ['All', ...cats];
  }, [config.products]);

  const filtered = useMemo(() => {
    return config.products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [config.products, search, activeCategory]);

  const formatPrice = (price: number) => {
    if (theme.currencySymbol) {
      return `${theme.currencySymbol}${price.toFixed(2)}`;
    }
    return `\u00A3${price.toFixed(2)}`;
  };

  return (
    <main
      className="min-h-screen bg-white"
      style={{ fontFamily: theme.bodyFont, '--pl-heading-font': theme.headingFont } as CSSProperties}
    >
      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          {theme.logoUrl ? (
            <img src={theme.logoUrl ?? undefined} alt={theme.supplierName ?? undefined} className="h-8 md:h-10 w-auto" />
          ) : (
            <span className="text-sm font-semibold text-slate-900">{theme.supplierName}</span>
          )}
          <a
            href={theme.homeUrl ?? "/demo/roofing-site"}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition"
          >
            Back to Apex Roofing home
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Title */}
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900"
          style={{ fontFamily: theme.headingFont }}
        >
          {config.pageTitle}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-500">{config.pageSubtitle}</p>

        {/* Search */}
        <div className="mt-6 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition"
            style={{ fontFamily: theme.bodyFont }}
          />
        </div>

        {/* Category tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition"
              style={{
                borderColor: activeCategory === cat ? theme.primary : '#e2e8f0',
                backgroundColor: activeCategory === cat ? theme.primary : 'transparent',
                color: activeCategory === cat ? '#fff' : '#64748b',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mt-4 text-xs text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>

        {/* Product cards */}
        <div className="mt-4 space-y-3">
          {filtered.map((item, idx) => {
            const realIndex = config.products.indexOf(item);
            const isExpanded = expandedId === realIndex;
            return (
              <ProductCard
                key={realIndex}
                item={item}
                theme={theme}
                isExpanded={isExpanded}
                onToggle={() => setExpandedId(isExpanded ? null : realIndex)}
                formatPrice={formatPrice}
                demoDisclaimer={config.demoDisclaimer}
              />
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center">
              <p className="text-sm text-slate-400">No products match your search.</p>
            </div>
          )}
        </div>

        {/* CTA section */}
        <div
          className="mt-10 rounded-2xl p-6 md:p-8 text-center"
          style={{ backgroundColor: `${theme.primary}0D` }}
        >
          <h2
            className="text-lg md:text-xl font-bold text-slate-900"
            style={{ fontFamily: theme.headingFont }}
          >
            {config.ctaTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            {config.ctaDescription}
          </p>
          <a
            href="/#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: theme.primary }}
          >
            {config.ctaButtonText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-4 mt-8">
        <div className="mx-auto max-w-3xl px-4">
          <span className="text-xs text-slate-400">{theme.copy.footerText || theme.supplierName}</span>
        </div>
      </footer>

      <style jsx global>{`
        [data-pl-heading], h1, h2 {
          font-family: var(--pl-heading-font, inherit);
        }
      `}</style>
    </main>
  );
}

// ─── Product Card ────────────────────────────────────

function ProductCard({
  item,
  theme,
  isExpanded,
  onToggle,
  formatPrice,
  demoDisclaimer,
}: {
  item: PriceListItem;
  theme: ThemeConfig;
  isExpanded: boolean;
  onToggle: () => void;
  formatPrice: (price: number) => string;
  demoDisclaimer?: string;
}) {
  return (
    <div
      className="rounded-xl border bg-white transition-all overflow-hidden"
      style={{
        borderColor: isExpanded ? theme.primary : '#e2e8f0',
        boxShadow: isExpanded ? `0 4px 16px ${theme.primary}10` : undefined,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm md:text-base font-semibold text-slate-900">{item.name}</h3>
            <span className="text-xs font-medium text-slate-400">{item.sku}</span>
          </div>
          <span className="mt-0.5 inline-block text-xs text-slate-400">{item.category}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div
              className="text-sm md:text-base font-bold"
              style={{ color: theme.primary }}
            >
              {formatPrice(item.price)}
            </div>
            <div className="text-xs text-slate-400">{item.unit}</div>
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {isExpanded && item.description && (
        <div className="px-5 pb-4 -mt-1 animate-[fadeIn_0.2s_ease-out]">
          <div className="border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
              <DetailRow label="SKU" value={item.sku} />
              <DetailRow label="Purchase type" value={item.purchaseType} />
              <DetailRow label="Unit" value={item.unit} />
              {item.priceNote && (
                <DetailRow label="Price note" value={item.priceNote} />
              )}
            </div>
            {demoDisclaimer && (
              <p className="mt-3 text-xs text-slate-300 italic">{demoDisclaimer}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-400">{label}:</span>
      <span className="text-xs font-medium text-slate-600">{value}</span>
    </div>
  );
}
