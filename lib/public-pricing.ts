export const PUBLIC_PRICING_VERSION = "2026-09-v1";

/**
 * Public ballpark pricing model for the customer-facing pricing calculator.
 * Derived from lib/internal-pricing.ts but simplified into tier bands.
 * Monthly figures intentionally omitted (added later if needed).
 */

export type Currency = "USD" | "GBP";

export type ServiceKey = "calculator" | "assistant" | "admin" | "websites";

/** null band = contact us, no public numbers. null high = open ended "from". */
export interface PriceBand {
  low: number;
  high: number | null;
}

export interface PublicTier {
  id: string;
  name: string;
  blurb: string;
  usd: PriceBand | null;
  gbp: PriceBand | null;
  /** Show the high end with a plus (scope can stretch beyond it). */
  openTop?: boolean;
  /** Websites only: same tier on an existing site, 25% off. */
  existingUsd?: PriceBand | null;
  existingGbp?: PriceBand | null;
}

export interface PublicService {
  key: ServiceKey;
  number: string;
  eyebrow: string;
  name: string;
  short: string;
  intro: string;
  tiers: PublicTier[];
}

export const SERVICE_ORDER: ServiceKey[] = ["calculator", "assistant", "admin", "websites"];

export const PUBLIC_SERVICES: Record<ServiceKey, PublicService> = {
  calculator: {
    key: "calculator",
    number: "01",
    eyebrow: "Core tool",
    name: "Pricing Calculator",
    short: "Turn measurements into products, quantities and prices.",
    intro: "Choose how much product and pricing complexity the tool needs to handle.",
    tiers: [
      {
        id: "basic",
        name: "Basic",
        blurb: "Known measurements in, up to ~100 products, simple rules, on-screen estimate.",
        usd: { low: 999, high: 1499 },
        gbp: { low: 799, high: 1199 },
      },
      {
        id: "standard",
        name: "Standard",
        blurb: "Adds plan or image upload, measure on screen, straight into pricing.",
        usd: { low: 1499, high: 2199 },
        gbp: { low: 1199, high: 1749 },
      },
      {
        id: "advanced",
        name: "Advanced",
        blurb: "Hundreds of products, waste and rounding rules, branded quote outputs.",
        usd: { low: 2199, high: 3399 },
        gbp: { low: 1749, high: 2699 },
      },
      {
        id: "custom",
        name: "Custom",
        blurb: "Customised flow and screens, very large catalogue, your own pricing logic.",
        usd: { low: 3399, high: 4999 },
        gbp: { low: 2699, high: 3999 },
      },
      {
        id: "bespoke",
        name: "Bespoke",
        blurb: "Something else entirely. Talk to us.",
        usd: null,
        gbp: null,
      },
    ],
  },
  assistant: {
    key: "assistant",
    number: "02",
    eyebrow: "Flagship",
    name: "Smart Assistant",
    short: "Guides customers, answers questions and creates estimates in conversation.",
    intro: "The assistant is a bigger build than the calculator at every level. Choose how far it should go.",
    tiers: [
      {
        id: "qa",
        name: "Q&A + handoff",
        blurb: "Approved answers, product guidance, qualified handoff to your team.",
        usd: { low: 1499, high: 1999 },
        gbp: { low: 1199, high: 1599 },
      },
      {
        id: "guidance",
        name: "Sales guidance",
        blurb: "Clarifying questions, recommendations, stronger buying guidance.",
        usd: { low: 1999, high: 2749 },
        gbp: { low: 1599, high: 2199 },
      },
      {
        id: "pricing",
        name: "Pricing + estimates",
        blurb: "Collects the inputs in conversation and returns the estimate itself.",
        usd: { low: 2499, high: 3499 },
        gbp: { low: 1999, high: 2799 },
      },
      {
        id: "advanced",
        name: "Advanced / cross-system",
        blurb: "Multi-step guided flows, connected tools, account states. Contact us beyond this range.",
        usd: { low: 3499, high: 5999 },
        gbp: { low: 2799, high: 4799 },
        openTop: true,
      },
    ],
  },
  admin: {
    key: "admin",
    number: "03",
    eyebrow: "Control layer",
    name: "Admin Dashboard",
    short: "Manage products, prices, users and activity yourself.",
    intro: "Choose how much control your team needs day to day.",
    tiers: [
      {
        id: "basic",
        name: "Basic admin",
        blurb: "Manage products and standard prices yourself.",
        usd: { low: 375, high: 749 },
        gbp: { low: 299, high: 599 },
      },
      {
        id: "advanced",
        name: "Advanced admin",
        blurb: "Products, pricing, users, trade tiers and settings.",
        usd: { low: 750, high: 1499 },
        gbp: { low: 599, high: 1199 },
      },
      {
        id: "operations",
        name: "Operations workspace",
        blurb: "Jobs, staff actions and operational controls in one workspace.",
        usd: { low: 1499, high: 2499 },
        gbp: { low: 1199, high: 1999 },
      },
    ],
  },
  websites: {
    key: "websites",
    number: "04",
    eyebrow: "New service",
    name: "Websites",
    short: "A professional new website or work on your existing one.",
    intro: "New build or work on your existing site (25% off the same tier). Pick the size of the job.",
    tiers: [
      {
        id: "basic",
        name: "Basic",
        blurb: "3-5 page professional site, basic SEO.",
        usd: { low: 399, high: 599 },
        gbp: { low: 299, high: 449 },
        existingUsd: { low: 299, high: 449 },
        existingGbp: { low: 229, high: 349 },
      },
      {
        id: "standard",
        name: "Standard",
        blurb: "10-15 pages, SEO-led structure, simple buying journey, basic pricing and product pages.",
        usd: { low: 999, high: 1999 },
        gbp: { low: 749, high: 1499 },
        existingUsd: { low: 749, high: 1499 },
        existingGbp: { low: 569, high: 1149 },
      },
      {
        id: "complex",
        name: "Complex",
        blurb: "15-30 pages, richer content and structure.",
        usd: { low: 1999, high: 3999 },
        gbp: { low: 1499, high: 2999 },
        existingUsd: { low: 1499, high: 2999 },
        existingGbp: { low: 1149, high: 2249 },
      },
      {
        id: "bespoke",
        name: "Bespoke",
        blurb: "Fully custom. Priced on scope, expect more depending on what you want.",
        usd: { low: 1999, high: null },
        gbp: { low: 1499, high: null },
        existingUsd: { low: 1499, high: null },
        existingGbp: { low: 1149, high: null },
      },
    ],
  },
};

