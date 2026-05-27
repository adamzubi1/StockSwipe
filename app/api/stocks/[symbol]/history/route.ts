import { NextRequest, NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'
import { generateMockPrices, type RangeKey } from '@/lib/stocks/history'

const yf = new YahooFinance()

type IntervalKey = '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo'

function getPeriod1(rangeKey: RangeKey): Date {
  const now = new Date()
  switch (rangeKey) {
    case '5D':  return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    case '1M':  return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    case '3M':  return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    case 'YTD': return new Date(now.getFullYear(), 0, 1)
    case '1Y':  return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    default:    return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  }
}

const INTERVAL: Record<RangeKey, IntervalKey> = {
  '5D':  '15m',
  '1M':  '1d',
  '3M':  '1d',
  'YTD': '1d',
  '1Y':  '1d',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params
  const upper = symbol.toUpperCase()
  const rangeKey = (req.nextUrl.searchParams.get('range') ?? '1M') as RangeKey
  const price = parseFloat(req.nextUrl.searchParams.get('price') ?? '100')
  const beta = parseFloat(req.nextUrl.searchParams.get('beta') ?? '1')

  try {
    const result = await yf.chart(upper, {
      period1: getPeriod1(rangeKey),
      interval: INTERVAL[rangeKey] ?? '1d',
    })

    const closes = (result.quotes ?? [])
      .map((q) => q.close)
      .filter((c): c is number => c != null && isFinite(c))

    if (closes.length >= 5) {
      return NextResponse.json({ prices: closes, source: 'live' })
    }
  } catch {
    // fall through to mock
  }

  const prices = generateMockPrices(upper, price, beta, rangeKey)
  return NextResponse.json({ prices, source: 'mock' })
}
