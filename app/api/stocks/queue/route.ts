import { NextResponse } from 'next/server'
import { MOCK_STOCKS } from '@/lib/stocks/mockData'
import type { AnalystData } from '@/lib/stocks/types'

const SYMBOLS = [
  // Large-cap tech
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META', 'TSLA', 'AMZN', 'AMD',
  'INTC', 'AVGO', 'ORCL', 'CRM', 'ADBE', 'QCOM', 'TXN', 'MU',
  // Finance
  'JPM', 'BAC', 'GS', 'V', 'MA', 'MS', 'AXP', 'PYPL', 'SCHW',
  // Healthcare
  'LLY', 'UNH', 'JNJ', 'ABBV', 'PFE', 'MRK', 'TMO',
  // Consumer
  'WMT', 'COST', 'MCD', 'KO', 'PG', 'SBUX', 'NKE', 'DIS',
  // Energy
  'XOM', 'CVX', 'OXY',
  // Industrials
  'CAT', 'BA', 'GE',
  // Streaming / Media
  'NFLX', 'SPOT',
  // High-growth / speculative
  'PLTR', 'CRWD', 'NET', 'SNOW', 'SHOP', 'UBER', 'COIN',
  'RBLX', 'DKNG', 'SOFI', 'HOOD', 'MSTR', 'MARA',
  // Broad market ETFs
  'SPY', 'QQQ', 'IWM', 'VTI', 'VOO', 'DIA',
  // Income / factor ETFs
  'SCHD', 'JEPI', 'JEPQ',
  // Sector ETFs
  'XLK', 'XLF', 'XLE', 'XLV', 'XLI',
  // Thematic ETFs
  'ARKK', 'SOXX', 'SMH', 'IBB', 'GLD', 'SLV', 'CIBR',
  // International ETFs
  'EFA', 'EEM',
]

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'

async function fetchQuotes(symbols: string[]) {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&symbols=${symbols.join(',')}`
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.quoteResponse?.result ?? null
}

async function fetchAnalystData(symbol: string): Promise<AnalystData | null> {
  try {
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=financialData,recommendationTrend`
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    const fd = data.quoteSummary?.result?.[0]?.financialData
    const rt = data.quoteSummary?.result?.[0]?.recommendationTrend?.trend?.[0]
    if (!fd) return null
    return {
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
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const quotes = await fetchQuotes(SYMBOLS)
    if (!quotes || quotes.length === 0) {
      return NextResponse.json({ stocks: MOCK_STOCKS, isMock: true })
    }

    const analystResults = await Promise.all(
      SYMBOLS.map((s) => fetchAnalystData(s))
    )
    const analystMap = Object.fromEntries(SYMBOLS.map((s, i) => [s, analystResults[i]]))

    const stocks = quotes.map((q: Record<string, unknown>) => ({
      symbol: q.symbol,
      name: (q.shortName as string) || (q.longName as string) || q.symbol,
      price: (q.regularMarketPrice as number) ?? 0,
      change: (q.regularMarketChange as number) ?? 0,
      changePercent: (q.regularMarketChangePercent as number) ?? 0,
      marketCap: (q.marketCap as number) ?? null,
      volume: (q.regularMarketVolume as number) ?? 0,
      avgVolume: (q.averageDailyVolume3Month as number) ?? null,
      beta: (q.beta as number) ?? null,
      week52Low: (q.fiftyTwoWeekLow as number) ?? 0,
      week52High: (q.fiftyTwoWeekHigh as number) ?? 0,
      pe: (q.trailingPE as number) ?? null,
      quoteType: (q.quoteType as string) ?? 'EQUITY',
      analyst: analystMap[q.symbol as string] ?? null,
    }))

    return NextResponse.json({ stocks, isMock: false })
  } catch (err) {
    console.error('Queue fetch error:', err)
    return NextResponse.json({ stocks: MOCK_STOCKS, isMock: true })
  }
}
