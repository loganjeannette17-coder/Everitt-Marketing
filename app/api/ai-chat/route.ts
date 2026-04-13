import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  matchFAQ,
  isOffTopic,
  FALLBACK_RESPONSE,
  GREETING_RESPONSE,
} from '@/lib/ai/faq'

const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
})

const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'sup', 'yo', 'good morning', 'good afternoon', 'good evening']
const QUALIFY_KEYWORDS = ['qualify', 'questions', 'assessment', 'diagnostic', 'talk to someone', 'speak with', 'get started', 'next steps']

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ChatSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 422 })
  }

  const { message } = parsed.data
  const lower = message.toLowerCase().trim()

  // Greeting
  if (GREETING_KEYWORDS.some((kw) => lower === kw || lower.startsWith(kw + ' '))) {
    return NextResponse.json({
      message: GREETING_RESPONSE,
      suggestions: ['What services do you offer?', 'How is pricing structured?', 'Walk me through a 4-question diagnostic'],
    })
  }

  // Off-topic guardrail
  if (isOffTopic(message)) {
    return NextResponse.json({
      message: "I'm focused on questions about Everitt Marketing & Co. — services, process, pricing, and approach. What can I help you with on that front?",
      suggestions: ['What services do you offer?', 'How does pricing work?', 'What results can I expect?'],
    })
  }

  // Qualification trigger
  if (QUALIFY_KEYWORDS.some((kw) => lower.includes(kw))) {
    return NextResponse.json({
      message: "I'd be happy to walk through a quick 4-question diagnostic to understand your situation. Click below to start, or keep asking questions.",
      suggestions: ['Start the diagnostic', 'What services do you offer?', 'How is pricing structured?'],
      startQualification: true,
    })
  }

  // FAQ matching
  const faqMatch = matchFAQ(message)
  if (faqMatch) {
    return NextResponse.json({
      message: faqMatch.answer,
      suggestions: faqMatch.suggestions,
    })
  }

  // Optional: Claude API for more nuanced responses (v2 upgrade)
  // if (process.env.ANTHROPIC_API_KEY) {
  //   return await claudeResponse(message, history)
  // }

  // Fallback
  return NextResponse.json({
    message: FALLBACK_RESPONSE,
    suggestions: ['What services do you offer?', 'Walk me through your process', 'How does pricing work?'],
  })
}
