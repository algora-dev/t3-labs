/**
 * Privacy-minimised engagement events. Never send contact values, raw search terms,
 * full URLs, query parameters, or proposal/customer identifiers to analytics.
 */
export type MarketingEvent =
  | "service_to_review_click"
  | "solutions_to_review_click"
  | "solutions_to_service_click"
  | "demo_click"
  | "book_call_click"
  | "video_open"
  | "review_form_submit_success";

export function trackMarketingEvent(event: MarketingEvent, source: string) {
  if (typeof window === "undefined") return;
  try {
    // Explicit opt-out takes precedence. If unset, the existing site-wide
    // consent default applies; revisit that policy before production deployment.
    if (window.localStorage.getItem("cookie_consent") === "essential") return;
    const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag !== "function") return;
    w.gtag("event", event, { content_group: "roofing_marketing", source_area: source });
  } catch {
    // Browser privacy settings can block storage: do not send if status unknown.
  }
}
