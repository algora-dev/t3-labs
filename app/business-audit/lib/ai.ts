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

function cleanDashes(s: string): string {
  return s.replace(/\u2014/g, ' - ').replace(/\u2013/g, ' - ')
}

function stripCodeFences(s: string): string {
  return s.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
}

/**
 * Generate the free preview insight (single insight shown before paywall).
 */
export async function generatePreviewInsight(
  answers: Record<string, unknown>
): Promise<{
  insight: { title: string; text: string; nextMove: string }
  usage: { input_tokens: number; output_tokens: number; cost_usd: number }
}> {
  const questionLabels: Record<string, string> = {
    q1Stage: 'Where are you in your business journey?',
    q2BusinessType: 'What type of business do you run?',
    q3Customers: 'Who are your customers?',
    q4WhatYouSell: 'What do you sell?',
    q5Revenue: 'Current monthly revenue?',
    q6Financial: 'Current financial situation?',
    a1Validation: 'Have you validated the idea yet?',
    a2CustomerClarity: 'How clear are you on your ideal customer?',
    a3BiggestRisk: 'Biggest risk before launch?',
    a4WantToKnow: 'What would you most want to know before launch?',
    b1MonthlyLeads: 'How many leads or enquiries per month?',
    b2Conversion: 'How many leads become customers?',
    b3HardestThing: 'What is the hardest thing right now?',
    b4AlreadyTried: 'What have you already tried?',
    c1WhatChanged: 'What has changed recently?',
    c2WithoutMarketing: 'Without marketing, how long would customers keep coming in?',
    c3BiggestLeak: 'Biggest leak in your business right now?',
    c4MostTime: 'What takes up most of your time right now?',
    s1Constraint: 'Biggest personal constraint right now?',
    s2MarketingSpend: 'Monthly spend trying to get customers?',
    s3WantToKnow: 'What would you most want to know from this audit?',
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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  const raw = stripCodeFences(data.choices[0].message.content)
  const insight = JSON.parse(raw)

  if (!insight.title || !insight.text || !insight.nextMove) {
    throw new Error('Incomplete insight returned')
  }

  insight.title = cleanDashes(insight.title)
  insight.text = cleanDashes(insight.text)
  insight.nextMove = cleanDashes(insight.nextMove)

  const usage = data.usage
  const inputCost = (usage.prompt_tokens / 1_000_000) * 0.15
  const outputCost = (usage.completion_tokens / 1_000_000) * 0.60
  const totalCost = inputCost + outputCost

  return {
    insight,
    usage: {
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens,
      cost_usd: parseFloat(totalCost.toFixed(6)),
    },
  }
}

/**
 * Generate the full paid insights (5 insights shown after payment).
 */
export async function generatePaidInsights(
  answers: Record<string, unknown>
): Promise<Array<{ title: string; text: string }>> {
  const answersText = Object.entries(answers)
    .filter(([, v]) => v !== '' && v !== null && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n')

  const userPrompt = `A business owner has completed a diagnostic audit. Here are their answers:

${answersText}

Generate a JSON array of exactly 5 tailored, actionable insights covering:
1. Their likely business bottleneck
2. Their biggest missed opportunity
3. What to fix first (simple action plan)
4. What may be wasting their time, money, or energy
5. A 30-day action plan (3-5 steps, written as a single insight with numbered steps in the text)

Each object must have:
- "title": a short, punchy insight title (max 12 words)
- "text": 2-3 paragraphs of specific, actionable insight referencing their actual answers

Rules:
- British English only
- Hyphens only - no em dashes or en dashes
- Be brutally specific - reference their actual answers
- Write in second person ("you", "your business")
- No fluff, no filler
- Tone: trusted advisor, not a report
- Return raw JSON only, no code fences

Return format:
{"insights":[{"title":"...","text":"..."},{"title":"...","text":"..."},{"title":"...","text":"..."},{"title":"...","text":"..."},{"title":"...","text":"..."}]}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  const raw = stripCodeFences(data.choices[0].message.content)
  const parsed = JSON.parse(raw)
  const insights = parsed.insights || parsed

  if (!Array.isArray(insights) || insights.length < 4) {
    throw new Error('Unexpected insights format')
  }

  return insights.map((ins: { title: string; text: string }) => ({
    title: cleanDashes(ins.title || ''),
    text: cleanDashes(ins.text || ''),
  }))
}
