import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory"; // adjust path as per your project
import CustomSnackbar from "../../Elements/CustomSnackbar";

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  dateOfBirth: Date | null;
  timeOfBirth: Date | null;
  placeOfBirth: string;
  preferredLocation: string;
  rasi: string;
  nakshatram: string;
  status: string;
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

const NewUser: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isViewMode = mode === "view";

  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    dateOfBirth: null,
    timeOfBirth: null,
    placeOfBirth: "",
    preferredLocation: "",
    rasi: "",
    nakshatram: "",
    status: "Active",
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
    if (mode === "edit" && userId) {
      (async () => {
        try {
          const res = await callAPI({
            endpoint: `api/admin/users/${userId}`,
            method: "get",
          });

          const user = res?.data;
          console.log(user, "user");
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
            placeOfBirth: user.birth_location || "",
            preferredLocation: user.preferred_location || "",
            rasi: user.rasi || "",
            nakshatram: user.nakshatram || "",
            status: user.status === "inactive" ? "Inactive" : "Active",
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      })();
    }
  }, [mode, userId]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.timeOfBirth)
      newErrors.timeOfBirth = "Time of Birth is required";
    if (!formData.placeOfBirth.trim())
      newErrors.placeOfBirth = "Place of Birth is required";
    if (!formData.preferredLocation.trim())
      newErrors.preferredLocation = "Preferred Location is required";
    return newErrors;
  };

  const handleChange =
    (field: keyof UserFormData) =>
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value as string,
      }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
      await callAPI({
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
          rasi: formData.rasi,
          nakshatram: formData.nakshatram,
          status: formData.status.toLowerCase(),
        },
      });
      setSnackbar({
        open: true,
        message:
          mode === "edit"
            ? "User updated successfully!"
            : "User created successfully!",
        severity: "success",
      });

      navigate(-1);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    // Reset nakshatram when rasi changes
    setFormData((prev) => ({
      ...prev,
      nakshatram: "",
    }));
  }, [formData.rasi]);

  // ⏳ Auto trigger Rasi & Nakshatram fetch
  useEffect(() => {
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

          if (response?.data?.nakshatra && response?.data?.rashi) {
            setFormData((prev) => ({
              ...prev,
              rasi: response?.data?.rashi,
              nakshatram: response?.data?.nakshatra,
            }));
          }
        } catch (err) {
          console.error("Failed to fetch rasi and nakshatra:", err);
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
  ]);

  const availableNakshatrams = nakshatramOptions[formData.rasi] || [];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Go Back</Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: "1200px",
          mx: "auto",
          backgroundColor: "#fefefe",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={600}>
          {mode === "new"
            ? "Create New User"
            : mode === "edit"
            ? "Edit User"
            : "View User"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.first_name}
                onChange={handleChange("first_name")}
                error={!!errors.first_name}
                helperText={errors.first_name}
                disabled={isViewMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={formData.last_name}
                onChange={handleChange("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name}
                disabled={isViewMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isViewMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                fullWidth
                value={formData.mobile}
                onChange={handleChange("mobile")}
                error={!!errors.mobile}
                helperText={errors.mobile}
                disabled={isViewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                disabled={isViewMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TimePicker
                label="Time of Birth"
                value={formData.timeOfBirth}
                onChange={handleTimeChange}
                disabled={isViewMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.timeOfBirth,
                    helperText: errors.timeOfBirth,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Place of Birth"
                fullWidth
                value={formData.placeOfBirth}
                onChange={handleChange("placeOfBirth")}
                error={!!errors.placeOfBirth}
                helperText={errors.placeOfBirth}
                disabled={isViewMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Preferred Location"
                fullWidth
                value={formData.preferredLocation}
                onChange={handleChange("preferredLocation")}
                error={!!errors.preferredLocation}
                helperText={errors.preferredLocation}
                disabled={isViewMode}
              />
            </Grid>

            {loadingRasiNakshatram && (
              <Grid item xs={12}>
                <Typography variant="body2" color="primary">
                  Fetching Rasi & Nakshatram based on your input...
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={!!errors.rasi}
                disabled={isViewMode}
              >
                <InputLabel>Rasi</InputLabel>
                <Select
                  value={formData.rasi}
                  onChange={handleChange("rasi")}
                  label="Rasi"
                >
                  {rasiOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.rasi && <FormHelperText>{errors.rasi}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={!!errors.nakshatram}
                disabled={isViewMode}
              >
                <InputLabel>Nakshatram</InputLabel>
                <Select
                  value={formData.nakshatram}
                  onChange={handleChange("nakshatram")}
                  label="Nakshatram"
                >
                  {availableNakshatrams.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.nakshatram && (
                  <FormHelperText>{errors.nakshatram}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isViewMode}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!isViewMode && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: "linear-gradient(to right, #00C853, #00695C)",
                      padding: "10px 28px",
                      fontWeight: 600,
                      borderRadius: "10px",
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #00E676, #00897B)",
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
