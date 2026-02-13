export interface PriceRecord {
  date: string;
  price: number;
  log_return?: number;
  rollingVol?: number | null;
}

/**
 * ENRICHED CALCULATION
 * This wraps both log returns and rolling volatility into the PriceRecord array.
 * This is the primary function you should call in your usePrices or useVolatility hook.
 */
export function enrichPriceData(
  prices: PriceRecord[],
  window = 21,
): PriceRecord[] {
  if (!prices.length) return [];

  // 1. Calculate Log Returns first
  const dataWithReturns = calculateVolatility(prices);

  // 2. Extract numeric returns for the rolling window math
  const returnsArray = dataWithReturns.map((d) => d.log_return ?? 0);

  // 3. Calculate Rolling Volatility
  const volArray = calculateRollingVolatility(returnsArray, window);

  // 4. Merge them back together
  return dataWithReturns.map((record, i) => ({
    ...record,
    rollingVol: volArray[i],
  }));
}

export function calculateVolatility(prices: PriceRecord[]): PriceRecord[] {
  if (!Array.isArray(prices) || prices.length === 0) return [];
  if (prices.length < 2) return prices.map((p) => ({ ...p, log_return: 0 }));

  return prices.map((p, i, arr) => {
    if (i === 0) return { ...p, log_return: 0 };

    const currentPrice = p.price;
    const prevPrice = arr[i - 1].price;

    // Safety check: Log of 0 or negative is undefined
    const logReturn =
      currentPrice > 0 && prevPrice > 0
        ? Math.log(currentPrice / prevPrice)
        : 0;

    return { ...p, log_return: logReturn };
  });
}

/**
 * Helper: Pure numeric log return calculation.
 */
export function calculateLogReturns(prices: number[]): number[] {
  if (prices.length < 2) return new Array(prices.length).fill(0);

  return prices.map((p, i, arr) => {
    if (i === 0) return 0;
    const prev = arr[i - 1];
    return p > 0 && prev > 0 ? Math.log(p / prev) : 0;
  });
}

/**
 * Calculates Rolling Volatility with Annualization.
 * @param logReturns - Array of log returns (decimal)
 * @param window - Lookback period (default 21 days / 1 trading month)
 * @param annualize - Whether to scale by sqrt(252)
 */
export function calculateRollingVolatility(
  logReturns: (number | null)[],
  window = 21,
  annualize = true,
): (number | null)[] {
  const result: (number | null)[] = new Array(logReturns.length).fill(null);
  const TRADING_DAYS = 252; // Market standard for annualization

  // We need at least 'window' number of points to calculate the first value
  for (let i = window - 1; i < logReturns.length; i++) {
    const slice = logReturns.slice(i - window + 1, i + 1);

    // Validate that the window has no null/undefined values
    const validSlice = slice.filter((v): v is number => typeof v === "number");

    if (validSlice.length < window) continue;

    // 1. Calculate Mean (Average Return)
    const mean = validSlice.reduce((a, b) => a + b, 0) / window;

    // 2. Calculate Variance
    const variance =
      validSlice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window;

    // 3. Calculate Standard Deviation (Volatility)
    let vol = Math.sqrt(variance);

    // 4. Annualize (Optional but recommended for professional charts)
    if (annualize) {
      vol = vol * Math.sqrt(TRADING_DAYS);
    }

    result[i] = vol;
  }

  return result;
}
