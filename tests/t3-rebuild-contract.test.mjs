import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = path => readFileSync(join(root, path), "utf8");

test("Approved V18 homepage copied into real TSX with native disclosure controls", () => {
  const html = file("components/t3-rebuild/HomepageContent.tsx");
  for (const text of ["Better enquiries.", "More jobs won.", "MEET THE PEOPLE BEHIND THE TOOLS", "01 / QUICK ESTIMATORS", "02 / SMART ASSISTANTS", "03 / QUOTING TOOLS", "04 / 10-DAY ROOFING BUSINESS UPGRADE"]) {
    assert.ok(html.includes(text), text);
  }
  assert.equal((html.match(/t13-tool-details/g) || []).length, 3);
  assert.equal((html.match(/t10-package-details/g) || []).length, 3);
  assert.match(html, /href="\/free-review\?focus=/);
  assert.ok(!html.includes("data:image"));
  assert.ok(!html.includes("—"), "No em dashes in approved UI copy");
});

test("Homepage styles are scoped away from original marketing/demo routes", () => {
  const css = file("app/t3-rebuild.css");
  assert.ok(css.includes(":where(.t3-rebuild) .hero"));
  assert.ok(css.includes(":where(.t3-rebuild) #review-page"));
  assert.ok(css.length > 50000);
});

test("Review page preselection, real server submission and Calendly booking are wired", () => {
  const review = file("components/t3-rebuild/FreeReview.tsx");
  const topics = file("components/t3-rebuild/review-topics.ts");
  const api = file("app/api/free-business-review/route.ts");
  assert.match(review, /fetch\("\/api\/free-business-review"/);
  assert.match(review, /Send my enquiry/);
  assert.match(topics, /https:\/\/calendly.com\/insights-t3labs\/20-minute-meeting/);
  assert.match(api, /insights@t3labs\.tech/);
  assert.ok(!review.includes("mailto:"));
  assert.equal((review.match(/within 48 hours/g) || []).length, 2, "Only the route prompt and submitted confirmation mention 48 hours");
});

test("Every new JSX asset exists in public directory", () => {
  const markup = file("components/t3-rebuild/HomepageContent.tsx");
  for (const [, name] of markup.matchAll(/src="(\/assets\/t3-rebuild\/[^"]+)"/g)) {
    assert.ok(existsSync(join(root, "public", name.slice(1))), name);
  }
});
