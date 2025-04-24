import React, { useState, useEffect } from "react";
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
  plan_id: number;
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
    plan_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await callAPI({
          endpoint: "/api/admin/service-catalogs",
          method: "get",
        });
        console.log(response, "service-catalogs Response");
        const transformedPlans = response?.data?.map((plan: any) => ({
          id: plan?.plan_id,
          name: `${plan.plan_name} (${plan.duration_value} ${plan.duration_unit})`,
        }));
        console.log(transformedPlans, "transformedPlans");
        setPlanData(transformedPlans);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleChange =
    (field: keyof CouponFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "coupon_percentage" || field === "max_cap" ? +value : value,
      }));

      // ✅ Clear the error for this field when user starts typing
      setErrors((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.coupon_name.trim()) newErrors.coupon_name = true;
    if (formData.coupon_percentage === "" || formData.coupon_percentage < 0)
      newErrors.coupon_percentage = true;
    if (formData.max_cap === "" || formData.max_cap < 0)
      newErrors.max_cap = true;
    if (!formData.start_date) newErrors.start_date = true;
    if (!formData.end_date) newErrors.end_date = true;
    if (!formData.plan_id) newErrors.plan_id = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      console.log(formData, "formData");
      await callAPI({
        endpoint:
          mode === "edit"
            ? `/api/admin/coupons/${userId}`
            : "/api/admin/coupons",
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
          mx: "auto",
          backgroundColor: "#fafafa",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h6" fontWeight={500} mb={2}>
          {mode === "new"
            ? "Create New Coupon"
            : mode === "edit"
            ? "Edit Coupon"
            : "View Coupon"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Coupon Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Coupon Name"
                fullWidth
                size="small"
                value={formData.coupon_name}
                onChange={handleChange("coupon_name")}
                disabled={isViewMode}
                error={errors.coupon_name}
                helperText={errors.coupon_name && "Coupon name is required."}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                type="number"
                label="Coupon %"
                fullWidth
                size="small"
                value={formData.coupon_percentage}
                onChange={handleChange("coupon_percentage")}
                disabled={isViewMode}
                error={errors.coupon_percentage}
                helperText={
                  errors.coupon_percentage &&
                  "Enter a valid percentage (0 or more)."
                }
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                type="number"
                label="Max Cap"
                fullWidth
                size="small"
                value={formData.max_cap}
                onChange={handleChange("max_cap")}
                disabled={isViewMode}
                error={errors.max_cap}
                helperText={
                  errors.max_cap && "Enter a valid max cap (0 or more)."
                }
              />
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Validity Period
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.start_date}
                onChange={(newValue) => {
                  setFormData((prev) => ({ ...prev, start_date: newValue }));
                  setErrors((prev) => ({ ...prev, start_date: "" }));
                }}
                disabled={isViewMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    // required: true,
                    size: "small",
                    error: errors.start_date,
                    helperText: errors.start_date && "Start date is required.",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.end_date}
                onChange={(newValue) => {
                  setFormData((prev) => ({ ...prev, end_date: newValue }));
                  setErrors((prev) => ({ ...prev, end_date: "" }));
                }}
                disabled={isViewMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    // required: true,
                    size: "small",
                    error: errors.end_date,
                    helperText: errors.end_date && "End date is required.",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Applicable Plan
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Plan Name"
                fullWidth
                size="small"
                value={formData.plan_id}
                onChange={handleChange("plan_id")}
                disabled={isViewMode}
                error={!!errors.plan_id}
                helperText={errors.plan_id && "Plan name is required."}
              >
                {planData.map((plan:any) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </TextField>
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
