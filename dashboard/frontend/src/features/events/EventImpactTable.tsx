import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const EventImpactTable = ({ impactData }: { impactData: any[] }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: "grey.50" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Event Influence</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Price Impact
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Vol Shift
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {impactData.map((row, i) => {
            const isPos = row.metrics.price_pct_change > 0;
            return (
              <TableRow key={i}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {row.event}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.date}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      color: isPos ? "success.main" : "error.main",
                    }}
                  >
                    {isPos ? (
                      <ArrowUpwardIcon fontSize="inherit" />
                    ) : (
                      <ArrowDownwardIcon fontSize="inherit" />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ ml: 0.5 }}
                    >
                      {(row.metrics.price_pct_change * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {row.metrics.volatility_shift > 0 ? "+" : ""}
                    {row.metrics.volatility_shift.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
