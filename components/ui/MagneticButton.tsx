'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from './cn'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  'aria-label'?: string
  /** Passed to `data-cursor` for CustomCursor hover modes (e.g. `cta`). */
  dataCursor?: string
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
  dataCursor,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current || disabled) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = (e.clientX - centerX) * strength
      const distY = (e.clientY - centerY) * strength
      x.set(distX)
      y.set(distY)
    },
    [strength, x, y, disabled]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }, [x, y])

  const scale = useTransform([x, y], (latest: number[]) => {
    const lx = latest[0] ?? 0
    const ly = latest[1] ?? 0
    const distance = Math.sqrt(lx * lx + ly * ly)
    return isHovered ? 1 + Math.min(distance * 0.002, 0.06) : 1
  })

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...(dataCursor ? { 'data-cursor': dataCursor } : {})}
      className={cn(className)}
      style={{ x, y, scale }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}

// Primary CTA button with glow
interface PrimaryButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  'aria-label'?: string
}

export function PrimaryButton({
  children,
  className,
  onClick,
  type = 'button',
  disabled,
  loading,
  'aria-label': ariaLabel,
}: PrimaryButtonProps) {
  return (
    <MagneticButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      dataCursor="cta"
      className={cn(
        'group relative inline-flex items-center gap-2 px-7 py-3.5',
        'bg-accent-cyan text-text-inverse font-semibold text-sm tracking-wide',
        'rounded-sm overflow-hidden',
        'transition-all duration-300',
        'shadow-glow-cyan hover:shadow-glow-cyan-strong',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-3',
        className
      )}
    >
      {/* Shimmer */}
      <span
        className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-text-inverse/30 border-t-text-inverse animate-spin" />
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </MagneticButton>
  )
}

// Ghost / outline button
export function GhostButton({
  children,
  className,
  onClick,
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
}: PrimaryButtonProps) {
  return (
    <MagneticButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'group relative inline-flex items-center gap-2 px-7 py-3.5',
        'border border-border text-text-primary font-medium text-sm tracking-wide',
        'rounded-sm overflow-hidden',
        'hover:border-accent-cyan/40 hover:text-accent-cyan',
        'transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-3',
        className
      )}
    >
      {children}
    </MagneticButton>
  )
}
