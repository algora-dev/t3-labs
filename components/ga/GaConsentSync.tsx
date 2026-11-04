"use client";

import { useEffect } from "react";

/**
 * Keeps Google Analytics consent state in sync with the site's cookie consent
 * choice (localStorage key `cookie_consent`, set by the business-audit CookieBanner).
 *
 * Values:
 *  - "all"      -> analytics + marketing consent granted
 *  - "essential"-> analytics + marketing consent denied
 *  - unset      -> keep the defaults declared in the root layout consent script
 *                  (analytics granted, marketing denied until a site-wide banner exists)
 *
 * Listens to `storage` so a choice made in another tab applies immediately.
 */

const CONSENT_KEY = "cookie_consent";

type ConsentMap = {
  analytics_storage: string;
  ad_storage: string;
  ad_user_data: string;
  ad_personalization: string;
};

const GRANTED: ConsentMap = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

const DENIED: ConsentMap = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

type GtagFn = (...args: unknown[]) => void;

function pushConsentUpdate(map: ConsentMap) {
  const w = window as typeof window & { gtag?: GtagFn; dataLayer?: unknown[][] };
  const args: unknown[] = ["consent", "update", map];
  if (typeof w.gtag === "function") {
    w.gtag(...args);
  } else {
    // gtag.js not loaded yet: queue the command on dataLayer, it will be
    // processed when the Google tag loads.
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(args);
  }
}

function applyStoredConsent() {
  const stored = window.localStorage.getItem(CONSENT_KEY);
  if (stored === "all") pushConsentUpdate(GRANTED);
  else if (stored === "essential") pushConsentUpdate(DENIED);
}

export default function GaConsentSync() {
  useEffect(() => {
    applyStoredConsent();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === CONSENT_KEY) applyStoredConsent();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
