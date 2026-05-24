import { NextRequest, NextResponse } from 'next/server'
import { MOCK_STOCKS } from '@/lib/stocks/mockData'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params
  const upper = symbol.toUpperCase()

  try {
    const [quoteRes, analystRes] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${upper}`, {
        headers: { 'User-Agent': UA },
        next: { revalidate: 60 },
      }),
      fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${upper}?modules=financialData,recommendationTrend`, {
        headers: { 'User-Agent': UA },
        next: { revalidate: 3600 },
      }),
    ])

    if (!quoteRes.ok) throw new Error('quote fetch failed')

    const quoteData = await quoteRes.json()
    const q = quoteData.quoteResponse?.result?.[0]
    if (!q) throw new Error('no quote result')

    let analyst = null
    if (analystRes.ok) {
      const ad = await analystRes.json()
      const fd = ad.quoteSummary?.result?.[0]?.financialData
      const rt = ad.quoteSummary?.result?.[0]?.recommendationTrend?.trend?.[0]
      if (fd) {
        analyst = {
          targetLow: fd.targetLowPrice?.raw ?? null,
          targetHigh: fd.targetHighPrice?.raw ?? null,
          targetMean: fd.targetMeanPrice?.raw ?? null,
          ratingKey: fd.recommendationKey ?? 'hold',
          ratingScore: fd.recommendationMean?.raw ?? null,
          analystCount: fd.numberOfAnalystOpinions?.raw ?? 0,
          strongBuy: rt?.strongBuy ?? 0,
          buy: rt?.buy ?? 0,
          hold: rt?.hold ?? 0,
          sell: rt?.sell ?? 0,
          strongSell: rt?.strongSell ?? 0,
        }
      }
    }

    return NextResponse.json({
      stock: {
        symbol: q.symbol,
        name: q.shortName || q.longName || q.symbol,
        price: q.regularMarketPrice ?? 0,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        marketCap: q.marketCap ?? null,
        volume: q.regularMarketVolume ?? 0,
        avgVolume: q.averageDailyVolume3Month ?? null,
        beta: q.beta ?? null,
        week52Low: q.fiftyTwoWeekLow ?? 0,
        week52High: q.fiftyTwoWeekHigh ?? 0,
        pe: q.trailingPE ?? null,
        quoteType: q.quoteType ?? 'EQUITY',
        analyst,
      },
    })
  } catch {
    const mock = MOCK_STOCKS.find((s) => s.symbol === upper)
    if (mock) return NextResponse.json({ stock: mock })
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
