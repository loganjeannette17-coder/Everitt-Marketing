'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { cn } from '@/components/ui/cn'
import type { Testimonial } from '@/types'

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "Everitt didn't just run our ads — they built an operating system for our paid media. For the first time, I actually trust our attribution numbers, and I know exactly where every dollar is working.",
    author_name: 'Sarah K.',
    author_title: 'Head of Growth',
    company_label: 'Series B SaaS, $18M ARR',
    avatar_url: null,
    rating: 5,
    published: true,
    sort_order: 1,
    created_at: '',
  },
  {
    id: '2',
    quote: "We went from a 1.4× ROAS to 3.9× in under four months. More importantly, the team taught us *why* the levers work. We're a much smarter buyer of media than we were before.",
    author_name: 'Marcus T.',
    author_title: 'Founder & CEO',
    company_label: 'DTC Apparel Brand, $6M revenue',
    avatar_url: null,
    rating: 5,
    published: true,
    sort_order: 2,
    created_at: '',
  },
  {
    id: '3',
    quote: "The creative testing process alone was worth the engagement. We went from guessing which ad would win to having a systematic process with clear decision rules. Game-changing.",
    author_name: 'Jamie L.',
    author_title: 'VP Marketing',
    company_label: 'E-commerce, $30M GMV',
    avatar_url: null,
    rating: 5,
    published: true,
    sort_order: 3,
    created_at: '',
  },
  {
    id: '4',
    quote: "Most agencies talk about ROAS. Everitt talks about MER, contribution margin, and payback period. It's a different conversation — one that actually aligns with how our business works.",
    author_name: 'Priya M.',
    author_title: 'CFO',
    company_label: 'DTC Health Brand, $12M revenue',
    avatar_url: null,
    rating: 5,
    published: true,
    sort_order: 4,
    created_at: '',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn('text-xs', i < rating ? 'text-accent-gold' : 'text-text-muted')}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(SEED_TESTIMONIALS)
  const [activeIdx, setActiveIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials')
        if (res.ok) {
          const data = await res.json()
          if (data.testimonials?.length > 0) {
            setTestimonials(data.testimonials)
          }
        }
      } catch {}
    }
    fetchTestimonials()
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [testimonials.length])

  function goTo(idx: number) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActiveIdx(idx)
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length)
    }, 6000)
  }

  const active = testimonials[activeIdx]

  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden"
      aria-label="Client testimonials"
      aria-roledescription="carousel"
    >
      <div className="section-divider mb-24" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-gold/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-accent-gold/60" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-gold">
              Social Proof
            </span>
            <span className="h-px w-6 bg-accent-gold/60" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary">
            What clients say.
          </h2>
        </ScrollReveal>

        {/* Carousel */}
        <div
          className="relative"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="glass rounded-md border border-border-gold p-8 sm:p-12 text-center"
            >
              <Quote
                size={32}
                className="text-accent-gold/30 mx-auto mb-6"
                aria-hidden="true"
              />

              <blockquote className="text-xl sm:text-2xl text-text-primary leading-relaxed font-light mb-8 max-w-3xl mx-auto">
                "{active.quote}"
              </blockquote>

              <div className="flex flex-col items-center gap-2">
                {active.rating && <StarRating rating={active.rating} />}
                <div>
                  <p className="text-sm font-semibold text-text-primary">{active.author_name}</p>
                  <p className="text-xs text-text-secondary">
                    {active.author_title}
                    {active.company_label && (
                      <span className="text-text-muted"> · {active.company_label}</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => goTo((activeIdx - 1 + testimonials.length) % testimonials.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:text-text-primary hover:border-border-accent transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIdx}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === activeIdx
                      ? 'w-6 bg-accent-gold'
                      : 'w-1.5 bg-text-muted hover:bg-text-secondary'
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((activeIdx + 1) % testimonials.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:text-text-primary hover:border-border-accent transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
