# T3Labs: Roofing Solutions & Discovery — Agent Review Handoff

**14 November 2026 — preview/review build, not production-deployed.**

## Which source to merge

This package is the entire **supplied compact Next.js code snapshot**, incorporating the new SEO discovery routes and a light design/navigation cleanup. It is **not** a clone of the latest production GitHub branch. Merge changed files into current `main` on a feature branch, preserving all newer changes, production secrets, and legacy assets. Do not replace production with this ZIP wholesale.

The supplied snapshot contains these key routes:

- `/` — approved V18 homepage, now linking contextually into solutions.
- `/solutions` — new seven-card hub, server-rendered, containing exact internal links to every solution.
- `/custom-roofing-software` — new purpose-built software landing page, with a real QuoteCore+ screenshot and case-study links. No video or pretend play button is currently published.
- `/contact` — new general contact landing page.
- Six existing answer-first routes: `/roofing-website-design`, `/roofing-seo`, `/roofing-website-estimators`, `/roofing-quoting-software`, `/roofing-ai-website-assistants`, `/roofing-business-automation`.

The existing `/roofing-solutions` interactive demo, generic `/custom-software`, QuoteCore+ case study, and `/free-review` conversion funnel are deliberately preserved.

## What the preview shows

`T3Labs-Interactive-Site-Preview.html` is a **self-contained static visual tour generated from the actual TSX components**, with CSS and screenshots embedded. It starts at the homepage. Click **Solutions**, open the **Menu** hamburger, go to **Custom Roofing Software**, or browse the original six pages. The `T3Labs-HTML-PREVIEW.zip` alternative includes 10 separate HTML files and their existing project images; start with `index.html` after extracting the ZIP.

Visual preview is not a running Next.js application: booking links, the free review form, and routes outside the ten-page preview go to the existing site, not local form functionality. It does not verify production React hydration, API responses or deployed link destinations. The code in `app/` and `components/` is what should be merged, not the preview HTML.

## Exact homepage internal linking map

| Location | Destination |
|---|---|
| Header primary nav and hero secondary CTA | `/solutions` |
| Websites service | `/roofing-website-design` |
| SEO service | `/roofing-seo` |
| Quoting service | `/roofing-quoting-software` |
| Admin / automation service | `/roofing-business-automation` |
| Services bridge card | `/solutions` |
| Quick-estimate proof / tools | `/roofing-website-estimators` |
| Smart-assistant proof / tools | `/roofing-ai-website-assistants` |
| Tailored software reference within examples | `/custom-roofing-software` |
| Footer | `/solutions`, `/custom-roofing-software`, `/contact` plus relevant existing routes |

Each original roofing acquisition page has a breadcrumb to `/solutions`, and relevant related-page links including the custom route.

## Design standard basis

The compact source includes `docs/AGENT-HANDOFF-V5.md`, which documents the verified brand standard: **Inter**, ink `#0A0B10`, dark `#111318`, paper `#FBFCFF`, white panels, lime `#D7FF00`, accessible lime-on-light **ink** `#5F7000`, an 1180px max layout and **8px** new card radii. The approved V18 homepage layout lives in `app/t3-rebuild.css`; do not replace its styling with a generic visual system. In this review, new solution cards and proof panels were aligned to the 8px standard, and the new dark surfaces use `#111318`.

No separate file explicitly named `DESIGN-STANDARD` was included with the supplied compact ZIP. If a newer authoritative brand file exists in the live repository, compare against it at merge time.

## SEO and implementation details

- `app/sitemap.ts` lists the hub, custom page, contact and six roofing pages. Static pages no longer falsely advertise `lastModified: new Date()` on every build; real blog updated dates remain.
- The new pages define explicit title, description, OpenGraph and canonical metadata. The inherited root homepage canonical was previously removed to avoid unrelated pages claiming `/` as their canonical.
- `components/t3-rebuild/Header.tsx` includes desktop and mobile menu links, closes by outside pointer or Escape, and now marks the active page with `aria-current="page"`. Menu links are real `<a>` elements, not JS-only navigation controls.
- New page cards and breadcrumbs are server-rendered `<Link>` anchors.
- Custom page includes *qualified* discussion of subscription savings and custom ownership: actual costs, maintenance, third-party services and rights must be agreed in a proposal.
- `VIDEO_EMBED_URL` on the new custom page remains an empty string: show real QuoteCore+ screenshot, not video, until an approved recording is delivered. Six prior V5 service pages also use honest real-example screenshots while videos are missing.

## Verification and unresolved risks

**Available here:** the native Node test suite reported **298/302 passing**. The seven-solution discovery tests and existing relevant homepage/form contracts passed. The four failing tests are elsewhere in the compact archive:

1. `admin-materials-polish.test.mjs`: material photo fixtures expected in the full project.
2. `assistant-session-isolation.test.mjs`: client assistant session request contract.
3. `assistant-session-isolation.test.mjs`: assistant server route session-scoping contract.
4. Logo asset contract: expected original transparent logo asset (`the supplied transparent logo is shipped without recolouring or regenerating it`).

These four were not changed in this task and should be reconciled against current GitHub. They must not simply be ignored before shipping.

The ten preview pages were successfully generated from React TSX using TypeScript's transpilation API; the generated JavaScript preview passed `node --check`. Preview HTML checks confirm the routes, internal links and packaged images are present. An automated Chromium screenshot/browser QA pass was **not** possible due to the execution environment blocking browser navigation. The full `npm ci`, `typecheck`, `lint` and `next build` remain to be run in the production development environment because the compact snapshot omits `node_modules` and some unchanged assets.

## Required release process

1. Make a feature branch in the up-to-date GitHub repo. Merge the supplied changes only; compare original production assets and any newer `Header`, CSS, `sitemap` and homepage work.
2. Verify approved design rules against the most current style standard, especially any newer source file not supplied here.
3. Run `npm ci && npm run typecheck && npm run lint && npm run build && npm test` and investigate the four pre-existing failures.
4. QA at **1440 / 768 / 390 / 320px**: homepage links, menu toggle, keyboard Escape, outside-click dismiss, expanded About hash, all seven solutions, contact and responsive overflow.
5. Validate that main CTAs, Calendly and existing free-review enquiry submission work against staging environment secrets. Review copy, ownership, pricing and spelling of QuoteCore+ before publish.
6. Verify generated page HTML: metadata canonicals, page indexing, sitemap, server-rendered anchors and structured data; then inspect new URLs in Search Console after deployment.
7. Deploy staging, obtain approval, then publish. Add future videos only when approved URLs, captions and transcripts exist; do not add fake video snippets/schema today.
