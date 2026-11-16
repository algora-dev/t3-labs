> **FINAL RELEASE:** This is historical/background documentation. For approved live/retired/noindex URL decisions and agent instructions, see [`FINAL-SEO-RELEASE.md`](FINAL-SEO-RELEASE.md).

# T3 Labs — Phase 2 SEO/content quality pass

**Date:** 16 November 2026  
**Baseline:** `T3Labs-roofing-website-phase1-full-codebase.zip`  
**Deployment status:** Ready for agent review and integration, **not production-build verified**.

## The scope / non-negotiables

- No route or public page was deleted; no slug was changed; no redirect was introduced.
- Existing referral, proposal, business-audit, pricing-calculator and 10-day campaign experiences were preserved.
- No marketing page was newly marked `noindex`. Changing sitemap selection alone does **not** deindex an existing page.
- Preserved the shared homepage / V18 / 10-day design language: dark ink sections, lime accent, pale supporting sections, simple cards and responsive typography.
- No customer conversion rates, rankings, fabricated testimonials or unverified video transcript were added.

## Changes delivered

1. **Six roofing service pages — genuinely differentiated answers.** `components/t3-phase3/service-guides.ts` supplies each of the six pages with a unique guide, owner-oriented checklist, 3-step explanation, decision rule and practical success metrics. `ProblemLanding.tsx` renders the new section using updated `problem-landing.css`, with mobile breakpoints.
2. **Search-intent metadata, centralised.** `problem-pages.json` is now the single reviewed metadata copy source for the six pages, `lib/roofing-service-seo.ts` supplies metadata, canonical paths and the service key mapping. Page route components are smaller and consistent. Titles explicitly address roofing business owners/contractors.
3. **Curated public XML sitemap.** `app/sitemap.ts` lists homepage, solutions, seven roofing services, QuoteCore+ case study, blog, contact, free review and five selected roofing articles. Generic AI, sales, pricing, proposal and campaign pages still work but are no longer *promoted* via the sitemap. `lib/roofing-content.ts` holds the five featured blog slugs. **Important: Google can still find/index pages excluded from a sitemap.**
4. **More accurate structured data.** Removed an overly broad sitewide `Service` JSON-LD block from `app/layout.tsx`, while retaining sitewide Organisation and WebSite definitions and the appropriate page-level Service schema.
5. **Existing video, lighter initial load.** `/solutions` retains YouTube ID `FIqNbi3bG7A` but uses a click-to-play placeholder. The YouTube iframe only loads after a visitor chooses to play. This is a video *open intent* event, not an actual watch/completion measurement. Video content was not externally verified.
6. **Real supporting imagery.** Added two pre-existing T3 Labs roofing software demo screenshots to the QuoteCore+ case study, captioned honestly as illustrative interface assets, not results or promises.
7. **High-priority roofing articles.** Expanded the two relevant GSC non-indexed articles with specific review checklists, source-compatible practical guidance and links to relevant service/case-study pages. Their modified dates were set to the date of these substantive changes. Generic archive articles still exist; on `/blog` they are now accessible under an optional expandable archive below the core roofing articles.
8. **Roofing-branded social preview.** Added `public/og-roofing.png` (1200×630), reusing the existing T3 Labs brand artwork and dark/lime visual language. Connected to global and core public page Open Graph metadata. Original `og-image.png` preserved.
9. **Conversion interaction events.** Added consent-aware, data-minimised `TrackedLink` and `marketing-analytics` helpers for demo clicks, solutions-to-service transitions, free-review clicks, booking clicks, video-open intent and successful review form submissions. Events do not include email, names, websites, query strings, full URLs or proposal IDs. An existing explicit `essential` consent choice suppresses custom events. The existing consent-default policy was not changed and requires an owner/privacy review.
10. **Accuracy fix.** In the solutions hub, softened an unverified claim that the external RoofHub site is definitely a client website. Verify the relationship and availability before adding stronger proof.
11. **Expanded regression tests.** Ten file-based tests cover route preservation, service guides, sitemap curation, schema boundaries, image assets, conversion hooks, video gate, and legacy campaign/referral integrity.

## URLs: change / preservation policy

| Group | Paths | Outcome |
|---|---|---|
| Improve, keep eligible for search | `/`, `/solutions`, six `/roofing-*` service routes, `/custom-roofing-software`, `/case-studies/quotecore`, `/blog`, `/free-review`, `/contact` | Retained; targeted changes above |
| Improve relevant articles | Five featured `/blog/<slug>` pages | Two edited, all five featured and included in sitemap |
| Legacy generic marketing | `/ai-help`, `/ai-consultancy`, `/ai-automation`, `/ai-implementation`, `/ai-training`, `/custom-software`, `/our-solution`, `/roofing-solutions`, `/roofing-business-tools` | Remain live; no new noindex or redirect; omitted from sitemap |
| Sales and campaign | `/pricing-calculator`, `/business-audit`, `/sales-hub`, `/sales-resources`, `/qcp-careers`, `/careers`, `/10-day-business-upgrade` campaign asset | Unchanged where present; omitted from curated sitemap |
| Referred/private | `/hello/[slug]`, `.../referred`, `/custom-proposal`, `/proposal/*` and sales-specific routes | Unchanged; no access-control/indexing-policy changes; full project may contain additional routes not in this marketing-only extraction |
| Blog archive | Eight non-core general AI/software posts | Remain live and potentially indexable; collapsed below roofing articles; omitted from curated sitemap |

No changes to `/robots.txt` or route `noindex` tags in Phase 2. Later changes require approved performance/backlink review and careful protection of customer proposals.

## Verified vs unverified

**Passed:** 10/10 dependency-free regression tests; TypeScript/TSX syntactic parsing of 21 modified code modules; referenced image files exist and actual dimensions checked; preservation of old route files.  
**Not passed/available:** `npm ci` cannot complete in this environment (registry fetch stalls / cache misses). Consequently there is **no validated full Next.js production build, dependency-linked TypeScript typecheck, ESLint result, live video/website crawl, QA browser screenshot, Lighthouse report, form-delivery test, external demonstration check or measured GSC ranking uplift.**

## Decisions/verification required before deploying

1. Confirm that the existing YouTube overview `FIqNbi3bG7A` still accurately matches today's services. Do not add a transcript without a verified transcription.
2. Check the demo URLs, QuoteCore+ URLs and RoofHub external page; confirm any client relationship and obtain consent for displaying project names/screens.
3. Approve the primary market and public pricing policy before geo-specific content work; existing USD/NZ/UK references were not silently changed.
4. Review GA4 analytics consent defaults, privacy statements and event purposes with the site's privacy owner.
5. Verify these demo screenshots are suitable for public publication and still reflect the product direction.
6. Obtain GSC Performance exports (URL + queries + clicks and impressions), the indexed URL inventory, backlinks and conversion baseline before deindexing or deleting generic pages.
7. Run the full project build and end-to-end QA in the deployment agent's full repository, including the proposal/customer routes excluded from this marketing extraction.

## Rollout and measurement

Deploy the improved content and sitemap, verify resulting `robots`, rendered canonical and JSON-LD for core pages, then monitor GSC page status/queries and GA4 qualified-enquiry events for 4–8 weeks. Crawlability and useful content are prerequisites, not ranking guarantees. Page removal, redirects, `noindex` of existing marketing pages and confidential-route gating remain a later approval-gated phase.

### External documentation used for the approach

- Google sitemap basics: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google AI search basics: https://developers.google.com/search/docs/appearance/ai-features
- Google generative AI content guidance (2026): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
