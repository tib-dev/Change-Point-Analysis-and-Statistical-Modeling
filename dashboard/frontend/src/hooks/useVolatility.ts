import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPrices } from "../features/prices/price.service";
import type { PriceRecord } from "../utils/calculations";
import { calculateVolatility } from "../utils/calculations";

export function useVolatility() {
  const {
    data: prices,
    isLoading,
    error,
  } = useQuery<PriceRecord[]>({
    queryKey: ["prices"],
    // Wrap the call to ignore the React Query context object
    queryFn: () => getPrices(),
    staleTime: 1000 * 60 * 5,
  });

  const volatility = useMemo(() => {
    if (!prices || !Array.isArray(prices)) return [];
    return calculateVolatility(prices);
  }, [prices]);

  return { volatility, isLoading, error };
}
