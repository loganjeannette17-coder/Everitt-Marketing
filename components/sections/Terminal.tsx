'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { TerminalCard } from '@/components/ui/GlassCard'
import { Sparkline } from '@/components/ui/Sparkline'
import { ScrollReveal, StaggerContainer, StaggerChild } from '@/components/ui/ScrollReveal'
import { cn } from '@/components/ui/cn'
import type { KPI } from '@/types'

// Static seed data — shown if DB is empty or fetch fails
const SEED_KPIS: KPI[] = [
  { id: '1', key: 'blended_roas', label: 'Blended ROAS', value: '4.2', unit: '×', trend: 1, sparkline: [1.8,2.0,2.2,2.4,2.8,3.1,3.4,3.7,4.0,4.2], updated_at: new Date().toISOString() },
  { id: '2', key: 'avg_cac_change', label: 'CAC Reduction', value: '−31', unit: '%', trend: 1, sparkline: [0,-4,-9,-12,-17,-20,-24,-27,-30,-31], updated_at: new Date().toISOString() },
  { id: '3', key: 'mer', label: 'MER', value: '3.8', unit: '×', trend: 1, sparkline: [2.1,2.3,2.5,2.8,3.0,3.2,3.5,3.6,3.7,3.8], updated_at: new Date().toISOString() },
  { id: '4', key: 'managed_spend', label: 'Monthly Spend Mgd', value: '$2.4', unit: 'M', trend: 1, sparkline: [0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.1,2.3,2.4], updated_at: new Date().toISOString() },
  { id: '5', key: 'creative_iter', label: 'Creative Iter./Mo', value: '47', unit: '', trend: 0, sparkline: [20,25,28,32,36,38,40,42,45,47], updated_at: new Date().toISOString() },
  { id: '6', key: 'channel_roas_meta', label: 'Meta ROAS', value: '4.6', unit: '×', trend: 1, sparkline: [2.1,2.4,2.8,3.2,3.6,3.9,4.1,4.3,4.5,4.6], updated_at: new Date().toISOString() },
  { id: '7', key: 'channel_roas_google', label: 'Google ROAS', value: '3.9', unit: '×', trend: 1, sparkline: [2.0,2.2,2.5,2.8,3.1,3.4,3.6,3.7,3.8,3.9], updated_at: new Date().toISOString() },
  { id: '8', key: 'channel_roas_tiktok', label: 'TikTok ROAS', value: '3.1', unit: '×', trend: 1, sparkline: [1.2,1.4,1.7,2.0,2.3,2.6,2.8,2.9,3.0,3.1], updated_at: new Date().toISOString() },
]

// Channel mix demo data
const CHANNEL_MIX = [
  { label: 'Meta', pct: 48, color: '#00D4FF' },
  { label: 'Google', pct: 32, color: '#00E5A0' },
  { label: 'TikTok', pct: 14, color: '#F59E0B' },
  { label: 'Other', pct: 6, color: '#3D5166' },
]

function TrendIcon({ trend }: { trend: -1 | 0 | 1 }) {
  if (trend === 1) return <TrendingUp size={12} className="text-accent-green" aria-label="Trending up" />
  if (trend === -1) return <TrendingDown size={12} className="text-accent-red" aria-label="Trending down" />
  return <Minus size={12} className="text-text-muted" aria-label="Flat" />
}

function KPIPanel({ kpi, delay = 0 }: { kpi: KPI; delay?: number }) {
  const trendColor = kpi.trend === 1 ? 'text-accent-green' : kpi.trend === -1 ? 'text-accent-red' : 'text-text-primary'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <TerminalCard label={kpi.label} status="live" className="p-3">
        <div className="flex items-end justify-between gap-2 p-3 pt-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className={cn('font-mono font-black text-3xl tracking-tight', trendColor)}>
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className={cn('font-mono text-sm font-semibold', trendColor)}>
                  {kpi.unit}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendIcon trend={kpi.trend} />
              <span className="text-2xs text-text-muted font-mono">30-day trend</span>
            </div>
          </div>
          {kpi.sparkline && (
            <Sparkline
              data={kpi.sparkline}
              width={80}
              height={36}
              color={kpi.trend === 1 ? '#00E5A0' : kpi.trend === -1 ? '#FF4444' : '#00D4FF'}
              strokeWidth={1.5}
              animated
            />
          )}
        </div>
      </TerminalCard>
    </motion.div>
  )
}

