import {
  Box,
  alpha
} from "@mui/material";
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

export const SignInTypeTabsComponent = ({ loginMethod, handleLoginMethodChange }:any) => (
    <TabContainer>
      <Tab
        onClick={() => handleLoginMethodChange("email")}
        sx={{
          color: loginMethod === "email" ? "#1b4d3e" : "text.secondary",
          fontWeight: loginMethod === "email" ? 600 : 400,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 6L12 13L2 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 18H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Mobile
        </Box>
      </Tab>
      <Underline
        sx={{
          width: "50%",
          left: loginMethod === "email" ? "0%" : "50%",
        }}
      />
    </TabContainer>
  );