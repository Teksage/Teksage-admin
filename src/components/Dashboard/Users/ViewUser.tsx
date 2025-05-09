import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Paper,
  Button,
  Skeleton,
  Divider,
  Chip,
  CardActions,
  Modal,
  Avatar
} from "@mui/material";
import {
  Email,
  Phone,
  CheckCircle,
  Star,
  Brightness3,
  Person,
  LocationCity,
  CalendarToday,
  AccessTime,
  LocationOn,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { callAPI } from "../../../api/crudFactory";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import { dateFormat } from "../../Elements/DateFormat";
import { AstroChart } from "../../Elements/AstroChart";

// Material Icons
import CloseIcon from "@mui/icons-material/Close";
import StarsIcon from "@mui/icons-material/Stars";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import LanguageIcon from "@mui/icons-material/Language";
import InsightsIcon from "@mui/icons-material/Insights";
import PublicIcon from "@mui/icons-material/Public";
import DoneIcon from "@mui/icons-material/Done";
import BadgeIcon from "@mui/icons-material/Badge";

interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  status: string;
  rashi: string;
  nakshatra: string;
  plan: string;
  mobile_number: number;
  place_of_birth: string;
  date_of_birth: string;
  time_of_birth: string;
  preferred_location: string;
}

interface SubscriptionData {
  plan_name: string;
  date_of_subscription: string;
  subscription_end_date: string;
}

interface ConsultationData {
  user_horoscope: {
    rasi_chart: string;
    navamsa_chart: string;
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
    rashi: string;
    nakshatra: string;
    lagna: string;
  };
  category: string;
  languages: string[];
  booking_date: string;
  start_time: string;
  end_time: string;
  consultation_fee: string;
  rating: number;
  astrologer_name: string;
}

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | React.ReactNode | undefined;
  icon?: React.ReactNode; // Add icon prop
}) => (
  <Box sx={{ py: 1.5 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon && <Box sx={{ display: "flex", alignItems: "center", color: "#90EE90" }}>{icon}</Box>}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ fontSize: "0.85rem" }}
      >
        {label}
      </Typography>
    </Box>
    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500, pl: icon ? 4 : 0 }}>
      {value || <Typography component="span" color="text.disabled">—</Typography>}
    </Typography>
    <Divider sx={{ mt: 1.5 }} />
  </Box>
);

