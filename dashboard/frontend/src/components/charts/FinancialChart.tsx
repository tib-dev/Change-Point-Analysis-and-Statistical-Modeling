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
} from "recharts";
import { useMemo, useCallback } from "react";
import { useChartSync } from "./ChartSyncContext";
import { useFilters } from "../../context/FilterContext";
import {
  calculateLogReturns,
  calculateRollingVolatility,
} from "../../utils/calculations";
import { financialTheme } from "./ChartTheme";
import { paddedDomain } from "../../utils/yAisPadding";
import { CustomTooltip } from "./CustomTooltip";
import { RegimeShading } from "./RegimeShading";
import { EventMarkers } from "./EventMarkers";
import { debounce } from "@mui/material";

/* =====================================================
   Types
===================================================== */

interface RawPoint {
  date: string;
  price: number;
}

interface Event {
  date: string;
  title?: string;
  description?: string;
}

interface Regime {
  start: number;
  end: number;
  type: "high" | "low";
}

interface Props {
  rawData: RawPoint[];
  events: Event[];
  regimes: Regime[];
}

/* =====================================================
   Component
===================================================== */

export const FinancialChart = ({ rawData, events, regimes }: Props) => {
  const { activeIndex, setActiveIndex } = useChartSync();
  const { metric, setDateRange } = useFilters();

  const isPrice = metric === "price";
  const isReturns = metric === "returns";

  /* =====================================================
     1. Data Enrichment
  ===================================================== */

  const data = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) return [];

    const sorted = [...rawData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const prices = sorted.map((d) => d.price);
    const returns = calculateLogReturns(prices);
    const rollingVol = calculateRollingVolatility(returns); // correct

    return sorted.map((d, i) => ({
      ...d,
      timestamp: new Date(d.date).getTime(),
      returns: returns[i] ?? null,
      rollingVol: rollingVol[i] ?? null,
    }));
  }, [rawData]);

  /* =====================================================
     2. Memoized Y Domains
  ===================================================== */

  const primaryDomain = useMemo(() => {
    return paddedDomain(data, isPrice ? "price" : "returns");
  }, [data, isPrice]);

  /* =====================================================
     3. Debounced Brush
  ===================================================== */

  const debouncedSetDateRange = useMemo(
    () =>
      debounce((start: string, end: string) => {
        setDateRange(start, end);
      }, 400),
    [setDateRange],
  );

  const handleBrushChange = useCallback(
    (state: any) => {
      if (!state || state.startIndex == null || state.endIndex == null) return;

      const start = data[state.startIndex]?.date;
      const end = data[state.endIndex]?.date;

      if (start && end) {
        debouncedSetDateRange(start, end);
      }
    },
    [data, debouncedSetDateRange],
  );

  if (!data.length) return null;

  /* =====================================================
     4. Render
  ===================================================== */

  return (
    <div
      style={{
        background: financialTheme.background,
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={data}
          onMouseMove={(e) => {
            if (typeof e?.activeTooltipIndex === "number") {
              setActiveIndex(e.activeTooltipIndex);
            } else {
              setActiveIndex(null);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid
            stroke={financialTheme.grid}
            vertical={false}
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(unix) =>
              new Date(unix).toLocaleDateString(undefined, {
                year: "2-digit",
                month: "short",
              })
            }
            stroke={financialTheme.axis}
            tick={{ fontSize: 11 }}
          />

          {/* Primary Axis */}
          <YAxis
            yAxisId="left"
            orientation="left"
            domain={primaryDomain}
            stroke={isPrice ? financialTheme.price : financialTheme.returns}
            tickFormatter={(v) => (isPrice ? `$${v.toFixed(2)}` : v.toFixed(3))}
            tick={{ fontSize: 11 }}
          />

          {/* Volatility Axis */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, "auto"]}
            stroke={financialTheme.volatility}
            tickFormatter={(v) => (v ? `${(v * 100).toFixed(1)}%` : "")}
            tick={{ fontSize: 11 }}
          />

          <Tooltip
            content={<CustomTooltip events={events} isReturns={isReturns} />}
            isAnimationActive={false}
          />

          {/* Crosshair */}
          {activeIndex !== null && data[activeIndex] && (
            <ReferenceLine
              x={data[activeIndex].timestamp}
              stroke="#64748b"
              strokeDasharray="3 3"
            />
          )}

          <RegimeShading regimes={regimes} />
          <EventMarkers events={events} />

          {/* Main Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={isPrice ? "price" : "returns"}
            stroke={isPrice ? financialTheme.price : financialTheme.returns}
            dot={false}
            strokeWidth={2.5}
            isAnimationActive={false}
          />

          {/* Volatility */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rollingVol"
            stroke={financialTheme.volatility}
            dot={false}
            strokeWidth={1.5}
            strokeDasharray="5 5"
            isAnimationActive={false}
          />

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
