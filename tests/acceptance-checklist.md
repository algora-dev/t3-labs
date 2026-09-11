# Acceptance Checklist - Apex Roofing Smart Assistant V2

Run automated pricing checks first:

```bash
npm test
```

## Core experience

| # | Requirement | Manual check |
|---|---|---|
| 1 | First impression is clearly smarter than normal chat | Teaser appears once, explains the Smart Website idea, shows a strong example question, and never blocks the whole page. |
| 2 | Launcher feels like a business assistant | Launcher says Ask Apex with a value subtitle, not generic Chat with us. Opening screen has estimate, question, navigation and enquiry actions. |
| 3 | Grounded business Q&A | Ask about insurance, areas, hours and warranties. Answers must match `business.json`. |
| 4 | Roofing knowledge is grounded | Ask about hip vs gable, pitch and plan vs actual roof area. Answers must match `roofing-knowledge.md`. |
| 5 | Direct catalogue pricing is exact | Ask concrete, clay and slate rates. Values must come from `pricing.json`. |

## Estimate flow

| # | Requirement | Manual check |
|---|---|---|
| 6 | No unrequested roof components | Ask for a 200 m² roof price. After material choice, the assistant must ask estimate scope before adding ridge, hip, valley, flashing, gutter or insulation line items. |
| 7 | Covering-only is truly covering-only | Choose Roof covering only. Estimate card must contain the main covering line only. |
| 8 | User-specified components work | Choose Add components I know. Give ridge/hip and valley lengths. Estimate must price only those selected components and use the supplied lengths. |
| 9 | Geometry allowances require explicit permission | Choose Estimate roof components. If shape is needed, the assistant asks. Result labels geometry-derived quantities as estimated allowances. |
| 10 | Gable roof does not invent valleys | A simple gable with estimated components may include ridge but must not automatically add a valley line. |
| 11 | Estimate assumptions are truthful | No Pitch assumed 30 degrees line when the user supplied pitch. No linear-component assumption on covering-only estimates. |
| 12 | Follow-up buttons are contextual | Add estimated gutters only appears when gutters are absent. Add roof components only appears when the current scope is covering-only. |

## Outputs and conversion

| # | Requirement | Manual check |
|---|---|---|
| 13 | PDF works | Click Download estimate PDF. The file downloads successfully and every line/total matches the canonical estimate card. |
| 14 | Enquiry review is pre-filled | Click Request a formal quote. Review shows captured area, material, shape/pitch when known, estimate scope, total and line items without retyping. |
| 15 | Looks good and Edit details behave differently | Looks good goes directly to the minimal contact step. Edit details opens the project editor. |
| 16 | Contact step is minimal | After review, only name plus email or phone are required. Optional note is available. |
| 17 | Submitted enquiry includes useful context | Server payload contains project facts, full estimate breakdown, assumptions and recent conversation context. |
| 18 | Navigation actions are allowlisted | Ask where insurance or guarantees are. Button must resolve from `site-map.json`, never an invented URL. |
| 19 | Unsupported question hands off cleanly | Ask something outside approved knowledge. Assistant must not invent and should offer an enquiry when useful. |

## Session and deployment

| # | Requirement | Manual check |
|---|---|---|
| 20 | Two visitors are isolated | Open two private/incognito sessions. Give different roof data. Estimates, PDFs and enquiry prefill must never cross. |
| 21 | Hosted state survives separate server requests | With Redis REST env vars configured, create estimate, wait/refresh relevant UI, download PDF and open enquiry. Data must remain available. |
| 22 | Local fallback still works | Without Redis env vars, local `npm run dev` uses in-memory sessions for development. |
| 23 | Business data is swappable | Set `T3_ASSISTANT_BUSINESS_SLUG` to another valid data folder. Loaders use that folder without editing pricing/data loader code. |
| 24 | Mobile assistant is usable | On narrow viewport assistant is full-screen, composer remains usable, actions are easy to tap, and body behind it does not scroll. |

## Guardrails

- API key stays server-side.
- Model never calculates prices.
- `componentScope` is required by the deterministic estimate engine.
- Maximum configured clarification turns are respected.
- User prompt injection cannot reveal system prompts, configuration or keys.
- No arbitrary URL/action execution.
- UI copy and assistant comments use normal hyphens rather than em dashes.
