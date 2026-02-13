import { Grid, Skeleton, Box, Alert } from "@mui/material";
import StatCard from "../components/ui/StatCard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SpeedIcon from "@mui/icons-material/Speed";
import {
  useMarketSummary,
  type MarketSummaryData,
} from "../hooks/useMarketSummary";

const KPISection = () => {
  const { data, isLoading, error } = useMarketSummary();

  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <Alert severity="error" variant="outlined">
          Failed to load market summary. Please check your API connection.
        </Alert>
      </Box>
    );
  }

  // Value Guard: Handles the "Cannot convert object to primitive" error
  // while maintaining strict typing.
  const getSafeVal = <T extends keyof MarketSummaryData>(
    key: T,
    fallback: MarketSummaryData[T],
  ): MarketSummaryData[T] => {
    if (!data || typeof data[key] === "object") return fallback;
    return data[key] ?? fallback;
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Price Impact Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <StatCard
          title="Latest Price Shift"
          value={
            isLoading ? (
              <Skeleton width="60%" />
            ) : (
              `$${getSafeVal("price_shift", 0).toFixed(2)}`
            )
          }
          subtitle={
            isLoading ? (
              <Skeleton width="40%" />
            ) : (
              `Ref: ${getSafeVal("event", "N/A")}`
            )
          }
          icon={
            isLoading ? (
              <Skeleton variant="circular" width={24} height={24} />
            ) : getSafeVal("price_shift", 0) >= 0 ? (
              <TrendingUpIcon color="success" />
            ) : (
              <TrendingDownIcon color="error" />
            )
          }
          trend={getSafeVal("price_shift", 0)}
          trendLabel="Impact magnitude"
        />
      </Grid>

      {/* Volatility Change Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <StatCard
          title="Volatility Δ"
          value={
            isLoading ? (
              <Skeleton width="60%" />
            ) : (
              `${(getSafeVal("volatility_change", 0) * 100).toFixed(2)}%`
            )
          }
          subtitle="Structural Sigma Change"
          icon={<SpeedIcon color="primary" />}
          trend={getSafeVal("volatility_change", 0)}
          // In finance, increased volatility is often "bad" (red),
          // inverseColor handles this semantic flip.
          inverseColor
        />
      </Grid>

      {/* Total Changepoints Card */}
      <Grid size={{ xs: 12, md: 4 }}>
        <StatCard
          title="Total Shifts"
          value={
            isLoading ? (
              <Skeleton width="40%" />
            ) : (
              String(getSafeVal("count", 0))
            )
          }
          subtitle="Detected structural breaks"
          trend={0} // No trend for count
        />
      </Grid>
    </Grid>
  );
};

export default KPISection;
