'use client'

import { motion } from 'framer-motion'
import { cn } from './cn'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'cyan' | 'gold' | 'none'
  onClick?: () => void
  as?: 'div' | 'article' | 'section' | 'li'
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = 'none',
  onClick,
  as: Tag = 'div',
}: GlassCardProps) {
  const glowClasses = {
    cyan: 'hover:border-accent-cyan/20 hover:shadow-glow-cyan',
    gold: 'hover:border-accent-gold/30 hover:shadow-glow-gold',
    none: '',
  }

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn('h-full', className)}
        onClick={onClick}
      >
        <Tag
          className={cn(
            'glass h-full rounded-md transition-all duration-300',
            'border border-border',
            hover && 'cursor-pointer',
            glow !== 'none' && glowClasses[glow],
            className
          )}
        >
          {children}
        </Tag>
      </motion.div>
    )
  }

  return (
    <Tag
      className={cn(
        'glass rounded-md',
        'border border-border',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  )
}

// Terminal panel card — institutional density
interface TerminalCardProps {
  children: React.ReactNode
  className?: string
  label?: string
  status?: 'live' | 'static' | 'updating'
}

export function TerminalCard({ children, className, label, status = 'live' }: TerminalCardProps) {
  const statusColors = {
    live: 'bg-accent-green',
    static: 'bg-text-muted',
    updating: 'bg-accent-amber',
  }

  return (
    <div
      className={cn(
        'relative bg-bg-card border border-border rounded-sm overflow-hidden',
        'scan-lines',
        className
      )}
    >
      {/* Header bar */}
      {label && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-bg-surface/50">
          <span className="text-2xs font-mono text-text-muted uppercase tracking-widest">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse-slow', statusColors[status])} />
            <span className="text-2xs font-mono text-text-muted">{status.toUpperCase()}</span>
          </div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
