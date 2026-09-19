/**
 * T3 Labs — Intake funnel analytics (Phase 1.3)
 *
 * Lightweight, dependency-free event tracking for the AI intake funnel.
 * Events are POSTed to /api/intake/events (fire-and-forget, never throws)
 * and stored in Vercel Blob for later funnel analysis.
 *
 * Also captures landing page + UTM attribution (reviewer §15) on first
 * page view per session, so every submission retains its original source.
 */

export type IntakeTrigger = "hero" | "nav" | "article-cta" | "page-cta";

export interface IntakeOpenContext {
  trigger: IntakeTrigger;
  source_page: string;
  cta_text?: string;
  problem_category?: string;
}

export type IntakeEventName =
  | "intake_open"
  | "intake_start"
  | "intake_step"
  | "intake_submit"
  | "calendly_view";

export interface LandingAttribution {
  landing_page: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

const LANDING_KEY = "t3_landing_attribution";
let sessionId: string | null = null;

function getIntakeSessionId(): string {
  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return sessionId;
}

/** Capture landing page + UTMs once per tab session (reviewer §15). */
export function captureLandingAttribution(): void {
  try {
    if (sessionStorage.getItem(LANDING_KEY)) return;
    const url = new URL(window.location.href);
    const attribution: LandingAttribution = {
      landing_page: url.pathname,
      utm_source: url.searchParams.get("utm_source"),
      utm_medium: url.searchParams.get("utm_medium"),
      utm_campaign: url.searchParams.get("utm_campaign"),
    };
    sessionStorage.setItem(LANDING_KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage unavailable (private mode etc.) — attribution stays null
  }
}

export function getLandingAttribution(): LandingAttribution | null {
  try {
    const raw = sessionStorage.getItem(LANDING_KEY);
    return raw ? (JSON.parse(raw) as LandingAttribution) : null;
  } catch {
    return null;
  }
}

/** Fire-and-forget event tracking. Never throws, never blocks the UI. */
export function trackIntakeEvent(name: IntakeEventName, props: Record<string, unknown> = {}): void {
  try {
    const payload = JSON.stringify({
      event: name,
      session_id: getIntakeSessionId(),
      ts: new Date().toISOString(),
      props,
    });
    const url = "/api/intake/events";
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never break the funnel
  }
}

/**
 * Open the site-wide intake modal from anywhere (hero, mid-page CTAs,
 * ContextualIntakeCTA blocks, #intake deep links handled by the mount).
 */
export function openIntakeModal(context: IntakeOpenContext): void {
  window.dispatchEvent(new CustomEvent<IntakeOpenContext>("t3:intake-open", { detail: context }));
}
