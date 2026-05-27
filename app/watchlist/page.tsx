'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { StockData, WatchlistEntry } from '@/lib/stocks/types'
import { PriceChart } from '@/components/stocks/PriceChart'
import { ALL_RANGES, type RangeKey } from '@/lib/stocks/history'
import { SYMBOL_SECTORS, STOCK_SECTORS, ETF_CATEGORIES } from '@/lib/stocks/sectors'

const RATING_LABELS: Record<string, string> = {
  strongBuy: 'Strong Buy', buy: 'Buy', hold: 'Hold',
  underperform: 'Underperform', sell: 'Sell', strongSell: 'Strong Sell',
}

function ratingColor(key: string): string {
  if (key === 'strongBuy') return 'text-emerald-400'
  if (key === 'buy') return 'text-green-400'
  if (key === 'hold') return 'text-yellow-400'
  return 'text-red-400'
}

function fmt(n: number, d = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}

function capLabel(marketCap: number | null): 'Large' | 'Mid' | 'Small' | null {
  if (!marketCap) return null
  if (marketCap >= 10e9) return 'Large'
  if (marketCap >= 2e9)  return 'Mid'
  return 'Small'
}

interface WatchlistItemData {
  entry: WatchlistEntry
  stock: StockData | null
  loading: boolean
}

// ── Filter chip component ──────────────────────────────────────────────────

function Chip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  )
}

// ── WatchCard ─────────────────────────────────────────────────────────────

