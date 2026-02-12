import { format, isValid, parse, isAfter, subDays } from "date-fns";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useSearchParams } from "react-router-dom";
import { DATE_FORMAT } from "../utils/constants";
import type { ReactNode } from "react";
export type MetricType = "price" | "volatility";
export type ScaleType = "linear" | "log";
export type ReturnMode = "price" | "returns";

interface FilterContextType {
  startDate: string;
  endDate: string;
  metric: MetricType;
  returnMode: ReturnMode;
  scale: ScaleType;
  setDateRange: (start: string, end: string) => void;
  setMetric: (metric: MetricType) => void;
  setReturnMode: (mode: ReturnMode) => void;
  setScale: (scale: ScaleType) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const DATA_MAX_STR = "2022-09-30";

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialSync = useRef(true);

  // 1. Memoized State Resolution
  const state = useMemo(() => {
    const maxDataDate = parse(DATA_MAX_STR, DATE_FORMAT, new Date());
    const defaultEnd = maxDataDate;
    const defaultStart = subDays(defaultEnd, 365);

    const parseDate = (key: string, fallback: Date) => {
      const val = searchParams.get(key);
      if (!val) return fallback;
      const parsed = parse(val, DATE_FORMAT, new Date());
      return isValid(parsed) ? parsed : fallback;
    };

    let s = parseDate("start", defaultStart);
    const e = parseDate("end", defaultEnd);
    if (isAfter(s, e)) s = subDays(e, 365);

    return {
      startDate: format(s, DATE_FORMAT),
      endDate: format(e, DATE_FORMAT),
      metric: (searchParams.get("metric") as MetricType) || "price",
      returnMode: (searchParams.get("mode") as ReturnMode) || "price",
      scale: (searchParams.get("scale") as ScaleType) || "linear",
    };
  }, [searchParams]);

  // 2. Batch URL Updates (Optimized for Brush performance)
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "undefined") next.delete(key);
            else next.set(key, value);
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const value = useMemo(
    () => ({
      ...state,
      setDateRange: (start: string, end: string) =>
        updateParams({ start, end }),
      setMetric: (metric: MetricType) => updateParams({ metric }),
      setReturnMode: (mode: ReturnMode) => updateParams({ mode }),
      setScale: (scale: ScaleType) => updateParams({ scale }),
      resetFilters: () =>
        updateParams({
          start: format(
            subDays(parse(DATA_MAX_STR, DATE_FORMAT, new Date()), 365),
            DATE_FORMAT,
          ),
          end: DATA_MAX_STR,
          metric: "price",
          mode: "price",
          scale: "linear",
        }),
    }),
    [state, updateParams],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be inside FilterProvider");
  return ctx;
};
