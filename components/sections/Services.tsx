'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  MousePointerClick,
  Globe,
  TrendingUp,
  FlaskConical,
  Layers,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal, StaggerContainer, StaggerChild } from '@/components/ui/ScrollReveal'

const SERVICES = [
  {
    icon: MousePointerClick,
    title: 'Paid Advertising',
    tagline: 'Meta · Google · TikTok · LinkedIn',
    description:
      'Full-funnel paid media strategy and hands-on execution. We structure campaigns for signal quality, not just volume — prospecting architectures, retargeting sequences, and retention programs built around your actual margin economics.',
    levers: ['Campaign architecture', 'Bid strategy', 'Audience modeling', 'Budget pacing'],
    accentColor: '#00D4FF',
  },
  {
    icon: TrendingUp,
    title: 'ROAS & ROI Optimization',
    tagline: 'Efficiency first. Scale second.',
    description:
      'We diagnose why your current setup is leaking efficiency — broken attribution, over-segmented campaigns, creative fatigue, or budget misallocation — and rebuild from first principles. Efficiency before scale, every time.',
    levers: ['Account audit', 'Attribution repair', 'MER benchmarking', 'Incrementality testing'],
    accentColor: '#00E5A0',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Attribution',
    description:
      'Modern measurement is broken. We rebuild it: server-side conversion APIs, post-purchase surveys, clean UTM architecture, and MER dashboards that give you reliable signal — not platform-inflated numbers.',
    tagline: 'Ground-truth measurement',
    levers: ['Server-side tracking', 'Post-purchase surveys', 'GA4 auditing', 'MER dashboards'],
    accentColor: '#F59E0B',
  },
  {
    icon: FlaskConical,
    title: 'Creative Operations',
    tagline: 'Systematic testing. Compounding results.',
    description:
      'Creative is the primary lever in paid advertising. We build a creative ops system: structured briefs, weekly iteration cycles, systematic A/B testing, and clear decision rules for what to scale and what to kill.',
    levers: ['Brief development', 'Production management', 'UGC sourcing', 'Win/loss analysis'],
    accentColor: '#C9A84C',
  },
  {
    icon: Globe,
    title: 'Website Development',
    tagline: 'Built for conversion, not awards',
    description:
      'Performance-first web builds on Next.js and Shopify. We optimize Core Web Vitals, landing page conversion rates, and post-click experience — because the best ad in the world can\'t save a broken landing page.',
    levers: ['Next.js / Shopify builds', 'CRO audits', 'Core Web Vitals', 'Landing pages'],
    accentColor: '#00D4FF',
  },
  {
    icon: Layers,
    title: 'Brand Scaling Strategy',
    tagline: 'From traction to category leader',
    description:
      'Channel mix modeling, creative positioning, and growth roadmapping for brands transitioning from early traction to real scale. We map the 90-day and 12-month levers — and build the operational infrastructure to execute.',
    levers: ['Channel mix modeling', 'Growth roadmapping', 'Competitive analysis', 'Positioning'],
    accentColor: '#00E5A0',
  },
]

export function Services() {
  return (
    <section
      id="services"
      className="py-24 lg:py-32 relative"
      aria-label="Services"
    >
      {/* Faint section divider */}
      <div className="section-divider mb-24" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-16 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-accent-cyan/60" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
              What We Build
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary mb-4">
            Five disciplines.
            <br />
            <span className="text-text-secondary font-light">One compounding system.</span>
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Each service is designed to work in isolation or as an integrated growth stack. Most
            clients start with paid media — and build out from there as attribution and creative
            systems mature.
          </p>
        </ScrollReveal>

        {/* Service cards grid */}
        <StaggerContainer staggerDelay={0.1} threshold={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <StaggerChild key={service.title}>
                <div className="group h-full glass rounded-md border border-border p-6 hover:border-border-accent transition-all duration-300 hover:-translate-y-0.5">
                  {/* Icon */}
                  <div
                    className="inline-flex items-center justify-center h-10 w-10 rounded-sm mb-5 border"
                    style={{
                      backgroundColor: `${service.accentColor}12`,
                      borderColor: `${service.accentColor}30`,
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: service.accentColor }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    {service.title}
                  </h3>
                  <p
                    className="text-xs font-mono uppercase tracking-wider mb-4"
                    style={{ color: service.accentColor }}
                  >
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Levers */}
                  <ul className="flex flex-wrap gap-2" role="list" aria-label={`${service.title} capabilities`}>
                    {service.levers.map((lever) => (
                      <li
                        key={lever}
                        className="text-2xs font-mono text-text-muted border border-border rounded-xs px-2 py-1"
                      >
                        {lever}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerChild>
            )
          })}
        </StaggerContainer>

        {/* Disclaimer */}
        <ScrollReveal delay={0.3} className="mt-12 p-5 border border-border rounded-sm bg-bg-surface/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-text-primary mb-1">
                A note on outcomes
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Performance improvement depends on your current attribution maturity, creative quality,
                account history, and market conditions. We don't promise guaranteed ROAS or CAC targets
                — we promise rigorous diagnosis, honest strategy, and accountable execution. The
                "typical levers" listed describe what we address, not guaranteed results.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
