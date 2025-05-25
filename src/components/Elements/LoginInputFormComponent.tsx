// import React, { useCallback } from "react";
// import { Box, TextField, CircularProgress, Button, alpha, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { SignInTypeTabsComponent } from "./SignInTypeTabsComponent";

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

// const GlassBox = styled(Box)(({ theme }) => ({
//   position: "relative",
//   backdropFilter: "blur(8px)",
//   background: `rgba(255, 255, 255, 0.1)`,
//   border: `1px solid ${alpha("#ffffff", 0.2)}`,
//   borderRadius: theme.spacing(2),
//   padding: theme.spacing(1.5, 3),
//   marginBottom: theme.spacing(3),
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "scale(1.02)",
//     background: `rgba(255, 255, 255, 0.15)`,
//   },
// }));

// const Particle = styled(Box)(() => ({
//   position: "absolute",
//   width: "4px",
//   height: "4px",
//   background: "#4caf50",
//   borderRadius: "50%",
//   animation: "float 5s infinite",
//   "@keyframes float": {
//     "0%": { transform: "translate(0, 0)", opacity: 1 },
//     "50%": { opacity: 0.5 },
//     "100%": { transform: "translate(20px, -20px)", opacity: 0 },
//   },
// }));

// interface LoginInputFormProps {
//   formState: {
//     loginMethod: "email" | "mobile";
//     email: string;
//     mobile_number: string;
//     loading: boolean;
//     error: string | null;
//   };
//   dispatchState: React.Dispatch<any>;
//   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   handleSendOtp: (e: React.FormEvent) => void;
//   handleSwitchMethod: (newMethod: "email" | "mobile") => void;
// }

// const GlassBoxComponent = React.memo<{ loginMethod: "email" | "mobile" }>(
//   ({ loginMethod }) => (
//     <GlassBox>
//       <Typography
//         variant="h6"
//         sx={{
//           position: "relative",
//           textAlign: "center",
//           fontFamily: "'Poppins', sans-serif",
//           background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
//           backgroundClip: "text",
//           WebkitBackgroundClip: "text",
//           color: "transparent",
//           letterSpacing: "0.5px",
//           zIndex: 1,
//         }}
//         style={{fontFamily: 'Urbanist', fontWeight: 600}}
//       >
//         Sign in using your {loginMethod === "email" ? "Email" : "Mobile Number"}
//       </Typography>
//       <Particle sx={{ top: "10%", left: "10%", animationDelay: "0s" }} />
//       <Particle sx={{ top: "20%", right: "15%", animationDelay: "1s" }} />
//       <Particle sx={{ bottom: "15%", left: "20%", animationDelay: "2s" }} />
//       <Particle sx={{ bottom: "10%", right: "10%", animationDelay: "3s" }} />
//     </GlassBox>
//   )
// );

// export const LoginInputFormComponent = React.memo<LoginInputFormProps>(
//   ({ formState, handleInputChange, handleSendOtp, handleSwitchMethod }) => {
//     const handleLoginMethodChange = useCallback(
//       (newMethod: "email" | "mobile") => {
//         handleSwitchMethod(newMethod);
//       },
//       [handleSwitchMethod]
//     );

