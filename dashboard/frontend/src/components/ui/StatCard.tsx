import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import React from "react";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  inverseColor?: boolean;
  loading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  loading = false,
  trend,
  subtitle,
  trendLabel = "vs prev. period",
  inverseColor = false,
}: StatCardProps) => {
  const theme = useTheme();

  /**
   * 1. Safe Color Logic
   * We extract both the hex code and the palette key to ensure alpha()
   * never receives an undefined object.
   */
  const trendConfig = React.useMemo(() => {
    const isPositive = (trend ?? 0) >= 0;

    // Neutral state
    if (trend === undefined || trend === 0) {
      return {
        mainColor: theme.palette.text.secondary,
        bgColor: theme.palette.grey[200],
        isPositive: true,
      };
    }

    // Semantic logic: Is this "Good" or "Bad"?
    // For Volatility (inverseColor=true): Up is Bad (Error), Down is Good (Success)
    const isGood = inverseColor ? !isPositive : isPositive;
    const status = isGood ? "success" : "error";

    return {
      mainColor: theme.palette[status].main,
      bgColor: alpha(theme.palette[status].main, 0.1),
      isPositive,
    };
  }, [trend, inverseColor, theme.palette]);

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        border: `1px solid ${theme.palette.divider}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                letterSpacing: 1.2,
                display: "block",
              }}
            >
              {title}
            </Typography>

            {loading ? (
              <Skeleton
                variant="text"
                width="90%"
                height={48}
                sx={{ my: 0.5 }}
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  my: 0.5,
                  letterSpacing: -0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </Typography>
            )}

            <Box sx={{ minHeight: 20, mb: 1.5 }}>
              {loading ? (
                <Skeleton width="50%" />
              ) : (
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            {!loading && trend !== undefined && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: trendConfig.bgColor,
                    borderRadius: 1.5,
                    px: 1,
                    py: 0.25,
                  }}
                >
                  {trendConfig.isPositive ? (
                    <TrendingUpIcon
                      sx={{ fontSize: 16, color: trendConfig.mainColor }}
                    />
                  ) : (
                    <TrendingDownIcon
                      sx={{ fontSize: 16, color: trendConfig.mainColor }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: trendConfig.mainColor,
                      ml: 0.5,
                    }}
                  >
                    {Math.abs(trend).toFixed(1)}%
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", fontWeight: 500 }}
                >
                  {trendLabel}
                </Typography>
              </Stack>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {loading ? (
              <Skeleton variant="circular" width={28} height={28} />
            ) : (
              icon
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatCard;
