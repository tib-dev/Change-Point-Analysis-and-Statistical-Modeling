import { useQuery } from "@tanstack/react-query";
import { useFilters } from "../context/FilterContext";
import { getPrices } from "../features/prices/price.service";

export const usePrices = () => {
  const { startDate, endDate, returnMode } = useFilters();

  return useQuery({
    // The queryKey ensures data refetches when these 3 values change
    queryKey: ["prices", startDate, endDate, returnMode],
    queryFn: () =>
      getPrices({
        start: startDate,
        end: endDate,
        mode: returnMode,
      }),
    // Optional: Keep previous data while fetching new data to prevent flickering
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
