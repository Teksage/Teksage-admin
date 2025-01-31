import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, IconButton } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import StarsIcon from '@mui/icons-material/Stars';
import HelpIcon from '@mui/icons-material/Help';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LayersIcon from '@mui/icons-material/Layers';
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? drawerWidth : 60,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : 60,
    boxSizing: 'border-box',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const menuItems = [
  { name: 'Users', path: '/users', icon: <PeopleIcon /> },
  { name: 'Astrologers', path: '/astrologers', icon: <StarsIcon /> },
  { name: 'Services', path: '/services', icon: <ShoppingCartIcon /> },
  { name: 'FAQs', path: '/faqs', icon: <HelpIcon /> },
  { name: 'Analytics', path: '/analytics', icon: <LayersIcon /> },
];

const Navbar = ({ open, toggleSidebar }:any) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  return (
    <Sidebar variant="permanent" open={open}>
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        {/* Always show the logo, even when sidebar is collapsed */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: open ? 'flex-start' : 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '100%' }} />
        </Box>

        {/* Move the sidebar toggle icon to the far right */}
        <IconButton
          onClick={toggleSidebar}
          sx={{ position: 'absolute', right: 0, top: '70%', transform: 'translateY(-50%)' }}
        >
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.name} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.name} />}
          </ListItemButton>
        ))}
        <ListItemButton onClick={() => setExpanded(!expanded)}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Plans" />}
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/plans/coupons')}>
              <ListItemIcon>
                <LocalOfferIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Coupon Code" />}
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Sidebar>
  );
};

export default Navbar;