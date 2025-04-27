// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Grid,
//   Typography,
//   Paper,
//   IconButton,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   FormHelperText,
//   OutlinedInput,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { callAPI } from "../../../api/crudFactory";

// interface SubscriptionFormData {
//   plan_name: string;
//   plan_price: number | "";
//   services: string[];
//   status: "Active" | "Inactive";
//   service_type: "Free" | "Premium";
//   duration_value: number | "";
//   duration_unit: "days" | "months" | "years";
// }

// const NewSubscription: React.FC<{ mode: "new" | "edit" | "view" }> = ({
//   mode,
// }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [formData, setFormData] = useState<SubscriptionFormData>({
//     plan_name: "",
//     plan_price: "",
//     services: [],
//     status: "Active",
//     service_type: "Free",
//     duration_value: "",
//     duration_unit: "months",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [services, setServices] = useState([]);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // Fetch all service
//         const serviceResponse = await callAPI({
//           endpoint: "/api/admin/services",
//           method: "get",
//         });

//         console.log(serviceResponse, "serviceResponse");
//         setServices(serviceResponse?.data);

//         // If edit mode, fetch coupon details
//         if (mode === "edit" && userId) {
//           const couponResponse = await callAPI({
//             endpoint: `/api/admin/service-catalogs/${userId}`,
//             method: "get",
//           });
//           const data = couponResponse?.data;
//           console.log(data, "data");
//           setFormData({
//             ...data,
//             status:
//               data?.status.charAt(0).toUpperCase() +
//               data?.status.slice(1).toLowerCase(),
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchInitialData();
//   }, [mode, userId]);

//   const handleChange =
//     (field: keyof SubscriptionFormData) =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const value = event.target.value;
//       setFormData((prev) => ({
//         ...prev,
//         [field]:
//           field === "plan_price" || field === "duration_value" ? +value : value,
//       }));
//       setErrors((prev: any) => ({
//         ...prev,
//         [field]: "",
//       }));
//     };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.plan_name.trim()) {
//       newErrors.plan_name = "Plan name is required.";
//     }
//     if (!formData.plan_price || formData.plan_price <= 0) {
//       newErrors.plan_price = "Plan price must be greater than 0.";
//     }
//     if (!formData.services.length) {
//       newErrors.services = "Services field is required.";
//     }
//     // if (!formData.service_type.trim()) {
//     //   newErrors.service_type = "Service type is required.";
//     // }
//     if (!formData.duration_value || formData.duration_value <= 0) {
//       newErrors.duration_value = "Duration value must be greater than 0.";
//     }
//     if (!formData.duration_unit) {
//       newErrors.duration_unit = "Duration unit is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!validateForm()) return;
//     try {
//       await callAPI({
//         endpoint:
//           mode === "edit"
//             ? `/api/admin/service-catalogs/${userId}`
//             : "/api/admin/service-catalogs",
//         method: mode === "edit" ? "put" : "post",
//         data: formData,
//       });
//       navigate(-1);
//     } catch (error) {
//       console.error("Error submitting subscription:", error);
//     }
//   };

//   const isViewMode = mode === "view";

//   return (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
//           <ArrowBackIcon fontSize="small" />
//         </IconButton>
//         <Typography variant="subtitle1" fontWeight={500}>
//           Back
//         </Typography>
//       </Box>

//       <Paper
//         elevation={2}
//         sx={{
//           p: { xs: 2, sm: 3 },
//           mx: "auto",
//           backgroundColor: "#fafafa",
//           borderRadius: "12px",
//         }}
//       >
//         <Typography variant="h6" fontWeight={500} mb={2}>
//           {mode === "new"
//             ? "Create New Subscription"
//             : mode === "edit"
//             ? "Edit Subscription"
//             : "View Subscription"}
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Plan Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Plan Name"
//                 fullWidth
//                 size="small"
//                 value={formData.plan_name}
//                 onChange={handleChange("plan_name")}
//                 disabled={isViewMode}
//                 error={!!errors.plan_name}
//                 helperText={errors.plan_name}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 type="number"
//                 label="Plan Price"
//                 fullWidth
//                 size="small"
//                 value={formData.plan_price}
//                 onChange={handleChange("plan_price")}
//                 disabled={isViewMode}
//                 error={!!errors.plan_price}
//                 helperText={errors.plan_price}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormControl
//                 fullWidth
//                 size="small"
//                 error={!!errors.services}
//                 disabled={isViewMode}
//               >
//                 <InputLabel>Services</InputLabel>
//                 <Select
//                   multiple
//                   value={formData.services}
//                   onChange={handleChange("services")}
//                   input={<OutlinedInput label="Services" />}
//                   renderValue={(selected) =>
//                     services
//                       .filter((item) => selected.includes(item.id))
//                       .map((item) => item.name)
//                       .join(", ")
//                   }
//                 >
//                   {services.map((service: any) => (
//                     <MenuItem key={service.id} value={service.id}>
//                       <Checkbox
//                         checked={formData.services.includes(service.id)}
//                       />
//                       <ListItemText primary={service.name} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 <FormHelperText>{errors.services}</FormHelperText>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} mt={1}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Service Configuration
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Service Type"
//                 select
//                 fullWidth
//                 size="small"
//                 value={formData.service_type}
//                 onChange={handleChange("service_type")}
//                 disabled={isViewMode}
//                 error={!!errors.service_type}
//                 helperText={errors.service_type}
//               >
//                 <MenuItem value="free">Free</MenuItem>
//                 <MenuItem value="premium">Premium</MenuItem>
//               </TextField>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     type="number"
//                     label="Duration Value"
//                     fullWidth
//                     size="small"
//                     value={formData.duration_value}
//                     onChange={handleChange("duration_value")}
//                     disabled={isViewMode}
//                     error={!!errors.duration_value}
//                     helperText={errors.duration_value}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     select
//                     label="Duration Unit"
//                     fullWidth
//                     size="small"
//                     value={formData.duration_unit}
//                     onChange={handleChange("duration_unit")}
//                     disabled={isViewMode}
//                     error={!!errors.duration_unit}
//                     helperText={errors.duration_unit}
//                   >
//                     {["days", "months", "years"].map((unit) => (
//                       <MenuItem key={unit} value={unit}>
//                         {unit.charAt(0).toUpperCase() + unit.slice(1)}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//               </Grid>
//             </Grid>

