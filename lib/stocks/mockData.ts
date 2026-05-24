import type { StockData } from './types'

export const MOCK_STOCKS: StockData[] = [
  // ── Large-Cap Tech ────────────────────────────────────────────────────────
  {
    symbol: 'AAPL', name: 'Apple Inc.', price: 178.42, change: 2.15, changePercent: 1.22,
    marketCap: 2800000000000, volume: 52400000, avgVolume: 58000000, beta: 1.24,
    week52Low: 124.17, week52High: 199.62, pe: 28.5, quoteType: 'EQUITY',
    analyst: { targetLow: 155, targetHigh: 240, targetMean: 207, ratingKey: 'buy', ratingScore: 2.1, analystCount: 38, strongBuy: 18, buy: 12, hold: 7, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: -1.23, changePercent: -0.32,
    marketCap: 2810000000000, volume: 21500000, avgVolume: 25000000, beta: 0.89,
    week52Low: 245.61, week52High: 430.82, pe: 35.2, quoteType: 'EQUITY',
    analyst: { targetLow: 330, targetHigh: 500, targetMean: 420, ratingKey: 'strongBuy', ratingScore: 1.7, analystCount: 45, strongBuy: 32, buy: 10, hold: 3, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'NVDA', name: 'NVIDIA Corporation', price: 484.91, change: 8.42, changePercent: 1.77,
    marketCap: 1200000000000, volume: 45600000, avgVolume: 40000000, beta: 1.68,
    week52Low: 108.13, week52High: 505.48, pe: 62.4, quoteType: 'EQUITY',
    analyst: { targetLow: 400, targetHigh: 700, targetMean: 565, ratingKey: 'strongBuy', ratingScore: 1.4, analystCount: 52, strongBuy: 38, buy: 11, hold: 3, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: 1.05, changePercent: 0.77,
    marketCap: 1730000000000, volume: 24100000, avgVolume: 28000000, beta: 1.03,
    week52Low: 83.45, week52High: 141.52, pe: 24.7, quoteType: 'EQUITY',
    analyst: { targetLow: 125, targetHigh: 175, targetMean: 155, ratingKey: 'buy', ratingScore: 1.9, analystCount: 44, strongBuy: 24, buy: 14, hold: 6, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'META', name: 'Meta Platforms, Inc.', price: 344.47, change: 5.12, changePercent: 1.51,
    marketCap: 885000000000, volume: 18700000, avgVolume: 22000000, beta: 1.22,
    week52Low: 124.25, week52High: 384.33, pe: 22.8, quoteType: 'EQUITY',
    analyst: { targetLow: 250, targetHigh: 440, targetMean: 368, ratingKey: 'buy', ratingScore: 2.0, analystCount: 48, strongBuy: 26, buy: 14, hold: 7, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'TSLA', name: 'Tesla, Inc.', price: 234.86, change: -5.32, changePercent: -2.22,
    marketCap: 745000000000, volume: 98500000, avgVolume: 130000000, beta: 2.04,
    week52Low: 101.81, week52High: 299.29, pe: 72.1, quoteType: 'EQUITY',
    analyst: { targetLow: 85, targetHigh: 380, targetMean: 215, ratingKey: 'hold', ratingScore: 2.9, analystCount: 50, strongBuy: 10, buy: 12, hold: 18, sell: 8, strongSell: 2 },
  },
  {
    symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 178.15, change: 2.34, changePercent: 1.33,
    marketCap: 1840000000000, volume: 38700000, avgVolume: 47000000, beta: 1.16,
    week52Low: 81.43, week52High: 189.51, pe: 84.6, quoteType: 'EQUITY',
    analyst: { targetLow: 150, targetHigh: 240, targetMean: 198, ratingKey: 'strongBuy', ratingScore: 1.5, analystCount: 54, strongBuy: 38, buy: 14, hold: 2, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'AMD', name: 'Advanced Micro Devices', price: 125.42, change: 2.87, changePercent: 2.34,
    marketCap: 202000000000, volume: 55200000, avgVolume: 62000000, beta: 1.77,
    week52Low: 60.76, week52High: 227.30, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 90, targetHigh: 250, targetMean: 162, ratingKey: 'buy', ratingScore: 2.0, analystCount: 41, strongBuy: 20, buy: 13, hold: 8, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'INTC', name: 'Intel Corporation', price: 34.87, change: -0.54, changePercent: -1.52,
    marketCap: 147000000000, volume: 42000000, avgVolume: 48000000, beta: 0.93,
    week52Low: 24.67, week52High: 51.28, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 20, targetHigh: 55, targetMean: 36, ratingKey: 'hold', ratingScore: 2.8, analystCount: 38, strongBuy: 5, buy: 9, hold: 18, sell: 6, strongSell: 0 },
  },
  {
    symbol: 'AVGO', name: 'Broadcom Inc.', price: 876.34, change: 12.45, changePercent: 1.44,
    marketCap: 362000000000, volume: 3800000, avgVolume: 4200000, beta: 1.02,
    week52Low: 415.06, week52High: 906.36, pe: 28.1, quoteType: 'EQUITY',
    analyst: { targetLow: 750, targetHigh: 1100, targetMean: 970, ratingKey: 'buy', ratingScore: 1.8, analystCount: 30, strongBuy: 16, buy: 10, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'ORCL', name: 'Oracle Corporation', price: 121.45, change: 0.87, changePercent: 0.72,
    marketCap: 330000000000, volume: 6200000, avgVolume: 7100000, beta: 0.71,
    week52Low: 60.78, week52High: 127.54, pe: 31.4, quoteType: 'EQUITY',
    analyst: { targetLow: 100, targetHigh: 155, targetMean: 130, ratingKey: 'buy', ratingScore: 2.2, analystCount: 28, strongBuy: 11, buy: 10, hold: 7, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'CRM', name: 'Salesforce, Inc.', price: 215.62, change: 3.14, changePercent: 1.48,
    marketCap: 208000000000, volume: 4900000, avgVolume: 5700000, beta: 1.18,
    week52Low: 127.18, week52High: 222.15, pe: 127.3, quoteType: 'EQUITY',
    analyst: { targetLow: 175, targetHigh: 280, targetMean: 240, ratingKey: 'buy', ratingScore: 2.0, analystCount: 44, strongBuy: 20, buy: 16, hold: 7, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'ADBE', name: 'Adobe Inc.', price: 472.18, change: -2.34, changePercent: -0.49,
    marketCap: 212000000000, volume: 3100000, avgVolume: 3700000, beta: 1.21,
    week52Low: 274.89, week52High: 570.40, pe: 43.2, quoteType: 'EQUITY',
    analyst: { targetLow: 390, targetHigh: 640, targetMean: 540, ratingKey: 'buy', ratingScore: 2.0, analystCount: 35, strongBuy: 16, buy: 13, hold: 6, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'QCOM', name: 'Qualcomm Inc.', price: 127.38, change: 1.92, changePercent: 1.53,
    marketCap: 143000000000, volume: 9800000, avgVolume: 11000000, beta: 1.26,
    week52Low: 100.54, week52High: 160.95, pe: 15.4, quoteType: 'EQUITY',
    analyst: { targetLow: 100, targetHigh: 200, targetMean: 150, ratingKey: 'buy', ratingScore: 2.1, analystCount: 32, strongBuy: 13, buy: 12, hold: 7, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'TXN', name: 'Texas Instruments Inc.', price: 164.52, change: -0.78, changePercent: -0.47,
    marketCap: 150000000000, volume: 4500000, avgVolume: 5200000, beta: 0.98,
    week52Low: 136.67, week52High: 195.02, pe: 22.8, quoteType: 'EQUITY',
    analyst: { targetLow: 130, targetHigh: 200, targetMean: 170, ratingKey: 'hold', ratingScore: 2.6, analystCount: 26, strongBuy: 7, buy: 8, hold: 10, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'MU', name: 'Micron Technology', price: 78.42, change: 2.15, changePercent: 2.82,
    marketCap: 86700000000, volume: 22000000, avgVolume: 25000000, beta: 1.41,
    week52Low: 48.42, week52High: 98.45, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 65, targetHigh: 135, targetMean: 102, ratingKey: 'buy', ratingScore: 1.9, analystCount: 35, strongBuy: 18, buy: 12, hold: 5, sell: 0, strongSell: 0 },
  },

  // ── Finance ───────────────────────────────────────────────────────────────
  {
    symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 194.87, change: -0.42, changePercent: -0.22,
    marketCap: 562000000000, volume: 8900000, avgVolume: 10500000, beta: 1.12,
    week52Low: 135.19, week52High: 200.94, pe: 11.2, quoteType: 'EQUITY',
    analyst: { targetLow: 165, targetHigh: 225, targetMean: 196, ratingKey: 'buy', ratingScore: 2.2, analystCount: 28, strongBuy: 12, buy: 9, hold: 7, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'BAC', name: 'Bank of America Corp.', price: 32.14, change: 0.24, changePercent: 0.75,
    marketCap: 254000000000, volume: 44000000, avgVolume: 52000000, beta: 1.41,
    week52Low: 24.96, week52High: 38.60, pe: 10.8, quoteType: 'EQUITY',
    analyst: { targetLow: 29, targetHigh: 48, targetMean: 38, ratingKey: 'buy', ratingScore: 2.2, analystCount: 26, strongBuy: 10, buy: 9, hold: 7, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'GS', name: 'Goldman Sachs Group Inc.', price: 391.45, change: 2.87, changePercent: 0.74,
    marketCap: 126000000000, volume: 2100000, avgVolume: 2500000, beta: 1.31,
    week52Low: 295.40, week52High: 409.72, pe: 14.2, quoteType: 'EQUITY',
    analyst: { targetLow: 330, targetHigh: 470, targetMean: 418, ratingKey: 'buy', ratingScore: 2.0, analystCount: 22, strongBuy: 10, buy: 8, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'V', name: 'Visa Inc.', price: 245.12, change: 1.08, changePercent: 0.44,
    marketCap: 502000000000, volume: 6500000, avgVolume: 7200000, beta: 0.94,
    week52Low: 194.68, week52High: 252.67, pe: 30.8, quoteType: 'EQUITY',
    analyst: { targetLow: 225, targetHigh: 295, targetMean: 268, ratingKey: 'buy', ratingScore: 1.9, analystCount: 32, strongBuy: 18, buy: 10, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'MA', name: 'Mastercard Inc.', price: 402.34, change: 2.14, changePercent: 0.53,
    marketCap: 379000000000, volume: 2900000, avgVolume: 3400000, beta: 1.07,
    week52Low: 325.68, week52High: 415.40, pe: 36.2, quoteType: 'EQUITY',
    analyst: { targetLow: 370, targetHigh: 490, targetMean: 445, ratingKey: 'strongBuy', ratingScore: 1.7, analystCount: 30, strongBuy: 18, buy: 9, hold: 3, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'MS', name: 'Morgan Stanley', price: 87.92, change: -0.34, changePercent: -0.39,
    marketCap: 143000000000, volume: 7200000, avgVolume: 8900000, beta: 1.35,
    week52Low: 72.05, week52High: 102.14, pe: 14.6, quoteType: 'EQUITY',
    analyst: { targetLow: 82, targetHigh: 120, targetMean: 103, ratingKey: 'buy', ratingScore: 2.1, analystCount: 22, strongBuy: 9, buy: 8, hold: 5, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'AXP', name: 'American Express Co.', price: 174.82, change: 1.42, changePercent: 0.82,
    marketCap: 131000000000, volume: 3200000, avgVolume: 3800000, beta: 1.17,
    week52Low: 131.22, week52High: 186.32, pe: 17.4, quoteType: 'EQUITY',
    analyst: { targetLow: 155, targetHigh: 215, targetMean: 185, ratingKey: 'buy', ratingScore: 2.2, analystCount: 24, strongBuy: 10, buy: 8, hold: 6, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'PYPL', name: 'PayPal Holdings, Inc.', price: 62.47, change: -1.14, changePercent: -1.79,
    marketCap: 68200000000, volume: 12000000, avgVolume: 14500000, beta: 1.56,
    week52Low: 50.25, week52High: 96.63, pe: 17.2, quoteType: 'EQUITY',
    analyst: { targetLow: 55, targetHigh: 115, targetMean: 80, ratingKey: 'hold', ratingScore: 2.7, analystCount: 38, strongBuy: 8, buy: 12, hold: 14, sell: 4, strongSell: 0 },
  },
  {
    symbol: 'SCHW', name: 'Charles Schwab Corp.', price: 74.18, change: 0.92, changePercent: 1.26,
    marketCap: 133000000000, volume: 9400000, avgVolume: 11000000, beta: 1.08,
    week52Low: 45.00, week52High: 82.40, pe: 25.4, quoteType: 'EQUITY',
    analyst: { targetLow: 65, targetHigh: 95, targetMean: 82, ratingKey: 'buy', ratingScore: 2.1, analystCount: 20, strongBuy: 8, buy: 7, hold: 5, sell: 0, strongSell: 0 },
  },

  // ── Healthcare ────────────────────────────────────────────────────────────
  {
    symbol: 'LLY', name: 'Eli Lilly and Company', price: 558.24, change: 9.14, changePercent: 1.66,
    marketCap: 530000000000, volume: 3200000, avgVolume: 3800000, beta: 0.44,
    week52Low: 327.28, week52High: 629.73, pe: 88.4, quoteType: 'EQUITY',
    analyst: { targetLow: 450, targetHigh: 800, targetMean: 645, ratingKey: 'strongBuy', ratingScore: 1.6, analystCount: 28, strongBuy: 18, buy: 8, hold: 2, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 504.32, change: -1.87, changePercent: -0.37,
    marketCap: 464000000000, volume: 2800000, avgVolume: 3100000, beta: 0.59,
    week52Low: 445.68, week52High: 554.48, pe: 22.6, quoteType: 'EQUITY',
    analyst: { targetLow: 490, targetHigh: 620, targetMean: 561, ratingKey: 'buy', ratingScore: 1.9, analystCount: 26, strongBuy: 14, buy: 9, hold: 3, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.38, change: -0.54, changePercent: -0.35,
    marketCap: 368000000000, volume: 7100000, avgVolume: 8200000, beta: 0.54,
    week52Low: 143.13, week52High: 175.97, pe: 11.8, quoteType: 'EQUITY',
    analyst: { targetLow: 150, targetHigh: 190, targetMean: 170, ratingKey: 'buy', ratingScore: 2.3, analystCount: 20, strongBuy: 7, buy: 8, hold: 5, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'ABBV', name: 'AbbVie Inc.', price: 153.47, change: 1.22, changePercent: 0.80,
    marketCap: 271000000000, volume: 6800000, avgVolume: 7900000, beta: 0.65,
    week52Low: 120.37, week52High: 158.41, pe: 36.2, quoteType: 'EQUITY',
    analyst: { targetLow: 135, targetHigh: 185, targetMean: 163, ratingKey: 'buy', ratingScore: 2.1, analystCount: 22, strongBuy: 10, buy: 8, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'PFE', name: 'Pfizer Inc.', price: 27.84, change: -0.32, changePercent: -1.14,
    marketCap: 157000000000, volume: 48000000, avgVolume: 54000000, beta: 0.50,
    week52Low: 25.20, week52High: 42.44, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 24, targetHigh: 42, targetMean: 33, ratingKey: 'hold', ratingScore: 2.8, analystCount: 24, strongBuy: 4, buy: 7, hold: 11, sell: 2, strongSell: 0 },
  },
  {
    symbol: 'MRK', name: 'Merck & Co., Inc.', price: 107.82, change: 0.64, changePercent: 0.60,
    marketCap: 272000000000, volume: 8900000, avgVolume: 10200000, beta: 0.38,
    week52Low: 92.09, week52High: 128.34, pe: 17.4, quoteType: 'EQUITY',
    analyst: { targetLow: 100, targetHigh: 145, targetMean: 125, ratingKey: 'buy', ratingScore: 2.0, analystCount: 22, strongBuy: 11, buy: 7, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'TMO', name: 'Thermo Fisher Scientific', price: 499.15, change: 3.42, changePercent: 0.69,
    marketCap: 193000000000, volume: 1400000, avgVolume: 1700000, beta: 0.78,
    week52Low: 450.82, week52High: 604.27, pe: 32.4, quoteType: 'EQUITY',
    analyst: { targetLow: 500, targetHigh: 680, targetMean: 592, ratingKey: 'buy', ratingScore: 1.8, analystCount: 20, strongBuy: 10, buy: 8, hold: 2, sell: 0, strongSell: 0 },
  },

  // ── Consumer ──────────────────────────────────────────────────────────────
  {
    symbol: 'WMT', name: 'Walmart Inc.', price: 165.42, change: 0.87, changePercent: 0.53,
    marketCap: 446000000000, volume: 6700000, avgVolume: 7800000, beta: 0.52,
    week52Low: 128.53, week52High: 168.44, pe: 30.8, quoteType: 'EQUITY',
    analyst: { targetLow: 150, targetHigh: 195, targetMean: 175, ratingKey: 'buy', ratingScore: 2.0, analystCount: 30, strongBuy: 14, buy: 11, hold: 5, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'COST', name: 'Costco Wholesale Corp.', price: 578.34, change: 4.21, changePercent: 0.73,
    marketCap: 256000000000, volume: 2100000, avgVolume: 2500000, beta: 0.76,
    week52Low: 465.44, week52High: 602.94, pe: 40.2, quoteType: 'EQUITY',
    analyst: { targetLow: 520, targetHigh: 680, targetMean: 612, ratingKey: 'buy', ratingScore: 1.9, analystCount: 28, strongBuy: 14, buy: 10, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'MCD', name: "McDonald's Corporation", price: 291.47, change: -0.84, changePercent: -0.29,
    marketCap: 210000000000, volume: 2300000, avgVolume: 2700000, beta: 0.75,
    week52Low: 245.73, week52High: 302.39, pe: 24.6, quoteType: 'EQUITY',
    analyst: { targetLow: 270, targetHigh: 340, targetMean: 312, ratingKey: 'buy', ratingScore: 2.1, analystCount: 28, strongBuy: 12, buy: 10, hold: 6, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'KO', name: 'The Coca-Cola Company', price: 60.87, change: 0.34, changePercent: 0.56,
    marketCap: 263000000000, volume: 12000000, avgVolume: 14000000, beta: 0.56,
    week52Low: 54.08, week52High: 64.99, pe: 24.2, quoteType: 'EQUITY',
    analyst: { targetLow: 58, targetHigh: 74, targetMean: 66, ratingKey: 'buy', ratingScore: 2.2, analystCount: 22, strongBuy: 9, buy: 8, hold: 5, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'PG', name: 'Procter & Gamble Co.', price: 151.92, change: 0.54, changePercent: 0.36,
    marketCap: 358000000000, volume: 5900000, avgVolume: 6800000, beta: 0.51,
    week52Low: 131.96, week52High: 158.19, pe: 26.4, quoteType: 'EQUITY',
    analyst: { targetLow: 145, targetHigh: 175, targetMean: 162, ratingKey: 'buy', ratingScore: 2.2, analystCount: 20, strongBuy: 8, buy: 8, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'SBUX', name: 'Starbucks Corporation', price: 94.32, change: -1.24, changePercent: -1.30,
    marketCap: 107000000000, volume: 9200000, avgVolume: 10800000, beta: 0.93,
    week52Low: 74.47, week52High: 115.48, pe: 28.4, quoteType: 'EQUITY',
    analyst: { targetLow: 85, targetHigh: 130, targetMean: 108, ratingKey: 'hold', ratingScore: 2.5, analystCount: 28, strongBuy: 8, buy: 9, hold: 10, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'NKE', name: 'Nike, Inc.', price: 102.34, change: -1.45, changePercent: -1.40,
    marketCap: 158000000000, volume: 7200000, avgVolume: 8800000, beta: 0.82,
    week52Low: 82.22, week52High: 131.31, pe: 28.4, quoteType: 'EQUITY',
    analyst: { targetLow: 95, targetHigh: 155, targetMean: 125, ratingKey: 'buy', ratingScore: 2.3, analystCount: 30, strongBuy: 11, buy: 11, hold: 8, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'DIS', name: 'The Walt Disney Company', price: 88.45, change: 0.87, changePercent: 0.99,
    marketCap: 161000000000, volume: 11500000, avgVolume: 13000000, beta: 1.41,
    week52Low: 78.73, week52High: 122.26, pe: 63.2, quoteType: 'EQUITY',
    analyst: { targetLow: 85, targetHigh: 140, targetMean: 110, ratingKey: 'buy', ratingScore: 2.2, analystCount: 26, strongBuy: 10, buy: 10, hold: 5, sell: 1, strongSell: 0 },
  },

  // ── Energy ────────────────────────────────────────────────────────────────
  {
    symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 115.47, change: 1.02, changePercent: 0.89,
    marketCap: 466000000000, volume: 18000000, avgVolume: 20000000, beta: 0.92,
    week52Low: 95.77, week52High: 119.74, pe: 13.8, quoteType: 'EQUITY',
    analyst: { targetLow: 105, targetHigh: 145, targetMean: 126, ratingKey: 'buy', ratingScore: 2.2, analystCount: 24, strongBuy: 9, buy: 9, hold: 6, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'CVX', name: 'Chevron Corporation', price: 155.82, change: -0.64, changePercent: -0.41,
    marketCap: 294000000000, volume: 8700000, avgVolume: 9900000, beta: 0.89,
    week52Low: 139.62, week52High: 189.68, pe: 15.4, quoteType: 'EQUITY',
    analyst: { targetLow: 145, targetHigh: 200, targetMean: 175, ratingKey: 'buy', ratingScore: 2.1, analystCount: 22, strongBuy: 9, buy: 9, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'OXY', name: 'Occidental Petroleum Corp.', price: 62.14, change: 0.84, changePercent: 1.37,
    marketCap: 57000000000, volume: 12000000, avgVolume: 14000000, beta: 1.76,
    week52Low: 55.82, week52High: 73.16, pe: 14.2, quoteType: 'EQUITY',
    analyst: { targetLow: 55, targetHigh: 90, targetMean: 72, ratingKey: 'buy', ratingScore: 2.2, analystCount: 20, strongBuy: 8, buy: 7, hold: 5, sell: 0, strongSell: 0 },
  },

  // ── Industrials ───────────────────────────────────────────────────────────
  {
    symbol: 'CAT', name: 'Caterpillar Inc.', price: 254.87, change: 2.14, changePercent: 0.85,
    marketCap: 131000000000, volume: 2800000, avgVolume: 3200000, beta: 0.99,
    week52Low: 200.21, week52High: 290.50, pe: 16.2, quoteType: 'EQUITY',
    analyst: { targetLow: 225, targetHigh: 320, targetMean: 272, ratingKey: 'buy', ratingScore: 2.2, analystCount: 22, strongBuy: 9, buy: 8, hold: 5, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'BA', name: 'The Boeing Company', price: 201.34, change: -3.12, changePercent: -1.53,
    marketCap: 120000000000, volume: 7400000, avgVolume: 8800000, beta: 1.39,
    week52Low: 159.70, week52High: 267.54, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 170, targetHigh: 280, targetMean: 230, ratingKey: 'hold', ratingScore: 2.5, analystCount: 22, strongBuy: 7, buy: 7, hold: 7, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'GE', name: 'GE Aerospace', price: 131.47, change: 1.24, changePercent: 0.95,
    marketCap: 144000000000, volume: 5400000, avgVolume: 6200000, beta: 1.21,
    week52Low: 84.97, week52High: 135.87, pe: 25.6, quoteType: 'EQUITY',
    analyst: { targetLow: 115, targetHigh: 165, targetMean: 145, ratingKey: 'buy', ratingScore: 1.9, analystCount: 18, strongBuy: 9, buy: 6, hold: 3, sell: 0, strongSell: 0 },
  },

  // ── Streaming / Media ─────────────────────────────────────────────────────
  {
    symbol: 'NFLX', name: 'Netflix, Inc.', price: 468.54, change: 8.92, changePercent: 1.94,
    marketCap: 204000000000, volume: 4100000, avgVolume: 5200000, beta: 1.28,
    week52Low: 211.81, week52High: 485.00, pe: 43.8, quoteType: 'EQUITY',
    analyst: { targetLow: 350, targetHigh: 600, targetMean: 480, ratingKey: 'buy', ratingScore: 2.1, analystCount: 40, strongBuy: 18, buy: 14, hold: 7, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'SPOT', name: 'Spotify Technology S.A.', price: 165.42, change: 4.12, changePercent: 2.55,
    marketCap: 31400000000, volume: 1800000, avgVolume: 2100000, beta: 1.44,
    week52Low: 71.26, week52High: 184.54, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 140, targetHigh: 230, targetMean: 185, ratingKey: 'buy', ratingScore: 2.0, analystCount: 22, strongBuy: 10, buy: 8, hold: 4, sell: 0, strongSell: 0 },
  },

  // ── High-Growth Tech ──────────────────────────────────────────────────────
  {
    symbol: 'PLTR', name: 'Palantir Technologies Inc.', price: 17.42, change: 0.34, changePercent: 1.99,
    marketCap: 36700000000, volume: 52000000, avgVolume: 65000000, beta: 1.94,
    week52Low: 5.92, week52High: 20.24, pe: 158.4, quoteType: 'EQUITY',
    analyst: { targetLow: 8, targetHigh: 25, targetMean: 15, ratingKey: 'hold', ratingScore: 3.1, analystCount: 18, strongBuy: 3, buy: 4, hold: 7, sell: 3, strongSell: 1 },
  },
  {
    symbol: 'CRWD', name: 'CrowdStrike Holdings', price: 182.45, change: 3.21, changePercent: 1.79,
    marketCap: 44200000000, volume: 3200000, avgVolume: 4100000, beta: 1.35,
    week52Low: 93.86, week52High: 213.21, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 160, targetHigh: 280, targetMean: 220, ratingKey: 'buy', ratingScore: 1.8, analystCount: 36, strongBuy: 20, buy: 12, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'NET', name: 'Cloudflare, Inc.', price: 65.14, change: 1.22, changePercent: 1.91,
    marketCap: 21200000000, volume: 8100000, avgVolume: 9500000, beta: 1.62,
    week52Low: 36.27, week52High: 96.07, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 55, targetHigh: 120, targetMean: 82, ratingKey: 'buy', ratingScore: 2.1, analystCount: 28, strongBuy: 12, buy: 11, hold: 5, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'SNOW', name: 'Snowflake Inc.', price: 158.47, change: 2.84, changePercent: 1.82,
    marketCap: 52400000000, volume: 4800000, avgVolume: 5900000, beta: 1.52,
    week52Low: 110.26, week52High: 236.36, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 120, targetHigh: 250, targetMean: 185, ratingKey: 'buy', ratingScore: 2.1, analystCount: 38, strongBuy: 15, buy: 15, hold: 8, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'SHOP', name: 'Shopify Inc.', price: 64.82, change: 1.34, changePercent: 2.11,
    marketCap: 82800000000, volume: 7200000, avgVolume: 8600000, beta: 1.71,
    week52Low: 35.46, week52High: 96.86, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 55, targetHigh: 100, targetMean: 76, ratingKey: 'buy', ratingScore: 2.0, analystCount: 34, strongBuy: 16, buy: 12, hold: 6, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'UBER', name: 'Uber Technologies, Inc.', price: 63.42, change: 1.08, changePercent: 1.73,
    marketCap: 133000000000, volume: 18000000, avgVolume: 21000000, beta: 1.33,
    week52Low: 25.81, week52High: 66.41, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 55, targetHigh: 90, targetMean: 74, ratingKey: 'buy', ratingScore: 1.9, analystCount: 40, strongBuy: 22, buy: 14, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'COIN', name: 'Coinbase Global, Inc.', price: 142.38, change: -4.21, changePercent: -2.87,
    marketCap: 35100000000, volume: 8900000, avgVolume: 12000000, beta: 3.21,
    week52Low: 31.55, week52High: 283.67, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 50, targetHigh: 250, targetMean: 125, ratingKey: 'hold', ratingScore: 2.8, analystCount: 22, strongBuy: 6, buy: 6, hold: 7, sell: 3, strongSell: 0 },
  },
  {
    symbol: 'RBLX', name: 'Roblox Corporation', price: 37.14, change: 0.64, changePercent: 1.75,
    marketCap: 22800000000, volume: 7800000, avgVolume: 9200000, beta: 1.84,
    week52Low: 20.38, week52High: 47.18, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 25, targetHigh: 60, targetMean: 42, ratingKey: 'hold', ratingScore: 2.6, analystCount: 18, strongBuy: 4, buy: 6, hold: 7, sell: 1, strongSell: 0 },
  },
  {
    symbol: 'DKNG', name: 'DraftKings Inc.', price: 34.87, change: 0.94, changePercent: 2.77,
    marketCap: 16200000000, volume: 7400000, avgVolume: 8900000, beta: 1.98,
    week52Low: 13.57, week52High: 35.81, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 28, targetHigh: 52, targetMean: 40, ratingKey: 'buy', ratingScore: 2.0, analystCount: 22, strongBuy: 10, buy: 8, hold: 4, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'SOFI', name: 'SoFi Technologies, Inc.', price: 8.14, change: 0.18, changePercent: 2.26,
    marketCap: 7900000000, volume: 32000000, avgVolume: 38000000, beta: 2.14,
    week52Low: 4.20, week52High: 12.68, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 6, targetHigh: 16, targetMean: 10, ratingKey: 'hold', ratingScore: 2.7, analystCount: 16, strongBuy: 3, buy: 5, hold: 6, sell: 2, strongSell: 0 },
  },
  {
    symbol: 'HOOD', name: 'Robinhood Markets, Inc.', price: 15.87, change: 0.32, changePercent: 2.06,
    marketCap: 13800000000, volume: 12000000, avgVolume: 14500000, beta: 2.42,
    week52Low: 7.68, week52High: 22.80, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 10, targetHigh: 24, targetMean: 16, ratingKey: 'hold', ratingScore: 2.8, analystCount: 14, strongBuy: 2, buy: 4, hold: 6, sell: 2, strongSell: 0 },
  },
  {
    symbol: 'MSTR', name: 'MicroStrategy Inc.', price: 402.14, change: 18.42, changePercent: 4.80,
    marketCap: 29200000000, volume: 3200000, avgVolume: 4800000, beta: 3.54,
    week52Low: 135.82, week52High: 592.00, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 250, targetHigh: 700, targetMean: 480, ratingKey: 'buy', ratingScore: 2.0, analystCount: 8, strongBuy: 4, buy: 2, hold: 2, sell: 0, strongSell: 0 },
  },
  {
    symbol: 'MARA', name: 'Marathon Digital Holdings', price: 19.87, change: 0.94, changePercent: 4.96,
    marketCap: 4200000000, volume: 22000000, avgVolume: 28000000, beta: 4.12,
    week52Low: 3.48, week52High: 32.06, pe: null, quoteType: 'EQUITY',
    analyst: { targetLow: 12, targetHigh: 40, targetMean: 24, ratingKey: 'hold', ratingScore: 2.6, analystCount: 8, strongBuy: 2, buy: 2, hold: 3, sell: 1, strongSell: 0 },
  },

  // ── Broad Market ETFs ─────────────────────────────────────────────────────
  {
    symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 447.12, change: 1.23, changePercent: 0.28,
    marketCap: null, volume: 71200000, avgVolume: 85000000, beta: 1.0,
    week52Low: 362.17, week52High: 459.44, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 378.45, change: 2.14, changePercent: 0.57,
    marketCap: null, volume: 44100000, avgVolume: 52000000, beta: 1.12,
    week52Low: 254.26, week52High: 399.84, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'IWM', name: 'iShares Russell 2000 ETF', price: 194.82, change: 0.92, changePercent: 0.47,
    marketCap: null, volume: 28000000, avgVolume: 33000000, beta: 1.22,
    week52Low: 155.01, week52High: 209.35, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', price: 234.87, change: 0.87, changePercent: 0.37,
    marketCap: null, volume: 4800000, avgVolume: 5600000, beta: 0.99,
    week52Low: 187.55, week52High: 241.97, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 411.52, change: 1.14, changePercent: 0.28,
    marketCap: null, volume: 5900000, avgVolume: 6800000, beta: 1.0,
    week52Low: 330.21, week52High: 422.67, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'DIA', name: 'SPDR Dow Jones Industrial ETF', price: 372.14, change: 0.54, changePercent: 0.15,
    marketCap: null, volume: 4200000, avgVolume: 4900000, beta: 0.88,
    week52Low: 310.42, week52High: 379.63, pe: null, quoteType: 'ETF', analyst: null,
  },

  // ── Income / Factor ETFs ──────────────────────────────────────────────────
  {
    symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', price: 74.32, change: 0.22, changePercent: 0.30,
    marketCap: null, volume: 3900000, avgVolume: 4500000, beta: 0.77,
    week52Low: 62.97, week52High: 78.15, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'JEPI', name: 'JPMorgan Equity Premium Income ETF', price: 55.14, change: 0.08, changePercent: 0.15,
    marketCap: null, volume: 7800000, avgVolume: 9100000, beta: 0.58,
    week52Low: 49.38, week52High: 57.48, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium ETF', price: 51.87, change: 0.34, changePercent: 0.66,
    marketCap: null, volume: 4200000, avgVolume: 5100000, beta: 0.72,
    week52Low: 43.76, week52High: 54.28, pe: null, quoteType: 'ETF', analyst: null,
  },

  // ── Sector ETFs ───────────────────────────────────────────────────────────
  {
    symbol: 'XLK', name: 'Technology Select Sector SPDR', price: 184.52, change: 1.42, changePercent: 0.78,
    marketCap: null, volume: 6800000, avgVolume: 7900000, beta: 1.18,
    week52Low: 122.54, week52High: 196.07, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'XLF', name: 'Financial Select Sector SPDR', price: 38.14, change: 0.12, changePercent: 0.32,
    marketCap: null, volume: 42000000, avgVolume: 49000000, beta: 1.15,
    week52Low: 30.84, week52High: 39.79, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'XLE', name: 'Energy Select Sector SPDR', price: 88.47, change: 0.64, changePercent: 0.73,
    marketCap: null, volume: 18000000, avgVolume: 21000000, beta: 1.01,
    week52Low: 77.15, week52High: 98.27, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'XLV', name: 'Health Care Select Sector SPDR', price: 133.82, change: 0.34, changePercent: 0.25,
    marketCap: null, volume: 7200000, avgVolume: 8400000, beta: 0.62,
    week52Low: 122.83, week52High: 144.02, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'XLI', name: 'Industrial Select Sector SPDR', price: 107.34, change: 0.42, changePercent: 0.39,
    marketCap: null, volume: 9100000, avgVolume: 10500000, beta: 1.05,
    week52Low: 88.89, week52High: 113.28, pe: null, quoteType: 'ETF', analyst: null,
  },

  // ── Thematic / Specialty ETFs ─────────────────────────────────────────────
  {
    symbol: 'ARKK', name: 'ARK Innovation ETF', price: 42.18, change: 1.14, changePercent: 2.78,
    marketCap: null, volume: 22000000, avgVolume: 28000000, beta: 2.31,
    week52Low: 29.03, week52High: 68.34, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'SOXX', name: 'iShares Semiconductor ETF', price: 198.47, change: 2.84, changePercent: 1.45,
    marketCap: null, volume: 2800000, avgVolume: 3300000, beta: 1.58,
    week52Low: 104.93, week52High: 214.43, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'SMH', name: 'VanEck Semiconductor ETF', price: 173.42, change: 2.14, changePercent: 1.25,
    marketCap: null, volume: 5200000, avgVolume: 6100000, beta: 1.62,
    week52Low: 89.42, week52High: 185.82, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'IBB', name: 'iShares Biotechnology ETF', price: 128.47, change: 0.64, changePercent: 0.50,
    marketCap: null, volume: 2100000, avgVolume: 2500000, beta: 0.84,
    week52Low: 108.55, week52High: 140.34, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'GLD', name: 'SPDR Gold Shares', price: 189.42, change: 0.87, changePercent: 0.46,
    marketCap: null, volume: 6400000, avgVolume: 7500000, beta: 0.14,
    week52Low: 158.46, week52High: 198.79, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'SLV', name: 'iShares Silver Trust', price: 22.84, change: 0.34, changePercent: 1.51,
    marketCap: null, volume: 8900000, avgVolume: 10400000, beta: 0.28,
    week52Low: 18.10, week52High: 25.12, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'CIBR', name: 'First Trust Cybersecurity ETF', price: 32.14, change: 0.42, changePercent: 1.32,
    marketCap: null, volume: 1100000, avgVolume: 1300000, beta: 1.12,
    week52Low: 25.68, week52High: 34.42, pe: null, quoteType: 'ETF', analyst: null,
  },

  // ── International ETFs ────────────────────────────────────────────────────
  {
    symbol: 'EFA', name: 'iShares MSCI EAFE ETF', price: 72.14, change: 0.24, changePercent: 0.33,
    marketCap: null, volume: 24000000, avgVolume: 28000000, beta: 0.76,
    week52Low: 61.08, week52High: 77.18, pe: null, quoteType: 'ETF', analyst: null,
  },
  {
    symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', price: 37.84, change: 0.14, changePercent: 0.37,
    marketCap: null, volume: 38000000, avgVolume: 44000000, beta: 0.82,
    week52Low: 33.02, week52High: 42.54, pe: null, quoteType: 'ETF', analyst: null,
  },
]
