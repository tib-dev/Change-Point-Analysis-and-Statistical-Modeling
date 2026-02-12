import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";
import { LayoutProvider } from "../context/LayoutContext";
import AppRoutes from "./routes";
import { FilterProvider } from "../context/FilterContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents annoying refreshes when switching tabs
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kicks in the background color and font from your theme */}
        <CssBaseline />
        <BrowserRouter>
          <LayoutProvider>
            <FilterProvider>
              <AppRoutes />
            </FilterProvider>
          </LayoutProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
