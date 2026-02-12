import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrices } from "../features/prices/price.service";
import { useFilters } from "../context/FilterContext"; // Import context
import type { PriceRecord } from "../features/prices/price.service";

interface UseVolatilityParams {
  start?: string | null;
  end?: string | null;
}

export interface VolatilityRecord {
  date: string;
  log_return: number;
}

// 1. Make the argument optional with = {}
export const useVolatility = (params: UseVolatilityParams = {}) => {
  const { startDate, endDate } = useFilters();

  // 2. Priority: passed params > global context filters
  const start = params.start ?? startDate;
  const end = params.end ?? endDate;

  const {
    data: prices = [],
    isLoading,
    error,
  } = useQuery<PriceRecord[]>({
    queryKey: ["prices-for-volatility", start, end],
    queryFn: () =>
      getPrices({
        start: start ?? undefined,
        end: end ?? undefined,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const windowSize = 30;

  const volatility = useMemo<VolatilityRecord[]>(() => {
    // Window check: need 1 extra price point for returns, plus window size
    if (prices.length <= windowSize) return [];

    const returns = prices
      .slice(1)
      .map((curr, i) => Math.log(curr.price / prices[i].price));

    const result: VolatilityRecord[] = [];

    for (let i = windowSize - 1; i < returns.length; i++) {
      const window = returns.slice(i - windowSize + 1, i + 1);
      const mean = window.reduce((a, b) => a + b, 0) / window.length;
      const variance =
        window.reduce((a, r) => a + Math.pow(r - mean, 2), 0) / window.length;

      result.push({
        date: prices[i + 1].date, // Align volatility to the correct date
        log_return: Math.sqrt(variance),
      });
    }

    return result;
  }, [prices]);

  return { volatility, isLoading, error };
};
