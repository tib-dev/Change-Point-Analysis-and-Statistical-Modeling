import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { getEvents } from "./event.service";
import EventDetailModal from "./EventDetailModal";

const EventTable = () => {
  const { startDate, endDate } = useFilters();
  const [selected, setSelected] = useState<any>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", startDate, endDate],
    queryFn: () => getEvents({ start: startDate, end: endDate }),
  });

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Event</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event, i) => (
            <TableRow
              key={i}
              hover
              onClick={() => setSelected(event)}
              sx={{ cursor: "pointer", "&:last-child td": { border: 0 } }}
            >
              <TableCell>{event.date}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{event.event_name}</TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                  }}
                >
                  {event.category}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selected && (
        <EventDetailModal event={selected} onClose={() => setSelected(null)} />
      )}
    </TableContainer>
  );
};

export default EventTable;
