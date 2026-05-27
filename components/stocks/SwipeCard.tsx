'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { PriceChart } from './PriceChart'
import { generateMockPrices, ALL_RANGES, type RangeKey } from '@/lib/stocks/history'
import type { StockData } from '@/lib/stocks/types'
import type { ActiveMetric } from './RatioModal'

export interface SwipeCardHandle {
  swipeRight: () => Promise<void>
  swipeLeft: () => Promise<void>
  defer: () => Promise<void>
}

interface Props {
  stock: StockData
  onWatch: () => void
  onSkip: () => void
  onDefer: () => void
  onMetricClick?: (m: ActiveMetric) => void
  isTop: boolean
  stackIndex: number
}

// ── helpers ────────────────────────────────────────────────────────────────

function fmtCap(n: number | null) {
  if (!n) return 'N/A'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  return `$${(n / 1e6).toFixed(0)}M`
}

function fmtVol(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  return `${(n / 1e3).toFixed(0)}K`
}

const RATING_LABELS: Record<string, string> = {
  strongBuy: 'Strong Buy', buy: 'Buy', hold: 'Hold',
  underperform: 'Underperform', sell: 'Sell', strongSell: 'Strong Sell',
}

function ratingColor(key: string) {
  if (key === 'strongBuy') return 'text-emerald-400'
  if (key === 'buy')       return 'text-green-400'
  if (key === 'hold')      return 'text-yellow-400'
  return 'text-red-400'
}

function betaInfo(b: number | null): { label: string; color: string } {
  if (!b) return { label: 'Unknown', color: 'text-slate-400' }
  if (b < 0.5)  return { label: 'Very Low',    color: 'text-blue-400'   }
  if (b < 0.85) return { label: 'Low',          color: 'text-cyan-400'   }
  if (b < 1.15) return { label: 'Market-like', color: 'text-slate-300'  }
  if (b < 1.5)  return { label: 'Elevated',    color: 'text-yellow-400' }
  if (b < 2.0)  return { label: 'High',         color: 'text-orange-400' }
  return { label: 'Very High', color: 'text-red-400' }
}

interface ResearchLink { short: string; url: string; title: string }

function researchLinks(symbol: string, quoteType: string): ResearchLink[] {
  const s = symbol.toLowerCase()
  const base: ResearchLink[] = [
    { short: 'Yahoo',     title: 'Yahoo Finance',  url: `https://finance.yahoo.com/quote/${symbol}` },
    { short: 'SA',        title: 'Seeking Alpha',  url: `https://seekingalpha.com/symbol/${symbol}` },
    { short: 'TipRanks',  title: 'TipRanks',       url: `https://www.tipranks.com/stocks/${s}` },
    { short: 'Analysis',  title: 'StockAnalysis',  url: quoteType === 'ETF' ? `https://stockanalysis.com/etf/${s}/` : `https://stockanalysis.com/stocks/${s}/` },
    { short: 'Finviz',    title: 'Finviz',          url: `https://finviz.com/quote.ashx?t=${symbol}` },
    { short: 'Zacks',     title: 'Zacks',           url: `https://www.zacks.com/stock/quote/${symbol}` },
    { short: 'Barchart',  title: 'Barchart',        url: `https://www.barchart.com/stocks/quotes/${symbol}` },
    { short: 'Macro',     title: 'Macrotrends',     url: `https://www.macrotrends.net/stocks/charts/${symbol}` },
  ]
  if (quoteType === 'ETF') {
    base.push({ short: 'ETF.com', title: 'ETF.com', url: `https://www.etf.com/${symbol}` })
    base.push({ short: 'ETFdb',   title: 'ETFdb',   url: `https://etfdb.com/etf/${symbol}/` })
  } else {
    base.push({ short: 'Mstar',   title: 'Morningstar', url: `https://www.morningstar.com/stocks/xnas/${s}/quote` })
    base.push({ short: 'Fool',    title: 'Motley Fool', url: `https://www.fool.com/quote/${s}/` })
  }
  return base
}

