import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  BarChart as PriceIcon,
  Event as EventIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Analytics as AnalysisIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayout } from "../context/LayoutContext";

interface SidebarProps {
  drawerWidth: number;
  collapsedWidth: number;
}

const MENU_ITEMS = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Price Analysis", icon: <PriceIcon />, path: "/prices" },
  { text: "Market Events", icon: <EventIcon />, path: "/events" },
  { text: "Intelligence", icon: <AnalysisIcon />, path: "/analysis" },
];

const Sidebar = ({ drawerWidth, collapsedWidth }: SidebarProps) => {
  const { sidebarOpen, toggleSidebar } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarOpen ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          bgcolor: "white",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {/* 1. Header & Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          px: 2,
          py: 2.5,
        }}
      >
        {sidebarOpen && (
          <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
            OILINTEL
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* 2. Navigation List */}
      <List sx={{ px: 1.5 }}>
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", mb: 0.5 }}
            >
              <Tooltip title={!sidebarOpen ? item.text : ""} placement="right">
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? "initial" : "center",
                    px: 2.5,
                    borderRadius: 2,
                    bgcolor: isActive ? "primary.lighter" : "transparent",
                    color: isActive ? "primary.main" : "text.secondary",
                    "&:hover": {
                      bgcolor: isActive ? "primary.lighter" : "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 2 : "auto",
                      justifyContent: "center",
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.9rem",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
