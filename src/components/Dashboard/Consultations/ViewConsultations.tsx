import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Skeleton,
  Grid,
  Divider,
  Button,
  CardActions,
  Modal,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate, useParams } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory"; // adjust path if needed
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import AnswerIcon from "@mui/icons-material/CheckCircleOutline";
import { formatTimeRange } from "../../Elements/timeCollector";
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
import { InfoItem } from "../../Elements/CommonFunctions";

const ConsultationView: React.FC<{ mode: "view" }> = () => {
  const navigate = useNavigate();
  const { consultationId } = useParams<{ consultationId: string }>();
  const [consultationData, setConsultationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeInput, setTimeInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedHoroscope, setSelectedHoroscope] = useState<{
    horoscope: any;
    customerName: string;
  } | null>(null);

  const handleOpenModal = (horoscope: any, customerName: string) => {
    setSelectedHoroscope({ horoscope, customerName });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedHoroscope(null);
  };

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await callAPI({
          endpoint: `api/admin/consultations/${consultationId}`,
          method: "get",
        });
        console.log(res?.data);
        setTimeInput(
          formatTimeRange(`${res?.data.start_datetime} - ${res?.data.end_datetime}`)
        );
        setConsultationData(res?.data || null);
      } catch (err:any) {
        console.log(err)
        setConsultationData(null);
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) fetchConsultation();
  }, [consultationId]);

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={600}>
            Consultation Details
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          {loading ? (
            <Skeleton height={200} />
          ) : consultationData ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="User Name"
                  value={consultationData.customer_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Astrologer Name"
                  value={consultationData.astrologer_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem label="Category" value={consultationData.category} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Languages"
                  value={consultationData.languages?.join(", ")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Booking Date"
                  value={consultationData.booking_date}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem label="Time" value={timeInput} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Consultation Fee"
                  value={`₹${consultationData.consultation_fee}`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Rating"
                  value={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <StarIcon
                          key={idx}
                          sx={{
                            color:
                              idx < Math.round(consultationData.rating)
                                ? "#fbc02d"
                                : "#e0e0e0",
                            fontSize: "1.3rem",
                            mr: 0.5,
                          }}
                        />
                      ))}
                      ({consultationData.rating})
                    </Box>
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Astrologer Share"
                  value={`₹${consultationData.astrologer_share}`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Astroprompt Share"
                  value={`₹${consultationData.astroprompt_share}`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem label="Status" value={consultationData.status} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  label="Consultation Duration"
                  value={`${consultationData.consultation_duration} Minutes`}
                />
              </Grid>
              {/* <Grid item xs={12}><InfoItem label="Question" value={consultationData.question} /></Grid> */}
              {/* <Grid item xs={12}><InfoItem label="Answer" value={consultationData.answer} /></Grid> */}
              <Grid item xs={12}>
                <QuestionsAnswersList qaList={consultationData?.questions} />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontSize: "0.85rem" }}
                >
                  User Horoscope
                </Typography>
                {consultationData.user_horoscope ? (
                  <CardActions sx={{ justifyContent: "flex-start", p: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DescriptionIcon />}
                      onClick={() =>
                        handleOpenModal(consultationData.user_horoscope, consultationData?.customer_name)
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
                ) : (
                  <Typography color="text.disabled" sx={{ mt: 1 }}>
                    Not available
                  </Typography>
                )}
              </Grid>
            </Grid>
          ) : (
            <Typography color="text.disabled">
              No consultation data found.
            </Typography>
          )}
        </Paper>
      </Box>

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
                minHeight: "700px", // Ensure enough space for charts
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
                              <strong>Name:</strong>{" "}
                              {selectedHoroscope.customerName}
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
                              {new Date(selectedHoroscope.horoscope.date_of_birth)
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
                              {selectedHoroscope.horoscope.time_of_birth}
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
                              {selectedHoroscope.horoscope.place_of_birth}
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
                              <strong>Rasi:</strong> {selectedHoroscope.horoscope.rashi}
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
                              {selectedHoroscope.horoscope.nakshatra}
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
                              <strong>Lagna:</strong> {selectedHoroscope.horoscope.lagna}
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
                            chartHtml={selectedHoroscope.horoscope.rasi_chart}
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
                            chartHtml={selectedHoroscope.horoscope.navamsa_chart}
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

export default ConsultationView;

const QuestionsAnswersList = ({ qaList = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = 2;

  const toggleExpanded = () => setExpanded((prev) => !prev);
  const itemsToShow = expanded ? qaList : qaList.slice(0, visibleCount);

  if (qaList.length === 0) return null;

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2, display: "flex", alignItems: "center" }}
      >
        <QuestionAnswerIcon sx={{ mr: 1 }} /> Questions & Answers
      </Typography>

      <Grid container spacing={2}>
        {itemsToShow.map((item:any, index:number) => (
          <Grid item xs={12} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#f9fafb",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <QuestionMarkIcon sx={{ color: "#1976d2", mr: 1, mt: "2px" }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {item.question}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                <AnswerIcon sx={{ color: "#388e3c", mr: 1, mt: "2px" }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Answer
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {item.answer}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}

        {qaList.length > visibleCount && (
          <Grid item xs={12}>
            <Button onClick={toggleExpanded} size="small">
              {expanded ? "Show Less" : "Show More"}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
