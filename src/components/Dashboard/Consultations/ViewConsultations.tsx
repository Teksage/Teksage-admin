import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Skeleton,
  Grid,
  Divider,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate, useParams } from 'react-router-dom';
import { callAPI } from '../../../api/crudFactory'; // adjust path if needed

const InfoItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <Box sx={{ py: 1.5 }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
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

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await callAPI({
          endpoint: `api/admin/consultations/${consultationId}`,
          method: 'get'
        });
        setConsultationData(res?.data || null);
        setConsultationData({
            first_name: 'Rahul Sharma',
            astrologer_name: 'Astro Meera',
            user_horoscope: 'https://example.com/horoscope.pdf',
            category: 'Career Guidance',
            languages: ['English', 'Tamil'],
            booking_date: '2025-04-20',
            start_time: '2:00 PM',
            end_time: '2:30 PM',
            consultation_fee: '750',
            rating: 4.2,
            astrologer_share: '525',
            astroprompt_share: '225',
            status: 'Completed',
            consultation_duration: '30 mins',
            question: 'Will I get a job abroad?',
            answer: 'Yes, there are chances after June 2025 based on your planetary positions.'
          });
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>Consultation Details</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {loading ? (
          <Skeleton height={200} />
        ) : consultationData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}><InfoItem label="User Name" value={consultationData.first_name} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Astrologer Name" value={consultationData.astrologer_name} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Category" value={consultationData.category} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Languages" value={consultationData.languages?.join(', ')} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Booking Date" value={consultationData.booking_date} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Time" value={`${consultationData.start_time} - ${consultationData.end_time}`} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Consultation Fee" value={`₹${consultationData.consultation_fee}`} /></Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                label="Rating"
                value={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <StarIcon
                        key={idx}
                        sx={{
                          color: idx < Math.round(consultationData.rating) ? '#fbc02d' : '#e0e0e0',
                          fontSize: '1.3rem',
                          mr: 0.5
                        }}
                      />
                    ))}
                    ({consultationData.rating})
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} md={6}><InfoItem label="Astrologer Share" value={`₹${consultationData.astrologer_share}`} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Astroprompt Share" value={`₹${consultationData.astroprompt_share}`} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Status" value={consultationData.status} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Consultation Duration" value={consultationData.consultation_duration} /></Grid>
            <Grid item xs={12}><InfoItem label="Question" value={consultationData.question} /></Grid>
            <Grid item xs={12}><InfoItem label="Answer" value={consultationData.answer} /></Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>User Horoscope</Typography>
              {consultationData.user_horoscope ? (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  href={consultationData.user_horoscope}
                  target="_blank"
                  sx={{ mt: 1.5, textTransform: 'none', fontWeight: 500 }}
                >
                  View Horoscope
                </Button>
              ) : (
                <Typography color="text.disabled" sx={{ mt: 1 }}>Not available</Typography>
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.disabled">No consultation data found.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ConsultationView;
