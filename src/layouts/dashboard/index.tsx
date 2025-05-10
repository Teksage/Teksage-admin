import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Paper,
  useMediaQuery,
  useTheme,
  Avatar,
  Theme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Logout from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Navbar from "../../components/Dashboard/Navbar";
import { tokenService } from "../../utils/tokenService";
import { callAPI } from "../../api/crudFactory";

// Define the props interface for MainContent
interface MainContentProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  theme?: Theme;
}

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background:
    "linear-gradient(90deg, rgba(16, 177, 0, 0.4) -42.06%, rgba(255, 255, 255, 0.7) 100%)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  color: theme.palette.text.primary,
  transition: theme.transitions.create(["background", "box-shadow"], {
    duration: theme.transitions.duration.standard,
  }),
  "&:hover": {
    background:
      "linear-gradient(90deg, rgba(16, 177, 0, 0.45) -42.06%, rgba(255, 255, 255, 0.75) 100%)",
  },
}));

const ProfileButton = styled(IconButton)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  border: "2px solid rgba(255, 255, 255, 0.6)",
  transition: theme.transitions.create(
    ["transform", "background-color", "border"],
    {
      duration: theme.transitions.duration.shortest,
    }
  ),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "rgba(255, 255, 255, 0.8)",
    transform: "scale(1.05)",
  },
}));

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "sidebarOpen" && prop !== "isMobile",
})<MainContentProps>(({ theme, sidebarOpen, isMobile }) => ({
  flexGrow: 1,
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  backgroundImage:
    "linear-gradient(to bottom right, rgba(240, 255, 240, 0.4), rgba(240, 240, 255, 0.4))",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  width: isMobile
    ? "100%"
    : sidebarOpen
    ? `calc(100% - 240px)`
    : `calc(100% - 72px)`,
}));

const LayoutContainer = styled(Box)(() => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f5f5f7",
  position: "relative",
  overflow: "hidden",
}));

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const open = Boolean(anchorEl);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const userName = tokenService.getUser();
    setUser(userName);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeMode") as "light" | "dark";
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleToggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutSection = async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();

      if (refreshToken) {
        await callAPI({
          endpoint: "api/auth/logout",
          method: "post",
          data: {
            refresh_token: refreshToken,
          },
        });
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      tokenService.clearTokens();
      dispatch({ type: "setAuth", payload: false });
      dispatch({ type: "login", payload: {} });
      navigate("/auth/login");
    }
  };

  const getInitials = (name: any) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n: any) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const ScrollableContent = styled(Box)(() => ({
    flexGrow: 1,
    overflowY: "auto",
    height: isMobile ? "calc(100vh - 64px - 56px)" : "calc(100vh - 64px)", // Subtract padding from height
    boxSizing: "border-box",
  }));

  return (
    <LayoutContainer>
      <Navbar
        open={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <MainContent sidebarOpen={sidebarOpen} isMobile={isMobile}>
        <GradientAppBar
          position={isMobile ? "fixed" : "static"}
          sx={isMobile ? { width: "100%", zIndex: 1100 } : {}}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "end",
              minHeight: 64,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ProfileButton
                onClick={handleMenu}
                color="inherit"
                aria-label="account"
                size="large"
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "rgba(16, 177, 0, 0.7)",
                    color: "#fff",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user)}
                </Avatar>
              </ProfileButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 250,
                    borderRadius: 2,
                    mt: 1,
                    overflow: "hidden",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2.5,
                    alignItems: "center",
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(16, 177, 0, 0.1), rgba(240, 240, 255, 0.2))",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mb: 1.5,
                      bgcolor: "rgba(16, 177, 0, 0.7)",
                      color: "#fff",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {getInitials(user)}
                  </Avatar>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user || "User"}
                    </Typography>
                    {/* {themeMode === "light" ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 3V1M12 23V21M3 12H1M23 12H21M5.64 5.64L4.22 4.22M19.78 19.78L18.36 18.36M5.64 18.36L4.22 19.78M19.78 4.22L18.36 5.64M12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17Z"
                          stroke="#FFB300"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 12.79C20.65 14.24 19.88 15.56 18.77 16.67C16.77 18.67 14.06 19.5 11.5 19.5C6.75 19.5 3 15.75 3 11C3 8.44 3.83 5.73 5.83 3.73C6.94 2.62 8.26 1.85 9.71 1.5C9.15 2.62 8.85 3.85 8.85 5.15C8.85 8.85 11.85 11.85 15.55 11.85C16.85 11.85 18.08 11.55 19.2 11C19.55 11.56 20.32 12.33 21 12.79Z"
                          stroke="#4A90E2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )} */}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      backgroundColor: "rgba(16, 177, 0, 0.1)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      mt: 0.5,
                    }}
                  >
                    {"Administrator"}
                  </Typography>
                </Paper>
                {/* <MenuItem
                  onClick={handleToggleTheme}
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(16, 177, 0, 0.05)",
                    },
                  }}
                >
                  <Brightness4Icon sx={{ marginRight: 2, color: "rgba(0,0,0,0.6)" }} />
                  <Typography variant="body2" fontWeight={500}>
                    {themeMode === "light" ? "Dark Mode" : "Light Mode"}
                  </Typography>
                </MenuItem> */}
                <MenuItem
                  onClick={logoutSection}
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(255, 76, 76, 0.05)",
                    },
                  }}
                >
                  <Logout sx={{ marginRight: 2, color: "rgba(0,0,0,0.6)" }} />
                  <Typography variant="body2" fontWeight={500}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </GradientAppBar>
        <ScrollableContent>
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              height: "100%",
              pt: isMobile ? 3 : 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Outlet />
            </Box>
          </Box>
        </ScrollableContent>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;