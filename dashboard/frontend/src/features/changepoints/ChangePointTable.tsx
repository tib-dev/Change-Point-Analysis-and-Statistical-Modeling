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
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import { getChangePoints, type ChangePoint } from "./changepoint.service";
import { useFilters } from "../../context/FilterContext";
import RegimeBadge from "./RegimeBadge";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";

const ChangePointTable = () => {
  const { startDate, endDate, metric } = useFilters();

  /* ============================
     1. Data Fetching (Synced with Charts)
  ============================ */
  const { data = [], isLoading } = useQuery({
    queryKey: ["changepoints", startDate, endDate],
    queryFn: () => getChangePoints({ start: startDate, end: endDate }),
    // Prevents the 416 error from triggering infinite retries
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /* ============================
     2. Render States
  ============================ */
  if (isLoading) return <LoadingState />;

  if (!data || data.length === 0) {
    return (
      <EmptyState message="No structural regime shifts detected for the selected period." />
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Table size="small" aria-label="regime shift table">
        <TableHead>
          <TableRow sx={{ bgcolor: "action.hover" }}>
            <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Market Context</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Volatility Regime</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">
              {metric === "price" ? "Return Shift (μ)" : "Risk Shift (σ)"}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((cp, i) => {
            // Logic for Volatility Shift
            const volIncreased = cp.sigma_post_change > cp.sigma_pre_change;
            const regimeLabel = volIncreased
              ? "High Volatility"
              : "Low Volatility";

            // Logic for Mean Return Shift
            const muDiff = cp.mu_post_change - cp.mu_pre_change;
            const isPositiveShift = muDiff >= 0;

            return (
              <TableRow
                key={`${cp.date}-${i}`}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* Date Column */}
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(cp.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </TableCell>

                {/* Event/Category Column */}
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="text.primary"
                    >
                      {cp.associated_event}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      {cp.event_category}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Regime Badge Column */}
                <TableCell>
                  <RegimeBadge regime={regimeLabel} />
                </TableCell>

                {/* Shift Value Column */}
                <TableCell align="right">
                  <Tooltip
                    title={
                      metric === "price"
                        ? "Change in average daily log-return"
                        : "Change in standard deviation"
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      {metric === "price" ? (
                        <>
                          {isPositiveShift ? (
                            <TrendingUpIcon fontSize="small" color="success" />
                          ) : (
                            <TrendingDownIcon fontSize="small" color="error" />
                          )}
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color={
                              isPositiveShift ? "success.main" : "error.main"
                            }
                          >
                            {isPositiveShift ? "+" : ""}
                            {muDiff.toFixed(4)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" fontWeight={700}>
                          {cp.sigma_post_change.toFixed(3)}
                        </Typography>
                      )}
                    </Box>
                  </Tooltip>
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
