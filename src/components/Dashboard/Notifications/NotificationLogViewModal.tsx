import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import { InfoItem } from "../../Elements/CommonFunctions";

// Define the shape of the notification log data
interface NotificationLogData {
  id: number;
  title: string;
  body: string;
  recipient_type: string;
  sender_id: number;
  sent_at: string;
  email: string;
  recipient_count: number;
}

// Define the props for the modal component
interface NotificationLogViewModalProps {
  open: boolean;
  onClose: () => void;
  log: NotificationLogData | null;
}

const NotificationLogViewModal: React.FC<NotificationLogViewModalProps> = ({
  open,
  onClose,
  log,
}) => {
  // Function to format the sent_at timestamp into date and time
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="notification-log-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 650, md: 850 },
          maxHeight: "95vh",
          bgcolor: "transparent",
          borderRadius: 4,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          border: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Inner container that will scroll */}
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "calc(95vh - 64px)",
            width: "100%",
          }}
        >
          {/* Celestial Background Container */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              minHeight: "500px",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at 30% 30%, rgba(16, 177, 0, 0.1) 0%, rgba(27, 77, 62, 0.2) 100%)",
                zIndex: -1,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage:
                  "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')",
                opacity: 0.5,
                zIndex: -1,
              },
            }}
          >
            {/* Cosmic Header */}
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                color: "#fff",
                p: 3,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Typography
                  id="notification-log-modal"
                  variant="h5"
                  sx={{
                    letterSpacing: "1px",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                >
                  <NotificationsIcon fontSize="large" />
                  Notification Log Details
                </Typography>
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "#fff",
                    background: "rgba(255,255,255,0.2)",
                    "&:hover": {
                      background: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Stellar Content */}
            <Box
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                background:
                  "linear-gradient(160deg, rgba(245, 247, 250, 0.95) 0%, rgba(228, 233, 240, 0.95) 100%)",
              }}
            >
              {log ? (
                <Grid container spacing={3}>
                  {/* Notification Title */}
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      label="Title"
                      value={log.title}
                      icon={<NotificationsIcon sx={{ color: "#10B100" }} />}
                    />
                  </Grid>

                  {/* Sender Email */}
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      label="Sender Email"
                      value={log.email}
                      icon={<EmailIcon sx={{ color: "#10B100" }} />}
                    />
                  </Grid>

                  {/* Recipient Type */}
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      label="Recipient Type"
                      value={
                        log.recipient_type === "nakshatra"
                          ? "Nakshatra-Based"
                          : log.recipient_type === "rashi"
                          ? "Rashi-Based"
                          : "Specific Users"
                      }
                      icon={<StarIcon sx={{ color: "#10B100" }} />}
                    />
                  </Grid>

                  {/* Recipient Count */}
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      label="Recipient Count"
                      value={log.recipient_count}
                      icon={<GroupIcon sx={{ color: "#10B100" }} />}
                    />
                  </Grid>

                  {/* Sent Date */}
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      label="Sent Date"
                      value={formatDateTime(log.sent_at).date}
                      icon={<CalendarTodayIcon sx={{ color: "#10B100" }} />}
                    />
                  </Grid>

                  {/* Sent Time */}
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      label="Sent Time"
                      value={formatDateTime(log.sent_at).time}
                      icon={<AccessTimeIcon sx={{ color: "#10B100" }} />}
                    />
                  </Grid>

                  {/* Notification Body */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <DescriptionIcon
                          sx={{ color: "#388e3c", mr: 1, mt: "2px" }}
                        />
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                          style={{ fontFamily: "Urbanist", fontWeight: 500 }}
                        >
                          Notification Message
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ mt: 0.5 }}
                        style={{ fontFamily: "Urbanist", fontWeight: 500 }}
                      >
                        {log.body}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography
                  color="text.disabled"
                  style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                >
                  No notification data available.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NotificationLogViewModal;