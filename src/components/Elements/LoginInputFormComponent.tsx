import { Box, TextField, CircularProgress, Button, alpha, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SignInTypeTabsComponent } from "./SignInTypeTabsComponent";

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

export const LoginInputFormComponent = ({
  formState,
  handleInputChange,
  handleSendOtp,
}: any) => (
  <Box component="form" onSubmit={handleSendOtp} noValidate>
    <GlassBoxComponent loginMethod={formState.loginMethod} />
    <SignInTypeTabsComponent
      loginMethod={formState.loginMethod}
      handleLoginMethodChange={(newMethod: any) =>
        formState.setFormState({
          ...formState,
          loginMethod: newMethod,
          email: "",
          mobile_number: "",
          error: null,
        })
      }
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
          inputMode: "numeric",
          pattern: "[0-9+]*",
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
);

const GlassBoxComponent = ({ loginMethod }: any) => (
  <GlassBox>
    <Typography
      variant="h6"
      sx={{
        position: "relative",
        textAlign: "center",
        fontWeight: 700,
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        letterSpacing: "0.5px",
        zIndex: 1,
      }}
    >
      Sign in using your {loginMethod === "email" ? "Email" : "Mobile Number"}
    </Typography>
    <Particle sx={{ top: "10%", left: "10%", animationDelay: "0s" }} />
    <Particle sx={{ top: "20%", right: "15%", animationDelay: "1s" }} />
    <Particle sx={{ bottom: "15%", left: "20%", animationDelay: "2s" }} />
    <Particle sx={{ bottom: "10%", right: "10%", animationDelay: "3s" }} />
  </GlassBox>
);
