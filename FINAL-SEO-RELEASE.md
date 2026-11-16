# T3 Labs — Final roofing-first website release and URL policy

**Decision date:** 16 November 2026  
**Base:** Phase 2 full marketing extraction, originally based on T3 Labs' supplied marketing repository.  
**Implementation:** URL changes are **already coded** in this release. This is not a speculative proposal.  
**Goal:** Make the public search footprint consistently address roofing business owners who want better-fit leads, faster estimates and quotes, more won work, better follow-up, and less admin.

> **Scope caveat:** The supplied codebase is a *marketing-only extraction*, not the entire live production repository. Some proposal URLs, demonstration systems, dashboards and external integrations are not included. The release is agent-ready for integration, but is **not a production-build-verified drop-in replacement for the full repository**. Merge the patch into the actual application; do not upload this extraction over the complete repository and overwrite excluded business-critical code.

## 1. Executive decision (final)

- **18 URLs** should remain **public, eligible for indexing, and listed in the sitemap**: 13 principal pages and 5 relevant roofing guides.
- **9 legacy public service/overview URLs** should be **retired**. **5 get exact permanent 308 redirects** to genuinely relevant roofing pages; **4 return 404** because there is no close replacement. (Next.js implements `permanent: true` as **308**, not 301.)
- **8 older general AI/software blog articles** stay reachable by an existing link but are **noindex**, removed from the blog index, and excluded from the sitemap.
- **Referral, proposal, campaign, administrative, recruiting, legal and sales pages** remain reachable in their intended workflows but are **noindex**. These are *not* public organic-search landing pages. `noindex` does **not** protect customer confidentiality.
- **No indexed slugs change.** The video (`FIqNbi3bG7A`) now lives on `/solutions`. The original public `/our-solution` retires; `/our-solution/referred` survives untouched.

**This decision is independent of waiting for a live deployment.** What still requires a deployed build is *verification that the intended HTTP status, metadata and headers are actually served*, not a new round of strategic decisions.

## 2. PUBLIC / INDEXABLE — keep and improve (18)

All paths are relative to `https://www.t3labs.tech`.

| URL | Purpose and work already incorporated |
|---|---|
| `/` | Roofing-first homepage, clear commercial proposition, teams' introduction and links to solutions/review (Phase 1/2). |
| `/solutions` | Main four-outcome hub; reuses existing 90-second video; explains how enquiries, measuring, quotes and follow-up connect (Phase 1/2). |
| `/roofing-website-design` | Distinct guide for contractor website conversion (Phase 1/2). |
| `/roofing-seo` | Search visibility and better-qualified roofing leads (Phase 1/2). |
| `/roofing-website-estimators` | How indicative prices and useful inputs improve enquiries (Phase 1/2). |
| `/roofing-ai-website-assistants` | Better answers and enquiry capture with human oversight (Phase 1/2). |
| `/roofing-quoting-software` | From quantities and pricing to quote output and follow-up (Phase 1/2). |
| `/roofing-business-automation` | Remove repetitive admin and follow up faster (Phase 1/2). |
| `/custom-roofing-software` | Bespoke integrated workflows, not generic software agency claims (Phase 1/2). |
| `/case-studies/quotecore` | Trade product proof, real interface imagery, implementation examples (Phase 2). |
| `/blog` | Roofing guides hub; **final release removes public links to unrelated AI archive**. |
| `/free-review` | Main qualified lead-generation destination (Phase 1/2). |
| `/contact` | Simple contact alternative (Phase 1). |
| `/blog/custom-roofing-software` | Topic-matched practical guide. |
| `/blog/building-quotecore-roofing-trade-software` | Product-build story with trade-relevant experience (Phase 2 enhanced). |
| `/blog/ai-roofing-estimation-what-ai-can-do` | Realistic AI estimating capabilities and limitations (Phase 2 enhanced). |
| `/blog/can-ai-write-my-quotes` | Contractor quoting use case. |
| `/blog/branded-calculators-lead-generation-tools` | Better website enquiry capture and customer self-service. |

**SEO expectation:** HTTP 200, self-canonical, useful visible content, internal links and inclusion in `/sitemap.xml`; **no noindex**. "Eligible for indexing" is an intention, not a claim that Google currently indexes the page or that the page will rank. The only supplied GSC datasets were coverage and two non-indexed drilldowns, not the complete indexed-URL or query-performance export.

## 3. RETIRED URLS — exact behaviour implemented (9)

### 3A. Permanent redirects (5)