const UserView: React.FC<{ mode: "view" }> = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [consultationData, setConsultationData] = useState<
    ConsultationData[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await callAPI({
          endpoint: `api/admin/users/${userId}`,
          method: "get",
        });
        console.log(res?.data);
        setUserData(res?.data || null);
        setSubscriptionData(res?.data?.subscription || null);
        setConsultationData(res?.data?.events || null);
      } catch (err) {
        setUserData(null);
        setSubscriptionData(null);
        setConsultationData(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`
    : "";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          User Details
        </Typography>
      </Box>

      {/* Main Info */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "#f9f9fb",
          border: "1px solid #e0e0e0",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            transition: "box-shadow 0.3s ease",
          },
        }}
      >
        <Grid container spacing={3}>
          {/* Profile Section (Header) */}
          <Grid item xs={12}>
            <Card
              sx={{
                textAlign: "center",
                py: 3,
                px: 2,
                borderRadius: 3,
                background: "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)",
                boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                },
              }}
            >
              {loading ? (
                <>
                  <Skeleton
                    variant="circular"
                    width={100}
                    height={100}
                    sx={{ margin: "auto" }}
                  />
                  <Skeleton width="60%" sx={{ mx: "auto", mt: 2 }} />
                  <Skeleton width="40%" sx={{ mx: "auto", mt: 1 }} />
                  <Skeleton
                    width="70%"
                    sx={{ mx: "auto", mt: 3, height: 36 }}
                  />
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: "grey.500",
                      color: "#fff",
                      border: "3px solid #e0e0e0",
                      transition: "border-color 0.3s ease",
                      "&:hover": { borderColor: "#3f51b5" },
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 80 }} />
                  </Avatar>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ color: "#1a237e" }}
                  >
                    {fullName || "N/A"}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/dashboard/users/edit/${userData?.user_id}`)
                    }
                    size="large"
                    disabled={!userData}
                    sx={{
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      background:
                        "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                      color: "#fff",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
                        boxShadow: "0 4px 12px rgba(27, 77, 62, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Account Information Section */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
                backgroundColor: "#fff",
                boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    maxWidth: "50%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    fontFamily: '"Poppins", sans-serif',
                    letterSpacing: 0.5,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    color: "#1a237e",
                  }}
                >
                  Account Information
                </Typography>

                {/* Personal Information Accordion */}
                <Accordion
                  defaultExpanded
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      "&:hover": { backgroundColor: "#90EE90" },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      color="#06402B"
                    >
                      Personal Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        {loading ? (
                          <>
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={40} sx={{ mb: 1 }} />
                          </>
                        ) : (
                          <>
                            <InfoItem
                              label="Email"
                              value={userData?.email}
                              icon={<Email sx={{ color: "#90EE90", mr: 1 }} />}
                            />
                            <InfoItem
                              label="Mobile Number"
                              value={userData?.mobile_number}
                              icon={<Phone sx={{ color: "#90EE90", mr: 1 }} />}
                            />
                            <InfoItem
                              label="Status"
                              value={userData?.status}
                              icon={
                                <CheckCircle sx={{ color: "#90EE90", mr: 1 }} />
                              }
                            />
                            <InfoItem
                              label="Place of Birth"
                              value={userData?.place_of_birth}
                              icon={
                                <LocationCity
                                  sx={{ color: "#90EE90", mr: 1 }}
                                />
                              }
                            />
                          </>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {loading ? (
                          <>
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={40} sx={{ mb: 1 }} />
                          </>
                        ) : (
                          <>
                            <InfoItem
                              label="Rasi"
                              value={userData?.rashi}
                              icon={<Star sx={{ color: "#90EE90", mr: 1 }} />}
                            />
                            <InfoItem
                              label="Nakshatram"
                              value={userData?.nakshatra}
                              icon={
                                <Brightness3 sx={{ color: "#90EE90", mr: 1 }} />
                              }
                            />
                            <InfoItem
                              label="Date of Birth"
                              value={userData?.date_of_birth}
                              icon={
                                <CalendarToday
                                  sx={{ color: "#90EE90", mr: 1 }}
                                />
                              }
                            />
                            <InfoItem
                              label="Time of Birth"
                              value={userData?.time_of_birth}
                              icon={
                                <AccessTime sx={{ color: "#90EE90", mr: 1 }} />
                              }
                            />
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Professional Information Accordion */}
                <Accordion
                  defaultExpanded
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      backgroundColor: "#eceff1",
                      borderRadius: 2,
                      "&:hover": { backgroundColor: "#90EE90" },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      color="#06402B"
                    >
                      Professional Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        {loading ? (
                          <>
                            <Skeleton height={40} sx={{ mb: 1 }} />
                            <Skeleton height={40} sx={{ mb: 1 }} />
                          </>
                        ) : (
                          <>
                            <InfoItem
                              label="User Type"
                              value={userData?.user_type
                                ? userData.user_type.charAt(0).toUpperCase() + userData.user_type.slice(1)
                                : ''
                              }
                              icon={<Person sx={{ color: "#90EE90", mr: 1 }} />}
                            />
                            <InfoItem
                              label="Preferred Location"
                              value={userData?.preferred_location}
                              icon={
                                <LocationOn sx={{ color: "#90EE90", mr: 1 }} />
                              }
                            />
                          </>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {loading ? (
                          <>
                            <Skeleton height={40} sx={{ mb: 1 }} />
                          </>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Subscription Info */}
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Subscription Details
        </Typography>
        {loading ? (
          <Skeleton height={100} />
        ) : subscriptionData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <InfoItem label="Plan Name" value={subscriptionData.plan_name} />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoItem
                label="Subscribed On"
                value={dateFormat(
                  subscriptionData.date_of_subscription,
                  "DD MMM YYYY"
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoItem
                label="Ends On"
                value={dateFormat(
                  subscriptionData.subscription_end_date,
                  "DD MMM YYYY"
                )}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.disabled">
            No subscription data available.
          </Typography>
        )}
      </Paper>

      {/* Consultation Info */}
      <ConsultationDetails
        fullName={fullName}
        loading={loading}
        consultationData={consultationData}
      />
    </Box>
  );
};

const ConsultationDetails = ({ fullName, loading, consultationData }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHoroscope, setSelectedHoroscope] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(6); // Track number of visible cards

  const handleOpenModal = (horoscope: any) => {
    setSelectedHoroscope(horoscope);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedHoroscope(null);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(6, prev - 6));
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Consultation Details
        </Typography>
        {loading ? (
          <Skeleton height={120} />
        ) : consultationData && consultationData.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {consultationData
                .slice(0, visibleCount)
                .map((consultation: any, index: number) => {
                  const event = consultation.event;
                  const astrologerName = `${consultation.astrologer_first_name} ${consultation.astrologer_last_name}`;
                  const hasHoroscope = event.user_horoscope;
                  const languages = event.languages
                    ? event.languages.join(", ")
                    : "N/A";
                  const category = event.category
                    ? event.category.join(", ")
                    : "N/A";
                  const rating = event.rating || "Not Rated";

                  return (
                    <Grid item xs={12} sm={6} md={4} key={event.id || index}>
                      <Card
                        elevation={2}
                        sx={{
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          transition:
                            "transform 0.2s ease-in-out, opacity 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                          },
                          opacity: 0, // Start hidden for animation
                          animation: "fadeIn 0.5s forwards",
                          animationDelay: `${index * 0.1}s`, // Staggered animation
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color="#006400"
                          >
                            Consultation{" "}
                            <Box
                              component="span"
                              sx={{
                                backgroundColor: "rgba(16, 177, 0, 0.7)",
                                color: "white",
                                px: 1,
                                py: 0.2,
                                borderRadius: "6px",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                              }}
                            >
                              {dateFormat(event?.start_time, "DD-MMM-YYYY")}
                            </Box>
                          </Typography>

                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Category:</strong> {category}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Astrologer:</strong> {astrologerName}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Booking Date:</strong>{" "}
                              {event.booking_date || "N/A"}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Time:</strong>{" "}
                              {event.start_time && event.end_time
                                ? `${event.start_time.slice(
                                    11,
                                    16
                                  )} - ${event.end_time.slice(11, 16)}`
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Fee:</strong> ₹
                              {event.consultation_fee || 0}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              mb: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>Rating:</strong>{" "}
                            </Typography>
                            {typeof rating === "number" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  ml: 1,
                                }}
                              >
                                <StarIcon
                                  sx={{
                                    color: "#fbc02d",
                                    fontSize: 18,
                                    mr: 0.5,
                                  }}
                                />
                                <Typography variant="body2">
                                  {rating}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {rating}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Languages:</strong> {languages}
                            </Typography>
                          </Box>
                          {event.feedback && (
                            <Box sx={{ mb: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <strong>Feedback:</strong> {event.feedback}
                              </Typography>
                            </Box>
                          )}
                          {event.status && (
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={event.status.toUpperCase()}
                                color={
                                  event.status === "new" ? "info" : "default"
                                }
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                          )}
                        </CardContent>
                        {hasHoroscope && (
                          <CardActions
                            sx={{ justifyContent: "flex-end", p: 2 }}
                          >
                            <Button
                              variant="outlined"
                              startIcon={<DescriptionIcon />}
                              onClick={() =>
                                handleOpenModal(event.user_horoscope)
                              }
                              sx={{
                                borderColor: "rgba(16, 177, 0, 1)", // Primary green color from the gradient
                                color: "rgba(16, 177, 0, 1)", // Text color matches the border
                                textTransform: "none",
                                fontWeight: 500,
                                "& .MuiButton-startIcon": {
                                  color: "rgba(16, 177, 0, 1)", // Icon color matches the text
                                },
                                "&:hover": {
                                  borderColor: "rgba(27, 77, 62, 1)", // Darker green from the gradient on hover
                                  color: "rgba(27, 77, 62, 1)", // Text color matches the border on hover
                                  "& .MuiButton-startIcon": {
                                    color: "rgba(27, 77, 62, 1)", // Icon color matches on hover
                                  },
                                  transform: "scale(1.05)", // Subtle scale effect on hover
                                },
                                transition: "all 0.3s ease-in-out",
                              }}
                            >
                              View Horoscope
                            </Button>
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>

            {/* Show More/Show Less Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 4,
              }}
            >
              {visibleCount < consultationData.length && (
                <Button
                  variant="contained"
                  onClick={handleShowMore}
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  startIcon={<StarsIcon />}
                >
                  Show More
                </Button>
              )}
              {visibleCount > 6 && (
                <Button
                  variant="outlined"
                  onClick={handleShowLess}
                  sx={{
                    borderColor: "rgba(16, 177, 0, 0.5)",
                    color: "rgba(16, 177, 0, 0.9)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "rgba(16, 177, 0, 1)",
                      background: "rgba(16, 177, 0, 0.05)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  startIcon={<CloseIcon />}
                >
                  Show Less
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Typography color="text.disabled">
            No consultation data available.
          </Typography>
        )}
      </Paper>

      {/* Modal for Horoscope */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="celestial-horoscope-modal"
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
                minHeight: "700px",
                overflowY: "auto",
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
                    id="celestial-horoscope-modal"
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <StarsIcon fontSize="large" />
                    Celestial Horoscope
                  </Typography>
                  <IconButton
                    onClick={handleCloseModal}
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
                {selectedHoroscope && (
                  <>
                    {/* Cosmic Profile */}
                    <Box
                      sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: 3,
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(240,247,250,0.8) 100%)",
                        boxShadow: `
                    0 4px 6px rgba(0,0,0,0.05),
                    inset 0 0 0 1px rgba(16, 177, 0, 0.2)
                  `,
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 80,
                          height: 80,
                          background:
                            "radial-gradient(circle, rgba(16,177,0,0.1) 0%, transparent 70%)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 1.5,
                              color: "#1B4D3E",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PersonIcon fontSize="small" />
                            Cosmic Profile
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "15px",
                                color: "#00688B",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <BadgeIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                              />
                              <strong>Name:</strong> {fullName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "15px",
                                color: "#00688B",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CalendarTodayIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                              />
                              <strong>DOB:</strong>{" "}
                              {new Date(selectedHoroscope.date_of_birth)
                                .toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(",", "")}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "15px",
                                color: "#00688B",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AccessTimeIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                              />
                              <strong>Time:</strong>{" "}
                              {selectedHoroscope.time_of_birth}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 1.5,
                              color: "#1B4D3E",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PublicIcon fontSize="small" />
                            Celestial Data
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "15px",
                                color: "#00688B",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LocationOnIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                              />
                              <strong>Place:</strong>{" "}
                              {selectedHoroscope.place_of_birth}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "15px",
                                color: "#00688B",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <ScatterPlotIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                              />
                              <strong>Rasi:</strong> {selectedHoroscope.rashi}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "15px",
                                color: "#00688B",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <StarOutlineIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                              />
                              <strong>Nakshatram:</strong>{" "}
                              {selectedHoroscope.nakshatra}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "15px",
                                color: "#00688B",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LanguageIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                              />
                              <strong>Lagna:</strong> {selectedHoroscope.lagna}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Cosmic Charts */}
                    <Box
                      sx={{
                        mb: 3,
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 700,
                          color: "#1B4D3E",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          px: 3,
                          py: 1,
                          borderRadius: 50,
                          background: "rgba(16, 177, 0, 0.1)",
                          border: "1px solid rgba(16, 177, 0, 0.2)",
                        }}
                      >
                        <InsightsIcon fontSize="small" />
                        Celestial Charts
                      </Typography>
                    </Box>

                    <Grid container spacing={3} justifyContent="center">
                      {/* Rasi Chart */}
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: "rgba(255,255,255,0.7)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(16, 177, 0, 0.15)",
                            minHeight: "350px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AstroChart
                            chartHtml={selectedHoroscope.rasi_chart}
                            chartType="Rasi"
                          />
                        </Box>
                      </Grid>

                      {/* Navamsa Chart */}
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: "rgba(255,255,255,0.7)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(16, 177, 0, 0.15)",
                            minHeight: "350px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AstroChart
                            chartHtml={selectedHoroscope.navamsa_chart}
                            chartType="Navamsa"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Box>

              {/* Galactic Footer */}
              <Box
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                  textAlign: "center",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  },
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.9) 100%)",
                    color: "#1B4D3E",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 4,
                    py: 1,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(230,230,230,1) 100%)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={handleCloseModal}
                  startIcon={<DoneIcon />}
                >
                  Return to Earth
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UserView;

// Add CSS keyframes for the fade-in animation
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject the styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
