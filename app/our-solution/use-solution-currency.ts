"use client";

import { useEffect, useRef, useState } from "react";

export type Currency = "GBP" | "USD";

// Same agreed regional entry prices as the roofing solutions page, not an exchange-rate conversion.
export const SOLUTION_PRICES: Record<Currency, string> = {
  GBP: "£749",
  USD: "US$999",
};

const ENDPOINT = "/api/roofing-region";
const PREFERENCE_KEY = "t3-price-currency";

/** Resolves GBP for UK visitors, USD elsewhere, with a manual override that persists. */
export function useSolutionCurrency() {
  const [currency, setCurrency] = useState<Currency | null>(null);
  const manuallyChosen = useRef(false);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(PREFERENCE_KEY); } catch { /* Storage can be blocked. */ }
    if (saved === "GBP" || saved === "USD") { manuallyChosen.current = true; setCurrency(saved); return; }
    const controller = new AbortController();
    let alive = true;
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    async function resolve() {
      let next: Currency = "USD";
      try {
        const response = await fetch(ENDPOINT, { cache: "no-store", credentials: "same-origin", signal: controller.signal });
        if (!response.ok) throw new Error("Country unavailable");
        const data: unknown = await response.json();
        if (data && typeof data === "object" && "currency" in data && data.currency === "GBP") next = "GBP";
      } catch { /* USD fallback. No third-party IP lookup. */ }
      finally {
        window.clearTimeout(timeout);
        if (alive && !manuallyChosen.current) setCurrency(next);
      }
    }
    void resolve();
    return () => { alive = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);
  function choose(next: Currency) {
    manuallyChosen.current = true;
    setCurrency(next);
    try { window.localStorage.setItem(PREFERENCE_KEY, next); } catch { /* Preference still works for this visit. */ }
  }
  return { currency, choose };
}
