'use client';

// Admin > Products: organise the catalogue with libraries, search, and a
// collapsed/expanded list. Collapsed rows show just name + code (what people
// search for); expanded rows expose full pricing, labour and waste editing.
// Trade price column switches by tier (dropdown) instead of one fixed number.
// Edits write to the live supplier config (saved via the admin shell).

import { useMemo, useState } from 'react';
import type { SupplierProduct } from '../types';
import type { SupplierConfig } from '../supplierConfig';
import type { AdminData, ProductLibrary } from '../adminData';
import { SectionCard } from './AdminPanel';

const BASES: Array<SupplierProduct['basis']> = ['area', 'lineal', 'count'];
const BASIS_LABEL: Record<string, string> = { area: 'Area (m\u00B2)', lineal: 'Lineal (m)', count: 'Item (count)' };

let newIdCounter = 0;

export function AdminProducts({ cfg, setCfg, admin, setAdmin }: {
  cfg: SupplierConfig;
  setCfg: (fn: (c: SupplierConfig) => SupplierConfig) => void;
  admin: AdminData;
  setAdmin: (fn: (a: AdminData) => AdminData) => void;
}) {
  const inputCls = 'w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none';
  const [search, setSearch] = useState('');
  const [activeLib, setActiveLib] = useState<string>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [tierId, setTierId] = useState<string>('retail');
  const [newLibName, setNewLibName] = useState('');
  const [showNewLib, setShowNewLib] = useState(false);

  const libraries = admin.libraries;

  function patchProduct(id: string, p: Partial<SupplierProduct>) {
    setCfg(c => ({ ...c, products: c.products.map(x => (x.id === id ? { ...x, ...p } : x)) }));
  }

  function addProduct() {
    newIdCounter += 1;
    const id = `new-${Date.now()}-${newIdCounter}`;
    setCfg(c => ({
      ...c,
      products: [...c.products, {
        id,
        name: 'New product',
        code: '',
        basis: 'area',
        groups: c.trade === 'roofing' ? ['roofAreas'] : ['areas'],
        component: 'covering',
        roofTypes: ['all'],
        unitPrice: 0,
        packSize: null,
        defaultWastePct: 5,
        defaultLabourRate: 0,
        priceEditable: true,
      }],
    }));
    // Put it in the active library (or leave unassigned on "all")
    if (activeLib !== 'all' && activeLib !== 'unassigned') {
      setAdmin(a => ({ ...a, libraries: a.libraries.map(l => (l.id === activeLib ? { ...l, productIds: [...l.productIds, id] } : l)) }));
    }
    setExpanded(e => new Set(e).add(id));
  }

  function removeProduct(id: string) {
    setCfg(c => ({ ...c, products: c.products.filter(x => x.id !== id) }));
    setAdmin(a => ({ ...a, libraries: a.libraries.map(l => ({ ...l, productIds: l.productIds.filter(p => p !== id) })) }));
  }

  function createLibrary() {
    const name = newLibName.trim();
    if (!name) return;
    const id = `lib-${Date.now()}`;
    setAdmin(a => ({ ...a, libraries: [...a.libraries, { id, name, productIds: [] }] }));
    setNewLibName('');
    setShowNewLib(false);
    setActiveLib(id);
  }

  function toggleLibraryMembership(libId: string, productId: string) {
    setAdmin(a => ({
      ...a,
      libraries: a.libraries.map(l => {
        if (l.id !== libId) return l;
        const has = l.productIds.includes(productId);
        return { ...l, productIds: has ? l.productIds.filter(p => p !== productId) : [...l.productIds, productId] };
      }),
    }));
  }

  function deleteLibrary(libId: string) {
    setAdmin(a => ({ ...a, libraries: a.libraries.filter(l => l.id !== libId) }));
    if (activeLib === libId) setActiveLib('all');
  }

  function renameLibrary(libId: string, name: string) {
    if (!name.trim()) return;
    setAdmin(a => ({ ...a, libraries: a.libraries.map(l => (l.id === libId ? { ...l, name: name.trim() } : l)) }));
  }

  const libById = useMemo(() => new Map(libraries.map(l => [l.id, l])), [libraries]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cfg.products.filter(p => {
      if (activeLib === 'unassigned') {
        if (libraries.some(l => l.productIds.includes(p.id))) return false;
      } else if (activeLib !== 'all') {
        const lib = libById.get(activeLib);
        if (!lib || !lib.productIds.includes(p.id)) return false;
      }
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || (p.code ?? '').toLowerCase().includes(q);
    });
  }, [cfg.products, search, activeLib, libraries, libById]);

  const allExpanded = visible.length > 0 && visible.every(p => expanded.has(p.id));

  function toggleExpanded(id: string) {
    setExpanded(e => {
      const next = new Set(e);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const tier = tierId === 'retail' ? null : admin.tiers.find(t => t.id === tierId) ?? null;
  const priceFor = (p: SupplierProduct) => tier ? p.unitPrice * (1 - tier.discountPct / 100) : p.unitPrice;

  return (
    <SectionCard title={`Products (${cfg.products.length})`} desc="Organise your catalogue into libraries, search by name or code, and expand a product to edit its pricing. Changes apply to the tool once saved (top right).">
      {/* Toolbar: search + library filter + expand-all + add */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or product code"
            className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={activeLib}
          onChange={e => setActiveLib(e.target.value)}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          aria-label="Filter by library"
        >
          <option value="all">All products ({cfg.products.length})</option>
          {libraries.map(l => (
            <option key={l.id} value={l.id}>{l.name} ({l.productIds.length})</option>
          ))}
          <option value="unassigned">Unassigned</option>
        </select>
        {showNewLib ? (
          <span className="flex items-center gap-1">
            <input
              autoFocus
              type="text"
              value={newLibName}
              onChange={e => setNewLibName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createLibrary(); if (e.key === 'Escape') setShowNewLib(false); }}
              placeholder="Library name"
              className="rounded-full border border-blue-400 px-4 py-2 text-sm focus:outline-none"
            />
            <button onClick={createLibrary} className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition">Create</button>
            <button onClick={() => setShowNewLib(false)} className="text-slate-400 hover:text-slate-600 text-sm px-1">Cancel</button>
          </span>
        ) : (
          <button onClick={() => setShowNewLib(true)} className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:border-slate-400 transition">+ New library</button>
        )}
        <div className="ml-auto flex items-center gap-2">
          {activeLib !== 'all' && activeLib !== 'unassigned' && (
            <>
              <input
                type="text"
                defaultValue={libById.get(activeLib)?.name}
                key={activeLib}
                onBlur={e => renameLibrary(activeLib, e.target.value)}
                className="rounded-lg border border-transparent hover:border-slate-200 focus:border-blue-500 px-2 py-1.5 text-xs focus:outline-none w-36"
                aria-label="Rename library"
              />
              <button onClick={() => deleteLibrary(activeLib)} className="text-slate-300 hover:text-red-500 transition text-xs">Delete</button>
            </>
          )}
          <button
            onClick={() => setExpanded(allExpanded ? new Set() : new Set(visible.map(p => p.id)))}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:border-slate-400 transition"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
          <button onClick={addProduct} className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition">+ Add product</button>
        </div>
      </div>

      {/* Trade tier selector */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Trade price column:</span>
        <select
          value={tierId}
          onChange={e => setTierId(e.target.value)}
          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
          aria-label="Trade tier for price column"
        >
          <option value="retail">Retail (no discount)</option>
          {admin.tiers.map(t => (
            <option key={t.id} value={t.id}>{t.name} (-{t.discountPct}%)</option>
          ))}
        </select>
      </div>

      {/* Product list */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {visible.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            {search ? `No products match "${search}".` : 'No products in this view yet.'}
          </p>
        ) : visible.map(p => {
          const isOpen = expanded.has(p.id);
          const libNames = libraries.filter(l => l.productIds.includes(p.id)).map(l => l.name);
          return (
            <div key={p.id}>
              {/* Collapsed: name + code + quick facts */}
              <div className={`flex items-center gap-3 px-4 py-2.5 ${isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/60'} transition`}>
                <button onClick={() => toggleExpanded(p.id)} className="text-slate-400 hover:text-slate-900 transition" aria-label={isOpen ? `Collapse ${p.name}` : `Expand ${p.name}`}>
                  <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={p.name}
                  onChange={e => patchProduct(p.id, { name: e.target.value })}
                  className="flex-1 min-w-0 rounded-lg border border-transparent hover:border-slate-200 focus:border-blue-500 px-2 py-1.5 text-sm font-medium text-slate-900 focus:outline-none"
                  aria-label={`Name ${p.name}`}
                />
                {p.code ? (
                  <span className="hidden sm:inline rounded-full bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-500 whitespace-nowrap">{p.code}</span>
                ) : (
                  <input
                    type="text"
                    value=""
                    onChange={e => patchProduct(p.id, { code: e.target.value })}
                    placeholder="Add code"
                    className="hidden sm:block w-24 rounded-lg border border-dashed border-slate-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    aria-label={`Code ${p.name}`}
                  />
                )}
                <span className="hidden md:inline rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs whitespace-nowrap">{BASIS_LABEL[p.basis]}</span>
                {libNames.length > 0 && (
                  <span className="hidden lg:inline max-w-48 truncate rounded-full bg-green-50 text-green-700 px-2.5 py-1 text-xs whitespace-nowrap">{libNames.join(', ')}</span>
                )}
                <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">{cfg.currency}{priceFor(p).toFixed(2)}</span>
                <button onClick={() => removeProduct(p.id)} className="text-slate-300 hover:text-red-500 transition" aria-label={`Remove ${p.name}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {/* Expanded: full edit grid */}
              {isOpen && (
                <div className="bg-slate-50 px-4 pb-4 pt-1 md:pl-12">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="grid gap-1 text-xs font-medium text-slate-500">
                      Product code
                      <input type="text" value={p.code} onChange={e => patchProduct(p.id, { code: e.target.value })} className={inputCls} aria-label={`Code ${p.name}`} />
                    </label>
                    <label className="grid gap-1 text-xs font-medium text-slate-500">
                      Measurement basis
                      <select value={p.basis} onChange={e => patchProduct(p.id, { basis: e.target.value as SupplierProduct['basis'] })} className={inputCls} aria-label={`Basis ${p.name}`}>
                        {BASES.map(b => <option key={b} value={b}>{BASIS_LABEL[b]}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-medium text-slate-500">
                      Price ({cfg.currency} / unit)
                      <input type="number" min="0" step="0.1" value={p.unitPrice} onChange={e => patchProduct(p.id, { unitPrice: parseFloat(e.target.value) || 0 })} className={inputCls} aria-label={`Price ${p.name}`} />
                    </label>
                    <label className="grid gap-1 text-xs font-medium text-slate-500">
                      Labour rate ({cfg.currency} / unit)
                      <input type="number" min="0" step="0.5" value={p.defaultLabourRate} onChange={e => patchProduct(p.id, { defaultLabourRate: parseFloat(e.target.value) || 0 })} className={inputCls} aria-label={`Labour ${p.name}`} />
                    </label>
                    <label className="grid gap-1 text-xs font-medium text-slate-500">
                      {p.basis === 'lineal' && (p.defaultWasteMode ?? 'percent') === 'flat' ? 'Waste (m added per entry)' : 'Waste %'}
                      {p.basis === 'lineal' ? (
                        <div className="flex gap-1">
                          <select value={p.defaultWasteMode ?? 'percent'} onChange={e => {
                            const mode = e.target.value as 'percent' | 'flat';
                            patchProduct(p.id, mode === 'flat'
                              ? { defaultWasteMode: 'flat', defaultWasteFlat: p.defaultWasteFlat ?? 0.5 }
                              : { defaultWasteMode: 'percent' });
                          }} className="w-16 rounded-lg border border-slate-300 px-1 py-1.5 text-sm focus:border-blue-500 focus:outline-none" aria-label={`Waste type ${p.name}`}>
                            <option value="percent">%</option>
                            <option value="flat">+m</option>
                          </select>
                          {(p.defaultWasteMode ?? 'percent') === 'flat' ? (
                            <input type="number" min="0" step="0.1" value={p.defaultWasteFlat ?? 0} onChange={e => patchProduct(p.id, { defaultWasteFlat: parseFloat(e.target.value) || 0 })} className={inputCls} aria-label={`Waste length ${p.name}`} />
                          ) : (
                            <input type="number" min="0" max="50" step="0.5" value={p.defaultWastePct} onChange={e => patchProduct(p.id, { defaultWastePct: parseFloat(e.target.value) || 0 })} className={inputCls} aria-label={`Waste ${p.name}`} />
                          )}
                        </div>
                      ) : (
                        <input type="number" min="0" max="50" step="0.5" value={p.defaultWastePct} onChange={e => patchProduct(p.id, { defaultWastePct: parseFloat(e.target.value) || 0 })} className={inputCls} aria-label={`Waste ${p.name}`} />
                      )}
                    </label>
                    <label className="grid gap-1 text-xs font-medium text-slate-500">
                      Pack size (optional)
                      <input type="number" min="0" step="1" value={p.packSize ?? ''} onChange={e => patchProduct(p.id, { packSize: e.target.value ? parseFloat(e.target.value) : null })} className={inputCls} aria-label={`Pack size ${p.name}`} />
                    </label>
                    <div className="grid gap-1 text-xs font-medium text-slate-500">
                      Trade price ({tier ? tier.name : 'retail'})
                      <div className="rounded-lg bg-white border border-slate-200 px-2 py-1.5 text-sm text-slate-900">
                        {cfg.currency}{priceFor(p).toFixed(2)}
                        {tier && <span className="ml-1 text-xs text-slate-400">(-{tier.discountPct}%)</span>}
                      </div>
                    </div>
                    <div className="grid gap-1 text-xs font-medium text-slate-500">
                      <span>Libraries</span>
                      <div className="flex flex-wrap gap-1">
                        {libraries.map(l => {
                          const on = l.productIds.includes(p.id);
                          return (
                            <button
                              key={l.id}
                              onClick={() => toggleLibraryMembership(l.id, p.id)}
                              className={`rounded-full px-2.5 py-1 text-xs transition ${on ? 'bg-green-100 text-green-800 ring-1 ring-green-300' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
                              aria-pressed={on}
                            >
                              {on ? '\u2713 ' : '+ '}{l.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
