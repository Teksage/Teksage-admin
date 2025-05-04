import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
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
  SwipeableDrawer,
  alpha,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleIcon from "@mui/icons-material/People";
import StarsIcon from "@mui/icons-material/Stars";
import HelpIcon from "@mui/icons-material/Help";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";
import astro_prompt_logo from "../../assets/astro_prompt_logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 72;

const GradientDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  "& .MuiDrawer-paper": {
    width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
    boxSizing: "border-box",
    overflowX: "hidden",
    position: "relative",
    background:
      "linear-gradient(180deg, rgba(16, 177, 0, 0.5) -202.06%, rgba(255, 255, 255, 0.5) 100%)",
    backdropFilter: "blur(10px)",
    borderRight: "none",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    transition: theme.transitions.create(["width", "background"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    "&:hover": {
      background:
        "linear-gradient(180deg, rgba(16, 177, 0, 0.6) -202.06%, rgba(255, 255, 255, 0.6) 100%)",
    },
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(2),
  minHeight: 64,
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  // left: open ? DRAWER_WIDTH - 12 : DRAWER_COLLAPSED_WIDTH - 12,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: theme.zIndex.drawer + 1,
  width: 42,
  height: 42,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "12px",
  transition: theme.transitions.create(["left", "transform"], {
    duration: theme.transitions.duration.standard,
  }),
  "& svg": {
    fontSize: "1.25rem",
    color: theme.palette.success.main,
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.short,
    }),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.success.light, 0.2),
    transform: "translateY(-50%) scale(1.08)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    "& svg": {
      transform: "scale(1.2)",
    },
  },
  "&:active": {
    transform: "translateY(-50%) scale(0.96)",
  },
}));

const NavItem = styled(ListItemButton)(({ theme, open }: any) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1),
  width: "auto",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(16, 177, 0, 0.3)",
    borderLeft: `3px solid ${theme.palette.success.main}`,
    "& .MuiListItemIcon-root": {
      color: theme.palette.success.main,
    },
    "& .MuiListItemText-primary": {
      fontWeight: 600,
    },
  },
  "& .MuiListItemIcon-root": {
    minWidth: open ? 40 : 24,
    justifyContent: open ? "flex-start" : "center",
    marginRight: open ? theme.spacing(4) : 0, // Increased gap to 16px when open
  },
  transition: theme.transitions.create(
    ["background-color", "padding", "margin"],
    {
      duration: theme.transitions.duration.shortest,
    }
  ),
}));

// Update menuItems to include Notifications
const menuItems = [
  { name: "Users", path: "/dashboard/users", icon: <PeopleIcon /> },
  { name: "Astrologers", path: "/dashboard/astrologers", icon: <StarsIcon /> },
  {
    name: "Consultations",
    path: "/dashboard/consultations",
    icon: <ChatIcon />,
  },
  {
    name: "Subscription Plans",
    path: "/dashboard/subscription",
    icon: <BarChartIcon />,
  },
  { name: "Coupons", path: "/dashboard/coupons", icon: <LocalOfferIcon /> },
  { name: "Services", path: "/dashboard/services", icon: <ShoppingCartIcon /> },
  { name: "FAQs", path: "/dashboard/faqs", icon: <HelpIcon /> },
  { name: "Analytics", path: "/dashboard/analytics", icon: <LayersIcon /> },
];

