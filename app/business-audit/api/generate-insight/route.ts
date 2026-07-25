import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

const SYSTEM_PROMPT = `You are generating a business audit result.

Use only the answers provided by the user. Do not invent details.

The user may be a pre-launch business, early-stage business, or established business. Match the advice to their stage.

Your job is to identify the most likely business gap, bottleneck, leak, or missed opportunity.

Be specific and useful. Avoid generic advice such as "improve your marketing" unless you explain exactly what part appears weak.

If the user says one thing is the problem but their answers suggest something else, politely point that out.

Do not provide legal, tax, accounting, investment, employment, or regulated financial advice.

Do not guarantee results.

Do not ask for personal information.

Do not mention that you are an AI unless required by the page context.

Output should be plain English, direct, and practical.

British English. Hyphens only - no em dashes or en dashes.`

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    const questionLabels: Record<string, string> = {
      q1Stage: "Where are you in your business journey?",
      q2BusinessType: "What type of business do you run?",
      q3Customers: "Who are your customers?",
      q4WhatYouSell: "What do you sell?",
      q5Revenue: "Current monthly revenue?",
      q6Financial: "Current financial situation?",
      a1Validation: "Have you validated the idea yet?",
      a2CustomerClarity: "How clear are you on your ideal customer?",
      a3BiggestRisk: "Biggest risk before launch?",
      a4WantToKnow: "What would you most want to know before launch?",
      b1MonthlyLeads: "How many leads or enquiries per month?",
      b2Conversion: "How many leads become customers?",
      b3HardestThing: "What is the hardest thing right now?",
      b4AlreadyTried: "What have you already tried?",
      c1WhatChanged: "What has changed recently?",
      c2WithoutMarketing: "Without marketing, how long would customers keep coming in?",
      c3BiggestLeak: "Biggest leak in your business right now?",
      c4MostTime: "What takes up most of your time right now?",
      s1Constraint: "Biggest personal constraint right now?",
      s2MarketingSpend: "Monthly spend trying to get customers?",
      s3WantToKnow: "What would you most want to know from this audit?",
    }

    const answersText = Object.entries(answers)
      .filter(([, v]) => v !== '' && v !== null && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => {
        const label = questionLabels[k] ?? k
        const value = Array.isArray(v) ? v.join(', ') : v
        return `Q: ${label}\nA: ${value}`
      })
      .join('\n\n')

    const userPrompt = `A business owner has completed a diagnostic audit. Here are their answers:

${answersText}

Generate a JSON response with exactly these three fields:

"title": A punchy insight title (max 10 words). Should feel like a diagnosis, not a compliment.

"text": Two to three paragraphs of specific, honest analysis. Reference only what they explicitly told you in their answers - do not infer or assume causes that were not mentioned. If they said profit is weak but did not say why, say exactly that - do not guess the cause. Do not be generic. End the final paragraph with a sentence that creates natural curiosity about what else may need fixing.

"nextMove": One specific action they can take THIS WEEK. Not vague advice. A concrete step with enough detail that they could start it today. Max 3 sentences.

Rules:
- British English
- Hyphens only - no em dashes (--) or en dashes
- No AI-sounding phrases
- No markdown in the output fields - plain text only
- Return raw JSON only, no code fences

Example format:
{"title":"...","text":"...","nextMove":"..."}`

    const client = getClient()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const raw = content.text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const insight = JSON.parse(raw)

    if (!insight.title || !insight.text || !insight.nextMove) {
      throw new Error('Incomplete insight returned')
    }

    // Strip any em/en dashes that slipped through
    const clean = (s: string) => s.replace(/\u2014/g, ' - ').replace(/\u2013/g, ' - ')
    insight.title = clean(insight.title)
    insight.text = clean(insight.text)
    insight.nextMove = clean(insight.nextMove)

    const usage = message.usage
    const inputCost = (usage.input_tokens / 1_000_000) * 0.80
    const outputCost = (usage.output_tokens / 1_000_000) * 4.00
    const totalCost = inputCost + outputCost
    console.log(`[generate-insight] tokens: ${usage.input_tokens} in / ${usage.output_tokens} out | cost: $${totalCost.toFixed(6)}`)

    return NextResponse.json({
      insight,
      usage: {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cost_usd: parseFloat(totalCost.toFixed(6)),
      },
    })
  } catch (err) {
    console.error('Insight generation error:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
