import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

const SubscribeSchema = z.object({
  email: z.string().email().max(320),
  source: z.string().max(100).optional().default('website'),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 })
  }

  const { email, source } = parsed.data

  try {
    const supabase = createServiceSupabaseClient()

    // Upsert — safe to call multiple times for same email
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      { email, source, subscribed_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: true }
    )

    if (error && !error.message.includes('duplicate')) {
      console.error('[subscribe] Supabase error:', error.message)
      return NextResponse.json({ error: 'Could not save subscription' }, { status: 500 })
    }

    // TODO: Send double opt-in confirmation email via Resend
    // This is a placeholder — implement confirm_token flow when Resend is configured

    return NextResponse.json({ success: true, message: 'Check your inbox to confirm.' }, { status: 201 })
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
