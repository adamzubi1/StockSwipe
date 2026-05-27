'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SwipeCard, SwipeCardHandle } from '@/components/stocks/SwipeCard'
import type { StockData, WatchlistEntry } from '@/lib/stocks/types'

function parseWatchlist(raw: string | null): WatchlistEntry[] {
  try { return raw ? JSON.parse(raw) : [] } catch { return [] }
}

function WatchlistCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(parseWatchlist(localStorage.getItem('stockswipe_watchlist')).length)
    const handler = () =>
      setCount(parseWatchlist(localStorage.getItem('stockswipe_watchlist')).length)
    window.addEventListener('watchlist-updated', handler)
    return () => window.removeEventListener('watchlist-updated', handler)
  }, [])
  return (
    <span className="ml-1.5 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold">
      {count}
    </span>
  )
}

export default function Home() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)
  const [watched, setWatched] = useState<string[]>([])
  const [skipped, setSkipped] = useState<string[]>([])
  const [lastAction, setLastAction] = useState<'watch' | 'skip' | 'defer' | null>(null)
  const topCardRef = useRef<SwipeCardHandle>(null)

  useEffect(() => {
    fetch('/api/stocks/queue')
      .then((r) => r.json())
      .then(({ stocks, isMock }) => {
        setStocks(stocks)
        setIsMock(isMock)
      })
      .finally(() => setLoading(false))
  }, [])

  const addToWatchlist = useCallback((stock: StockData) => {
    const list = parseWatchlist(localStorage.getItem('stockswipe_watchlist'))
    if (!list.find((e) => e.symbol === stock.symbol)) {
      list.push({
        symbol: stock.symbol,
        name: stock.name,
        addedAt: Date.now(),
        priceWhenAdded: stock.price,
      })
      localStorage.setItem('stockswipe_watchlist', JSON.stringify(list))
      window.dispatchEvent(new Event('watchlist-updated'))
    }
  }, [])

  const handleWatch = useCallback(
    (stock: StockData) => {
      addToWatchlist(stock)
      setWatched((p) => [...p, stock.symbol])
      setLastAction('watch')
      setCurrentIndex((i) => i + 1)
    },
    [addToWatchlist]
  )

  const handleSkip = useCallback((stock: StockData) => {
    setSkipped((p) => [...p, stock.symbol])
    setLastAction('skip')
    setCurrentIndex((i) => i + 1)
  }, [])

  const handleDefer = useCallback(() => {
    // Move the current top card to the end of the deck — user will see it again later
    setStocks((prev) => {
      const next = [...prev]
      const [card] = next.splice(currentIndex, 1)
      next.push(card)
      return next
    })
    setLastAction('defer')
    // Don't increment currentIndex — the next card slides into position naturally
  }, [currentIndex])

  const remaining = stocks.slice(currentIndex)
  const isDone = !loading && stocks.length > 0 && remaining.length === 0

  return (
    <div className="flex h-screen flex-col">
      {/* Nav */}
      <nav className="flex shrink-0 items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-white">StockSwipe</span>
          {isMock && (
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
              demo data
            </span>
          )}
        </div>
        <Link
          href="/watchlist"
          className="flex items-center rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
        >
          Watchlist
          <WatchlistCount />
        </Link>
      </nav>

      {/* Progress bar */}
      {!loading && stocks.length > 0 && (
        <div className="shrink-0 px-5 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">
              {currentIndex} / {stocks.length} reviewed
            </span>
            <span className="text-xs text-slate-500">
              {watched.length} watched · {skipped.length} skipped
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-800">
            <div
              className="h-1 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(currentIndex / stocks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Card area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
        {loading && (
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
            <p className="text-sm">Fetching market data…</p>
          </div>
        )}

        {!loading && isDone && (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="text-6xl">🎉</div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-white">All caught up!</h2>
              <p className="text-slate-400">
                You watched <span className="text-emerald-400 font-semibold">{watched.length}</span> stocks and
                skipped <span className="text-red-400 font-semibold">{skipped.length}</span>.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0)
                  setWatched([])
                  setSkipped([])
                  setLastAction(null)
                }}
                className="rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Start Over
              </button>
              <Link
                href="/watchlist"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                View Watchlist
              </Link>
            </div>
          </div>
        )}

        {!loading && !isDone && remaining.length > 0 && (
          <div className="relative w-full max-w-sm" style={{ height: 'min(620px, calc(100vh - 200px))' }}>
            {remaining.slice(0, 3).map((stock, i) => (
              <SwipeCard
                key={stock.symbol}
                ref={i === 0 ? topCardRef : undefined}
                stock={stock}
                isTop={i === 0}
                stackIndex={i}
                onWatch={() => handleWatch(remaining[0])}
                onSkip={() => handleSkip(remaining[0])}
                onDefer={handleDefer}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!loading && !isDone && (
        <div className="shrink-0 flex flex-col items-center gap-2 py-4">
          {/* Feedback */}
          <div className="h-4 text-center">
            {lastAction === 'watch' && <p className="text-xs font-semibold text-emerald-400">Added to watchlist!</p>}
            {lastAction === 'skip'  && <p className="text-xs font-semibold text-red-400">Skipped</p>}
            {lastAction === 'defer' && <p className="text-xs font-semibold text-slate-400">See you later!</p>}
          </div>

          <div className="flex items-center gap-5">
            {/* Permanent skip */}
            <button
              onClick={() => topCardRef.current?.swipeLeft()}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500/40 bg-slate-900 text-2xl shadow-lg hover:border-red-400 hover:bg-red-500/10 transition-all active:scale-95"
              aria-label="Skip"
            >
              ✕
            </button>

            {/* Defer — come back later */}
            <button
              onClick={() => topCardRef.current?.defer()}
              className="flex flex-col items-center justify-center gap-0.5 h-12 w-12 rounded-full border-2 border-slate-600 bg-slate-900 shadow-md hover:border-slate-400 hover:bg-slate-800 transition-all active:scale-95"
              aria-label="Skip for now — come back later"
            >
              <span className="text-lg leading-none">↩</span>
              <span className="text-[9px] font-bold text-slate-500 leading-none">LATER</span>
            </button>

            {/* Watch */}
            <button
              onClick={() => topCardRef.current?.swipeRight()}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-slate-900 text-2xl shadow-lg hover:border-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95"
              aria-label="Watch"
            >
              ★
            </button>
          </div>

          {currentIndex === 0 && (
            <p className="text-xs text-slate-600">
              ✕ skip · ↩ come back later · ★ watch
            </p>
          )}
        </div>
      )}
    </div>
  )
}
