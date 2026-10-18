# Roofline Demo Readiness Handoff

Date: 18 October 2026
Target: Roofline Canterbury personalised sales demo
Purpose: hand this repository back to the coding agent with the sales story, pricing behaviour, demo constants, acceptance criteria and remaining work locked down.

## 1. What this demo is meant to prove

This is not a demo of three disconnected software modules. It is a demo of what Roofline's existing website could become if it could answer questions, price work and support trade customers directly.

The viewer should finish the recording understanding four outcomes:

1. A homeowner can get a useful first price without calling Roofline or waiting for business hours.
2. A roofer or builder can use Roofline's website as a practical job-pricing workspace, with Roofline products and account-specific pricing built in.
3. The Smart Assistant can answer product/technical questions, move into pricing and then into a qualified enquiry without the user leaving the website.
4. Roofline can see the activity behind those interactions: estimates, trade usage, products, potential opportunities and enquiries.

The desired reaction is not "nice calculator". It is "this could reduce staff work, retain more website visitors and give roofers a reason to keep coming back to Roofline. What would it cost?"

## 2. Core presentation decision

Public tools should stay visually and psychologically inside Roofline. The dashboard/admin is intentionally different because it is the behind-the-scenes business environment.

Public navigation should expose outcomes, not internal product/module names:

- Homeowner: **Get an instant estimate**
- Roofer / builder: **Price a job**
- Plans are a secondary route: **Working from plans instead?**
- Assistant is persistent help, not a separate destination.

Current main routes:

- Roofline-style site: `/demo/roofline-site`
- Pricing entry page: `/demo/roofline-site/estimate`
- Homeowner estimator: `/demo/roofline-site/quick-estimate`
- Roofer/builder pricing: `/supplier-pricing-tool/roofline-roofing?entry=measurements`
- Plan route: `/supplier-pricing-tool/roofline-roofing?entry=plan`
- Roofline admin/dashboard: `/supplier-pricing-tool/roofline-roofing/admin`

The Roofline website CTAs now pass `entry` intent into the detailed tool. The detailed flow also has its own Roofline-specific session storage key so a previous supplier/demo flow is not reused accidentally.

## 3. NZ localisation and legacy cleanup

Roofline-facing estimate/enquiry surfaces have been localised for New Zealand and cleaned of visible Apex/UK artefacts.

### Required presentation rules

- Public Roofline prices must be NZD.
- Homeowner/enquiry money is shown explicitly as `NZ$...`.
- Assistant price cards show the `$` amount with `NZD` beside it.
- Detailed trade output identifies Roofline totals as NZD.
- Customer quote uses NZ GST terminology and 15% GST defaults, not VAT.
- New Zealand example locations/postcodes are used.
- Visible `Apex`, `.co.uk`, `GBP`, `£`, `VAT`, `LS1 1AA` or old UK sample-customer copy must not appear in the Roofline user journey.

Some internal shared implementation identifiers still contain names such as `ApexIcon`, `.sa-apex-launcher`, `isApexPage` and old helper keys. They are not user-visible. Do not spend demo time renaming these unless doing a later architecture cleanup.

## 4. Public pricing philosophy

The public website does not need to expose Roofline's actual trade price or pretend to issue a formal quote.

Use three layers:

### A. Internal configured price

The deterministic engine keeps a precise internal calculation for consistency, auditing and downstream use.

### B. Public indicative range

Anonymous/public visitors see a controlled range around the calculated expectation.

A commercially useful public band can have a competitive lower edge and a sensible upper edge. It is still an indicative range, not a promised quote. Do not describe this in the UI as bait pricing; describe it as a configurable public range.

Range width is driven by information quality:

- exact roof area + exact pitch: tightest range
- one exact / one approximate: medium range
- broad size and pitch bands: wider early indication
- complexity, unknown removal/access/scope: widen upper side
- unresolved high-impact variables: explain why the range is broad

A normal public range should not casually approach 2x. If uncertainty really warrants an unusually broad range, show a visible explanation and state that the final amount may fall below or above the indication after missing variables are confirmed.

### C. Logged-in trade pricing

Trade customers can see their own configured rate/tier. Public visitors never need to see best trade pricing.

This directly addresses the likely objection "we don't want to publish our actual prices."

