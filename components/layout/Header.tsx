'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/components/ui/cn'
import { PrimaryButton } from '@/components/ui/MagneticButton'
import { track } from '@/lib/analytics'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#methodology', label: 'Methodology' },
  { href: '#insights', label: 'Insights' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleCTAClick() {
    track({ event: 'cta_click', cta: 'Book a Strategy Call', location: 'header' })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass border-b border-border'
          : 'bg-transparent'
      )}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan rounded-sm"
          aria-label="Everitt Marketing & Co. — Home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-xs bg-accent-cyan/10 border border-accent-cyan/30 group-hover:bg-accent-cyan/20 transition-colors duration-200">
            <span className="font-mono text-xs font-bold text-accent-cyan">E</span>
          </span>
          <span className="font-semibold text-sm tracking-tight text-text-primary">
            Everitt
            <span className="text-text-secondary font-normal"> Marketing & Co.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan rounded-sm"
              onClick={() => track({ event: 'cta_click', cta: link.label, location: 'nav' })}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <PrimaryButton
            onClick={handleCTAClick}
            aria-label="Book a strategy call"
            className="text-sm px-5 py-2.5"
          >
            Book a Strategy Call
          </PrimaryButton>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden glass border-b border-border px-6 pb-6 pt-2"
          >
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex items-center py-3 text-sm text-text-secondary hover:text-text-primary transition-colors border-b border-border last:border-0"
                      onClick={() => {
                        setMenuOpen(false)
                        track({ event: 'cta_click', cta: link.label, location: 'mobile-nav' })
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="pt-4">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      handleCTAClick()
                    }}
                    className="w-full bg-accent-cyan text-text-inverse font-semibold text-sm py-3 rounded-sm"
                  >
                    Book a Strategy Call
                  </button>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
