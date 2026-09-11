# Apex Roofing Smart Assistant V4

## Objective

Upgrade the Apex Roofing Smart Assistant into a showcase of the broader T3 Labs product.

It should not feel like a chatbot.

It should behave like an intelligent business assistant that can:

- Answer business and roofing questions
- Understand the Apex website and navigate users around it
- Build simple or detailed roof estimates
- Generate useful outputs
- Prepare detailed quote enquiries
- Remember the customer and project throughout the session
- Allow users to reset and begin again
- Work independently for many simultaneous visitors
- Operate as either a floating assistant or a pinned website workspace

The demo should make a prospective T3 Labs customer immediately understand:

> This exact system could be configured around my business, products, pricing, website and workflows.

---

# 1. Replace the Global Two-Question Rule

Do not enforce a global maximum of two clarification questions.

Use task-specific clarification behaviour.

### General questions
Usually 0-2 questions.

### Simple pricing
Usually 0-1 question.

Example:

> What is concrete tile roofing per m²?

Answer directly if the catalogue contains the rate.

### Complex pricing / project estimate
Use a guided multi-step estimator until the minimum useful information has been collected.

The goal is not:

> Ask as few questions as technically possible.

The goal is:

> Obtain enough information to give the customer a useful result with minimal effort.

Never ask again for information already captured during the session.

---

# 2. Pricing Entry Point

For broad questions such as:

> How much will a new roof cost?

First establish the type of result required where necessary.

Offer:

### Quick Price
Show approximate material / installed rates.

### Quick Ballpark
Ask only the key details required for a fast whole-job estimate.

### More Detailed Estimate
Include roof characteristics and additional components.

If the customer already gives enough detail in their original message, skip unnecessary steps.

---

# 3. New Roof vs Re-Roof

Whole-roof estimates must determine whether the project is:

**New Roof**

or

**Re-Roof / Roof Replacement**

### New Roof

Price:

- Roof covering/material
- Installation
- Selected additional components

Do not add stripping or old-roof removal charges.

### Re-Roof

Include the normal roof installation estimate plus configurable removal allowances.

For the Apex demo, initially configure:

**Strip existing roof:**  
`$10 per m²`

**Removal / disposal / site clearance:**  
`$1,000 per job`

These are DEMO pricing assumptions and must exist in the Apex pricing/rules configuration rather than being hardcoded into components.

The system should allow these values to be changed easily later.

Example breakdown:

Roof replacement - 185m²  
$XX,XXX

Strip existing roof - 185m² × $10  
$1,850

Removal / disposal allowance  
$1,000

Additional components  
$X,XXX

### Important

Clearly label these as indicative allowances.

The system must never imply that site conditions, hazardous materials, difficult access, structural work or unusual disposal requirements are included unless specifically configured.

---

# 4. Roof Size

For a whole-roof estimate ask:

> Roughly how large is the roof?

Offer:

**Small**

**Medium**

**Large**

**Enter exact area**

Initial configurable demonstration bands could be:

- Small: 50-100m²
- Medium: 100-200m²
- Large: 200-300m²

Do not hardcode these into the UI.

If the customer knows the area they can enter:

> 185m²

### Range behaviour

If Small / Medium / Large is selected rather than an exact measurement, calculate and return a PRICE RANGE based on the configured size range.

Do not pretend an approximate size is precise.

---

# 5. Roof Pitch

Pitch must be part of the guided estimate.

Ask:

> What sort of pitch does the roof have?

Offer:

**Flat / Low**

**Medium**

**Steep**

**Enter exact pitch**

Example configurable ranges:

- Flat / Low: 0-15°
- Medium: 16-35°
- Steep: 36°+

If known, allow:

> 27°

or

> About 30 degrees.

The deterministic pricing/rules engine may apply pitch-related pricing or suitability logic only where those rules exist in configuration.

The LLM must never invent pitch multipliers.

Pitch can also be used to warn whether certain coverings are suitable.

---

# 6. Roof Covering

Ask:

> What roof covering are you considering?

Render selectable cards sourced from business/pricing configuration.

Example:

**Concrete Tile**

**Clay Tile**

**Slate**

**Other / Not Sure**

If the user chooses **Not Sure**, the assistant can briefly help them choose based on factors such as:

- Budget
- Appearance
- Roof pitch
- Durability

Do not let the LLM invent products or pricing outside the configured catalogue.

---

# 7. Additional Roof Components

Do not automatically add roof components.

Ask:

> Would you like me to include any additional roof components, or keep the estimate to the main roof covering?

Options:

**Roof covering only**

**Choose components**

**Estimate components for me**

If they choose components, display multi-select options such as:

