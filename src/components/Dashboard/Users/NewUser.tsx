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

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    return newErrors;
  };

  // Helper function to update form data
  const updateFormData = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // const handleChange =
  //   (field: keyof UserFormData) =>
  //   (event: React.ChangeEvent<{ value: unknown }>) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [field]: event.target.value as string,
  //     }));
  //     setErrors((prev) => ({ ...prev, [field]: "" }));
  //   };

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
        errorMessage = err.response.data.message || JSON.stringify(err.response.data);
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  // useEffect(() => {
  //   // Reset nakshatra when rashi changes
  //   setFormData((prev) => ({
  //     ...prev,
  //     nakshatra: "",
  //   }));
  // }, [formData.rashi]);

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

          console.log(response.data, "response.data")

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

  console.log(formData);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Header with back button - compact and aligned */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon sx={{ fontSize: 24, color: "#3f51b5" }} />
        </IconButton>
        <Typography variant="body1" fontWeight={600} color="#3f51b5">
          Back
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: "800px", // Constrain width for better alignment
          mx: "auto",
          backgroundColor: "#f9f9fb",
          borderRadius: "12px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* Form title - balanced size and styling */}
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          color="#1a237e"
          sx={{ letterSpacing: "0.3px", textAlign: "start" }}
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
              >
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                size="small"
                value={formData.first_name}
                onChange={handleChange("first_name")}
                error={!!errors.first_name}
                helperText={errors.first_name || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px" },
                }}
                sx={{
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
                label="Last Name"
                fullWidth
                size="small"
                value={formData.last_name}
                onChange={handleChange("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px" },
                }}
                sx={{
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
                label="Email"
                fullWidth
                size="small"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px" },
                }}
                sx={{
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
                label="Mobile Number"
                fullWidth
                size="small"
                value={formData.mobile}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange("mobile")(numericValue);
                }}
                error={!!errors.mobile}
                helperText={errors.mobile || ""}
                disabled={isViewMode}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px" },
                }}
                sx={{
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
                      },
                    },
                    InputProps: {
                      sx: { fontSize: "0.9rem", borderRadius: "6px" },
                    },
                    sx: {
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
                      },
                    },
                    InputProps: {
                      sx: { fontSize: "0.9rem", borderRadius: "6px" },
                    },
                    sx: {
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
                >
                  Rashi
                </InputLabel>
                <Select
                  value={formData.rashi}
                  onChange={handleChange("rashi")}
                  label="Rashi"
                  sx={{
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
                    <MenuItem key={option} value={option}>
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
                >
                  Nakshatra
                </InputLabel>
                <Select
                  value={formData.nakshatra}
                  onChange={handleChange("nakshatra")}
                  label="Nakshatra"
                  sx={{
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
                    <MenuItem key={option} value={option}>
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
                >
                  User Type
                </InputLabel>
                <Select
                  value={formData.user_type}
                  onChange={handleChange("user_type")}
                  label="User Type"
                  sx={{
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
                    <MenuItem key={option} value={option}>
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
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
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
