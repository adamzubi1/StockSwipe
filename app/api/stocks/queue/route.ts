import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'
import { MOCK_STOCKS } from '@/lib/stocks/mockData'
import type { AnalystData } from '@/lib/stocks/types'

const yf = new YahooFinance()

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

async function fetchAnalystData(symbol: string): Promise<AnalystData | null> {
  try {
    const summary = await yf.quoteSummary(symbol, {
      modules: ['financialData', 'recommendationTrend'],
    })
    const fd = summary.financialData
    const rt = summary.recommendationTrend?.trend?.[0]
    if (!fd) return null
    return {
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
    }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const quotes = await yf.quote(SYMBOLS)
    const quoteArr = Array.isArray(quotes) ? quotes : [quotes]

    if (!quoteArr.length) {
      return NextResponse.json({ stocks: MOCK_STOCKS, isMock: true })
    }

    const analystResults = await Promise.all(SYMBOLS.map(fetchAnalystData))
    const analystMap = Object.fromEntries(SYMBOLS.map((s, i) => [s, analystResults[i]]))

    const stocks = quoteArr.map((q) => ({
      symbol:        q.symbol,
      name:          q.shortName ?? q.longName ?? q.symbol,
      price:         q.regularMarketPrice         ?? 0,
      change:        q.regularMarketChange        ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
      marketCap:     q.marketCap                  ?? null,
      volume:        q.regularMarketVolume        ?? 0,
      avgVolume:     q.averageDailyVolume3Month   ?? null,
      beta:          q.beta                       ?? null,
      week52Low:     q.fiftyTwoWeekLow            ?? 0,
      week52High:    q.fiftyTwoWeekHigh           ?? 0,
      pe:            q.trailingPE                 ?? null,
      quoteType:     q.quoteType                  ?? 'EQUITY',
      analyst:       analystMap[q.symbol]         ?? null,
    }))

    return NextResponse.json({ stocks, isMock: false })
  } catch (err) {
    console.error('Queue fetch error:', err)
    return NextResponse.json({ stocks: MOCK_STOCKS, isMock: true })
  }
}
