import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { styled } from "@mui/material/styles";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import Profile from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";
import PeopleIcon from "@mui/icons-material/People";
import StarsIcon from "@mui/icons-material/Stars";
import HelpIcon from "@mui/icons-material/Help";
import Navbar from "../../components/Dashboard/Navbar";

const menuItems = [
  { name: "Users", path: "/dashboard/users", icon: <PeopleIcon /> },
  { name: "Astrologers", path: "/dashboard/astrologers", icon: <StarsIcon /> },
  { name: "Services", path: "/dashboard/services", icon: <ShoppingCartIcon /> },
  { name: "FAQs", path: "/dashboard/faqs", icon: <HelpIcon /> },
  { name: "Analytics", path: "/dashboard/analytics", icon: <LayersIcon /> },
];

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(90deg, rgba(16, 177, 0, 0.4) -42.06%, rgba(255, 255, 255, 0.7) 100%)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['background', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  "&:hover": {
    background: "linear-gradient(90deg, rgba(16, 177, 0, 0.45) -42.06%, rgba(255, 255, 255, 0.75) 100%)",
  },
}));

const ProfileButton = styled(IconButton)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  border: "2px solid rgba(255, 255, 255, 0.6)",
  transition: theme.transitions.create(['transform', 'background-color', 'border'], {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "rgba(255, 255, 255, 0.8)",
    transform: "scale(1.05)",
  },
}));

const MainContent = styled(Box)(({ theme, sidebarOpen, isMobile }) => ({
  flexGrow: 1,
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  backgroundImage: "linear-gradient(to bottom right, rgba(240, 255, 240, 0.4), rgba(240, 240, 255, 0.4))",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginLeft: 0, // Remove left margin to attach directly to navbar
  width: isMobile ? "100%" : (sidebarOpen ? `calc(100% - 240px)` : `calc(100% - 72px)`),
}));

const LayoutContainer = styled(Box)(({ theme }) => ({
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
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const open = Boolean(anchorEl);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const loginUserDetails = useSelector((state) => state.userInfo);

  useEffect(() => {
    // Determine the page title based on current location
    const currentMenu = menuItems.find((item) => location.pathname.includes(item.path));
    
    if (location.pathname.includes("/dashboard/plans/coupons")) {
      setPageTitle("Coupons");
    } else if (location.pathname.includes("/dashboard/profile")) {
      setPageTitle("Profile");
    } else if (currentMenu) {
      setPageTitle(currentMenu.name);
    } else {
      setPageTitle("Dashboard");
    }
    
    // Close sidebar on mobile when location changes
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/dashboard/profile");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutSection = () => {
    dispatch({ type: "setAuth", payload: false });
    dispatch({ type: "login", payload: {} });
    navigate("/auth/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 64 }}>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  color: "rgba(0, 0, 0, 0.87)",
                  marginLeft: { xs: 7, sm: 2 },
                }}
              >
                Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  display: { xs: "none", sm: "block" },
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: 500,
                }}
              >
                {loginUserDetails?.name || "User"}
              </Typography>
              <ProfileButton
                onClick={handleMenu}
                color="inherit"
                aria-label="account"
                size="large"
              >
                {loginUserDetails?.avatar ? (
                  <Avatar 
                    src={loginUserDetails.avatar}
                    alt={loginUserDetails?.name || "User"}
                    sx={{ width: 38, height: 38 }}
                  />
                ) : (
                  <Avatar sx={{ 
                    width: 38, 
                    height: 38, 
                    bgcolor: "rgba(16, 177, 0, 0.7)",
                    color: "#fff",
                    fontSize: "0.9rem",
                    fontWeight: 600
                  }}>
                    {getInitials(loginUserDetails?.name)}
                  </Avatar>
                )}
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
                    backgroundImage: "linear-gradient(to bottom, rgba(16, 177, 0, 0.1), rgba(240, 240, 255, 0.2))",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {loginUserDetails?.avatar ? (
                    <Avatar 
                      src={loginUserDetails.avatar}
                      alt={loginUserDetails?.name || "User"}
                      sx={{ width: 64, height: 64, mb: 1.5, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                    />
                  ) : (
                    <Avatar sx={{ 
                      width: 64, 
                      height: 64, 
                      mb: 1.5,
                      bgcolor: "rgba(16, 177, 0, 0.7)",
                      color: "#fff",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}>
                      {getInitials(loginUserDetails?.name)}
                    </Avatar>
                  )}
                  <Typography variant="subtitle1" fontWeight={600}>
                    {loginUserDetails?.name || "User"}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      backgroundColor: "rgba(16, 177, 0, 0.1)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      mt: 0.5
                    }}
                  >
                    {loginUserDetails?.role || "User"}
                  </Typography>
                </Paper>
                <MenuItem 
                  onClick={handleProfile} 
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(16, 177, 0, 0.05)"
                    }
                  }}
                >
                  <Profile sx={{ marginRight: 2, color: "rgba(0,0,0,0.6)" }} /> 
                  <Typography variant="body2" fontWeight={500}>Profile</Typography>
                </MenuItem>
                <MenuItem 
                  onClick={logoutSection} 
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(255, 76, 76, 0.05)"
                    }
                  }}
                >
                  <Logout sx={{ marginRight: 2, color: "rgba(0,0,0,0.6)" }} /> 
                  <Typography variant="body2" fontWeight={500}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </GradientAppBar>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            minHeight: `calc(100vh - 64px)`,
            ...(isMobile ? { mt: "64px" } : {}),
            borderRadius: 0, // Remove border radius to ensure full attachment
          }}
        >
          <Outlet />
        </Box>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;