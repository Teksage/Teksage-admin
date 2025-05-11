import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";
import CustomSnackbar from "../../Elements/CustomSnackbar";

interface SubscriptionFormData {
  plan_name: string;
  plan_price: number | "";
  services: string[];
  status: "Active" | "Inactive";
  service_type: "free" | "premium";
  duration_value: number | "";
  duration_unit: "days" | "months" | "years";
}

const NewSubscription: React.FC<{ mode: "new" | "edit" | "view" }> = ({
  mode,
}) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    plan_name: "",
    plan_price: "",
    services: [],
    status: "Active",
    service_type: "free",
    duration_value: "",
    duration_unit: "months",
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SubscriptionFormData, string>>
  >({});
  const [services, setServices] = useState([]);
  // State to hold raw input string for plan_price
  const [inputValues, setInputValues] = useState({
    plan_price: "",
  });
  // Ref to track cursor position for plan_price
  const planPriceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const serviceResponse = await callAPI({
          endpoint: "/api/admin/services",
          method: "get",
        });

        console.log(serviceResponse, "serviceResponse");
        setServices(serviceResponse?.data);

        if (mode === "edit" && userId) {
          const subscriptionResponse = await callAPI({
            endpoint: `/api/admin/service-catalogs/${userId}`,
            method: "get",
          });
          const data = subscriptionResponse?.data;
          console.log(data, "data");
          const price = data?.plan_price != null ? Number(data.plan_price) : "";
          setFormData({
            ...data,
            status:
              data?.status.charAt(0).toUpperCase() +
              data?.status.slice(1).toLowerCase(),
            plan_price: price,
          });
          // Set initial input value for plan_price
          setInputValues({
            plan_price: price === "" ? "" : String(price),
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchInitialData();
  }, [mode, userId]);

  const handleTextChange =
    (field: keyof SubscriptionFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "duration_value"
            ? value === ""
              ? ""
              : Number(value) // Convert to number for duration_value
            : value,
      }));
      setErrors((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    };

  const handleNumberChange =
    (field: "plan_price", inputRef: React.RefObject<HTMLInputElement>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const cursorPosition = input.selectionStart || 0;
      let value = event.target.value.replace(/,/g, ""); // Remove commas for processing

      // Allow empty input
      if (value === "") {
        setFormData((prev) => ({ ...prev, [field]: "" }));
        setInputValues((prev) => ({ ...prev, [field]: "" }));
        setErrors((prev: any) => ({ ...prev, [field]: "" }));
        return;
      }

      // Validate input: numbers and one decimal point, up to 2 decimal places
      if (!/^\d*\.?\d{0,2}$/.test(value)) return;

      const numValue = Number(value);
      if (isNaN(numValue)) return;

      // Update formData with raw number
      setFormData((prev) => ({ ...prev, [field]: numValue }));
      // Update inputValues with raw string (without commas)
      setInputValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev: any) => ({ ...prev, [field]: "" }));

      // Calculate new cursor position after formatting
      const formattedValue = numValue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      const commasBeforeCursor = (value.substring(0, cursorPosition).match(/,/g) || []).length;
      const newCommasBeforeCursor = (formattedValue.substring(0, cursorPosition).match(/,/g) || []).length;
      const cursorAdjustment = newCommasBeforeCursor - commasBeforeCursor;

      // Set cursor position after formatting
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPosition = cursorPosition + cursorAdjustment;
          inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    };

  const handleSelectChange =
    <T extends string | string[]>(field: keyof SubscriptionFormData) =>
    (e: SelectChangeEvent<T>) => {
      const value = e.target.value as T;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plan_name.trim()) {
      newErrors.plan_name = "Plan name is required.";
    }
    if (
      formData.plan_price === "" ||
      isNaN(formData.plan_price as number) ||
      (formData.plan_price as number) <= 0
    ) {
      newErrors.plan_price =
        "Plan price must be a valid number greater than 0.";
    }
    if (!formData.services.length) {
      newErrors.services = "Services field is required.";
    }
    if (
      formData.duration_value === "" ||
      isNaN(formData.duration_value as number) ||
      (formData.duration_value as number) <= 0
    ) {
      newErrors.duration_value =
        "Duration value must be a valid number greater than 0.";
    }
    if (!formData.duration_unit) {
      newErrors.duration_unit = "Duration unit is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      await callAPI({
        endpoint:
          mode === "edit"
            ? `/api/admin/service-catalogs/${userId}`
            : "/api/admin/service-catalogs",
        method: mode === "edit" ? "put" : "post",
        data: formData,
      });

      setSnackbar({
        open: true,
        message:
          mode === "edit"
            ? "Subscription updated successfully!"
            : "Subscription created successfully!",
        severity: "success",
      });

      navigate(-1);
    } catch (error: any) {
      console.error("Error submitting subscription:", error);
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.detail ||
          JSON.stringify(error.response.data?.detail);
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const isViewMode = mode === "view";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
        </IconButton>
        <Typography variant="body1" fontWeight={600} color="#06402B">
          Back
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: "800px",
          mx: "auto",
          backgroundColor: "#f9f9fb",
          borderRadius: "12px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          sx={{
            maxWidth: "50%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 600,
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: 0.5,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          {mode === "new"
            ? "Create Subscription"
            : mode === "edit"
            ? "Edit Subscription"
            : "View Subscription"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
              >
                Plan Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Plan Name *"
                fullWidth
                size="small"
                value={formData.plan_name}
                onChange={handleTextChange("plan_name")}
                disabled={isViewMode}
                error={!!errors.plan_name}
                helperText={errors.plan_name || ""}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#cfd8dc" },
                    "&:hover fieldset": { borderColor: "#3f51b5" },
                    "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Plan Price *"
                fullWidth
                size="small"
                inputRef={planPriceRef}
                value={
                  isViewMode
                    ? formData.plan_price === ""
                      ? ""
                      : Number(formData.plan_price).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                    : inputValues.plan_price === ""
                    ? ""
                    : Number(inputValues.plan_price).toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                }
                onChange={handleNumberChange("plan_price", planPriceRef)}
                onKeyDown={(e) => {
                  if (
                    !/[0-9.]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                disabled={isViewMode}
                error={!!errors.plan_price}
                helperText={errors.plan_price || ""}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  },
                }}
                InputProps={{
                  sx: { fontSize: "0.9rem", borderRadius: "6px" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#cfd8dc" },
                    "&:hover fieldset": { borderColor: "#3f51b5" },
                    "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                size="small"
                error={!!errors.services}
                disabled={isViewMode}
              >
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                >
                  Services *
                </InputLabel>
                <Select<string[]>
                  multiple
                  value={formData.services}
                  onChange={handleSelectChange("services")}
                  input={<OutlinedInput label="Services *" />}
                  renderValue={(selected) =>
                    services
                      .filter((item: any) => selected.includes(item.id))
                      .map((item: any) => item.name)
                      .join(", ")
                  }
                  sx={{
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cfd8dc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  {services.map((service: any) => (
                    <MenuItem key={service.id} value={service.id}>
                      <Checkbox
                        checked={formData.services.includes(service.id)}
                      />
                      <ListItemText primary={service.name} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ fontSize: "0.75rem" }}>
                  {errors.services || ""}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
              >
                Service Configuration
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                disabled={isViewMode}
                size="small"
                error={!!errors.service_type}
              >
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                >
                  Service Type
                </InputLabel>
                <Select
                  value={formData.service_type}
                  onChange={handleSelectChange("service_type")}
                  label="Service Type"
                  sx={{
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cfd8dc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
                <FormHelperText sx={{ fontSize: "0.75rem" }}>
                  {errors.service_type || ""}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    label="Duration Value *"
                    fullWidth
                    size="small"
                    value={formData.duration_value}
                    onChange={handleTextChange("duration_value")}
                    disabled={isViewMode}
                    error={!!errors.duration_value}
                    helperText={errors.duration_value || ""}
                    InputLabelProps={{
                      sx: {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                      },
                    }}
                    InputProps={{
                      sx: { fontSize: "0.9rem", borderRadius: "6px" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#cfd8dc" },
                        "&:hover fieldset": { borderColor: "#3f51b5" },
                        "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                      },
                      "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    disabled={isViewMode}
                    size="small"
                    error={!!errors.duration_unit}
                  >
                    <InputLabel
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                      }}
                    >
                      Duration Unit *
                    </InputLabel>
                    <Select
                      value={formData.duration_unit}
                      onChange={handleSelectChange("duration_unit")}
                      label="Duration Unit *"
                      sx={{
                        fontSize: "0.9rem",
                        borderRadius: "6px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cfd8dc",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3f51b5",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3f51b5",
                        },
                      }}
                    >
                      {["days", "months", "years"].map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ fontSize: "0.75rem" }}>
                      {errors.duration_unit || ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
              >
                Subscription Status
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isViewMode} size="small">
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleSelectChange("status")}
                  label="Status"
                  sx={{
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cfd8dc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {!isViewMode && (
              <Grid item xs={12} mt={2}>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "8px 24px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
                        boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    {mode === "new"
                      ? "Create Subscription"
                      : "Update Subscription"}
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
    </Box>
  );
};

export default NewSubscription;