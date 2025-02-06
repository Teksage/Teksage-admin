import { useState } from "react";
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
  Divider,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link,
  alpha
} from "@mui/material";
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

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pageTitle =
    menuItems.find((item) => item.path === location.pathname)?.name ||
    "Coupons";
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: any) => state.isAuthenticated);
  const loginUserDetails = useSelector((state: any) => state.userInfo);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
    console.log("TEST-ing");
  }

  const handleMenu = (event: any) => {
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

  return (
    <Box display="flex">
      <Navbar
        open={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <AppBar
          position="static"
          sx={{
            boxShadow: 1,
            ...(isMobile
              ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1200 }
              : {}),
          }}
        >
          <Toolbar sx={{ flexDirection: "column", alignItems: "stretch" }}>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Box
                sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(90deg, white, skyblue, lightgreen, white, yellow)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}                  
                >
                  Dashboard
                </Typography>
              </Box>
              <IconButton
                onClick={handleMenu}
                color="inherit"
                sx={{
                  fontSize: 40,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <AccountCircle fontSize="inherit" />
              </IconButton>
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
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    alignItems: "center",
                    borderBottom: "1px solid rgba(0,0,0,0.12)",
                  }}
                >
                  <AccountCircle
                    sx={{ fontSize: 60, color: "grey.500", mb: 1 }}
                  />
                  <Typography variant="subtitle1">
                    {loginUserDetails?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loginUserDetails?.role}
                  </Typography>
                </Paper>
                <Divider />
                <MenuItem onClick={handleProfile} sx={{ py: 1.5, px: 2 }}>
                  <Profile sx={{ marginRight: 2, color: "grey.700" }} /> Profile
                </MenuItem>
                <MenuItem onClick={logoutSection} sx={{ py: 1.5, px: 2 }}>
                  <Logout sx={{ marginRight: 2, color: "grey.700" }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            p: 3,
            bgcolor: "background.default",
            minHeight: "calc(100vh - 64px)",
            ...(isMobile ? { mt: "56px" } : {}),
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
