'use client'

import { motion } from 'framer-motion'
import { Target, FlaskConical, BarChart3, Calendar, Shield, Zap } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerChild } from '@/components/ui/ScrollReveal'

const METHODOLOGY_PILLARS = [
  {
    icon: Target,
    title: 'Measurement First',
    phase: '01',
    description:
      'Every engagement starts with a measurement audit. We establish ground truth before running anything. Broken attribution means every optimization decision is made blind — and most accounts have broken attribution.',
    details: [
      'Pixel + CAPI event match quality audit',
      'Post-purchase survey setup for dark social visibility',
      'UTM architecture review and standardization',
      'MER baseline establishment',
      'Incrementality testing framework design',
    ],
  },
  {
    icon: Zap,
    title: 'Architecture Over Tactics',
    phase: '02',
    description:
      'Most agencies optimize within a broken structure. We redesign the structure. Campaign architecture, audience segmentation, and bid strategy must be right before optimization has leverage.',
    details: [
      'Full-funnel campaign architecture',
      'Consolidated vs. segmented account strategy',
      'Audience modeling and signal quality optimization',
      'Bid strategy selection based on margin economics',
      'Budget allocation framework (prospecting vs. retargeting)',
    ],
  },
  {
    icon: FlaskConical,
    title: 'Systematic Creative Testing',
    phase: '03',
    description:
      'Creative is the highest-leverage variable in paid advertising. We run a disciplined testing operation — not random variation, but hypothesis-driven experimentation with clear decision rules.',
    details: [
      'Weekly creative brief development',
      'Concept → production → launch → analysis cycle',
      'Statistical significance thresholds for scaling decisions',
      'Creative performance database and pattern library',
      'Hook rate, 3-second view rate, and scroll-stop analysis',
    ],
  },
  {
    icon: BarChart3,
    title: 'Attribution Maturity',
    phase: '04',
    description:
      'We operate at Attribution Level 3 across all accounts: pixel, server-side events, post-purchase surveys, and periodic geo-based incrementality tests. Level 4 (MMM) available for accounts at significant scale.',
    details: [
      'Level 1: Pixel + UTM (baseline)',
      'Level 2: CAPI / server-side + post-purchase survey',
      'Level 3: Geo incrementality testing',
      'Level 4: Media mix modeling (enterprise)',
      'Channel-level true ROAS vs. platform-reported comparison',
    ],
  },
  {
    icon: Calendar,
    title: 'Reporting Cadence',
    phase: '05',
    description:
      'Clients receive institutional-grade visibility. Weekly snapshots for operational decisions. Monthly deep-dives for strategic alignment. No hiding behind vanity metrics — if something isn\'t working, we say so.',
    details: [
      'Weekly snapshot: spend, ROAS/MER, creative top performers',
      'Monthly attribution deep-dive with variance commentary',
      'Live Looker Studio dashboard (client-owned)',
      'Quarterly strategic review and roadmap update',
      'Shared Slack or Teams channel for async updates',
    ],
  },
  {
    icon: Shield,
    title: 'Client Data Security',
    phase: '06',
    description:
      'Client ad account access operates on least-privilege principles. Credentials are never shared via email. Performance data is processed in secure environments and never commingled across clients.',
    details: [
      'Least-privilege ad account access (analyst role, not admin)',
      'No credential sharing via email or messaging',
      'Client retains full account ownership at all times',
      'Performance data isolated per client engagement',
      'NDA available on request for all engagements',
    ],
  },
]

export function Methodology() {
  return (
    <section
      id="methodology"
      className="py-24 lg:py-32 relative"
      aria-label="Our methodology"
    >
      <div className="section-divider mb-24" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-accent-cyan/60" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
              How We Work
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary mb-4">
            Precision over
            <br />
            <span className="editorial-serif text-5xl sm:text-6xl text-text-secondary">
              "best practices."
            </span>
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Our methodology is built on one premise: most growth problems are measurement problems in
            disguise. Fix attribution first, then optimize. The order matters.
          </p>
        </ScrollReveal>

        {/* Pillars grid */}
        <StaggerContainer staggerDelay={0.08} threshold={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {METHODOLOGY_PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <StaggerChild key={pillar.title}>
                  <div className="h-full glass rounded-md border border-border p-6 group hover:border-border-accent transition-all duration-300">
                    {/* Phase number */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="inline-flex items-center justify-center h-9 w-9 rounded-sm bg-accent-cyan/8 border border-accent-cyan/20">
                        <Icon size={16} className="text-accent-cyan" aria-hidden="true" />
                      </div>
                      <span className="font-mono text-xs text-text-muted">{pillar.phase}</span>
                    </div>

                    <h3 className="text-base font-bold text-text-primary mb-2">{pillar.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {pillar.description}
                    </p>

                    {/* Detail list */}
                    <ul className="space-y-1.5" role="list">
                      {pillar.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-xs text-text-muted">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-accent-cyan/50 shrink-0" aria-hidden="true" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerChild>
              )
            })}
          </div>
        </StaggerContainer>

        {/* Quote / editorial pullout */}
        <ScrollReveal delay={0.2} className="mt-16">
          <div className="border-l-2 border-accent-cyan/40 pl-8 py-2">
            <blockquote className="editorial-serif text-2xl sm:text-3xl text-text-secondary leading-relaxed mb-4">
              "The difference between a 1.5× and a 4× ROAS account is almost never the platform,
              the budget, or the audience. It's measurement quality and creative velocity."
            </blockquote>
            <cite className="text-xs font-mono uppercase tracking-widest text-text-muted not-italic">
              — Everitt Marketing & Co. Research Desk
            </cite>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
