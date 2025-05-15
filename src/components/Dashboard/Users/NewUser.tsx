import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  IconButton,
  FormHelperText,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory"; // adjust path as per your project
import CustomSnackbar from "../../Elements/CustomSnackbar";
import PlaceAutocomplete from "../../Elements/LocationAutocomplete";

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  dateOfBirth: Date | null;
  timeOfBirth: Date | null;
  placeOfBirth: string;
  preferredLocation: string;
  rashi: string;
  nakshatra: string;
  status: string;
  user_type: string;
}

const rasiOptions = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const nakshatramOptions: Record<string, string[]> = {
  Aries: ["Ashwini", "Bharani", "Krittika"],
  Taurus: ["Krittika", "Rohini", "Mrigashira"],
  Gemini: ["Mrigashira", "Ardra", "Punarvasu"],
  Cancer: ["Punarvasu", "Pushya", "Ashlesha"],
  Leo: ["Magha", "Purva Phalguni", "Uttara Phalguni"],
  Virgo: ["Uttara Phalguni", "Hasta", "Chitra"],
  Libra: ["Chitra", "Swati", "Vishaka"],
  Scorpio: ["Vishaka", "Anuradha", "Jyeshta"],
  Sagittarius: ["Moola", "Purva Ashadha", "Uttara Ashadha"],
  Capricorn: ["Uttara Ashadha", "Shravana", "Dhanishta"],
  Aquarius: ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"],
  Pisces: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
};

const userTypeOptions = ["Customer", "Astrologer", "Admin"];

