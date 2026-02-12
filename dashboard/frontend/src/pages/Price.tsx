import {
  Box,
  Container,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PriceChart from "../features/prices/PriceChart";
import { useFilters } from "../context/FilterContext"; // A new component for KPIs
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EqualizerIcon from "@mui/icons-material/Equalizer";

const PricePage = () => {
  const { metric, setMetric, startDate, endDate } = useFilters();

  const handleMetricChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMetric: "price" | "volatility" | null,
  ) => {
    if (newMetric !== null) {
      setMetric(newMetric);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 1. Header & Controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Market Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitoring Brent Oil from <strong>{startDate}</strong> to{" "}
            <strong>{endDate}</strong>
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={metric}
          exclusive
          onChange={handleMetricChange}
          aria-label="metric toggle"
          size="small"
          color="primary"
        >
          <ToggleButton value="price" aria-label="price">
            <TrendingUpIcon sx={{ mr: 1, fontSize: 20 }} />
            Price
          </ToggleButton>
          <ToggleButton value="volatility" aria-label="volatility">
            <EqualizerIcon sx={{ mr: 1, fontSize: 20 }} />
            Volatility
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {/* 3. Main Chart Section */}
        <Grid item xs={12}>
          <PriceChart />
        </Grid>

        {/* 4. Insight Section */}
        <Grid item xs={12} md={6}>
          <Box
            p={3}
            bgcolor="background.paper"
            borderRadius={3}
            border="1px solid"
            borderColor="divider"
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Technical Summary
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              The current view displays the <strong>{metric}</strong> trend. Red
              dashed lines indicate model-detected changepoints (structural
              shifts), while orange markers signify significant geopolitical or
              market events. Toggle between Price and Volatility to see how
              market uncertainty correlates with price direction.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PricePage;
