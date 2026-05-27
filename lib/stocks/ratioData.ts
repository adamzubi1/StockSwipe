export interface RatioMetric {
  label: string
  description: string   // one-liner shown under the value
  detail: string        // full plain-English explanation
  higherIsBetter: boolean | null  // null = context-dependent
  sectorAverages?: Record<string, number>
  format: (v: number) => string
}

export const RATIO_METRICS: Record<string, RatioMetric> = {
  beta: {
    label: 'Volatility (Beta)',
    description: 'How much the stock moves relative to the market.',
    detail:
      'Beta compares a stock\'s price swings to the overall market (S&P 500 = 1.0). ' +
      'A beta of 1.5 means the stock historically moves 50% more than the market — up or down. ' +
      'A beta of 0.5 means it moves roughly half as much. ' +
      'High beta = higher potential returns AND higher potential losses. ' +
      'Low beta = more stable, but less explosive upside. ' +
      'Negative beta (rare) means the stock tends to move opposite the market.',
    higherIsBetter: null,
    sectorAverages: {
      Technology: 1.20, Finance: 1.02, Healthcare: 0.72, Consumer: 0.62,
      Energy: 1.10, Industrial: 1.08, Media: 1.30, Growth: 1.75,
      'Broad Market': 1.00, Income: 0.72, Sector: 1.05, Thematic: 1.22, International: 0.90,
    },
    format: (v) => v.toFixed(2),
  },
  pe: {
    label: 'P/E Ratio',
    description: 'Price divided by annual earnings — what you pay per $1 of profit.',
    detail:
      'The Price-to-Earnings ratio tells you how many dollars investors pay for each dollar of annual earnings. ' +
      'A P/E of 20 means you\'re paying $20 for every $1 the company earns. ' +
      'Higher P/E usually signals investors expect strong future growth — they\'re paying a premium for it. ' +
      'Lower P/E can mean the stock is cheap relative to earnings, or that growth is slow. ' +
      'Always compare P/E within the same industry — tech companies naturally trade at higher P/Es than banks.',
    higherIsBetter: false,
    sectorAverages: {
      Technology: 28.5, Finance: 13.8, Healthcare: 22.4, Consumer: 24.6,
      Energy: 11.5, Industrial: 20.2, Media: 34.5, Growth: 52.0,
      'Broad Market': 22.0, Income: 18.5, Sector: 19.5, Thematic: 28.0, International: 14.5,
    },
    format: (v) => v.toFixed(1) + 'x',
  },
  marketCap: {
    label: 'Market Capitalization',
    description: 'Total market value of all outstanding shares.',
    detail:
      'Market cap = share price × total shares outstanding. It\'s the simplest measure of a company\'s size. ' +
      'Mega cap (>$200B): The largest, most liquid companies. Usually most stable. ' +
      'Large cap ($10B–$200B): Established companies, often in major indices like the S&P 500. ' +
      'Mid cap ($2B–$10B): Balance of stability and growth potential, often overlooked by Wall Street. ' +
      'Small cap (<$2B): Higher growth potential but more volatile and less liquid. ' +
      'Larger isn\'t always better — some of the best returns come from mid and small caps.',
    higherIsBetter: null,
    format: (v) =>
      v >= 1e12 ? `$${(v / 1e12).toFixed(1)}T`
      : v >= 1e9  ? `$${(v / 1e9).toFixed(0)}B`
      : `$${(v / 1e6).toFixed(0)}M`,
  },
  avgVolume: {
    label: 'Average Daily Volume',
    description: '3-month average shares traded per day — a measure of liquidity.',
    detail:
      'Volume tells you how actively a stock is traded. ' +
      'High volume (>10M/day) means the stock is highly liquid — you can buy or sell large amounts without moving the price much. ' +
      'Low volume (<500K/day) means less liquidity — wider bid-ask spreads and harder to exit large positions quickly. ' +
      'Volume also signals interest: a price move on high volume is more meaningful than the same move on low volume. ' +
      'Unusually high volume often precedes or accompanies major news.',
    higherIsBetter: true,
    format: (v) =>
      v >= 1e9 ? `${(v / 1e9).toFixed(1)}B`
      : v >= 1e6 ? `${(v / 1e6).toFixed(1)}M`
      : `${(v / 1e3).toFixed(0)}K`,
  },
  week52: {
    label: '52-Week Range Position',
    description: 'Where the current price sits within its yearly high-low range.',
    detail:
      'This shows where today\'s price sits between the stock\'s 52-week low and high. ' +
      'Near the high (>80%): Strong momentum, but limited near-term upside and susceptible to a pullback. ' +
      'Mid-range (40–60%): Balanced — not extended in either direction. ' +
      'Near the low (<20%): May be a buying opportunity if the business is sound, or a value trap if there\'s a real problem. ' +
      'Always ask why the stock is near its high or low before drawing conclusions.',
    higherIsBetter: null,
    format: (v) => `${v.toFixed(0)}% of range`,
  },
  analystTarget: {
    label: 'Analyst Price Target',
    description: 'Consensus 12-month price target from Wall Street analysts.',
    detail:
      'Analyst price targets represent the average price Wall Street analysts expect the stock to reach within 12 months. ' +
      'Positive implied upside (target > current price) means analysts collectively expect gains. ' +
      'The mean target is useful, but also look at the range — a wide spread between the low and high target signals high uncertainty. ' +
      'Analyst targets tend to lag reality: they\'re revised slowly and can be anchored to old prices. ' +
      'Use targets as one data point, not gospel.',
    higherIsBetter: true,
    format: (v) => `$${v.toFixed(2)}`,
  },
  analystConsensus: {
    label: 'Analyst Consensus Rating',
    description: 'Aggregated buy/hold/sell recommendations from professional analysts.',
    detail:
      'The consensus rating aggregates recommendations from all covering analysts into a single score (1 = Strong Buy, 5 = Strong Sell). ' +
      'Strong Buy / Buy: Majority expect the stock to outperform the market over the next 12 months. ' +
      'Hold: Analysts expect the stock to perform roughly in line with the market. ' +
      'Underperform / Sell: Analysts expect it to lag or decline. ' +
      'Important caveat: most analysts work for banks that have investment banking relationships — ratings tend to skew positive. ' +
      'A "Hold" from Wall Street is often what they really mean by "we\'d rather not say Sell."',
    higherIsBetter: null,
    format: (v) => v.toFixed(1),
  },
}

