# Apex website-first demo helper

## Scope, 9 October 2026
Keep the existing Apex homepage as the landing experience. No new demo dashboard, page frame or sidebar. Three core experiences: business question with a usable page link; assistant estimate through enquiry preview; Quick Roof Estimate through enquiry preview. Detailed measurement and plan/image takeoff tools are optional exploration, not homework. The business admin is a fourth, optional experience.

## Implementation passes
1. Replace the sidebar shell with a non-modal, draggable desktop helper and collapsible mobile sheet. Persist only guide progress and position in this tab. Keep normal website navigation and all tools independent.
2. Add an explicit milestone state machine. Observe real structured assistant results, approved link clicks, valid estimates and enquiry confirmations. Advance instructions automatically, but let visitors choose when to leave an outcome. Provide clearly labelled manual continuation and skipping.
3. Prepare editable assistant examples without sending automatically. Reuse live chat and deterministic configured pricing. Make assistant and homeowner enquiry submission explicitly preview-only; retain estimates and show the receiving business view.
4. Unify estimate entry and tool navigation, simplify the Quick Estimate, and explain the two advanced paths briefly at the end. Preserve all physical quantities and pricing rules.
5. Add safe one-click Apex demo-admin access, a focused trade-pricing exercise, mobile navigation and explicit sample-data/local-only labels. Do not imply admin edits update separate server pricing sources.
6. Run regression tests, strict checks where dependencies allow, browser flows at desktop/mobile sizes, interaction/collision checks, encoding scan and archive diff.

## Acceptance
A prospect lands directly on Apex, can minimise or move the helper, and can complete three meaningful journeys without visiting a demo dashboard or being forced into the advanced tools. They understand that the interface, products and public/trade pricing policies can be tailored. No actual customer enquiry is emailed during this demo. No claim of a professional quotation or automatic AI discovery is made by the ballpark tool.

## Constraints
No changes to measurement geometry, supplier product rates, public rate files or catalogue calculations. Existing admin data is browser-local; analytics includes seeded examples. Live language-model behaviour and full Next.js validation require their configured runtime. Changes outside the Apex demo are limited to safe, shared integrations and preserve other suppliers.
