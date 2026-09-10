# T3 Labs Smart Assistant - UX Direction Brief

Build the Smart Assistant so it immediately feels different from a normal website chatbot.

The user should understand within the first few seconds:

> **This is a Smart Website. Instead of searching through pages yourself, just ask the Smart Assistant.**

The assistant should feel like the fastest way to use the website, not like a customer-support bot.

## Core UX Principle

**Chat is the mechanism, not the product.**

The visible product is a smart business assistant that can:

- Answer questions
- Give indicative pricing
- Help with complex requests
- Find the right page on the website
- Generate useful outputs
- Build and pre-fill enquiries
- Suggest the next best action

The interface should feel like **intelligent software you can talk to**, not a small support widget.

## 1. First 3-5 Seconds

Do NOT use a large intrusive modal.

Instead, use a small premium teaser panel that appears once shortly after page load, near the assistant launcher.

### Suggested teaser

**This is a Smart Website**

Don't waste time searching through pages. Ask the Smart Assistant anything about Apex Roofing - services, roofing advice, pricing, or where to find something.

**Example question:**

> "Roughly what would a 200m2 concrete tile roof replacement cost?"

**[Ask the Smart Assistant ->]**

### Behaviour

- Appear once per visitor/session.
- Small enough that it does not block the page.
- Desktop: anchored bottom-right above the launcher.
- Mobile: compact bottom sheet/card.
- Easy to dismiss.
- Auto-collapse after a sensible period if ignored.
- Once collapsed, leave a clear assistant launcher visible.

## 2. Assistant Launcher

Avoid a generic speech-bubble icon with "Chat with us".

Use a branded launcher with clear value.

### Recommended

**Ask Apex**
*Instant roofing advice & pricing*

The launcher should look premium and slightly more substantial than a normal chatbot bubble.

## 3. Opening Screen

When opened, never show an empty chat screen.

### Header

**Ask Apex**

Small supporting line:

> Ask me like you'd ask a member of the Apex team.

### Intro

> I know Apex Roofing's services, roofing information and pricing. I can answer questions, estimate projects, find pages on the website and help prepare an enquiry.

### Primary actions

Show 4 large action cards/chips:

**Get an estimate** - Work out an indicative project price.
**Ask a roofing question** - Materials, roof types, repairs, pitch, guarantees and more.
**Find something on the site** - Tell me what you need and I'll take you there.
**Start an enquiry** - I'll help prepare the details for the Apex team.

Below these:

**Or just ask me anything...**

Then the message input.

## 4. Visual Direction

The assistant should feel like a compact premium workspace, not a WhatsApp-style chat clone.

### Desktop

- Width: approximately 480-600px when open.
- Enough room for estimate cards, buttons, forms, pricing breakdowns and generated outputs.
- Clean panel with rounded corners and subtle shadow.
- Strong spacing and hierarchy.
- Match Apex branding: Blue #1769E0, Slate #1E293B.
- White / light neutral background.
- Minimal use of chat bubbles.
- Responses can appear as cards, sections and structured UI.

### Mobile

- Open full-screen or near full-screen.
- Sticky header.
- Sticky message box at bottom.
- Large tap targets.
- All actions usable one-handed.

## 5. Use UI Instead of Text Whenever Better

The assistant should not answer everything with paragraphs.

If a click is easier than typing, show a button.
If a choice is easier than explaining, show cards.
If structured information is easier to understand visually, render it as structured UI.

### Estimate example

**Indicative Estimate**

200m2 Concrete Tile Roof

Roof covering - $X
Underlay & battens - $X
Hip components - $X
Waste allowance - $X

**Estimated total: $XX,XXX**

**[Create Estimate]** **[Add Guttering]** **[Request Formal Quote]**

### Website navigation example

User: "Where can I read about insurance work?"
Assistant: "Apex has a page explaining its insurance roofing process."
**[View Insurance Work ->]** - deep-links to the correct page.

### Product / material choice example

Instead of asking the user to type:

**Concrete Tile** - Good value / durable - **[Select]**
**Slate** - Premium / long lifespan - **[Select]**
**Not Sure** - Help me choose - **[Help Me Decide]**

## 6. Make Memory Visible

When the user chooses to make an enquiry, show:

**Here's what I know so far**

Project: Full roof replacement
Roof type: Hip
Area: Approx. 200m2
Pitch: Approx. 30 degrees
Material: Concrete tile
Also interested in: Guttering
Indicative estimate: $XX,XXX

**[Looks Good]** **[Edit Details]**

Then ask only for missing personal details: Name, Email, Phone.

The enquiry form should be pre-filled from the conversation.

## 7. Generated Outputs

When the assistant creates something, make it feel like a completed task.

Example: **"Preparing your estimate..."**

Then show:

### Your Estimate Is Ready

**Apex Roofing - Indicative Roof Estimate**
200m2 Hip Roof - Concrete Tile

**[View Estimate]** **[Download PDF]**

Optionally: **[Request Formal Quote]**

The important feeling: the assistant did something useful, not merely answered a question.

## 8. Tone

The assistant should sound like a competent member of the business.

Good: "Yes. Apex works with both natural slate and fibre-cement slate." / "I can estimate that. I just need two details first." / "Based on what you've told me, concrete tile is likely the more economical option."

Avoid: "Absolutely! I'd be delighted to assist you with your roofing journey!"

Tone: Warm, Concise, Confident, Professional, Helpful. Never fluffy, never overly "AI-like". **Competence over personality.**

## 9. Context Awareness

If possible, the assistant should know what page/section the user is currently viewing, and its opening line can acknowledge it. (Optional/low priority for this demo.)

## 10. Demo-Specific Behaviour

The first suggested example should be something impressive, not a basic FAQ.

### Recommended demo example

> "I have a 200m2 hip roof and I'm thinking about concrete tiles. Roughly what would replacement cost?"

Other suggestions: "What's the difference between slate and concrete tiles?" / "Do you handle insurance work?" / "Where can I find your roof repair service?" / "Can you prepare an enquiry for my project?"

## 11. What to Avoid

Do not build: a generic circular chatbot bubble only; a blank chat window; "Hi! How can I help you today?" as the main opening; long AI-generated paragraphs; endless back-and-forth questioning; buttons that are merely decorative; huge intrusive pop-ups; cartoon robot avatars; overly playful AI branding; a support-chat visual style.

## 12. Desired User Reaction

Within a few seconds: "Oh, this isn't a normal chatbot."
Then: "I can just ask it what I actually want."
After using it: "This is much easier than searching the website."
For a T3 Labs prospect: "I can immediately see how this could work for my business."

## Final Build Principle

> Instead of making users learn how to navigate the website, let them describe what they want and turn that intent into the correct answer, page, calculation, document or enquiry.

Note: this demo uses USD currency (not GBP as shown in the original examples).
