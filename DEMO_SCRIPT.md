# Apex Roofing Smart Assistant - Demo Script V4.1

Use a fresh private/incognito session for the cleanest recording. The strongest demo is the end-to-end guided estimate story below.

## 1. Grounded business knowledge + website navigation

**User:** Do you handle insurance work?

Expected: concise answer from approved Apex data.

**User:** Where can I read more about that?

Expected: a real navigation button from `site-map.json`. In pinned mode, the insurance page opens beside the conversation without losing chat context.

## 2. Technical roofing knowledge

**User:** What is the difference between a hip roof and a gable roof?

Expected: short, accurate answer from `roofing-knowledge.md`.

**User:** Why does roof pitch matter?

Expected: explain material suitability and plan-area vs sloped-area effects. No invented pricing multiplier.

## 3. Exact catalogue pricing

**User:** What is the installed concrete tile roof-system rate per m2?

Expected: exact approved catalogue rate in GBP. The rate excludes old-roof stripping/disposal, which are separate re-roof allowances.

## 4. Guided whole-roof estimate

**User:** Roughly what would it cost to replace my roof?

Choose the guided estimate path and demonstrate:

1. **Re-roof / replacement** - adds configured strip and disposal allowances.
2. **Roof size** - enter `200 m²` and choose **Actual roof area**. Mention that Small/Medium/Large also work and return ranges.
3. **Pitch** - choose **Medium** or enter `30°`.
4. **Roof covering** - choose **Concrete tile**.
5. **Components** - choose **Estimate roofline components**, then choose **Hip**.

Expected result:

- Main concrete roof system
- Re-roof strip allowance
- Disposal/removal allowance
- Only the explicitly authorised ridge/hip allowance
- No invented valley, gutter, flashing or insulation charges
- Clear indicative disclaimer and assumptions

## 5. Show exact customer-supplied components

Click **Adjust Estimate**.

At the component step choose **Choose components** and demonstrate something like:

- Ridge/hip: `18 m`
- Guttering: `35 m`

Choose **Use these quantities**.

Expected: the deterministic engine uses exactly those supplied quantities. Anything not selected is omitted.

## 6. Show plan-area + pitch intelligence

Start another estimate or adjust the existing one.

Enter `180 m²` and choose **Footprint / plan area**, then enter `30°` pitch.

Expected: the engine converts the plan area to estimated sloped roof area before calculating the covering quantity. The assumption is visible in the estimate.

## 7. Show material / pitch guardrails

Choose **Flat / Low** pitch.

Expected: concrete, clay and slate options that do not meet their configured minimum pitch are disabled. The estimator explains that the configured tiled/slate systems are not suitable and offers a path to ask about Apex flat-roofing services rather than inventing a price.

## 8. Generated output

From a completed estimate:

- Click **Download PDF**.
- Confirm the PDF uses the same deterministic estimate object and numbers shown in the UI.

This demonstrates that the assistant produces a useful output rather than merely answering a question.

## 9. Memory + enquiry conversion

Click **Request Official Quote**.

Expected review screen:

- New roof / re-roof
- Roof area and area type
- Pitch
- Roof shape where known
- Covering
- Selected components and quantities
- Full indicative estimate and assumptions

Then show:

- **Looks good** -> minimal contact step.
- **Edit details** -> editable project information.
- Optional attachments can be selected for the demo.

Only missing contact details should be required. The user should never have to retype the roofing information already captured.

## 10. Pinned Smart Website mode

Pin the assistant on desktop.

**User:** Show me your roof replacement service.

Expected: the website panel navigates to the correct Apex page while the Smart Assistant remains visible with the same conversation and estimate memory.

Then ask a question about the page currently on screen. The assistant should use the shared website content as approved knowledge.

## 11. Reset memory

Click **Start New Conversation** and confirm the warning.

Then ask:

**User:** What size roof did I tell you I had?

Expected: the assistant has no memory of the old project and treats the visitor as new.

## 12. Honest boundaries

**User:** Who is the best roofer in Leeds and what do your competitors charge?

Expected: no invented competitor data. The assistant states that it does not have approved information for that request and offers a sensible next step where appropriate.

# Flagship single-take story

1. Land on `/demo/roofing-site` and let the Smart Website teaser appear.
2. Open **Ask Apex** and pin the assistant.
3. Ask: **Roughly what would it cost to replace my roof?**
4. Complete: Re-roof -> 200 m² actual roof area -> 30° -> Concrete tile -> Estimate roofline components -> Hip.
5. Show the itemised estimate and explicit strip/disposal allowances.
6. Click **Adjust Estimate**, add a known gutter length, and recalculate.
7. Download the PDF.
8. Request an official quote and show the pre-filled project summary.
9. Add contact details and optionally select roof photos/plans.
10. Ask about insurance roofing and click the page-navigation button so the site moves beside the assistant.
11. Reset the conversation to demonstrate clean session control.

The story should feel like:

**ask naturally -> collect only useful details -> calculate deterministically -> navigate -> produce an output -> convert into a qualified enquiry**