Suggested explanation to Roofline:

> You do not have to expose your exact trade or final quote pricing. Public visitors can receive a deliberately configured indicative band. As they provide better information, that band narrows. Logged-in trade customers can receive their own rates, while Roofline keeps the underlying configured pricing internally.

## 5. Range logic implemented

### Homeowner quick estimator

`lib/quick-estimate/pricing.ts` now creates a public presentation range.

Base behaviour:

- exact area + exact pitch: about -5% / +8%, HIGH confidence
- one exact input: about -8% / +12%, MEDIUM confidence
- neither exact: about -12% / +16%, EARLY confidence
- complexity/unknown removal/two-storey/missing scope widen the range further
- lower-side widening is capped at 25%
- upper-side widening is capped at 35%
- result rounds to the nearest NZ$100
- minimum visible spread is NZ$500

The deterministic engine remains underneath the display range.

### Smart Assistant estimate

`lib/pricing/estimate-engine.ts` has the same presentation concept. Exact Roofline pricing is retained internally but public assistant output uses a range instead of presenting a false-exact quote.

## 6. Locked homeowner demo case

Use this case for the recording because it is fast, specific and demonstrates range tightening:

- Roof shape: Gable
- Actual roof area: 160 m²
- Actual pitch: 20°
- Storeys: One
- Project: Re-roof
- Existing roof: Metal
- New profile: Roofdeck 0.40g

Expected homeowner result with current placeholder rates:

- internal deterministic calculation: about NZ$21,758
- public display: **NZ$20,700 to NZ$23,500**
- confidence: **High-confidence indicative range**

The exact area and pitch override the broad size/pitch cards. The roof surface area stays exactly 160 m² in the calculation.

This is fictional/demo pricing only. It must never be described as Roofline's actual rate.

## 7. Placeholder price calibration

The placeholder rates were adjusted so the example feels plausible for a New Zealand long-run metal reroof rather than inheriting the previous demo's UK/small-repair economics.

Important: these are not Roofline prices and should be described exactly as illustrative demo pricing.

Current examples:

Assistant all-in roof-system demo rates:

- Corrugate 0.40g: NZ$98/m²
- Corrugate 0.55g: NZ$110/m²
- Roofdeck 0.40g: NZ$105/m²
- Roofdeck 0.55g: NZ$118/m²

Removal allowance:

- existing metal removal: NZ$22/m²
- disposal allowance: NZ$650

The detailed supplier catalogue retains component-level material pricing and installation labour. Do not force every component rate to numerically equal the assistant's all-in roof-system rate; they represent different layers of the pricing model. What matters is that completed demo outcomes feel coherent.

Before a real customer deployment, replace all of this with Roofline-configured ranges/rates/tier rules.

## 8. Homeowner UX changes already made

Primary component: `components/quick-estimate-roofline/QuickRoofEstimate.tsx`

Changes:

- exact roof area input added
- exact pitch input added
- exact values tighten public range
- example pre-filled to the locked 160 m² / 20° demo case
- visible covering choices reduced to Roofline metal-profile concepts
- visible tile/slate/membrane legacy concepts removed from Roofline flow
- Roofline long-run image added
- result explains confidence and uncertainty
- enquiry payload includes exact area/pitch
- public money explicitly displays `NZ$`
- sample postcode/localisation is NZ
- no sign-up is required to see the indicative estimate

Recommended recording behaviour: use the pre-filled example path, do not spend time manually walking every form field.

## 9. Roofer / builder flow

The detailed tool should demonstrate a different value proposition from the homeowner estimator.

The story is:

> A roofer or builder already has measurements. Instead of building a quote in a spreadsheet or bouncing between supplier pages, they can enter the job, choose Roofline products and price the work in one Roofline-branded workspace.

The Roofline website CTA now deep-links with `?entry=measurements`, and Roofline automatically preselects the "have measurements / actual measurements" path. The plans CTA uses `?entry=plan`.

Do not demonstrate every advanced feature in the recording. Aim to show:

1. Roofline-branded header remains present.
2. Site measurements can be entered.
3. Roofline product is selected.
4. NZD material/installation output is produced.
5. "Log in for trade pricing" exists and trade tiers can change prices.
6. Output can become a customer quote or supplier enquiry/order workflow.

