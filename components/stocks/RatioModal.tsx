'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RATIO_METRICS, SECTOR_PEERS } from '@/lib/stocks/ratioData'
import { SYMBOL_SECTORS } from '@/lib/stocks/sectors'

export interface ActiveMetric {
  key: string
  value: number | null
  symbol: string
}

interface Props {
  metric: ActiveMetric | null
  onClose: () => void
}

function peerVal(peer: { pe: number | null; beta: number | null }, key: string): number | null {
  if (key === 'pe') return peer.pe
  if (key === 'beta') return peer.beta
  return null
}

function formatPeerVal(v: number | null, key: string): string {
  if (v == null) return '—'
  if (key === 'pe')   return `${v.toFixed(1)}x`
  if (key === 'beta') return v.toFixed(2)
  return String(v)
}

function capTier(v: number): { label: string; color: string } {
  if (v >= 200e9)  return { label: 'Mega Cap  >$200B',           color: 'text-blue-400'    }
  if (v >= 10e9)   return { label: 'Large Cap  $10B – $200B',    color: 'text-emerald-400' }
  if (v >= 2e9)    return { label: 'Mid Cap  $2B – $10B',        color: 'text-yellow-400'  }
  return             { label: 'Small Cap  <$2B',                  color: 'text-orange-400'  }
}

function volContext(v: number): { label: string; color: string } {
  if (v >= 10e6) return { label: 'Highly liquid  (>10M/day)',   color: 'text-emerald-400' }
  if (v >= 1e6)  return { label: 'Liquid  (1M – 10M/day)',      color: 'text-blue-400'    }
  return           { label: 'Less liquid  (<1M/day)',            color: 'text-orange-400'  }
}

export function RatioModal({ metric, onClose }: Props) {
  const info = metric ? RATIO_METRICS[metric.key] : null

  return (
    <AnimatePresence>
      {metric && info && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed bottom-0 left-0 right-0 z-[61] max-h-[82vh] overflow-y-auto rounded-t-3xl border-t border-slate-700 bg-slate-900"
          >
            {/* Drag handle */}
            <div className="sticky top-0 flex justify-center bg-slate-900 pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-700" />
            </div>

            <div className="px-5 pb-10">
              {/* Header */}
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xl font-black text-white">{info.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {metric.symbol}
                    {SYMBOL_SECTORS[metric.symbol] ? ` · ${SYMBOL_SECTORS[metric.symbol]}` : ''}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Value card */}
              {metric.value != null && (() => {
                const sector   = SYMBOL_SECTORS[metric.symbol] ?? null
                const avg      = sector && info.sectorAverages ? info.sectorAverages[sector] : null
                const pctDiff  = avg != null ? ((metric.value - avg) / avg) * 100 : null
                const isAbove  = pctDiff != null && pctDiff > 5
                const isBelow  = pctDiff != null && pctDiff < -5
                const isGood   =
                  info.higherIsBetter === true  ? isAbove :
                  info.higherIsBetter === false ? isBelow : null

                return (
                  <div className={`mb-5 rounded-2xl border p-4 ${
                    isGood === true  ? 'border-emerald-500/30 bg-emerald-500/10' :
                    isGood === false ? 'border-red-500/30 bg-red-500/10' :
                    'border-slate-700 bg-slate-800/60'
                  }`}>
                    <p className="mb-1 text-xs text-slate-400">{metric.symbol}'s value</p>
                    <p className={`text-4xl font-black ${
                      isGood === true  ? 'text-emerald-400' :
                      isGood === false ? 'text-red-400' :
                      'text-white'
                    }`}>
                      {info.format(metric.value)}
                    </p>

                    {/* vs sector average */}
                    {avg != null && pctDiff != null && (
                      <div className="mt-3">
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="text-slate-500">{sector} avg: {info.format(avg)}</span>
                          <span className={isGood === true ? 'text-emerald-400 font-semibold' : isGood === false ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                            {pctDiff > 0 ? '+' : ''}{pctDiff.toFixed(1)}% vs avg
                          </span>
                        </div>
                        {/* Visual bar */}
                        <div className="relative h-2 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className={`absolute inset-y-0 left-1/2 rounded-full ${
                              isGood === true  ? 'bg-emerald-400' :
                              isGood === false ? 'bg-red-400' :
                              'bg-blue-400'
                            }`}
                            style={{
                              width: `${Math.min(Math.abs(pctDiff) / 2, 50)}%`,
                              ...(pctDiff < 0
                                ? { right: '50%', left: 'auto' }
                                : { left: '50%' }),
                            }}
                          />
                          <div className="absolute inset-y-0 left-1/2 w-px bg-slate-500" />
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-slate-600">
                          <span>Below avg</span>
                          <span>Above avg</span>
                        </div>
                      </div>
                    )}

                    {/* Context for non-averaged metrics */}
                    {metric.key === 'marketCap' && (() => {
                      const { label, color } = capTier(metric.value!)
                      return <p className={`mt-2 text-sm font-semibold ${color}`}>{label}</p>
                    })()}
                    {metric.key === 'avgVolume' && (() => {
                      const { label, color } = volContext(metric.value!)
                      return <p className={`mt-2 text-sm font-semibold ${color}`}>{label}</p>
                    })()}
                  </div>
                )
              })()}

              {/* What it means */}
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  What this means
                </p>
                <p className="text-sm leading-relaxed text-slate-300">{info.detail}</p>
              </div>

              {/* Peer comp table — beta and PE only */}
              {(metric.key === 'beta' || metric.key === 'pe') && (() => {
                const sector = SYMBOL_SECTORS[metric.symbol] ?? null
                const peers  = sector
                  ? (SECTOR_PEERS[sector] ?? []).filter((p) => p.symbol !== metric.symbol)
                  : []
                if (peers.length === 0) return null
                return (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {sector} Peers
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-slate-700">
                      {/* Header row */}
                      <div className="grid grid-cols-3 bg-slate-800/70 px-4 py-2">
                        <span className="text-xs font-semibold text-slate-500">Stock</span>
                        <span className="text-center text-xs font-semibold text-slate-500">
                          {metric.key === 'pe' ? 'P/E' : 'Beta'}
                        </span>
                        <span className="text-right text-xs font-semibold text-slate-500">Mkt Cap</span>
                      </div>

                      {/* Current stock highlighted */}
                      {metric.value != null && (
                        <div className="grid grid-cols-3 border-b border-slate-700 bg-blue-500/10 px-4 py-3">
                          <div>
                            <p className="text-xs font-bold text-blue-400">{metric.symbol}</p>
                            <p className="text-xs text-slate-500">You're looking at</p>
                          </div>
                          <span className="self-center text-center text-sm font-bold text-white">
                            {formatPeerVal(metric.value, metric.key)}
                          </span>
                          <span className="self-center text-right text-xs text-slate-500">—</span>
                        </div>
                      )}

                      {/* Peers */}
                      {peers.map((peer, i) => {
                        const val = peerVal(peer, metric.key)
                        return (
                          <div
                            key={peer.symbol}
                            className={`grid grid-cols-3 px-4 py-3 ${
                              i < peers.length - 1 ? 'border-b border-slate-700/50' : ''
                            }`}
                          >
                            <div>
                              <p className="text-xs font-semibold text-white">{peer.symbol}</p>
                              <p className="text-xs text-slate-500">{peer.name}</p>
                            </div>
                            <span className="self-center text-center text-xs text-slate-300">
                              {formatPeerVal(val, metric.key)}
                            </span>
                            <span className="self-center text-right text-xs text-slate-400">
                              {peer.marketCap}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
