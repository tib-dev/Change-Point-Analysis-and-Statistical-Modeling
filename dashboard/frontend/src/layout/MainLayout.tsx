// src/layout/MainLayout.tsx

import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { LayoutProvider, useLayout } from "../context/LayoutContext";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

function LayoutContent() {
  const { sidebarOpen } = useLayout();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <Sidebar drawerWidth={DRAWER_WIDTH} collapsedWidth={COLLAPSED_WIDTH} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f9fafb",
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: sidebarOpen
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          width: `calc(100% - ${
            sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH
          }px)`,
          overflowX: "hidden",
        }}
      >
        <Topbar />
        <Box sx={{ px: 4, py: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default function MainLayout() {
  return (
    <LayoutProvider>
      <LayoutContent />
    </LayoutProvider>
  );
}