//             <Grid item xs={12} mt={1}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Subscription Status
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 label="Status"
//                 fullWidth
//                 size="small"
//                 value={formData.status}
//                 onChange={handleChange("status")}
//                 disabled={isViewMode}
//               >
//                 <MenuItem value="Active">Active</MenuItem>
//                 <MenuItem value="Inactive">Inactive</MenuItem>
//               </TextField>
//             </Grid>

//             {!isViewMode && (
//               <Grid item xs={12} mt={2}>
//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     sx={{
//                       background:
//                         "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
//                       color: "#fff",
//                       borderRadius: "8px",
//                       padding: "8px 22px",
//                       fontWeight: 500,
//                       textTransform: "none",
//                       fontSize: "0.875rem",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                       transition: "all 0.2s ease",
//                       "&:hover": {
//                         background:
//                           "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
//                         boxShadow: "0 3px 8px rgba(27, 77, 62, 0.25)",
//                         transform: "translateY(-1px)",
//                       },
//                     }}
//                   >
//                     {mode === "new"
//                       ? "Create Subscription"
//                       : "Update Subscription"}
//                   </Button>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default NewSubscription;

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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";

interface SubscriptionFormData {
  plan_name: string;
  plan_price: number | "";
  services: string[];
  status: "Active" | "Inactive";
  service_type: "Free" | "Premium";
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
    service_type: "Free",
    duration_value: "",
    duration_unit: "months",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch all services
        const serviceResponse = await callAPI({
          endpoint: "/api/admin/services",
          method: "get",
        });

        console.log(serviceResponse, "serviceResponse");
        setServices(serviceResponse?.data);

        // If edit mode, fetch subscription details
        if (mode === "edit" && userId) {
          const subscriptionResponse = await callAPI({
            endpoint: `/api/admin/service-catalogs/${userId}`,
            method: "get",
          });
          const data = subscriptionResponse?.data;
          console.log(data, "data");
          setFormData({
            ...data,
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

  const handleChange =
    (field: keyof SubscriptionFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "plan_price" || field === "duration_value" ? +value : value,
      }));
      setErrors((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plan_name.trim()) {
      newErrors.plan_name = "Plan name is required.";
    }
    if (!formData.plan_price || formData.plan_price <= 0) {
      newErrors.plan_price = "Plan price must be greater than 0.";
    }
    if (!formData.services.length) {
      newErrors.services = "Services field is required.";
    }
    if (!formData.duration_value || formData.duration_value <= 0) {
      newErrors.duration_value = "Duration value must be greater than 0.";
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
      navigate(-1);
    } catch (error) {
      console.error("Error submitting subscription:", error);
    }
  };

  const isViewMode = mode === "view";

  return (
    <Box>
      {/* Header with back button - compact and aligned */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon sx={{ fontSize: 24, color: "#3f51b5" }} />
        </IconButton>
        <Typography variant="body1" fontWeight={600} color="#3f51b5">
          Back
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: "800px", // Constrain width for better alignment
          mx: "auto",
          backgroundColor: "#f9f9fb",
          borderRadius: "12px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* Form title - balanced size and styling */}
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          color="#1a237e"
          sx={{ letterSpacing: "0.3px", textAlign: "start" }}
        >
          {mode === "new"
            ? "Create Subscription"
            : mode === "edit"
            ? "Edit Subscription"
            : "View Subscription"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Plan Details */}
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
                label="Plan Name"
                fullWidth
                size="small"
                value={formData.plan_name}
                onChange={handleChange("plan_name")}
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
                type="number"
                label="Plan Price"
                fullWidth
                size="small"
                value={formData.plan_price}
                onChange={handleChange("plan_price")}
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
                  Services
                </InputLabel>
                <Select
                  multiple
                  value={formData.services}
                  onChange={handleChange("services")}
                  input={<OutlinedInput label="Services" />}
                  renderValue={(selected) =>
                    services
                      .filter((item) => selected.includes(item.id))
                      .map((item) => item.name)
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

            {/* Service Configuration */}
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
                  onChange={handleChange("service_type")}
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
                  <MenuItem value="Free">Free</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
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
                    label="Duration Value"
                    fullWidth
                    size="small"
                    value={formData.duration_value}
                    onChange={handleChange("duration_value")}
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
                      Duration Unit
                    </InputLabel>
                    <Select
                      value={formData.duration_unit}
                      onChange={handleChange("duration_unit")}
                      label="Duration Unit"
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

            {/* Subscription Status */}
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
              <FormControl
                fullWidth
                disabled={isViewMode}
                size="small"
              >
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
                  onChange={handleChange("status")}
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

            {/* Submit Button - Centered and styled */}
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
    </Box>
  );
};

export default NewSubscription;
