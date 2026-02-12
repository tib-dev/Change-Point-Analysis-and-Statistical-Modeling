import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useVolatility } from "../../hooks/useVolatility";
import { useFilters } from "../../context/FilterContext";

const VolatilityChart = () => {
  // 1. Consume filters to identify current metric and ensure sync
  const { metric } = useFilters();
  const { volatility, isLoading, error } = useVolatility();

  // Loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={320}
        gap={2}
      >
        <CircularProgress size={24} color="warning" />
        <Typography color="text.secondary">Analyzing Market Risk...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        height={320}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="error">Failed to load volatility data.</Typography>
      </Box>
    );
  }

  // Empty state (Occurs if date range < 21 days due to rolling window)
  if (!volatility || volatility.length === 0) {
    return (
      <Box
        height={320}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Typography color="text.secondary">
          No volatility data available.
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Ensure your date range is greater than 21 days.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 320,
        mt: 4,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={600}
        gutterBottom
      >
        21-Day Rolling Volatility
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={volatility}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="date"
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            fontSize={11}
            tick={{ fill: "#999" }}
            minTickGap={40}
          />

          <YAxis
            fontSize={11}
            tick={{ fill: "#999" }}
            tickFormatter={(value: number) =>
              Number.isFinite(value) ? value.toFixed(3) : ""
            }
            domain={["auto", "auto"]}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
            }}
            formatter={(value: number | undefined) => {
              if (value === undefined) return ["N/A", "Volatility"];

              // Formats based on the context metric, default to Log Return
              const formattedValue = value.toFixed(5);
              const name =
                metric === "volatility" ? "Volatility" : "Log Return";

              return [formattedValue, name] as [string, string];
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />

          <Line
            type="monotone"
            dataKey="log_return"
            stroke="#F59E0B"
            dot={false}
            strokeWidth={2.5}
            activeDot={{ r: 5, strokeWidth: 0 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VolatilityChart;
