import { Chip } from "@mui/material";

interface RegimeBadgeProps {
  regime: string;
}

const RegimeBadge = ({ regime }: RegimeBadgeProps) => {
  // Mapping configuration for cleaner logic
  const config: Record<
    string,
    { color: "error" | "success" | "primary" | "warning"; label: string }
  > = {
    "High Volatility": { color: "error", label: "High Volatility" },
    "Low Volatility": { color: "success", label: "Low Volatility" },
    Bullish: { color: "primary", label: "Bullish" },
    Bearish: { color: "warning", label: "Bearish" },
  };

  // Fallback to primary if the regime doesn't match exactly
  const { color, label } = config[regime] || {
    color: "primary",
    label: regime,
  };

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      sx={{
        fontWeight: "bold",
        minWidth: 100,
        borderRadius: "6px", // Keep your preferred rounded look
      }}
    />
  );
};

export default RegimeBadge;