const NewUser: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isViewMode = mode === "view";
  const isFormInitialized = useRef(true);
  const urbanistBoldText = {
    fontFamily: "Urbanist", fontWeight: 600,
  };

  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    dateOfBirth: null,
    timeOfBirth: null,
    placeOfBirth: "",
    preferredLocation: "",
    rashi: "",
    nakshatra: "",
    status: "Active",
    user_type: "Customer",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});
  const [loadingRasiNakshatram, setLoadingRasiNakshatram] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    (async () => {
      if (mode === "edit" && userId) {
        try {
          const res = await callAPI({
            endpoint: `api/admin/users/${userId}`,
            method: "get",
          });

          const user = res?.data;
          console.log(user, {
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            mobile: user.mobile_number || "",
            dateOfBirth: user.date_of_birth
              ? new Date(user.date_of_birth)
              : null,
            timeOfBirth: user.time_of_birth
              ? new Date(`1970-01-01T${user.time_of_birth}`)
              : null,
            placeOfBirth: user.place_of_birth || "",
            preferredLocation: user.preferred_location || "",
            rashi: user.rashi || "",
            nakshatra: user.nakshatra || "",
            status: user.status === "inactive" ? "Inactive" : "Active",
            user_type:
              user.user_type.charAt(0).toUpperCase() +
                user.user_type.slice(1).toLowerCase() || "Customer",
          });
          setFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            mobile: user.mobile_number || "",
            dateOfBirth: user.date_of_birth
              ? new Date(user.date_of_birth)
              : null,
            timeOfBirth: user.time_of_birth
              ? new Date(`1970-01-01T${user.time_of_birth}`)
              : null,
            placeOfBirth: user.place_of_birth || "",
            preferredLocation: user.preferred_location || "",
            rashi: user.rashi || "",
            nakshatra: user.nakshatra || "",
            status: user.status === "inactive" ? "Inactive" : "Active",
            user_type:
              user.user_type.charAt(0).toUpperCase() +
                user.user_type.slice(1).toLowerCase() || "Customer",
          });

          // ✅ Mark form as initialized after setting data
          isFormInitialized.current = true;
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    })();
  }, [mode, userId]);

  // Field-specific validation function
  const validateField = (field: keyof UserFormData, value: string) => {
    let error = "";

    switch (field) {
      case "first_name":
        if (!value.trim()) {
          error = "First name is required";
        }
        break;
      case "last_name":
        if (!value.trim()) {
          error = "Last name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "mobile":
        if (!value.trim()) {
          error = "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Mobile number must be exactly 10 digits";
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Validate all mandatory fields on form submission
  const validate = () => {
    const newErrors: typeof errors = {};

    newErrors.first_name = validateField("first_name", formData.first_name);
    newErrors.last_name = validateField("last_name", formData.last_name);
    newErrors.email = validateField("email", formData.email);
    newErrors.mobile = validateField("mobile", formData.mobile);

    // Filter out empty errors to only include fields with validation issues
    return Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value)
    );
  };

  // Helper function to update form data
  const updateFormData = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for the field when the user starts typing
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Updated handleChange function
  const handleChange =
    (field: keyof UserFormData) =>
    (
      input:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | string[]>
        | string
    ) => {
      let value: string | string[];
      if (typeof input === "string") {
        value = input;
      } else {
        value = input.target.value as string | string[];
      }
      updateFormData(field, value);
    };

  // Handle blur to validate mandatory fields
  const handleBlur =
    (field: keyof UserFormData) =>
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      const error = validateField(field, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    };

  const handleDateChange = (value: Date | null) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: value }));
    setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
  };

  const handleTimeChange = (value: Date | null) => {
    setFormData((prev) => ({ ...prev, timeOfBirth: value }));
    setErrors((prev) => ({ ...prev, timeOfBirth: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      console.log({
        first_name: formData.first_name,
        last_name: formData.last_name,
        preferred_location: formData.preferredLocation,
        email: formData.email,
        mobile_number: formData.mobile,
        birth_location: formData.placeOfBirth,
        date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
        time_of_birth: formData.timeOfBirth?.toTimeString().slice(0, 5),
        rashi: formData.rashi,
        nakshatra: formData.nakshatra,
        status: formData.status.toLowerCase(),
        user_type: formData.user_type.toLowerCase(),
      });
      const response = await callAPI({
        endpoint:
          mode === "edit" ? `api/admin/users/${userId}` : "api/admin/users",
        method: mode === "edit" ? "put" : "post",
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          preferred_location: formData.preferredLocation,
          email: formData.email,
          mobile_number: formData.mobile,
          birth_location: formData.placeOfBirth,
          date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
          time_of_birth: formData.timeOfBirth?.toTimeString().slice(0, 5),
          rashi: formData.rashi,
          nakshatra: formData.nakshatra,
          status: formData.status.toLowerCase(),
          user_type: formData.user_type.toLowerCase(),
        },
      });
      console.log(response, "response");
      setSnackbar({
        open: true,
        message:
          mode === "edit"
            ? "User updated successfully!"
            : "User created successfully!",
        severity: "success",
      });

      navigate(-1);
    } catch (err: any) {
      console.error("API Error:", err);
      let errorMessage = "Something went wrong. Please try again.";
      if (err.response && err.response.data) {
        errorMessage =
          err.response.data.detail || JSON.stringify(err.response.data.detail);
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  // ⏳ Auto trigger rashi & nakshatra fetch
  useEffect(() => {
    if (mode === "edit" && !isFormInitialized.current) return;
    const { dateOfBirth, timeOfBirth, placeOfBirth, preferredLocation } =
      formData;

    if (
      dateOfBirth &&
      timeOfBirth &&
      placeOfBirth.trim() &&
      preferredLocation.trim()
    ) {
      const fetchRasiNakshatra = async () => {
        try {
          setLoadingRasiNakshatram(true);
          const response = await callAPI({
            endpoint: "api/auth/rashi-nakshatra",
            method: "post",
            data: {
              preferred_location: preferredLocation,
              date_of_birth: dateOfBirth.toISOString().split("T")[0],
              time_of_birth: timeOfBirth.toTimeString().slice(0, 5),
              birth_location: placeOfBirth,
            },
          });

          console.log(response.data, "response.data");

          if (response?.data?.nakshatra && response?.data?.rashi) {
            setFormData((prev) => ({
              ...prev,
              rashi: response.data.rashi,
              nakshatra: response.data.nakshatra,
            }));
          }
        } catch (err) {
          console.error("Failed to fetch rashi and nakshatra:", err);
        } finally {
          setLoadingRasiNakshatram(false);
        }
      };

      fetchRasiNakshatra();
    }
  }, [
    formData.dateOfBirth,
    formData.timeOfBirth,
    formData.placeOfBirth,
    formData.preferredLocation,
    mode,
  ]);

  const availableNakshatrams = nakshatramOptions[formData.rashi] || [];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Header with back button - compact and aligned */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
        </IconButton>
        <Typography
          variant="body1"
          style={{ fontFamily: "Urbanist", fontWeight: 800 }}
          color="#06402B"
        >
          Back
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: "800px", // Constrain width for better alignment
          mx: "auto",
          height: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #43a047 0%, #1b5e20 100%)",
          },
        }}
      >
        {/* Form title - balanced size and styling */}
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          // color="#1a237e"
          style={{ fontFamily: "Urbanist", fontWeight: 800 }}
          sx={{
            maxWidth: "50%", // Prevent title from pushing buttons too far
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 600, // Bolder font for emphasis
            fontFamily: '"Poppins", sans-serif', // Modern font family
            letterSpacing: 0.5, // Slight spacing for readability
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          }}
        >
          {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} User
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
                style={urbanistBoldText}
              >
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name *"
                fullWidth
                size="small"
                value={formData.first_name}
                onChange={handleChange("first_name")}
                onBlur={handleBlur("first_name")} // Add onBlur for validation
                error={!!errors.first_name}
                helperText={errors.first_name || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                    fontFamily: "Urbanist"
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px", fontFamily: "Urbanist", },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#cfd8dc" },
                    "&:hover fieldset": { borderColor: "#3f51b5" },
                    "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name *"
                fullWidth
                size="small"
                value={formData.last_name}
                onChange={handleChange("last_name")}
                onBlur={handleBlur("last_name")} // Add onBlur for validation
                error={!!errors.last_name}
                helperText={errors.last_name || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                    fontFamily: "Urbanist"
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px", fontFamily: "Urbanist" },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#cfd8dc" },
                    "&:hover fieldset": { borderColor: "#3f51b5" },
                    "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email *"
                fullWidth
                size="small"
                value={formData.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")} // Add onBlur for validation
                error={!!errors.email}
                helperText={errors.email || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                    fontFamily: "Urbanist"
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px", fontFamily: "Urbanist" },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#cfd8dc" },
                    "&:hover fieldset": { borderColor: "#3f51b5" },
                    "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number *"
                fullWidth
                size="small"
                value={formData.mobile}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange("mobile")(numericValue);
                }}
                onBlur={handleBlur("mobile")} // Add onBlur for validation
                error={!!errors.mobile}
                helperText={errors.mobile || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                    fontFamily: "Urbanist"
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px", fontFamily: "Urbanist" },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#cfd8dc" },
                    "&:hover fieldset": { borderColor: "#3f51b5" },
                    "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              />
            </Grid>

            {/* Birth Information */}
            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
                style={urbanistBoldText}
              >
                Birth Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                disabled={isViewMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth || "",
                    InputLabelProps: {
                      sx: {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                        fontFamily: "Urbanist"
                      },
                    },
                    InputProps: {
                      sx: { fontSize: "0.9rem", borderRadius: "6px", fontFamily: "Urbanist" },
                    },
                    sx: {
                      "& .MuiInputLabel-root": {
                        fontFamily: "Urbanist",
                        fontSize: "0.9rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#cfd8dc" },
                        "&:hover fieldset": { borderColor: "#3f51b5" },
                        "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                      },
                      "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TimePicker
                label="Time of Birth"
                value={formData.timeOfBirth}
                onChange={handleTimeChange}
                disabled={isViewMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    error: !!errors.timeOfBirth,
                    helperText: errors.timeOfBirth || "",
                    InputLabelProps: {
                      sx: {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                        fontFamily: "Urbanist"
                      },
                    },
                    InputProps: {
                      sx: { fontSize: "0.9rem", borderRadius: "6px", fontFamily: "Urbanist" },
                    },
                    sx: {
                      "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#cfd8dc" },
                        "&:hover fieldset": { borderColor: "#3f51b5" },
                        "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                      },
                      "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PlaceAutocomplete
                label="Place of Birth"
                value={formData.placeOfBirth}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, placeOfBirth: val }));
                  // setErrors((prev) => ({ ...prev, placeOfBirth: "" }));
                }}
                error={!!errors.placeOfBirth}
                helperText={errors.placeOfBirth}
                disabled={isViewMode}
              />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
                style={urbanistBoldText}
              >
                Additional Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <PlaceAutocomplete
                label="Preferred Location"
                value={formData.preferredLocation}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, preferredLocation: val }));
                  // setErrors((prev) => ({ ...prev, preferredLocation: "" }));
                }}
                error={!!errors.preferredLocation}
                helperText={errors.preferredLocation}
                disabled={isViewMode}
              />
            </Grid>

            {loadingRasiNakshatram && (
              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  color="primary"
                  display="flex"
                  alignItems="center"
                  style={{fontFamily: "Urbanist", fontWeight: 600}}
                >
                  <CircularProgress size={14} sx={{ mr: 1 }} />
                  Fetching rashi & nakshatra based on your input...
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={4}>
              <FormControl
                fullWidth
                error={!!errors.rashi}
                disabled={isViewMode}
                size="small"
              >
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                  style={{fontFamily: 'Urbanist'}}
                >
                  Rashi
                </InputLabel>
                <Select
                  value={formData.rashi}
                  onChange={handleChange("rashi")}
                  label="Rashi"
                  sx={{
                    fontFamily: 'Urbanist',
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cfd8dc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  {rasiOptions.map((option) => (
                    <MenuItem key={option} value={option} style={{fontFamily: 'Urbanist'}}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.rashi && (
                  <FormHelperText sx={{ fontSize: "0.75rem" }}>
                    {errors.rashi}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl
                fullWidth
                error={!!errors.nakshatra}
                disabled={isViewMode}
                size="small"
              >
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                  style={{fontFamily: 'Urbanist'}}
                >
                  Nakshatra
                </InputLabel>
                <Select
                  value={formData.nakshatra}
                  onChange={handleChange("nakshatra")}
                  label="Nakshatra"
                  sx={{
                    fontFamily: 'Urbanist',
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cfd8dc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  {availableNakshatrams.map((option) => (
                    <MenuItem key={option} value={option} style={{fontFamily: 'Urbanist'}}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.nakshatra && (
                  <FormHelperText sx={{ fontSize: "0.75rem" }}>
                    {errors.nakshatra}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth disabled={isViewMode} size="small">
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                  style={{fontFamily: 'Urbanist'}}
                >
                  User Type
                </InputLabel>
                <Select
                  value={formData.user_type}
                  onChange={handleChange("user_type")}
                  label="User Type"
                  sx={{
                    fontFamily: 'Urbanist',
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cfd8dc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  {userTypeOptions.map((option) => (
                    <MenuItem key={option} value={option} style={{fontFamily: 'Urbanist'}}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth disabled={isViewMode} size="small">
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Status"
                  sx={{
                    fontFamily: 'Urbanist',
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cfd8dc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <MenuItem value="Active" style={{fontFamily: 'Urbanist'}}>Active</MenuItem>
                  <MenuItem value="Inactive" style={{fontFamily: 'Urbanist'}}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button - Centered and styled */}
            {!isViewMode && (
              <Grid item xs={12} mt={2}>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "8px 24px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
                        boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    {mode === "new" ? "Create User" : "Update User"}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </LocalizationProvider>
  );
};

export default NewUser;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { UserCircle, Calendar, Clock, MapPin, Info, CheckCircle } from "lucide-react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Snackbar,
//   TextField,
//   Typography,
//   Select,
//   FormControl,
//   InputLabel,
//   Alert,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// // Interfaces - TypeScript Types
// interface UserFormData {
//   first_name: string;
//   last_name: string;
//   email: string;
//   mobile: string;
//   dateOfBirth: Date | null;
//   timeOfBirth: Date | null;
//   placeOfBirth: string;
//   preferredLocation: string;
//   rashi: string;
//   nakshatra: string;
//   status: string;
//   user_type: string;
// }

// interface FormErrors {
//   first_name?: string;
//   last_name?: string;
//   email?: string;
//   mobile?: string;
//   dateOfBirth?: string;
//   timeOfBirth?: string;
//   placeOfBirth?: string;
//   preferredLocation?: string;
//   rashi?: string;
//   nakshatra?: string;
// }

// const rasiOptions = [
//   "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
//   "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
// ];

// const nakshatramOptions: Record<string, string[]> = {
//   Aries: ["Ashwini", "Bharani", "Krittika"],
//   Taurus: ["Krittika", "Rohini", "Mrigashira"],
//   Gemini: ["Mrigashira", "Ardra", "Punarvasu"],
//   Cancer: ["Punarvasu", "Pushya", "Ashlesha"],
//   Leo: ["Magha", "Purva Phalguni", "Uttara Phalguni"],
//   Virgo: ["Uttara Phalguni", "Hasta", "Chitra"],
//   Libra: ["Chitra", "Swati", "Vishaka"],
//   Scorpio: ["Vishaka", "Anuradha", "Jyeshta"],
//   Sagittarius: ["Moola", "Purva Ashadha", "Uttara Ashadha"],
//   Capricorn: ["Uttara Ashadha", "Shravana", "Dhanishta"],
//   Aquarius: ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"],
//   Pisces: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati"]
// };

// const userTypeOptions = ["Customer", "Astrologer", "Admin"];

// // Mock functions for the demo
// const callAPI = async ({ endpoint, method, data }: any) => {
//   console.log("API Call:", { endpoint, method, data });
//   return { data: { status: "success" } };
// };

// const NewUser = ({ mode = "new" }: { mode: "new" | "edit" | "view" }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams<{ userId: string }>();
//   const isViewMode = mode === "view";
//   const isFormInitialized = useRef(true);

//   const [formData, setFormData] = useState<UserFormData>({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile: "",
//     dateOfBirth: null,
//     timeOfBirth: null,
//     placeOfBirth: "",
//     preferredLocation: "",
//     rashi: "",
//     nakshatra: "",
//     status: "Active",
//     user_type: "Customer"
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadingRasiNakshatram, setLoadingRasiNakshatram] = useState<boolean>(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error" | "info" | "warning"
//   });

//   // Fetch user data for edit/view mode
//   useEffect(() => {
//     if (mode === "edit" && userId) {
//       setLoading(true);
//       callAPI({
//         endpoint: `api/admin/users/${userId}`,
//         method: "get"
//       }).then(res => {
//         if (res?.data) {
//           const user = res.data;
//           setFormData({
//             first_name: user.first_name || "",
//             last_name: user.last_name || "",
//             email: user.email || "",
//             mobile: user.mobile_number || "",
//             dateOfBirth: user.date_of_birth ? new Date(user.date_of_birth) : null,
//             timeOfBirth: user.time_of_birth ? new Date(`1970-01-01T${user.time_of_birth}`) : null,
//             placeOfBirth: user.place_of_birth || "",
//             preferredLocation: user.preferred_location || "",
//             rashi: user.rashi || "",
//             nakshatra: user.nakshatra || "",
//             status: user.status === "inactive" ? "Inactive" : "Active",
//             user_type: user.user_type ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1).toLowerCase() : "Customer"
//           });
//         }
//         setLoading(false);
//       }).catch(err => {
//         console.error("Error fetching user data:", err);
//         setSnackbar({
//           open: true,
//           message: "Failed to fetch user data",
//           severity: "error"
//         });
//         setLoading(false);
//       });
//     }
//   }, [mode, userId]);

//   // Field validation function
//   const validateField = (field: keyof UserFormData, value: string): string => {
//     let error = "";
//     switch (field) {
//       case "first_name":
//         if (!value.trim()) error = "First name is required";
//         break;
//       case "last_name":
//         if (!value.trim()) error = "Last name is required";
//         break;
//       case "email":
//         if (!value.trim()) {
//           error = "Email is required";
//         } else if (!/^\S+@\S+\.\S+$/.test(value)) {
//           error = "Please enter a valid email address";
//         }
//         break;
//       case "mobile":
//         if (!value.trim()) {
//           error = "Mobile number is required";
//         } else if (!/^\d{10}$/.test(value)) {
//           error = "Mobile number must be exactly 10 digits";
//         }
//         break;
//     }
//     return error;
//   };

//   // Validate all fields on form submission
//   const validate = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     newErrors.first_name = validateField("first_name", formData.first_name);
//     newErrors.last_name = validateField("last_name", formData.last_name);
//     newErrors.email = validateField("email", formData.email);
//     newErrors.mobile = validateField("mobile", formData.mobile);

//     // Filter out empty errors
//     return Object.fromEntries(
//       Object.entries(newErrors).filter(([_, value]) => value !== undefined)
//     ) as FormErrors;
//   };

//   // Handle input changes
//   const handleChange = (field: keyof UserFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: "" }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setLoading(true);

//     try {
//       const endpoint = mode === "edit" ? `api/admin/users/${userId}` : "api/admin/users";
//       const method = mode === "edit" ? "put" : "post";

//       const response = await callAPI({
//         endpoint,
//         method,
//         data: {
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           preferred_location: formData.preferredLocation,
//           email: formData.email,
//           mobile_number: formData.mobile,
//           birth_location: formData.placeOfBirth,
//           date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
//           time_of_birth: formData.timeOfBirth?.toTimeString().slice(0, 5),
//           rashi: formData.rashi,
//           nakshatra: formData.nakshatra,
//           status: formData.status.toLowerCase(),
//           user_type: formData.user_type.toLowerCase()
//         }
//       });

//       setSnackbar({
//         open: true,
//         message: mode === "edit" ? "User updated successfully!" : "User created successfully!",
//         severity: "success"
//       });

//       // Navigate back after successful submission
//       navigate(-1);
//     } catch (err: any) {
//       console.error("API Error:", err);
//       let errorMessage = "Something went wrong. Please try again.";
//       if (err.response && err.response.data) {
//         errorMessage = err.response.data.detail || JSON.stringify(err.response.data.detail);
//       }

//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: "error"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto fetch rashi & nakshatra when birth details are complete
//   useEffect(() => {
//     if (mode === "edit" && !isFormInitialized.current) return;

//     const { dateOfBirth, timeOfBirth, placeOfBirth, preferredLocation } = formData;

//     if (dateOfBirth && timeOfBirth && placeOfBirth.trim() && preferredLocation.trim()) {
//       const fetchRasiNakshatra = async () => {
//         try {
//           setLoadingRasiNakshatram(true);
//           const response = await callAPI({
//             endpoint: "api/auth/rashi-nakshatra",
//             method: "post",
//             data: {
//               preferred_location: preferredLocation,
//               date_of_birth: dateOfBirth.toISOString().split("T")[0],
//               time_of_birth: timeOfBirth.toTimeString().slice(0, 5),
//               birth_location: placeOfBirth
//             }
//           });

//           if (response?.data?.nakshatra && response?.data?.rashi) {
//             setFormData(prev => ({
//               ...prev,
//               rashi: response.data.rashi,
//               nakshatra: response.data.nakshatra
//             }));
//           }
//         } catch (err) {
//           console.error("Failed to fetch rashi and nakshatra:", err);
//         } finally {
//           setLoadingRasiNakshatram(false);
//         }
//       };

//       fetchRasiNakshatra();
//     }
//   }, [formData.dateOfBirth, formData.timeOfBirth, formData.placeOfBirth, formData.preferredLocation, mode]);

//   // Get available nakshatrams based on selected rashi
//   const availableNakshatrams = formData.rashi ? nakshatramOptions[formData.rashi] || [] : [];

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   return (
//     <Box sx={{ backgroundColor: "#f0fdf4", minHeight: "100vh" }}>
//       {/* Header */}
//       <Box sx={{
//           display: "flex",
//           alignItems: "center",
//           mb: 3,
//           background: "rgba(6, 64, 43, 0.03)",
//           borderRadius: "8px",
//           p: 1
//         }}>
//           <IconButton
//             onClick={() => navigate(-1)}
//             sx={{
//               mr: 1,
//               color: "#06402B",
//               "&:hover": {
//                 background: "rgba(6, 64, 43, 0.1)",
//               }
//             }}
//           >
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography
//             variant="body1"
//             fontWeight={600}
//             color="#06402B"
//             sx={{
//               display: "flex",
//               alignItems: "center"
//             }}
//           >
//             Back to Users
//           </Typography>
//         </Box>

//       <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: 3, maxWidth: "screen-xl", mx: "auto" }}>
//         {/* Page title */}
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="h4" sx={{ fontWeight: "bold", color: "#166534" }}>
//             {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} User
//           </Typography>
//           <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
//             {mode === "new"
//               ? "Add a new user to the system"
//               : mode === "edit"
//                 ? "Update existing user information"
//                 : "View user details"}
//           </Typography>
//         </Box>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
//             <CircularProgress size={60} sx={{ color: "#16a34a" }} />
//           </Box>
//         ) : (
//           <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gridTemplateColumns: { lg: "repeat(3, 1fr)" }, gap: 3 }}>
//             {/* Left Column - Personal Information */}
//             <Card variant="outlined">
//               <CardContent>
//                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                   <UserCircle size={24} color="#166534" />
//                   <Typography variant="h6" sx={{ ml: 1, color: "#166534", fontWeight: "semibold" }}>
//                     Personal Information
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                   <TextField
//                     label="First Name *"
//                     value={formData.first_name}
//                     onChange={(e) => handleChange("first_name", e.target.value)}
//                     disabled={isViewMode}
//                     error={!!errors.first_name}
//                     helperText={errors.first_name}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                   />

//                   <TextField
//                     label="Last Name *"
//                     value={formData.last_name}
//                     onChange={(e) => handleChange("last_name", e.target.value)}
//                     disabled={isViewMode}
//                     error={!!errors.last_name}
//                     helperText={errors.last_name}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                   />

//                   <TextField
//                     label="Email *"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     disabled={isViewMode}
//                     error={!!errors.email}
//                     helperText={errors.email}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                   />

//                   <TextField
//                     label="Mobile Number *"
//                     value={formData.mobile}
//                     onChange={(e) => {
//                       const numericValue = e.target.value.replace(/\D/g, "");
//                       handleChange("mobile", numericValue);
//                     }}
//                     disabled={isViewMode}
//                     error={!!errors.mobile}
//                     helperText={errors.mobile}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     inputProps={{ maxLength: 10 }}
//                   />
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Middle Column - Birth Details */}
//             <Card variant="outlined">
//               <CardContent>
//                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                   <Calendar size={24} color="#166534" />
//                   <Typography variant="h6" sx={{ ml: 1, color: "#166534", fontWeight: "semibold" }}>
//                     Birth Details
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                   <TextField
//                     label="Date of Birth"
//                     type="date"
//                     value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
//                     onChange={(e) => handleChange("dateOfBirth", e.target.value ? new Date(e.target.value) : null)}
//                     disabled={isViewMode}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     InputLabelProps={{ shrink: true }}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <Calendar size={18} color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />

//                   <TextField
//                     label="Time of Birth"
//                     type="time"
//                     value={formData.timeOfBirth ? formData.timeOfBirth.toTimeString().slice(0, 5) : ''}
//                     onChange={(e) => {
//                       const timeValue = e.target.value;
//                       if (timeValue) {
//                         const timeDate = new Date();
//                         const [hours, minutes] = timeValue.split(':');
//                         timeDate.setHours(parseInt(hours), parseInt(minutes), 0);
//                         handleChange("timeOfBirth", timeDate);
//                       } else {
//                         handleChange("timeOfBirth", null);
//                       }
//                     }}
//                     disabled={isViewMode}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     InputLabelProps={{ shrink: true }}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <Clock size={18} color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />

//                   <TextField
//                     label="Place of Birth"
//                     value={formData.placeOfBirth}
//                     onChange={(e) => handleChange("placeOfBirth", e.target.value)}
//                     disabled={isViewMode}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <MapPin size={18} color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />

//                   <TextField
//                     label="Preferred Location"
//                     value={formData.preferredLocation}
//                     onChange={(e) => handleChange("preferredLocation", e.target.value)}
//                     disabled={isViewMode}
//                     fullWidth
//                     variant="outlined"
//                     size="small"
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <MapPin size={18} color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />

//                   {loadingRasiNakshatram && (
//                     <Box sx={{ display: "flex", alignItems: "center", color: "#16a34a", fontSize: "0.875rem" }}>
//                       <CircularProgress size={16} sx={{ color: "#16a34a", mr: 1 }} />
//                       Calculating birth chart details...
//                     </Box>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Right Column - Additional Details */}
//             <Card variant="outlined">
//               <CardContent>
//                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                   <Info size={24} color="#166534" />
//                   <Typography variant="h6" sx={{ ml: 1, color: "#166534", fontWeight: "semibold" }}>
//                     Additional Details
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel id="rashi-label">Rashi</InputLabel>
//                     <Select
//                       labelId="rashi-label"
//                       id="rashi"
//                       value={formData.rashi}
//                       onChange={(e) => handleChange("rashi", e.target.value)}
//                       disabled={isViewMode}
//                       label="Rashi"
//                     >
//                       <MenuItem value="" disabled>
//                         Select Rashi
//                       </MenuItem>
//                       {rasiOptions.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   <FormControl fullWidth size="small">
//                     <InputLabel id="nakshatra-label">Nakshatra</InputLabel>
//                     <Select
//                       labelId="nakshatra-label"
//                       id="nakshatra"
//                       value={formData.nakshatra}
//                       onChange={(e) => handleChange("nakshatra", e.target.value)}
//                       disabled={isViewMode || !formData.rashi}
//                       label="Nakshatra"
//                     >
//                       <MenuItem value="" disabled>
//                         {!formData.rashi ? "Select Rashi first" : "Select Nakshatra"}
//                       </MenuItem>
//                       {availableNakshatrams.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   <FormControl fullWidth size="small">
//                     <InputLabel id="user-type-label">User Type</InputLabel>
//                     <Select
//                       labelId="user-type-label"
//                       id="user_type"
//                       value={formData.user_type}
//                       onChange={(e) => handleChange("user_type", e.target.value)}
//                       disabled={isViewMode}
//                       label="User Type"
//                     >
//                       {userTypeOptions.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   <FormControl fullWidth size="small">
//                     <InputLabel id="status-label">Status</InputLabel>
//                     <Select
//                       labelId="status-label"
//                       id="status"
//                       value={formData.status}
//                       onChange={(e) => handleChange("status", e.target.value)}
//                       disabled={isViewMode}
//                       label="Status"
//                     >
//                       <MenuItem value="Active">Active</MenuItem>
//                       <MenuItem value="Inactive">Inactive</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </CardContent>
//             </Card>

//             {/* Action buttons - Full width */}
//             {!isViewMode && (
//               <Box sx={{ gridColumn: { lg: "1 / -1" }, display: "flex", justifyContent: "flex-end", gap: 2 }}>
//                 <Button
//                   variant="outlined"
//                   onClick={() => navigate(-1)}
//                   sx={{ px: 3, py: 1, borderRadius: "8px" }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disabled={loading}
//                   sx={{
//                     px: 3,
//                     py: 1,
//                     borderRadius: "8px",
//                     bgcolor: "#16a34a",
//                     "&:hover": { bgcolor: "#166534" }
//                   }}
//                   startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircle size={18} />}
//                 >
//                   {mode === "new" ? "Create User" : "Update User"}
//                 </Button>
//               </Box>
//             )}
//           </Box>
//         )}
//       </Box>

//       {/* Success/Error notification */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default NewUser;
