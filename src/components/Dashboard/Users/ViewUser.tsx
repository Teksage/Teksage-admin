import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
  Grid,
  Paper,
  Button,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {callAPI} from '../../../api/crudFactory'; // adjust path if needed

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await callAPI({
          endpoint: `api/admin/users/${userId}`,
          method: 'get',
        });
        setUserData(res?.data || null);
      } catch (err) {
        setUserData(null);
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>User Details</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Grid container spacing={3}>
          {/* Left Profile Card */}
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
                  {/* <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {userData?.user_type || 'N/A'}
                  </Typography> */}
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

          {/* Right Info Card */}
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
    </Box>
  );
};

export default UserView;
