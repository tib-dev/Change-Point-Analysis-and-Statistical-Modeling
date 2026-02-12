import {
  Alert,
  Card,
  CardContent,
  Skeleton,
  Typography,
  Box,
  useTheme,
  debounce,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Brush,
} from "recharts";
import { useFilters } from "../../context/FilterContext";
import { getChangePoints } from "../changepoints/changepoint.service";
import { getEvents } from "../events/event.service";
import { getPrices } from "./price.service";
import { CustomTooltip } from "../../components/charts/CustomTooltip";
import { calculateRollingVolatility } from "../../utils/calculations";

// ... (Your existing toMidnight, calculateRollingVol, and binarySearchClosest helpers)

export default function PriceChart() {
  const theme = useTheme();
  const { startDate, endDate, returnMode, scale, setDateRange } = useFilters();
  const isReturns = returnMode === "returns";
  const [activeX, setActiveX] = useState<number | null>(null);

  const queryParams = { start: startDate, end: endDate };

  /* =============================
      Data Queries
  ============================= */
  const {
    data: prices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prices", startDate, endDate, returnMode],
    queryFn: () => getPrices({ ...queryParams, mode: returnMode }),
    staleTime: 60_000,
  });

  const { data: changepoints = [] } = useQuery({
    queryKey: ["changepoints", startDate, endDate],
    queryFn: () => getChangePoints(queryParams),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events", startDate, endDate],
    queryFn: () => getEvents(queryParams),
  });

  /* =============================
      Data Transformation
  ============================= */
  const chartData = useMemo(() => {
    if (!prices.length) return [];
    const sorted = prices
      .map((d: any) => ({
        date: d.date,
        timestamp: new Date(d.date).getTime(),
        price: d.price,
        returns: d.returns ?? d.log_return ?? null,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const returnsArray = sorted.map((d) => d.returns);
    const rollingVol = calculateRollingVolatility(returnsArray);

    return sorted.map((d, i) => ({
      ...d,
      rollingVol: rollingVol[i],
    }));
  }, [prices]);

  const yDomain = useMemo(() => {
    const key = isReturns ? "returns" : "price";
    const values = chartData.map((d) => d[key]).filter((v) => v != null);
    if (!values.length) return [0, 100];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.1; // 10% padding
    return [min - pad, max + pad];
  }, [chartData, isReturns]);

  /* =============================
      UI Event Handlers
  ============================ */
  const debouncedSetDateRange = useMemo(
    () =>
      debounce((start: string, end: string) => setDateRange(start, end), 400),
    [setDateRange],
  );

  const handleBrushChange = useCallback(
    (state: any) => {
      if (state?.startIndex == null || state?.endIndex == null) return;
      const start = chartData[state.startIndex]?.date;
      const end = chartData[state.endIndex]?.date;
      if (start && end) debouncedSetDateRange(start, end);
    },
    [chartData, debouncedSetDateRange],
  );

  if (isLoading) return <Skeleton />;
  if (error)
    return (
      <Alert severity="error">Market connectivity issue. Please retry.</Alert>
    );

  function binarySearchClosest(
    chartData: { rollingVol: number | null; date: any; timestamp: number; price: any; returns: any; }[],
    targetTimestamp: number
  ) {
    if (!chartData.length) return null;
    let left = 0;
    let right = chartData.length - 1;
    let closestIdx = 0;
    let minDiff = Math.abs(chartData[0].timestamp - targetTimestamp);

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const diff = Math.abs(chartData[mid].timestamp - targetTimestamp);

      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = mid;
      }

      if (chartData[mid].timestamp < targetTimestamp) {
        left = mid + 1;
      } else if (chartData[mid].timestamp > targetTimestamp) {
        right = mid - 1;
      } else {
        // Exact match
        return chartData[mid];
      }
    }

    return chartData[closestIdx];
  }

  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        boxShadow: theme.shadows[4],
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "text.primary", letterSpacing: -0.5 }}
          >
            BRENT CRUDE{" "}
            <Box
              component="span"
              sx={{ color: "text.secondary", fontWeight: 400 }}
            >
              | MARKET ANALYSIS
            </Box>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              bgcolor: "action.hover",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            LIVE FEED: TERMINAL_GS_O
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={chartData}
            onMouseMove={(e) => setActiveX(e?.activeLabel ?? null)}
            onMouseLeave={() => setActiveX(null)}
          >
            <CartesianGrid
              stroke={theme.palette.divider}
              vertical={false}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
              tickFormatter={(unix) =>
                new Date(unix).toLocaleDateString(undefined, {
                  month: "short",
                  year: "2-digit",
                })
              }
            />

            <YAxis
              orientation="right" // Bloomberg style: Price on the right
              scale={scale}
              domain={yDomain}
              tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
              tickFormatter={(v) =>
                isReturns ? `${(v * 100).toFixed(2)}%` : `$${v.toFixed(2)}`
              }
            />

            <Tooltip
              content={<CustomTooltip events={events} isReturns={isReturns} />}
              isAnimationActive={false}
            />

            {/* Event Markers & ChangePoints */}
            {changepoints.map((cp: any) => (
              <ReferenceLine
                key={cp.date}
                x={new Date(cp.date).getTime()}
                stroke={theme.palette.error.main}
                strokeWidth={1}
                label={{
                  position: "top",
                  value: "REGIME SHIFT",
                  fill: theme.palette.error.main,
                  fontSize: 9,
                  fontWeight: 700,
                }}
              />
            ))}

            {events.map((ev: any) => {
              const pt = binarySearchClosest(
                chartData,
                new Date(ev.date).getTime(),
              );
              return (
                pt && (
                  <ReferenceDot
                    key={ev.date}
                    x={pt.timestamp}
                    y={isReturns ? pt.returns : pt.price}
                    r={5}
                    fill="#f59e0b"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )
              );
            })}

            {activeX && (
              <ReferenceLine
                x={activeX}
                stroke={theme.palette.text.secondary}
                strokeDasharray="3 3"
              />
            )}

            {/* Technical Lines */}
            <Line
              type="monotone"
              dataKey={isReturns ? "returns" : "price"}
              stroke={isReturns ? "#10b981" : "#2563eb"}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />

            {isReturns && (
              <Line
                type="monotone"
                dataKey="rollingVol"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
            )}

            <Brush
              dataKey="timestamp"
              height={30}
              stroke={theme.palette.primary.main}
              fill={theme.palette.background.default}
              onChange={handleBrushChange}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
