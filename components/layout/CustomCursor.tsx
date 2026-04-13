'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useSpring, useMotionValue, animate } from 'framer-motion'

export type CursorMode =
  | 'default'
  | 'link'
  | 'button'
  | 'field'
  | 'media'
  | 'terminal'
  | 'cta'
  | 'glass'

const MODE_THEME: Record<
  CursorMode,
  {
    dot: string
    ring: string
    glow: string
    ringScale: number
    dotScale: number
    glowScale: number
    ringAspect: { x: number; y: number }
    borderRadius: string
    rotateSweep: boolean
    pulse: boolean
  }
> = {
  default: {
    dot: '#00D4FF',
    ring: 'rgba(0, 212, 255, 0.42)',
    glow: 'rgba(0, 212, 255, 0.14)',
    ringScale: 1,
    dotScale: 1,
    glowScale: 1,
    ringAspect: { x: 1, y: 1 },
    borderRadius: '50%',
    rotateSweep: true,
    pulse: false,
  },
  link: {
    dot: '#00E5A0',
    ring: 'rgba(0, 229, 160, 0.5)',
    glow: 'rgba(0, 229, 160, 0.12)',
    ringScale: 1.45,
    dotScale: 0.45,
    glowScale: 1.25,
    ringAspect: { x: 1, y: 1 },
    borderRadius: '50%',
    rotateSweep: true,
    pulse: false,
  },
  button: {
    dot: '#F59E0B',
    ring: 'rgba(245, 158, 11, 0.55)',
    glow: 'rgba(245, 158, 11, 0.16)',
    ringScale: 1.55,
    dotScale: 0.35,
    glowScale: 1.35,
    ringAspect: { x: 1, y: 1 },
    borderRadius: '50%',
    rotateSweep: true,
    pulse: true,
  },
  field: {
    dot: '#00D4FF',
    ring: 'rgba(0, 212, 255, 0.38)',
    glow: 'rgba(0, 212, 255, 0.08)',
    ringScale: 1.2,
    dotScale: 1,
    glowScale: 0.85,
    ringAspect: { x: 2.2, y: 0.42 },
    borderRadius: '6px',
    rotateSweep: false,
    pulse: false,
  },
  media: {
    dot: '#C9A84C',
    ring: 'rgba(201, 168, 76, 0.5)',
    glow: 'rgba(201, 168, 76, 0.14)',
    ringScale: 1.35,
    dotScale: 0.5,
    glowScale: 1.2,
    ringAspect: { x: 1, y: 1 },
    borderRadius: '10px',
    rotateSweep: false,
    pulse: false,
  },
  terminal: {
    dot: '#00E5A0',
    ring: 'rgba(0, 229, 160, 0.35)',
    glow: 'rgba(0, 212, 255, 0.1)',
    ringScale: 1.15,
    dotScale: 0.55,
    glowScale: 1.5,
    ringAspect: { x: 1, y: 1 },
    borderRadius: '4px',
    rotateSweep: true,
    pulse: true,
  },
  cta: {
    dot: '#00D4FF',
    ring: 'rgba(0, 229, 160, 0.45)',
    glow: 'rgba(0, 212, 255, 0.2)',
    ringScale: 1.65,
    dotScale: 0.3,
    glowScale: 1.55,
    ringAspect: { x: 1, y: 1 },
    borderRadius: '50%',
    rotateSweep: true,
    pulse: true,
  },
  glass: {
    dot: '#E8EDF2',
    ring: 'rgba(232, 237, 242, 0.35)',
    glow: 'rgba(255, 255, 255, 0.08)',
    ringScale: 1.3,
    dotScale: 0.6,
    glowScale: 1.15,
    ringAspect: { x: 1, y: 1 },
    borderRadius: '12px',
    rotateSweep: false,
    pulse: false,
  },
}

function parseDataCursor(value: string | null | undefined): CursorMode | null {
  if (
    value === 'terminal' ||
    value === 'cta' ||
    value === 'glass' ||
    value === 'link' ||
    value === 'button' ||
    value === 'field' ||
    value === 'media' ||
    value === 'default'
  ) {
    return value
  }
  return null
}

