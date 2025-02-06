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

  const handleChange =
    (field: keyof ServiceFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value as string,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(mode === "edit" ? "Updating Service" : "Creating Service", formData);
  };

  const isViewMode = mode === "view";

  return (
    <Box sx={{ maxWidth: "900px", margin: "auto", pt: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Go Back</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          {mode === "new"
            ? "Create New Service"
            : mode === "edit"
            ? "Edit Service"
            : "View Service"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange("name")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Push Notification</InputLabel>
                <Select
                  value={formData.pushNotificationTrigger}
                  label="Push Notification"
                  onChange={handleChange("pushNotificationTrigger")}
                  disabled={isViewMode}
                  required
                >
                  {pushNotificationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                value={formData.description}
                onChange={handleChange("description")}
                disabled={isViewMode}
                required
                multiline
                rows={3}
              />
            </Grid>

            {!isViewMode && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
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
