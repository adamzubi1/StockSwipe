import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'StockSwipe — Discover Stocks & ETFs',
  description:
    'Swipe through stocks and ETFs. See analyst forecasts, volatility, and price targets — then track the ones you like in a live watchlist.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-950 text-white">
        {children}
      </body>
    </html>
  )
}
