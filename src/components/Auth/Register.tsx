// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Grid,
//   Link,
//   IconButton,
//   InputAdornment,
//   alpha,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from '@mui/material';
// import {
//   Visibility,
//   VisibilityOff,
//   Stars as StarsIcon,
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import { SelectChangeEvent } from "@mui/material/Select";

// // Styled components (reusing from login page)
// const RegisterWrapper = styled(Box)(() => ({
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   background: `linear-gradient(135deg, 
//   #1b4d3e 0%, 
//   #2e7d32 50%, 
//   ${alpha('#4caf50', 0.9)} 100%)`,
//   position: 'relative',
//   overflow: 'hidden',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 0L65 35L100 50L65 65L50 100L35 65L0 50L35 35Z" fill="rgba(255,255,255,0.05)"%3E%3C/path%3E%3C/svg%3E")',
//     backgroundSize: '50px 50px',
//     opacity: 0.1,
//     animation: 'rotate 240s linear infinite',
//   },
// }));

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   width: '100%',
//   maxWidth: 600,
//   borderRadius: theme.spacing(2),
//   backdropFilter: 'blur(10px)',
//   background: alpha(theme.palette.background.paper, 0.9),
//   boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
//   position: 'relative',
//   overflow: 'hidden',
//   '&::after': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: '150px',
//     height: '150px',
//     background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, transparent)`,
//     borderRadius: '0 0 0 100%',
//   },
// }));

// const LogoBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginBottom: theme.spacing(4),
//   position: 'relative',
//   '& svg': {
//     fontSize: 40,
//     color: '#2e7d32',
//     animation: 'pulse 2s infinite',
//   },
//   '@keyframes pulse': {
//     '0%': { transform: 'scale(1)', opacity: 1 },
//     '50%': { transform: 'scale(1.1)', opacity: 0.7 },
//     '100%': { transform: 'scale(1)', opacity: 1 },
//   },
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   borderRadius: theme.spacing(3),
//   padding: theme.spacing(1.5),
//   textTransform: 'none',
//   fontSize: '1.1rem',
//   background: `linear-gradient(45deg, #2e7d32, #1b4d3e)`,
//   transition: 'all 0.3s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
//   },
// }));

// interface RegisterState {
//   firstName: string;
//   lastName: string;
//   email: string;
//   mobile: string;
//   password: string;
//   confirmPassword: string;
//   role: string;
//   showPassword: boolean;
//   showConfirmPassword: boolean;
// }

// export const Register: React.FC = () => {
//   const navigate = useNavigate();
//   const [formState, setFormState] = useState<RegisterState>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     mobile: '',
//     password: '',
//     confirmPassword: '',
//     role: 'admin',
//     showPassword: false,
//     showConfirmPassword: false,
//   });

//   const handleChange = (
//     field: keyof RegisterState
//   ) => (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
//     const value = event.target.value;
//     setFormState((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // Handle registration logic here
//       navigate('/auth/login');
//     } catch (error) {
//       console.error('Registration error:', error);
//     }
//   };

//   return (
//     <RegisterWrapper>
//       <Box sx={{ width: '100%', px: 3, display: 'flex', justifyContent: 'center' }}>
//         <StyledPaper>
//           <LogoBox>
//             <StarsIcon />
//             <Typography
//               variant="h4"
//               sx={{
//                 ml: 2,
//                 fontWeight: 700,
//                 background: 'linear-gradient(45deg, #1b4d3e, #4caf50)',
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 color: 'transparent',
//               }}
//             >
//               Create Account
//             </Typography>
//           </LogoBox>

//           <Box component="form" onSubmit={handleRegister} noValidate>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="First Name"
//                   value={formState.firstName}
//                   onChange={handleChange('firstName')}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Last Name"
//                   value={formState.lastName}
//                   onChange={handleChange('lastName')}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Email Address"
//                   type="email"
//                   value={formState.email}
//                   onChange={handleChange('email')}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Mobile Number"
//                   value={formState.mobile}
//                   onChange={handleChange('mobile')}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Password"
//                   type={formState.showPassword ? 'text' : 'password'}
//                   value={formState.password}
//                   onChange={handleChange('password')}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setFormState({
//                             ...formState,
//                             showPassword: !formState.showPassword
//                           })}
//                           edge="end"
//                         >
//                           {formState.showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Confirm Password"
//                   type={formState.showConfirmPassword ? 'text' : 'password'}
//                   value={formState.confirmPassword}
//                   onChange={handleChange('confirmPassword')}
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setFormState({
//                             ...formState,
//                             showConfirmPassword: !formState.showConfirmPassword
//                           })}
//                           edge="end"
//                         >
//                           {formState.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControl fullWidth>
//                   <InputLabel>Role</InputLabel>
//                   <Select
//                     value={formState.role}
//                     label="Role"
//                     onChange={handleChange('role')}
//                     sx={{ borderRadius: 2 }}
//                   >
//                     <MenuItem value="admin">Administrator</MenuItem>
//                     <MenuItem value="manager">Manager</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>

//             <StyledButton
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 4, mb: 2 }}
//             >
//               Create Account
//             </StyledButton>

//             <Box sx={{ textAlign: 'center' }}>
//               <Link
//                 href="/auth/login"
//                 variant="body2"
//                 sx={{
//                   color: 'text.secondary',
//                   textDecoration: 'none',
//                   '&:hover': { color: '#2e7d32' },
//                 }}
//               >
//                 Already have an account? Sign in
//               </Link>
//             </Box>
//           </Box>
//         </StyledPaper>
//       </Box>
//     </RegisterWrapper>
//   );
// };

// export default Register;

export {}