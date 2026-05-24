// Deterministic seeded PRNG — same symbol + range always produces the same chart shape
function seededRng(seed: number) {
  let s = seed | 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) | 0
    return (s >>> 0) / 0xffffffff
  }
}

function strSeed(str: string): number {
  return str.split('').reduce((a, c) => (((a << 5) - a) + c.charCodeAt(0)) | 0, 5381)
}

export const RANGE_CONFIG = {
  '5D':  { points: 40,  startOffset: 0.03 },
  '1M':  { points: 22,  startOffset: 0.08 },
  '3M':  { points: 66,  startOffset: 0.18 },
  'YTD': { points: Math.max(5, Math.round((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 * 0.7)), startOffset: 0.22 },
  '1Y':  { points: 252, startOffset: 0.40 },
} as const

export type RangeKey = keyof typeof RANGE_CONFIG
export const ALL_RANGES: RangeKey[] = ['5D', '1M', '3M', 'YTD', '1Y']

export function generateMockPrices(
  symbol: string,
  currentPrice: number,
  beta: number | null,
  rangeKey: RangeKey
): number[] {
  const { points, startOffset } = RANGE_CONFIG[rangeKey]
  const rng = seededRng(strSeed(symbol + rangeKey))
  const vol = (beta ?? 1.0) * 0.014

  let price = currentPrice * (1 + (rng() - 0.5) * startOffset * 2)
  const prices: number[] = []

  for (let i = 0; i < points; i++) {
    const t = i / points
    const meanRev = t > 0.5 ? (currentPrice - price) * 0.18 * ((t - 0.5) / 0.5) : 0
    const noise = (rng() - 0.5) * 2 * vol * price
    price = Math.max(price * 0.4, price + noise + meanRev)
    prices.push(Math.round(price * 100) / 100)
  }

  prices[prices.length - 1] = currentPrice
  return prices
}
