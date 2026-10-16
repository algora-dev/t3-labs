# Apex Smart Assistant session isolation fix

Date: 2026-10-16

## Reported defect

A completed pricing conversation could leak into a later fresh demo visit. The visible symptom was:

1. Complete a demo visit far enough to create an assistant roof estimate.
2. Close that page and start a new demo visit.
3. Reach the insurance-answer task.
4. The insurance response appears, then the previous roof estimate/context appears even though the visitor has not sent the new pricing prompt.

The T3 demo helper was fresh because it is scoped with `sessionStorage`, but the Apex Smart Assistant still used the browser-wide `t3_sa_sid` cookie. A fresh tab could therefore pair a new helper journey with an older server-side assistant session.

## Fix implemented

The assistant now has an opaque per-tab client session key:

- Storage key: `apex.smart-assistant.tab-session.v1`
- Transport header: `x-apex-assistant-session`
- Same-tab navigation and reloads reuse the key.
- A genuinely new tab/session creates a new key.
- Stateful assistant routes resolve server data from that tab key before considering the legacy cookie path.
- The legacy cookie flow remains as a compatibility fallback for callers that do not supply the new header.

The following stateful routes are scoped:

- `POST /api/chat`
- `GET /api/session`
- `DELETE /api/session`
- `POST /api/outputs`
- `GET /api/outputs`
- `POST /api/inquiry`

The Smart Assistant launcher and enquiry prefill now use a shared `assistantSessionFetch()` wrapper so the same tab key is attached consistently.

## Start New Conversation

`Start New Conversation` still clears messages, facts, estimates, outputs, enquiries, draft and page context. For a scoped demo tab the opaque tab identity stays stable while its server-side state is replaced with a new empty session. This avoids changing tabs or breaking same-tab continuity.

## Guided prompt safety

The guided helper still only pre-fills the Task 2 pricing example. Preparing that prompt does not call `sendMessage()` or `runTurn()`. Only an explicit visitor send action can create the pricing response.

## Files changed

- `lib/assistant/session-scope.ts` - new shared header/key validation and scoped server id mapping.
- `lib/assistant/client-session.ts` - new per-tab key creation and stateful fetch wrapper.
- `lib/assistant/session.ts` - scoped get/create/peek/reset behavior with cookie fallback retained.
- `app/api/chat/route.ts`
- `app/api/session/route.ts`
- `app/api/outputs/route.ts`
- `app/api/inquiry/route.ts`
- `components/assistant/SmartAssistantLauncher.tsx`
- `components/assistant/EnquiryPanel.tsx`
- `tests/assistant-session-isolation.test.mjs` - new regression coverage.

## Local verification completed

- `npm test`: 268/268 passed.
- All 9 changed TS/TSX source files transpiled successfully with TypeScript syntax diagnostics enabled.
- New regression suite verifies per-tab key validation/mapping, stateful route scoping, stateful client fetch coverage, prompt prefill without submission, and no-em-dash/UTF-8 safety.

`npm run typecheck` was attempted, but this extracted handoff does not contain installed project dependencies. The command therefore reports missing React/Next/Node/package typings throughout the existing repository before a meaningful project typecheck can run. The deployment agent must run `npm ci` first, then rerun typecheck, lint and build.

## Required live regression test

Run this exact sequence in staging after merge:

### A. Reproduce the old leak

1. Open Demo A in a fresh tab.
2. Complete the insurance-answer task.
3. Complete the assistant pricing task until a real estimate card exists.
4. Optionally open the enquiry preview so extra session context exists.
5. Close Demo A.

### B. Prove the fresh demo is clean

1. Open Demo B in a genuinely new tab.
2. Start the guided flow.
3. Reach the insurance task and send the insurance question.
4. Confirm the insurance answer is the only new response.
5. Confirm no old estimate card, roof facts, old enquiry context or prior user messages appear.
6. Advance to the pricing task.
7. Confirm the example pricing request is only pre-filled in the composer.
8. Wait several seconds without sending it. Confirm no estimate appears.
9. Send it manually. Confirm the new estimate appears only now.

### C. Prove same-tab continuity was not broken

1. In Demo B, navigate to at least two Apex pages.
2. Close and reopen the Smart Assistant.
3. Confirm the current Demo B conversation/context is still available to the server.
4. Generate an estimate and download its PDF.
5. Confirm the output belongs to the current tab session.

### D. Prove manual reset still works

1. Click Start New Conversation.
2. Confirm the warning/reset flow works.
3. Ask a normal question.
4. Confirm none of the pre-reset facts, estimate cards or enquiry context affect the new answer.

### E. Optional two-tab isolation check

Keep two demo tabs open at once, create different project details in each, then continue chatting in both. Each tab should retain its own facts and estimates. In browser dev tools, their stateful assistant requests should carry different `x-apex-assistant-session` values.

## Merge/deploy guardrails

- Merge these changes into the latest live branch. Do not overwrite newer unrelated work.
- Do not change estimator pricing logic, helper task completion rules, conversion-modal rules or dashboard behavior as part of this fix.
- Do not remove the legacy cookie fallback unless separately reviewed.
- Preserve the repository no-em-dash rule and UTF-8 encoding.
- Run `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.
- Deploy to the test/staging environment and run the live regression sequence above before calling the issue fixed.
