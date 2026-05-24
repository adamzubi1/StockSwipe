export const SYMBOL_SECTORS: Record<string, string> = {
  // Technology
  AAPL: 'Technology', MSFT: 'Technology', NVDA: 'Technology', GOOGL: 'Technology',
  META: 'Technology', TSLA: 'Technology', AMZN: 'Technology', AMD: 'Technology',
  INTC: 'Technology', AVGO: 'Technology', ORCL: 'Technology', CRM: 'Technology',
  ADBE: 'Technology', QCOM: 'Technology', TXN: 'Technology', MU: 'Technology',
  // Finance
  JPM: 'Finance', BAC: 'Finance', GS: 'Finance', V: 'Finance', MA: 'Finance',
  MS: 'Finance', AXP: 'Finance', PYPL: 'Finance', SCHW: 'Finance',
  // Healthcare
  LLY: 'Healthcare', UNH: 'Healthcare', JNJ: 'Healthcare', ABBV: 'Healthcare',
  PFE: 'Healthcare', MRK: 'Healthcare', TMO: 'Healthcare',
  // Consumer
  WMT: 'Consumer', COST: 'Consumer', MCD: 'Consumer', KO: 'Consumer',
  PG: 'Consumer', SBUX: 'Consumer', NKE: 'Consumer', DIS: 'Consumer',
  // Energy
  XOM: 'Energy', CVX: 'Energy', OXY: 'Energy',
  // Industrial
  CAT: 'Industrial', BA: 'Industrial', GE: 'Industrial',
  // Media
  NFLX: 'Media', SPOT: 'Media',
  // Growth
  PLTR: 'Growth', CRWD: 'Growth', NET: 'Growth', SNOW: 'Growth',
  SHOP: 'Growth', UBER: 'Growth', COIN: 'Growth', RBLX: 'Growth',
  DKNG: 'Growth', SOFI: 'Growth', HOOD: 'Growth', MSTR: 'Growth', MARA: 'Growth',
  // ETFs — Broad Market
  SPY: 'Broad Market', QQQ: 'Broad Market', IWM: 'Broad Market',
  VTI: 'Broad Market', VOO: 'Broad Market', DIA: 'Broad Market',
  // ETFs — Income
  SCHD: 'Income', JEPI: 'Income', JEPQ: 'Income',
  // ETFs — Sector
  XLK: 'Sector', XLF: 'Sector', XLE: 'Sector', XLV: 'Sector', XLI: 'Sector',
  // ETFs — Thematic
  ARKK: 'Thematic', SOXX: 'Thematic', SMH: 'Thematic', IBB: 'Thematic',
  GLD: 'Thematic', SLV: 'Thematic', CIBR: 'Thematic',
  // ETFs — International
  EFA: 'International', EEM: 'International',
}

export const STOCK_SECTORS = [
  'Technology', 'Finance', 'Healthcare', 'Consumer',
  'Energy', 'Industrial', 'Media', 'Growth',
] as const

export const ETF_CATEGORIES = [
  'Broad Market', 'Income', 'Sector', 'Thematic', 'International',
] as const
