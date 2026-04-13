'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerChild } from '@/components/ui/ScrollReveal'
import { cn } from '@/components/ui/cn'
import { track } from '@/lib/analytics'
import type { Insight } from '@/types'

const SEED_INSIGHTS: Insight[] = [
  {
    id: '1',
    title: 'The MER Shift: Why Smart Brands Are Moving Beyond ROAS',
    body: 'Marketing Efficiency Ratio (MER) — total revenue divided by total ad spend — is replacing ROAS as the north-star metric for scaling brands. Why? ROAS is channel-siloed and attribution-dependent. MER is agnostic, manipulation-resistant, and correlates more reliably with contribution margin at scale.',
    category: 'Paid Media',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Creative Velocity as Competitive Moat: The 5-Day Testing Cycle',
    body: 'The brands winning on Meta in 2024–2025 aren\'t necessarily spending more — they\'re iterating faster. A structured 5-day creative cycle (brief Monday, produce Tue–Wed, launch Thu, read Friday, scale or kill) compresses the learning loop and keeps the algorithm fed with signal.',
    category: 'Creative',
    published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Attribution Maturity: A Four-Level Framework',
    body: 'Most brands operate at Level 1 (last-click, pixel only) and wonder why their numbers don\'t match revenue. Level 2 adds server-side events and post-purchase surveys. Level 3 layers geo-based incrementality tests. Level 4 adds media mix modeling for full-funnel view.',
    category: 'Attribution',
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
    sort_order: 3,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    title: 'TikTok\'s Signal Quality Update: Hook Rates Now Drive Distribution',
    body: 'TikTok\'s latest algorithm update shifted optimization signals toward engagement-weighted conversions. Early data shows UGC-style creatives with strong hook rates (>35% 3-second view rate) outperforming polished brand content by 40–70% on CPA. Update your creative briefs accordingly.',
    category: 'Paid Media',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
    sort_order: 4,
    created_at: '',
    updated_at: '',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Paid Media': '#00D4FF',
  'Creative': '#C9A84C',
  'Attribution': '#00E5A0',
  'Analytics': '#F59E0B',
  'Strategy': '#A78BFA',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function Insights() {
  const [insights, setInsights] = useState<Insight[]>(SEED_INSIGHTS)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/insights')
        if (res.ok) {
          const data = await res.json()
          if (data.insights?.length > 0) {
            setInsights(data.insights)
          }
        }
      } catch {}
    }
    fetchInsights()
  }, [])

  return (
    <section
      id="insights"
      className="py-24 lg:py-32 relative"
      aria-label="Research desk and insights"
    >
      <div className="section-divider mb-24" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-6 bg-accent-cyan/60" />
                <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                  Research Desk
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary">
                Signal, not noise.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <BookOpen size={14} aria-hidden="true" />
              <span>Updated weekly</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Insight cards */}
        <StaggerContainer staggerDelay={0.1} threshold={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => {
            const categoryColor = insight.category ? CATEGORY_COLORS[insight.category] || '#6B8098' : '#6B8098'
            return (
              <StaggerChild key={insight.id}>
                <article
                  className="group h-full glass rounded-md border border-border p-6 hover:border-border-accent transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => {
                    if (insight.title) {
                      track({ event: 'insight_click', title: insight.title })
                    }
                  }}
                >
                  {/* Category + date */}
                  <div className="flex items-center justify-between mb-4">
                    {insight.category && (
                      <span
                        className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-xs"
                        style={{
                          color: categoryColor,
                          backgroundColor: `${categoryColor}15`,
                        }}
                      >
                        {insight.category}
                      </span>
                    )}
                    {insight.published_at && (
                      <span className="text-xs font-mono text-text-muted">
                        {formatDate(insight.published_at)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-text-primary mb-3 leading-snug group-hover:text-accent-cyan transition-colors duration-200">
                    {insight.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {insight.body}
                  </p>

                  <div className="flex items-center gap-1.5 mt-4 text-xs text-text-muted group-hover:text-accent-cyan transition-colors duration-200">
                    <span>Read more</span>
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </article>
              </StaggerChild>
            )
          })}
        </StaggerContainer>

        {/* Email capture for insights */}
        <ScrollReveal delay={0.2} className="mt-12">
          <div className="glass rounded-md border border-border p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  Get insights in your inbox
                </h3>
                <p className="text-sm text-text-secondary">
                  Weekly snapshot of what's moving in paid media, creative, and attribution. No filler.
                  Double opt-in confirmation.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
      track({ event: 'form_submit', form: 'newsletter', success: res.ok })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-accent-green font-semibold shrink-0">
        ✓ Check your inbox to confirm
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 shrink-0 w-full sm:w-auto"
      aria-label="Newsletter subscription"
      onFocus={() => track({ event: 'form_start', form: 'newsletter' })}
    >
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === 'loading'}
        className="flex-1 min-w-0 sm:w-52 px-4 py-2.5 bg-bg-surface border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/40 transition-colors disabled:opacity-50"
        aria-label="Email address for newsletter"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 px-4 py-2.5 bg-accent-cyan text-text-inverse text-sm font-semibold rounded-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {status === 'loading' ? '…' : 'Subscribe'}
      </button>
    </form>
  )
}
