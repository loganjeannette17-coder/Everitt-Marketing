'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, TrendingUp, ChevronRight } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerChild } from '@/components/ui/ScrollReveal'
import { cn } from '@/components/ui/cn'
import { track } from '@/lib/analytics'
import type { CaseStudy } from '@/types'

// Static seed fallback
const SEED_CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    slug: 'dtc-apparel-roas',
    title: 'Scaling a DTC Apparel Brand from Breakeven to 4× ROAS',
    industry: 'DTC Apparel',
    size_band: '$3M–$8M revenue',
    challenge: 'A fast-growing apparel brand was running Meta Ads at a 1.3× blended ROAS — barely covering CAC with no attribution clarity. Every scaling attempt crushed efficiency.',
    approach: 'Three-layer attribution stack (pixel + server-side API + post-purchase survey). Channel restructured around prospecting → retargeting → retention. Creative moved to 6 new concepts/week with 72-hour scaling decisions.',
    execution: 'Migrated to consolidated campaign architecture. Launched creative ops workflow cutting cycle time from 3 weeks to 5 days. Meta Advantage+ Catalog with broad-audience prospecting.',
    results_json: {
      headline: '4.1× blended ROAS, 62% revenue growth in 90 days',
      metrics: [
        { label: 'Blended ROAS', before: '1.3×', after: '4.1×', delta: '+215%' },
        { label: 'Monthly Revenue', before: '$280K', after: '$453K', delta: '+62%' },
        { label: 'CAC', before: '$74', after: '$41', delta: '-45%' },
        { label: 'Creative Testing', before: '4/mo', after: '24/mo', delta: '+500%' },
      ],
      period: '90 days',
    },
    hero_stat: '4.1×',
    hero_label: 'blended ROAS',
    tags: ['Meta Ads', 'Attribution', 'Creative Ops', 'DTC'],
    published: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    slug: 'b2b-saas-cac',
    title: 'Cutting B2B SaaS CAC by 38% with Demand-Gen Restructure',
    industry: 'B2B SaaS',
    size_band: '$8M–$25M ARR',
    challenge: 'A Series B SaaS was generating leads through Google and LinkedIn, but CAC had climbed 60% over 18 months. Marketing and sales misaligned on lead quality — volume was there, intent was not.',
    approach: 'LinkedIn restructured around job-function segments with tailored copy per persona. Google rebuilt with bottom-of-funnel exact-match terms only. Lead scoring aligned to ICP firmographics.',
    execution: 'Implemented lead scoring in HubSpot for MQL+ only. Google Demand Gen tested against pure Search. Monthly attribution reviews built into cadence.',
    results_json: {
      headline: '38% CAC reduction, 2.1× pipeline from same budget',
      metrics: [
        { label: 'CAC', before: '$1,840', after: '$1,140', delta: '-38%' },
        { label: 'MQL-to-SQL Rate', before: '18%', after: '34%', delta: '+89%' },
        { label: 'Pipeline Generated', before: '$1.2M/mo', after: '$2.5M/mo', delta: '+108%' },
        { label: 'Google CPC', before: '$48', after: '$31', delta: '-35%' },
      ],
      period: '6 months',
    },
    hero_stat: '38%',
    hero_label: 'CAC reduction',
    tags: ['Google Ads', 'LinkedIn', 'B2B', 'Lead Gen'],
    published: true,
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    slug: 'ecomm-scaling',
    title: 'Taking a $400K/mo E-commerce Brand to $1.1M During Peak Season',
    industry: 'E-commerce (Home & Lifestyle)',
    size_band: '$15M–$40M revenue',
    challenge: 'An established home goods brand had never cracked $600K/month — creative fatigue and single-channel Google dependency. Peak season (Q4) was underutilized.',
    approach: '80+ static creatives and 30 video assets built 6 months before Q4. Channel mix diversified from 90% Google to a balanced Google/Meta/TikTok stack. Spend automated to scale only when 7-day ROAS held above target.',
    execution: 'Incrementality testing deployed for true channel lift. Automated rules for daily budget allocation. Real-time Looker Studio dashboard built for client.',
    results_json: {
      headline: '$1.1M revenue month during peak, 2.7× YoY',
      metrics: [
        { label: 'Peak Month Revenue', before: '$400K', after: '$1.1M', delta: '+175%' },
        { label: 'Blended ROAS', before: '2.8×', after: '4.4×', delta: '+57%' },
        { label: 'TikTok ROAS (new)', before: '0', after: '3.2×', delta: 'New' },
        { label: 'Q4 Managed Spend', before: '$140K', after: '$250K', delta: '+79%' },
      ],
      period: 'Peak season (Oct–Dec)',
    },
    hero_stat: '2.7×',
    hero_label: 'YoY peak revenue',
    tags: ['Meta Ads', 'Google Ads', 'TikTok', 'E-commerce'],
    published: true,
    sort_order: 3,
    created_at: '',
    updated_at: '',
  },
]