| Retired URL | Destination | Why |
|---|---|---|
| `/ai-automation` | `/roofing-business-automation` | Directly related subject with the new specialised offer. |
| `/custom-software` | `/custom-roofing-software` | Genuine service successor, now industry-specific. |
| `/our-solution` | `/solutions` | Overview content and the existing video are now integrated into the main hub. |
| `/roofing-solutions` | `/solutions` | Duplicated public roofing overview. |
| `/roofing-business-tools` | `/solutions` | Overview plus relevant tools have been represented in the hub and specialist service pages. |

**HTTP response:** Next.js permanent **308**. Redirect exact old URLs **only**. Do **not** redirect `/our-solution/referred`, `/roofing-solutions/referred`, or `/roofing-business-tools/referred`. They are distinct, functioning sales experiences.

### 3B. Removed without a close replacement (4)

| Retired URL | HTTP response | Why |
|---|---|---|
| `/ai-help` | 404 | Generic AI offer selection, no equivalent specialised roofing intent. |
| `/ai-consultancy` | 404 | General consulting service, not one-to-one equivalent to roofing services. |
| `/ai-implementation` | 404 | Broad AI implementation offer; no honest close replacement. |
| `/ai-training` | 404 | Team AI training is not a core roofing technology offer. |

These four have **minimal `notFound()` route stubs** in the release rather than broad redirects. This returns a real 404 and avoids misleading homepage redirects. Their previous full source is preserved in the supplied Phase 2 archive for rollback. The redirect-source pages also remain in the source tree as dormant fallback implementations; Next.js redirects intercept requests before routing. **No redirect to `/` has been added for this retirement set.**

> The existing, pre-Phase-3 `next.config.ts` contains older retired proposal/demo redirects to `/`. These have deliberately been left unchanged to avoid altering customer-specific workflows without a complete production inventory. They are recorded in `docs/FINAL-URL-REGISTER.csv` as *existing redirects*, not new recommended SEO mappings.

## 4. LIVE BUT NOINDEX — direct link / hidden / administrative

These pages stay on the site. Search engines can find their URLs, but are instructed not to index the contents. They may still be accessible to anyone with the URL; authentication is needed for genuine privacy.

### 4A. Proposal, referral and sales-specific

- `/our-solution/referred`
- `/roofing-solutions/referred`
- `/roofing-business-tools/referred`
- `/pricing-calculator/referred`
- `/hello/[slug]` (all configured outreach slugs)
- `/custom-proposal`
- `/proposal/*` (**full production repository must be checked**; individual proposal implementations excluded from extraction)
- `/sales-hub`
- `/sales-resources`
- `/qcp-careers`

The three referred routes are preserved with their own existing content and metadata. The logo link on `/roofing-business-tools/referred` is updated to lead to `/roofing-solutions/referred`, rather than sending referral visitors into a retired public overview. No referral route receives a parent wildcard redirect.

### 4B. Campaigns, tools, recruiting, dashboard

- `/pricing-calculator` (direct-link indicative calculator; do not delete functionality)
- `/business-audit`, including `/business-audit/contact`, `/success`, `/privacy`, `/terms`, `/cookies`, `/cookie-preferences`
- `/10-day-business-upgrade` (live campaign; noindex **does not** impair direct traffic or sharing)
- `/roofing-upgrade/landing` (the underlying standalone HTML file; noindex too)
- `/careers`
- `/dashboard/*` (authenticate; not a public marketing surface)

There is an existing redirect `/roofing-business-upgrade` → `/10-day-business-upgrade`, retained unchanged.

### 4C. Legal pages — accessible, not organic landing pages

- `/privacy`
- `/cookies`
- `/terms`
- `/service-terms`
- `/website-package-terms`

Legal page content and links are preserved; only the search eligibility is changed.

### 4D. Older blog archive — 8 URLs stay live but noindex

- `/blog/ai-consultancy-cost-uk`
- `/blog/ai-consultancy-training-automation-or-build`
- `/blog/chatgpt-says-this-can-be-automated`
- `/blog/what-can-ai-actually-do-for-a-small-business`
- `/blog/i-have-an-ai-idea-but-cant-code`
- `/blog/does-ai-make-software-development-cheaper`
- `/blog/human-in-the-loop-ai-when-should-a-person-check`
- `/blog/custom-software-development-cost-uk`

These articles **are not deleted**. Direct links still open them with HTTP 200; the public `/blog` landing page no longer features them, and `app/blog/[slug]/page.tsx` adds `robots: { index: false, follow: true }` to non-featured articles.

## 5. What is already coded, exactly

