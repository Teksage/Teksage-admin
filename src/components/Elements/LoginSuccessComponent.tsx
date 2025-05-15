import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

export const LoginSuccessComponent = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography
        variant="h6"
        sx={{
          color: "#2e7d32",
          fontWeight: 600,
          mb: 2,
        }}
        style={{fontFamily: 'Urbanist', fontWeight: 800}}
      >
        Login Successful
      </Typography>
      <CircularProgress size={24} color="inherit" />
    </Box>
  );