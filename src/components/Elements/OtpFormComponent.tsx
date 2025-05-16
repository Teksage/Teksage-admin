// import {
//     Box,
//     Typography,
//     TextField,
//     Link,
//     CircularProgress,
//   } from "@mui/material";

// export const OtpFormComponent = ({
//     formState,
//     otpInputRefs,
//     handleOtpChange,
//     handleOtpPaste,
//     handleKeyDown,
//     handleResendOtp,
//     setFormState,
//   }:any) => (
//     <Box component="form" noValidate>
//       <Typography variant="h6" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
//         Enter 6-digit OTP sent to{" "}
//         {formState.loginMethod === "email" ? formState.email : formState.mobile_number}
//       </Typography>
//       <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
//         {formState.otp.map((digit:any, index:number) => (
//           <TextField
//             key={index}
//             inputRef={(el) => (otpInputRefs.current[index] = el)}
//             value={digit}
//             onChange={(e) => handleOtpChange(e, index)}
//             onPaste={handleOtpPaste}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             inputProps={{
//               maxLength: 1,
//               inputMode: "numeric",
//               pattern: "[0-9]*",
//               style: { textAlign: "center" },
//             }}
//             sx={{
//               width: 50,
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 1,
//                 height: 50,
//               },
//               "& .MuiOutlinedInput-input": {
//                 textAlign: "center",
//                 fontSize: "1.5rem",
//               },
//             }}
//             autoFocus={index === formState.activeOtpIndex}
//             error={!!formState.error}
//           />
//         ))}
//       </Box>
//       {formState.error && (
//         <Typography color="error" align="center" sx={{ mb: 2 }}>
//           {formState.error}
//         </Typography>
//       )}
//       <Box sx={{ textAlign: "center", mt: 2 }}>
//         {formState.countdown > 0 ? (
//           <Typography variant="body2" color="textSecondary">
//             Resend OTP in {formState.countdown}s
//           </Typography>
//         ) : (
//           <Link
//             component="button"
//             type="button"
//             variant="body2"
//             onClick={handleResendOtp}
//             sx={{
//               color: "text.secondary",
//               textDecoration: "none",
//               "&:hover": { color: "#2e7d32" },
//             }}
//           >
//             Resend OTP
//           </Link>
//         )}
//       </Box>
//       <Box sx={{ textAlign: "center", mt: 4 }}>
//         <Link
//           component="button"
//           type="button"
//           variant="body2"
//           onClick={() =>
//             setFormState((prev:any) => ({
//               ...prev,
//               step: "input",
//               otp: Array(6).fill(""),
//               error: null,
//             }))
//           }
//           sx={{
//             color: "text.secondary",
//             textDecoration: "none",
//             "&:hover": { color: "#2e7d32" },
//           }}
//         >
//           Use different {formState.loginMethod === "email" ? "email" : "mobile number"}
//         </Link>
//       </Box>
//       {formState.loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//           <CircularProgress size={24} color="inherit" />
//         </Box>
//       )}
//     </Box>
//   );

import React, { useCallback } from "react";
import { Box, Typography, TextField, Link, CircularProgress } from "@mui/material";

interface OtpFormProps {
  formState: {
    loginMethod: "email" | "mobile";
    email: string;
    mobile_number: string;
    otp: string[];
    activeOtpIndex: number;
    step: "input" | "otp" | "success" | "error";
    countdown: number;
    error: string | null;
    loading: boolean;
  };
  dispatchState: React.Dispatch<any>;
  otpInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleOtpPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  handleResendOtp: () => void;
}

export const OtpFormComponent = React.memo<OtpFormProps>(
  ({
    formState,
    dispatchState,
    otpInputRefs,
    handleOtpChange,
    handleOtpPaste,
    handleKeyDown,
    handleResendOtp,
  }) => {
    const handleBackToInput = useCallback(() => {
      dispatchState({ type: "SET_FIELD", field: "step", value: "input" });
      dispatchState({ type: "RESET_FIELDS" });
    }, [dispatchState]);

    return (
      <Box component="form" noValidate>
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center", mb: 3 }} style={{fontFamily: "Urbanist", fontWeight: 600}}>
          Enter 6-digit OTP sent to{" "}
          {formState.loginMethod === "email" ? formState.email : formState.mobile_number}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
          {formState.otp.map((digit: string, index: number) => (
            <TextField
              key={index}
              inputRef={(el) => (otpInputRefs.current[index] = el)}
              value={digit}
              onChange={(e:any) => handleOtpChange(e, index)}
              onPaste={handleOtpPaste}
              onKeyDown={(e:any) => handleKeyDown(e, index)}
              inputProps={{
                maxLength: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { textAlign: "center" },
                fontFamily: "Urbanist"
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
          <Typography color="error" align="center" sx={{ mb: 2 }} style={{ fontFamily: "Urbanist", fontWeight: 500 }}>
            {formState.error}
          </Typography>
        )}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          {formState.countdown > 0 ? (
            <Typography variant="body2" color="textSecondary" style={{ fontFamily: "Urbanist", fontWeight: 500 }}>
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
                fontFamily: "Urbanist",
                fontWeight: 500
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
            onClick={handleBackToInput}
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { color: "#2e7d32" },
              fontFamily: "Urbanist",
              fontWeight: 600
            }}
          >
            Use different {formState.loginMethod === "email" ? "email" : "mobile number"}
          </Link>
        </Box>
        {formState.loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} color="inherit" />
          </Box>
        )}
      </Box>
    );
  }
);