import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useState } from "react";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // Later connect this to your theme context
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#111",
        borderBottom: "1px solid #eee",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Page Title */}
        <Typography variant="h6" fontWeight={600}>
          Market Dashboard
        </Typography>

        {/* Right Side Controls */}
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Avatar sx={{ bgcolor: "#2563eb", width: 36, height: 36 }}>M</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
