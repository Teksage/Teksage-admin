import { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import Logout from "@mui/icons-material/Logout";
import Navbar from "../../components/Dashboard/Navbar";
import { tokenService } from "../../utils/tokenService";
import { callAPI } from "../../api/crudFactory";

// Define the props interface for MainContent
interface MainContentProps {
  sidebarOpen: boolean;
  isMobile: boolean;
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
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  border: `2px solid ${alpha(theme.palette.common.white, 0.6)}`,
  transition: theme.transitions.create(
    ["transform", "background-color", "border"],
    {
      duration: theme.transitions.duration.shortest,
    }
  ),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.3),
    borderColor: alpha(theme.palette.common.white, 0.8),
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
    "linear-gradient(to bottom right, rgba(240, 255, 240, 0.4), rgba(200, 230, 200, 0.4))", // Adjusted to greener tint
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  width: isMobile
    ? "100%"
    : sidebarOpen
    ? `calc(100% - 240px)`
    : `calc(100% - 72px)`,
    marginTop: isMobile ? '56px' : 0, // Single source of spacing
}));

const LayoutContainer = styled(Box)(() => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "transparent",
  position: "relative",
  overflow: "hidden",
  '@media (max-width: 600px)': {
    flexDirection: 'column' // Ensures proper stacking on mobile
  }
}));

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const logoutSection = useCallback(async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();

      if (refreshToken) {
        await callAPI({
          endpoint: "api/auth/logout",
          method: "post",
          data: { refresh_token: refreshToken },
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
  }, [dispatch, navigate]);

  const getInitials = useCallback((name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }, []);

  // const ScrollableContent = styled(Box)(() => ({
  //   flexGrow: 1,
  //   overflowY: "auto",
  //   height: isMobile ? "calc(100vh - 64px - 56px)" : "calc(100vh - 64px)",
  //   boxSizing: "border-box",
  // }));

  const ScrollableContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflowY: "auto",
    height: isMobile 
      ? `calc(100vh - ${theme.mixins.toolbar.minHeight}px)` 
      : `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    paddingTop: isMobile ? 0 : 0, // Remove paddingTop here
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
          // sx={isMobile ? { width: "100%", zIndex: 1100 } : {}}
          sx={isMobile ? { 
            width: "100%", 
            zIndex: 1100,
            height: '56px' // Standard mobile toolbar height
          } : {}}
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
                    bgcolor: alpha(theme.palette.success.main, 0.7), // Use success.main for green theme
                    color: theme.palette.common.white,
                    fontSize: "0.9rem",
                    fontFamily: 'Urbanist', fontWeight: 600
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
                      bgcolor: alpha(theme.palette.success.main, 0.7), // Use success.main for green theme
                      color: theme.palette.common.white,
                      fontSize: "1.5rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      fontFamily: 'Urbanist', fontWeight: 600
                    }}
                  >
                    {getInitials(user)}
                  </Avatar>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle1" style={{fontFamily: 'Urbanist', fontWeight: 600}}>
                      {user || "User"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{fontFamily: 'Urbanist', fontWeight: 500}}
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
                  <Logout sx={{ marginRight: 2, color: "red" }} />
                  <Typography variant="body2" style={{fontFamily: 'Urbanist', fontWeight: 800, color: 'red'}}>
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
              // pt: isMobile ? 3 : 2,
              pt: isMobile ? 2 : 2, // Reduced padding-top on mobile
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