| File(s) | Change | Why |
|---|---|---|
| `config/seo-url-policy.ts` | Central declarations for 5 exact redirects, 4 retired 404 routes, 24 noindex header patterns. | One explicit, reviewable source of route lifecycle policy. |
| `next.config.ts` | Adds exact-path 308 redirects and `X-Robots-Tag` HTTP headers to hidden pages. | Preserves referral children; makes standalone campaign noindex. |
| `app/ai-help/page.tsx`, `app/ai-consultancy/page.tsx`, `app/ai-implementation/page.tsx`, `app/ai-training/page.tsx` | Replace general AI landing pages with actual 404 components. | No misleading one-size-fits-all redirects. |
| `app/robots.ts` | Removes crawl blocking of `/hello/`, `/proposal/` and `/sales-resources`, leaving API/admin restrictions. | Google must be allowed to fetch a page to observe `noindex`; do **not** mistake this for privacy protection. |
| `app/pricing-calculator/layout.tsx`, `app/business-audit/layout.tsx`, `app/careers/page.tsx`, `app/qcp-careers/page.tsx` | Adds / changes noindex metadata. | Keep directly usable tools and recruitment out of search. |
| `app/our-solution/layout.tsx`, `app/roofing-solutions/layout.tsx`, `app/roofing-business-tools/layout.tsx` | Makes parent layouts noindex and removes canonical inheritance to retired parents. | Avoid conflicting signals on surviving `/referred` children. |
| Five legal pages under `app/` | Adds noindex metadata. | Keep policies readable without adding unrelated indexable pages. |
| `public/roofing-upgrade/landing.html` | Adds robots noindex metadata (in addition to response header). | Handles standalone HTML campaign. |
| `app/blog/page.tsx` | Removes older general AI/software archive from visible blog directory. | Consistent roofing knowledge hub. |
| `app/blog/[slug]/page.tsx` | Selective per-article indexing. | Retains direct-link archives, prioritises five roofing posts. |
| `lib/assistant-t3/prompt.ts` | Replaces retired service links/old generic positioning with actual roofing services and existing canonical URLs. | On-site assistant should not send visitors to 404s or retired pages. |
| `components/t3-home/ai-services-section.tsx` | Updates currently unused legacy component's links/copy to roofing-specific services. | Avoid accidental reintroduction of retired links. |
| `app/roofing-business-tools/referred/page.tsx` | Fixes referred brand navigation. | Keep representative-shared workflow intact. |
| `tests/url-policy.test.mjs`, `tests/marketing-content.test.mjs` | 17 dependency-free regression tests. | Safeguard content, redirects and hidden paths. |
| `docs/FINAL-URL-REGISTER.csv`, `scripts/check-deployed-urls.mjs` | Detailed decision inventory and live smoke-check script. | Operational handoff, verification and accountability. |

**Phase 1/2 work is cumulative in the full-codebase package**, including the video placement, practical service guidance, QuoteCore+ case study screenshots, OG image, metadata, sitemap and analytics events. See `PHASE2-CHANGES.md` for earlier details. This final phase does not change any indexed slug or visually redesign existing pages.

## 6. Deployment steps for implementation agent

1. **Protect the full repository.** Create a branch and backup the current deployment. Locate active full-repo proposal implementations and external demos before merging. Check original commit / recent production changes against this supplied marketing extraction.
2. **Choose the right artifact.** If Phase 2 is already integrated, overlay `T3Labs-final-over-phase2-agent-patch.zip`. Otherwise merge the **cumulative** `T3Labs-final-cumulative-agent-patch.zip` (Phases 1 + 2 + final) into the *actual full production repo*. Extract the selected ZIP outside the repository, inspect the diff, and then copy in its relative files without deleting anything else:

   ```bash
   mkdir -p /tmp/t3-release
   unzip T3Labs-final-cumulative-agent-patch.zip -d /tmp/t3-release
   # Substitute your ACTUAL Next.js project root below. DO NOT reverse source/destination.
   rsync -av --dry-run /tmp/t3-release/t3-labs-marketing/ /path/to/production-repo/
   # Only after reviewing the changes and creating a git branch / backup:
   rsync -av /tmp/t3-release/t3-labs-marketing/ /path/to/production-repo/
   ```

   If Phase 2 is already in your repo, substitute the smaller over-Phase-2 ZIP in the unzip line. The full-codebase ZIP is for inspection/reference, **not** a replacement for missing full-repo routes. Do not blindly overwrite newer, unreviewed production modifications.
3. **Preserve environment variables and integrations.** Do not overwrite `.env*`, dashboard, proposal middleware, production demo apps, CRM/email handlers, payment configuration or credentials.
4. **Run commands** on an environment with working dependency access:

   ```bash
   npm ci
   npm run test
   npm run typecheck
   npm run lint
   npm run build
   npm run start
   # In another terminal, smoke-test against local running build:
   node scripts/check-deployed-urls.mjs http://localhost:3000
   ```

