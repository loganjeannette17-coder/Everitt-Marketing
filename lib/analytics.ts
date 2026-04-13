// ============================================================================
// Analytics — PostHog / Plausible event bridge
// Env-driven: safe to omit both keys; events fail silently
// ============================================================================

import type { AnalyticsEvent } from '@/types'

// Declare PostHog global from their CDN snippet (optional)
declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void
    }
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export function track(analyticsEvent: AnalyticsEvent): void {
  if (typeof window === 'undefined') return

  const { event, ...properties } = analyticsEvent

  // PostHog
  if (window.posthog) {
    window.posthog.capture(event, properties)
  }

  // Plausible
  if (window.plausible) {
    const props: Record<string, string> = {}
    Object.entries(properties).forEach(([k, v]) => {
      props[k] = String(v)
    })
    window.plausible(event, { props })
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[analytics]', event, properties)
  }
}

// Scroll depth tracking utility
export function initScrollDepthTracking(): () => void {
  if (typeof window === 'undefined') return () => {}

  const depths = new Set<number>()
  const milestones = [25, 50, 75, 100] as const

  function onScroll() {
    const scrolled =
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

    for (const depth of milestones) {
      if (scrolled >= depth && !depths.has(depth)) {
        depths.add(depth)
        track({ event: 'scroll_depth', depth })
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}
