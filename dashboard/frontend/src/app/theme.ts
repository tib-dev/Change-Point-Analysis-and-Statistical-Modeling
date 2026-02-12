import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Professional Blue (used for Price line)
      light: "#60a5fa",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#10b981", // Success Green (used for Volatility line)
    },
    warning: {
      main: "#f59e0b", // Gold/Amber (used for Event dots)
    },
    error: {
      main: "#ef4444", // Red (used for Regime Shifts)
    },
    background: {
      default: "#f8fafc", // Very light grey background for the app
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      fontSize: "1.1rem",
      letterSpacing: "-0.01em",
    },
    subtitle2: {
      fontWeight: 500,
      color: "#64748b",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Avoids all-caps buttons
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

export default theme;