//     return (
//       <Box component="form" onSubmit={handleSendOtp} noValidate>
//         <GlassBoxComponent loginMethod={formState.loginMethod} />
//         <SignInTypeTabsComponent
//           loginMethod={formState.loginMethod}
//           handleLoginMethodChange={handleLoginMethodChange}
//         />
//         {formState.loginMethod === "email" ? (
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={formState.email}
//             onChange={handleInputChange}
//             error={!!formState.error}
//             helperText={formState.error}
//             InputLabelProps={{
//               sx: {
//                 fontSize: "0.95rem",
//                 fontWeight: 500,
//                 color: "#455a64",
//                 fontFamily: "Urbanist",
//               },
//             }}
//             InputProps={{
//               sx: {
//                 fontSize: "0.9rem",
//                 borderRadius: "6px",
//                 fontFamily: "Urbanist",
//               },
//             }}
//             sx={{
//               "& .MuiInputLabel-root": {
//                 fontFamily: "Urbanist",
//                 fontSize: "0.9rem",
//               },
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 2,
//               },
//             }}
//           />
//         ) : (
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Mobile Number"
//             name="mobile_number"
//             autoComplete="tel"
//             autoFocus
//             value={formState.mobile_number}
//             onChange={handleInputChange}
//             error={!!formState.error}
//             helperText={formState.error}
//             InputLabelProps={{
//               sx: {
//                 fontSize: "0.95rem",
//                 fontWeight: 500,
//                 color: "#455a64",
//                 fontFamily: "Urbanist",
//               },
//             }}
//             InputProps={{
//               sx: {
//                 fontSize: "0.9rem",
//                 borderRadius: "6px",
//                 fontFamily: "Urbanist",
//               },
//             }}
//             sx={{
//               "& .MuiInputLabel-root": {
//                 fontFamily: "Urbanist",
//                 fontSize: "0.9rem",
//               },
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 2,
//               },
//             }}
//           />
//         )}
//         <StyledButton
//           type="submit"
//           fullWidth
//           variant="contained"
//           sx={{
//             mt: 4,
//             mb: 2,
//             "&.Mui-disabled": {
//               color: "rgba(255, 255, 255, 0.8)",
//             },
//             fontFamily: "Urbanist",
//             fontWeight: 800
//           }}
//           disabled={
//             formState.loading ||
//             (formState.loginMethod === "email"
//               ? !formState.email
//               : !formState.mobile_number)
//           }
//         >
//           {formState.loading ? (
//             <CircularProgress size={24} color="inherit" />
//           ) : (
//             "Send OTP"
//           )}
//         </StyledButton>
//       </Box>
//     );
//   }
// );

import React, { useCallback } from "react";
import {
  Box,
  TextField,
  CircularProgress,
  Button,
  alpha,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SignInTypeTabsComponent } from "./SignInTypeTabsComponent";
import { Action } from "../Auth/Login"; // Adjust the path as needed
import { GlassSelect } from "./CommonFunctions";

// Styled components
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