The purpose is to show repeat utility: if a roofer uses Roofline to price the job, Roofline products are already embedded in the workflow.

## 10. Trade pricing setup

Current Roofline admin seed includes two illustrative tiers:

- Trade Standard: 8% discount
- Trade Partner: 12% discount

The exact discount structure is placeholder only. A real deployment can instead use product-specific rates, customer-specific rates, price books or margin rules.

For the video, the important visual is that an anonymous/public price and a logged-in trade price are different because the account has a configured relationship with Roofline.

## 11. Smart Assistant: demo choreography

The assistant should not be demonstrated as a random FAQ bot. It should tell a progressive story in three questions.

Configured starter prompts:

1. **I'm building near the coast. Which Roofline roofing finish should I consider?**
2. **Can Roofdeck be used on a 4 degree roof?**
3. **I have a 160 m², 20° metal re-roof and I'm considering Roofdeck 0.40g. Can you give me an indicative price for the main roof system?**
4. Trade prompt is available but does not need to be used in the recording.

### Desired answer 1 behaviour: environment/product recommendation

Keep it short. The assistant should explain the configured guidance:

- ZinaCore: moderate environments
- MagnaFlow: more demanding/coastal environments
- AlumiGard: very severe marine/industrial environments
- exact location/exposure still needs confirmation for final specification/warranty

It should not overclaim an exact coating solely from distance to the sea.

### Desired answer 2 behaviour: technical compatibility

The core answer should be:

- Yes, Roofdeck is the relevant Roofline profile for a 4° roof because Roofline's current public information describes Roofdeck as suitable down to about 3°.
- Final detailing/specification still depends on roof design, exposure, laps/fixings and current manufacturer requirements.

Do not make an unsupported public claim that Corrugate has a specific minimum pitch unless that value is explicitly configured as demo logic and clearly treated as such.

### Desired answer 3 behaviour: price

For the locked 160 m² / 20° / Roofdeck 0.40g reroof case:

- internal assistant deterministic value: about NZ$22,230
- public assistant presentation: about **NZ$21,100 to NZ$24,000**
- confidence: High

The assistant should quote the public range, not the internal exact total.

It should then make a natural next step available: refine scope, prepare an enquiry or request a formal quote.

### Assistant answer style

- 1-4 short sentences by default
- answer first, explain second
- no long knowledge dumps
- link/action only when it helps move the task forward
- never perform price arithmetic in free-text LLM reasoning when a pricing tool/engine result is available
- never claim a public indicative range is a formal quote

## 12. Roofline knowledge corrections

`data/roofline-roofing/roofing-knowledge.md` and `business.json` were tightened against Roofline's current public website.

Examples:

- Roofline treated as a real Canterbury business, while this experience is a demo.
- Roofdeck low-pitch capability retained.
- coating guidance uses ZinaCore / MagnaFlow / AlumiGard distinctions.
- custom flashing/gutter/fascia/asbestos/re-roofing wording made more cautious.
- removed unsupported gauge/exposure assumptions.
- removed invented response-time promises.
- five-year workmanship guarantee wording retained where supported by current Roofline information.
- demo email remains `.example` so the demo does not send to a real address.

Do not expand knowledge by guessing. For a client-playable demo, add more verified Roofline pages/content intentionally.

## 13. Dashboard/admin story

Admin should be introduced as a deliberate transition:

> That's what the customer sees. This is what Roofline gets on the other side.

Do not put an obvious public "Admin" button into Roofline's normal public website navigation for the sales recording.

The seeded admin data is now Canterbury/NZ-oriented instead of UK/Apex-oriented.

Illustrative contacts include:

- Canterbury Roofing
- Southern Build
- Mainland Roofing
- Selwyn Construction
- Hornby Renovations
- Waimakariri Builders
- Port Hills Roofing

All demo emails use `.example` domains.

Current demo distribution is calibrated to look useful rather than exaggerated:

- roughly 90 quote events in the generated sample
- roughly one-third occur outside business hours rather than an implausible majority
- a portion is anonymous public use
- several trade accounts have repeat activity
- three seeded "opportunity" contacts have repeated quote activity but no detected order

The dashboard should make it easy to say:

> This does not prove somebody bought elsewhere. It shows Roofline which visitors/customers are repeatedly displaying buying intent without a recorded order, so the team has a reason to follow up.

