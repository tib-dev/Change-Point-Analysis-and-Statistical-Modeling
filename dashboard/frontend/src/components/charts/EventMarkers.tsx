import React from "react";
import { ReferenceDot, ReferenceLine } from "recharts";
import { financialTheme } from "./ChartTheme";

/* ----------------------------------
   Types
---------------------------------- */
export interface ChartEvent {
  date: string;
  value: number;
  title?: string;
  category?: string;
  description?: string;
}

interface EventMarkersProps {
  events: ChartEvent[];
}

/* ----------------------------------
   Component
---------------------------------- */
export const EventMarkers = ({ events }: EventMarkersProps) => {
  if (!events || events.length === 0) return null;

  return (
    <>
      {events.map((event, index) => {
        const xVal = new Date(event.date).getTime();

        // Skip invalid data points to prevent chart crashes
        if (isNaN(xVal) || typeof event.value !== "number") return null;

        return (
          <React.Fragment key={`event-group-${event.date}-${index}`}>
            {/* Vertical Marker Line */}
            <ReferenceLine
              x={xVal}
              stroke={financialTheme.event}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            {/* Interactive Dot on the line */}
            <ReferenceDot
              x={xVal}
              y={event.value}
              r={5}
              fill={financialTheme.event}
              stroke="#ffffff"
              strokeWidth={2}
              style={{ cursor: "pointer" }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
