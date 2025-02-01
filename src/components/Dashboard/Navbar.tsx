import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  Box, 
  IconButton, 
  useMediaQuery,
  SwipeableDrawer 
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import StarsIcon from '@mui/icons-material/Stars';
import HelpIcon from '@mui/icons-material/Help';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LayersIcon from '@mui/icons-material/Layers';
import logo from "../../assets/logo.png";
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 60;

const Sidebar = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '& .MuiDrawer-paper': {
    width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
    boxSizing: 'border-box',
    overflowX: 'hidden',
    position: 'relative',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  paddingRight: theme.spacing(6),
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: -30,
  top: '100%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  zIndex: 1,
  width: 50, 
  height: 50, 
  '& svg': {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const locationPathname = location?.pathname
  const firstPathSegment = location.pathname.split("/")[1];

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      toggleSidebar();
      setExpanded(false);
    }
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <>
      <LogoContainer>
        {open && <Box 
          sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: open ? 'flex-start' : 'center',
            '& img': {
              maxWidth: open ? '150px' : '100px',
              height: 'auto',
              transition: 'all 0.3s ease'
            }
          }}
        >
          <img src={logo} alt="Logo" style={{borderRadius: '1px 20px 1px 20px'}} />
        </Box>}
        {!isMobile && (
          <ToggleButton onClick={handleToggleSidebar} size="small">
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </ToggleButton>
        )}
      </LogoContainer>
      
      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.name} onClick={() => {handleMenuItemClick(item.path); setExpanded(false)}} style={{ backgroundColor: item?.path===locationPathname ? '#1976d2':'', color: item?.path===location ? 'white' : ''}}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {(open || isMobile) && <ListItemText primary={item.name} />}
          </ListItemButton>
        ))}
        <ListItemButton onClick={() => {setExpanded(!expanded); navigate('/plans/coupons')}} style={{backgroundColor: firstPathSegment==="plans" ? '#c4dcff':''}}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          {(open || isMobile) && <ListItemText primary="Plans" />}
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }} 
              onClick={() => handleMenuItemClick('/plans/coupons')}
              style={{ backgroundColor: locationPathname==="/plans/coupons" ? '#1976d2':'', color: locationPathname==="/plans/coupons" ? 'white' : ''}}
            >
              <ListItemIcon>
                <LocalOfferIcon />
              </ListItemIcon>
              {(open || isMobile) && <ListItemText primary="Coupon Code" />}
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </>
  );

  if (isMobile) {
    return (
      <>
        <IconButton 
          color="inherit" 
          aria-label="open drawer" 
          edge="start" 
          onClick={handleToggleSidebar}
          sx={{ mr: 2, position: 'absolute', left: 10, top: 10, zIndex: 1201 }}
        >
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleToggleSidebar}
          onOpen={handleToggleSidebar}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawerContent}
        </SwipeableDrawer>
      </>
    );
  }

  return (
    <Sidebar 
      variant="permanent" 
      open={open} 
      anchor="left"
    >
      {drawerContent}
    </Sidebar>
  );
};

export default Navbar;