Avoid claiming dashboard sample data is real Roofline activity.

## 14. What NOT to add to the dashboard for this video

Do not build a prominent ROI calculator just to support the pitch. The commercial value is stronger as voiceover over real product activity.

The dashboard should show operational facts/signals. The narrator asks the financial question.

Examples for voiceover:

- If this saved five collective staff hours a week, that is about 250 hours a year.
- If it retained only five orders that currently leak away because the visitor cannot get an answer, what is that worth at Roofline's actual contribution per order?
- If five new roofers used the quoting workflow and each placed only two or three more roofs a year, what would that mean?
- If marketing brought 100 extra relevant people a year and only five became orders, how does that compare with the cost of the system?

Use Roofline's own economics. Do not assert a made-up ROI percentage.

## 15. Dashboard areas worth showing

In order of demo value:

1. Tracking / overview
   - quotes created
   - became orders
   - average quote
   - outside-business-hours usage
   - anonymous usage
2. Opportunity/repeat-activity table
3. Trade customers and tiers
4. Products/pricing (briefly, only to prove Roofline controls it)
5. Team/admin only if specifically relevant; not needed for the main video

## 16. Recording story

Recommended sequence:

1. Roofline-style homepage / pricing entry
2. Homeowner instant estimate
3. Qualified homeowner enquiry preview
4. Roofer/builder pricing workflow
5. Smart Assistant (recommendation -> compatibility -> price)
6. Admin/dashboard
7. Organic ROI/value conclusion

Do not show the plan-measurement tool as a full fourth demo. Mention it as another entry path or show it for a few seconds if there is spare time.

## 17. Voiceover thesis

Use this idea repeatedly, in natural language rather than as a slogan:

> The goal is not to replace the Roofline team. It is to stop the team spending time on questions the website can answer, while making the people who do reach the team further along and more likely to buy.

Trade thesis:

> If a roofer buys from multiple suppliers, what happens if the easiest place for them to price their next job is Roofline's website, with Roofline products and their own account pricing already built in?

Traffic/marketing thesis:

> If you are already paying to bring people to the website, the website should do more than give them information and ask them to call. It should help them get the result they came for before they leave for Google, ChatGPT or a competitor.

24/7 thesis:

> At 9pm on a Sunday, the visitor can still get a good first answer, a useful price range and a next step without anybody at Roofline being online.

## 18. Main code areas changed

### Roofline site/integration

- `components/demo-sites/roofline/site-sections.tsx`
- `components/demo-helper/RooflineToolChoices.tsx`
- `components/demo-helper/RooflineToolHeader.tsx`
- `components/demo-helper/roofline-tools.css`
- `app/demo/roofline-site/estimate/page.tsx`

### Homeowner estimator

- `components/quick-estimate-roofline/QuickRoofEstimate.tsx`
- `components/quick-estimate-roofline/QuickQuoteEnquiry.tsx`
- `lib/quick-estimate/types.ts`
- `lib/quick-estimate/validation.ts`
- `lib/quick-estimate/draft.ts`
- `lib/quick-estimate/config.ts`
- `lib/quick-estimate/engine.ts`
- `lib/quick-estimate/pricing.ts`
- `lib/quick-estimate/roofline-profile.ts`

### Assistant

- `components/assistant/RooflineSmartAssistantLauncher.tsx`
- `components/assistant/RooflineEnquiryPanel.tsx`
- `components/assistant/EstimateResultCard.tsx`
- `components/assistant/GuidedEstimator.tsx`
- `lib/assistant/prompts.ts`
- `lib/assistant/orchestrator.ts`
- `lib/assistant/estimate-draft.ts`
- `lib/pricing/estimate-engine.ts`
- `app/api/chat/route.ts`
- `data/roofline-roofing/assistant-config.json`
- `data/roofline-roofing/roofing-knowledge.md`
- `data/roofline-roofing/business.json`
- `data/roofline-roofing/pricing.json`

### Trade / supplier pricing