export interface ServiceSelection {
  tierId: string;
  /** Websites only: editing an existing site instead of a new build. */
  existingSite: boolean;
}

export type BallparkSelection = Partial<Record<ServiceKey, ServiceSelection>>;

export interface BallparkLine {
  serviceKey: ServiceKey;
  serviceName: string;
  tierName: string;
  note: string;
  band: PriceBand | null;
  openTop: boolean;
}

export interface Ballpark {
  lines: BallparkLine[];
  low: number;
  high: number | null;
  /** At least one contact-us tier selected. */
  hasContact: boolean;
  /** At least one open-ended from-price tier selected. */
  hasFrom: boolean;
  /** At least one tier where the top end can stretch further. */
  hasStretch: boolean;
  hasNumeric: boolean;
}

export function defaultSelection(key: ServiceKey): ServiceSelection {
  return { tierId: PUBLIC_SERVICES[key].tiers[0].id, existingSite: false };
}

function getTier(service: PublicService, tierId: string): PublicTier {
  return service.tiers.find((tier) => tier.id === tierId) ?? service.tiers[0];
}

/** Band a tier shows for a currency, respecting the websites existing-site values. */
export function tierBand(tier: PublicTier, currency: Currency, existingSite: boolean): PriceBand | null {
  if (currency === "USD") {
    return existingSite && tier.existingUsd !== undefined ? tier.existingUsd : tier.usd;
  }
  return existingSite && tier.existingGbp !== undefined ? tier.existingGbp : tier.gbp;
}

export function calculateBallpark(selection: BallparkSelection, currency: Currency): Ballpark {
  const lines: BallparkLine[] = [];
  let low = 0;
  let high = 0;
  let hasContact = false;
  let hasFrom = false;
  let hasStretch = false;
  let hasNumeric = false;

  for (const key of SERVICE_ORDER) {
    const state = selection[key];
    if (!state) continue;
    const service = PUBLIC_SERVICES[key];
    const tier = getTier(service, state.tierId);
    const existingSite = key === "websites" && state.existingSite;
    const band = tierBand(tier, currency, existingSite);
    lines.push({
      serviceKey: key,
      serviceName: service.name,
      tierName: tier.name,
      note: existingSite ? "Existing site" : "",
      band,
      openTop: Boolean(tier.openTop),
    });
    if (!band) {
      hasContact = true;
      continue;
    }
    hasNumeric = true;
    low += band.low;
    if (band.high === null) {
      hasFrom = true;
    } else {
      high += band.high;
    }
    if (tier.openTop) hasStretch = true;
  }

  return {
    lines,
    low,
    high: hasFrom ? null : high,
    hasContact,
    hasFrom,
    hasStretch,
    hasNumeric,
  };
}

export function formatMoney(value: number, currency: Currency): string {
  const symbol = currency === "USD" ? "$" : "\u00A3";
  return symbol + value.toLocaleString("en-US");
}

export function formatBand(band: PriceBand | null, currency: Currency, openTop = false): string {
  if (!band) return "Contact us";
  if (band.high === null) return "From " + formatMoney(band.low, currency);
  const plus = openTop ? "+" : "";
  return formatMoney(band.low, currency) + " - " + formatMoney(band.high, currency) + plus;
}

export function formatTotal(ballpark: Ballpark, currency: Currency): string {
  if (!ballpark.hasNumeric) return "Contact us";
  if (ballpark.high === null) return "From " + formatMoney(ballpark.low, currency);
  return formatMoney(ballpark.low, currency) + " - " + formatMoney(ballpark.high, currency);
}

export function buildSummaryText(selection: BallparkSelection, currency: Currency): string {
  const ballpark = calculateBallpark(selection, currency);
  const rows = ballpark.lines.map((line) => {
    const scope = line.note ? " (" + line.note.toLowerCase() + ")" : "";
    const price = formatBand(line.band, currency, line.openTop);
    return "- " + line.serviceName + scope + ": " + line.tierName + " (" + price + ")";
  });
  const total = "Ballpark total: " + formatTotal(ballpark, currency);
  return ["T3 Labs ballpark (" + currency + ")", ...rows, total, "Indicative ballpark only, not a quote."].join("\n");
}
