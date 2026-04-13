'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/ui/MagneticButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { track } from '@/lib/analytics'

// Floating ticker strip at very top of hero
const TICKER_ITEMS = [
  { label: 'Blended ROAS', value: '4.2×', up: true },
  { label: 'CAC Reduction', value: '−31%', up: true },
  { label: 'Monthly MER', value: '3.8×', up: true },
  { label: 'Creative Tests/Mo', value: '47', up: false },
  { label: 'Managed Spend', value: '$2.4M', up: false },
  { label: 'Meta ROAS', value: '4.6×', up: true },
  { label: 'Google ROAS', value: '3.9×', up: true },
  { label: 'TikTok ROAS', value: '3.1×', up: true },
  { label: 'Attribution Accuracy', value: '+62%', up: true },
  { label: 'Avg. Engagement Rate', value: '8.4%', up: true },
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse parallax — desktop only
  const mouseX = useSpring(0, { stiffness: 60, damping: 20 })
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 })
  const [isMobile, setIsMobile] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bgX = useTransform(mouseX, [-300, 300], [-15, 15])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bgY = useTransform(mouseY, [-300, 300], [-8, 8])
  const glowX = useTransform(mouseX, [-300, 300], [-20, 20])
  const glowY = useTransform(mouseY, [-300, 300], [-15, 15])

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none), (pointer: coarse)').matches)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.width / 2)
      mouseY.set(e.clientY - rect.height / 2)
    }

    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY])

  function handleCtaClick() {
    track({ event: 'cta_click', cta: 'Book a Strategy Call', location: 'hero' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleCaseStudiesClick() {
    track({ event: 'cta_click', cta: 'See our work', location: 'hero' })
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={isMobile ? {} : { x: glowX, y: glowY }}
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-accent-cyan/3 rounded-full blur-[80px]" />
      </motion.div>

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />

      {/* Ticker strip */}
      <div className="border-b border-border overflow-hidden" aria-hidden="true">
        <div className="ticker-inner py-2">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 px-6 border-r border-border/50 shrink-0"
            >
              <span className="text-2xs font-mono uppercase tracking-widest text-text-muted">
                {item.label}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  item.up ? 'text-accent-green' : 'text-accent-cyan'
                }`}
              >
                {item.value}
              </span>
              {item.up && (
                <span className="text-accent-green text-2xs">↑</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main hero content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="max-w-4xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span className="h-px w-8 bg-accent-cyan/60" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                Premium Growth Partner
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-text-primary">Your growth stack,</span>
              <br />
              <span className="gradient-text-cyan">engineered for ROI.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-10"
            >
              We build and operate paid media programs with institutional precision — attribution
              architecture, creative velocity, and channel-level efficiency that compound over time.
              Not agency overhead. Actual leverage.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <PrimaryButton onClick={handleCtaClick} className="text-base px-8 py-4">
                Book a Strategy Call
                <ArrowRight size={16} aria-hidden="true" />
              </PrimaryButton>
              <GhostButton onClick={handleCaseStudiesClick} className="text-base px-8 py-4">
                See our work
              </GhostButton>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-14 flex flex-wrap gap-x-8 gap-y-3"
            >
              {[
                { stat: '$2.4M+', label: 'Monthly spend managed' },
                { stat: '4.2×', label: 'Avg. blended ROAS' },
                { stat: '−31%', label: 'Typical CAC reduction' },
                { stat: '47', label: 'Creative iterations/mo' },
              ].map((item) => (
                <div key={item.stat} className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-text-primary text-lg">{item.stat}</span>
                  <span className="text-xs text-text-muted">{item.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-3 text-2xs text-text-muted italic"
            >
              Illustrative / anonymized performance data. Results depend on account, market, and margin profile.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  )
}