- Ridge
- Hips
- Valleys
- Barges / verges
- Flashings
- Guttering
- Insulation
- Other configured items

Then:

> If you know the approximate lengths, add them below. If not, I can use a rough allowance where the estimator has enough information.

Example:

Ridge `[ 12 ] m`

Hips `[ 18 ] m`

Valleys `[     ] m`

Gutters `[ 35 ] m`

Buttons:

**Use these quantities**

**Estimate missing quantities**

### Critical rule

Never silently infer and charge for optional components.

Heuristic quantities may only be used after the user explicitly authorises:

**Estimate components for me**

or:

**Estimate missing quantities**

---

# 8. Estimate State

Maintain a structured estimate draft.

Example:

```ts
EstimateDraft {
  projectType: "new_roof" | "reroof"

  mode:
    | "unit_rate"
    | "quick_ballpark"
    | "guided"

  area: {
    exactM2?: number
    minM2?: number
    maxM2?: number
    band?: "small" | "medium" | "large"
    source: "user_exact" | "configured_band"
  }

  pitch: {
    degrees?: number
    band?: "flat" | "medium" | "steep"
    source: "user_exact" | "user_band"
  }

  materialId?: string

  components: Array<{
    componentId: string
    selected: boolean
    quantity?: number
    unit?: string
    quantitySource?: "user" | "heuristic"
  }>

  removal?: {
    stripRatePerM2?: number
    disposalAllowance?: number
  }
}
```

Only validated structured state should be passed into the deterministic pricing engine.

The LLM interprets the customer.

The pricing engine calculates the money.

---

# 9. Guided Estimator UX

Do not make the experience feel like an interrogation.

Use interactive cards and controls.

Example:

### Step 1
**Is this a new roof or replacement?**

[ New Roof ]

[ Re-Roof ]

### Step 2
**How large is the roof?**

[ Small ]

[ Medium ]

[ Large ]

[ Enter exact m² ]

### Step 3
**What is the pitch?**

[ Flat / Low ]

[ Medium ]

[ Steep ]

[ Enter exact pitch ]

### Step 4
**Choose a roof covering**

[ Concrete ]

[ Clay ]

[ Slate ]

[ Not Sure ]

### Step 5
**Anything else to include?**

Multi-select components.

Users should be able to go back and change previous answers.

Where practical, show a compact live summary:

**Your estimate**

Re-roof  
185m²  
Medium pitch  
Concrete tile  
Ridge + gutters

---

# 10. Estimate Result

Show a clear structured result.

Example:

# Indicative Roof Estimate

**Project:** Re-roof  
**Area:** 185m²  
**Pitch:** Approx. 27°  
**Covering:** Concrete tile

### Roof

Concrete tile roof system  
$XX,XXX

### Existing Roof Removal

Strip allowance  
185m² × $10  
$1,850

Removal / disposal allowance  
$1,000

### Additional Components

Ridge - 12m  
$XXX

Gutters - estimated 35m  
$XXX

## Ballpark Total

**$XX,XXX - $XX,XXX**

Where approximate size bands or heuristic quantities are used, prefer a range.

Clearly state:

> This is an indicative ballpark estimate based on the information provided. It is not a formal quotation and may change following inspection and confirmation of measurements.

Actions:

**Request Official Quote**

**Adjust Estimate**

**Download Estimate**

---

# 11. Quote Request

The estimate should naturally funnel into an enquiry.

When the user chooses:

**Request Official Quote**

say:

> I already have most of the project information. I’ll use it to prepare the enquiry.

Then display:

# Here’s What I Know So Far

- New roof / re-roof
- Roof area
- Pitch
- Covering
- Components
- Component quantities
- Indicative estimate
- Pricing assumptions
- Relevant notes from the conversation

Buttons:

**Looks Good**

**Edit Details**

If **Looks Good**, request only missing customer details.

For example:

- Name
- Email
- Phone
- Address / project location

Do not make the customer re-enter project details already captured.

---

# 12. Quote Attachments

Allow optional attachments when submitting an official quote request.

Useful examples:

- Roof photographs
- Building plans
- Existing quote
- Survey
- Measurements
- Damage photographs
- Other relevant files

Never make attachments mandatory.

These files should be associated with that user's enquiry/session only.

---

# 13. Session Memory

Each visitor must have their own completely isolated session.

The assistant should remember during that session:

- Questions asked
- Project information
- Estimate selections
- Estimates generated
- Website pages discussed
- User preferences
- Inquiry details
- Generated outputs

User A must never affect User B.

Multiple simultaneous users must safely use the same public assistant.

Production/serverless deployments must use persistent/shared session storage rather than process-local memory.