function resolveCursorMode(target: EventTarget | null): CursorMode {
  if (!target || !(target instanceof Element)) return 'default'

  /* Interactive targets win over section-level `data-cursor` (e.g. links inside #terminal). */
  if (target.closest('a[href]')) return 'link'

  const pressable = target.closest('button, [role="button"]')
  if (pressable) {
    if (
      pressable.matches('button:disabled') ||
      pressable.getAttribute('aria-disabled') === 'true'
    ) {
      return 'default'
    }
    const fromBtn = parseDataCursor(pressable.getAttribute('data-cursor'))
    if (fromBtn) return fromBtn
    return 'button'
  }

  const field = target.closest(
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, select'
  )
  if (field) {
    if (field.matches(':disabled') || field.hasAttribute('readonly')) return 'default'
    return 'field'
  }

  if (target.closest('input[type="checkbox"], input[type="radio"], label')) {
    const l = target.closest('label')
    if (l && !l.querySelector('a')) return 'field'
  }

  if (target.closest('img, video, picture')) return 'media'

  const fromAncestor = parseDataCursor(target.closest('[data-cursor]')?.getAttribute('data-cursor'))
  if (fromAncestor) return fromAncestor

  if (target.closest('.glass, .glass-elevated')) return 'glass'

  return 'default'
}

function shouldEnableCustomCursor(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  /* Phones / touch-only tablets — not hybrid laptops (those often report maxTouchPoints > 0 with a mouse). */
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return false
  return true
}

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')
  const [enabled, setEnabled] = useState(false)

  const mouseX = useRef(0)
  const mouseY = useRef(0)

  const dotX = useSpring(0, { stiffness: 620, damping: 32 })
  const dotY = useSpring(0, { stiffness: 620, damping: 32 })
  const ringX = useSpring(0, { stiffness: 110, damping: 20 })
  const ringY = useSpring(0, { stiffness: 110, damping: 20 })
  const glowX = useSpring(0, { stiffness: 55, damping: 18 })
  const glowY = useSpring(0, { stiffness: 55, damping: 18 })

  const sweepRotate = useMotionValue(0)
  const theme = useMemo(() => MODE_THEME[mode], [mode])

  useEffect(() => {
    if (!enabled || !theme.rotateSweep) return
    const controls = animate(sweepRotate, 360, {
      duration: 4.8,
      repeat: Infinity,
      ease: 'linear',
    })
    return () => controls.stop()
  }, [enabled, theme.rotateSweep, sweepRotate])

  useEffect(() => {
    const ok = shouldEnableCustomCursor()
    setEnabled(ok)
    if (ok) {
      document.body.classList.add('use-custom-cursor')
    }
    return () => {
      document.body.classList.remove('use-custom-cursor')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
      glowX.set(e.clientX)
      glowY.set(e.clientY)
      setIsVisible(true)
      setMode(resolveCursorMode(e.target))
    }

    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [enabled, dotX, dotY, ringX, ringY, glowX, glowY])

  if (!enabled) return null

  const baseRing = 36
  const baseGlow = 120

  return (
    <>
      {/* Soft bloom — slowest follow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100050]"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          width: baseGlow,
          height: baseGlow,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          filter: 'blur(14px)',
        }}
        animate={{
          opacity: isVisible ? 0.95 : 0,
          ...(theme.pulse
            ? {
                scale: [
                  theme.glowScale,
                  theme.glowScale * 1.08,
                  theme.glowScale,
                ],
              }
            : { scale: theme.glowScale }),
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: theme.pulse
            ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 200, damping: 22 },
        }}
        aria-hidden
      />

      {/* Ring + optional sweep */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100051]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        aria-hidden
      >
        <motion.div
          className="relative flex items-center justify-center"
          style={{
            width: baseRing,
            height: baseRing,
            scaleX: theme.ringAspect.x * theme.ringScale,
            scaleY: theme.ringAspect.y * theme.ringScale,
          }}
          animate={
            theme.pulse
              ? { scale: [1, 1.04, 1] }
              : { scale: 1 }
          }
          transition={
            theme.pulse
              ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 260, damping: 24 }
          }
        >
          {theme.rotateSweep && (
            <motion.div
              className="pointer-events-none absolute inset-[-2px] rounded-full opacity-70"
              style={{
                rotate: sweepRotate,
                background: `conic-gradient(from 0deg, transparent 0%, ${theme.ring} 35%, transparent 55%, transparent 100%)`,
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                WebkitMask:
                  'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
              }}
            />
          )}
          <motion.div
            className="absolute inset-0 border border-solid"
            style={{
              borderColor: theme.ring,
              borderRadius: theme.borderRadius,
              boxShadow: `0 0 20px ${theme.glow}`,
            }}
            initial={false}
            animate={{
              borderRadius: theme.borderRadius,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          />
        </motion.div>
      </motion.div>

      {/* Core dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100052] shadow-[0_0_12px_rgba(0,212,255,0.45)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: theme.dot,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: theme.dotScale,
          borderRadius:
            mode === 'field' ? 2 : mode === 'media' || mode === 'terminal' ? 4 : 9999,
          width: mode === 'field' ? 3 : 12,
          height: mode === 'field' ? 22 : 12,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        aria-hidden
      />
    </>
  )
}