function MetricDelta({ before, after, delta }: { before: string; after: string; delta: string }) {
  const isPositive = delta.startsWith('+') || (!delta.startsWith('-') && delta !== '0')
  const isNew = delta === 'New'

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted font-mono">{before}</span>
        <ArrowRight size={10} className="text-text-muted" />
        <span className="text-xs text-text-primary font-mono font-semibold">{after}</span>
      </div>
      <span
        className={cn(
          'text-xs font-mono font-bold px-2 py-0.5 rounded-xs',
          isNew ? 'text-accent-amber bg-accent-amber-dim' :
          isPositive ? 'text-accent-green bg-accent-green-dim' : 'text-accent-red bg-accent-red-dim'
        )}
      >
        {delta}
      </span>
    </div>
  )
}

export function CaseStudies() {
  const [studies, setStudies] = useState<CaseStudy[]>(SEED_CASE_STUDIES)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudies() {
      try {
        const res = await fetch('/api/case-studies')
        if (res.ok) {
          const data = await res.json()
          if (data.case_studies?.length > 0) {
            setStudies(data.case_studies)
          }
        }
      } catch {}
    }
    fetchStudies()
  }, [])

  return (
    <section
      id="work"
      className="py-24 lg:py-32 relative"
      aria-label="Case studies"
    >
      <div className="section-divider mb-24" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-accent-cyan/60" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
              Proof of Work
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary mb-3">
                Outcomes, not optics.
              </h2>
              <p className="text-lg text-text-secondary max-w-xl">
                Anonymized case studies — industry and size band shown. Hard numbers, honest context.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Case study grid */}
        <StaggerContainer staggerDelay={0.12} threshold={0.05}>
          {studies.map((study) => (
            <StaggerChild key={study.id}>
              <article
                className={cn(
                  'mb-4 glass rounded-md border transition-all duration-300 overflow-hidden',
                  active === study.id ? 'border-accent-cyan/20' : 'border-border'
                )}
                aria-expanded={active === study.id}
              >
                {/* Summary row */}
                <button
                  className="w-full text-left p-6 lg:p-8 group focus-visible:outline-none"
                  onClick={() => {
                    const next = active === study.id ? null : study.id
                    setActive(next)
                    if (next) {
                      track({ event: 'case_study_view', slug: study.slug })
                    }
                  }}
                  aria-controls={`case-study-${study.id}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Headline stat */}
                    <div className="flex-shrink-0 w-24 text-center">
                      <div className="font-mono font-black text-4xl text-accent-green leading-none">
                        {study.hero_stat}
                      </div>
                      <div className="text-2xs font-mono uppercase tracking-wider text-text-muted mt-1">
                        {study.hero_label}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs font-mono text-accent-cyan bg-accent-cyan-dim px-2 py-0.5 rounded-xs">
                          {study.industry}
                        </span>
                        {study.size_band && (
                          <span className="text-xs font-mono text-text-muted border border-border px-2 py-0.5 rounded-xs">
                            {study.size_band}
                          </span>
                        )}
                        {study.results_json.period && (
                          <span className="text-xs font-mono text-text-muted border border-border px-2 py-0.5 rounded-xs">
                            {study.results_json.period}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-1 leading-snug">
                        {study.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>

                    {/* Tags + toggle */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <ChevronRight
                        size={16}
                        className={cn(
                          'text-text-muted transition-transform duration-300',
                          active === study.id && 'rotate-90'
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {active === study.id && (
                    <motion.div
                      id={`case-study-${study.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Challenge, Approach, Execution */}
                          <div className="lg:col-span-2 space-y-6">
                            {[
                              { label: 'The Challenge', content: study.challenge },
                              { label: 'Our Approach', content: study.approach },
                              study.execution ? { label: 'Execution', content: study.execution } : null,
                            ]
                              .filter(Boolean)
                              .map((item) => (
                                <div key={item!.label}>
                                  <h4 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
                                    {item!.label}
                                  </h4>
                                  <p className="text-sm text-text-secondary leading-relaxed">
                                    {item!.content}
                                  </p>
                                </div>
                              ))}
                          </div>

                          {/* Metrics */}
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                              Results
                            </h4>
                            <p className="text-sm font-semibold text-text-primary mb-4 leading-snug">
                              {study.results_json.headline}
                            </p>
                            <div className="bg-bg-surface rounded-sm p-3 border border-border">
                              {study.results_json.metrics?.map((m, i) => (
                                <div key={i}>
                                  <p className="text-2xs font-mono text-text-muted mb-1">{m.label}</p>
                                  <MetricDelta before={m.before} after={m.after} delta={m.delta} />
                                </div>
                              ))}
                            </div>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {study.tags?.map((tag) => (
                                <span key={tag} className="text-2xs font-mono text-text-muted border border-border px-1.5 py-0.5 rounded-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </StaggerChild>
          ))}
        </StaggerContainer>

        {/* Anonymization note */}
        <ScrollReveal delay={0.2} className="mt-6">
          <p className="text-xs text-text-muted italic text-center">
            All case studies show anonymized client data. Industry, size band, and outcomes are accurate — business names are withheld by mutual agreement.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
