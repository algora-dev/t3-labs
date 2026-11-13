# Changes for approved T3Labs V18 source implementation

- Converted approved single-file homepage design into real Next.js App Router source under `app/page.tsx` and `components/t3-rebuild`.
- Extracted and deduplicated embedded image data to 8 ordinary `public/assets/t3-rebuild` image files, preserving supplied imagery.
- Kept CSS visually faithful but isolated via `.t3-rebuild` to avoid changes to legacy pages.
- Responsive navigation with Who we are disclosure open-on-hash.
- Retained 3 expandable quoting/assistant/estimator panels; 3 package scope disclosures; consistent 01/02/03/04 labels; real external demos.
- Created `/free-review` React form with 7 clear topics and preselected CTA context; no mailto drafts.
- Created `/api/free-business-review` validated POST endpoint using Resend and confirmed-recipient address insights@t3labs.tech; user-facing server error handling; optional detail fields; anti-bot checks.
- Calendly direct external booking at existing T3Labs 20-minute meeting URL.
- Kept original floating assistant on other routes via route-aware gate but not on V18 pages.
- Updated metadata and sitemap for review route. Left all unrelated content/routes in supplied original snapshot.
- Added source/endpoint behaviour tests. Local targeted tests: **8/8 pass**; Next production build must be run after dependencies are installed in the real repo.

Not included: actual founder video/thumbnail, credentials, live verified sender/domain, final marketing/legal copy approval, production distributed rate limiting, or GitHub/deployment actions.
