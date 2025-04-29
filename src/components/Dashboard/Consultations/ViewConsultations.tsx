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
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate, useParams } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory"; // adjust path if needed
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AnswerIcon from '@mui/icons-material/CheckCircleOutline';
import { formatTimeRange } from "../../Elements/timeCollector";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => (
  <Box sx={{ py: 1.5 }}>
    <Typography
      variant="subtitle2"
      color="text.secondary"
      sx={{ fontSize: "0.85rem" }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
      {value ?? <Typography color="text.disabled">—</Typography>}
    </Typography>
    <Divider sx={{ mt: 1.5 }} />
  </Box>
);

const ConsultationView: React.FC<{ mode: "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { consultationId } = useParams<{ consultationId: string }>();
  const [consultationData, setConsultationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeInput, setTimeInput] = useState("")

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await callAPI({
          endpoint: `api/admin/consultations/${consultationId}`,
          method: "get",
        });
        console.log(res?.data);
        setTimeInput(formatTimeRange(`${res?.data.start_time} - ${res?.data.end_time}`))
        setConsultationData(res?.data || null);
      } catch (err) {
        setConsultationData(null);
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) fetchConsultation();
  }, [consultationId]);

  return (
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
              <InfoItem label="User Name" value={consultationData.customer_name} />
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
              <InfoItem
                label="Time"
                value={timeInput}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                label="Consultation Fee"
                value={`₹${consultationData.consutation_fee}`}
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
                value={consultationData.consultation_duration}
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
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  href={consultationData.user_horoscope}
                  target="_blank"
                  sx={{ mt: 1.5, textTransform: "none", fontWeight: 500 }}
                >
                  View Horoscope
                </Button>
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
  );
};

export default ConsultationView;

const QuestionsAnswersList = ({ qaList = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = 2;

  const toggleExpanded = () => setExpanded(prev => !prev);
  const itemsToShow = expanded ? qaList : qaList.slice(0, visibleCount);

  if (qaList.length === 0) return null;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <QuestionAnswerIcon sx={{ mr: 1 }} /> Questions & Answers
      </Typography>

      <Grid container spacing={2}>
        {itemsToShow.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: '#f9fafb',
                border: '1px solid #e0e0e0'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <QuestionMarkIcon sx={{ color: '#1976d2', mr: 1, mt: '2px' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {item.question}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                <AnswerIcon sx={{ color: '#388e3c', mr: 1, mt: '2px' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
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
              {expanded ? 'Show Less' : 'Show More'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};


