# Indexing, redirects and URL retirement: deferred plan

This document is **advice for a later release, not an instruction to deploy redirects or delete files now**. `URL-DECISIONS.csv` is the route-level source of truth for the proposed actions. No indexing directives, sitemap rules, slug paths or page deletion changed in phase 1.

## Source evidence and limits

- Original extracted codebase from full repo base commit `394d718`, November 16, 2026.
- GSC coverage rollup reported 21 indexed and 21 non-indexed pages, with 10 crawled/not indexed, 6 discovered/not indexed and 5 redirects. These are aggregate index counts, not a ranking/quality diagnosis.
- URL-level drilldowns list `/our-solution` and `/ai-help` as *crawled, not indexed*, and `/pricing-calculator`, `/blog`, `/qcp-careers` as *discovered, not indexed*. They do **not** include the complete Indexed URLs list. Absence from drilldown is not proof of indexing.
- Roof-focused `/blog/building-quotecore-roofing-trade-software` and `/blog/ai-roofing-estimation-what-ai-can-do` are crawled/not indexed. The blog index is discovered/not indexed. Improve internal links and actual helpfulness, then measure; do not assume Google will index immediately.
- The extracted ZIP excludes production `/proposal/*` micro-sites, `/demo/*` implementations, dashboards and some backend apps. Their real indexing/security controls must be checked in the full repo.

## Index policy when phase 1 is validated

**Core indexable:** `/`, `/solutions`, six specialist roofing services, `/custom-roofing-software`, `/case-studies/quotecore`, `/free-review`, `/contact`, `/blog`, and selected roofing-specific articles. Every indexable route needs unique, useful content, a self-canonical, descriptive title/H1, accessible internal links and an applicable sitemap entry.

**Keep live but noindex when justified:** referral/proposal variants and sales-only campaign tools. A `robots` directive, implemented as Next.js route metadata or an equivalent HTTP `X-Robots-Tag`, must be crawlable by Google to take effect. Do not block the route with `robots.txt` while relying on an in-page `noindex`. A secret or personally identifying proposal must be protected by authorisation or access controls, since a `noindex` tag is *not* security.

**Retire in the final release:** the five generic AI marketing pages, general `/custom-software` and three overlapping public solutions/tools pages after all useful text/video/demos are preserved. Use permanent 301 only where a close semantic replacement genuinely meets visitor intent. Otherwise respond with 404 or 410. Do not mass-redirect unrelated AI landing pages to `/`.

**Do not conflate sitemap and indexability:** removal from `sitemap.xml` alone does not deindex a URL. A redirected URL can leave the sitemap once the 301 is live. Indexable legal/policy URLs may remain accessible without being prominent in navigation; final handling needs legal review.

## Recommended later update order

1. Obtain GSC *Indexed* URLs, URL Inspection samples, 12–16 months of search performance by page/query and top linked pages. Check GA4 qualified enquiries and direct/referral usage. Preserve valuable URLs until replacement intent is clear.
2. Verify customer-specific routes: proposal slugs, referral links, active sales materials and the separate business-audit application's needs.
3. Confirm the final URL inventory and redirect map in `URL-DECISIONS.csv` with the owner. Resolve decisions on geography/currency, campaign pages and any one-to-one replacement content.
4. Consolidate remaining material from `/our-solution`, `/roofing-business-tools` and `/roofing-solutions` into the canonical services; preserve current video source `FIqNbi3bG7A` and separately review any additional demos.
5. Implement redirects, 410/404 responses or scoped `noindex` as agreed. Only then delete obsolete route components and unused assets; do not delete shared components that referred routes still import.
6. Update `app/sitemap.ts`, `app/robots.ts`, navigation, article body links, canonical/OG references and any legacy internal links. Make sure a `robots.txt` disallow does not prevent Google from seeing required `noindex` directives.
7. Build and test full site and run a crawler on deployed URLs. Check 200/301/404 outcomes; canonical tags; sitemaps; video; external demos; mobile; forms; accessibility; SEO titles; JSON-LD; security and page speed.
8. Monitor GSC indexing and qualified enquiries weekly after rollout. Record baseline and 4/8/12-week outcomes. Indexing is not the same as traffic, relevant leads or conversions.

## Business/creative decisions for owner review

1. Main sales territories and displayed currency. Existing code mixes global markets, USD offers and UK-specific articles. Do not silently replace commercial offers with inferred prices.
2. Whether `/pricing-calculator` and `/business-audit` should remain public direct-link experiences, limited access tools, or be retired later.
3. Which proposal/referral pages require confidential access. `noindex` is not sufficient if the URL exposes personalised pricing or customer details.
4. Whether existing video `FIqNbi3bG7A` accurately covers the full message above. Its content could not be played in this offline environment. Record any approved title, transcript or thumbnail later.
5. Which old general AI pages have valuable inbound links, leads or search rankings. Do not delete before inspecting their Google traffic and true semantic replacements.

## Separate conversion and quality measurement

- Homepage: click-through to `/solutions`, relevant service pages and `/free-review`.
- Solutions hub: selected outcome/service, video play (privacy consent as needed), demo and review clicks.
- Specialist service pages: demo interactions, qualified review starts and completed contacts by focus topic.
- Blog: organic sessions progressing to relevant services, not just page views.
- Review form: successful submissions, qualified bookings and sales outcome. Never send private notes or proposal IDs to general-purpose analytics.
- Baseline and performance targets must be agreed from real GA4/GSC/CRM data; no improvement percentages are invented in this code patch.
