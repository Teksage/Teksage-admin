import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Stars as StarsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Styled components with updated green theme
const LoginWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, 
    #1b4d3e 0%, 
    #2e7d32 50%, 
    ${alpha('#4caf50', 0.9)} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 0L65 35L100 50L65 65L50 100L35 65L0 50L35 35Z" fill="rgba(255,255,255,0.05)"%3E%3C/path%3E%3C/svg%3E")',
    backgroundSize: '50px 50px',
    opacity: 0.1,
    animation: 'rotate 240s linear infinite',
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 450,
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  background: alpha(theme.palette.background.paper, 0.9),
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '150px',
    height: '150px',
    background: `linear-gradient(135deg, ${alpha('#81c784', 0.2)}, transparent)`,
    borderRadius: '0 0 0 100%',
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '& svg': {
    fontSize: 40,
    color: '#2e7d32',
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.1)', opacity: 0.7 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5),
  textTransform: 'none',
  fontSize: '1.1rem',
  background: `linear-gradient(45deg, #2e7d32, #1b4d3e)`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px ${alpha('#2e7d32', 0.4)}`,
  },
}));

interface LoginState {
  email: string;
  password: string;
  showPassword: boolean;
}

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<LoginState>({
    email: '',
    password: '',
    showPassword: false,
  });

  const handleChange = (prop: keyof LoginState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState({ ...formState, [prop]: event.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch({ type: 'setAuth', payload: true });
      dispatch({
        type: 'login',
        payload: { name: 'Admin', role: 'Administrator', email: formState.email }
      });
      navigate('/dashboard/users');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <LoginWrapper>
      <Box sx={{ width: '100%', px: 3, display: 'flex', justifyContent: 'center' }}>
        <StyledPaper>
          <LogoBox>
            <StarsIcon />
            <Typography
              variant="h4"
              sx={{
                ml: 2,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1b4d3e, #4caf50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Astro Admin
            </Typography>
          </LogoBox>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={formState.email}
              onChange={handleChange('email')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={formState.showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formState.password}
              onChange={handleChange('password')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setFormState({
                        ...formState,
                        showPassword: !formState.showPassword
                      })}
                      edge="end"
                    >
                      {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
            >
              Sign In
            </StyledButton>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: '#2e7d32' },
                  }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                <Link
                  href="/auth/register"
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: '#2e7d32' },
                  }}
                >
                  Create new account
                </Link>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Box>
    </LoginWrapper>
  );
};

export default Login;