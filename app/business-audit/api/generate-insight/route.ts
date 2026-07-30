import { NextRequest, NextResponse } from 'next/server'
import { generatePreviewInsight } from '@/app/business-audit/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    const { insight, usage } = await generatePreviewInsight(answers)

    console.log(
      `[generate-insight] tokens: ${usage.input_tokens} in / ${usage.output_tokens} out | cost: $${usage.cost_usd}`
    )

    return NextResponse.json({ insight, usage })
  } catch (err) {
    console.error('Insight generation error:', err)
    const errMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Generation failed', detail: errMsg }, { status: 500 })
  }
}
