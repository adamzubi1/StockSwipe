'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { SkippedEntry, WatchlistEntry, StockData } from '@/lib/stocks/types'

function parseList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function fmt(n: number, d = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}

interface SkipItemData {
  entry: SkippedEntry
  stock: StockData | null
  loading: boolean
}

function SkipCard({
  item,
  onRemove,
  onAddToWatchlist,
}: {
  item: SkipItemData
  onRemove: () => void
  onAddToWatchlist: () => void
}) {
  const { entry, stock, loading } = item

  const changeSinceSkipped = stock
    ? ((stock.price - entry.priceWhenSkipped) / entry.priceWhenSkipped) * 100
    : null

  const dayUp = stock ? stock.changePercent >= 0 : true
  const skippedDate = new Date(entry.skippedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const alreadyWatched = parseList<WatchlistEntry>('stockswipe_watchlist')
    .some((e) => e.symbol === entry.symbol)

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl font-black text-white">{entry.symbol}</span>
            {stock && (
              <span className="rounded bg-slate-700 px-1.5 py-0.5 text-xs font-medium uppercase text-slate-400">
                {stock.quoteType === 'ETF' ? 'ETF' : 'STOCK'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">{entry.name}</p>
          <p className="text-xs text-slate-600 mt-0.5">Skipped {skippedDate} · Was ${fmt(entry.priceWhenSkipped)}</p>
        </div>
        <button
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400 transition-colors text-lg leading-none"
          aria-label="Remove"
        >
          ×
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
          Loading…
        </div>
      )}

      {!loading && stock && (
        <>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-white">${fmt(stock.price)}</p>
              <p className={`text-sm ${dayUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {dayUp ? '+' : ''}{fmt(stock.change)} ({dayUp ? '+' : ''}{fmt(stock.changePercent)}%) today
              </p>
            </div>
            {changeSinceSkipped != null && (
              <div className={`rounded-xl px-3 py-2 text-right ${changeSinceSkipped >= 0 ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                <p className={`text-xs font-semibold ${changeSinceSkipped >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Since skipped
                </p>
                <p className={`text-lg font-bold ${changeSinceSkipped >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {changeSinceSkipped >= 0 ? '+' : ''}{fmt(changeSinceSkipped)}%
                </p>
              </div>
            )}
          </div>

          {stock.analyst?.targetMean && (
            <p className="mb-3 text-xs text-slate-500">
              Analyst target:{' '}
              <span className="text-slate-300 font-semibold">${fmt(stock.analyst.targetMean)}</span>
              {' '}—{' '}
              {(() => {
                const upside = ((stock.analyst.targetMean! - stock.price) / stock.price) * 100
                return (
                  <span className={upside >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {upside >= 0 ? '+' : ''}{fmt(upside)}% upside
                  </span>
                )
              })()}
            </p>
          )}
        </>
      )}

      <div className="flex gap-2 mt-2">
        <button
          onClick={onAddToWatchlist}
          disabled={alreadyWatched}
          className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
            alreadyWatched
              ? 'bg-slate-700/40 text-slate-600 cursor-not-allowed'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
          }`}
        >
          {alreadyWatched ? '★ In Watchlist' : '★ Add to Watchlist'}
        </button>
        <button
          onClick={onRemove}
          className="rounded-xl bg-slate-700/40 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default function SkippedPage() {
  const [items, setItems] = useState<SkipItemData[]>([])

  const loadAndFetch = useCallback(() => {
    const entries = parseList<SkippedEntry>('stockswipe_skipped')
    setItems(entries.map((entry) => ({ entry, stock: null, loading: true })))

    entries.forEach(async (entry, idx) => {
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
  }, [])

  useEffect(() => { loadAndFetch() }, [loadAndFetch])

  const removeItem = useCallback((symbol: string) => {
    setItems((prev) => prev.filter((i) => i.entry.symbol !== symbol))
    const list = parseList<SkippedEntry>('stockswipe_skipped')
    localStorage.setItem(
      'stockswipe_skipped',
      JSON.stringify(list.filter((e) => e.symbol !== symbol))
    )
  }, [])

  const addToWatchlist = useCallback((item: SkipItemData) => {
    if (!item.stock) return
    const list = parseList<WatchlistEntry>('stockswipe_watchlist')
    if (!list.find((e) => e.symbol === item.entry.symbol)) {
      list.push({
        symbol: item.entry.symbol,
        name: item.entry.name,
        addedAt: Date.now(),
        priceWhenAdded: item.stock.price,
      })
      localStorage.setItem('stockswipe_watchlist', JSON.stringify(list))
      window.dispatchEvent(new Event('watchlist-updated'))
    }
    // Force re-render to update button state
    setItems((prev) => [...prev])
  }, [])

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
            ← Discover
          </Link>
          <span className="text-slate-700">|</span>
          <h1 className="text-lg font-black tracking-tight text-white">Skipped</h1>
        </div>
        <Link
          href="/watchlist"
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Watchlist
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <div className="text-6xl">👋</div>
            <div>
              <h2 className="mb-2 text-xl font-bold text-white">No skipped stocks</h2>
              <p className="text-slate-400">Stocks you swipe left on will appear here.</p>
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
              <p className="text-sm text-slate-400">{items.length} skipped stock{items.length !== 1 ? 's' : ''}</p>
              <button
                onClick={() => {
                  if (confirm('Clear all skipped stocks?')) {
                    localStorage.removeItem('stockswipe_skipped')
                    setItems([])
                  }
                }}
                className="text-xs text-slate-600 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <SkipCard
                  key={item.entry.symbol}
                  item={item}
                  onRemove={() => removeItem(item.entry.symbol)}
                  onAddToWatchlist={() => addToWatchlist(item)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
