import { useQuery } from "@tanstack/react-query";
import { useFilters } from "../context/FilterContext";
import { getChangePoints } from "../features/changepoints/changepoint.service";

export const useRegimes = () => {
  const { startDate, endDate } = useFilters();

  return useQuery({
    queryKey: ["regimes", startDate, endDate],
    queryFn: () =>
      getChangePoints({
        start: startDate,
        end: endDate,
      }),
    // Map the changepoints to the 'Regime' format expected by RegimeShading
    select: (data) =>
      data.map((cp: any) => ({
        start: cp.start_date,
        end: cp.end_date,
        type: cp.volatility_regime === "high" ? "high" : "low",
      })),
  });
};
