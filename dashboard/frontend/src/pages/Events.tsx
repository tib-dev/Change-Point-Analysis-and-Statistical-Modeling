import EventTable from "../features/events/EventTable";
import EventDetailModal from "../features/events/EventDetailModal"; // The KPI cards// The "Before vs After" chart
import { useFilters } from "../context/FilterContext";

const EventsPage = () => {
  const { startDate, endDate } = useFilters();

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Market Events & Impact
        </h1>
        <p className="text-gray-500">
          Analyzing market shifts between {startDate} and {endDate}
        </p>
      </header>

      {/* 2. Top-level KPIs (Aggregated from your /api/impact-summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {}
        {/* <EventDetailModal /> */}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 3. The Navigation Table (Takes up 2 columns) */}
        <div className="xl:col-span-2">
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Event Log</h2>
            <EventTable />
          </section>
        </div>

        {/* 4. Side Context or Instructions */}
        <div className="xl:col-span-1 space-y-6">
          <aside className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-blue-800 font-bold mb-2">Analysis Tip</h3>
            <p className="text-blue-700 text-sm">
              Select an event from the table to calculate the 30-day price shift
              and volatility changes associated with that specific date.
            </p>
          </aside>

          {/* You could put a small 'Recent ChangePoints' list here */}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
