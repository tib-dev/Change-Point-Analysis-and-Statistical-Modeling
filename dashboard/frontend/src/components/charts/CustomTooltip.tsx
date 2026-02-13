import { Box, Typography, Divider } from "@mui/material";
import type { ChartEvent } from "./EventMarkers";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number; // Unix timestamp
  events: ChartEvent[];
  isReturns: boolean;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  events,
  isReturns,
}: TooltipProps) => {
  if (!active || !payload?.length || typeof label !== "number") return null;

  // Precise date matching for intel section
  const dateStr = new Date(label).toISOString().split("T")[0];
  const event = events.find((e) => e.date === dateStr);

  return (
    <Box
      sx={{
        bgcolor: "#0a0c10",
        color: "#ffffff",
        p: 2,
        border: "1px solid #30363d",
        borderRadius: 1,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        minWidth: 240,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "grey.500",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {new Date(label).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })}
      </Typography>

      <Divider sx={{ my: 1, borderColor: "#30363d" }} />

      {payload.map((entry, index) => {
        const isVol = entry.dataKey === "rollingVol";
        return (
          <Box
            key={index}
            sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
          >
            <Typography
              variant="body2"
              sx={{ color: entry.color, fontWeight: 600, mr: 2 }}
            >
              {isVol ? "VOLATILITY" : isReturns ? "LOG RETURN" : "BRENT PRICE"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", fontWeight: 700 }}
            >
              {isVol
                ? `${(entry.value * 100).toFixed(2)}%`
                : isReturns
                  ? `${(entry.value * 100).toFixed(4)}%`
                  : `$${entry.value.toFixed(2)}`}
            </Typography>
          </Box>
        );
      })}

      {event && (
        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: "2px solid #f59e0b",
            bgcolor: "rgba(245, 158, 11, 0.05)",
            mx: -2,
            px: 2,
            pb: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#f59e0b",
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            ● INTEL: {event.category?.toUpperCase() || "MARKET EVENT"}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.5 }}
          >
            {event.title}
          </Typography>
          {event.description && (
            <Typography
              variant="body2"
              sx={{
                color: "grey.400",
                mt: 0.5,
                fontSize: "0.75rem",
                fontStyle: "italic",
              }}
            >
              {event.description}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
