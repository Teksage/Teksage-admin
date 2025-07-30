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
  InputLabel,
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

// Interface for props
interface LoginInputFormProps {
  formState: {
    loginMethod: "email" | "mobile";
    email: string;
    mobile_number: string;
    country_code: string;
    loading: boolean;
    error: string | null;
  };
  dispatchState: React.Dispatch<Action>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendOtp: (e: React.FormEvent) => void;
  handleSwitchMethod: (newMethod: "email" | "mobile") => void;
  countriesList: Array<{
    dial_code: string;
    name: string;
    mobile_number_length: number;
  }>;
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
  ({
    formState,
    dispatchState,
    handleInputChange,
    handleSendOtp,
    handleSwitchMethod,
    countriesList,
  }) => {
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
        field: "country_code",
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
          // <Box
          //   sx={{
          //     display: "flex",
          //     flexWrap: "wrap",
          //     gap: 2,
          //     alignItems: "center",
          //     marginTop: "16px",
          //   }}
          // >
          //   {/* Country Code Dropdown */}
          //   <GlassSelect size="small">
          //     <InputLabel id="country-code-label">Code</InputLabel>
          //     <Select
          //       key={formState.countryCode || "default"} // Force re-render on navigation
          //       labelId="country-code-label"
          //       value={formState.countryCode || "+91"}
          //       onChange={(event) => {
          //         console.log("Country code selected:", event.target.value);
          //         handleCountryCodeChange(event);
          //       }}
          //       onClick={() => console.log("Select clicked")}
          //       label="Code"
          //       IconComponent={() => null}
          //       renderValue={(selected) => {
          //         const selectedOption = countriesList.find(
          //           (option: any) => option.dial_code === selected
          //         );
          //         const displayText = selectedOption
          //           ? `${selectedOption.dial_code} (${selectedOption.name})`
          //           : selected;

          //         return (
          //           <Box
          //             sx={{
          //               display: "flex",
          //               alignItems: "center",
          //               justifyContent: "flex-start",
          //               color: "#4caf50",
          //               fontFamily: "Urbanist",
          //               fontSize: "0.85rem",
          //               fontWeight: 600,
          //               width: "100%",
          //               overflow: "hidden",
          //               textOverflow: "ellipsis",
          //               whiteSpace: "nowrap",
          //               title: displayText, // Tooltip on hover
          //             }}
          //             title={displayText}
          //           >
          //             {displayText}
          //           </Box>
          //         );
          //       }}
          //       sx={{
          //         "& .MuiSelect-select": {
          //           paddingRight: "8px !important",
          //         },
          //       }}
          //       MenuProps={{
          //         PaperProps: {
          //           sx: {
          //             backdropFilter: "blur(20px)", // Kept the same for glass effect
          //             background: `linear-gradient(135deg, ${alpha(
          //               "#808080",
          //               0.6 // Darker starting color
          //             )}, ${alpha("#606060", 0.5)})`, // Even darker ending color
          //             border: `1px solid ${alpha("#707070", 0.7)}`, // Darker border to match
          //             borderRadius: "8px",
          //             boxShadow: `0 8px 20px ${alpha("#000000", 0.6)}`, // Kept the same for depth
          //             width: "auto",
          //             minWidth: "200px",
          //             maxWidth: "300px",
          //             marginTop: "4px",
          //           },
          //         },
          //       }}
          //     >
          //       {countriesList.map((option: any) => (
          //         <MenuItem
          //           key={option.dial_code}
          //           value={option.dial_code}
          //           sx={{
          //             fontFamily: "Urbanist",
          //             fontSize: "0.9rem",
          //             color: "#ffffff",
          //             textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
          //             padding: "8px 16px",
          //             "&:hover": {
          //               background: `linear-gradient(45deg, ${alpha(
          //                 "#1b4d3e",
          //                 0.4
          //               )}, ${alpha("#4caf50", 0.4)})`,
          //             },
          //             "&.Mui-selected": {
          //               background: `linear-gradient(45deg, ${alpha(
          //                 "#1b4d3e",
          //                 0.5
          //               )}, ${alpha("#4caf50", 0.5)})`,
          //               fontWeight: 600,
          //               boxShadow: `inset 0 0 8px ${alpha("#4caf50", 0.3)}`,
          //             },
          //           }}
          //         >
          //           {`${option.dial_code} (${option.name})`}
          //         </MenuItem>
          //       ))}
          //     </Select>
          //   </GlassSelect>

          //   {/* Mobile Number Input */}
          //   <TextField
          //     required
          //     fullWidth
          //     label="Mobile Number"
          //     name="mobile_number"
          //     autoComplete="tel"
          //     autoFocus
          //     value={formState.mobile_number}
          //     onChange={handleInputChange}
          //     error={!!formState.error}
          //     helperText={formState.error}
          //     InputLabelProps={{
          //       sx: {
          //         fontSize: "0.95rem",
          //         fontWeight: 500,
          //         color: "#455a64",
          //         fontFamily: "Urbanist",
          //       },
          //     }}
          //     InputProps={{
          //       sx: {
          //         fontSize: "0.9rem",
          //         borderRadius: "6px",
          //         fontFamily: "Urbanist",
          //         height: "56px",
          //         padding: "0 12px",
          //         boxSizing: "border-box",
          //       },
          //     }}
          //     sx={{
          //       "& .MuiInputLabel-root": {
          //         fontFamily: "Urbanist",
          //         fontSize: "0.95rem",
          //       },
          //       "& .MuiOutlinedInput-root": {
          //         "&:hover fieldset": {
          //           borderColor: alpha("#4caf50", 0.5),
          //         },
          //         "&.Mui-focused fieldset": {
          //           borderColor: "#4caf50",
          //           boxShadow: `0 0 8px ${alpha("#4caf50", 0.3)}`,
          //         },
          //       },
          //       flex: 1,
          //       minWidth: "200px",
          //     }}
          //   />
          // </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-start", // Changed to flex-start to align items better with error message
              marginTop: "16px",
            }}
          >
            {/* Country Code Dropdown */}
            <GlassSelect size="small">
              <InputLabel id="country-code-label">Code</InputLabel>
              <Select
                key={formState.country_code || "default"}
                labelId="country-code-label"
                value={formState.country_code || "+91"}
                onChange={(event) => {
                  console.log("Country code selected:", event.target.value);
                  handleCountryCodeChange(event);
                }}
                onClick={() => console.log("Select clicked")}
                label="Code"
                IconComponent={() => null}
                renderValue={(selected) => {
                  const selectedOption = countriesList.find(
                    (option: any) => option.dial_code === selected
                  );
                  const displayText = selectedOption
                    ? `${selectedOption.dial_code} (${selectedOption.name})`
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
                        title: displayText,
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
                      backdropFilter: "blur(20px)",
                      background: `linear-gradient(135deg, ${alpha(
                        "#808080",
                        0.6
                      )}, ${alpha("#606060", 0.5)})`,
                      border: `1px solid ${alpha("#707070", 0.7)}`,
                      borderRadius: "8px",
                      boxShadow: `0 8px 20px ${alpha("#000000", 0.6)}`,
                      width: "auto",
                      minWidth: "200px",
                      maxWidth: "300px",
                      marginTop: "4px",
                    },
                  },
                }}
              >
                {countriesList.map((option: any) => (
                  <MenuItem
                    key={option.dial_code}
                    value={option.dial_code}
                    sx={{
                      fontFamily: "Urbanist",
                      fontSize: "0.9rem",
                      color: "#ffffff",
                      textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
                      padding: "8px 16px",
                      "&:hover": {
                        background: `linear-gradient(45deg, ${alpha(
                          "#1b4d3e",
                          0.4
                        )}, ${alpha("#4caf50", 0.4)})`,
                      },
                      "&.Mui-selected": {
                        background: `linear-gradient(45deg, ${alpha(
                          "#1b4d3e",
                          0.5
                        )}, ${alpha("#4caf50", 0.5)})`,
                        fontWeight: 600,
                        boxShadow: `inset 0 0 8px ${alpha("#4caf50", 0.3)}`,
                      },
                    }}
                  >
                    {`${option.dial_code} (${option.name})`}
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
              helperText={
                formState.error ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontFamily: "Urbanist",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#ff6d60", // Softer red-orange shade for error
                      background: `linear-gradient(90deg, ${alpha(
                        "#ff6d60",
                        0.1
                      )}, ${alpha("#ff6d60", 0.05)})`,
                      backdropFilter: "blur(5px)", // Match glass effect
                      borderRadius: "4px",
                      padding: "2px 6px",
                      mt: 0.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: alpha("#ff6d60", 0.2),
                        color: "#ff6d60",
                        fontSize: "0.75rem",
                        mr: 0.5,
                      }}
                    >
                      !
                    </Box>
                    {formState.error}
                  </Box>
                ) : null
              }
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
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: formState.error
                      ? alpha("#ff6d60", 0.5)
                      : undefined, // Custom error border color
                  },
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
                  "&.Mui-error fieldset": {
                    borderColor: alpha("#ff6d60", 0.5), // Custom error border color
                    boxShadow: `0 0 6px ${alpha("#ff6d60", 0.2)}`, // Subtle error glow
                  },
                },
                flex: 1,
                minWidth: { xs: "100%", sm: "200px" }, // Responsive minWidth
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
              : !formState.mobile_number || !formState.country_code)
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
