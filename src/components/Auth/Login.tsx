// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Paper,
//   alpha,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import astro_prompt_logo_login from "../../assets/astro_prompt_logo_login.png";
// import { callAPI } from "../../api/crudFactory";
// import { tokenService } from "../../utils/tokenService";
// import OfflineNotification from "../Elements/OfflineNotification";
// import { OtpFormComponent } from "../Elements/OtpFormComponent";
// import { LoginSuccessComponent } from "../Elements/LoginSuccessComponent";
// import { validateEmail, validateMobileNumber } from "../Elements/CommonValidations";
// import { LoginInputFormComponent } from "../Elements/LoginInputFormComponent";

// // Styled Components
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

// // Interface
// interface LoginState {
//   loginMethod: "email" | "mobile";
//   email: string;
//   mobile_number: string;
//   otp: string[];
//   activeOtpIndex: number;
//   step: "input" | "otp" | "success" | "error";
//   loading: boolean;
//   countdown: number;
//   error: string | null;
// }

// // Components
// const LoginWrapperComponent = ({ children }: { children: React.ReactNode }) => (
//   <LoginWrapper>
//     <OfflineNotification />
//     <Box sx={{ width: "100%", px: 3, display: "flex", justifyContent: "center" }}>
//       {children}
//     </Box>
//   </LoginWrapper>
// );

// const LoginCardComponent = ({ children }: { children: React.ReactNode }) => (
//   <StyledPaper>{children}</StyledPaper>
// );

// const LogoBoxComponent = () => (
//   <LogoBox>
//     <img src={astro_prompt_logo_login} alt="Astro Prompt Logo" />
//   </LogoBox>
// );

// // Main Login Component
// export const Login = () => {
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

