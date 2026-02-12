export const calculateLogReturns = (prices: number[]) =>
  prices.map((p, i) => (i === 0 ? 0 : Math.log(p / prices[i - 1])));

export const calculateRollingVolatility = (prices: number[], window = 20) => {
  const returns = calculateLogReturns(prices);

  return returns.map((_, i) => {
    if (i < window) return null;

    const slice = returns.slice(i - window, i);
    const mean = slice.reduce((a, b) => a + b, 0) / window;

    const variance =
      slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window;

    return Math.sqrt(variance * 252);
  });
};
