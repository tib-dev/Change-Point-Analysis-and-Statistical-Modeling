import { Grid, Skeleton, Box, Typography, Alert } from "@mui/material";
import StatCard from "../components/ui/StatCard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SpeedIcon from "@mui/icons-material/Speed";
import useMarketSummary from "../hooks/useMarketSummary";

const KPISection = () => {
  // 1. Destructure data with a default empty object to prevent "cannot read property of undefined"
  const { data, isLoading, error } = useMarketSummary();

  // 2. Explicit Error UI
  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <Alert severity="error">
          Failed to load market summary. Please check your API connection.
        </Alert>
      </Box>
    );
  }

  // 3. Helper to ensure we are rendering strings/numbers, never objects
  // This addresses your "Cannot convert object to primitive" error
  const safeValue = (val: any, fallback: string | number = "0") => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === "object") return fallback; // Prevents the crash!
    return val;
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Price Impact Card */}
      <Grid item xs={12} md={4}>
        <StatCard
          title="Latest Price Shift"
          value={
            isLoading ? (
              <Skeleton width="60%" />
            ) : (
              `$${Number(safeValue(data?.price_shift, 0)).toFixed(2)}`
            )
          }
          subtitle={
            isLoading
              ? "Analyzing..."
              : `Ref: ${String(safeValue(data?.event, "N/A"))}`
          }
          icon={
            !isLoading && Number(data?.price_shift ?? 0) >= 0 ? (
              <TrendingUpIcon sx={{ color: "success.main" }} />
            ) : (
              <TrendingDownIcon sx={{ color: "error.main" }} />
            )
          }
          trend={Number(data?.price_shift ?? 0)}
          trendLabel="Impact magnitude"
        />
      </Grid>

      {/* Volatility Change Card */}
      <Grid item xs={12} md={4}>
        <StatCard
          title="Volatility Δ"
          value={
            isLoading ? (
              <Skeleton width="60%" />
            ) : (
              `${Number(safeValue(data?.volatility_change, 0)).toFixed(4)}`
            )
          }
          subtitle="Structural Sigma Change"
          icon={<SpeedIcon color="primary" />}
          trend={Number(data?.volatility_change ?? 0)}
          inverseColor
        />
      </Grid>

      {/* Total Changepoints Card */}
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Shifts"
          value={
            isLoading ? (
              <Skeleton width="40%" />
            ) : (
              String(safeValue(data?.count, 0))
            )
          }
          subtitle="Detected structural breaks"
        />
      </Grid>
    </Grid>
  );
};

export default KPISection;
