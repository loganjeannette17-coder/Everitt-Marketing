'use client'

import { useEffect } from 'react'
import { initScrollDepthTracking } from '@/lib/analytics'

export function AnalyticsProvider() {
  useEffect(() => {
    const cleanup = initScrollDepthTracking()
    return cleanup
  }, [])

  return null
}
