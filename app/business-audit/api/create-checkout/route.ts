import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/app/business-audit/lib/supabase'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-06-24.dahlia',
  })
}

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, company, website, marketingConsent, answers, currency: reqCurrency } = await req.json()
    const currency = reqCurrency === 'usd' ? 'usd' : 'gbp'
    const unitAmount = currency === 'usd' ? 1100 : 900

    if (!email || !answers) {
      return NextResponse.json({ error: 'Missing email or answers' }, { status: 400 })
    }

    // Save submission to Supabase
    const { data: submission, error: dbError } = await supabase
      .from('audit_submissions')
      .insert({
        email,
        answers,
        first_name: firstName || null,
        company: company || null,
        website: website || null,
        marketing_consent: marketingConsent || false,
      })
      .select('id')
      .single()

    if (dbError || !submission) {
      console.error('Supabase insert error:', dbError)
      // Try without extra fields if schema doesn't have them yet
      const { data: submission2, error: dbError2 } = await supabase
        .from('audit_submissions')
        .insert({ email, answers })
        .select('id')
        .single()

      if (dbError2 || !submission2) {
        console.error('Supabase fallback insert error:', dbError2)
        return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://t3labs.tech'
      const stripe = getStripe()
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Business Audit - Full Report',
                description: 'Your full business audit report including your likely bottleneck, missed opportunity, action plan, and a free 15-minute Audit Review Call.',
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: email,
        metadata: { submission_id: submission2.id },
        success_url: `${appUrl}/business-audit/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/business-audit/?cancelled=1`,
      })

      return NextResponse.json({ url: session.url })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://t3labs.tech'

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Business Audit - Full Report',
              description: 'Your full business audit report including your likely bottleneck, missed opportunity, action plan, and a free 15-minute Audit Review Call.',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      metadata: {
        submission_id: submission.id,
      },
      success_url: `${appUrl}/business-audit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/business-audit/?cancelled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