// ── component ──────────────────────────────────────────────────────────────

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(
  ({ stock, onWatch, onSkip, onDefer, onMetricClick, isTop, stackIndex }, ref) => {
    const tap = (key: string, value: number | null) =>
      onMetricClick?.({ key, value, symbol: stock.symbol })
    const x = useMotionValue(0)
    const y = useMotionValue(stackIndex * 14)
    const rotate = useTransform(x, [-300, 300], [-18, 18])
    const watchOpacity = useTransform(x, [20, 110], [0, 1])
    const skipOpacity  = useTransform(x, [-110, -20], [1, 0])

    // Keep y in sync with stack position (animates smoothly when cards are promoted)
    useEffect(() => {
      animate(y, stackIndex * 14, { type: 'spring', stiffness: 300, damping: 30 })
    }, [stackIndex, y])

    const [isFlipped, setIsFlipped] = useState(false)
    const [range, setRange] = useState<RangeKey>('1M')
    const [history, setHistory] = useState<Partial<Record<RangeKey, number[]>>>({})

    // Generate mock data for all ranges immediately on mount
    useEffect(() => {
      const mock: Partial<Record<RangeKey, number[]>> = {}
      ALL_RANGES.forEach((r) => {
        mock[r] = generateMockPrices(stock.symbol, stock.price, stock.beta, r)
      })
      setHistory(mock)
    }, [stock.symbol, stock.price, stock.beta])

    // Try to upgrade to live data when this card is on top
    useEffect(() => {
      if (!isTop) return
      ALL_RANGES.forEach((r) => {
        const betaParam = stock.beta ?? 1
        fetch(`/api/stocks/${stock.symbol}/history?range=${r}&price=${stock.price}&beta=${betaParam}`)
          .then((res) => res.json())
          .then(({ prices }) => {
            if (prices?.length > 2) {
              setHistory((prev) => ({ ...prev, [r]: prices }))
            }
          })
          .catch(() => {})
      })
    }, [isTop, stock.symbol, stock.price, stock.beta])

    useImperativeHandle(ref, () => ({
      swipeRight: async () => { await animate(x, 700, { duration: 0.35, ease: 'easeIn' }); onWatch() },
      swipeLeft:  async () => { await animate(x, -700, { duration: 0.35, ease: 'easeIn' }); onSkip() },
      defer:      async () => {
        await animate(y, -700, { duration: 0.38, ease: [0.4, 0, 0.6, 1] })
        onDefer()
        y.set(stackIndex * 14) // reset in case card stays mounted (small deck)
      },
    }))

    const handleDragEnd = async (_: unknown, { offset, velocity }: { offset: { x: number }; velocity: { x: number } }) => {
      if (isFlipped) { animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 }); return }
      const go = Math.abs(velocity.x) > 400 || Math.abs(offset.x) > 100
      if (offset.x > 0 && go) { await animate(x, 700, { duration: 0.35, ease: 'easeIn' }); onWatch() }
      else if (offset.x < 0 && go) { await animate(x, -700, { duration: 0.35, ease: 'easeIn' }); onSkip() }
      else animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
    }

    const currentPrices = history[range] ?? []
    const periodChange = currentPrices.length > 1
      ? ((currentPrices[currentPrices.length - 1] - currentPrices[0]) / currentPrices[0]) * 100
      : 0
    const periodUp = periodChange >= 0
    const dayUp    = stock.changePercent >= 0

    const scale  = 1 - stackIndex * 0.045

    const upside = stock.analyst?.targetMean && stock.price
      ? ((stock.analyst.targetMean - stock.price) / stock.price) * 100 : null

    const week52Pct = stock.week52High > stock.week52Low
      ? Math.max(0, Math.min(100, ((stock.price - stock.week52Low) / (stock.week52High - stock.week52Low)) * 100)) : 50

    const targetPct = stock.analyst?.targetLow != null && stock.analyst?.targetHigh != null
      ? Math.max(0, Math.min(100, ((stock.price - stock.analyst.targetLow) / (stock.analyst.targetHigh - stock.analyst.targetLow)) * 100)) : null

    const totalA = stock.analyst
      ? stock.analyst.strongBuy + stock.analyst.buy + stock.analyst.hold + stock.analyst.sell + stock.analyst.strongSell : 0

    const { label: bLabel, color: bColor } = betaInfo(stock.beta)

    return (
      <motion.div
        style={{ x, y, rotate, scale, zIndex: 100 - stackIndex, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        drag={isTop && !isFlipped ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        className="cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* WATCH stamp */}
        <motion.div style={{ opacity: watchOpacity }} className="pointer-events-none absolute top-10 left-6 z-20 rounded-xl border-4 border-emerald-400 px-4 py-2 text-2xl font-black tracking-widest text-emerald-400 -rotate-12">
          WATCH
        </motion.div>
        {/* SKIP stamp */}
        <motion.div style={{ opacity: skipOpacity }} className="pointer-events-none absolute top-10 right-6 z-20 rounded-xl border-4 border-red-400 px-4 py-2 text-2xl font-black tracking-widest text-red-400 rotate-12">
          SKIP
        </motion.div>

        {/* Perspective wrapper */}
        <div style={{ perspective: '1200px', width: '100%', height: '100%' }}>
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
          >

            {/* ── FRONT FACE ───────────────────────────────────────────── */}
            <div
              style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
              className="rounded-3xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl flex flex-col"
            >
              {/* top accent */}
              <div className={`h-1 shrink-0 ${dayUp ? 'bg-emerald-400' : 'bg-red-400'}`} />

              <div className="flex flex-col flex-1 overflow-y-auto p-5 pb-4 overscroll-contain">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-2xl font-black tracking-tight text-white">{stock.symbol}</span>
                      <span className="rounded bg-slate-700 px-1.5 py-0.5 text-xs font-semibold uppercase text-slate-400">
                        {stock.quoteType === 'ETF' ? 'ETF' : 'STOCK'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-tight">{stock.name}</p>
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${dayUp ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'}`}>
                    {dayUp ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-4xl font-bold text-white">
                    ${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className={`text-sm mb-3 ${dayUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dayUp ? '+' : ''}{stock.change.toFixed(2)} today
                </p>

                {/* Chart area */}
                <div className="relative rounded-2xl bg-slate-700/30 p-3 mb-3">
                  {/* Period change badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-medium">{range} performance</span>
                    <span className={`text-sm font-bold ${periodUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {periodUp ? '+' : ''}{periodChange.toFixed(2)}%
                    </span>
                  </div>

                  <PriceChart prices={currentPrices} height={110} />

                  {/* Range selector */}
                  <div
                    className="flex gap-1 mt-2 pt-2 border-t border-slate-700/50"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {ALL_RANGES.map((r) => (
                      <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`flex-1 rounded-lg py-1 text-xs font-semibold transition-colors ${
                          range === r
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="rounded-xl bg-slate-700/40 p-2.5">
                    <p className="text-slate-500 mb-0.5">Mkt Cap</p>
                    <p className="font-semibold text-white">{fmtCap(stock.marketCap)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-700/40 p-2.5">
                    <p className="text-slate-500 mb-0.5">Volume</p>
                    <p className="font-semibold text-white">{fmtVol(stock.volume)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-700/40 p-2.5">
                    <p className="text-slate-500 mb-0.5">Beta</p>
                    <p className={`font-semibold ${bColor}`}>{stock.beta?.toFixed(2) ?? '—'}</p>
                  </div>
                </div>

                {/* Flip button */}
                <div className="mt-auto" onPointerDown={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full rounded-xl bg-slate-700/60 hover:bg-slate-700 transition-colors py-2.5 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2"
                  >
                    <span>View Analysis & Ratios</span>
                    <span className="text-slate-500">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── BACK FACE ────────────────────────────────────────────── */}
            <div
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
              className="rounded-3xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl flex flex-col"
            >
              <div className={`h-1 shrink-0 ${dayUp ? 'bg-emerald-400' : 'bg-red-400'}`} />

              <div className="flex flex-col flex-1 overflow-y-auto p-5 pb-4 overscroll-contain">
                {/* Back header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-2xl font-black tracking-tight text-white">{stock.symbol}</span>
                      <span className="rounded bg-slate-700 px-1.5 py-0.5 text-xs font-semibold uppercase text-slate-400">
                        {stock.quoteType === 'ETF' ? 'ETF' : 'STOCK'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{stock.name}</p>
                  </div>
                  <div onPointerDown={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                </div>

                {/* Price (small reminder) */}
                <p className="text-lg font-bold text-white mb-4">
                  ${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className={`ml-2 text-sm font-medium ${dayUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {dayUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </p>

                {/* Analyst consensus */}
                {stock.analyst ? (
                  <div
                    className="mb-3 rounded-2xl bg-slate-700/40 p-3.5 cursor-pointer hover:bg-slate-700/60 transition-colors active:scale-[0.99]"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => tap('analystConsensus', stock.analyst?.ratingScore ?? null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Analyst Consensus</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-bold ${ratingColor(stock.analyst.ratingKey)}`}>
                          {RATING_LABELS[stock.analyst.ratingKey] ?? stock.analyst.ratingKey}
                        </span>
                        <span className="text-slate-600 text-xs">›</span>
                      </div>
                    </div>
                    {totalA > 0 && (
                      <div className="mb-2 flex h-2 overflow-hidden rounded-full">
                        {stock.analyst.strongBuy > 0 && <div className="bg-emerald-500" style={{ width: `${(stock.analyst.strongBuy / totalA) * 100}%` }} />}
                        {stock.analyst.buy > 0       && <div className="bg-emerald-400" style={{ width: `${(stock.analyst.buy / totalA) * 100}%` }} />}
                        {stock.analyst.hold > 0      && <div className="bg-yellow-400" style={{ width: `${(stock.analyst.hold / totalA) * 100}%` }} />}
                        {stock.analyst.sell > 0      && <div className="bg-red-400"    style={{ width: `${(stock.analyst.sell / totalA) * 100}%` }} />}
                        {stock.analyst.strongSell > 0 && <div className="bg-red-600"  style={{ width: `${(stock.analyst.strongSell / totalA) * 100}%` }} />}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{stock.analyst.analystCount} analysts</span>
                      {stock.analyst.targetMean && (
                        <span className={upside != null && upside > 0 ? 'text-emerald-400' : 'text-red-400'}>
                          Target ${stock.analyst.targetMean.toFixed(2)}{' '}
                          {upside != null && <span className="font-semibold">({upside > 0 ? '+' : ''}{upside.toFixed(1)}%)</span>}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 rounded-2xl bg-slate-700/40 p-3 text-center text-sm text-slate-500">
                    No analyst coverage
                  </div>
                )}

                {/* Price target range */}
                {stock.analyst?.targetLow != null && stock.analyst?.targetHigh != null && targetPct != null && (
                  <div
                    className="mb-3 rounded-2xl bg-slate-700/40 p-3.5 cursor-pointer hover:bg-slate-700/60 transition-colors active:scale-[0.99]"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => tap('analystTarget', stock.analyst?.targetMean ?? null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Price Target Range</p>
                      <span className="text-slate-600 text-xs">›</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-xs font-medium text-red-400">${stock.analyst.targetLow.toFixed(0)}</span>
                      <div className="relative flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-400" />
                        <div className="absolute -top-0.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-slate-900 bg-white shadow" style={{ left: `${targetPct}%` }} />
                      </div>
                      <span className="w-12 text-right text-xs font-medium text-emerald-400">${stock.analyst.targetHigh.toFixed(0)}</span>
                    </div>
                    <p className="mt-1 text-center text-xs text-slate-500">Current <span className="text-white">${stock.price.toFixed(2)}</span></p>
                  </div>
                )}

                {/* Key ratios grid */}
                <div className="mb-3 grid grid-cols-2 gap-2.5 text-xs" onPointerDown={(e) => e.stopPropagation()}>
                  <div
                    className="rounded-2xl bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/60 transition-colors active:scale-[0.98]"
                    onClick={() => tap('beta', stock.beta)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Volatility (β)</p>
                      <span className="text-slate-600 text-xs">›</span>
                    </div>
                    <p className="text-xl font-bold text-white">{stock.beta?.toFixed(2) ?? '—'}</p>
                    <p className={`text-xs ${bColor}`}>{bLabel}</p>
                  </div>
                  <div
                    className="rounded-2xl bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/60 transition-colors active:scale-[0.98]"
                    onClick={() => tap('pe', stock.pe)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">P/E Ratio</p>
                      <span className="text-slate-600 text-xs">›</span>
                    </div>
                    <p className="text-xl font-bold text-white">{stock.pe?.toFixed(1) ?? '—'}</p>
                    <p className="text-xs text-slate-400">Trailing 12M</p>
                  </div>
                  <div
                    className="rounded-2xl bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/60 transition-colors active:scale-[0.98]"
                    onClick={() => tap('marketCap', stock.marketCap)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Market Cap</p>
                      <span className="text-slate-600 text-xs">›</span>
                    </div>
                    <p className="text-xl font-bold text-white">{fmtCap(stock.marketCap)}</p>
                  </div>
                  <div
                    className="rounded-2xl bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/60 transition-colors active:scale-[0.98]"
                    onClick={() => tap('avgVolume', stock.avgVolume)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Avg Volume</p>
                      <span className="text-slate-600 text-xs">›</span>
                    </div>
                    <p className="text-xl font-bold text-white">{stock.avgVolume ? fmtVol(stock.avgVolume) : '—'}</p>
                  </div>
                </div>

                {/* 52-week range */}
                <div
                  className="mb-3 rounded-2xl bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/60 transition-colors active:scale-[0.99]"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => tap('week52', week52Pct)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">52-Week Range</p>
                    <span className="text-slate-600 text-xs">›</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>${stock.week52Low.toFixed(2)}</span>
                    <div className="relative flex-1">
                      <div className="h-1.5 rounded-full bg-slate-600" />
                      <div className="absolute inset-y-0 left-0 rounded-full bg-blue-500/50" style={{ width: `${week52Pct}%` }} />
                      <div className="absolute -top-0.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-slate-900 bg-blue-400" style={{ left: `${week52Pct}%` }} />
                    </div>
                    <span>${stock.week52High.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-center text-xs text-slate-500">
                    At <span className="text-blue-400 font-medium">{week52Pct.toFixed(0)}%</span> of annual range
                  </p>
                </div>

                {/* Research links */}
                <div onPointerDown={(e) => e.stopPropagation()}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Research</p>
                  <div className="flex flex-wrap gap-1.5">
                    {researchLinks(stock.symbol, stock.quoteType).map((link) => (
                      <a
                        key={link.title}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.title}
                        className="rounded-lg bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        {link.short}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    )
  }
)

SwipeCard.displayName = 'SwipeCard'
