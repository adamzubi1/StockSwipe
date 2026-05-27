import { NextRequest, NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'
import { MOCK_STOCKS } from '@/lib/stocks/mockData'

const yf = new YahooFinance()

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params
  const upper = symbol.toUpperCase()

  try {
    const [quote, summary] = await Promise.all([
      yf.quote(upper),
      yf.quoteSummary(upper, {
        modules: ['financialData', 'recommendationTrend'],
      }).catch(() => null),
    ])

    const fd = summary?.financialData
    const rt = summary?.recommendationTrend?.trend?.[0]

    const analyst = fd ? {
      targetLow:    fd.targetLowPrice  ?? null,
      targetHigh:   fd.targetHighPrice ?? null,
      targetMean:   fd.targetMeanPrice ?? null,
      ratingKey:    fd.recommendationKey ?? 'hold',
      ratingScore:  fd.recommendationMean ?? null,
      analystCount: fd.numberOfAnalystOpinions ?? 0,
      strongBuy:    rt?.strongBuy  ?? 0,
      buy:          rt?.buy        ?? 0,
      hold:         rt?.hold       ?? 0,
      sell:         rt?.sell       ?? 0,
      strongSell:   rt?.strongSell ?? 0,
    } : null

    return NextResponse.json({
      stock: {
        symbol:        quote.symbol,
        name:          quote.shortName ?? quote.longName ?? quote.symbol,
        price:         quote.regularMarketPrice         ?? 0,
        change:        quote.regularMarketChange        ?? 0,
        changePercent: quote.regularMarketChangePercent ?? 0,
        marketCap:     quote.marketCap                  ?? null,
        volume:        quote.regularMarketVolume        ?? 0,
        avgVolume:     quote.averageDailyVolume3Month   ?? null,
        beta:          quote.beta                       ?? null,
        week52Low:     quote.fiftyTwoWeekLow            ?? 0,
        week52High:    quote.fiftyTwoWeekHigh           ?? 0,
        pe:            quote.trailingPE                 ?? null,
        quoteType:     quote.quoteType                  ?? 'EQUITY',
        analyst,
      },
    })
  } catch {
    const mock = MOCK_STOCKS.find((s) => s.symbol === upper)
    if (mock) return NextResponse.json({ stock: mock })
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
