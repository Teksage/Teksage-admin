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
  Divider,
  Chip,
  CardActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {callAPI} from '../../../api/crudFactory'; // adjust path if needed
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';
import { dateFormat } from '../../Elements/DateFormat';

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
        console.log(res?.data)
        setUserData(res?.data || null);
        setSubscriptionData(res?.data?.subscription || null);
        setConsultationData(res?.data?.events || null);
        // setConsultationData({
        //   user_horoscope: 'https://example.com/horoscope.pdf',
        //   category: 'Love & Relationship',
        //   languages: ['English', 'Hindi'],
        //   booking_date: '2025-04-15',
        //   start_time: '10:00 AM',
        //   end_time: '10:30 AM',
        //   consultation_fee: '500',
        //   rating: 4.5,
        //   astrologer_name: 'Astro Suresh'
        // });
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
                        {/* <InfoItem label="Plan" value={userData?.plan} /> */}
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
                        <InfoItem label="Rasi" value={userData?.rashi} />
                        <InfoItem label="Nakshatram" value={userData?.nakshatra} />
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
            <Grid item xs={12} md={4}><InfoItem label="Subscribed On" value={dateFormat(subscriptionData.date_of_subcription, "DD MMM YYYY")} /></Grid>
            <Grid item xs={12} md={4}><InfoItem label="Ends On" value={dateFormat(subscriptionData.subscription_end_date, "DD MMM YYYY")} /></Grid>
          </Grid>
        ) : (
          <Typography color="text.disabled">No subscription data available.</Typography>
        )}
      </Paper>

      {/* Consultation Info */}
      <ConsultationDetails loading={loading} consultationData={consultationData} />
      {/* <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
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
      </Paper> */}
    </Box>
  );
};

export default UserView;

const ConsultationDetails = ({ loading, consultationData }:any) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Consultation Details
      </Typography>
      {loading ? (
        <Skeleton height={120} />
      ) : consultationData && consultationData.length > 0 ? (
        <Grid container spacing={3}>
          {consultationData.map((consultation:any, index:number) => {
            const event = consultation.event;
            const astrologerName = `${consultation.astrologer_first_name} ${consultation.astrologer_last_name}`;
            const hasHoroscope = event.share_horoscope && event.user_horoscope;
            const languages = event.languages ? event.languages.join(", ") : "N/A";
            const category = event.category ? event.category.join(", ") : "N/A";
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
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} color="primary">
                      Consultation #{index+1}
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
                        <strong>Booking Date:</strong> {event.booking_date || "N/A"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Time:</strong>{" "}
                        {event.start_time && event.end_time
                          ? `${event.start_time.slice(11, 16)} - ${event.end_time.slice(11, 16)}`
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Fee:</strong> ₹{event.consutation_fee || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Rating:</strong>{" "}
                      </Typography>
                      {typeof rating === "number" ? (
                        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                          <StarIcon sx={{ color: "#fbc02d", fontSize: 18, mr: 0.5 }} />
                          <Typography variant="body2">{rating}</Typography>
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
                        <Typography variant="body2" color="text.secondary">
                          <strong>Feedback:</strong> {event.feedback}
                        </Typography>
                      </Box>
                    )}
                    {event.status && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={event.status.toUpperCase()}
                          color={event.status === "new" ? "info" : "default"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    )}
                  </CardContent>
                  {hasHoroscope && (
                    <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<DescriptionIcon />}
                        href={event.user_horoscope.horoscope_details}
                        target="_blank"
                        sx={{ textTransform: "none", fontWeight: 500 }}
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
      ) : (
        <Typography color="text.disabled">No consultation data available.</Typography>
      )}
    </Paper>
  );
};