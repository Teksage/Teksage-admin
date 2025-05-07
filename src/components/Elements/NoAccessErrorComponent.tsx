import {
    Box,
    Typography,
  } from "@mui/material";

export const NoAccessErrorComponent = ({ error }:any) => (
    <Box
      sx={{
        textAlign: "center",
        py: 2,
        background: "rgba(255, 82, 82, 0.1)",
        borderRadius: 1,
        animation: "fadeIn 0.5s ease-in-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
            fill="#d32f2f"
          />
        </svg>
        <Typography
          variant="h6"
          sx={{
            color: "#d32f2f",
            fontWeight: 500,
            fontFamily: "'Roboto', sans-serif",
            letterSpacing: "0.3px",
          }}
        >
          {error}
        </Typography>
      </Box>
    </Box>
  );