5. **Review the real HTTP responses** (not merely `next.config`): public 200s; all five 308 redirects and Location targets; four 404 responses; exact referred 200s; noindex response headers or metadata; 18 sitemap URLs. Confirm `/robots.txt` does not block pages expected to present `noindex`.
6. **Test critical workflows:** free review form and email/CRM delivery, all referred variants, `hello` outreach slugs, live proposals, business audit and checkout callback, calculator, 10-day offer CTAs and availability endpoint, booking links, YouTube video, custom demo links, mobile and keyboard navigation.
7. **Security checks:** `noindex` is not authentication. Ensure any proposal exposing customer names, financials, personal data or private pricing is behind proper access controls. `/sales-resources` may warrant staff authentication. Review existing public-facing analytics consent handling.
8. **Do a staging crawl** with allowlist of known routes and `curl -I`/URL inspection. If any unexpected redirect from `/.../referred`, rollback rather than deploying.
9. **Deploy as one coordinated release** once checks pass. Re-submit sitemap, inspect known pages in GSC, and monitor rankings and qualified enquiries. Removing legacy URLs from GSC is not instantaneous.

### Required acceptance URLs

```text
/indexable:   /  /solutions  /roofing-seo  /roofing-website-design
              /roofing-website-estimators  /roofing-quoting-software
              /roofing-ai-website-assistants  /roofing-business-automation
              /custom-roofing-software  /case-studies/quotecore
              /blog  /free-review  /contact  plus 5 roofing articles
redirect:     /ai-automation -> /roofing-business-automation (308)
              /custom-software -> /custom-roofing-software (308)
              /our-solution -> /solutions (308)
              /roofing-solutions -> /solutions (308)
              /roofing-business-tools -> /solutions (308)
gone:         /ai-help, /ai-consultancy, /ai-implementation, /ai-training (404)
noindex:      /our-solution/referred, /roofing-solutions/referred,
              /roofing-business-tools/referred, /pricing-calculator/referred,
              /pricing-calculator, /business-audit, /sales-hub, /sales-resources,
              /qcp-careers, /careers, /custom-proposal, /10-day-business-upgrade,
              older 8 AI/software articles; see CSV for complete inventory
``` 

## 7. What this package does not prove / residual tasks

- A successful **production Next.js build** has **not** been obtained in this environment: the package dependency installation was unavailable. Source syntax and 17 regression tests passed, but **integration/type/lint/build/runtime testing is mandatory**.
- The original code extraction **excluded some proposal and demo implementations**, so the agent must verify these direct-link routes and any existing access controls in the actual repo.
- There is **no complete GSC indexed-URL inventory or URL-level search performance** in the provided exports. The strategy is based on current content/intent, not a claim that a retired URL has zero backlinks or historical conversions. If production analytics reveal a high-value exception, preserve the content in a suitable canonical roofing destination rather than blindly forcing a broad redirect.
- The existing video ID is taken from the code; the spoken contents and captions have not been editorially verified. Do not invent a transcript.
- Search inclusion, AI citations and increased enquiries cannot be guaranteed. The measurable outcomes should be checked after deployment (qualified leads, pages indexed, impressions/clicks from relevant queries, demo-to-enquiry conversion).

## 8. Rollback and cleanup

- Rollback = redeploy the previous production commit and restore the previous redirects and headers. The original and Phase 2 archives retain older source for comparison.
- **No physical deletion of shared referred pages, demo assets or APIs** is performed in this package. After a stable release, source-only cleanup can remove dead marketing implementations and unused assets once the agent proves they are not imported by referral routes.
- The current exact redirect map is authoritative; do not change slugs or mass-redirect legacy AI URLs to the homepage without a new content/intent review.

## 9. Source context and technical references

GSC November 16 export: **21 indexed, 21 not indexed**, including 10 *Crawled – currently not indexed*, 6 *Discovered – currently not indexed*, and 5 *Page with redirect*. The drilldowns listed `/our-solution` and `/ai-help` as crawled/not indexed; `/pricing-calculator`, `/blog`, `/qcp-careers` as discovered/not indexed. Not present in a non-indexed drilldown ≠ confirmed indexed.

Official documentation:

- Google noindex and robots interaction: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- Google on AI search: https://developers.google.com/search/docs/appearance/ai-features
- Next.js permanent redirects (308): https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects

**Agent checklist to sign off:** branch backed up; Phase 2 changes present; no build errors; 18 sitemap URLs; 5 redirect 308s; 4 genuine 404s; hidden pages noindex; referral and proposal routes functional; 10-day campaign functional; video correct; forms functional; security reviewed; rollback available.
