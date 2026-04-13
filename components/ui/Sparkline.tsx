'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { cn } from './cn'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fillColor?: string
  strokeWidth?: number
  className?: string
  animated?: boolean
}

export function Sparkline({
  data,
  width = 120,
  height = 40,
  color = '#00D4FF',
  strokeWidth = 1.5,
  className,
  animated = true,
}: Omit<SparklineProps, 'fillColor'>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isInView = useInView(canvasRef as React.RefObject<Element>, { once: true, amount: 0.5 })
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length < 2) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(dpr, dpr)

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const padding = { top: 4, bottom: 4, left: 2, right: 2 }
    const w = width - padding.left - padding.right
    const h = height - padding.top - padding.bottom

    function getPoint(i: number): [number, number] {
      const x = padding.left + (i / (data.length - 1)) * w
      const y = padding.top + h - ((data[i] - min) / range) * h
      return [x, y]
    }

    function draw(progress: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      const visibleCount = Math.ceil(progress * (data.length - 1)) + 1
      const points = Array.from({ length: Math.min(visibleCount, data.length) }, (_, i) => getPoint(i))

      if (points.length < 2) return

      // Fill gradient
      {
        ctx.beginPath()
        ctx.moveTo(points[0][0], height - padding.bottom)
        ctx.lineTo(points[0][0], points[0][1])

        for (let i = 1; i < points.length; i++) {
          const cpx = (points[i - 1][0] + points[i][0]) / 2
          const cpy = (points[i - 1][1] + points[i][1]) / 2
          ctx.quadraticCurveTo(points[i - 1][0], points[i - 1][1], cpx, cpy)
        }

        const last = points[points.length - 1]
        ctx.lineTo(last[0], last[1])
        ctx.lineTo(last[0], height - padding.bottom)
        ctx.closePath()

        const alphaGrad = ctx.createLinearGradient(0, 0, 0, height)
        alphaGrad.addColorStop(0, colorWithAlpha(color, 0.12))
        alphaGrad.addColorStop(1, colorWithAlpha(color, 0))
        ctx.fillStyle = alphaGrad
        ctx.fill()
      }

      // Line
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])

      for (let i = 1; i < points.length; i++) {
        const cpx = (points[i - 1][0] + points[i][0]) / 2
        const cpy = (points[i - 1][1] + points[i][1]) / 2
        ctx.quadraticCurveTo(points[i - 1][0], points[i - 1][1], cpx, cpy)
      }

      const last = points[points.length - 1]
      ctx.lineTo(last[0], last[1])

      ctx.strokeStyle = color
      ctx.lineWidth = strokeWidth
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.stroke()

      // Dot at last point
      if (progress >= 0.99) {
        ctx.beginPath()
        ctx.arc(last[0], last[1], 2.5, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Glow dot
        ctx.beginPath()
        ctx.arc(last[0], last[1], 5, 0, Math.PI * 2)
        ctx.fillStyle = colorWithAlpha(color, 0.2)
        ctx.fill()
      }
    }

    if (!animated || !isInView) {
      draw(1)
      return
    }

    // Animate draw
    const duration = 1200
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      draw(eased)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [data, width, height, color, strokeWidth, animated, isInView])

  return (
    <canvas
      ref={canvasRef}
      className={cn('block', className)}
      aria-hidden="true"
    />
  )
}

function colorWithAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return color
}
