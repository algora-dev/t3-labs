# Acceptance Checklist - Apex Roofing Smart Assistant V4.1

Run automated checks first:

```bash
npm test
```

## Demo identity and website

| # | Requirement | Manual check |
|---|---|---|
| 1 | One Apex identity | Website, assistant, PDFs and estimates use Leeds / UK context and GBP. No Portland/Oregon/USD copy appears. |
| 2 | Canonical demo route | `/demo/roofing-site` is the main demo. `/apex-roofing` redirects there. |
| 3 | Shared page knowledge | The 16 Apex content pages render from `website-pages.json`, and the assistant can answer from that same content. |
| 4 | Pages feel like one site | Detail pages use the Apex header/branding and link cleanly back to the main demo. |
| 5 | Homepage service links work | Service cards navigate to relevant real content pages instead of only `#contact`. |

## Core Smart Assistant experience

| # | Requirement | Manual check |
|---|---|---|
| 6 | Smart Website first impression | Teaser appears once, explains the value quickly, shows a strong roofing example and does not block the page. |
| 7 | Launcher feels like an assistant | Opening screen offers estimate, roofing question, site finding and enquiry actions. |
| 8 | Grounded business Q&A | Ask about insurance, areas, hours and warranties. Answers match approved data. |
| 9 | Grounded website navigation | Ask where insurance, pitch, materials or guarantees are explained. Buttons come from `site-map.json`. |
| 10 | Technical roofing knowledge | Ask hip vs gable, pitch, valleys and plan vs sloped area. Answers match approved knowledge. |
| 11 | Direct catalogue pricing is exact | Ask concrete/clay/slate installed roof-system rates. Values come only from `pricing.json`. |

## Guided and conversational estimate flow

| # | Requirement | Manual check |
|---|---|---|
| 12 | Project type is required | Whole-roof estimate distinguishes New Roof vs Re-roof before final pricing. |
| 13 | Re-roof removal is separate | Re-roof adds configured strip-per-m² and fixed disposal allowances once only. New Roof adds neither. |
| 14 | Roof size supports fast choices | Small/Medium/Large returns a price range. Exact m² returns a single-area estimate. |
| 15 | Area meaning is explicit | Exact area can be Actual roof area or Footprint / plan area. Plan area uses pitch to convert to sloped area. |
| 16 | Pitch is required | User can select Flat/Low, Medium, Steep or enter degrees. Whole-job pricing does not silently assume 30°. |
| 17 | Material/pitch compatibility | Incompatible tile/slate choices are disabled/rejected. Flat/low pitch does not receive a made-up tiled-roof price. |
| 18 | No unrequested components | Ridge/hip/valley/flashing/gutter/insulation are never charged unless explicitly selected or authorised for estimation. |
| 19 | Covering-only is truly covering-only | Choose Roof covering only. No separate optional component lines appear. |
| 20 | User quantities stay exact | Choose components and enter known lengths/counts. Engine uses exactly those quantities. |
| 21 | Missing quantities need permission | Estimate missing quantities works only after explicit authorisation; non-estimable items require user quantities. |
| 22 | Roofline estimation asks shape | Estimate roofline components requires Gable, Hip or Hip + valley before geometry allowances are created. |
| 23 | Gable does not invent valleys | Gable geometry may add ridge when authorised but never a valley allowance. |
| 24 | Estimate assumptions are truthful | User-supplied pitch is not replaced by a default. Heuristic quantities are visibly labelled. |
| 25 | Adjust Estimate preserves context | Reopening the estimator pre-fills the current project/draft instead of starting from zero. |

## Outputs and conversion

| # | Requirement | Manual check |
|---|---|---|
| 26 | PDF works | Download PDF succeeds and matches the canonical estimate object exactly. |
| 27 | Enquiry review is pre-filled | Official quote request shows project type, area, pitch, material, components, estimate and assumptions. |
| 28 | Looks Good vs Edit Details | Looks Good goes to minimal contact details. Edit Details opens the project editor. |
| 29 | Attachments are safe in demo | Selecting files stores only validated metadata in session JSON; no base64 blobs are written to Redis/session state. |
| 30 | Submitted enquiry is useful | Payload contains project facts, estimate breakdown, assumptions, attachments metadata and recent conversation context. |

## Workspace, memory and navigation

| # | Requirement | Manual check |
|---|---|---|
| 31 | Floating panel can move | Desktop assistant can be dragged and reset without blocking basic interaction. |
| 32 | Pinned mode works | Pinning creates website + assistant split view with no nested second assistant or duplicate demo strip. |
| 33 | Pinned navigation is live | Assistant navigation loads the requested Apex page in the website panel and keeps chat context. |
| 34 | Unpin preserves browsing destination | After browsing in pinned mode, unpinning returns the main page to the current internal destination where practical. |
| 35 | Back to Chat retains context | Leaving estimate/enquiry views and returning to chat keeps project memory. |
| 36 | Start New Conversation clears memory | Reset warning appears. After confirmation, old messages, facts, estimates, enquiry draft and output refs are not available to the new session. |
| 37 | Two visitors are isolated | Two private/incognito sessions with different projects never share facts, estimates, PDFs or enquiries. |
| 38 | Hosted state is shared | With Redis/Upstash REST configured, estimate -> PDF -> enquiry works across separate serverless requests. |

## Guardrails

- API keys stay server-side.
- The model never computes commercial prices.
- Unknown materials never fall back to another product.
- Whole-job estimates require a project type, size, pitch, approved material and explicit component scope.
- Complex estimate clarification can use the configured higher budget; simple requests should remain concise.
- No arbitrary URLs or unstructured frontend regex actions.
- Unsupported facts hand off rather than hallucinate.
- UI text/comments use normal hyphens rather than em dashes.
