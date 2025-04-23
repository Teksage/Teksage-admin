import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";

interface SubscriptionFormData {
  plan_name: string;
  plan_price: number | "";
  services: string;
  status: "Active" | "Inactive";
  service_type: string;
  duration_value: number | "";
  duration_unit: "days" | "months" | "years";
}

const NewSubscription: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    plan_name: "",
    plan_price: "",
    services: "",
    status: "Active",
    service_type: "",
    duration_value: "",
    duration_unit: "months",
  });

  const handleChange =
    (field: keyof SubscriptionFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === "plan_price" || field === "duration_value" ? +value : value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await callAPI({
        endpoint: mode === "edit" ? `/api/admin/subscriptions/${userId}` : "/api/admin/subscriptions",
        method: mode === "edit" ? "put" : "post",
        data: formData,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error submitting subscription:", error);
    }
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

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          {mode === "new"
            ? "Create New Subscription"
            : mode === "edit"
            ? "Edit Subscription"
            : "View Subscription"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Plan Name"
                fullWidth
                value={formData.plan_name}
                onChange={handleChange("plan_name")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Plan Price"
                fullWidth
                value={formData.plan_price}
                onChange={handleChange("plan_price")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Services"
                fullWidth
                multiline
                rows={3}
                value={formData.services}
                onChange={handleChange("services")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Service Type"
                fullWidth
                value={formData.service_type}
                onChange={handleChange("service_type")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                type="number"
                label="Duration Value"
                fullWidth
                value={formData.duration_value}
                onChange={handleChange("duration_value")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                select
                label="Duration Unit"
                fullWidth
                value={formData.duration_unit}
                onChange={handleChange("duration_unit")}
                disabled={isViewMode}
                required
              >
                {["days", "months", "years"].map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                value={formData.status}
                onChange={handleChange("status")}
                disabled={isViewMode}
                required
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            {!isViewMode && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: "linear-gradient(to right, #4CAF50, #81C784)",
                      padding: "10px 28px",
                      fontWeight: 600,
                      borderRadius: "10px",
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                      "&:hover": {
                        background: "linear-gradient(to right, #66BB6A, #A5D6A7)",
                      },
                    }}
                  >
                    {mode === "new" ? "Create Subscription" : "Update Subscription"}
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

export default NewSubscription;
