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

interface ServiceFormData {
  name: string;
  description: string;
  pushNotificationTrigger: string;
}

const pushNotificationOptions = ["Yes", "No"];

const NewService: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    pushNotificationTrigger: "No",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});

  const handleChange =
    (field: keyof ServiceFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value as string,
      }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};
    const requiredFields: (keyof ServiceFormData)[] = ["name", "description"];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) newErrors[field] = "This field is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    console.log(
      mode === "edit" ? "Updating Service" : "Creating Service",
      formData
    );
  };

  const isViewMode = mode === "view";

  return (
    <Box sx={{ margin: "auto", pt: 2 }}>
      {/* Header with back button - more compact and subtle */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={500}>
          Back
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: "#fafafa",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h6" fontWeight={500} mb={2}>
          {mode === "new"
            ? "Create New Service"
            : mode === "edit"
            ? "Edit Service"
            : "View Service"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Service Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                value={formData.name}
                onChange={handleChange("name")}
                disabled={isViewMode}
                // required
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Push Notification</InputLabel>
                <Select
                  value={formData.pushNotificationTrigger}
                  label="Push Notification"
                  onChange={handleChange("pushNotificationTrigger")}
                  disabled={isViewMode}
                  // required
                >
                  {pushNotificationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Service Description
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                size="small"
                value={formData.description}
                onChange={handleChange("description")}
                disabled={isViewMode}
                // required
                multiline
                rows={3}
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
            </Grid>

            {!isViewMode && (
              <Grid item xs={12} mt={2}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "8px 22px",
                      fontWeight: 500,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
                        boxShadow: "0 3px 8px rgba(27, 77, 62, 0.25)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {mode === "new" ? "Create Service" : "Update Service"}
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

export default NewService;