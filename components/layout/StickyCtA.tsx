'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { track } from '@/lib/analytics'

export function StickyCtA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 40% of the page
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (progress > 0.3 && !dismissed) {
        setVisible(true)
      } else if (progress < 0.15) {
        setVisible(false)
      }
    }

    // Also show after 45 seconds on page
    timerRef.current = setTimeout(() => {
      if (!dismissed) setVisible(true)
    }, 45000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [dismissed])

  function handleClick() {
    track({ event: 'cta_click', cta: 'Audit my growth stack', location: 'sticky' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleDismiss() {
    setDismissed(true)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2"
          role="complementary"
          aria-label="Sticky call to action"
        >
          <button
            onClick={handleClick}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-bg-elevated border border-accent-cyan/30 rounded-full text-sm font-semibold text-text-primary shadow-glow-cyan hover:shadow-glow-cyan-strong hover:border-accent-cyan/50 transition-all duration-300 group"
            aria-label="Audit my growth stack — get a free strategy call"
          >
            <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse-slow" aria-hidden="true" />
            Audit my growth stack
            <ArrowUpRight size={15} className="text-accent-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </button>
          <button
            onClick={handleDismiss}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated border border-border text-text-muted hover:text-text-primary hover:border-border transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
