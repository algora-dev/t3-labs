import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/business-audit/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('audit_submissions')
    .select('paid, paid_insights, insights_generated_at')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error || !data) {
    return NextResponse.json({ ready: false, paid: false })
  }

  return NextResponse.json({
    ready: data.paid && !!data.paid_insights,
    paid: data.paid,
    insights: data.paid_insights,
    generated_at: data.insights_generated_at,
  })
}
