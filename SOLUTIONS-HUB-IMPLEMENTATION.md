# T3Labs Roofing Solutions Discovery Update

Prepared 14 November 2026. This is a change set for the supplied **compact Next.js source snapshot**, not the current production GitHub HEAD.

## New routes

| URL | Purpose |
|---|---|
| `/solutions` | Search-friendly, server-rendered hub featuring seven direct links to specialist roofing solutions |
| `/custom-roofing-software` | Roofing-specific custom development page, from one calculator to a QuoteCore+-scale system; future video slot |
| `/contact` | General T3Labs contact page using the established Free Review, Calendly and email destinations |

The six existing roofing marketing pages, the broad `/custom-software` page, the existing `/roofing-solutions` demo, the form and the QuoteCore+ case study remain intact.

## Updated navigation and discovery

- Updated `components/t3-rebuild/Header.tsx`: the menu is available on desktop and mobile, closes when a link is selected, by outside click, and with Escape. It includes homepage sections, all seven solution pages, contact, blog, and proof.
- Updated homepage (`HomepageContent.tsx`) with a `solutions` hub hero link, a small seven-solution bridge card, specific contextual links to six existing roofing solution pages, custom software link, and expanded footer.
- Updated `ProblemLanding.tsx`: breadcrumb link to `/solutions`, direct links back to the hub and to the custom roofing route, footer contact/hub links.
- Added shared `ROOFING_SOLUTIONS` data module, hub JSON-LD ItemList, specialist service and breadcrumb structured data.
- Updated sitemap with `/solutions`, `/custom-roofing-software`, `/contact` and the existing indexable `/roofing-business-tools` route.
- Removed the root-layout **homepage canonical fallback**. Individual pages with their own canonical, including the homepage and all seven specialist pages, retain explicit canonical metadata. A fallback canonical of `/` on unrelated routes was misleading.

## Video handoff

The custom page currently shows a genuine existing product screenshot at the beginning of the page. **There is no actual video included, no fake play button and no VideoObject schema.** Once the approved walkthrough is provided:

1. Set `VIDEO_EMBED_URL` in `app/custom-roofing-software/page.tsx` to the trusted HTTPS embed URL, or replace this placeholder with a local hosted video and accessible controls.
2. Verify the video plays on desktop and mobile; provide captions/transcript and a meaningful thumbnail.
3. Only then add video structured data if it is accurate and supported by the actual published media.

## Copy and commercial review

The proposed US$4,000 to US$5,000 annual subscription scenario is **illustrative**; it is not a claim about typical customer expenditure or a guaranteed saving. The page explicitly says custom software may incur implementation, hosting, maintenance, API and other running costs. A business-owned solution is framed as **subject to contract**, with third-party licensing clarified. Approve copy and ownership terms before production.

## Verification in this isolated archive

- New solution discovery test added: `tests/solutions-discovery.test.mjs`.
- 19 focused tests passed (the new discovery checks plus V18 homepage/email and Phase 3 V4/V5 contracts).
- All changed/new TS/TSX modules passed TypeScript's syntax transpilation step.
- **Not run:** full `npm ci`, project typecheck, project ESLint, `next build` and in-browser rendered QA. The npm registry is not resolvable in this environment and the source package does not include `node_modules`. The original handoff also notes some unchanged production media was omitted.
- **Not verified:** live `Resend` delivery, Calendly response, actual Google indexing, current GitHub version, deployment.

## Merge, test and release checklist

1. Pull your current GitHub `main`, create a feature branch, and merge **only these new and changed files**. The source snapshot was based on the 11 November handoff. Do **not** replace a live repository wholesale; preserve all later work, missing legacy media and any production changes.
2. Review conflicts in `app/layout.tsx`, `app/sitemap.ts`, `app/t3-rebuild.css`, `components/t3-rebuild/Header.tsx`, `components/t3-rebuild/HomepageContent.tsx`, `components/t3-phase3/ProblemLanding.tsx` and its stylesheet.
3. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm test` in the current repo.
4. Visually check homepage, expanded navigation, hub, all seven specialist pages, and contact at 320, 390, 768 and 1440px. Test keyboard navigation, Escape, focus, mobile overflow and About disclosure from hash links.
5. Verify all links, canonical tags, robots directives, `sitemap.xml`, existing `/roofing-solutions` and `/custom-software` and the demo routes. Submit/refresh sitemap in Google Search Console and inspect new URLs after publishing.
6. Confirm email and booking journeys and review claimed commercial terms before publishing.
7. Deploy to staging, approve, and only then merge/deploy to production.

There is no SEO ranking guarantee simply because pages are newly linked. Actual search performance needs measurement in Search Console after production release.
