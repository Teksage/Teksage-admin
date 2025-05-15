// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Urbanist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Urbanist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        "*, *::before, *::after": {
          boxSizing: "inherit",
        },
      },
    },
  },
});

export default theme;