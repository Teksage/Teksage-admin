import React, { useState } from "react";
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
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface UserFormData {
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: Date | null;
  timeOfBirth: Date | null;
  placeOfBirth: string;
  preferredLocation: string;
  rasi: string;
  nakshatram: string;
  status: string;
  plan: string;
  userType: string;
}

const rasiOptions = [
  "Mesham",
  "Rishabam",
  "Mithunam",
  "Katakam",
  "Simmam",
  "Kanni",
  "Thulam",
  "Vrischikam",
  "Dhanusu",
  "Makaram",
  "Kumbham",
  "Meenam",
];

const nakshatramOptions = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const statusOptions = ["Active", "Inactive"];
const planOptions = ["Free", "Basic", "Premium", "Pro"];
const userTypeOptions = ["User", "Astrologer", "Admin"];

const NewUser: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    mobile: "",
    dateOfBirth: null,
    timeOfBirth: null,
    placeOfBirth: "",
    preferredLocation: "",
    rasi: "",
    nakshatram: "",
    status: "",
    plan: "",
    userType: "",
  });

  const handleChange =
    (field: keyof UserFormData) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown }
      >
    ) => {
      // setFormData(prev => ({
      //   ...prev,
      //   [field]: event.target.value
      // }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    // Add your submit logic here
  };

  const isViewMode = mode === "view";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Go Back</Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h5" gutterBottom>
          {mode === "new"
            ? "Create New User"
            : mode === "edit"
            ? "Edit User"
            : "View User"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.mobile}
                onChange={handleChange("mobile")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(newValue: any) => {
                  setFormData((prev) => ({ ...prev, dateOfBirth: newValue }));
                }}
                disabled={isViewMode}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TimePicker
                label="Time of Birth"
                value={formData.timeOfBirth}
                onChange={(newValue: any) => {
                  setFormData((prev) => ({ ...prev, timeOfBirth: newValue }));
                }}
                disabled={isViewMode}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            {/* Location Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Place of Birth"
                value={formData.placeOfBirth}
                onChange={handleChange("placeOfBirth")}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preferred Location"
                value={formData.preferredLocation}
                onChange={handleChange("preferredLocation")}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rasi</InputLabel>
                <Select
                  value={formData.rasi}
                  label="Rasi"
                  //   onChange={handleChange('rasi')}
                  disabled={isViewMode}
                >
                  {rasiOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Nakshatram</InputLabel>
                <Select
                  value={formData.nakshatram}
                  label="Nakshatram"
                  //   onChange={handleChange('nakshatram')}
                  disabled={isViewMode}
                >
                  {nakshatramOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  //   onChange={handleChange('status')}
                  disabled={isViewMode}
                  required
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Plan</InputLabel>
                <Select
                  value={formData.plan}
                  label="Plan"
                  //   onChange={handleChange('plan')}
                  disabled={isViewMode}
                  required
                >
                  {planOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select
                  value={formData.userType}
                  label="User Type"
                  //   onChange={handleChange('userType')}
                  disabled={isViewMode}
                  required
                >
                  {userTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {!isViewMode && (
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button type="submit" variant="contained" size="large">
                    {mode === "new" ? "Create User" : "Update User"}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default NewUser;
