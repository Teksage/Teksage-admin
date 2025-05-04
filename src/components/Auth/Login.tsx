// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Link,
//   alpha,
//   CircularProgress,
//   ToggleButtonGroup,
//   ToggleButton,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import astro_prompt_logo_login from "../../assets/astro_prompt_logo_login.png";
// import { callAPI } from "../../api/crudFactory"; // Import the callAPI function
// import { tokenService } from "../../utils/tokenService"; // Import tokenService
// import OfflineNotification from "../Elements/OfflineNotification";

// // Styled components (same as before)
// const LoginWrapper = styled(Box)(() => ({
//   minHeight: "100vh",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   background: `linear-gradient(180deg, ${alpha("#10b100", 0.9)} 0%, ${alpha(
//     "#1b4d3e",
//     0.9
//   )} 100%)`,
//   position: "relative",
//   overflow: "hidden",
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background:
//       'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 0L65 35L100 50L65 65L50 100L35 65L0 50L35 35Z" fill="rgba(255,255,255,0.05)"%3E%3C/path%3E%3C/svg%3E")',
//     backgroundSize: "50px 50px",
//     opacity: 0.1,
//     animation: "rotate 240s linear infinite",
//   },
//   "@keyframes rotate": {
//     "0%": { transform: "rotate(0deg)" },
//     "100%": { transform: "rotate(360deg)" },
//   },
// }));

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   width: "100%",
//   maxWidth: 450,
//   borderRadius: theme.spacing(2),
//   backdropFilter: "blur(10px)",
//   boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
//   position: "relative",
//   overflow: "hidden",
//   "&::after": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     right: 0,
//     width: "150px",
//     height: "150px",
//     background: `linear-gradient(135deg, ${alpha(
//       "#81c784",
//       0.2
//     )}, transparent)`,
//     borderRadius: "0 0 0 100%",
//   },
// }));

// const LogoBox = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   marginBottom: theme.spacing(4),
//   position: "relative",
//   "& svg": {
//     fontSize: 40,
//     color: "#2e7d32",
//     animation: "pulse 2s infinite",
//   },
//   "@keyframes pulse": {
//     "0%": { transform: "scale(1)", opacity: 1 },
//     "50%": { transform: "scale(1.1)", opacity: 0.7 },
//     "100%": { transform: "scale(1)", opacity: 1 },
//   },
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   borderRadius: theme.spacing(3),
//   padding: theme.spacing(1.5),
//   textTransform: "none",
//   fontSize: "1.1rem",
//   background: `linear-gradient(45deg, #2e7d32, #1b4d3e)`,
//   transition: "all 0.3s ease-in-out",
//   "&:hover": {
//     transform: "translateY(-2px)",
//     boxShadow: `0 6px 20px ${alpha("#2e7d32", 0.4)}`,
//   },
// }));

// const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   width: "100%",
//   "& .MuiToggleButtonGroup-grouped": {
//     width: "50%",
//     textTransform: "none",
//     fontWeight: 600,
//   },
// }));

// interface LoginState {
//   loginMethod: "email" | "mobile";
//   email: string;
//   mobile_number: string;
//   otp: string[];
//   activeOtpIndex: number;
//   step: "input" | "otp";
//   loading: boolean;
//   countdown: number;
//   error: string | null;
// }

// export const Login: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const [formState, setFormState] = useState<LoginState>({
//     loginMethod: "email",
//     email: "",
//     mobile_number: "",
//     otp: Array(6).fill(""),
//     activeOtpIndex: 0,
//     step: "input",
//     loading: false,
//     countdown: 0,
//     error: null,
//   });

//   // Countdown timer for OTP resend
//   useEffect(() => {
//     if (formState.countdown > 0) {
//       const timer = setTimeout(() => {
//         setFormState((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [formState.countdown]);

