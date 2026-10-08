# Apex Roofing — homeowner estimate and enquiry integration

## Changes
- Preserved existing Apex Roofing homepage and its branding, navigation, sections and Smart Assistant.
- Home estimate CTAs now point to `/demo/roofing-site/estimate`, a three-option entry page: measurements, plans, or no measurements.
- Quick Roof Estimate is the third option and retains its existing calculation and supplier pricing engine.
- Results are simplified to a price range, roof choices, short inclusions and a clear professional-quote disclaimer. Technical information is collapsed by default.
- A prominent **Request a proper quote** action opens an inline homeowner enquiry. The prefilled payload includes roof shape, footprint band, pitch, storeys, project, materials, flat extension, estimated area, price range, pricing status and exclusions.
- Contact, property address/postcode, notes and optional plan/photo file selection are included. The final screen shows exactly what the fictional Apex team would receive.
- **No enquiry is sent, stored or uploaded.** Form submission is an in-browser preview. The existing `/api/ballpark-enquiry` route can send real emails when configured and is deliberately NOT called by this demonstration.

## Verification
- 94 existing automated tests passed on Node 22.
- Modified TSX and TS files passed TypeScript syntax/transpilation checks.
- Full Next.js build and browser walkthrough have not been verified here; install project dependencies and run `npm run typecheck`, `npm run build`, and manual desktop/mobile checks before deployment.

## Next review
- Confirm the three-way entry page matches desired wording and navigation.
- Walk through the homeowner estimate and enquiry preview on mobile.
- Confirm how a production client implementation should route enquiries and securely handle uploaded plans, with consent and anti-spam protection.
