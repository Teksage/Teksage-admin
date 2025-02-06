import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  styled,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: 'active' | 'inactive';
}

// Styled components
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  fontSize: theme.spacing(6),
  backgroundColor: theme.palette.primary.main,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Sample data
  const [profileData, setProfileData] = React.useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1 (555) 123-4567',
    address: '123 Business Avenue, Tech City, TC 12345',
    status: 'active',
  });

  const handleChange = (field: keyof ProfileData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Profile updated:', profileData);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1100,
        }}
      >
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/dashboard/users')}
            sx={{ color: 'primary.main' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Profile Settings
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          py: 3,
        }}
      >
        <StyledPaper elevation={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: 4,
                mb: 6,
              }}
            >
              <StyledAvatar>{profileData.name[0].toUpperCase()}</StyledAvatar>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h5" gutterBottom>
                  {profileData.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Administrator
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.5,
                    bgcolor: profileData.status === 'active' ? 'success.lighter' : 'error.lighter',
                    borderRadius: '16px',
                    color: profileData.status === 'active' ? 'success.darker' : 'error.darker',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      display: 'inline-block',
                      bgcolor: profileData.status === 'active' ? 'success.main' : 'error.main',
                      mr: 1,
                    }}
                  />
                  {profileData.status.charAt(0).toUpperCase() + profileData.status.slice(1)}
                </Box>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={handleChange('name')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={profileData.email}
                  onChange={handleChange('email')}
                  variant="outlined"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={profileData.mobile}
                  onChange={handleChange('mobile')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={profileData.status}
                    onChange={handleChange('status')}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={profileData.address}
                  onChange={handleChange('address')}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Update Profile
              </Button>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </Box>
  );
};

export default Profile;