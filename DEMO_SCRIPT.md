# Apex Roofing Smart Assistant - Demo Script V2

Use a fresh private/incognito session for the cleanest recording. The strongest single demo is the end-to-end story at the bottom.

## 1. Show grounded business knowledge

**User:** Do you handle insurance work?

Expected: concise answer from `business.json`, with no invented detail.

**User:** Where can I read more about that?

Expected: a real navigation button from `site-map.json` that takes the visitor to the insurance section.

## 2. Show technical roofing knowledge

**User:** What is the difference between a hip roof and a gable roof?

Expected: short, accurate answer from `roofing-knowledge.md`.

## 3. Show exact catalogue pricing

**User:** How much is concrete tile re-roofing per m2?

Expected: exact approved catalogue rate. The model never calculates or invents the number.

## 4. Show the new estimate scope flow

**User:** I have a 200 m² roof that needs replacing. Roughly what would it cost?

Expected sequence:

1. If material is missing, the assistant asks and shows structured material choices.
2. After material is known, it asks what to include in the estimate and shows three choices:
   - Roof covering only
   - Add components I know
   - Estimate roof components

### Path A - covering only

Choose **Roof covering only**.

Expected: the estimate contains the main covering only. It must not silently add ridge, hip, valley, flashing, gutters or insulation.

Point out to the prospect: this is deliberate control. The assistant does not assume chargeable work the customer did not request.

### Path B - customer-supplied components

On a fresh estimate choose **Add components I know**.

**User:** Add about 18 metres of ridge/hip and 9 metres of valley.

Expected: only those approved components are added at the supplied quantities.

### Path C - geometry-based allowances

On a fresh estimate choose **Estimate roof components**.

If needed, choose **Hip** when asked for roof shape.

Expected: the assistant adds only the roof components it has been explicitly authorised to estimate, with geometry-based quantities labelled as indicative allowances.

## 5. Show useful output actions

From an estimate:

- Click **Download estimate PDF**.
- Confirm the downloaded PDF matches the estimate card exactly.
- If gutters are absent, click **Add estimated gutters** and confirm a revised estimate is produced.

## 6. Show memory and enquiry conversion

Click **Request a formal quote**.

Expected review screen:

- Project details already captured
- Roof area/material/shape/pitch when known
- Estimate scope
- Full indicative estimate line items and total

Then demonstrate the difference between the buttons:

- **Looks good** goes straight to the minimal contact step.
- **Edit details** opens the editable project information.

At the contact step, only name plus email or phone are required. Submit the demo enquiry and show the success state.

## 7. Show honest boundaries

**User:** Who is the best roofer in Portland and what do your competitors charge?

Expected: no invented competitor information. The assistant explains it does not have approved information for that and can prepare an enquiry where useful.

## Flagship single-take story

1. Land on the page and let the Smart Website teaser appear.
2. Open Ask Apex from the teaser or the hero button.
3. Ask: **I have a 200 m² hip roof and want concrete tiles. Roughly what would replacement cost?**
4. Choose **Roof covering only** first and show the clean estimate.
5. Click **Add roof components**, then authorise estimated ridge/hip/valley allowances.
6. Download the PDF.
7. Request a formal quote.
8. Show the pre-filled review, choose **Looks good**, add contact details and submit.
9. Ask for the insurance page and click the navigation button.
10. Ask an unsupported competitor question to show the handoff boundary.

The story should feel like: **ask naturally -> get a controlled answer -> calculate -> act -> convert**.
