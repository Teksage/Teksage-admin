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
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface UserFormData {
  name: string;
  description: string;
  languageSkills: string;
  areasOfExpertise: string;
  yearsOfExperience: string;
  profilePicture: string;
  email: string;
  mobile: string;
  status: string;
  plan: string;
}

const statusOptions = ["Active", "Inactive"];
const planOptions = ["Free", "Basic", "Premium", "Pro"];

const NewAstroUser: React.FC<{ mode: "new" | "edit" | "view" }> = ({
  mode,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    description: "",
    languageSkills: "",
    areasOfExpertise: "",
    yearsOfExperience: "",
    profilePicture: "",
    email: "",
    mobile: "",
    status: "",
    plan: "",
  });

  const handleChange =
    (field: keyof UserFormData) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown }
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Data:", formData);
  };

  const isViewMode = mode === "view";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Go Back</Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h5" gutterBottom>
          {mode === "new"
            ? "Create New Astro User"
            : mode === "edit"
            ? "Edit Astro User"
            : "View Astro User"}
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
                label="Description"
                value={formData.description}
                onChange={handleChange("description")}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Language Skills"
                value={formData.languageSkills}
                onChange={handleChange("languageSkills")}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Areas of Expertise"
                value={formData.areasOfExpertise}
                onChange={handleChange("areasOfExpertise")}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                value={formData.yearsOfExperience}
                onChange={handleChange("yearsOfExperience")}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Profile Picture URL"
                value={formData.profilePicture}
                onChange={handleChange("profilePicture")}
                disabled={isViewMode}
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
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Plan"
                  //   onChange={handleChange('plan')}
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

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Plan</InputLabel>
                <Select
                  value={formData.Plan}
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

            {!isViewMode && (
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
                        boxShadow: "0 4px 12px rgba(27, 77, 62, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
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
    </Box>
  );
};

export default NewAstroUser;