const GlassBox = styled(Box)(({ theme }) => ({
  position: "relative",
  backdropFilter: "blur(8px)",
  background: `rgba(255, 255, 255, 0.1)`,
  border: `1px solid ${alpha("#ffffff", 0.2)}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    background: `rgba(255, 255, 255, 0.15)`,
  },
}));

const Particle = styled(Box)(() => ({
  position: "absolute",
  width: "4px",
  height: "4px",
  background: "#4caf50",
  borderRadius: "50%",
  animation: "float 5s infinite",
  "@keyframes float": {
    "0%": { transform: "translate(0, 0)", opacity: 1 },
    "50%": { opacity: 0.5 },
    "100%": { transform: "translate(20px, -20px)", opacity: 0 },
  },
}));

const countryCodes = [
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
];

// Interface for props
interface LoginInputFormProps {
  formState: {
    loginMethod: "email" | "mobile";
    email: string;
    mobile_number: string;
    countryCode: string;
    loading: boolean;
    error: string | null;
  };
  dispatchState: React.Dispatch<Action>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendOtp: (e: React.FormEvent) => void;
  handleSwitchMethod: (newMethod: "email" | "mobile") => void;
}

const GlassBoxComponent = React.memo<{ loginMethod: "email" | "mobile" }>(
  ({ loginMethod }) => (
    <GlassBox>
      <Typography
        variant="h6"
        sx={{
          position: "relative",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
          background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          letterSpacing: "0.5px",
          zIndex: 1,
        }}
        style={{ fontFamily: "Urbanist", fontWeight: 600 }}
      >
        Sign in using your {loginMethod === "email" ? "Email" : "Mobile Number"}
      </Typography>
      <Particle sx={{ top: "10%", left: "10%", animationDelay: "0s" }} />
      <Particle sx={{ top: "20%", right: "15%", animationDelay: "1s" }} />
      <Particle sx={{ bottom: "15%", left: "20%", animationDelay: "2s" }} />
      <Particle sx={{ bottom: "10%", right: "10%", animationDelay: "3s" }} />
    </GlassBox>
  )
);

export const LoginInputFormComponent = React.memo<LoginInputFormProps>(
  ({ formState, dispatchState, handleInputChange, handleSendOtp, handleSwitchMethod }) => {
    const handleLoginMethodChange = useCallback(
      (newMethod: "email" | "mobile") => {
        handleSwitchMethod(newMethod);
      },
      [handleSwitchMethod]
    );

    const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
      const newCountryCode = event.target.value as string;
      dispatchState({
        type: "SET_FIELD",
        field: "countryCode",
        value: newCountryCode,
      });
    };

    return (
      <Box component="form" onSubmit={handleSendOtp} noValidate>
        <GlassBoxComponent loginMethod={formState.loginMethod} />
        <SignInTypeTabsComponent
          loginMethod={formState.loginMethod}
          handleLoginMethodChange={handleLoginMethodChange}
        />
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
            InputLabelProps={{
              sx: {
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "#4caf50",
                fontFamily: "Urbanist",
              },
            }}
            InputProps={{
              sx: {
                fontSize: "0.9rem",
                borderRadius: "6px",
                fontFamily: "Urbanist",
                height: "56px",
                padding: "0 12px",
                boxSizing: "border-box",
              },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                fontFamily: "Urbanist",
                fontSize: "0.95rem",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: alpha("#4caf50", 0.5),
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4caf50",
                  boxShadow: `0 0 8px ${alpha("#4caf50", 0.3)}`,
                },
              },
            }}
          />
        ) : (
<Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    alignItems: "center",
    marginTop: "16px",
  }}
>
  {/* Country Code Dropdown */}
  <GlassSelect size="small">
    <InputLabel id="country-code-label">
      Code
    </InputLabel>
    <Select
      labelId="country-code-label"
      value={formState.countryCode || "+91"}
      onChange={(event) => {
        console.log("Country code selected:", event.target.value);
        handleCountryCodeChange(event);
      }}
      onClick={() => console.log("Select clicked")}
      label="Code"
      IconComponent={() => null}
      renderValue={(selected) => {
        const selectedOption = countryCodes.find(option => option.code === selected);
        const displayText = selectedOption 
          ? `${selectedOption.code} (${selectedOption.country})`
          : selected;
        
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              color: "#4caf50",
              fontFamily: "Urbanist",
              fontSize: "0.85rem",
              fontWeight: 600,
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              title: displayText, // Tooltip on hover
            }}
            title={displayText}
          >
            {displayText}
          </Box>
        );
      }}
      sx={{
        "& .MuiSelect-select": {
          paddingRight: "8px !important",
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            backdropFilter: "blur(10px)",
            background: `linear-gradient(135deg, ${alpha("#ffffff", 0.4)}, ${alpha("#e0e0e0", 0.3)})`,
            border: `1px solid ${alpha("#ffffff", 0.5)}`,
            borderRadius: "8px",
            boxShadow: `0 8px 20px ${alpha("#000000", 0.4)}`,
            width: "auto",
            minWidth: "200px",
            maxWidth: "300px",
            marginTop: "4px",
          },
        },
      }}
    >
      {countryCodes.map((option) => (
        <MenuItem
          key={option.code}
          value={option.code}
          sx={{
            fontFamily: "Urbanist",
            fontSize: "0.9rem",
            color: "#ffffff",
            textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
            padding: "8px 16px",
            "&:hover": {
              background: `linear-gradient(45deg, ${alpha("#1b4d3e", 0.4)}, ${alpha("#4caf50", 0.4)})`,
            },
            "&.Mui-selected": {
              background: `linear-gradient(45deg, ${alpha("#1b4d3e", 0.5)}, ${alpha("#4caf50", 0.5)})`,
              fontWeight: 600,
              boxShadow: `inset 0 0 8px ${alpha("#4caf50", 0.3)}`,
            },
          }}
        >
          {`${option.code} (${option.country})`}
        </MenuItem>
      ))}
    </Select>
  </GlassSelect>

  {/* Mobile Number Input */}
  <TextField
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
    InputLabelProps={{
      sx: {
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "#455a64",
        fontFamily: "Urbanist",
      },
    }}
    InputProps={{
      sx: {
        fontSize: "0.9rem",
        borderRadius: "6px",
        fontFamily: "Urbanist",
        height: "56px",
        padding: "0 12px",
        boxSizing: "border-box",
      },
    }}
    sx={{
      "& .MuiInputLabel-root": {
        fontFamily: "Urbanist",
        fontSize: "0.95rem",
      },
      "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
          borderColor: alpha("#4caf50", 0.5),
        },
        "&.Mui-focused fieldset": {
          borderColor: "#4caf50",
          boxShadow: `0 0 8px ${alpha("#4caf50", 0.3)}`,
        },
      },
      flex: 1,
      minWidth: "200px",
    }}
  />
</Box>
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
            fontFamily: "Urbanist",
            fontWeight: 800,
          }}
          disabled={
            formState.loading ||
            (formState.loginMethod === "email"
              ? !formState.email
              : !formState.mobile_number || !formState.countryCode)
          }
        >
          {formState.loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Send OTP"
          )}
        </StyledButton>
      </Box>
    );
  }
);