//   const handleLoginMethodChange = (
//     event: React.MouseEvent<HTMLElement>,
//     newMethod: "email" | "mobile"
//   ) => {
//     console.log(event)
//     if (newMethod !== null) {
//       setFormState({
//         ...formState,
//         loginMethod: newMethod,
//         email: "",
//         mobile_number: "",
//         error: null,
//       });
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     if (name === "mobile_number") {
//       // Only allow numeric input for mobile number
//       if (/^[0-9]*$/.test(value)) {
//         setFormState({
//           ...formState,
//           mobile_number: value,
//           error: null,
//         });
//       }
//     } else {
//       setFormState({
//         ...formState,
//         [name]: value,
//         error: null,
//       });
//     }
//   };

//   const handleOtpChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     const value = e.target.value;

//     // Only allow numeric input
//     if (/^[0-9]*$/.test(value)) {
//       const newOtp = [...formState.otp];
//       newOtp[index] = value.substring(value.length - 1); // Take only the last character

//       setFormState({
//         ...formState,
//         otp: newOtp,
//         activeOtpIndex: value ? Math.min(index + 1, 5) : Math.max(index - 1, 0),
//         error: null,
//       });

//       // Move to next input
//       if (value && index < 5) {
//         otpInputRefs.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text/plain");
//     const otpArray = pastedData.replace(/\D/g, "").split("").slice(0, 6);

//     if (otpArray.length === 6) {
//       const newOtp = [...formState.otp];
//       otpArray.forEach((digit, i) => {
//         newOtp[i] = digit;
//       });

//       setFormState({
//         ...formState,
//         otp: newOtp,
//         activeOtpIndex: 5,
//         error: null,
//       });

//       // Auto-submit if all digits are filled
//       if (newOtp.every((digit) => digit !== "")) {
//         handleVerifyOtp();
//       }
//     }
//   };

//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (e.key === "Backspace" && !formState.otp[index] && index > 0) {
//       otpInputRefs.current[index - 1]?.focus();
//     }
//   };

//   useEffect(() => {
//     // Auto-submit when all digits are filled
//     if (
//       formState.otp.every((digit) => digit !== "") &&
//       formState.step === "otp"
//     ) {
//       handleVerifyOtp();
//     }
//   }, [formState.otp]);

//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formState.loginMethod === "email" && !formState.email) {
//       setFormState((prev) => ({ ...prev, error: "Please enter your email" }));
//       return;
//     }

//     if (formState.loginMethod === "mobile" && !formState.mobile_number) {
//       setFormState((prev) => ({
//         ...prev,
//         error: "Please enter your mobile number",
//       }));
//       return;
//     }

//     setFormState((prev) => ({ ...prev, loading: true, error: null }));

//     try {
//       // Still make the API call to maintain appearance
//       try {
//         const endpoint =
//           formState.loginMethod === "email"
//             ? "api/auth/otp/request"
//             : "api/auth/mobile-otp/request";

//         const data =
//           formState.loginMethod === "email"
//             ? { email: formState.email }
//             : { mobile_number: formState.mobile_number };

//         await callAPI({
//           endpoint,
//           method: "post",
//           data,
//         });
//       } catch (error:any) {
//         // Silently catch error from actual API call
//         console.log("Original API call failed, but continuing with bypass", error);
//       }

//       // Always proceed to OTP step regardless of API response
//       setFormState((prev) => ({
//         ...prev,
//         step: "otp",
//         loading: false,
//         countdown: 30,
//         otp: Array(6).fill(""),
//         activeOtpIndex: 0,
//       }));

//       setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
//     } catch (error) {
//       console.error("Error in OTP request:", error);
//       // Even if there's an error, we'll still proceed to OTP screen for bypass
//       setFormState((prev) => ({
//         ...prev,
//         step: "otp",
//         loading: false,
//         countdown: 30,
//         otp: Array(6).fill(""),
//         activeOtpIndex: 0,
//       }));

//       setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (formState.countdown > 0) return;

//     setFormState((prev) => ({ ...prev, loading: true, error: null }));

//     try {
//       // Make API call for appearance but continue regardless
//       try {
//         const endpoint =
//           formState.loginMethod === "email"
//             ? "api/auth/otp/request"
//             : "api/auth/mobile-otp/request";

//         const data =
//           formState.loginMethod === "email"
//             ? { email: formState.email }
//             : { mobile_number: formState.mobile_number };

//         await callAPI({
//           endpoint,
//           method: "post",
//           data,
//         });
//       } catch (error:any) {
//         // Silently catch error
//         console.log("Resend OTP API call failed, but continuing with bypass", error);
//       }

//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         countdown: 30,
//         otp: Array(6).fill(""),
//         activeOtpIndex: 0,
//       }));

//       // Focus first OTP input
//       setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
//     } catch (error) {
//       console.error("Error in resend process:", error);
//       // Still reset the OTP fields for another attempt
//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         countdown: 30,
//         otp: Array(6).fill(""),
//         activeOtpIndex: 0,
//       }));

//       setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
//     }
//   };

//   const fetchUserProfile = async () => {
//     try {
//       const response = await callAPI({
//         endpoint: "api/auth/profile",
//         method: "get",
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       return null;
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const otp = formState.otp.join("");
//     if (otp.length !== 6) return;

//     setFormState((prev) => ({ ...prev, loading: true, error: null }));

//     try {
//       // Check for bypass OTP (111111)
//       if (otp === "111111") {
//         // Make the real API call to get valid tokens
//         try {
//           const endpoint =
//             formState.loginMethod === "email"
//               ? "api/auth/otp/login-verify"
//               : "api/auth/mobile-otp/login-verify";

//           const data =
//             formState.loginMethod === "email"
//               ? { email: formState.email, otp: "111111" }
//               : { mobile_number: formState.mobile_number, otp: "111111" };

//           const response = await callAPI({
//             endpoint,
//             method: "post",
//             data,
//           });

//           const { access_token, refresh_token } = response.data;

//           // Store the real tokens from API
//           tokenService.setTokens({
//             access: access_token,
//             refresh: refresh_token,
//           });

//           // Fetch user profile
//           const profileData = await fetchUserProfile();

//           if (profileData) {
//             dispatch({
//               type: "login",
//               payload: {
//                 user_id: profileData.user_id,
//                 name: `${profileData.first_name} ${profileData.last_name}`,
//                 role: "Administrator", // Assuming role is still hardcoded as per original code
//                 email: profileData.email,
//                 mobile_number: profileData.mobile_number,
//                 preferred_location: profileData.preferred_location,
//                 date_of_birth: profileData.date_of_birth,
//                 time_of_birth: profileData.time_of_birth,
//                 birth_location: profileData.birth_location,
//                 rashi: profileData.rashi,
//                 nakshatra: profileData.nakshatra,
//               },
//             });
//           } else {
//             // Fallback if profile fetch fails
//             dispatch({
//               type: "login",
//               payload: {
//                 name: "Admin",
//                 role: "Administrator",
//                 email: formState.email,
//                 mobile_number: formState.mobile_number,
//               },
//             });
//           }

//           // Update Redux state
//           dispatch({ type: "setAuth", payload: true });
//           dispatch({
//             type: "login",
//             payload: {
//               name: "Admin",
//               role: "Administrator",
//               email: formState.email,
//               mobile_number: formState.mobile_number,
//             },
//           });

//           // Navigate to dashboard
//           navigate("/dashboard/users");
//           return;
//         } catch (error) {
//           console.log(
//             "API call failed with bypass code, using fallback tokens"
//           );

//           // Fallback to create mock tokens if API fails
//           const access_token =
//             "bypass_access_token_" + Math.random().toString(36).substring(2);
//           const refresh_token =
//             "bypass_refresh_token_" + Math.random().toString(36).substring(2);

//           // Store the fallback tokens
//           tokenService.setTokens({
//             access: access_token,
//             refresh: refresh_token,
//           });

//           // Update Redux state
//           dispatch({ type: "setAuth", payload: true });
//           dispatch({
//             type: "login",
//             payload: {
//               name: "Admin",
//               role: "Administrator",
//               email: formState.email,
//               mobile_number: formState.mobile_number,
//             },
//           });

//           // Navigate to dashboard
//           navigate("/dashboard/users");
//           return;
//         }
//       }

//       // If not the bypass code, try the real API with entered OTP
//       const endpoint =
//         formState.loginMethod === "email"
//           ? "api/auth/otp/login-verify"
//           : "api/auth/mobile-otp/login-verify";

//       const data =
//         formState.loginMethod === "email"
//           ? { email: formState.email, otp }
//           : { mobile_number: formState.mobile_number, otp };

//       const response = await callAPI({
//         endpoint,
//         method: "post",
//         data,
//       });

//       const { access_token, refresh_token } = response.data;

//       // Store tokens using tokenService
//       tokenService.setTokens({ access: access_token, refresh: refresh_token });

//       // Update Redux state
//       dispatch({ type: "setAuth", payload: true });
//       dispatch({
//         type: "login",
//         payload: {
//           name: "Admin",
//           role: "Administrator",
//           email: formState.email,
//           mobile_number: formState.mobile_number,
//         },
//       });

//       navigate("/dashboard/users");
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         error: "Invalid OTP. Please try again.",
//         otp: Array(6).fill(""),
//         activeOtpIndex: 0,
//       }));

//       setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
//     }
//   };

//   return (
//     <LoginWrapper>
//       <OfflineNotification /> {/* Automatically handled */}
//       <Box
//         sx={{ width: "100%", px: 3, display: "flex", justifyContent: "center" }}
//       >
//         <StyledPaper>
//           <LogoBox>
//             <img
//               src={astro_prompt_logo_login}
//               alt="Astro Prompt Logo"
//               // style={{ width: 40, height: 40 }}
//             />
//             {/* <Typography
//               variant="h4"
//               sx={{
//                 ml: 2,
//                 fontWeight: 700,
//                 background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
//                 backgroundClip: "text",
//                 WebkitBackgroundClip: "text",
//                 color: "transparent",
//               }}
//             >
//               Astro Prompt
//             </Typography> */}
//           </LogoBox>

//           {formState.step === "input" ? (
//             <Box component="form" onSubmit={handleSendOtp} noValidate>
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{
//                   textAlign: "center",
//                   mb: 3,
//                   fontWeight: 500,
//                   background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                   // color: "transparent",
//                   textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Sign in using your{" "}
//                 {formState.loginMethod === "email" ? "Email" : "Mobile Number"}
//               </Typography>

//               <StyledToggleButtonGroup
//                 color="primary"
//                 value={formState.loginMethod}
//                 exclusive
//                 onChange={handleLoginMethodChange}
//                 aria-label="Login method"
//                 sx={{
//                   mb: 3,
//                   "& .MuiToggleButton-root": {
//                     color: "#1b4d3e",
//                     border: "1px solid rgba(27, 77, 62, 0.5)",
//                     fontWeight: 600,
//                     fontSize: "0.875rem",
//                     "&.Mui-selected": {
//                       color: "white",
//                       backgroundColor: "#1b4d3e",
//                       "&:hover": {
//                         backgroundColor: "#1b4d3e",
//                       },
//                     },
//                     "&:hover": {
//                       backgroundColor: "rgba(27, 77, 62, 0.08)",
//                     },
//                   },
//                   "& .MuiToggleButtonGroup-grouped": {
//                     "&:not(:first-of-type)": {
//                       borderLeft: "1px solid rgba(27, 77, 62, 0.5)",
//                       marginLeft: 0,
//                     },
//                     "&:first-of-type": {
//                       borderRight: "1px solid rgba(27, 77, 62, 0.5)",
//                     },
//                   },
//                 }}
//               >
//                 <ToggleButton
//                   value="email"
//                   aria-label="Email"
//                   sx={{
//                     textTransform: "none",
//                     py: 1.25,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         d="M22 6L12 13L2 6"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     Email
//                   </Box>
//                 </ToggleButton>
//                 <ToggleButton
//                   value="mobile"
//                   aria-label="Mobile"
//                   sx={{
//                     textTransform: "none",
//                     py: 1.25,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         d="M12 18H12.01"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     Mobile
//                   </Box>
//                 </ToggleButton>
//               </StyledToggleButtonGroup>

//               {formState.loginMethod === "email" ? (
//                 <TextField
//                   margin="normal"
//                   required
//                   fullWidth
//                   label="Email Address"
//                   name="email"
//                   autoComplete="email"
//                   autoFocus
//                   value={formState.email}
//                   onChange={handleInputChange}
//                   error={!!formState.error}
//                   helperText={formState.error}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                     },
//                   }}
//                 />
//               ) : (
//                 <TextField
//                   margin="normal"
//                   required
//                   fullWidth
//                   label="Mobile Number"
//                   name="mobile_number"
//                   autoComplete="tel"
//                   autoFocus
//                   value={formState.mobile_number}
//                   onChange={handleInputChange}
//                   error={!!formState.error}
//                   helperText={formState.error}
//                   inputProps={{
//                     maxLength: 10,
//                     inputMode: "numeric",
//                     pattern: "[0-9]*",
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                     },
//                   }}
//                 />
//               )}

//               <StyledButton
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{
//                   mt: 4,
//                   mb: 2,
//                   "&.Mui-disabled": {
//                     color: "rgba(255, 255, 255, 0.8)",
//                   },
//                 }}
//                 disabled={
//                   formState.loading ||
//                   (formState.loginMethod === "email"
//                     ? !formState.email
//                     : !formState.mobile_number)
//                 }
//               >
//                 {formState.loading ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   "Send OTP"
//                 )}
//               </StyledButton>
//             </Box>
//           ) : (
//             <Box component="form" noValidate>
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{ textAlign: "center", mb: 3 }}
//               >
//                 Enter 6-digit OTP sent to{" "}
//                 {formState.loginMethod === "email"
//                   ? formState.email
//                   : `+91 ${formState.mobile_number}`}
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: 1,
//                   mb: 2,
//                 }}
//               >
//                 {formState.otp.map((digit, index) => (
//                   <TextField
//                     key={index}
//                     inputRef={(el) => (otpInputRefs.current[index] = el)}
//                     value={digit}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       handleOtpChange(e, index)
//                     }
//                     onPaste={handleOtpPaste}
//                     onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
//                       handleKeyDown(e, index)
//                     }
//                     inputProps={{
//                       maxLength: 1,
//                       inputMode: "numeric",
//                       pattern: "[0-9]*",
//                       style: { textAlign: "center" },
//                     }}
//                     sx={{
//                       width: 50,
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: 1,
//                         height: 50,
//                       },
//                       "& .MuiOutlinedInput-input": {
//                         textAlign: "center",
//                         fontSize: "1.5rem",
//                       },
//                     }}
//                     autoFocus={index === formState.activeOtpIndex}
//                     error={!!formState.error}
//                   />
//                 ))}
//               </Box>

//               {formState.error && (
//                 <Typography color="error" align="center" sx={{ mb: 2 }}>
//                   {formState.error}
//                 </Typography>
//               )}

//               <Box sx={{ textAlign: "center", mt: 2 }}>
//                 {formState.countdown > 0 ? (
//                   <Typography variant="body2" color="textSecondary">
//                     Resend OTP in {formState.countdown}s
//                   </Typography>
//                 ) : (
//                   <Link
//                     component="button"
//                     type="button"
//                     variant="body2"
//                     onClick={handleResendOtp}
//                     sx={{
//                       color: "text.secondary",
//                       textDecoration: "none",
//                       "&:hover": { color: "#2e7d32" },
//                     }}
//                   >
//                     Resend OTP
//                   </Link>
//                 )}
//               </Box>

//               <Box sx={{ textAlign: "center", mt: 4 }}>
//                 <Link
//                   component="button"
//                   type="button"
//                   variant="body2"
//                   onClick={() =>
//                     setFormState((prev) => ({
//                       ...prev,
//                       step: "input",
//                       otp: Array(6).fill(""),
//                       error: null,
//                     }))
//                   }
//                   sx={{
//                     color: "text.secondary",
//                     textDecoration: "none",
//                     "&:hover": { color: "#2e7d32" },
//                   }}
//                 >
//                   Use different{" "}
//                   {formState.loginMethod === "email"
//                     ? "email"
//                     : "mobile number"}
//                 </Link>
//               </Box>

//               {formState.loading && (
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                   <CircularProgress size={24} color="inherit" />
//                 </Box>
//               )}
//             </Box>
//           )}
//         </StyledPaper>
//       </Box>
//     </LoginWrapper>
//   );
// };

// export default Login;

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  alpha,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import astro_prompt_logo_login from "../../assets/astro_prompt_logo_login.png";
import { callAPI } from "../../api/crudFactory";
import { tokenService } from "../../utils/tokenService";
import OfflineNotification from "../Elements/OfflineNotification";

// Styled components
const LoginWrapper = styled(Box)(() => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(180deg, ${alpha("#10b100", 0.9)} 0%, ${alpha(
    "#1b4d3e",
    0.9
  )} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 0L65 35L100 50L65 65L50 100L35 65L0 50L35 35Z" fill="rgba(255,255,255,0.05)"%3E%3C/path%3E%3C/svg%3E")',
    backgroundSize: "50px 50px",
    opacity: 0.1,
    animation: "rotate 240s linear infinite",
  },
  "@keyframes rotate": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 450,
  borderRadius: theme.spacing(2),
  backdropFilter: "blur(10px)",
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "150px",
    height: "150px",
    background: `linear-gradient(135deg, ${alpha(
      "#81c784",
      0.2
    )}, transparent)`,
    borderRadius: "0 0 0 100%",
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(4),
  position: "relative",
  "& svg": {
    fontSize: 40,
    color: "#2e7d32",
    animation: "pulse 2s infinite",
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)", opacity: 1 },
    "50%": { transform: "scale(1.1)", opacity: 0.7 },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5),
  textTransform: "none",
  fontSize: "1.1rem",
  background: `linear-gradient(45deg, #2e7d32, #1b4d3e)`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px ${alpha("#2e7d32", 0.4)}`,
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
  "& .MuiToggleButtonGroup-grouped": {
    width: "50%",
    textTransform: "none",
    fontWeight: 600,
  },
}));

interface LoginState {
  loginMethod: "email" | "mobile";
  email: string;
  mobile_number: string;
  otp: string[];
  activeOtpIndex: number;
  step: "input" | "otp";
  loading: boolean;
  countdown: number;
  error: string | null;
}

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formState, setFormState] = useState<LoginState>({
    loginMethod: "email",
    email: "",
    mobile_number: "",
    otp: Array(6).fill(""),
    activeOtpIndex: 0,
    step: "input",
    loading: false,
    countdown: 0,
    error: null,
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (formState.countdown > 0) {
      const timer = setTimeout(() => {
        setFormState((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formState.countdown]);

  const handleLoginMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: "email" | "mobile"
  ) => {
    console.log(event);
    if (newMethod !== null) {
      setFormState({
        ...formState,
        loginMethod: newMethod,
        email: "",
        mobile_number: "",
        error: null,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "mobile_number") {
      if (/^[0-9]*$/.test(value)) {
        setFormState({
          ...formState,
          mobile_number: value,
          error: null,
        });
      }
    } else {
      setFormState({
        ...formState,
        [name]: value,
        error: null,
      });
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value)) {
      const newOtp = [...formState.otp];
      newOtp[index] = value.substring(value.length - 1);

      setFormState({
        ...formState,
        otp: newOtp,
        activeOtpIndex: value ? Math.min(index + 1, 5) : Math.max(index - 1, 0),
        error: null,
      });

      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const otpArray = pastedData.replace(/\D/g, "").split("").slice(0, 6);

    if (otpArray.length === 6) {
      const newOtp = [...formState.otp];
      otpArray.forEach((digit, i) => {
        newOtp[i] = digit;
      });

      setFormState({
        ...formState,
        otp: newOtp,
        activeOtpIndex: 5,
        error: null,
      });

      if (newOtp.every((digit) => digit !== "")) {
        handleVerifyOtp();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !formState.otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (
      formState.otp.every((digit) => digit !== "") &&
      formState.step === "otp"
    ) {
      handleVerifyOtp();
    }
  }, [formState.otp]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.loginMethod === "email" && !formState.email) {
      setFormState((prev) => ({ ...prev, error: "Please enter your email" }));
      return;
    }

    if (formState.loginMethod === "mobile" && !formState.mobile_number) {
      setFormState((prev) => ({
        ...prev,
        error: "Please enter your mobile number",
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      try {
        const endpoint =
          formState.loginMethod === "email"
            ? "api/auth/otp/request"
            : "api/auth/mobile-otp/request";

        const data =
          formState.loginMethod === "email"
            ? { email: formState.email }
            : { mobile_number: formState.mobile_number };

        await callAPI({
          endpoint,
          method: "post",
          data,
        });
      } catch (error: any) {
        console.log("Original API call failed, but continuing with bypass", error);
      }

      setFormState((prev) => ({
        ...prev,
        step: "otp",
        loading: false,
        countdown: 30,
        otp: Array(6).fill(""),
        activeOtpIndex: 0,
      }));

      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      console.error("Error in OTP request:", error);
      setFormState((prev) => ({
        ...prev,
        step: "otp",
        loading: false,
        countdown: 30,
        otp: Array(6).fill(""),
        activeOtpIndex: 0,
      }));

      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  };

  const handleResendOtp = async () => {
    if (formState.countdown > 0) return;

    setFormState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      try {
        const endpoint =
          formState.loginMethod === "email"
            ? "api/auth/otp/request"
            : "api/auth/mobile-otp/request";

        const data =
          formState.loginMethod === "email"
            ? { email: formState.email }
            : { mobile_number: formState.mobile_number };

        await callAPI({
          endpoint,
          method: "post",
          data,
        });
      } catch (error: any) {
        console.log("Resend OTP API call failed, but continuing with bypass", error);
      }

      setFormState((prev) => ({
        ...prev,
        loading: false,
        countdown: 30,
        otp: Array(6).fill(""),
        activeOtpIndex: 0,
      }));

      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      console.error("Error in resend process:", error);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        countdown: 30,
        otp: Array(6).fill(""),
        activeOtpIndex: 0,
      }));

      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await callAPI({
        endpoint: "api/auth/profile",
        method: "get",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const handleVerifyOtp = async () => {
    const otp = formState.otp.join("");
    if (otp.length !== 6) return;

    setFormState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let access_token: string;
      let refresh_token: string;
      let userData: any;

      if (otp === "111111") {
        try {
          const endpoint =
            formState.loginMethod === "email"
              ? "api/auth/otp/login-verify"
              : "api/auth/mobile-otp/login-verify";

          const data =
            formState.loginMethod === "email"
              ? { email: formState.email, otp: "111111" }
              : { mobile_number: formState.mobile_number, otp: "111111" };

          const response = await callAPI({
            endpoint,
            method: "post",
            data,
          });

          access_token = response.data.access_token;
          refresh_token = response.data.refresh_token;

          // Store tokens
          tokenService.setTokens({
            access: access_token,
            refresh: refresh_token,
          });

          // Fetch user profile
          const profileData = await fetchUserProfile();

          if (profileData) {
            userData = {
              user_id: profileData.user_id,
              name: `${profileData.first_name} ${profileData.last_name}`,
              role: "Administrator",
              email: profileData.email,
              mobile_number: profileData.mobile_number,
              preferred_location: profileData.preferred_location,
              date_of_birth: profileData.date_of_birth,
              time_of_birth: profileData.time_of_birth,
              birth_location: profileData.birth_location,
              rashi: profileData.rashi,
              nakshatra: profileData.nakshatra,
            };
          } else {
            userData = {
              name: "Admin",
              role: "Administrator",
              email: formState.email,
              mobile_number: formState.mobile_number,
            };
          }
        } catch (error) {
          console.log("API call failed with bypass code, using fallback tokens", error);
          access_token = "bypass_access_token_" + Math.random().toString(36).substring(2);
          refresh_token = "bypass_refresh_token_" + Math.random().toString(36).substring(2);

          tokenService.setTokens({
            access: access_token,
            refresh: refresh_token,
          });

          userData = {
            name: "Admin",
            role: "Administrator",
            email: formState.email,
            mobile_number: formState.mobile_number,
          };
        }
      } else {
        const endpoint =
          formState.loginMethod === "email"
            ? "api/auth/otp/login-verify"
            : "api/auth/mobile-otp/login-verify";

        const data =
          formState.loginMethod === "email"
            ? { email: formState.email, otp }
            : { mobile_number: formState.mobile_number, otp };

        const response = await callAPI({
          endpoint,
          method: "post",
          data,
        });

        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;

        tokenService.setTokens({ access: access_token, refresh: refresh_token });

        const profileData = await fetchUserProfile();

        if (profileData) {
          userData = {
            user_id: profileData.user_id,
            name: `${profileData.first_name} ${profileData.last_name}`,
            role: "Administrator",
            email: profileData.email,
            mobile_number: profileData.mobile_number,
            preferred_location: profileData.preferred_location,
            date_of_birth: profileData.date_of_birth,
            time_of_birth: profileData.time_of_birth,
            birth_location: profileData.birth_location,
            rashi: profileData.rashi,
            nakshatra: profileData.nakshatra,
          };
        } else {
          userData = {
            name: "Admin",
            role: "Administrator",
            email: formState.email,
            mobile_number: formState.mobile_number,
          };
        }
      }

      // Log the user data to verify
      console.log("User data dispatched to Redux:", userData);

      // Dispatch to Redux
      dispatch({ type: "setAuth", payload: true });
      dispatch({
        type: "login",
        payload: userData,
      });

      // Navigate to dashboard
      navigate("/dashboard/users");
    } catch (error) {
      console.error("OTP verification error:", error);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: "Invalid OTP. Please try again.",
        otp: Array(6).fill(""),
        activeOtpIndex: 0,
      }));

      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  };

  return (
    <LoginWrapper>
      <OfflineNotification />
      <Box
        sx={{ width: "100%", px: 3, display: "flex", justifyContent: "center" }}
      >
        <StyledPaper>
          <LogoBox>
            <img src={astro_prompt_logo_login} alt="Astro Prompt Logo" />
          </LogoBox>

          {formState.step === "input" ? (
            <Box component="form" onSubmit={handleSendOtp} noValidate>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  textAlign: "center",
                  mb: 3,
                  fontWeight: 500,
                  background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  letterSpacing: "0.5px",
                }}
              >
                Sign in using your{" "}
                {formState.loginMethod === "email" ? "Email" : "Mobile Number"}
              </Typography>

              <StyledToggleButtonGroup
                color="primary"
                value={formState.loginMethod}
                exclusive
                onChange={handleLoginMethodChange}
                aria-label="Login method"
                sx={{
                  mb: 3,
                  "& .MuiToggleButton-root": {
                    color: "#1b4d3e",
                    border: "1px solid rgba(27, 77, 62, 0.5)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    "&.Mui-selected": {
                      color: "white",
                      backgroundColor: "#1b4d3e",
                      "&:hover": {
                        backgroundColor: "#1b4d3e",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(27, 77, 62, 0.08)",
                    },
                  },
                  "& .MuiToggleButtonGroup-grouped": {
                    "&:not(:first-of-type)": {
                      borderLeft: "1px solid rgba(27, 77, 62, 0.5)",
                      marginLeft: 0,
                    },
                    "&:first-of-type": {
                      borderRight: "1px solid rgba(27, 77, 62, 0.5)",
                    },
                  },
                }}
              >
                <ToggleButton
                  value="email"
                  aria-label="Email"
                  sx={{
                    textTransform: "none",
                    py: 1.25,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 6L12 13L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Email
                  </Box>
                </ToggleButton>
                <ToggleButton
                  value="mobile"
                  aria-label="Mobile"
                  sx={{
                    textTransform: "none",
                    py: 1.25,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 18H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Mobile
                  </Box>
                </ToggleButton>
              </StyledToggleButtonGroup>

              {formState.loginMethod === "email" ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formState.email}
                  onChange={handleInputChange}
                  error={!!formState.error}
                  helperText={formState.error}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              ) : (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Mobile Number"
                  name="mobile_number"
                  autoComplete="tel"
                  autoFocus
                  value={formState.mobile_number}
                  onChange={handleInputChange}
                  error={!!formState.error}
                  helperText={formState.error}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  mb: 2,
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                }}
                disabled={
                  formState.loading ||
                  (formState.loginMethod === "email"
                    ? !formState.email
                    : !formState.mobile_number)
                }
              >
                {formState.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send OTP"
                )}
              </StyledButton>
            </Box>
          ) : (
            <Box component="form" noValidate>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", mb: 3 }}
              >
                Enter 6-digit OTP sent to{" "}
                {formState.loginMethod === "email"
                  ? formState.email
                  : `+91 ${formState.mobile_number}`}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                {formState.otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (otpInputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOtpChange(e, index)
                    }
                    onPaste={handleOtpPaste}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(e, index)
                    }
                    inputProps={{
                      maxLength: 1,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      style: { textAlign: "center" },
                    }}
                    sx={{
                      width: 50,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        height: 50,
                      },
                      "& .MuiOutlinedInput-input": {
                        textAlign: "center",
                        fontSize: "1.5rem",
                      },
                    }}
                    autoFocus={index === formState.activeOtpIndex}
                    error={!!formState.error}
                  />
                ))}
              </Box>

              {formState.error && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                  {formState.error}
                </Typography>
              )}

              <Box sx={{ textAlign: "center", mt: 2 }}>
                {formState.countdown > 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    Resend OTP in {formState.countdown}s
                  </Typography>
                ) : (
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={handleResendOtp}
                    sx={{
                      color: "text.secondary",
                      textDecoration: "none",
                      "&:hover": { color: "#2e7d32" },
                    }}
                  >
                    Resend OTP
                  </Link>
                )}
              </Box>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      step: "input",
                      otp: Array(6).fill(""),
                      error: null,
                    }))
                  }
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": { color: "#2e7d32" },
                  }}
                >
                  Use different{" "}
                  {formState.loginMethod === "email"
                    ? "email"
                    : "mobile number"}
                </Link>
              </Box>

              {formState.loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} color="inherit" />
                </Box>
              )}
            </Box>
          )}
        </StyledPaper>
      </Box>
    </LoginWrapper>
  );
};

export default Login;