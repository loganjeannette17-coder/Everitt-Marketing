'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, ChevronRight, Bot, User, Shield } from 'lucide-react'
import { cn } from '@/components/ui/cn'
import { track } from '@/lib/analytics'
import type { ChatMessage } from '@/types'

const QUALIFICATION_STEPS = [
  {
    step: 1,
    field: 'monthly_spend',
    question: "What's your approximate monthly ad spend right now?",
    options: ['Under $5K/month', '$5K–$15K/month', '$15K–$50K/month', '$50K–$150K/month', '$150K+/month'],
  },
  {
    step: 2,
    field: 'primary_goal',
    question: 'What\'s your primary growth objective over the next 6 months?',
    options: ['Scale revenue while maintaining ROAS', 'Reduce CAC / improve efficiency', 'Enter new paid channels', 'Fix broken attribution / data quality', 'Launch a new brand or product line'],
  },
  {
    step: 3,
    field: 'main_challenge',
    question: "What's the biggest bottleneck in your growth right now?",
    options: ['Creative quality or velocity', 'Attribution / measurement gaps', 'Scaling spend without killing efficiency', 'Strategy and direction', 'In-house bandwidth / execution'],
  },
  {
    step: 4,
    field: 'timeline',
    question: 'When are you looking to make a change?',
    options: ['Immediately — things are urgent', 'Within 30 days', '1–3 months from now', 'Just exploring options'],
  },
]

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
}