function ChannelMixPanel() {
  return (
    <TerminalCard label="Channel Mix — Spend Allocation" status="live" className="h-full">
      <div className="p-4 space-y-3">
        {CHANNEL_MIX.map((ch, i) => (
          <div key={ch.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary">{ch.label}</span>
              <span className="text-xs font-mono font-semibold" style={{ color: ch.color }}>
                {ch.pct}%
              </span>
            </div>
            <div className="h-1 bg-bg-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: ch.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${ch.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * i + 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </TerminalCard>
  )
}

function SpendPacingPanel() {
  const spendData = [0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.1,2.3,2.4]
  const targetData = [0.9,1.1,1.3,1.5,1.7,1.9,2.1,2.2,2.4,2.5]

  return (
    <TerminalCard label="Spend Pacing vs. Target" status="live" className="h-full">
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-cyan" />
            <span className="text-2xs font-mono text-text-secondary">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-text-muted opacity-50" />
            <span className="text-2xs font-mono text-text-secondary">Target</span>
          </div>
        </div>
        <div className="relative">
          <Sparkline
            data={spendData}
            width={280}
            height={60}
            color="#00D4FF"
            strokeWidth={2}
            animated
            className="w-full"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-2xs font-mono text-text-muted">Current: $2.4M</span>
          <span className="text-2xs font-mono text-accent-green">96% of target ↑</span>
        </div>
      </div>
    </TerminalCard>
  )
}

export function Terminal() {
  const [kpis, setKpis] = useState<KPI[]>(SEED_KPIS)
  const [isRefreshing, setIsRefreshing] = useState(false)
  // null until mount avoids SSR vs client `new Date()` / locale mismatch (hydration errors).
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    async function fetchKpis() {
      try {
        const res = await fetch('/api/kpis', { signal: ac.signal })
        if (res.ok) {
          const data = await res.json()
          if (data.kpis && data.kpis.length > 0) {
            setKpis(data.kpis)
            setLastUpdated(new Date())
          }
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        // Silently fall back to seed data
      }
    }
    setLastUpdated(new Date())
    fetchKpis()
    return () => ac.abort()
  }, [])

  async function handleRefresh() {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  return (
    <section
      id="terminal"
      className="py-24 lg:py-32 relative"
      aria-label="Performance metrics terminal"
      data-cursor="terminal"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-6 bg-accent-cyan/60" />
                <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                  Performance Dashboard
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary">
                Institutional visibility.
                <br />
                <span className="text-text-secondary font-normal">Every lever, live.</span>
              </h2>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
                aria-label="Refresh metrics"
              >
                <RefreshCw size={11} className={cn(isRefreshing && 'animate-spin')} />
                Refresh
              </button>
              <time
                dateTime={lastUpdated?.toISOString()}
                className="text-2xs font-mono text-text-muted tabular-nums"
              >
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : 'Updated —'}
              </time>
            </div>
          </div>
        </ScrollReveal>

        {/* Terminal grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {kpis.slice(0, 4).map((kpi, i) => (
            <KPIPanel key={kpi.key} kpi={kpi} delay={i * 0.08} />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
          {kpis.slice(4, 8).map((kpi, i) => (
            <KPIPanel key={kpi.key} kpi={kpi} delay={i * 0.08 + 0.32} />
          ))}
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <ChannelMixPanel />
          <SpendPacingPanel />
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-2xs text-text-muted italic text-center"
        >
          Illustrative / anonymized performance data for demonstration purposes. Individual client results vary based on account maturity, market conditions, and margin profile.
        </motion.p>
      </div>
    </section>
  )
}
