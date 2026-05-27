import Link from 'next/link'
import { EmailCapture } from '@/components/EmailCapture'

const FEATURES = [
  {
    icon: '📈',
    title: 'Live Price Charts',
    desc: 'View 5-day, 1-month, YTD, and 1-year charts for every stock and ETF before you decide.',
  },
  {
    icon: '🔍',
    title: 'Analyst Intelligence',
    desc: 'Consensus ratings, price targets, and breakdowns from Wall Street analysts — right on the card.',
  },
  {
    icon: '📊',
    title: 'Deep Metrics',
    desc: 'Tap any ratio — P/E, Beta, Market Cap — to get a plain-English explanation and industry peer comps.',
  },
  {
    icon: '⭐',
    title: 'Smart Watchlist',
    desc: 'Track your saved stocks with live prices, gain/loss since you added them, and portfolio summary.',
  },
  {
    icon: '↩',
    title: 'Come Back Later',
    desc: "Not sure? Defer a card to the end of the deck and revisit it after you've seen everything else.",
  },
  {
    icon: '🔗',
    title: 'Research Links',
    desc: 'One tap to Yahoo Finance, Seeking Alpha, TipRanks, Finviz, and more — right from the card.',
  },
]

const TICKERS = ['AAPL', 'NVDA', 'MSFT', 'TSLA', 'GOOGL', 'META', 'AMZN', 'JPM', 'SPY', 'QQQ']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 max-w-5xl mx-auto">
        <span className="text-xl font-black tracking-tight">StockSwipe</span>
        <Link
          href="/discover"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Launch App →
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
        {/* Ticker strip */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TICKERS.map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-bold text-slate-400"
            >
              {t}
            </span>
          ))}
          <span className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-bold text-slate-600">
            +74 more
          </span>
        </div>

        <h1 className="mb-5 text-5xl font-black leading-tight tracking-tight sm:text-6xl">
          Discover stocks
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            like swiping
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400 leading-relaxed">
          Swipe through 84 stocks and ETFs. Get live charts, analyst ratings, and deep metrics — all in one card.
          Build a watchlist. Track your picks against analyst forecasts.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/discover"
            className="rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
          >
            Start Swiping — It&apos;s Free
          </Link>
          <Link
            href="/watchlist"
            className="rounded-2xl border border-slate-700 bg-slate-800/60 px-8 py-4 text-base font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            View Watchlist
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-slate-500">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { step: '1', title: 'Swipe through stocks', desc: 'Each card shows live price, chart, analyst rating, and key stats.' },
              { step: '2', title: 'Dig into the details', desc: 'Flip the card for full analyst data, ratios, and research links. Tap any metric for a full breakdown.' },
              { step: '3', title: 'Build your watchlist', desc: 'Swipe right to save. Track performance vs. analyst targets in real time.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-lg font-black text-blue-400">
                  {item.step}
                </div>
                <h3 className="mb-1.5 font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-slate-500">
          Everything you need
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-colors"
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="mb-1.5 font-bold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Email capture */}
      <section className="mx-auto max-w-lg px-6 pb-20 text-center">
        <h2 className="mb-2 text-2xl font-black text-white">Stay in the loop</h2>
        <p className="mb-6 text-slate-400">Get notified when new features and stocks are added.</p>
        <EmailCapture variant="card" />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-600">
        <p>StockSwipe · For informational purposes only · Not financial advice</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/discover" className="hover:text-slate-400 transition-colors">Discover</Link>
          <Link href="/watchlist" className="hover:text-slate-400 transition-colors">Watchlist</Link>
          <Link href="/skipped" className="hover:text-slate-400 transition-colors">Skipped</Link>
        </div>
      </footer>
    </div>
  )
}
