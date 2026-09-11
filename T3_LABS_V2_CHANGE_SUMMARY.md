# T3 Labs Smart Assistant V2 - Review, Fixes and Handoff

## What changed

This pass keeps the existing data-driven, deterministic-pricing architecture but tightens the state model, estimate guardrails, enquiry/PDF flows and customer UX.

### 1. Estimate safety and scope

The assistant no longer silently adds chargeable roof components.

Every estimate now has an explicit scope:

- `covering_only` - price the main roof covering only.
- `specified_components` - add only components the customer selected, using supplied quantities where a linear length/count is required.
- `estimated_components` - use geometry heuristics only after the customer explicitly authorises the assistant to estimate component quantities.

Other changes:

- A simple gable roof no longer invents valley quantities.
- Unknown roofing materials no longer fall back silently to concrete tile.
- Flashings and other unsafe-to-guess linear quantities are not estimated without user input.
- Assumptions are generated from what actually happened in the estimate, rather than generic boilerplate.
- The assistant may ask up to three useful estimate clarifications. This supports material -> scope -> one final geometry/component detail without interrogating the user.

### 2. Session isolation and hosted reliability

Session state is no longer process-memory-only in production.

`lib/assistant/session.ts` now supports a shared Redis-compatible REST store using either:

- `KV_REST_API_URL` + `KV_REST_API_TOKEN`
- or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

Local development falls back to the in-memory store.

This is important on Vercel/serverless because chat, estimate, PDF and enquiry requests can land on different instances.

### 3. PDF output

- Output IDs are persisted with the session.
- PDF downloads use a blob download flow in the client.
- The output route returns the generated PDF as a binary response.
- PDF content uses the configured business name/accent and includes estimate scope and heuristic allowance labels.

### 4. Enquiry flow

The enquiry now behaves as a continuation of the conversation rather than a blank form.

- `Here is what I know so far` review screen.
- Captured project facts are shown before submission.
- Full estimate line items and total are shown when available.
- `Looks good` goes directly to a minimal contact step.
- `Edit details` opens the editor.
- Name plus email/phone are the main missing details.
- Enquiry payload carries project context, estimate scope, components, extras and the latest estimate.
- Trivial final chat messages are no longer used as the main enquiry note.

### 5. Structured conversational UI

The frontend no longer tries to infer UI controls by regex-parsing assistant prose.

The server can return structured `QUICK_REPLY` actions for:

- roofing material
- estimate scope
- roof shape
- area type
- other guided decisions

This makes the experience deterministic and easier to extend to other businesses.

### 6. UX and visual polish

The assistant is designed as a compact business workspace rather than a generic support chatbot.

Changes include:

- Non-blocking `Smart Website` teaser.
- Clear `Ask Apex` launcher with value proposition.
- Strong opening screen instead of a blank chat.
- Four primary capability cards: estimate, roofing question, find something, prepare enquiry.
- Wider desktop panel and full-screen mobile experience.
- Structured estimate cards with scope, line items, source labels, assumptions and contextual actions.
- Better loading/thinking states.
- Contextual buttons instead of unnecessary typing.
- Page CTA can open the assistant directly.
- Config-driven business name, accent, launcher copy, teaser copy and starter prompts.

### 7. Reusability

Apex-specific behavior has been reduced in reusable assistant code.

- Business data path is controlled by `T3_ASSISTANT_BUSINESS_SLUG` with `apex-roofing` as the demo default.
- Branding/copy come from `assistant-config.json` where practical.
- Pricing and rules continue to live in `data/<business>/`.

The framework is now closer to the intended T3 model: swap data/config rather than rebuild the assistant for every client.

## Validation completed

`npm test` passes with 9 deterministic pricing tests covering:

1. catalogue/currency integrity
2. covering-only behavior
3. no invented gable valleys
4. exact user-specified component quantities
5. plan-area slope conversion
6. explicit gutter estimation without invented downpipes
7. commercial rounding
8. repeat arithmetic stability
9. no silent fallback for unknown roofing materials

## Required clean-environment checks before merge/deploy

The execution environment used for this review had an interrupted/incomplete `node_modules` install, so a full Next.js build could not be honestly certified here.

In a clean checkout, run:

```bash
npm install
npm test
npm run typecheck
npm run build
```

Then run the manual checks in `tests/acceptance-checklist.md`.

## Required hosted environment variables

At minimum:

```text
OPENAI_API_KEY=...
```

For a reliable Vercel/serverless demo, also configure a Redis-compatible REST store:

```text
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

or the equivalent Upstash variable names.

Optional business selection:

```text
T3_ASSISTANT_BUSINESS_SLUG=apex-roofing
```

## Recommended flagship test flow

1. Ask for a price for a 200 m2 roof.
2. Choose concrete tile.
3. Choose `Roof covering only` and confirm no ridge/hip/valley/gutter components are added.
4. Ask to include roof components.
5. Supply known lengths or explicitly authorise estimated components.
6. Confirm the revised breakdown is clear and only includes authorised components.
7. Download the PDF.
8. Choose `Request formal quote`.
9. Confirm the review screen contains the project and estimate automatically.
10. Choose `Looks good`, add contact details and submit the demo enquiry.
11. Open a second browser/incognito session and confirm neither visitor can see the other's state.

## Product rule to preserve

The assistant interprets intent. The deterministic business engine owns price calculations and commercial rules.

If a required fact is unknown, ask or hand off. Do not silently invent it.