function WatchCard({ item, onRemove }: { item: WatchlistItemData; onRemove: () => void }) {
  const { entry, stock, loading } = item
  const [range, setRange] = useState<RangeKey>('1M')
  const [history, setHistory] = useState<Partial<Record<RangeKey, number[]>>>({})
  const [histLoading, setHistLoading] = useState(false)

  useEffect(() => {
    if (!stock) return
    if (history[range]) return
    setHistLoading(true)
    fetch(`/api/stocks/${entry.symbol}/history?range=${range}&price=${stock.price}&beta=${stock.beta ?? 1}`)
      .then((r) => r.json())
      .then((d) => setHistory((prev) => ({ ...prev, [range]: d.prices })))
      .catch(() => {})
      .finally(() => setHistLoading(false))
  }, [range, stock, entry.symbol, history])

  const gainSinceAdded = stock
    ? ((stock.price - entry.priceWhenAdded) / entry.priceWhenAdded) * 100
    : null

  const upside = stock?.analyst?.targetMean
    ? ((stock.analyst.targetMean - stock.price) / stock.price) * 100
    : null

  const totalA = stock?.analyst
    ? stock.analyst.strongBuy + stock.analyst.buy + stock.analyst.hold + stock.analyst.sell + stock.analyst.strongSell
    : 0

  const isPositive = stock ? stock.changePercent >= 0 : true
  const added = new Date(entry.addedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const sector = SYMBOL_SECTORS[entry.symbol]
  const cap    = stock ? capLabel(stock.marketCap) : null

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-xl font-black text-white">{entry.symbol}</span>
            {stock && (
              <span className="rounded bg-slate-700 px-1.5 py-0.5 text-xs font-medium uppercase text-slate-400">
                {stock.quoteType === 'ETF' ? 'ETF' : 'STOCK'}
              </span>
            )}
            {cap && (
              <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                {cap} Cap
              </span>
            )}
            {sector && (
              <span className="rounded bg-slate-700/40 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                {sector}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">{entry.name}</p>
          <p className="text-xs text-slate-600 mt-0.5">Added {added} · Was ${fmt(entry.priceWhenAdded)}</p>
        </div>
        <button
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400 transition-colors text-lg leading-none ml-2"
          aria-label="Remove from watchlist"
        >
          ×
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
          Loading live data…
        </div>
      )}

      {!loading && stock && (
        <>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">${fmt(stock.price)}</p>
              <p className={`text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{fmt(stock.change)} ({isPositive ? '+' : ''}{fmt(stock.changePercent)}%) today
              </p>
            </div>
            {gainSinceAdded != null && (
              <div className={`rounded-xl px-3 py-2 text-right ${gainSinceAdded >= 0 ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                <p className={`text-xs font-semibold ${gainSinceAdded >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Since added
                </p>
                <p className={`text-lg font-bold ${gainSinceAdded >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {gainSinceAdded >= 0 ? '+' : ''}{fmt(gainSinceAdded)}%
                </p>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="relative mb-1">
            {histLoading && !history[range] && (
              <div className="h-20 animate-pulse rounded-lg bg-slate-700/30" />
            )}
            {history[range] && (
              <PriceChart prices={history[range]!} height={80} className="w-full rounded-lg" />
            )}
          </div>

          {/* Range selector */}
          <div className="flex gap-1 mb-4">
            {ALL_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`flex-1 rounded py-0.5 text-xs font-semibold transition-colors ${
                  range === r ? 'bg-slate-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Analyst */}
          {stock.analyst ? (
            <div className="rounded-xl bg-slate-700/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Analyst Consensus</span>
                <span className={`text-sm font-bold ${ratingColor(stock.analyst.ratingKey)}`}>
                  {RATING_LABELS[stock.analyst.ratingKey] ?? stock.analyst.ratingKey}
                </span>
              </div>
              {totalA > 0 && (
                <div className="mb-2 flex h-1.5 overflow-hidden rounded-full">
                  {stock.analyst.strongBuy  > 0 && <div className="bg-emerald-500" style={{ width: `${(stock.analyst.strongBuy  / totalA) * 100}%` }} />}
                  {stock.analyst.buy        > 0 && <div className="bg-emerald-400" style={{ width: `${(stock.analyst.buy        / totalA) * 100}%` }} />}
                  {stock.analyst.hold       > 0 && <div className="bg-yellow-400"  style={{ width: `${(stock.analyst.hold       / totalA) * 100}%` }} />}
                  {stock.analyst.sell       > 0 && <div className="bg-red-400"     style={{ width: `${(stock.analyst.sell       / totalA) * 100}%` }} />}
                  {stock.analyst.strongSell > 0 && <div className="bg-red-600"     style={{ width: `${(stock.analyst.strongSell / totalA) * 100}%` }} />}
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{stock.analyst.analystCount} analysts</span>
                {stock.analyst.targetMean && upside != null && (
                  <span className={upside >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    Target ${fmt(stock.analyst.targetMean)}{' '}
                    <span className="font-semibold">({upside >= 0 ? '+' : ''}{fmt(upside)}% upside)</span>
                  </span>
                )}
              </div>
              {stock.analyst.targetMean && (
                <div className="mt-2 pt-2 border-t border-slate-600/50 text-xs text-slate-500">
                  Analyst mean vs. your entry:{' '}
                  {(() => {
                    const diff = ((stock.analyst.targetMean! - entry.priceWhenAdded) / entry.priceWhenAdded) * 100
                    return (
                      <span className={diff >= 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {diff >= 0 ? '+' : ''}{fmt(diff)}%
                      </span>
                    )
                  })()}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-600 text-center py-2">No analyst coverage</p>
          )}

          {stock.beta != null && (
            <p className="mt-2 text-xs text-slate-600">
              Beta: <span className="text-slate-400">{stock.beta.toFixed(2)}</span>
              &nbsp;·&nbsp; Mkt Cap:{' '}
              <span className="text-slate-400">
                {stock.marketCap
                  ? stock.marketCap >= 1e12
                    ? `$${(stock.marketCap / 1e12).toFixed(1)}T`
                    : `$${(stock.marketCap / 1e9).toFixed(0)}B`
                  : 'N/A'}
              </span>
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ── Portfolio Summary ──────────────────────────────────────────────────────

function PortfolioSummary({ items }: { items: WatchlistItemData[] }) {
  const loaded = items.filter((i) => i.stock && !i.loading)
  if (loaded.length === 0) return null

  const gains = loaded.map((i) => ({
    symbol: i.entry.symbol,
    gain: ((i.stock!.price - i.entry.priceWhenAdded) / i.entry.priceWhenAdded) * 100,
  }))

  const avgGain = gains.reduce((s, g) => s + g.gain, 0) / gains.length
  const best    = gains.reduce((a, b) => (a.gain > b.gain ? a : b))
  const worst   = gains.reduce((a, b) => (a.gain < b.gain ? a : b))
  const winners = gains.filter((g) => g.gain >= 0).length

  return (
    <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Portfolio Summary</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-slate-800/60 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Avg Return</p>
          <p className={`text-xl font-black ${avgGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {avgGain >= 0 ? '+' : ''}{fmt(avgGain)}%
          </p>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Winners</p>
          <p className="text-xl font-black text-white">
            {winners}<span className="text-slate-500 text-sm font-normal">/{loaded.length}</span>
          </p>
        </div>
        <div className="rounded-xl bg-emerald-400/10 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Best</p>
          <p className="text-xs font-bold text-slate-300 mb-0.5">{best.symbol}</p>
          <p className="text-lg font-black text-emerald-400">+{fmt(best.gain)}%</p>
        </div>
        <div className="rounded-xl bg-red-400/10 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Worst</p>
          <p className="text-xs font-bold text-slate-300 mb-0.5">{worst.symbol}</p>
          <p className="text-lg font-black text-red-400">{fmt(worst.gain)}%</p>
        </div>
      </div>
    </div>
  )
}

// ── Filter bar ─────────────────────────────────────────────────────────────

interface Filters {
  type: 'All' | 'Stocks' | 'ETFs'
  cap: 'All' | 'Large' | 'Mid' | 'Small'
  sector: string   // '' = All
}

function FilterBar({
  filters, onChange, items,
}: {
  filters: Filters
  onChange: (f: Filters) => void
  items: WatchlistItemData[]
}) {
  // Only show sectors/ETF categories that exist in the current watchlist
  const presentSectors = useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => {
      const s = SYMBOL_SECTORS[i.entry.symbol]
      if (s) set.add(s)
    })
    return [...STOCK_SECTORS, ...ETF_CATEGORIES].filter((s) => set.has(s))
  }, [items])

  const hasStocks = items.some((i) => i.stock?.quoteType !== 'ETF')
  const hasETFs   = items.some((i) => i.stock?.quoteType === 'ETF')

  if (items.length <= 1) return null

  return (
    <div className="mb-5 space-y-2">
      {/* Type */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="shrink-0 text-xs text-slate-600 w-12">Type</span>
        {(['All', ...(hasStocks ? ['Stocks'] : []), ...(hasETFs ? ['ETFs'] : [])] as const).map((t) => (
          <Chip
            key={t}
            label={t}
            active={filters.type === t}
            onClick={() => onChange({ ...filters, type: t as Filters['type'] })}
          />
        ))}
      </div>

      {/* Market cap */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="shrink-0 text-xs text-slate-600 w-12">Cap</span>
        {(['All', 'Large', 'Mid', 'Small'] as const).map((c) => (
          <Chip
            key={c}
            label={c === 'All' ? 'All Sizes' : `${c} Cap`}
            active={filters.cap === c}
            onClick={() => onChange({ ...filters, cap: c })}
          />
        ))}
      </div>

      {/* Industry / category */}
      {presentSectors.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="shrink-0 text-xs text-slate-600 w-16">Industry</span>
          <Chip
            label="All"
            active={filters.sector === ''}
            onClick={() => onChange({ ...filters, sector: '' })}
          />
          {presentSectors.map((s) => (
            <Chip
              key={s}
              label={s}
              active={filters.sector === s}
              onClick={() => onChange({ ...filters, sector: s })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItemData[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [filters, setFilters] = useState<Filters>({ type: 'All', cap: 'All', sector: '' })

  function parseWatchlist(raw: string | null): WatchlistEntry[] {
    try { return raw ? JSON.parse(raw) : [] } catch { return [] }
  }

  const loadEntries = useCallback(() => {
    const entries = parseWatchlist(localStorage.getItem('stockswipe_watchlist'))
    setItems(entries.map((entry) => ({ entry, stock: null, loading: true })))
    return entries
  }, [])

  const fetchLiveData = useCallback(async (entries: WatchlistEntry[]) => {
    setLastRefresh(new Date())
    await Promise.all(
      entries.map(async (entry, idx) => {
        try {
          const res = await fetch(`/api/stocks/${entry.symbol}`)
          const { stock } = await res.json()
          setItems((prev) => {
            const next = [...prev]
            if (next[idx]) next[idx] = { ...next[idx], stock, loading: false }
            return next
          })
        } catch {
          setItems((prev) => {
            const next = [...prev]
            if (next[idx]) next[idx] = { ...next[idx], loading: false }
            return next
          })
        }
      })
    )
  }, [])

  useEffect(() => {
    const entries = loadEntries()
    if (entries.length > 0) fetchLiveData(entries)
  }, [loadEntries, fetchLiveData])

  useEffect(() => {
    const interval = setInterval(() => {
      const entries = parseWatchlist(localStorage.getItem('stockswipe_watchlist'))
      if (entries.length > 0) fetchLiveData(entries)
    }, 60000)
    return () => clearInterval(interval)
  }, [fetchLiveData])

  const removeItem = useCallback((symbol: string) => {
    setItems((prev) => prev.filter((i) => i.entry.symbol !== symbol))
    const raw = localStorage.getItem('stockswipe_watchlist')
    const list: WatchlistEntry[] = raw ? JSON.parse(raw) : []
    localStorage.setItem('stockswipe_watchlist', JSON.stringify(list.filter((e) => e.symbol !== symbol)))
    window.dispatchEvent(new Event('watchlist-updated'))
  }, [])

  const handleRefresh = () => {
    const entries = parseWatchlist(localStorage.getItem('stockswipe_watchlist'))
    setItems(entries.map((entry) => ({ entry, stock: null, loading: true })))
    fetchLiveData(entries)
  }

  // Apply filters
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const { stock, entry } = item

      // Type
      if (filters.type === 'Stocks' && stock?.quoteType === 'ETF') return false
      if (filters.type === 'ETFs'   && stock?.quoteType !== 'ETF') return false

      // Cap
      if (filters.cap !== 'All' && stock) {
        if (capLabel(stock.marketCap) !== filters.cap) return false
      }

      // Sector
      if (filters.sector !== '') {
        if (SYMBOL_SECTORS[entry.symbol] !== filters.sector) return false
      }

      return true
    })
  }, [items, filters])

  const activeFilterCount = (filters.type !== 'All' ? 1 : 0) +
    (filters.cap !== 'All' ? 1 : 0) +
    (filters.sector !== '' ? 1 : 0)

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/discover" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
            ← Discover
          </Link>
          <span className="text-slate-700">|</span>
          <h1 className="text-lg font-black tracking-tight text-white">My Watchlist</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600">
            Updated {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={handleRefresh}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <div className="text-6xl">📋</div>
            <div>
              <h2 className="mb-2 text-xl font-bold text-white">Your watchlist is empty</h2>
              <p className="text-slate-400">Swipe right on stocks you want to track.</p>
            </div>
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Discover Stocks
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {filtered.length !== items.length
                  ? `${filtered.length} of ${items.length} stocks`
                  : `${items.length} stock${items.length !== 1 ? 's' : ''} tracked`}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters({ type: 'All', cap: 'All', sector: '' })}
                    className="ml-2 text-xs text-blue-400 hover:text-blue-300"
                  >
                    Clear filters
                  </button>
                )}
              </p>
              <button
                onClick={() => {
                  if (confirm('Clear your entire watchlist?')) {
                    localStorage.removeItem('stockswipe_watchlist')
                    setItems([])
                    window.dispatchEvent(new Event('watchlist-updated'))
                  }
                }}
                className="text-xs text-slate-600 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>

            <PortfolioSummary items={items} />

            <FilterBar filters={filters} onChange={setFilters} items={items} />

            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-slate-500 text-sm">No stocks match these filters.</p>
                <button
                  onClick={() => setFilters({ type: 'All', cap: 'All', sector: '' })}
                  className="mt-3 text-xs text-blue-400 hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((item) => (
                  <WatchCard
                    key={item.entry.symbol}
                    item={item}
                    onRemove={() => removeItem(item.entry.symbol)}
                  />
                ))}
              </div>
            )}

            <p className="mt-6 text-center text-xs text-slate-700">
              Live prices auto-refresh every 60 seconds
            </p>
          </>
        )}
      </div>
    </div>
  )
}
