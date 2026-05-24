'use client'

import { useId } from 'react'

interface PriceChartProps {
  prices: number[]
  height?: number
  showGradient?: boolean
  className?: string
}

export function PriceChart({ prices, height = 80, showGradient = true, className = '' }: PriceChartProps) {
  const uid = useId().replace(/:/g, '')

  const valid = prices?.filter((p) => p != null && isFinite(p)) ?? []

  if (valid.length < 2) {
    return (
      <div
        style={{ height }}
        className={`animate-pulse rounded bg-slate-700/30 ${className}`}
      />
    )
  }

  const min = Math.min(...valid)
  const max = Math.max(...valid)
  const range = max - min || 1
  const W = 300
  const H = height
  const PAD = 2

  const pts = valid.map((p, i) => [
    PAD + (i / (valid.length - 1)) * (W - PAD * 2),
    H - PAD - ((p - min) / range) * (H - PAD * 2),
  ])

  let pathD = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cpx = (x0 + x1) / 2
    pathD += ` C ${cpx},${y0} ${cpx},${y1} ${x1},${y1}`
  }

  const isUp = valid[valid.length - 1] >= valid[0]
  const color = isUp ? '#34d399' : '#f87171'
  const gid = `grad-${uid}`
  const fillD = `${pathD} L ${pts[pts.length - 1][0]},${H + 4} L ${pts[0][0]},${H + 4} Z`

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
    >
      {showGradient && (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {showGradient && <path d={fillD} fill={`url(#${gid})`} />}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
