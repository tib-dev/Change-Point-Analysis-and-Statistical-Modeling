import { useMemo } from "react";
import { usePrices } from "./usePrices";
import { useRegimes } from "./useRegime";
import type { PriceRecord } from "../utils/calculations";

// Define the enriched shape here
export type EnrichedPriceRecord = PriceRecord & {
  rollingVol?: number | null;
};

export interface MarketSummaryData {
  price_shift: number;
  volatility_change: number;
  count: number;
  event: string;
}

export const useMarketSummary = () => {
  // Cast the data to the enriched type so TS knows rollingVol exists
  const { data, isLoading: pLoading, error: pError } = usePrices();
  const prices = data as EnrichedPriceRecord[] | undefined;

  const { data: regimes, isLoading: rLoading } = useRegimes();

  const summary = useMemo((): MarketSummaryData | null => {
    if (!prices || prices.length < 2) return null;

    const latest = prices[prices.length - 1];
    const prev = prices[prices.length - 2];

    const price_shift = latest.price - prev.price;

    // TypeScript now sees rollingVol because of EnrichedPriceRecord
    const volatility_change = (latest.rollingVol ?? 0) - (prev.rollingVol ?? 0);

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

  return { data: summary, isLoading: pLoading || rLoading, error: pError };
};
