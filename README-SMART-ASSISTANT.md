# Smart Assistant - T3 Labs (Apex Roofing Demo)

An interactive **Smart Assistant** demo for the fictional company **Apex Roofing**, built by T3 Labs. It is not "a chatbot with a company prompt" - it is a controlled **business knowledge, calculation, action and conversion engine** with a conversational interface.

Live page: `/demo/roofing-site`

Full build spec: [`docs/SMART_ASSISTANT_SPEC.md`](docs/SMART_ASSISTANT_SPEC.md)

---

## What it is

A visitor to `/demo/roofing-site` can:

- Ask business questions (services, hours, insurance work, guarantees) and get **grounded answers** from approved data.
- Ask roofing knowledge questions (hip vs gable, roof pitch, plan vs actual area) answered from an **approved knowledge base**.
- Ask for **exact catalogue prices** ("how much is concrete re-roofing per m2?").
- Request an **indicative estimate** (e.g. 200 m² re-roof) using a guided flow that collects project type, size, pitch, covering and component scope. Complex pricing can use up to **seven concise clarification turns** when genuinely needed, while simple questions stay at 0-2. A **deterministic server-side engine** calculates the itemised estimate. The customer must explicitly choose whether to price covering only, specified components, or geometry-based component allowances.
- Click real buttons to **add options** (gutters), **download an estimate PDF**, and **make a pre-filled enquiry** from facts already captured in conversation.
- Ask "where can I read about your guarantees?" and get a **validated navigation button** to the right page section.
- Ask an unsupported question and get a **clean, honest handoff** instead of a hallucinated answer.

Every visitor gets an isolated cookie-backed session. Local development uses memory; hosted deployments should configure the built-in Redis REST session adapter so messages, facts, estimates, enquiries and PDFs remain available across serverless instances.

---

## Architecture overview (6 layers)

| Layer | What it does | Where it lives |
|---|---|---|
| **1. Business Knowledge** | Approved facts: business profile, FAQs, services, guarantees | `data/apex-roofing/business.json`, `roofing-knowledge.md` |
| **2. Commercial Data** | Structured pricing catalogue (the only price source) | `data/apex-roofing/pricing.json` |
| **3. Rules / Calculation** | Deterministic estimate engine + rounding/waste/perimeter rules | `lib/pricing/`, `data/apex-roofing/estimate-rules.json` |
| **4. Conversation** | Orchestrated LLM pipeline: model classifies/extracts via tool calls, server executes | `lib/assistant/orchestrator.ts`, `prompts.ts` |
| **5. Action** | Allowlisted server actions: estimate, enquiry, PDF output, navigation | `app/api/outputs/`, `app/api/inquiry/`, site-map resolution |
| **6. Presentation** | Chat UI rendering only structured turn payloads (cards/actions) - never parses prose | `components/assistant/` |

Key safety property: **the AI interprets; software calculates and acts.** The model can never set a price, invent a URL, or execute an unlisted action - every numeric answer and every button comes from validated server code.

---

## File map

```
app/
  demo/roofing-site/             Canonical Apex demo website + 16 shared content pages
  apex-roofing/page.tsx          Legacy route redirect to the canonical demo
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
  session.ts                     Cookie-based isolated sessions, Redis REST persistence, TTL and guards
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
  website-pages.json             Shared content used by both website pages and assistant knowledge
  roofing-knowledge.md           Approved technical roofing knowledge
  pricing.json                   Pricing catalogue (only price source)
  estimate-rules.json            Pitch presets, ratios, waste, rounding, assumptions
  site-map.json                  Allowlisted navigation destinations
  assistant-config.json          Model, limits, rate limits, starter prompts, tone
tests/
  pricing.test.mjs               Deterministic estimate-engine + draft validation tests
  demo-data.test.mjs              Demo identity, navigation and pricing-data consistency tests
  acceptance-checklist.md        Manual acceptance checklist (spec 19 / 26)
```

---

## Swapping Apex data for another business

The assistant data layer is selected by `T3_ASSISTANT_BUSINESS_SLUG` and defaults to `apex-roofing`. To re-skill it:

1. Copy `data/apex-roofing/` to `data/<your-business>/`.
2. Replace `business.json`, `website-pages.json`, `roofing-knowledge.md`, `pricing.json`, `estimate-rules.json`, `site-map.json` and `assistant-config.json`.
3. Set `T3_ASSISTANT_BUSINESS_SLUG=<your-business>`.
4. Build a branded landing page for that business and mount `SmartAssistantLauncher`.
5. Verify pricing tests and the manual acceptance checklist.

The reusable assistant components now read customer-facing labels, accent colour, teaser copy and starter prompts from `assistant-config.json`. Business/pricing answers should not be hardcoded into React components.

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | Yes (for chat) | Server-side OpenAI key used by the orchestrator. Never exposed to the client. |
| `T3_ASSISTANT_BUSINESS_SLUG` | No | Data folder to load. Defaults to `apex-roofing`. |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Recommended for hosted demos | Shared Redis REST session store for serverless deployments. |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Alternative | Equivalent Upstash variable names supported by the same adapter. |

Set the OpenAI key locally. For Vercel/serverless, also connect a Redis-compatible KV store and add its REST URL/token. Without Redis the app falls back to in-memory sessions, which is suitable for local development but not reliable across serverless instances.

---

## Local development

```bash
npm install
printf "OPENAI_API_KEY=sk-...\nT3_ASSISTANT_BUSINESS_SLUG=apex-roofing\n" > .env.local
npm run dev          # http://localhost:3000/demo/roofing-site
```

Checks before shipping:

```bash
npm run typecheck    # tsc --noEmit
npm run build        # production build must pass
npm test             # deterministic estimate-engine tests
```

Do not run the dev server while recording the demo; use `npm run build && npm start` for realistic behaviour.

---

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel (or use the existing project).
2. Set `OPENAI_API_KEY` in Project → Settings → Environment Variables.
3. Connect Vercel KV / Upstash Redis and set the REST URL/token environment variables.
4. Deploy and verify that an estimate can still be downloaded and pre-filled into an enquiry after separate requests.

---

## Sales narrative

Use `/demo/roofing-site` plus [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) for scripted conversations. Key line:

> "Everything you're seeing here is driven by Apex's data files. For your business, we replace those with your services, products, prices, rules and workflows."

No system prompts, keys or internal configuration are exposed by the panel or the API.
