import React, { useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
  Label,
} from "recharts";
import { debounce } from "@mui/material";
import { useChartSync } from "./ChartSyncContext";
import { useFilters } from "../../context/FilterContext";
import {
  calculateLogReturns,
  calculateRollingVolatility,
} from "../../utils/calculations";
import { CustomTooltip } from "./CustomTooltip";
import { RegimeShading } from "./RegimeShading";
import { EventMarkers } from "./EventMarkers";
import { financialTheme } from "./ChartTheme";
import { paddedDomain } from "../../utils/yAisPadding";
import { ChangepointLabel } from "./ChangepointLabel";

/* =====================================================
   Types & Interfaces
===================================================== */
export interface RawPoint {
  date: string;
  price: number;
}

export interface ChartEvent {
  date: string;
  title?: string;
  description?: string;
  category?: string;
}

export interface Regime {
  start: number;
  end: number;
  type: "high" | "low";
}

interface FinancialChartProps {
  rawData: RawPoint[];
  events: ChartEvent[];
  regimes: Regime[];
  changePoints?: Array<{ date: string; title?: string }>;
}

/* =====================================================
   Component
===================================================== */
export const FinancialChart = ({
  rawData,
  events,
  regimes,
  changePoints = [],
}: FinancialChartProps) => {
  const { activeIndex, setActiveIndex } = useChartSync();
  const { metric, setDateRange } = useFilters();

  const isPrice = String(metric) === "price";
  const isReturns = String(metric) === "returns";

  /* -----------------------------------------------------
     1. Data Transformation
  ----------------------------------------------------- */
  const data = useMemo(() => {
    if (!rawData?.length) return [];

    const sorted = [...rawData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const prices = sorted.map((d) => d.price);
    const returns = calculateLogReturns(prices);
    const rollingVol = calculateRollingVolatility(returns);

    return sorted.map((d, i) => ({
      ...d,
      timestamp: new Date(d.date).getTime(),
      returns: returns[i] ?? null,
      rollingVol: rollingVol[i] ?? null,
    }));
  }, [rawData]);

  /* -----------------------------------------------------
     2. Mapping ChangePoints
  ----------------------------------------------------- */
  const changepointMarkers = useMemo(() => {
    return changePoints.map((cp) => ({
      timestamp: new Date(cp.date).getTime(),
      label: cp.title || "Detected Change Point",
    }));
  }, [changePoints]);

  /* -----------------------------------------------------
     3. Event Anchoring & Domain
  ----------------------------------------------------- */
  const enrichedEvents = useMemo(() => {
    if (!data.length || !events?.length) return [];
    const dataMap = new Map(data.map((d) => [d.timestamp, d]));
    return events
      .map((ev) => {
        const ts = new Date(ev.date).getTime();
        const match = dataMap.get(ts);
        if (!match) return null;
        return {
          ...ev,
          timestamp: ts,
          value: isPrice ? match.price : (match.returns ?? 0),
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [events, data, isPrice]);

  const primaryDomain = useMemo(
    () => paddedDomain(data, isPrice ? "price" : "returns"),
    [data, isPrice],
  );

  const debouncedSetRange = useMemo(
    () =>
      debounce((start: string, end: string) => setDateRange(start, end), 300),
    [setDateRange],
  );

  const handleBrushChange = useCallback(
    (range: any) => {
      if (range?.startIndex !== undefined && range?.endIndex !== undefined) {
        const start = data[range.startIndex]?.date;
        const end = data[range.endIndex]?.date;
        if (start && end) debouncedSetRange(start, end);
      }
    },
    [data, debouncedSetRange],
  );

  if (!data.length) return null;

  return (
    <div
      style={{
        background: financialTheme.background,
        padding: "24px 16px",
        borderRadius: 16,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={data}
          onMouseMove={(e) => {
            // Only update if it's a number, otherwise default to null

            const index =
              typeof e?.activeTooltipIndex === "number"
                ? e.activeTooltipIndex
                : null;

            setActiveIndex(index);
          }}
          onMouseLeave={() => setActiveIndex(null)}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            stroke={financialTheme.grid}
            vertical={false}
            strokeDasharray="3 3"
          />

          {/* Layer 1: Regime Shading */}
          <RegimeShading regimes={regimes} />

          {/* =====================================================
               Layer 2: SOLID RED CHANGE POINT OVERLAY
          ===================================================== */}
          {changepointMarkers.map((cp, idx) => (
            <ReferenceLine
              key={`cp-${idx}`}
              x={cp.timestamp}
              stroke="#d32f2f" // Matches the "Russia-Georgia War" reference
              strokeWidth={2.5}
              // isFront={true}
            >
              <Label
                content={<ChangepointLabel value={cp.label} />}
                position="top"
              />
            </ReferenceLine>
          ))}

          {/* Layer 3: Dynamic Hover Cursor (Subtle/Dashed) */}
          {activeIndex !== null && data[activeIndex] && (
            <ReferenceLine
              x={data[activeIndex].timestamp}
              stroke={financialTheme.axis}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}

          {/* Layer 4: Axes */}
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(u) =>
              new Date(u).toLocaleDateString(undefined, {
                month: "short",
                year: "2-digit",
              })
            }
            stroke={financialTheme.axis}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            yAxisId="left"
            domain={primaryDomain}
            stroke={isPrice ? financialTheme.price : financialTheme.returns}
            tickFormatter={(v) =>
              isPrice ? `$${v.toFixed(0)}` : `${(v * 100).toFixed(1)}%`
            }
            tick={{ fontSize: 11 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={financialTheme.volatility}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 11 }}
          />

          <Tooltip
            content={
              <CustomTooltip events={enrichedEvents} isReturns={isReturns} />
            }
            isAnimationActive={false}
          />

          {/* Layer 5: Data Lines */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={isPrice ? "price" : "returns"}
            stroke={isPrice ? financialTheme.price : financialTheme.returns}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rollingVol"
            stroke={financialTheme.volatility}
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />

          {/* Layer 6: Foreground Markers */}
          <EventMarkers events={enrichedEvents} />

          <Brush
            dataKey="timestamp"
            height={30}
            stroke={financialTheme.axis}
            fill={financialTheme.background}
            onChange={handleBrushChange}
            tickFormatter={() => ""}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
