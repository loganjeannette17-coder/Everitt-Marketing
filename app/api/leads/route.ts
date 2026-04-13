import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateQualificationSummary } from '@/lib/ai/faq'

const LeadSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  company: z.string().min(1).max(200).optional().default(''),
  website: z.string().url().max(500).optional(),
  monthly_spend: z.string().max(100).optional(),
  primary_goal: z.string().max(200).optional(),
  current_tools: z.string().max(500).optional(),
  message: z.string().max(5000).optional(),
  answers_json: z.record(z.string()).optional().default({}),
  source: z.enum(['contact_form', 'ai_widget', 'newsletter', 'other']).default('contact_form'),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  // Rate limit check — basic, relies on Vercel/proxy layer for production hardening
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const {
    name, email, company, website,
    monthly_spend, primary_goal, current_tools, message,
    answers_json, source, utm_source, utm_medium, utm_campaign,
  } = parsed.data

  // Build answers_json — merge explicit field answers
  const mergedAnswers: Record<string, string> = {
    ...answers_json,
    ...(monthly_spend ? { monthly_spend } : {}),
    ...(primary_goal ? { primary_goal } : {}),
    ...(current_tools ? { current_tools } : {}),
    ...(message ? { message } : {}),
  }

  // Generate qualification summary
  const summaryText = generateQualificationSummary(mergedAnswers, { name, company: company ?? '' })

  try {
    const supabase = createServiceSupabaseClient()

    const { error } = await supabase.from('leads').insert({
      name,
      email,
      company: company ?? null,
      website: website ?? null,
      monthly_spend: monthly_spend ?? null,
      primary_goal: primary_goal ?? null,
      current_tools: current_tools ?? null,
      answers_json: mergedAnswers,
      summary_text: summaryText,
      source,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
    })

    if (error) {
      console.error('[leads] Supabase insert error:', error.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Optional: send notification email via Resend
    await sendLeadNotification({ name, email, company, summary_text: summaryText })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[leads] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendLeadNotification(lead: {
  name: string
  email: string
  company?: string
  summary_text: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // Safe failure — Resend not configured

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@everittmarketing.com'
  const toEmail = process.env.RESEND_TO_EMAIL ?? 'team@everittmarketing.com'

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New lead: ${lead.name} (${lead.company ?? 'no company'})`,
      text: [
        `New lead from the Everitt Marketing website:`,
        ``,
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Company: ${lead.company ?? 'N/A'}`,
        ``,
        lead.summary_text,
      ].join('\n'),
    })
  } catch (err) {
    // Non-fatal — log but don't fail the response
    console.warn('[leads] Email notification failed:', err)
  }
}
