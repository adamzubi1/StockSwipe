import { NextRequest, NextResponse } from 'next/server'
import { generateMockPrices, type RangeKey } from '@/lib/stocks/history'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'

const YF_RANGE: Record<RangeKey, { interval: string; range: string }> = {
  '5D':  { interval: '15m', range: '5d'  },
  '1M':  { interval: '1d',  range: '1mo' },
  '3M':  { interval: '1d',  range: '3mo' },
  'YTD': { interval: '1d',  range: 'ytd' },
  '1Y':  { interval: '1d',  range: '1y'  },
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

  const yf = YF_RANGE[rangeKey] ?? YF_RANGE['1M']

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${upper}?interval=${yf.interval}&range=${yf.range}`
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      next: { revalidate: 300 },
    })

    if (res.ok) {
      const data = await res.json()
      const result = data.chart?.result?.[0]
      const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? []
      const valid = closes.filter((c): c is number => c != null && isFinite(c))
      if (valid.length >= 5) {
        return NextResponse.json({ prices: valid, source: 'live' })
      }
    }
  } catch {
    // fall through
  }

  const prices = generateMockPrices(upper, price, beta, rangeKey)
  return NextResponse.json({ prices, source: 'mock' })
}
