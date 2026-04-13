'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PrimaryButton } from '@/components/ui/MagneticButton'
import { cn } from '@/components/ui/cn'
import { track } from '@/lib/analytics'

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(1, 'Company name is required'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  monthly_spend: z.string().min(1, 'Please select your monthly ad spend'),
  primary_goal: z.string().min(1, 'Please select your primary goal'),
  current_tools: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const SPEND_OPTIONS = [
  'Under $5K/month',
  '$5K–$15K/month',
  '$15K–$50K/month',
  '$50K–$150K/month',
  '$150K+/month',
]

const GOAL_OPTIONS = [
  'Scale revenue while maintaining ROAS',
  'Reduce CAC / improve efficiency',
  'Enter new paid channels',
  'Fix attribution / data quality',
  'Launch a new brand or product line',
  'Build a performance-first website',
]

interface FieldWrapperProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function FieldWrapper({ label, htmlFor, error, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-text-secondary">
        {label}
        {required && <span className="text-accent-red ml-0.5" aria-hidden="true">*</span>}
        {!required && <span className="ml-1 text-text-muted font-normal">(optional)</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-accent-red flex items-center gap-1" role="alert">
          <AlertCircle size={11} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = cn(
  'w-full bg-bg-surface border border-border rounded-sm px-3.5 py-2.5',
  'text-sm text-text-primary placeholder:text-text-muted',
  'focus:outline-none focus:border-accent-cyan/40 transition-colors duration-200',
  'aria-[invalid=true]:border-accent-red/40'
)

export function LeadCapture() {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setSubmitState('loading')
    track({ event: 'form_submit', form: 'lead_capture', success: true })

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'contact_form',
        }),
      })

      if (res.ok) {
        setSubmitState('success')
        reset()
        track({ event: 'form_submit', form: 'lead_capture', success: true })
      } else {
        setSubmitState('error')
        track({ event: 'form_submit', form: 'lead_capture', success: false })
      }
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 relative"
      aria-label="Contact and lead capture"
    >
      <div className="section-divider mb-24" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent-cyan/4 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — pitch copy */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-px w-6 bg-accent-cyan/60" />
                <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                  Start Here
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary mb-6">
                Let's look at
                <br />
                your stack.
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-10">
                Fill out the form and a senior strategist will review your details before we
                connect. No auto-replies, no sales playbooks — just an honest read on what
                would move your metrics.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="space-y-5">
              {[
                { label: 'Response within 1 business day', detail: 'No automated follow-up sequences.' },
                { label: 'No commitment required', detail: 'We\'ll tell you if we\'re not the right fit.' },
                { label: 'Senior strategist on first call', detail: 'Not a sales rep. Someone who can answer technical questions.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="shrink-0 h-5 w-5 rounded-full bg-accent-green/15 border border-accent-green/30 flex items-center justify-center mt-0.5">
                    <CheckCircle size={11} className="text-accent-green" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-muted">{item.detail}</p>
                  </div>
                </div>
              ))}
            </ScrollReveal>

            {/* Trust signal */}
            <ScrollReveal delay={0.2} className="mt-10 p-4 border border-border rounded-sm bg-bg-surface/50">
              <p className="text-xs text-text-muted italic">
                We're selective about engagements. If we don't think we can meaningfully move your
                metrics, we'll say so — and often point you toward what would help more.
              </p>
            </ScrollReveal>
          </div>

          {/* Right — form */}
          <ScrollReveal delay={0.15}>
            {submitState === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-md border border-accent-green/20 p-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-green/15 border border-accent-green/30 mx-auto mb-5">
                  <CheckCircle size={24} className="text-accent-green" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  We've got your details.
                </h3>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  A senior strategist will review your information and reach out within one
                  business day. Check your spam folder if you don't hear from us.
                </p>
                <button
                  onClick={() => setSubmitState('idle')}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Submit another enquiry
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="glass rounded-md border border-border p-6 sm:p-8 space-y-5"
                onFocus={() => {
                  if (!isDirty) track({ event: 'form_start', form: 'lead_capture' })
                }}
                aria-label="Contact form"
              >
                <h3 className="text-lg font-bold text-text-primary">
                  Audit my growth stack
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldWrapper label="Full name" htmlFor="name" error={errors.name?.message} required>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Alex Smith"
                      className={inputClass}
                      aria-invalid={!!errors.name}
                      {...register('name')}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Work email" htmlFor="email" error={errors.email?.message} required>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="alex@company.com"
                      className={inputClass}
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                  </FieldWrapper>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldWrapper label="Company" htmlFor="company" error={errors.company?.message} required>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Inc."
                      className={inputClass}
                      aria-invalid={!!errors.company}
                      {...register('company')}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Website" htmlFor="website" error={errors.website?.message}>
                    <input
                      id="website"
                      type="url"
                      autoComplete="url"
                      placeholder="https://acme.com"
                      className={inputClass}
                      aria-invalid={!!errors.website}
                      {...register('website')}
                    />
                  </FieldWrapper>
                </div>

                <FieldWrapper label="Monthly ad spend" htmlFor="monthly_spend" error={errors.monthly_spend?.message} required>
                  <select
                    id="monthly_spend"
                    className={cn(inputClass, 'cursor-pointer')}
                    aria-invalid={!!errors.monthly_spend}
                    defaultValue=""
                    {...register('monthly_spend')}
                  >
                    <option value="" disabled>Select range…</option>
                    {SPEND_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FieldWrapper>

                <FieldWrapper label="Primary goal" htmlFor="primary_goal" error={errors.primary_goal?.message} required>
                  <select
                    id="primary_goal"
                    className={cn(inputClass, 'cursor-pointer')}
                    aria-invalid={!!errors.primary_goal}
                    defaultValue=""
                    {...register('primary_goal')}
                  >
                    <option value="" disabled>Select goal…</option>
                    {GOAL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FieldWrapper>

                <FieldWrapper label="Current platforms / tools" htmlFor="current_tools">
                  <input
                    id="current_tools"
                    type="text"
                    placeholder="Meta, Google, Shopify, etc."
                    className={inputClass}
                    {...register('current_tools')}
                  />
                </FieldWrapper>

                <FieldWrapper label="Anything else we should know" htmlFor="message">
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Current challenges, context, or questions…"
                    className={cn(inputClass, 'resize-none')}
                    {...register('message')}
                  />
                </FieldWrapper>

                {submitState === 'error' && (
                  <p className="text-xs text-accent-red flex items-center gap-1.5" role="alert">
                    <AlertCircle size={12} aria-hidden="true" />
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <PrimaryButton
                  type="submit"
                  loading={submitState === 'loading'}
                  className="w-full justify-center text-sm py-3.5"
                >
                  Submit enquiry
                  <ArrowRight size={15} aria-hidden="true" />
                </PrimaryButton>

                {/* Privacy note */}
                <p className="text-2xs text-text-muted flex items-start gap-1.5">
                  <Shield size={10} className="shrink-0 mt-0.5" aria-hidden="true" />
                  Your information is stored securely and used only to respond to your enquiry. We do not sell
                  or share contact data. Unsubscribe at any time.
                </p>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
