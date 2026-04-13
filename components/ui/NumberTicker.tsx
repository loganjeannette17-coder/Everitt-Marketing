'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from './cn'

interface NumberTickerProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
  delay?: number
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function NumberTicker({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2000,
  className,
  delay = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayValue, setDisplayValue] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isInView) return

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutExpo(progress)
        setDisplayValue(easedProgress * value)

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      startTimeRef.current = null
    }
  }, [isInView, value, duration, delay])

  return (
    <span
      ref={ref}
      className={cn('number-ticker tabular-nums', className)}
      aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// Animated metric display with label
interface MetricTickerProps {
  value: string   // display value as string — we parse number part
  label: string
  trend?: -1 | 0 | 1
  className?: string
  delay?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function MetricTicker({ value, label, trend = 0, className, delay = 0, size = 'md' }: MetricTickerProps) {
  const sizeClasses = {
    sm: { value: 'text-xl font-bold', label: 'text-2xs' },
    md: { value: 'text-3xl font-bold', label: 'text-xs' },
    lg: { value: 'text-5xl font-bold', label: 'text-sm' },
    xl: { value: 'text-7xl font-black', label: 'text-base' },
  }

  const trendColor = trend === 1 ? 'text-accent-green' : trend === -1 ? 'text-accent-red' : 'text-text-secondary'

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className={cn(sizeClasses[size].value, 'font-mono tracking-tight', trendColor)}>
        {value}
      </span>
      <span className={cn(sizeClasses[size].label, 'text-text-secondary uppercase tracking-widest font-medium')}>
        {label}
      </span>
    </div>
  )
}
