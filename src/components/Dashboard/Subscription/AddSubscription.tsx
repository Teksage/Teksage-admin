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
