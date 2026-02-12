import { useMemo } from "react";
import { usePrices } from "./usePrices";
import { useRegimes } from "./useRegime";

const useMarketSummary = () => {
  const { data: prices, isLoading: pLoading, error: pError } = usePrices();
  const { data: regimes, isLoading: rLoading } = useRegimes();

  const summary = useMemo(() => {
    if (!prices || prices.length < 2) return null;

    const latest = prices[prices.length - 1];
    const prev = prices[prices.length - 2];

    // Calculate simple metrics if backend summary isn't available
    const price_shift = latest.price - prev.price;
    const volatility_change = (latest.rollingVol || 0) - (prev.rollingVol || 0);

    return {
      price_shift,
      volatility_change,
      count: regimes?.length || 0,
      event:
        regimes?.[regimes.length - 1]?.type === "high"
          ? "High Volatility Regime"
          : "Stable Regime",
    };
  }, [prices, regimes]);

  return {
    data: summary,
    isLoading: pLoading || rLoading,
    error: pError,
  };
};

export default useMarketSummary;
