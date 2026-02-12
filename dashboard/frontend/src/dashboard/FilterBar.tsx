import {
  Box,
  TextField,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useFilters } from "../context/FilterContext";
import { format, subYears, parse } from "date-fns";
import { DATE_FORMAT } from "../utils/constants";

const FilterBar = () => {
  const { startDate, endDate, setDateRange, metric, setMetric, resetFilters } =
    useFilters();

  const DATA_MIN = "1987-05-20";
  const DATA_MAX = "2022-09-30";

  const handlePreset = (years: number | "all") => {
    const end = parse(DATA_MAX, DATE_FORMAT, new Date());
    const start =
      years === "all"
        ? parse(DATA_MIN, DATE_FORMAT, new Date())
        : subYears(end, years);

    setDateRange(format(start, DATE_FORMAT), DATA_MAX);
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "text.secondary" }}
        >
          RANGE
        </Typography>

        <TextField
          label="From"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setDateRange(e.target.value, endDate)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 155 }}
        />

        <TextField
          label="To"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setDateRange(startDate, e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 155 }}
        />

        {/* Quick Presets */}
        <Stack direction="row" spacing={1}>
          {["1Y", "5Y", "ALL"].map((label) => (
            <Button
              key={label}
              size="small"
              variant="outlined"
              onClick={() =>
                handlePreset(label === "ALL" ? "all" : parseInt(label))
              }
              sx={{ borderRadius: 2, fontSize: "0.75rem", py: 0 }}
            >
              {label}
            </Button>
          ))}
        </Stack>

        <Tooltip title="Reset to Default">
          <IconButton onClick={resetFilters} sx={{ bgcolor: "action.hover" }}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <ToggleButtonGroup
        value={metric}
        exclusive
        onChange={(_, val) => val && setMetric(val)}
        size="small"
        color="primary"
      >
        <ToggleButton value="price" sx={{ fontWeight: 600 }}>
          Price
        </ToggleButton>
        <ToggleButton value="volatility" sx={{ fontWeight: 600 }}>
          Volatility
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default FilterBar;