---

# 14. Restart / Clear Conversation

Add an obvious but unobtrusive reset control inside the assistant.

Example:

**Start New Conversation**

or icon + tooltip:

**Reset Assistant**

When selected, show confirmation:

> Start a new conversation?

> This will clear the assistant’s memory of this chat, including your project details and estimate. The assistant will treat you as a new visitor.

Buttons:

**Cancel**

**Start Fresh**

If confirmed:

- Clear conversation history
- Clear captured facts
- Clear active estimate
- Clear enquiry draft
- Clear generated-output references belonging to that conversation where appropriate
- Create a new clean session

Do not accidentally retain hidden conversational context after reset.

---

# 15. Back to Chat

Generated outputs, estimates and enquiries may temporarily replace the conversation view.

Always provide:

**← Back to Chat**

Returning to chat must retain the existing session and context.

Back to Chat and Start New Conversation are completely different actions.

---

# 16. Floating Assistant Mode

Desktop should support the existing floating assistant experience.

Improve it so the panel can be repositioned.

### Requirements

- Drag using the header
- Keep inside viewport
- Remember position locally
- Reset position option if useful
- Default bottom-right
- Do not interfere with scrolling or text selection
- Mobile remains fixed/full-screen

---

# 17. Pinned Workspace Mode

Add a second desktop mode:

**Pin Assistant**

When pinned, transform the page into a two-panel workspace.

Example:

```text
--------------------------------------------------
|                     |                          |
|                     |      Ask Apex            |
|     WEBSITE         |      Smart Assistant     |
|                     |                          |
|     ~70% width      |      ~30% width          |
|                     |                          |
--------------------------------------------------
```

Recommended:

Website: approximately 65-75%

Assistant: approximately 25-35%

Allow responsive resizing if practical.

When pinned:

- Assistant no longer covers website content.
- Website remains fully navigable.
- Chat remains visible while browsing.
- Assistant retains full conversational memory.
- Website navigation actions update the main website panel.

Provide:

**Unpin Assistant**

to return to floating mode.

### Mobile

Do not use split-screen pinning.

Use the full-screen assistant experience.

---

# 18. Website Awareness

The Smart Assistant should understand the Apex website structure.

Do not rely on the model magically knowing URLs.

Maintain a structured site map / website knowledge file containing:

- Page title
- URL/path
- Description
- Key topics
- Relevant services/products
- Optional aliases/search phrases
- Optional section anchors

Example:

```json
{
  "title": "Roof Replacement",
  "path": "/services/roof-replacement",
  "description": "Apex roof replacement and re-roofing service.",
  "topics": [
    "reroof",
    "roof replacement",
    "old roof",
    "new tiles"
  ]
}
```

The assistant can then answer:

> Yes. Apex has a page explaining roof replacement.

**[View Roof Replacement →]**

---

# 19. Build Enough Apex Pages to Demonstrate Navigation

The fictitious Apex site should contain enough real content for the assistant-navigation feature to feel convincing.

Recommended pages:

### Services

- Roof Replacement / Re-Roofing
- New Roof Installation
- Roof Repairs
- Flat Roofing
- Guttering
- Storm / Emergency Roofing
- Insurance Work

### Information

- Roofing Materials
- Concrete vs Clay vs Slate
- Roof Pitch Guide
- How Roofing Estimates Work
- Roofing FAQ
- Warranties / Guarantees
- Service Areas

### Commercial

- Request a Quote
- Contact Apex

The pages do not need to be enormous.

They need to look credible and give the Smart Assistant meaningful destinations.

---

# 20. Interactive Website Navigation

When a user asks:

> Do Apex handle insurance claims?

The assistant can answer briefly and then provide:

**[View Insurance Roofing →]**

When clicked:

### Floating mode
Navigate the underlying website while keeping the assistant available.

### Pinned mode
Load the destination in the website panel while chat remains visible.

This is an important demo feature.

The assistant should feel capable of controlling and navigating the website on the customer's behalf.

---

# 21. Context-Aware Page Assistance

Where practical, tell the assistant what page the customer is currently viewing.

Example:

The visitor is on `/services/roof-replacement`.

Opening line could be:

> Looking at roof replacement? I can explain the process, compare materials, or give you a quick ballpark estimate.

The assistant should understand page context without forgetting the broader conversation.

---

# 22. Dynamic UI Actions

The assistant should be able to return structured actions such as:

- Open page
- Start estimate
- Choose material
- Select component
- Adjust estimate
- Generate PDF
- Download PDF
- Start enquiry
- Upload attachment
- View output
- Back to chat

Do not infer buttons by regex-parsing assistant prose.

