# T3Labs Approved Homepage + Free Business Review | Next.js Source Handoff

**Prepared:** 13 November 2026  
**Original supplied repo snapshot:** `t3labs-homepage-rebuild-handoff-2026-11-11.zip`, `t3-labs-site/`, base commit `4b38752` according to its README.  
**Design baseline:** approved *T3Labs Interactive HTML Preview V18* and *Free Business Review V18*.  
**Target stack:** existing Next.js 16 App Router, React 19, TypeScript 5.9, Vercel, Resend.

## Read this first

This archive contains **real Next.js/React/TypeScript source files** integrated into the supplied repo snapshot. It is NOT an HTML preview and the review form no longer generates mailto drafts. The complete original supplied code snapshot is retained (apart from the files intentionally replaced/added below). The original user-supplied archive was already a pruned repo export: videos, some proposal media, database/migrations and internal docs were not included. Therefore **merge these changes into the latest real GitHub repository**, rather than replacing `main` with the archive or deleting files not present here.

### Exactly what is implemented

1. `/` contains the approved V18 roofing and construction homepage, implemented with React JSX, locally served extracted images, Next `Link` navigation, mobile header, natural `<details>` expansion for team, package details and product examples, and topic-aware CTAs.
2. The **Who we are** menu links to `/#who-we-are` and expands the About panel even on a direct hash visit.
3. `/free-review` contains the final compact V18 review form with seven labelled priorities and clear choices:
   - **Send a quick enquiry**: choose topics or add notes, enter a valid email; optional name, website, details; submit directly to the server; a genuine success state only after email delivery is accepted; failure/retry messaging.
   - **Book a 20-minute call**: direct link to the existing team Calendly, no prerequisite intake form.
4. Homepage CTAs preselect topics using URL query `focus`, with optional `package` context; the review page validates and resolves these on the server.
5. `/api/free-business-review` validates payload and allowed topics server-side, has an anti-bot honeypot and a best-effort per-instance throttling guard, and uses the existing `RESEND_API_KEY` Resend pattern to deliver to **`insights@t3labs.tech`**. Errors never masquerade as successful sends.
6. Existing legacy floating assistant remains on the rest of the site, but is hidden on `/` and `/free-review` for parity with the approved visual design.
7. Meta title/description/canonical entries updated for the two new surfaces; `/free-review` added to sitemap.
8. All original unrelated demo/quoting, business audit, API, legal and service routes remain in the supplied snapshot.

### Files intentionally added or changed

```
app/page.tsx                                       REPLACED - homepage route
app/free-review/page.tsx                           NEW - dedicated review page
app/t3-rebuild.css                                NEW - approved V18 visual styles scoped to .t3-rebuild
app/api/free-business-review/route.ts              NEW - direct server-side email delivery
app/layout.tsx                                    CHANGED - route-aware existing assistant launcher
app/sitemap.ts                                    CHANGED - free-review entry
components/t3-rebuild/HomepageContent.tsx         NEW - approved homepage React markup
components/t3-rebuild/Header.tsx                  NEW - responsive links and About disclosure
components/t3-rebuild/FreeReview.tsx              NEW - working client-side form and states
components/t3-rebuild/LegacyAssistantGate.tsx     NEW - preserve legacy behaviour on other routes
components/t3-rebuild/review-topics.ts            NEW - allowed topics, mapping, Calendly URL
public/assets/t3-rebuild/*                        NEW - 8 local project images incl. user's estimator screenshot
config/free-review.env.example                    NEW - required settings, no credentials
tests/t3-rebuild-contract.test.mjs                NEW - source/route contract checks
tests/t3-rebuild-email.test.mjs                   NEW - mocked email success/failure validation
AGENT-HANDOFF.md                                   NEW
CHANGES-T3-REBUILD.md                             NEW
```

### Environment settings

- `RESEND_API_KEY`: configure as a Vercel server-side secret. Already used elsewhere in this repo.
- `REVIEW_NOTIFY_EMAIL`: `insights@t3labs.tech` (also the default).
- `REVIEW_FROM_EMAIL`: verified sending identity, e.g. `T3Labs Reviews <noreply@t3labs.tech>`. **Verify `t3labs.tech` domain in Resend first.** If not verified, use an already verified approved sender until it is. Do not confuse sender with the recipient.
- `REVIEW_ALLOWED_ORIGINS`: optional comma-separated allowlist for preview domains if needed.
- The original contact routes contain older `insights@t3labs.co.uk` defaults. This new form route intentionally goes to `.tech`. Review and update old routes separately if that is the desired company-wide policy. DO NOT blindly modify client/demo email destinations.
- Calendly is verified: `https://calendly.com/insights-t3labs/20-minute-meeting`.
- The **48-hour response is a staff service commitment**, not an automated review generator. Someone must actually respond.

### Merge & deployment workflow

