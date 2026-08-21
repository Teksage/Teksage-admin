import React from "react";
import { Box, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const TabContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  position: "relative",
  marginBottom: theme.spacing(3),
}));

const Tab = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1.5),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[200], 0.3),
  },
}));

const Underline = styled(Box)(() => ({
  position: "absolute",
  bottom: 0,
  height: "2px",
  background: `linear-gradient(45deg, #2e7d32, #1b4d3e)`,
  transition: "all 0.3s ease",
}));

type LoginMethod = "email" | "mobile" | "partner";

interface SignInTypeTabsProps {
  loginMethod: LoginMethod;
  handleLoginMethodChange: (newMethod: LoginMethod) => void;
}

export const SignInTypeTabsComponent = React.memo<SignInTypeTabsProps>(
  ({ loginMethod, handleLoginMethodChange }) => {
    const left =
      loginMethod === "email" ? "0%" : loginMethod === "mobile" ? "33.333%" : "66.666%";
    return (
      <TabContainer>
        <Tab
          onClick={() => handleLoginMethodChange("email")}
          sx={{
            color: loginMethod === "email" ? "#1b4d3e" : "text.secondary",
            fontWeight: loginMethod === "email" ? 600 : 400,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            style={{ fontFamily: "Urbanist", fontWeight: 800 }}
          >
            Email
          </Box>
        </Tab>
        <Tab
          onClick={() => handleLoginMethodChange("mobile")}
          sx={{
            color: loginMethod === "mobile" ? "#1b4d3e" : "text.secondary",
            fontWeight: loginMethod === "mobile" ? 600 : 400,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            style={{ fontFamily: "Urbanist", fontWeight: 800 }}
          >
            Mobile
          </Box>
        </Tab>
        <Tab
          onClick={() => handleLoginMethodChange("partner")}
          sx={{
            color: loginMethod === "partner" ? "#1b4d3e" : "text.secondary",
            fontWeight: loginMethod === "partner" ? 600 : 400,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            style={{ fontFamily: "Urbanist", fontWeight: 800 }}
          >
            Partner
          </Box>
        </Tab>
        <Underline sx={{ width: "33.333%", left }} />
      </TabContainer>
    );
  }
);
