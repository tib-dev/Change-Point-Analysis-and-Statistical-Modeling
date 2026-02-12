import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Stack,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  loading?: boolean;
  trend?: number; // e.g., 2.5 for +2.5%
}

const StatCard = ({ title, value, icon, loading, trend }: StatCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight={600}
              gutterBottom
            >
              {title}
            </Typography>

            {loading ? (
              <Skeleton variant="text" width={80} height={40} />
            ) : (
              <Typography variant="h4" fontWeight={700} sx={{ my: 0.5 }}>
                {value}
              </Typography>
            )}

            {/* Render trend indicator if provided */}
            {!loading && trend !== undefined && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                sx={{ mt: 1 }}
              >
                {trend >= 0 ? (
                  <TrendingUpIcon
                    sx={{ fontSize: 16, color: "success.main" }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{ fontSize: 16, color: "error.main" }}
                  />
                )}
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color={trend >= 0 ? "success.main" : "error.main"}
                >
                  {Math.abs(trend).toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  vs prev. period
                </Typography>
              </Stack>
            )}
          </Box>

          {/* Icon Container */}
          <Box
            sx={{
              bgcolor: "grey.50",
              borderRadius: "12px",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatCard;