//   useEffect(() => {
//     if (formState.step === "success") {
//       const timer = setTimeout(() => {
//         if (formState.step === "success") {
//           navigate("/dashboard/users");
//         }
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [formState.step, navigate]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     if (name === "mobile_number") {
//       if (/^[0-9+]*$/.test(value)) {
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

//     if (/^[0-9]*$/.test(value)) {
//       const newOtp = [...formState.otp];
//       newOtp[index] = value.substring(value.length - 1);

//       setFormState({
//         ...formState,
//         otp: newOtp,
//         activeOtpIndex: value ? Math.min(index + 1, 5) : Math.max(index - 1, 0),
//         error: null,
//       });

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
//     if (
//       formState.otp.every((digit) => digit !== "") &&
//       formState.step === "otp"
//     ) {
//       handleVerifyOtp();
//     }
//   }, [formState.otp]);

//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     if (formState.loginMethod === "email") {
//       if (!formState.email) {
//         setFormState((prev) => ({ ...prev, error: "Please enter your email" }));
//         return;
//       }
//       if (!validateEmail(formState.email)) {
//         setFormState((prev) => ({
//           ...prev,
//           error: "Please enter a valid email address",
//         }));
//         return;
//       }
//     } else {
//       if (!formState.mobile_number) {
//         setFormState((prev) => ({
//           ...prev,
//           error: "Please enter your mobile number",
//         }));
//         return;
//       }
//       if (!validateMobileNumber(formState.mobile_number)) {
//         setFormState((prev) => ({
//           ...prev,
//           error: "Please enter a valid mobile number (e.g., +12025550123 or +919876543210)",
//         }));
//         return;
//       }
//     }
  
//     setFormState((prev) => ({ ...prev, loading: true, error: null }));
  
//     try {
//       const endpoint =
//         formState.loginMethod === "email"
//           ? "api/auth/otp/request"
//           : "api/auth/mobile-otp/request";
  
//       const data =
//         formState.loginMethod === "email"
//           ? { email: formState.email, user_type: "admin" }
//           : { mobile_number: formState.mobile_number, user_type: "admin" };
  
//       const response = await callAPI({
//         endpoint,
//         method: "post",
//         data,
//       });
  
//       // Check for access error in response
//       if (response.data.error === "400: Dont have an access") {
//         throw new Error("Access Denied: You do not have permission to proceed.");
//       }
  
//       setFormState((prev) => ({
//         ...prev,
//         step: "otp",
//         loading: false,
//         countdown: 30,
//         otp: Array(6).fill(""),
//         activeOtpIndex: 0,
//       }));
  
//       setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
//     } catch (error: any) {
//       const errorMessage = "Invalid User";
//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         error: errorMessage,
//         step: "input",
//       }));
//     }
//   };

//   const handleResendOtp = async () => {
//     if (formState.countdown > 0) return;

//     setFormState((prev) => ({ ...prev, loading: true, error: null }));

//     try {
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
//       } catch (error: any) {
//         console.log("Resend OTP API call failed, but continuing with bypass", error);
//       }

//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         countdown: 30,
//         otp: Array(6).fill(""),
//         activeOtpIndex: 0,
//       }));

//       setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
//     } catch (error) {
//       console.error("Error in resend process:", error);
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

//   const handleVerifyOtp = async () => {
//     const otp = formState.otp.join("");
//     if (otp.length !== 6) return;
  
//     setFormState((prev) => ({ ...prev, loading: true, error: null }));
  
//     try {
//       const endpoint =
//         formState.loginMethod === "email"
//           ? "api/auth/otp/login-verify"
//           : "api/auth/mobile-otp/login-verify";
  
//       const data =
//         formState.loginMethod === "email"
//           ? otp === "111111"
//             ? { email: formState.email, otp: "111111" }
//             : { email: formState.email, otp }
//           : otp === "111111"
//           ? { mobile_number: formState.mobile_number, otp: "111111" }
//           : { mobile_number: formState.mobile_number, otp };
  
//       const response = await callAPI({
//         endpoint,
//         method: "post",
//         data,
//       });

//       const access_token = response.data.access_token;
//       const refresh_token = response.data.refresh_token;
  
//       tokenService.setTokens({
//         access: access_token,
//         refresh: refresh_token,
//         user: `${response.data.first_name} ${response.data.last_name}`
//       });

//       dispatch({ type: "setAuth", payload: true });
  
//       setFormState((prev) => ({
//         ...prev,
//         step: "success",
//         loading: false,
//       }));
//     } catch (error: any) {
//       console.error("OTP verification error:", error);
//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Invalid OTP. Please try again.",
//         step: "error",
//       }));
//     }
//   };

//   return (
//     <LoginWrapperComponent>
//       <LoginCardComponent>
//         <LogoBoxComponent />
//         {formState.step === "success" && <LoginSuccessComponent />}
//         {formState.step === "input" && (
//           <LoginInputFormComponent
//             formState={{ ...formState, setFormState }}
//             handleInputChange={handleInputChange}
//             handleSendOtp={handleSendOtp}
//           />
//         )}
//         {formState.step === "otp" && (
//           <OtpFormComponent
//             formState={formState}
//             otpInputRefs={otpInputRefs}
//             handleOtpChange={handleOtpChange}
//             handleOtpPaste={handleOtpPaste}
//             handleKeyDown={handleKeyDown}
//             handleResendOtp={handleResendOtp}
//             setFormState={setFormState}
//           />
//         )}
//       </LoginCardComponent>
//     </LoginWrapperComponent>
//   );
// };

// export default Login;

import React, { useEffect, useRef, useCallback, useReducer } from "react";
import { Box, Paper, alpha, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import astro_prompt_logo_login from "../../assets/astro_prompt_logo_login.png";
import { callAPI } from "../../api/crudFactory";
import { tokenService } from "../../utils/tokenService";
import OfflineNotification from "../Elements/OfflineNotification";
import { OtpFormComponent } from "../Elements/OtpFormComponent";
import { LoginSuccessComponent } from "../Elements/LoginSuccessComponent";
import { validateEmail, validateMobileNumber } from "../Elements/CommonValidations";
import { LoginInputFormComponent } from "../Elements/LoginInputFormComponent";
import { debounce } from "lodash";

// Styled Components
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
  "& img": {
    animation: "pulse 2s infinite",
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)", opacity: 1 },
    "50%": { transform: "scale(1.1)", opacity: 0.7 },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
}));

// State Management with useReducer
interface LoginState {
  loginMethod: "email" | "mobile";
  email: string;
  mobile_number: string;
  otp: string[];
  activeOtpIndex: number;
  step: "input" | "otp" | "success" | "error";
  loading: boolean;
  countdown: number;
  error: string | null;
}

type Action =
  | { type: "SET_FIELD"; field: keyof LoginState; value: any }
  | { type: "SET_OTP"; otp: string[]; activeOtpIndex: number }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_COUNTDOWN"; countdown: number }
  | { type: "RESET_FIELDS" };

const initialState: LoginState = {
  loginMethod: "email",
  email: "",
  mobile_number: "",
  otp: Array(6).fill(""),
  activeOtpIndex: 0,
  step: "input",
  loading: false,
  countdown: 0,
  error: null,
};

const reducer = (state: LoginState, action: Action): LoginState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_OTP":
      return { ...state, otp: action.otp, activeOtpIndex: action.activeOtpIndex };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_COUNTDOWN":
      return { ...state, countdown: action.countdown };
    case "RESET_FIELDS":
      return {
        ...state,
        email: "",
        mobile_number: "",
        otp: Array(6).fill(""),
        activeOtpIndex: 0,
        error: null,
      };
    default:
      return state;
  }
};