Actions should be structured server responses.

Conceptually:

```ts
{
  message: "...",
  actions: [
    {
      type: "navigate",
      label: "View Roof Replacement",
      path: "/services/roof-replacement"
    },
    {
      type: "start_estimate",
      label: "Get a Ballpark Price"
    }
  ]
}
```

---

# 23. Generated Outputs

The assistant should demonstrate that it can produce things, not merely talk.

Examples:

- Indicative estimate
- Downloadable PDF
- Quote-request summary
- Project summary
- Material comparison

Example:

### Your Estimate Is Ready

Apex Roofing  
Indicative Roof Estimate

**[View Estimate]**

**[Download PDF]**

**[Request Formal Quote]**

This is a core T3 Labs demonstration capability.

---

# 24. Pricing Safety

Maintain the deterministic pricing principle.

The model must never:

- Invent rates
- Invent products
- Invent multipliers
- Perform final pricing arithmetic
- Silently select materials
- Silently add components
- Treat estimates as formal quotations

Everything commercial must come from approved structured pricing and rules.

---

# 25. Demonstration Scenarios

Build and test several showcase flows specifically for sales demonstrations.

## Demo 1 - Instant Business Knowledge

Customer:

> Do you handle insurance roofing work?

Assistant answers and provides:

**[View Insurance Roofing →]**

Demonstrates:

- Business knowledge
- Website knowledge
- Navigation

---

## Demo 2 - Quick Price

Customer:

> What's your installed concrete tile price per square metre?

Assistant answers directly from catalogue.

Demonstrates:

- Instant pricing
- No unnecessary questions

---

## Demo 3 - Guided Roof Estimate

Customer:

> Roughly what would it cost to replace my roof?

Flow:

1. New roof vs re-roof
2. Roof size
3. Pitch
4. Material
5. Additional components
6. Estimate
7. Download PDF
8. Request formal quote

Demonstrates:

- Conversation
- Guided UI
- Deterministic calculation
- Memory
- Generated output
- Conversion

---

## Demo 4 - Intelligent Memory

After estimate, customer says:

> Can you send this to Apex for a proper quote?

Assistant displays everything already known.

User only supplies contact details.

Demonstrates:

- Session memory
- Lead qualification
- Reduced form friction

---

## Demo 5 - Attachments

During quote request:

> I've got some photos.

Allow upload.

Demonstrates:

- Rich enquiry capture
- Business-ready lead

---

## Demo 6 - Smart Website Navigation

Customer:

> What's the difference between slate and concrete?

Assistant gives concise explanation.

Then:

**[Read Full Material Comparison →]**

Pinned website panel changes while conversation remains visible.

Demonstrates:

- Assistant + website working together

---

## Demo 7 - Guardrails

Customer asks something outside Apex's approved knowledge.

Assistant says it does not have enough verified information and offers:

**[Ask the Apex Team →]**

Demonstrates:

- Anti-hallucination
- Human handoff

---

## Demo 8 - Reset Memory

Generate a full estimate.

Then click:

**Start New Conversation**

Confirm reset.

Ask:

> What roof did I say I had?

Assistant should have no memory of the previous session.

Demonstrates:

- Correct session lifecycle
- Privacy/control

---

# 26. Core UX Philosophy

Do not optimise for the fewest possible messages.

Optimise for the least amount of customer effort required to reach a useful outcome.

Use:

- Conversation when talking is easiest
- Buttons when clicking is easiest
- Cards when comparing is easiest
- Forms when structured input is easiest
- Website navigation when existing website content is best
- Files when a tangible output is valuable

The customer should never feel like they are filling out a traditional long form.

---

# 27. Core Commercial Goal

This demo needs to show that the Smart Assistant can take common low-value staff interactions such as:

> How much might this cost?

> Do you offer this?

> Which product do I need?

> Where can I find this?

> Can someone quote this?

and handle most of the work immediately.

Where the customer becomes serious, the assistant should pass the business a much better qualified lead containing:

- Customer details
- Requirement
- Roof size
- Pitch
- Material
- Components
- Estimate
- Conversation context
- Attachments
- Requested next action

The point is not to eliminate human sales staff.

The point is to ensure human time is spent on customers who are better informed, better qualified and closer to purchasing.

---

# 28. Final Product Principle

The Apex Smart Assistant should demonstrate:

> **A website that understands what the customer wants and helps them accomplish it.**

It is not merely:

> AI chat on a website.

It is:

> **Business knowledge + website knowledge + pricing + calculations + memory + navigation + actions + outputs + conversion, delivered through one intelligent interface.**

That is the T3 Labs product we are demonstrating.