(function () {
  "use strict";
  // Forensic visit tracker for /10-day-business-upgrade. Same pipeline as /custom-proposal:
  // POST /api/visit-events -> public.visit_events (token-protected stats at ?token=...).
  // Passive only: no PII, no form values, never blocks or breaks the page.
  var ENDPOINT = "/api/visit-events";
  var PAGE = "10-day-business-upgrade";
  var visitId = "";
  try {
    visitId = crypto.randomUUID ? crypto.randomUUID() : "v-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  } catch (e) { return; }
  var start = Date.now();
  var sent = {};

  function post(event, extra, beacon) {
    try {
      var body = JSON.stringify(Object.assign({ visitId: visitId, event: event, clientTs: new Date().toISOString() }, extra || {}));
      if (beacon && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
        return;
      }
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
    } catch (e) { /* never surface errors */ }
  }
  function once(key, fn) { if (!sent[key]) { sent[key] = true; fn(); } }

  // 1) Landing beacon: full URL + query attribution (gclid/fbclid/utm_*). Server adds IP/UA/geo/sec-fetch.
  var q = {};
  try {
    new URLSearchParams(location.search).forEach(function (v, k) { if (v.length <= 300) q[k] = v; });
  } catch (e) {}
  var utm = {};
  Object.keys(q).forEach(function (k) { if (k.indexOf("utm_") === 0) utm[k] = q[k]; });
  post("landing", {
    env: {
      page: PAGE,
      url: location.href.slice(0, 900),
      referrer: (document.referrer || "").slice(0, 900),
      query: q,
      utm: utm,
      gclid: q.gclid || null,
      fbclid: q.fbclid || null,
      screen: { w: screen.width, h: screen.height, dpr: window.devicePixelRatio || 1 },
      viewport: { w: innerWidth, h: innerHeight }
    }
  });

  // 2) Dwell: accumulated visible time, 3/5/10s milestones.
  var visibleMs = 0, lastTick = Date.now();
  function tick() {
    var now = Date.now();
    if (!document.hidden) visibleMs += now - lastTick;
    lastTick = now;
  }
  function checkTimers() {
    if (document.hidden) return;
    [[3, "visible_3_seconds"], [5, "visible_5_seconds"], [10, "visible_10_seconds"]].forEach(function (p) {
      if (visibleMs >= p[0] * 1000) once(p[1], function () { post(p[1], { currentTime: visibleMs }); });
    });
  }
  setInterval(function () { tick(); checkTimers(); }, 1000);
  var wasVisible = false;
  document.addEventListener("visibilitychange", function () {
    tick();
    if (document.hidden) post("page_hidden");
    else once("was_visible_once", function () { wasVisible = true; post("page_visible"); }) || (wasVisible ? post("page_visible_again") : post("page_visible"));
    checkTimers();
  });

  // 3) First trusted interactions.
  function first(name) {
    return function (e) { once(name, function () { post(name, { isTrusted: !!(e && e.isTrusted) }); }); };
  }
  addEventListener("pointerdown", first("first_pointer_or_touch"), { capture: true, once: true });
  addEventListener("touchstart", first("first_pointer_or_touch"), { capture: true, once: true, passive: true });
  addEventListener("click", first("first_click"), { capture: true, once: true });
  addEventListener("scroll", first("first_scroll"), { capture: true, once: true, passive: true });

  // 4) Scroll depth milestones.
  var depths = [25, 50, 75, 90, 100];
  addEventListener("scroll", function () {
    try {
      var d = document.documentElement, b = document.body;
      var h = Math.max(b.scrollHeight, d.scrollHeight) - innerHeight;
      var p = h > 0 ? Math.min(100, Math.round(((d.scrollTop || b.scrollTop) / h) * 100)) : 100;
      depths.forEach(function (dd) { if (p >= dd) once("depth_" + dd, function () { post("scroll_depth", { pct: dd }); }); });
    } catch (e) {}
  }, { passive: true });

  // 5) CTA visibility + clicks for every [data-visit-cta] element.
  try {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          io.unobserve(en.target);
          post("cta_visible", { cta: en.target.getAttribute("data-visit-cta") });
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-visit-cta]").forEach(function (el) { io.observe(el); });
  } catch (e) {}
  document.addEventListener("click", function (e) {
    try {
      var el = e.target && e.target.closest ? e.target.closest("[data-visit-cta]") : null;
      if (el) post("cta_clicked", { cta: el.getAttribute("data-visit-cta"), isTrusted: e.isTrusted === true });
    } catch (err) {}
  }, { capture: true });

  // 6) Questionnaire funnel: overlay open + success state (no form values read).
  try {
    var formOverlay = document.getElementById("formOverlay");
    if (formOverlay) {
      new MutationObserver(function () {
        if (!formOverlay.hidden) once("form_opened", function () { post("form_opened"); });
      }).observe(formOverlay, { attributes: true, attributeFilter: ["hidden"] });
      new MutationObserver(function () {
        if (formOverlay.querySelector(".success-art")) {
          once("form_success", function () { post("form_success", { currentTime: Date.now() - start }); });
        }
      }).observe(formOverlay, { childList: true, subtree: true });
    }
  } catch (e) {}

  // 7) Page loaded + exit beacon with total dwell.
  post("page_loaded", { currentTime: 0 });
  addEventListener("pagehide", function () {
    tick();
    post("page_exit", { currentTime: Date.now() - start }, true);
  }, { capture: true });
})();
