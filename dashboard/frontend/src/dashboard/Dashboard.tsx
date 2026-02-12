import { Grid, Stack, CircularProgress, Box } from "@mui/material";
import { ChartSyncProvider } from "../components/charts/ChartSyncContext";
import { FinancialChart } from "../components/charts/FinancialChart";
import ChangePointTable from "../features/changepoints/ChangePointTable";
import EventTable from "../features/events/EventTable";
import FilterBar from "./FilterBar";
import KPISection from "./KPISection";

// Assuming you have these hooks based on your previous messages
import { usePrices } from "../hooks/usePrices";
import { useEvents } from "../hooks/useEvents";
import { useRegimes } from "../hooks/useRegime";

export const Dashboard = () => {
  // 1. Fetch data at the top level
  const { data: rawData, isLoading: pricesLoading } = usePrices();
  const { data: events } = useEvents();
  const { data: regimes } = useRegimes();

  // 2. Handle global loading state
  if (pricesLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <FilterBar />
      <KPISection />

      <ChartSyncProvider>
        {/* Pass the data into the chart here! */}
        <FinancialChart
          rawData={rawData || []}
          events={events || []}
          regimes={regimes || []}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <ChangePointTable />
          </Grid>

          <Grid item xs={12} md={5}>
            <EventTable />
          </Grid>
        </Grid>
      </ChartSyncProvider>
    </Stack>
  );
};
