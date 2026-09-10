# Smart Assistant — T3 Labs (Apex Roofing Demo)

An interactive **Smart Assistant** demo for the fictional company **Apex Roofing**, built by T3 Labs. It is not "a chatbot with a company prompt" — it is a controlled **business knowledge, calculation, action and conversion engine** with a conversational interface.

Live page: `/apex-roofing`

Full build spec: [`docs/SMART_ASSISTANT_SPEC.md`](docs/SMART_ASSISTANT_SPEC.md)

---

## What it is

A visitor to `/apex-roofing` can:

- Ask business questions (services, hours, insurance work, guarantees) and get **grounded answers** from approved data.
- Ask roofing knowledge questions (hip vs gable, roof pitch, plan vs actual area) answered from an **approved knowledge base**.
- Ask for **exact catalogue prices** ("how much is concrete re-roofing per m2?").
- Request an **indicative estimate** (e.g. 200 m² re-roof) — the assistant asks **at most two clarification questions**, then a **deterministic server-side engine** calculates the itemised estimate.
- Click real buttons to **add options** (gutters), **download an estimate PDF**, and **make a pre-filled enquiry** from facts already captured in conversation.
- Ask "where can I read about your guarantees?" and get a **validated navigation button** to the right page section.
- Ask an unsupported question and get a **clean, honest handoff** instead of a hallucinated answer.

Every visitor gets an isolated session (cookie-based); messages, facts, estimates, enquiries and PDFs never cross between visitors.

---

## Architecture overview (6 layers)

| Layer | What it does | Where it lives |
|---|---|---|
| **1. Business Knowledge** | Approved facts: business profile, FAQs, services, guarantees | `data/apex-roofing/business.json`, `roofing-knowledge.md` |
| **2. Commercial Data** | Structured pricing catalogue (the only price source) | `data/apex-roofing/pricing.json` |
| **3. Rules / Calculation** | Deterministic estimate engine + rounding/waste/perimeter rules | `lib/pricing/`, `data/apex-roofing/estimate-rules.json` |
| **4. Conversation** | Orchestrated LLM pipeline: model classifies/extracts via tool calls, server executes | `lib/assistant/orchestrator.ts`, `prompts.ts` |
| **5. Action** | Allowlisted server actions: estimate, enquiry, PDF output, navigation | `app/api/outputs/`, `app/api/inquiry/`, site-map resolution |
| **6. Presentation** | Chat UI rendering only structured turn payloads (cards/actions) — never parses prose | `components/assistant/` |

Key safety property: **the AI interprets; software calculates and acts.** The model can never set a price, invent a URL, or execute an unlisted action — every numeric answer and every button comes from validated server code.

---

## File map

```
app/
  apex-roofing/page.tsx          Demo site + "How this demo works" sales panel
  api/chat/route.ts              SSE chat endpoint (session guards, IP + session rate limits)
  api/session/route.ts           Read-only session prefill for the enquiry form
  api/inquiry/route.ts           Demo enquiry submission (session-scoped)
  api/outputs/route.ts           Estimate PDF create + download (session-validated)
components/assistant/
  SmartAssistantLauncher.tsx     Floating launcher + chat panel + estimate card + action buttons
  EnquiryPanel.tsx               Pre-filled editable enquiry form
lib/assistant/
  orchestrator.ts                Tool-calling pipeline, OpenAI streaming client, timeouts
  prompts.ts                     System prompt builder (authority model, guardrails)
  session.ts                     Cookie-based isolated sessions, TTL, guards, rate limits
  rate-limit.ts                  Per-IP rate limiting
  data.ts                        Server-side loaders for the data layer
  inquiry.ts                     Enquiry payload builder/validation
  types.ts                       Structured turn contract (cards/actions)
lib/pricing/
  catalog.ts                     Catalogue loader + id/keyword lookup
  estimate-engine.ts             Deterministic estimate maths (slope factor, waste, rounding)
  rules.ts                       estimate-rules.json loader
lib/pdf/estimate-pdf.ts          Deterministic PDF renderer from the estimate object
data/apex-roofing/
  business.json                  Business profile + FAQs
  roofing-knowledge.md           Approved technical roofing knowledge
  pricing.json                   Pricing catalogue (only price source)
  estimate-rules.json            Pitch presets, ratios, waste, rounding, assumptions
  site-map.json                  Allowlisted navigation destinations
  assistant-config.json          Model, limits, rate limits, starter prompts, tone
tests/
  pricing.test.mjs               Deterministic estimate-engine tests (node --test)
  acceptance-checklist.md        Manual acceptance checklist (spec 19 / 26)
```

