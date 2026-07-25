import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/app/business-audit/lib/supabase'
import { generatePaidInsights } from '@/app/business-audit/lib/anthropic'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-06-24.dahlia',
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  const stripe = getStripe()

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const submissionId = session.metadata?.submission_id

    if (!submissionId) {
      console.error('No submission_id in metadata')
      return NextResponse.json({ error: 'Missing submission_id' }, { status: 400 })
    }

    try {
      // Fetch submission answers
      const { data: submission, error: fetchError } = await supabase
        .from('audit_submissions')
        .select('answers')
        .eq('id', submissionId)
        .single()

      if (fetchError || !submission) {
        console.error('Failed to fetch submission:', fetchError)
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
      }

      // Generate 4 AI insights
      const insights = await generatePaidInsights(submission.answers)

      // Update submission with paid status + insights
      const { error: updateError } = await supabase
        .from('audit_submissions')
        .update({
          paid: true,
          stripe_session_id: session.id,
          paid_insights: insights,
          insights_generated_at: new Date().toISOString(),
        })
        .eq('id', submissionId)

      if (updateError) {
        console.error('Failed to update submission:', updateError)
        return NextResponse.json({ error: 'Failed to save insights' }, { status: 500 })
      }

      console.log(`Insights generated and saved for submission ${submissionId}`)
    } catch (err) {
      console.error('Failed to generate insights:', err)
      // Still return 200 so Stripe doesn't retry - log the error
      return NextResponse.json({ received: true, warning: 'Insight generation failed' })
    }
  }

  return NextResponse.json({ received: true })
}
