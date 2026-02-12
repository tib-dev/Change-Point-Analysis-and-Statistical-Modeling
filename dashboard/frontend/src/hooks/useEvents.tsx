import { useQuery } from "@tanstack/react-query";
import { useFilters } from "../context/FilterContext";
import { getEvents } from "../features/events/event.service";

export const useEvents = () => {
  const { startDate, endDate } = useFilters();

  return useQuery({
    queryKey: ["events", startDate, endDate],
    queryFn: () =>
      getEvents({
        start: startDate,
        end: endDate,
      }),
    staleTime: 1000 * 60 * 10,
  });
};