---

## Swapping Apex data for another business

Everything business-specific lives in `data/apex-roofing/`. To re-skill the assistant:

1. **Copy the data folder**: `data/apex-roofing/` → `data/<your-business>/`.
2. **Replace `business.json`** — name, description, contact details, service areas, hours, emergency process, insurance policy, guarantees, process, services, FAQs. Keep the same shape (see `lib/assistant/data.ts` for the interface).
3. **Replace `roofing-knowledge.md`** with your trade/domain knowledge (or keep it empty-ish for a pure business assistant). This file is authoritative for educational questions.
4. **Replace `pricing.json`** — your products/services with `id`, `name`, `category`, `unit` (`m2` | `lm` | `count` | `fixed`), `rate`, `minimumCharge`, `includes`/`excludes`. Bump `catalogVersion` whenever prices change; it is stamped on every estimate and PDF.
5. **Tune `estimate-rules.json`** — default pitch, perimeter heuristics per roof/job shape, waste factor, rounding rule, standard assumptions, disclaimer. (For non-roofing businesses this becomes your calculation-rules file; extend `lib/pricing/estimate-engine.ts` if your maths differs.)
6. **Update `site-map.json`** — id, title, path, keywords for every page/section the assistant may link to. **Only these paths can ever become navigation buttons.**
7. **Update `assistant-config.json`** — assistant name, model, message/turn/session limits, rate limits, starter prompts, tone.
8. **Point the loaders** at the new folder: change `DATA_DIR` in `lib/assistant/data.ts`, `catalog.ts`, and `rules.ts` (one path constant each), plus the `DATA_DIR` references to `estimate-rules.json`/`pricing.json`.
9. **Re-brand the demo page** (`app/apex-roofing/page.tsx` or a new route) and the chat panel colours (`BLUE` constant in `components/assistant/SmartAssistantLauncher.tsx`).
10. **Verify**: `npm run typecheck && npm run build`, then run `node --test tests/` and walk through `tests/acceptance-checklist.md`.

No pricing or business answers are hardcoded in components or prompts — if you find yourself editing a React component to change a price or an answer, something is wrong.

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | Yes (for chat) | Server-side OpenAI key used by the orchestrator. Never exposed to the client. Without it the site and enquiry flow still work; chat returns a friendly "not configured" message. |

Set it in `.env.local` for development and in your Vercel project settings for deployment.

---

## Local development

```bash
npm install
echo "OPENAI_API_KEY=sk-..." > .env.local
npm run dev          # http://localhost:3000/apex-roofing
```

Checks before shipping:

```bash
npm run typecheck    # tsc --noEmit
npm run build        # production build must pass
node --test tests/pricing.test.mjs   # deterministic estimate-engine tests
```

Do not run the dev server while recording the demo; use `npm run build && npm start` for realistic behaviour.

---

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel (or use the existing project).
2. Set `OPENAI_API_KEY` in Project → Settings → Environment Variables.
3. Deploy. Sessions are in-memory per server instance, which is fine for a demo; for heavier traffic swap the `sessions` Map in `lib/assistant/session.ts` for Redis/KV keyed the same way (interface stays identical).

---

## Sales narrative

Use the collapsible **"How this demo works"** panel on `/apex-roofing` plus [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) for scripted conversations. Key line:

> "Everything you're seeing here is driven by Apex's data files. For your business, we replace those with your services, products, prices, rules and workflows."

No system prompts, keys or internal configuration are exposed by the panel or the API.
