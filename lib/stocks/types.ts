export interface AnalystData {
  targetLow: number | null
  targetHigh: number | null
  targetMean: number | null
  ratingKey: string
  ratingScore: number | null
  analystCount: number
  strongBuy: number
  buy: number
  hold: number
  sell: number
  strongSell: number
}

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number | null
  volume: number
  avgVolume: number | null
  beta: number | null
  week52Low: number
  week52High: number
  pe: number | null
  quoteType: string
  analyst: AnalystData | null
}

export interface WatchlistEntry {
  symbol: string
  name: string
  addedAt: number
  priceWhenAdded: number
}
