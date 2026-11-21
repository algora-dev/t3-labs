import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const slugs = [
  "roofing-website-design", "roofing-seo", "roofing-website-estimators",
  "roofing-quoting-software", "roofing-ai-website-assistants",
  "roofing-business-automation", "custom-roofing-software",
];

test("seven solutions have real discoverable routes and hub links", () => {
  const routes = read("components/t3-rebuild/solutions.ts");
  const hub = read("app/solutions/page.tsx");
  for (const slug of slugs) {
    assert.ok(existsSync(join(root, "app", slug, "page.tsx")), slug);
    assert.match(routes, new RegExp(`slug: "${slug}"`), slug);
  }
  assert.equal((routes.match(/slug: "roofing-/g) || []).length, 6);
  assert.match(routes, /slug: "custom-roofing-software"/);
  assert.match(hub, /ROOFING_SOLUTIONS\.map/);
  assert.match(hub, /itemListElement/);
  assert.match(hub, /href=\{`\/\$\{solution\.slug\}`\}/);
});

test("homepage, navigation, all six existing landing pages and footer bridge back to hub", () => {
  const home = read("components/t3-rebuild/HomepageContent.tsx");
  const outcomes = read("components/t3-rebuild/GrowthJourney.tsx");
  const header = read("components/t3-rebuild/Header.tsx");
  const landing = read("components/t3-phase3/ProblemLanding.tsx");
  const footer = read("components/t3-rebuild/MarketingFooter.tsx");
  for (const content of [home, outcomes, header, landing, footer]) assert.match(content, /\/solutions/);
  assert.match(outcomes, /Explore all roofing solutions/);
  assert.match(home, /\/custom-roofing-software/);
  assert.match(header, /site-menu-toggle/);
  assert.match(header, /aria-expanded=\{menuOpen\}/);
  assert.match(header, /aria-controls="site-menu-panel"/);
  assert.match(header, /ROOFING_SOLUTIONS\.map/);
  assert.match(landing, /rwd-v5-breadcrumb/);
  assert.match(landing, /\/custom-roofing-software/);
});

test("custom page differentiates niche offer, QuoteCore+ proof and video-ready real screenshot", () => {
  const page = read("app/custom-roofing-software/page.tsx");
  for (const phrase of ["QuoteCore+", "calculator", "several apps", "subscriptions", "own", "hosting", "VIDEO_EMBED_URL", "iframe", "case-studies/quotecore", "ready-made options"]) {
    assert.ok(page.includes(phrase), phrase);
  }
  assert.match(page, /const VIDEO_EMBED_URL = ""/);
  assert.ok(!page.includes("VideoObject"), "No structured video until there is a recording");
  assert.ok(existsSync(join(root, "public/assets/t3-phase3/hero-quotecore-desktop.png")));
  assert.ok(existsSync(join(root, "app/custom-software/page.tsx")), "Generic software page is preserved");
});

test("contact uses established working enquiry and booking paths", () => {
  const page = read("app/contact/page.tsx");
  assert.match(page, /href="\/free-review"/);
  assert.match(page, /BOOK_CALL_URL/);
  assert.match(page, /insights@t3labs\.tech/);
});

test("sitemap includes new routes and avoids inherited homepage canonical", () => {
  const sitemap = read("app/sitemap.ts");
  const seoLib = read("lib/roofing-service-seo.ts");
  const layout = read("app/layout.tsx");
  const hub = read("app/solutions/page.tsx");
  const custom = read("app/custom-roofing-software/page.tsx");
  const contact = read("app/contact/page.tsx");
  // Final URL policy (2026-11-16): curated primaryPaths sitemap with CANONICAL_ORIGIN from the SEO lib.
  assert.ok(seoLib.includes("https://www.t3labs.tech"), "canonical origin lib");
  for (const slug of ["solutions", "custom-roofing-software", "contact"]) {
    assert.ok(sitemap.includes('"' + slug + '"'), slug);
  }
  // Retired routes must not be listed: roofing-business-tools is now a permanent 308 to /solutions.
  assert.ok(!sitemap.includes('"roofing-business-tools"'), "retired slug must not be in sitemap");
  assert.ok(!/alternates:\s*\{\s*canonical:\s*BASE_URL/.test(layout));
  for (const page of [hub, custom, contact]) assert.match(page, /alternates:\s*\{\s*canonical:/);
});
