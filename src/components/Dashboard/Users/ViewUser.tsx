import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
  Grid,
  Paper,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface UserData {
  id: number;
  name: string;
  email: string;
  user_type: string;
  status: string;
  rasi: string;
  nakshatram: string;
  plan: string;
}

const UserView: React.FC<{ mode: 'view' }> = ({ mode }) => {
  const navigate = useNavigate();

  const sampleData: UserData = {
    id: 1,
    name: "Rahul",
    email: "rahul@test.in",
    user_type: "Admin",
    status: "Active",
    rasi: "Thulam",
    nakshatram: "Rohini",
    plan: "Premium"
  };

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <Box sx={{ py: 1.5 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );

  return (
    <Box>
      {/* Breadcrumbs Navigation */}
      {/* <Box sx={{ mb: 3 }}>
        <Breadcrumbs>
          <Link 
            color="inherit" 
            href="/users"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Users
          </Link>
          <Typography color="text.primary">View User</Typography>
        </Breadcrumbs>
      </Box> */}

      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">User Details</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* User Profile Section */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <AccountCircleIcon sx={{ fontSize: 120, color: 'grey.500', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>{sampleData.name}</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>{sampleData.user_type}</Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate(`/users/edit/${sampleData.id}`)}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </Card>
          </Grid>

          {/* User Details Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Account Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem label="Email" value={sampleData.email} />
                    <InfoItem label="Status" value={sampleData.status} />
                    <InfoItem label="Plan" value={sampleData.plan} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem label="Rasi" value={sampleData.rasi} />
                    <InfoItem label="Nakshatram" value={sampleData.nakshatram} />
                    {/* <InfoItem label="User ID" value={sampleData.id.toString()} /> */}
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