const Navbar = ({ open, toggleSidebar }: any) => {
  // const [expanded, setExpanded] = useState(false);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const locationPathname = location?.pathname;
  // const firstPathSegment = location.pathname.split("/")[2];

  const handleNotificationsClick = (e: any) => {
    e.stopPropagation();
    setNotificationsExpanded(!notificationsExpanded);
    if (!notificationsExpanded && open) {
      navigate("/dashboard/notifications/send");
    }
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      toggleSidebar();
      // Only reset expanded state when closing the sidebar
      // if (open) {
      //   setExpanded(false);
      // }
    }
  };

  const handleMenuItemClick = (path: any) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // const handleExpandClick = (e) => {
  //   e.stopPropagation();
  //   setExpanded(!expanded);
  //   if (!expanded && open) {
  //     navigate("/dashboard/plans/coupons");
  //   }
  // };

  const isActive = (path: any) => locationPathname.includes(path);

  const drawerContent = (
    <>
      <LogoContainer>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: open ? "flex-start" : "center",
            alignItems: "center",
            paddingLeft: open ? 2 : 0,
            "& img": {
              width: open ? "100px" : "28px",
              height: "auto",
              transition: "all 0.3s ease",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            },
          }}
        >
          <img
            src={astro_prompt_logo}
            alt="Logo"
            style={{ borderRadius: "8px" }}
          />
        </Box>
        {!isMobile && (
          <ToggleButton
            onClick={handleToggleSidebar}
            sx={{
              left: `calc(${
                open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH
              }px - 22px)`,
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </ToggleButton>
        )}
      </LogoContainer>

      <List sx={{ px: 0.5, pt: 1 }}>
        {/* Render main menu items */}
        {menuItems.map((item) => (
          <NavItem
            key={item.name}
            onClick={() => handleMenuItemClick(item.path)}
            selected={isActive(item.path)}
            sx={{ gap: "10px" }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                marginRight: open || isMobile ? 4 : 0, // Adds 32px gap when open or on mobile
              }}
            >
              {item.icon}
            </ListItemIcon>
            {(open || isMobile) && (
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: "0.995rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            )}
          </NavItem>
        ))}

        {/* Add Notifications section with expandable items */}
        <NavItem
          // open={open}
          onClick={
            open
              ? handleNotificationsClick
              : () => navigate("/dashboard/notifications/send")
          }
          selected={locationPathname.includes("/dashboard/notifications")}
          sx={{ gap: "10px" }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <NotificationsIcon />
          </ListItemIcon>
          {(open || isMobile) && (
            <>
              <ListItemText
                primary="Notifications"
                primaryTypographyProps={{
                  fontSize: "0.995rem",
                  whiteSpace: "nowrap",
                }}
                sx={{ flexGrow: 1 }}
              />
              {open && (
                <IconButton
                  size="small"
                  onClick={handleNotificationsClick}
                  sx={{ padding: 0.5, ml: -1 }}
                >
                  {notificationsExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </>
          )}
        </NavItem>

        <Collapse
          in={notificationsExpanded && (open || isMobile)}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            {/* Send Notifications */}
            <NavItem
              sx={{
                pl: open ? 4 : 2,
                ml: 1,
                mr: 1,
                borderRadius: theme.shape.borderRadius,
                gap: "8px"
              }}
              // open={open}
              onClick={() =>
                handleMenuItemClick("/dashboard/notifications/send")
              }
              selected={locationPathname === "/dashboard/notifications/send"}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <SendIcon fontSize="small" />
              </ListItemIcon>
              {(open || isMobile) && (
                <ListItemText
                  primary="Send Notifications"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
            </NavItem>

            {/* Notifications Log */}
            <NavItem
              sx={{
                pl: open ? 4 : 2,
                ml: 1,
                mr: 1,
                borderRadius: theme.shape.borderRadius,
                gap: "8px"
              }}
              // open={open}
              onClick={() =>
                handleMenuItemClick("/dashboard/notifications/log")
              }
              selected={locationPathname === "/dashboard/notifications/log"}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <ListAltIcon fontSize="small" />
              </ListItemIcon>
              {(open || isMobile) && (
                <ListItemText
                  primary="Notifications Log"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
            </NavItem>
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
          sx={{
            mr: 2,
            position: "fixed",
            left: 16,
            top: 16,
            zIndex: 1201,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onOpen={() => setMobileOpen(true)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              background:
                "linear-gradient(180deg, rgba(16, 177, 0, 0.5) -202.06%, rgba(255, 255, 255, 0.5) 100%)",
              backdropFilter: "blur(10px)",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Box sx={{ py: 2 }}>{drawerContent}</Box>
        </SwipeableDrawer>
      </>
    );
  }

  return (
    <GradientDrawer variant="permanent" open={open}>
      {drawerContent}
    </GradientDrawer>
  );
};

export default Navbar;