// ── Peer comparison tables ─────────────────────────────────────────────────

export interface PeerComp {
  symbol: string
  name: string
  pe: number | null
  beta: number | null
  marketCap: string
}

export const SECTOR_PEERS: Record<string, PeerComp[]> = {
  Technology: [
    { symbol: 'AAPL',  name: 'Apple',      pe: 29.2, beta: 1.24, marketCap: '$3.1T' },
    { symbol: 'MSFT',  name: 'Microsoft',  pe: 35.8, beta: 0.90, marketCap: '$2.9T' },
    { symbol: 'NVDA',  name: 'NVIDIA',     pe: 44.5, beta: 1.66, marketCap: '$2.3T' },
    { symbol: 'GOOGL', name: 'Alphabet',   pe: 22.7, beta: 1.04, marketCap: '$2.0T' },
    { symbol: 'META',  name: 'Meta',       pe: 25.8, beta: 1.22, marketCap: '$1.4T' },
    { symbol: 'AMD',   name: 'AMD',        pe: 38.0, beta: 1.72, marketCap: '$245B' },
    { symbol: 'AVGO',  name: 'Broadcom',   pe: 33.5, beta: 1.08, marketCap: '$770B' },
  ],
  Finance: [
    { symbol: 'JPM',  name: 'JPMorgan',        pe: 13.2, beta: 1.12, marketCap: '$680B' },
    { symbol: 'BAC',  name: 'Bank of America', pe: 13.8, beta: 1.30, marketCap: '$310B' },
    { symbol: 'GS',   name: 'Goldman Sachs',   pe: 14.1, beta: 1.38, marketCap: '$185B' },
    { symbol: 'V',    name: 'Visa',            pe: 30.4, beta: 0.92, marketCap: '$560B' },
    { symbol: 'MA',   name: 'Mastercard',      pe: 32.1, beta: 1.02, marketCap: '$440B' },
    { symbol: 'MS',   name: 'Morgan Stanley',  pe: 16.5, beta: 1.45, marketCap: '$155B' },
  ],
  Healthcare: [
    { symbol: 'LLY',  name: 'Eli Lilly',    pe: 60.2, beta: 0.41, marketCap: '$700B' },
    { symbol: 'UNH',  name: 'UnitedHealth', pe: 20.5, beta: 0.55, marketCap: '$470B' },
    { symbol: 'JNJ',  name: 'J&J',          pe: 15.8, beta: 0.55, marketCap: '$390B' },
    { symbol: 'ABBV', name: 'AbbVie',       pe: 18.4, beta: 0.78, marketCap: '$310B' },
    { symbol: 'MRK',  name: 'Merck',        pe: 14.5, beta: 0.72, marketCap: '$260B' },
    { symbol: 'PFE',  name: 'Pfizer',       pe: 11.5, beta: 0.68, marketCap: '$160B' },
  ],
  Consumer: [
    { symbol: 'WMT',  name: 'Walmart',     pe: 35.2, beta: 0.50, marketCap: '$770B' },
    { symbol: 'COST', name: 'Costco',      pe: 52.8, beta: 0.77, marketCap: '$390B' },
    { symbol: 'MCD',  name: "McDonald's",  pe: 24.3, beta: 0.72, marketCap: '$215B' },
    { symbol: 'KO',   name: 'Coca-Cola',   pe: 22.7, beta: 0.55, marketCap: '$265B' },
    { symbol: 'PG',   name: 'P&G',         pe: 26.4, beta: 0.49, marketCap: '$390B' },
    { symbol: 'NKE',  name: 'Nike',        pe: 22.0, beta: 0.98, marketCap: '$115B' },
  ],
  Energy: [
    { symbol: 'XOM', name: 'ExxonMobil',  pe: 14.2, beta: 1.03, marketCap: '$480B' },
    { symbol: 'CVX', name: 'Chevron',     pe: 13.8, beta: 1.06, marketCap: '$270B' },
    { symbol: 'OXY', name: 'Occidental',  pe: 11.5, beta: 1.42, marketCap: '$49B'  },
  ],
  Industrial: [
    { symbol: 'CAT', name: 'Caterpillar',  pe: 17.2, beta: 1.05, marketCap: '$180B' },
    { symbol: 'BA',  name: 'Boeing',       pe: null,  beta: 1.38, marketCap: '$120B' },
    { symbol: 'GE',  name: 'GE Aerospace', pe: 35.8, beta: 1.18, marketCap: '$210B' },
  ],
  Media: [
    { symbol: 'NFLX', name: 'Netflix', pe: 42.3, beta: 1.38, marketCap: '$330B' },
    { symbol: 'SPOT', name: 'Spotify', pe: null,  beta: 1.52, marketCap: '$72B'  },
    { symbol: 'DIS',  name: 'Disney',  pe: 28.5, beta: 1.04, marketCap: '$175B' },
  ],
  Growth: [
    { symbol: 'PLTR', name: 'Palantir',   pe: 180.0, beta: 2.42, marketCap: '$250B' },
    { symbol: 'CRWD', name: 'CrowdStrike', pe: 92.0, beta: 1.15, marketCap: '$95B'  },
    { symbol: 'SNOW', name: 'Snowflake',  pe: null,   beta: 1.22, marketCap: '$43B'  },
    { symbol: 'SHOP', name: 'Shopify',    pe: 75.0,   beta: 1.68, marketCap: '$115B' },
    { symbol: 'UBER', name: 'Uber',       pe: 55.0,   beta: 1.52, marketCap: '$165B' },
    { symbol: 'COIN', name: 'Coinbase',   pe: null,   beta: 3.12, marketCap: '$55B'  },
  ],
  'Broad Market': [
    { symbol: 'SPY', name: 'S&P 500',        pe: 22.0, beta: 1.00, marketCap: '$540B' },
    { symbol: 'QQQ', name: 'Nasdaq 100',     pe: 27.5, beta: 1.18, marketCap: '$290B' },
    { symbol: 'VTI', name: 'Total Market',   pe: 21.8, beta: 1.00, marketCap: '$460B' },
    { symbol: 'IWM', name: 'Russell 2000',   pe: 18.5, beta: 1.20, marketCap: '$73B'  },
    { symbol: 'DIA', name: 'Dow Jones',      pe: 20.5, beta: 0.95, marketCap: '$32B'  },
  ],
  Income: [
    { symbol: 'SCHD', name: 'Schwab Dividend', pe: 16.5, beta: 0.68, marketCap: '$58B' },
    { symbol: 'JEPI', name: 'JPM Equity Prem', pe: null,  beta: 0.55, marketCap: '$35B' },
    { symbol: 'JEPQ', name: 'JPM Nasdaq Prem', pe: null,  beta: 0.72, marketCap: '$18B' },
  ],
  Thematic: [
    { symbol: 'SOXX', name: 'iShares Semis',    pe: 28.0, beta: 1.45, marketCap: '$12B' },
    { symbol: 'SMH',  name: 'VanEck Semis',     pe: 27.0, beta: 1.42, marketCap: '$22B' },
    { symbol: 'ARKK', name: 'ARK Innovation',   pe: null,  beta: 1.88, marketCap: '$7B'  },
    { symbol: 'GLD',  name: 'SPDR Gold',        pe: null,  beta: 0.12, marketCap: '$75B' },
    { symbol: 'CIBR', name: 'Cybersecurity ETF', pe: 32.0, beta: 1.18, marketCap: '$6B' },
  ],
  Sector: [
    { symbol: 'XLK', name: 'Tech Sector',      pe: 27.0, beta: 1.18, marketCap: '$65B' },
    { symbol: 'XLF', name: 'Finance Sector',   pe: 14.5, beta: 1.08, marketCap: '$42B' },
    { symbol: 'XLV', name: 'Healthcare Sector', pe: 20.0, beta: 0.72, marketCap: '$38B' },
    { symbol: 'XLE', name: 'Energy Sector',    pe: 12.0, beta: 1.05, marketCap: '$28B' },
    { symbol: 'XLI', name: 'Industrial Sector', pe: 20.5, beta: 1.10, marketCap: '$22B' },
  ],
  International: [
    { symbol: 'EFA', name: 'iShares Dev Markets', pe: 14.5, beta: 0.88, marketCap: '$52B' },
    { symbol: 'EEM', name: 'iShares Emerging',    pe: 12.8, beta: 1.10, marketCap: '$25B' },
  ],
}
