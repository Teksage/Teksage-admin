import React, { useState, useEffect } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";

interface ServiceFormData {
  name: string;
  status: "Active" | "Inactive";
  pushNotificationTrigger: string;
}

const pushNotificationOptions = ["Yes", "No"];

const NewService: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    status: "Active",
    pushNotificationTrigger: "No",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ServiceFormData, string>>
  >({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // If edit mode, fetch coupon details
        if (mode === "edit" && userId) {
          const couponResponse = await callAPI({
            endpoint: `/api/admin/services/${userId}`,
            method: "get",
          });
          const data = couponResponse?.data;
          console.log(data, "data");
          setFormData({
            name: data?.name,
            pushNotificationTrigger: data?.push_notification_status
              ? "Yes"
              : "No",
            status:
              data?.status.charAt(0).toUpperCase() +
              data?.status.slice(1).toLowerCase(),
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchInitialData();
  }, [mode, userId]);

  // For TextField
  const handleTextChange =
    (field: keyof ServiceFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  // For Select
  const handleSelectChange =
  (field: keyof ServiceFormData) =>
  (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};
    const requiredFields: (keyof ServiceFormData)[] = ["name"];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) newErrors[field] = "This field is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      await callAPI({
        endpoint:
          mode === "edit"
            ? `/api/admin/services/${userId}`
            : "/api/admin/services",
        method: mode === "edit" ? "put" : "post",
        data: {
          name: formData.name,
          push_notification_status:
            formData.pushNotificationTrigger === "Yes" ? true : false,
          status: formData?.status === "Active" ? "active" : "inactive",
        },
      });
      navigate(-1);
    } catch (error) {
      console.error("Error submitting subscription:", error);
    }
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
                onChange={handleTextChange("name")}
                disabled={isViewMode || mode === "edit"}
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
                  onChange={handleSelectChange("pushNotificationTrigger")}
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
                Subscription Status
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                size="small"
                value={formData.status}
                onChange={handleTextChange("status")}
                disabled={isViewMode}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
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
