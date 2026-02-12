// src/routes/index.tsx

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import MainLayout from "../layout/MainLayout";
import PriceChart from "../features/prices/PriceChart";
import { Dashboard } from "../dashboard/Dashboard";

/* -----------------------------------
   Lazy Pages
----------------------------------- */

const Events = lazy(() => import("../pages/events"));

/* -----------------------------------
   Loader (MUI-based)
----------------------------------- */

const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
    }}
  >
    <CircularProgress />
  </Box>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prices" element={<PriceChart />} />
          <Route path="/events" element={<Events />} />

          <Route
            path="*"
            element={
              <Box sx={{ textAlign: "center", py: 10 }}>
                <h2>404</h2>
                <p>Page not found</p>
              </Box>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
