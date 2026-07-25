import Anthropic from '@anthropic-ai/sdk'

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
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

export async function generatePaidInsights(answers: Record<string, unknown>): Promise<
  Array<{ title: string; text: string }>
> {
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
- Do not wrap in markdown code blocks - return raw JSON only

Example format:
[{"title":"...","text":"..."},{"title":"...","text":"..."},{"title":"...","text":"..."},{"title":"...","text":"..."},{"title":"...","text":"..."}]`

  const client = getClient()
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  // Strip any markdown code fences if present
  const raw = content.text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
  const insights = JSON.parse(raw)

  if (!Array.isArray(insights) || insights.length < 4) {
    throw new Error('Unexpected insights format')
  }

  // Clean em/en dashes
  const clean = (s: string) => s.replace(/\u2014/g, ' - ').replace(/\u2013/g, ' - ')
  return insights.map((ins: { title: string; text: string }) => ({
    title: clean(ins.title || ''),
    text: clean(ins.text || ''),
  }))
}
