# Roofline 10-Minute Demo Recording Script

Goal: create a concise personalised video that makes Roofline see its website as a self-service sales, pricing and trade platform rather than a brochure site with three attached tools.

Tone: conversational, exploratory and commercially grounded. Avoid sounding like a rehearsed software feature list. Ask "what would this mean for you?" rather than claiming an unsupported conversion uplift.

Target length: 9:30-10:15.

---

## Before recording

Open these routes in tabs, but begin on the Roofline-style website:

1. `/demo/roofline-site`
2. `/demo/roofline-site/quick-estimate`
3. `/supplier-pricing-tool/roofline-roofing?entry=measurements`
4. `/supplier-pricing-tool/roofline-roofing/admin`

Use a fresh/incognito session. Verify assistant is configured and responsive.

Locked homeowner case:

- gable
- 160 m² actual roof area
- 20° pitch
- one storey
- re-roof
- existing metal
- Roofdeck 0.40g
- expected public result about NZ$20,700-NZ$23,500

Assistant price case uses the same job and should land around NZ$21,100-NZ$24,000 with the current assistant placeholder model.

---

## 0:00-0:50 | Set up the problem on the Roofline-style site

### Screen

Roofline homepage. Move naturally rather than immediately jumping into software.

### Voiceover

"I wanted to show you a quick idea based around Roofline's existing website. This isn't about replacing the website or adding another chatbot for the sake of it. It's really about asking what else the website could do for people once you've paid or worked to get them here.

At the moment somebody can land on a roofing website looking for a very simple answer: what product should I use, can this profile work on my roof, or roughly what is this going to cost? If they arrive at 9 o'clock on a Sunday night, they either find the answer, submit an enquiry and wait, or quite often they keep searching somewhere else.

So the example we've built is about giving them a useful first result immediately, while still funnelling the right people into Roofline." 

### Click

Go to the pricing/estimate entry.

### Point to make

Do not say "here are our three tools." Say that the website now has useful actions for different visitors.

---

## 0:50-2:35 | Homeowner: instant useful answer

### Screen

Pricing entry page. Briefly show the two main outcomes:

- Planning a roofing project? -> Get an instant estimate
- Pricing a job for a customer? -> Price a job

### Voiceover

"For a homeowner, they shouldn't have to know roofing terminology or call the office just to find out whether the project is even in the range they expected. So this route is deliberately simple." 

Click **Get an instant estimate**.

### Screen

Use the pre-filled 160 m² demo example or move quickly through the selected choices.

### Voiceover while the example is visible

"The important part isn't the exact questions; they're configurable. The idea is that somebody who knows very little can choose a roof shape and approximate information, but somebody who actually knows the roof is 160 square metres and 20 degrees can enter that as well.

And the more certain the information becomes, the tighter the indicative range becomes. We're not taking a vague roof and saying it could be five thousand or fifty thousand dollars. If we know the area, pitch, roof type and what is coming off and going back on, the system has enough information to give a genuinely useful starting point." 

### Result

Show approximately:

**NZ$20,700 to NZ$23,500**

High-confidence indicative range.

### Voiceover

"So this person has got the answer they came for. This isn't a Roofline quote and these are just demo rates, but it's useful enough that they don't have to leave the website to find some sort of answer elsewhere.

And Roofline doesn't have to publish its best trade price or an exact final price. You can configure a public range around where you expect the job to land. If the visitor gives less information the range is wider; when they give better information it narrows." 

### Click

Open the enquiry / quote-request preview.

### Voiceover

"Then if they do want Roofline to take it further, the enquiry is already much better than 'I've got a roof, how much will it cost?' The team gets the roof shape, area, pitch, existing material, preferred Roofline profile and the estimate context before anybody has picked up the phone." 

### Commercial line

"Even if all this did was remove a portion of the really basic price-checking calls and stop a few people leaving because nobody was available, that starts to have a value immediately." 

---

## 2:35-4:20 | Roofer / builder: make Roofline useful for their work

### Transition

Back to pricing entry or open the roofer/builder tab.

### Voiceover

"The second use case is quite different. A roofer or builder doesn't need the simplified homeowner experience. They may already have measurements and they just want to price the job." 

### Screen

Open `/supplier-pricing-tool/roofline-roofing?entry=measurements`.

The Roofline header should remain present and the flow should already be oriented toward actual measurements.

### Voiceover

"Here the website becomes more like a workspace. They can enter the job measurements, choose Roofline products and build the material and installation price around the same product catalogue." 

### Interaction

Do enough to show the measurement/product/output relationship. Do not demonstrate every line item.

If trade login is visually convenient, point to **Log in for trade pricing**.

### Voiceover

"And this is where it becomes interesting for existing or potential trade customers. A public user can have a public price, while a logged-in roofing company can have its own tier or even its own product rates. Roofline doesn't have to expose those rates to everyone." 

Show final NZD output and, if convenient, the quote/enquiry action.

### Commercial line

"If a roofer currently buys from two or three different suppliers, what happens if the easiest place for them to price their next job is Roofline's website, with Roofline products and their account pricing already built into the workflow? You only need a handful of roofers to start using something like this regularly before the question becomes how many additional orders that produces over a year." 

### Optional 5-second mention

"And if they are working from plans rather than measurements, that can just be another entry path into the same pricing engine." 

Do not launch into a full plan-takeoff demonstration unless the video is running short.

---

## 4:20-6:25 | Smart Assistant: knowledge -> technical answer -> price

