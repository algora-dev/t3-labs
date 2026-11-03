"use client";

import { useEffect, useRef } from "react";

/**
 * Read-only forensic tracker for the /custom-proposal lander.
 * - Passive/capture listeners only: it never dispatches synthetic events, never
 *   scrolls, never clicks, never mutates the DOM. It cannot contaminate Clarity.
 * - Sends each event immediately (sendBeacon for visibility/exit, keepalive fetch otherwise).
 */
export function VisitTracker({ visitId }: { visitId: string }) {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return; // strict-mode / double-mount guard
    started.current = true;
    runTracker(visitId);
  }, [visitId]);
  return null;
}

type Stats = {
  visibleMs: number;
  maxScrollPct: number;
  pointerEvents: number;
  touchEvents: number;
  clickEvents: number;
  scrollEvents: number;
  trustedClicks: number;
  untrustedClicks: number;
};

function runTracker(visitId: string) {
  const stats: Stats = {
    visibleMs: 0,
    maxScrollPct: 0,
    pointerEvents: 0,
    touchEvents: 0,
    clickEvents: 0,
    scrollEvents: 0,
    trustedClicks: 0,
    untrustedClicks: 0,
  };

  const snapshot = () => ({
    ...stats,
    visibleMs: Math.round(stats.visibleMs),
    webdriver: typeof navigator.webdriver === "boolean" ? navigator.webdriver : null,
  });

  const send = (event: string, extra?: Record<string, unknown>, useBeacon = false) => {
    const body = JSON.stringify({
      visitId,
      event,
      clientTs: new Date().toISOString(),
      stats: snapshot(),
      ...(extra || {}),
    });
    try {
      if (useBeacon && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon("/api/visit-events", blob)) return;
      }
      void fetch("/api/visit-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* tracking must never break the page */
    }
  };

  // ---- immediate page_loaded + environment ----
  send("page_loaded", {
    env: {
      href: window.location.href,
      referrer: document.referrer || null,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      screen: { w: window.screen.width, h: window.screen.height },
      devicePixelRatio: window.devicePixelRatio,
      platform: typeof navigator.platform === "string" ? navigator.platform : null,
      userAgent: navigator.userAgent,
      language: navigator.language,
      webdriver: typeof navigator.webdriver === "boolean" ? navigator.webdriver : null,
      visibility: document.visibilityState,
    },
  });
  if (document.visibilityState === "visible") send("page_visible");

  // ---- visible-time accounting + 3s/5s/10s milestones ----
  let visible = document.visibilityState === "visible";
  let lastTick = performance.now();
  let reShowCount = 0;
  const marks: Array<{ ms: number; name: string; fired: boolean }> = [
    { ms: 3000, name: "visible_3_seconds", fired: false },
    { ms: 5000, name: "visible_5_seconds", fired: false },
    { ms: 10000, name: "visible_10_seconds", fired: false },
  ];
  const tick = () => {
    const now = performance.now();
    if (visible) {
      stats.visibleMs += now - lastTick;
      for (const m of marks) {
        if (!m.fired && stats.visibleMs >= m.ms) {
          m.fired = true;
          send(m.name);
        }
      }
    }
    lastTick = now;
  };
  window.setInterval(tick, 500);

  document.addEventListener(
    "visibilitychange",
    () => {
      tick();
      if (document.visibilityState === "visible") {
        visible = true;
        reShowCount += 1;
        send(reShowCount === 1 ? "page_visible" : "page_visible_again");
      } else {
        visible = false;
        send("page_hidden", undefined, true); // beacon: page may be going away
      }
    },
    { passive: true },
  );

  // ---- pointer / touch / click (firsts + totals + isTrusted) ----
  let firstPointerSent = false;
  const onFirstInput = (isTrusted: boolean) => {
    if (firstPointerSent) return;
    firstPointerSent = true;
    send("first_pointer_or_touch", { isTrusted });
  };
  document.addEventListener(
    "pointerdown",
    (e) => {
      stats.pointerEvents += 1;
      onFirstInput(e.isTrusted);
    },
    { passive: true, capture: true },
  );
  document.addEventListener(
    "touchstart",
    (e) => {
      stats.touchEvents += 1;
      onFirstInput(e.isTrusted);
    },
    { passive: true, capture: true },
  );

  let firstClickSent = false;
  document.addEventListener(
    "click",
    (e) => {
      stats.clickEvents += 1;
      if (e.isTrusted) stats.trustedClicks += 1;
      else stats.untrustedClicks += 1;
      if (!firstClickSent) {
        firstClickSent = true;
        send("first_click", { isTrusted: e.isTrusted });
      }
      const target = e.target instanceof HTMLElement ? e.target.closest<HTMLElement>("[data-visit-cta]") : null;
      if (target) {
        send("cta_clicked", { cta: target.getAttribute("data-visit-cta"), isTrusted: e.isTrusted });
      }
    },
    { passive: true, capture: true },
  );

  // ---- scroll: first + depth milestones (passive, rAF-throttled) ----
  let firstScrollSent = false;
  let rafPending = false;
  const depthMarks: Record<string, boolean> = { "10": false, "25": false, "50": false, "75": false, "100": false };
  window.addEventListener(
    "scroll",
    () => {
      stats.scrollEvents += 1;
      if (!firstScrollSent) {
        firstScrollSent = true;
        send("first_scroll");
      }
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const doc = document.documentElement;
        const denom = Math.max(1, doc.scrollHeight - window.innerHeight);
        const pct = Math.min(100, (window.scrollY / denom) * 100);
        if (pct > stats.maxScrollPct) stats.maxScrollPct = Math.round(pct * 10) / 10;
        for (const key of Object.keys(depthMarks)) {
          if (!depthMarks[key] && stats.maxScrollPct >= Number(key)) {
            depthMarks[key] = true;
            send("scroll_depth", { pct: Number(key) });
          }
        }
      });
    },
    { passive: true },
  );

  // ---- CTA visibility (IntersectionObserver, hero CTAs only; read-only) ----
  const seenCta: Record<string, boolean> = {};
  try {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const cta = (entry.target as HTMLElement).getAttribute("data-visit-cta");
          if (cta && !seenCta[cta]) {
            seenCta[cta] = true;
            send("cta_visible", { cta });
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll<HTMLElement>("[data-visit-cta]").forEach((el) => io.observe(el));
  } catch {
    /* IntersectionObserver unavailable */
  }

  // ---- video interactions ----
  document.querySelectorAll("video").forEach((video) => {
    const report = (type: string) =>
      send("video_interaction", { type, currentTime: Math.round(video.currentTime * 1000) / 1000 });
    video.addEventListener("play", () => report("play"), { passive: true });
    video.addEventListener("pause", () => report("pause"), { passive: true });
    video.addEventListener("ended", () => report("ended"), { passive: true });
    video.addEventListener("seeked", () => report("seeked"), { passive: true });
  });

  // ---- final snapshot on exit ----
  window.addEventListener(
    "pagehide",
    () => {
      tick();
      send("page_exit", undefined, true);
    },
    { passive: true },
  );
}
