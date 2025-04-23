import React, { useEffect, useState } from 'react';
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
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {callAPI} from '../../../api/crudFactory'; // adjust path if needed
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';

interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  status: string;
  rasi: string;
  nakshatram: string;
  plan: string;
}

interface SubscriptionData {
  plan_name: string;
  date_of_subscription: string;
  subscription_end_date: string;
}

interface ConsultationData {
  user_horoscope: string;
  category: string;
  languages: string[];
  booking_date: string;
  start_time: string;
  end_time: string;
  consultation_fee: string;
  rating: number;
  astrologer_name: string;
}

const InfoItem = ({ label, value }: { label: string; value: string | undefined }) => (
  <Box sx={{ py: 1.5 }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
      {value || <Typography color="text.disabled">—</Typography>}
    </Typography>
    <Divider sx={{ mt: 1.5 }} />
  </Box>
);

const UserView: React.FC<{ mode: 'view' }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await callAPI({ endpoint: `api/admin/users/${userId}`, method: 'get' });
        setUserData(res?.data || null);
        // setSubscriptionData(res?.data?.subscription || null);
        // setConsultationData(res?.data?.consultation || null);
        setSubscriptionData({
          plan_name: 'Premium Plan',
          date_of_subscription: '2025-04-01',
          subscription_end_date: '2025-07-01'
        }
        );
        setConsultationData({
          user_horoscope: 'https://example.com/horoscope.pdf',
          category: 'Love & Relationship',
          languages: ['English', 'Hindi'],
          booking_date: '2025-04-15',
          start_time: '10:00 AM',
          end_time: '10:30 AM',
          consultation_fee: '500',
          rating: 4.5,
          astrologer_name: 'Astro Suresh'
        });
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

  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : '';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>User Details</Typography>
      </Box>

      {/* Main Info */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Grid container spacing={3}>
          {/* Left Profile */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', py: 4, px: 2 }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={100} height={100} sx={{ margin: 'auto' }} />
                  <Skeleton width="60%" sx={{ mx: 'auto', mt: 2 }} />
                  <Skeleton width="40%" sx={{ mx: 'auto', mt: 1 }} />
                  <Skeleton width="70%" sx={{ mx: 'auto', mt: 3, height: 36 }} />
                </>
              ) : (
                <>
                  <AccountCircleIcon sx={{ fontSize: 100, color: 'grey.500', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {fullName || 'N/A'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/dashboard/users/edit/${userData?.user_id}`)}
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
                </>
              )}
            </Card>
          </Grid>

          {/* Right Info */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Account Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {loading ? (
                      <>
                        <Skeleton height={30} />
                        <Skeleton height={30} />
                        <Skeleton height={30} />
                      </>
                    ) : (
                      <>
                        <InfoItem label="Email" value={userData?.email} />
                        <InfoItem label="Status" value={userData?.status} />
                        <InfoItem label="Plan" value={userData?.plan} />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {loading ? (
                      <>
                        <Skeleton height={30} />
                        <Skeleton height={30} />
                      </>
                    ) : (
                      <>
                        <InfoItem label="Rasi" value={userData?.rasi} />
                        <InfoItem label="Nakshatram" value={userData?.nakshatram} />
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Subscription Info */}
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Subscription Details</Typography>
        {loading ? (
          <Skeleton height={100} />
        ) : subscriptionData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}><InfoItem label="Plan Name" value={subscriptionData.plan_name} /></Grid>
            <Grid item xs={12} md={4}><InfoItem label="Subscribed On" value={subscriptionData.date_of_subscription} /></Grid>
            <Grid item xs={12} md={4}><InfoItem label="Ends On" value={subscriptionData.subscription_end_date} /></Grid>
          </Grid>
        ) : (
          <Typography color="text.disabled">No subscription data available.</Typography>
        )}
      </Paper>

      {/* Consultation Info */}
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Consultation Details</Typography>
        {loading ? (
          <Skeleton height={120} />
        ) : consultationData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}><InfoItem label="Category" value={consultationData.category} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Astrologer" value={consultationData.astrologer_name} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Booking Date" value={consultationData.booking_date} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Time" value={`${consultationData.start_time} - ${consultationData.end_time}`} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Fee" value={`₹${consultationData.consultation_fee}`} /></Grid>
            <Grid item xs={12} md={6}><InfoItem label="Rating" value={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: '#fbc02d', mr: 0.5 }} /> {consultationData.rating}
              </Box>
            } /></Grid>
            <Grid item xs={12}>
              <InfoItem label="Languages" value={consultationData.languages.join(', ')} />
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  href={consultationData.user_horoscope}
                  target="_blank"
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  View Horoscope
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.disabled">No consultation data available.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UserView;