// Components
const LoginWrapperComponent = React.memo<{ children: React.ReactNode }>(
  ({ children }) => (
    <LoginWrapper>
      <OfflineNotification />
      <Box sx={{ width: "100%", px: 3, display: "flex", justifyContent: "center" }}>
        {children}
      </Box>
    </LoginWrapper>
  )
);

const LoginCardComponent = React.memo<{ children: React.ReactNode }>(
  ({ children }) => <StyledPaper>{children}</StyledPaper>
);

const LogoBoxComponent = React.memo(() => (
  <LogoBox>
    <img src={astro_prompt_logo_login} alt="Astro Prompt Logo" loading="lazy" />
  </LogoBox>
));

// Main Login Component
export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [state, dispatchState] = useReducer(reducer, initialState);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (state.countdown > 0) {
      const timer = setTimeout(() => {
        dispatchState({ type: "SET_COUNTDOWN", countdown: state.countdown - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.countdown]);

  useEffect(() => {
    if (state.step === "success") {
      const timer = setTimeout(() => {
        if (state.step === "success") {
          navigate("/dashboard/users");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.step, navigate]);

  const handleSwitchMethod = useCallback((newMethod: "email" | "mobile") => {
    dispatchState({ type: "SET_FIELD", field: "loginMethod", value: newMethod });
    dispatchState({
      type: "SET_FIELD",
      field: newMethod === "email" ? "mobile_number" : "email",
      value: "",
    });
    dispatchState({ type: "SET_ERROR", error: null });
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === "mobile_number") {
        if (/^[0-9+]*$/.test(value)) {
          dispatchState({ type: "SET_FIELD", field: "mobile_number", value });
          dispatchState({ type: "SET_ERROR", error: null });
        }
      } else {
        dispatchState({ type: "SET_FIELD", field: name as keyof LoginState, value });
        dispatchState({ type: "SET_ERROR", error: null });
      }
    },
    []
  );

  const handleOtpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value;

      if (/^[0-9]*$/.test(value)) {
        const newOtp = [...state.otp];
        newOtp[index] = value.substring(value.length - 1);

        const newIndex = value ? Math.min(index + 1, 5) : Math.max(index - 1, 0);
        dispatchState({
          type: "SET_OTP",
          otp: newOtp,
          activeOtpIndex: newIndex,
        });
        dispatchState({ type: "SET_ERROR", error: null });

        if (value && index < 5) {
          otpInputRefs.current[index + 1]?.focus();
        }
      }
    },
    [state.otp]
  );

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text/plain");
      const otpArray = pastedData.replace(/\D/g, "").split("").slice(0, 6);

      if (otpArray.length === 6) {
        dispatchState({
          type: "SET_OTP",
          otp: otpArray,
          activeOtpIndex: 5,
        });
        dispatchState({ type: "SET_ERROR", error: null });

        if (otpArray.every((digit) => digit !== "")) {
          handleVerifyOtp();
        }
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && !state.otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    },
    [state.otp]
  );

  useEffect(() => {
    if (state.otp.every((digit) => digit !== "") && state.step === "otp") {
      handleVerifyOtp();
    }
  }, [state.otp, state.step]);

  const handleSendOtp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (state.loginMethod === "email") {
        if (!state.email) {
          dispatchState({ type: "SET_ERROR", error: "Please enter your email" });
          return;
        }
        if (!validateEmail(state.email)) {
          dispatchState({
            type: "SET_ERROR",
            error: "Please enter a valid email address",
          });
          return;
        }
      } else {
        if (!state.mobile_number) {
          dispatchState({
            type: "SET_ERROR",
            error: "Please enter your mobile number",
          });
          return;
        }
        if (!validateMobileNumber(state.mobile_number)) {
          dispatchState({
            type: "SET_ERROR",
            error: "Please enter a valid mobile number (e.g., +12025550123 or +919876543210)",
          });
          return;
        }
      }

      dispatchState({ type: "SET_LOADING", loading: true });
      dispatchState({ type: "SET_ERROR", error: null });

      try {
        const endpoint =
          state.loginMethod === "email"
            ? "api/auth/otp/request"
            : "api/auth/mobile-otp/request";

        const data =
          state.loginMethod === "email"
            ? { email: state.email, user_type: "admin" }
            : { mobile_number: state.mobile_number, user_type: "admin" };

        const response = await callAPI({
          endpoint,
          method: "post",
          data,
        });

        if (response.data.error === "400: Dont have an access") {
          throw new Error("Access Denied: You do not have permission to proceed.");
        }

        dispatchState({ type: "SET_FIELD", field: "step", value: "otp" });
        dispatchState({ type: "SET_LOADING", loading: false });
        dispatchState({ type: "SET_COUNTDOWN", countdown: 30 });
        dispatchState({
          type: "SET_OTP",
          otp: Array(6).fill(""),
          activeOtpIndex: 0,
        });

        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } catch (error: any) {
        console.log(error, "error")
        dispatchState({ type: "SET_LOADING", loading: false });
        dispatchState({ type: "SET_ERROR", error: "Invalid User" });
        dispatchState({ type: "SET_FIELD", field: "step", value: "input" });
      }
    },
    [state.loginMethod, state.email, state.mobile_number]
  );

  const handleResendOtp = useCallback(
    debounce(async () => {
      if (state.countdown > 0) return;

      dispatchState({ type: "SET_LOADING", loading: true });
      dispatchState({ type: "SET_ERROR", error: null });

      try {
        const endpoint =
          state.loginMethod === "email"
            ? "api/auth/otp/request"
            : "api/auth/mobile-otp/request";

        const data =
          state.loginMethod === "email"
            ? { email: state.email }
            : { mobile_number: state.mobile_number };

        await callAPI({
          endpoint,
          method: "post",
          data,
        });

        dispatchState({ type: "SET_LOADING", loading: false });
        dispatchState({ type: "SET_COUNTDOWN", countdown: 30 });
        dispatchState({
          type: "SET_OTP",
          otp: Array(6).fill(""),
          activeOtpIndex: 0,
        });

        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } catch (error) {
        console.error("Error in resend process:", error);
        dispatchState({ type: "SET_LOADING", loading: false });
        dispatchState({ type: "SET_COUNTDOWN", countdown: 30 });
        dispatchState({
          type: "SET_OTP",
          otp: Array(6).fill(""),
          activeOtpIndex: 0,
        });

        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      }
    }, 300),
    [state.countdown, state.loginMethod, state.email, state.mobile_number]
  );

  const handleVerifyOtp = useCallback(async () => {
    const otp = state.otp.join("");
    if (otp.length !== 6) return;

    dispatchState({ type: "SET_LOADING", loading: true });
    dispatchState({ type: "SET_ERROR", error: null });

    try {
      const endpoint =
        state.loginMethod === "email"
          ? "api/auth/otp/login-verify"
          : "api/auth/mobile-otp/login-verify";

      const data =
        state.loginMethod === "email"
          ? otp === "111111"
            ? { email: state.email, otp: "111111" }
            : { email: state.email, otp }
          : otp === "111111"
          ? { mobile_number: state.mobile_number, otp: "111111" }
          : { mobile_number: state.mobile_number, otp };

      const response = await callAPI({
        endpoint,
        method: "post",
        data,
      });

      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;

      tokenService.setTokens({
        access: access_token,
        refresh: refresh_token,
        user: `${response.data.first_name} ${response.data.last_name}`,
      });

      dispatch({ type: "setAuth", payload: true });

      dispatchState({ type: "SET_FIELD", field: "step", value: "success" });
      dispatchState({ type: "SET_LOADING", loading: false });
    } catch (error: any) {
      console.error("OTP verification error:", error);
      dispatchState({ type: "SET_LOADING", loading: false });
      dispatchState({
        type: "SET_ERROR",
        error: error.message || "Invalid OTP. Please try again.",
      });
      dispatchState({ type: "SET_FIELD", field: "step", value: "error" });
    }
  }, [state.otp, state.loginMethod, state.email, state.mobile_number, dispatch]);

  return (
    <LoginWrapperComponent>
      <LoginCardComponent>
        <LogoBoxComponent />
        {state.loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alpha("#ffffff", 0.8),
              zIndex: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        )}
        {state.step === "success" && <LoginSuccessComponent />}
        {state.step === "input" && (
          <LoginInputFormComponent
            formState={state}
            dispatchState={dispatchState}
            handleInputChange={handleInputChange}
            handleSendOtp={handleSendOtp}
            handleSwitchMethod={handleSwitchMethod}
          />
        )}
        {state.step === "otp" && (
          <OtpFormComponent
            formState={state}
            dispatchState={dispatchState}
            otpInputRefs={otpInputRefs}
            handleOtpChange={handleOtpChange}
            handleOtpPaste={handleOtpPaste}
            handleKeyDown={handleKeyDown}
            handleResendOtp={handleResendOtp}
          />
        )}
      </LoginCardComponent>
    </LoginWrapperComponent>
  );
};

export default Login;