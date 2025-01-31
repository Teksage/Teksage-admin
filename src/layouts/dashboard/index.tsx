import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// import { styled } from "@mui/material/styles";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
import Navbar from "../../components/Dashboard/Navbar";
import { Menu, MenuItem, IconButton, Typography, Box, AppBar, Toolbar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import Profile from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import StarsIcon from '@mui/icons-material/Stars';
import HelpIcon from '@mui/icons-material/Help';

// const APP_BAR_MOBILE = 64;
// const APP_BAR_DESKTOP = 92;

// const RootStyle = styled("div")({
//   display: "flex",
//   minHeight: "100%",
//   overflow: "hidden",
// });

// const MainStyle = styled("div")(({ theme }) => ({
//   flexGrow: 1,
//   overflow: "auto",
//   minHeight: "100%",
//   paddingTop: APP_BAR_MOBILE + 24,
//   paddingBottom: theme.spacing(10),
//   [theme.breakpoints.up("lg")]: {
//     paddingTop: APP_BAR_DESKTOP + 24,
//     paddingLeft: theme.spacing(2),
//     paddingRight: theme.spacing(2),
//   },
// }));

const menuItems = [
  { name: 'Users', path: '/users', icon: <PeopleIcon /> },
  { name: 'Astrologers', path: '/astrologers', icon: <StarsIcon /> },
  { name: 'Services', path: '/services', icon: <ShoppingCartIcon /> },
  { name: 'FAQs', path: '/faqs', icon: <HelpIcon /> },
  { name: 'Analytics', path: '/analytics', icon: <LayersIcon /> },
];

const DashboardLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const pageTitle = menuItems.find((item) => item.path === location.pathname)?.name || 'Dashboard';

  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex">
      <Navbar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {pageTitle}
            </Typography>
            <IconButton onClick={handleMenu} color="inherit" sx={{ fontSize: 40 }}>
              <AccountCircle fontSize="inherit" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose} sx={{ fontSize: 18, padding: 2 }}>
                <Profile sx={{ marginRight: 1, fontSize: 24 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose} sx={{ fontSize: 18, padding: 2 }}>
                <Logout sx={{ marginRight: 1, fontSize: 24 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