### Transition

Return to Roofline site and open the Smart Assistant.

### Voiceover

"The same idea applies to all the questions that sit between somebody arriving and somebody being ready to enquire. Rather than a generic website bot, the assistant can sit over Roofline's actual product knowledge and the same pricing logic." 

### Question 1

Ask:

**I'm building near the coast. Which Roofline roofing finish should I consider?**

### Desired behaviour

Short answer explaining ZinaCore / MagnaFlow / AlumiGard by environment and that exact exposure/location should be confirmed.

### Voiceover

"That's a product-selection question. It's not just searching a generic roofing FAQ; it's answering in the context of the finishes Roofline actually talks about." 

### Question 2

Ask:

**Can Roofdeck be used on a 4 degree roof?**

### Desired behaviour

Yes, Roofdeck is described by Roofline as suitable down to about 3°, with final specification/details to confirm.

### Voiceover

"Now we're into a specific technical compatibility question. Again, the goal isn't to replace technical staff on unusual jobs; it's to answer the straightforward first question well enough that the user can keep moving." 

### Question 3

Ask:

**I have a 160 m², 20° metal re-roof and I'm considering Roofdeck 0.40g. Can you give me an indicative price for the main roof system?**

### Desired result

About **NZ$21,100-NZ$24,000** using current placeholders.

### Voiceover

"And now the conversation has moved naturally from product knowledge into pricing. The assistant is using the pricing engine rather than inventing a number in the chat.

From here it can ask for anything missing, refine the estimate or carry what it already knows into an enquiry. The person hasn't had to search five pages, open another calculator and then repeat everything in a contact form." 

### 24/7 line

"And this works the same way whether it's 10 in the morning or 9 at night on a Sunday." 

---

## 6:25-8:15 | Dashboard: show the business payoff

### Transition

Open `/supplier-pricing-tool/roofline-roofing/admin`.

### Voiceover

"That's the visitor side. What I think is potentially more useful is what Roofline gets on the other side." 

### Screen

Tracking overview.

Point to, in order:

- quotes created
- became orders
- average quote
- outside-business-hours activity
- anonymous usage

### Voiceover

"Instead of just knowing that the website got traffic, you can start seeing what people were actually trying to price, how much activity happened when the office wasn't open, which users are anonymous and which are known or trade accounts." 

### Screen

Show repeated quote / opportunity rows.

### Voiceover

"You can also surface things like a known customer who has priced several jobs but has no recorded order. That doesn't prove they bought from somebody else, but it is a useful sales signal. Your team knows exactly who is showing repeated buying intent rather than calling through a list cold." 

### Screen

Trade customers/tier section.

### Voiceover

"Trade customers can have different pricing tiers, and you can see who is actually using the system. The product/pricing section is controlled by Roofline, so the public range, trade rates and product catalogue don't have to be hard-coded forever; they're part of the business setup." 

### Important

Do not imply any dashboard sample figure is real Roofline activity. Call it sample/demo activity if needed.

---

## 8:15-10:00 | Close on economics, not features

### Screen

Stay on dashboard or return to a visually strong Roofline page. Do not open an ROI calculator.

### Voiceover

"So those are really just examples of capability. The point isn't that Roofline must have exactly these three tools in exactly this format. If there is another repetitive question, quoting process or customer workflow that is worth solving, the system can be adjusted around that.

The way I'd look at the value is quite conservatively. I'm not asking you to believe that putting this on the website suddenly doubles conversion.

If it collectively saved the team only five hours a week answering basic questions, chasing initial information or doing first-pass pricing, that's about 250 staff hours over a year.

If it retained only five potential orders a year that might otherwise land here, fail to get the answer they wanted and keep searching, what is five orders worth at your actual margin?

If five roofing businesses started using the pricing tools because they were useful, and each of those businesses placed only another two or three roofs a year through Roofline, what does that mean?

Or if better structured pricing and answer content meant another hundred relevant people found Roofline over a year and only five of them turned into real orders, what is that worth?

And if you're already paying for marketing or putting effort into search, then every visitor you bring here becomes more valuable if the website can actually help them do something rather than just telling them to call." 

### Final close

"That's really what we're trying to show with this. Turn the website into somewhere homeowners can get answers, roofers can actually work and price jobs, and Roofline can capture better intent and better enquiries around the clock. The exact pricing, ranges, products and workflows are all configurable. The useful question is: if it made even a small improvement across those areas, what would that be worth to Roofline?" 

Stop. Do not keep feature-selling after this point.

---

# Short fallback version if the demo runs long

If you are over time, cut in this order:

1. Skip the plan-tool mention entirely.
2. In the trade flow, show pre-existing output rather than entering multiple measurements live.
3. In admin, show only overview + one opportunity + trade tier.
4. Keep all three assistant questions; they establish the assistant's progression better than random FAQ examples.
5. Never cut the final value framing completely. The video needs to end on the business question, not on a settings screen.

# Recording guardrails

- Always say demo/illustrative pricing when discussing the numbers.
- Do not call an indicative range a Roofline quote.
- Do not claim a specific percentage conversion uplift.
- Do not claim a sample admin activity number is Roofline's real data.
- Do not claim an exact customer has gone to a competitor just because no order is recorded.
- Do not say Roofline must expose its actual trade pricing publicly.
- Keep the assistant answers short on screen; long chat responses slow the recording.
- If a live assistant answer varies materially from the desired answer, tighten the prompt/config before recording rather than narrating around it.
