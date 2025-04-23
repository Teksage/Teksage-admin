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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { callAPI } from "../../../api/crudFactory";

interface CouponFormData {
  coupon_name: string;
  coupon_percentage: number | "";
  max_cap: number | "";
  start_date: Date | null;
  end_date: Date | null;
  plan_name: string;
}

const NewCoupon: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<CouponFormData>({
    coupon_name: "",
    coupon_percentage: "",
    max_cap: "",
    start_date: null,
    end_date: null,
    plan_name: "",
  });

  const handleChange =
    (field: keyof CouponFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === "coupon_percentage" || field === "max_cap" ? +value : value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await callAPI({
        endpoint: mode === "edit" ? `/api/admin/coupons/${userId}` : "/api/admin/coupons",
        method: mode === "edit" ? "put" : "post",
        data: formData,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error submitting coupon:", error);
    }
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

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          {mode === "new"
            ? "Create New Coupon"
            : mode === "edit"
            ? "Edit Coupon"
            : "View Coupon"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Coupon Name"
                fullWidth
                value={formData.coupon_name}
                onChange={handleChange("coupon_name")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                type="number"
                label="Coupon %"
                fullWidth
                value={formData.coupon_percentage}
                onChange={handleChange("coupon_percentage")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                type="number"
                label="Max Cap"
                fullWidth
                value={formData.max_cap}
                onChange={handleChange("max_cap")}
                disabled={isViewMode}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.start_date}
                onChange={(newValue) => setFormData((prev) => ({ ...prev, start_date: newValue }))}
                disabled={isViewMode}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.end_date}
                onChange={(newValue) => setFormData((prev) => ({ ...prev, end_date: newValue }))}
                disabled={isViewMode}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Plan Name"
                fullWidth
                value={formData.plan_name}
                onChange={handleChange("plan_name")}
                disabled={isViewMode}
                required
              />
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
                    {mode === "new" ? "Create Coupon" : "Update Coupon"}
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

export default NewCoupon;