- `app/supplier-pricing-tool/PortalFlow.tsx`
- `app/supplier-pricing-tool/ToolShell.tsx`
- `app/supplier-pricing-tool/TakeoffStation.tsx`
- `app/supplier-pricing-tool/OutputView.tsx`
- `app/supplier-pricing-tool/OutputActions.tsx`
- `app/supplier-pricing-tool/SupplierEnquiryModal.tsx`
- `app/supplier-pricing-tool/quote/page.tsx`
- `app/supplier-pricing-tool/supplierDefs/roofline-roofing.ts`

### Admin/demo data

- `app/supplier-pricing-tool/adminData.ts`
- `app/supplier-pricing-tool/admin/AdminPanel.tsx`
- `app/supplier-pricing-tool/admin/AdminTracking.tsx`
- `app/supplier-pricing-tool/admin/AdminTrade.tsx`
- `app/supplier-pricing-tool/admin/AdminTeam.tsx`

### Tests/assets

- `tests/roofline-demo-readiness.test.mjs`
- `public/assets/demo-roofline/roof-material-longrun.webp`

## 19. Tests / known baseline issue

A Roofline-specific readiness test suite has been added. It verifies:

- exact 160 m² / 20° homeowner input creates a tight high-confidence NZD range
- assistant exact pricing keeps deterministic maths but presents a tight public range
- Roofline estimate/enquiry sources do not contain visible UK currency/Apex copy
- assistant starters cover coastal recommendation, 4° compatibility, exact pricing and trade
- Roofline admin/trade demo uses NZ identities/localisation/versioned storage
- Roofline website CTAs carry intent into the detailed pricing tool

At the time of handoff, all Roofline readiness tests pass.

The full repository test suite has two pre-existing failures in `assistant-session-isolation.test.mjs`. Those same two tests failed on the untouched uploaded baseline before this Roofline work. They are source-contract/session-isolation tests, not failures introduced by the Roofline changes. Do not silently claim the whole legacy suite is green until those are separately resolved.

## 20. Recording reset checklist

Before recording:

1. Use a fresh browser profile/incognito window, or clear local/session storage for the app.
2. Confirm `OPENAI_API_KEY` and required assistant environment are configured.
3. Open `/demo/roofline-site` and confirm Roofline logo/header/images load.
4. Confirm homeowner example shows `NZ$`, not `£` or ambiguous UK text.
5. Run the locked 160 m² / 20° example and confirm approximately `NZ$20,700 to NZ$23,500`.
6. Open the Roofline enquiry preview and confirm Roofline/NZ wording.
7. Click the roofer/builder CTA and confirm the tool preselects actual measurements rather than returning to a generic module chooser.
8. Confirm detailed output identifies NZD and quote uses GST.
9. Ask the three assistant hero questions once. If answers become too verbose, tighten the assistant prompt rather than editing the recording around bad output.
10. Open `/supplier-pricing-tool/roofline-roofing/admin` and confirm Canterbury/NZ seed data is visible.
11. Do not log in or send anything to a real customer address. Demo contacts are `.example`.

## 21. Acceptance criteria before final video

Must have:

- no visible Apex or UK contamination in any screen actually recorded
- no pounds or GBP on Roofline screens
- homeowner range explicitly identifiable as NZD/NZ$
- exact area/pitch visibly tighten the public range
- assistant price is a range, not a false-exact public quote
- assistant answers the three hero questions reliably
- public/pricing tool carries Roofline branding/context
- trade CTA deep-links into the correct workflow
- dashboard sample names/locations feel Canterbury/NZ
- all displayed activity is clearly demo/sample data when needed
- no real Roofline email is accidentally contacted

Nice-to-have, not required for the first recording:

- deeper product-specific trade price books
- real client-provided Roofline pricing
- larger verified assistant knowledge base
- exact Roofline product images for every detailed catalogue item
- order-system/CRM/email integrations
- removing invisible internal Apex implementation names
- fixing the two unrelated legacy session-isolation tests

## 22. Final commercial framing

Do not end by summarising features. End by asking Roofline to apply its own numbers:

> These are examples of what the website can do, not a fixed three-tool package. The useful question is what even a small improvement is worth. If it saved the team five collective hours a week, retained five jobs a year that currently disappear, or gave five roofing companies a reason to price and order a couple more roofs through Roofline, what does that mean in your business? And if you are already paying to bring people to the website, how much more valuable is that traffic if the site can actually answer, price and move them forward 24/7?

That is the close the product should support.
