import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  alpha,
  useTheme,
  Chip,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import { getChangePoints } from "./changepoint.service";
import { useFilters } from "../../context/FilterContext";
import RegimeBadge from "./RegimeBadge";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";

const ChangePointTable = () => {
  const theme = useTheme();
  const { startDate, endDate, metric } = useFilters();

  const { data = [], isLoading } = useQuery({
    queryKey: ["changepoints", startDate, endDate],
    queryFn: () => getChangePoints({ start: startDate, end: endDate }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingState />;

  if (!data || data.length === 0) {
    return <EmptyState message="No structural regime shifts detected." />;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
          Structural Regime Breaks
        </Typography>
        <Chip
          label={`${data.length} Transitions Detected`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderRadius: 1.5 }}
        />
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>
              Market Context & Category
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Regime State</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">
              {metric === "price" ? "Mean Shift (Δμ)" : "Volatility Shift (Δσ)"}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((cp, i) => {
            const volIncreased = cp.sigma_post_change > cp.sigma_pre_change;
            const muDiff = cp.mu_post_change - cp.mu_pre_change;
            const isPositiveShift = muDiff >= 0;

            // Visualizing the magnitude of the shift
            // If metric is price, we show the delta. If vol, we show the step change.
            const magnitude =
              metric === "price"
                ? muDiff
                : cp.sigma_post_change - cp.sigma_pre_change;

            return (
              <TableRow
                key={`${cp.date}-${i}`}
                hover
                sx={{
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {new Date(cp.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Day Index: {i + 1}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {cp.associated_event || "Organic Market Shift"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                      <Chip
                        label={cp.event_category}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          bgcolor: alpha(theme.palette.divider, 0.5),
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <RegimeBadge
                    regime={volIncreased ? "High Volatility" : "Low Volatility"}
                  />
                </TableCell>

                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {metric === "price" ? (
                        <>
                          {isPositiveShift ? (
                            <TrendingUpIcon
                              sx={{ fontSize: 18, color: "success.main" }}
                            />
                          ) : (
                            <TrendingDownIcon
                              sx={{ fontSize: 18, color: "error.main" }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            fontWeight={800}
                            color={
                              isPositiveShift ? "success.main" : "error.main"
                            }
                          >
                            {isPositiveShift ? "+" : ""}
                            {(muDiff * 100).toFixed(2)}%
                          </Typography>
                        </>
                      ) : (
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="body2"
                            fontWeight={800}
                            color={volIncreased ? "warning.main" : "info.main"}
                          >
                            {(cp.sigma_post_change * 100).toFixed(2)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            from {(cp.sigma_pre_change * 100).toFixed(2)}%
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ChangePointTable;
