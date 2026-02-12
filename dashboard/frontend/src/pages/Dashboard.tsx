import { ChartSyncProvider } from "../components/charts/ChartSyncContext";
import PriceChart from "../features/prices/PriceChart";
import VolatilityChart from "../features/prices/VolatilityChart";

export default function DashboardPage() {
  return (
    <ChartSyncProvider>
      <PriceChart />
      <VolatilityChart />
    </ChartSyncProvider>
  );
}