1. **Start from current GitHub `main`, not this archived base commit.** Make a new feature branch. Compare all modified files against HEAD, resolve concurrent edits and preserve routes/features added after 11 Nov.
2. Apply only the specified new/modified files. If a section of the new homepage conflicts with an existing feature, keep the approved V18 appearance and functional funnel, and preserve unrelated code by moving it rather than deleting it.
3. Run `npm ci` using the full current repository and `npm run typecheck`, `npm run lint`, `npm run build`. Resolve all errors before opening a PR. These could not be completed in the isolated handoff runtime because dependency download/install was unavailable.
4. Run isolated tests: `node --test tests/t3-rebuild-contract.test.mjs tests/t3-rebuild-email.test.mjs`. They passed locally on the handoff snapshot (8/8). Then run your **existing full test suites**.
5. Browser QA at 320, 390, 768 and 1440 pixels: homepage, hamburger links, About disclosure from header/direct hash, three tool expanders, three package expanders, four consistent numbered examples, all real demo links, hero placeholder, CTA topic preselection, seven topic choices, written enquiry validation, success/error states, Calendly external navigation, keyboard access, no overflow. Ensure screenshots visually match the approved V18 reference provided to the agent.
6. Verify live Resend delivery **end to end** to `insights@t3labs.tech`, including reply-to field, optional context, package context and a failed-Resend test. Confirm sender domain. No false success when credentials or delivery fail.
7. **Production anti-abuse**: the route has a honeypot and process-local limiter, which does not reliably throttle across Vercel instances. Configure Vercel WAF/edge distributed rate limits or an organisation-approved durable limiter before broad launch. Confirm privacy/retention policy for enquiry data.
8. Verify SEO metadata and sitemap plus all important existing routes, especially `/demo/roofing-site/quick-estimate`, `/roofing-solutions`, `/our-solution`, `/custom-software`, `/case-studies/quotecore`, legal pages and QuoteCore links.
9. Confirm public commercial claims before launch: from US$299 and from US$899 packages, included/excluded scopes, the 10-day programme description, individual biographies, 35+ years combined trade experience and region coverage. None of this copy should silently become a legal guarantee.
10. Publish via standard PR/review/deployment process, then perform live smoke tests on desktop/mobile and log any issues.

### Where fidelity matters

- Brand accent `#D7FF00`, Inter font, dark/light section sequence, typography, portrait/video placeholder, photo assets, slim CTA, four solution areas, three package cards, tool expanders, and compact full-width 10-day card.
- **No em dashes** in landing-page copy. The homepage still uses the agreed wording, not newer unsanctioned rewrites.
- The founder/team video and thumbnail are **intentionally placeholders** until the team supplies the real media. Do not simulate a playable video or invent a founder quote.
- No customer testimonials should be invented. The approved V18 layout deliberately does not show fictional reviews.
- Demo links remain real external/internal links, not invented widget mockups.
- CSS is long because it faithfully carries the approved cumulative design tweaks. It is scoped to `.t3-rebuild` to protect unrelated pages. A later refactor is allowed **only after screenshot and interaction parity**.

### Known verification limits

- **Passed in this environment:** TypeScript/TSX syntax transpilation of all new source modules; 8 isolated source/API tests; scoped CSS rendering at 1440 and 390 pixels with no horizontal overflow; link/asset extraction audit.
- **Not verified here:** full npm install, Next.js typecheck/build, running the actual React app in Next, real Resend delivery, real Calendly availability, Vercel deployment and current GitHub HEAD merge. These are mandatory gates, not claimed as complete.
- If you need a small merge footprint, use the accompanying **Changed Files Patch** ZIP, which has only the files enumerated above. The Full Source ZIP is for reference and safe, selective integration, not a command to replace current production.

## Copy-and-paste handoff prompt for implementation agent

> Implement the approved T3Labs V18 homepage and simplified Free Business Review funnel from the attached Next.js source archive. The project's original reference is Next.js 16 App Router/React 19/TypeScript; the provided archive is based on 11 Nov 2026 source revision `4b38752` and is not guaranteed to match current GitHub HEAD. **First pull latest `main`; create a branch; merge the attached modified files without deleting anything added to the repo since the archive.** Do not deploy the HTML prototype; implement the real `app/page.tsx`, `/free-review`, and `/api/free-business-review` from this package. Preserve the approved visuals and interactions exactly, including topic-preselected CTAs, About expansion, package/tool disclosures, demo URLs, responsive layout and direct Calendly route. The written form must send directly through Resend to **insights@t3labs.tech**, show success only after confirmed acceptance, and promise a response within **48 hours**. Set up a verified `REVIEW_FROM_EMAIL` sender and production rate limiting. Confirm the commercial copy/prices with the owner. Run `npm ci`, typecheck, lint, build, all tests and browser visual checks before PR. Compare against the approved V18 screenshots and functionality. Do not invent testimonials or replace the future hero video with mock footage. Preserve all unrelated production routes. Open a PR with a summary, screenshots, deployment/env notes, any unresolved issues and evidence of tests. Deploy only after approval, then verify the live enquiry and booking paths end to end.
