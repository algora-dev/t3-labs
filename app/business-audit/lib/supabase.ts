import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey || 'placeholder', {
  auth: { persistSession: false },
})

export type AuditSubmission = {
  id: string
  created_at: string
  email: string
  answers: Record<string, unknown>
  stripe_session_id: string | null
  paid: boolean
  paid_insights: PaidInsight[] | null
  insights_generated_at: string | null
}

export type PaidInsight = {
  title: string
  text: string
}