export function AIWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'chat' | 'qualify' | 'contact'>('chat')
  const [qualifyStep, setQualifyStep] = useState(0)
  const [qualifyAnswers, setQualifyAnswers] = useState<Record<string, string>>({})
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', company: '' })
  const [contactStep, setContactStep] = useState<'form' | 'submitting' | 'done'>('form')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageCount = useRef(0)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      if (messages.length === 0) {
        addAssistantMessage(
          'Hi! I\'m the Everitt assistant — I can answer questions about our services, process, and approach.\n\nWhat\'s on your mind? Or say **qualify** to walk through a quick 4-question diagnostic.',
          ['What services do you offer?', 'How is pricing structured?', 'What ROAS can I expect?']
        )
      }
    }
  }, [open])

  function addAssistantMessage(content: string, suggestions?: string[]) {
    const msg: ChatMessage & { suggestions?: string[] } = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      ...(suggestions ? { suggestions } : {}),
    }
    setMessages((prev) => [...prev, msg as ChatMessage])
  }

  function addUserMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content, timestamp: new Date() },
    ])
    messageCount.current++
    if (messageCount.current === 3) {
      track({ event: 'ai_message', message_count: 3 })
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    addUserMessage(text)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-6) }),
      })

      if (res.ok) {
        const data = await res.json()
        addAssistantMessage(data.message, data.suggestions)

        // Check if AI wants to start qualification
        if (data.startQualification) {
          setTimeout(() => startQualification(), 500)
        }
      } else {
        addAssistantMessage("I'm having trouble connecting right now. For immediate assistance, please use the contact form below or email us directly.")
      }
    } catch {
      addAssistantMessage("Connection issue. Please try again or use the contact form below.")
    } finally {
      setLoading(false)
    }
  }

  function handleSuggestion(suggestion: string) {
    sendMessage(suggestion)
  }

  function startQualification() {
    setMode('qualify')
    setQualifyStep(0)
    setQualifyAnswers({})
    addAssistantMessage(
      `Great — let me ask you 4 quick questions so I can give you more relevant context.\n\n**${QUALIFICATION_STEPS[0].question}**`,
    )
  }

  function handleQualifyOption(option: string) {
    const step = QUALIFICATION_STEPS[qualifyStep]
    addUserMessage(option)
    const newAnswers = { ...qualifyAnswers, [step.field]: option }
    setQualifyAnswers(newAnswers)

    if (qualifyStep < QUALIFICATION_STEPS.length - 1) {
      const nextStep = qualifyStep + 1
      setQualifyStep(nextStep)
      setTimeout(() => {
        addAssistantMessage(`**${QUALIFICATION_STEPS[nextStep].question}**`)
      }, 300)
    } else {
      // Qualification done — ask for contact
      setMode('contact')
      setQualifyStep(0)
      setTimeout(() => {
        addAssistantMessage(
          "Thanks — that's helpful context. To send you a relevant overview and have a strategist reach out, I just need a few details.",
        )
      }, 300)
    }
  }

  async function handleContactSubmit() {
    if (!contactInfo.name || !contactInfo.email) return
    setContactStep('submitting')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactInfo.name,
          email: contactInfo.email,
          company: contactInfo.company,
          answers_json: qualifyAnswers,
          source: 'ai_widget',
          primary_goal: qualifyAnswers.primary_goal,
          monthly_spend: qualifyAnswers.monthly_spend,
        }),
      })

      if (res.ok) {
        setContactStep('done')
        setMode('chat')
        track({ event: 'form_submit', form: 'ai_lead', success: true })
        addAssistantMessage(
          `Thanks, ${contactInfo.name}! A strategist will reach out to ${contactInfo.email} within one business day.\n\nIn the meantime, feel free to keep asking questions — I'm here.`,
          ['What does your process look like?', 'What reporting do clients receive?', 'Can I see case studies?']
        )
      } else {
        setContactStep('form')
        addAssistantMessage("There was an issue saving your details. Please try the contact form on the page instead.")
      }
    } catch {
      setContactStep('form')
    }
  }

  const currentQualifyOptions = mode === 'qualify' && qualifyStep < QUALIFICATION_STEPS.length
    ? QUALIFICATION_STEPS[qualifyStep].options
    : []

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => {
          setOpen(!open)
          if (!open) track({ event: 'ai_open' })
        }}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'flex items-center gap-2.5 px-4 py-3 rounded-full',
          'border transition-all duration-300',
          'font-medium text-sm shadow-elevated',
          open
            ? 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary'
            : 'bg-bg-elevated border-accent-cyan/30 text-text-primary shadow-glow-cyan hover:shadow-glow-cyan-strong'
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        aria-expanded={open}
        aria-controls="ai-widget-panel"
      >
        {open ? (
          <X size={16} aria-hidden="true" />
        ) : (
          <>
            <MessageSquare size={16} className="text-accent-cyan" aria-hidden="true" />
            <span>Ask anything</span>
            <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse-slow" aria-hidden="true" />
          </>
        )}
      </motion.button>

      {/* Widget panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="ai-widget-panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'fixed bottom-20 right-6 z-50',
              'w-[360px] sm:w-[400px] max-h-[560px]',
              'glass-elevated rounded-md border border-border',
              'flex flex-col overflow-hidden',
              'shadow-elevated'
            )}
            role="region"
            aria-label="Everitt AI assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-surface/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent-cyan/10 border border-accent-cyan/25">
                  <Bot size={13} className="text-accent-cyan" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">Everitt Assistant</p>
                  <p className="text-2xs text-text-muted flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" aria-hidden="true" />
                    Online · FAQ-powered
                  </p>
                </div>
              </div>
              {mode === 'chat' && messages.length > 1 && contactStep !== 'done' && (
                <button
                  onClick={startQualification}
                  className="text-2xs text-text-muted hover:text-accent-cyan transition-colors border border-border hover:border-accent-cyan/30 px-2 py-1 rounded-xs"
                >
                  Get qualified
                </button>
              )}
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
              role="log"
              aria-live="polite"
              aria-label="Conversation"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className="shrink-0 h-6 w-6 rounded-sm bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mt-0.5">
                      <Bot size={11} className="text-accent-cyan" aria-hidden="true" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[82%] rounded-md px-3 py-2.5 text-sm leading-relaxed ai-message',
                      msg.role === 'user'
                        ? 'bg-accent-cyan/10 border border-accent-cyan/20 text-text-primary'
                        : 'bg-bg-elevated border border-border text-text-secondary'
                    )}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: `<p>${formatMessage(msg.content)}</p>` }}
                    />
                    {/* Suggestions for assistant messages */}
                    {msg.role === 'assistant' && (msg as ChatMessage & { suggestions?: string[] }).suggestions && (
                      <div className="mt-2.5 flex flex-col gap-1.5">
                        {((msg as ChatMessage & { suggestions?: string[] }).suggestions || []).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSuggestion(s)}
                            className="flex items-center gap-1.5 text-left text-xs text-accent-cyan/80 hover:text-accent-cyan transition-colors py-1 border-t border-border/50 first:border-t-0"
                          >
                            <ChevronRight size={10} aria-hidden="true" />
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="shrink-0 h-6 w-6 rounded-sm bg-bg-elevated border border-border flex items-center justify-center mt-0.5">
                      <User size={11} className="text-text-muted" aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="shrink-0 h-6 w-6 rounded-sm bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                    <Bot size={11} className="text-accent-cyan" aria-hidden="true" />
                  </div>
                  <div className="bg-bg-elevated border border-border rounded-md px-3 py-2.5">
                    <div className="flex gap-1 items-center h-4" aria-label="Loading response">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-text-muted"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Qualification options */}
              {mode === 'qualify' && currentQualifyOptions.length > 0 && !loading && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {currentQualifyOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleQualifyOption(opt)}
                      className="text-left text-xs text-text-secondary border border-border hover:border-accent-cyan/30 hover:text-text-primary rounded-sm px-3 py-2 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Contact form (stay mounted while submitting so label/state stay valid) */}
              {mode === 'contact' &&
                (contactStep === 'form' || contactStep === 'submitting') &&
                !loading && (
                <div className="bg-bg-elevated border border-border rounded-md p-3 space-y-2">
                  {[
                    { field: 'name', label: 'Your name', type: 'text', placeholder: 'Alex Smith' },
                    { field: 'email', label: 'Email address', type: 'email', placeholder: 'alex@company.com' },
                    { field: 'company', label: 'Company (optional)', type: 'text', placeholder: 'Acme Inc.' },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="text-2xs text-text-muted mb-1 block font-mono" htmlFor={`ai-${field}`}>
                        {label}
                      </label>
                      <input
                        id={`ai-${field}`}
                        type={type}
                        placeholder={placeholder}
                        value={contactInfo[field as keyof typeof contactInfo]}
                        onChange={(e) => setContactInfo((prev) => ({ ...prev, [field]: e.target.value }))}
                        disabled={contactStep === 'submitting'}
                        className="w-full bg-bg-surface border border-border rounded-xs px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/40 transition-colors disabled:opacity-50"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleContactSubmit}
                    disabled={
                      !contactInfo.name || !contactInfo.email || contactStep === 'submitting'
                    }
                    className="w-full bg-accent-cyan text-text-inverse text-xs font-semibold py-2 rounded-xs disabled:opacity-40 hover:opacity-90 transition-opacity mt-1"
                  >
                    {contactStep === 'submitting' ? 'Sending…' : 'Send →'}
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            {mode === 'chat' && (
              <div className="shrink-0 border-t border-border bg-bg-surface/50 p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage(input)
                  }}
                  className="flex gap-2"
                >
                  <label htmlFor="ai-input" className="sr-only">Message</label>
                  <input
                    id="ai-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about services, process, pricing…"
                    disabled={loading}
                    onFocus={() => track({ event: 'form_start', form: 'ai_chat' })}
                    className="flex-1 bg-bg-elevated border border-border rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/40 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-accent-cyan disabled:opacity-40 hover:opacity-90 transition-opacity"
                    aria-label="Send message"
                  >
                    <Send size={13} className="text-text-inverse" aria-hidden="true" />
                  </button>
                </form>
              </div>
            )}

            {/* Privacy footer */}
            <div className="shrink-0 px-4 py-2 border-t border-border bg-bg/50">
              <p className="text-2xs text-text-muted flex items-start gap-1.5">
                <Shield size={10} className="shrink-0 mt-0.5" aria-hidden="true" />
                This assistant uses structured FAQ responses. Your messages are sent to our server to generate answers and are not stored long-term. This is not financial advice. Lead contact data is stored securely in Supabase.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
