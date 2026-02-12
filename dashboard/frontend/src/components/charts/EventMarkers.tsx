import { ReferenceDot } from "recharts";
import { financialTheme } from "./ChartTheme";

export const EventMarkers = ({ events }: any) => (
  <>
    {events.map((event: any) => (
      <ReferenceDot
        key={event.date}
        x={event.date}
        y={event.value}
        r={4}
        fill={financialTheme.event}
        stroke="white"
      />
    ))}
  </>
);
