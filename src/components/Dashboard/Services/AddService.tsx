// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Grid,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Typography,
//   Paper,
//   IconButton,
//   SelectChangeEvent,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { callAPI } from "../../../api/crudFactory";

// interface ServiceFormData {
//   name: string;
//   status: "Active" | "Inactive";
//   pushNotificationTrigger: string;
// }

// const pushNotificationOptions = ["Yes", "No"];

// const NewService: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams();

//   const [formData, setFormData] = useState<ServiceFormData>({
//     name: "",
//     status: "Active",
//     pushNotificationTrigger: "No",
//   });
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof ServiceFormData, string>>
//   >({});

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // If edit mode, fetch coupon details
//         if (mode === "edit" && userId) {
//           const couponResponse = await callAPI({
//             endpoint: `/api/admin/services/${userId}`,
//             method: "get",
//           });
//           const data = couponResponse?.data;
//           console.log(data, "data");
//           setFormData({
//             name: data?.name,
//             pushNotificationTrigger: data?.push_notification_status
//               ? "Yes"
//               : "No",
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

//   // For TextField
//   const handleTextChange =
//     (field: keyof ServiceFormData) =>
//     (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: event.target.value,
//       }));
//     };

//   // For Select
//   const handleSelectChange =
//   (field: keyof ServiceFormData) =>
//   (event: SelectChangeEvent<string>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: event.target.value,
//     }));
//   };

//   const validate = (): boolean => {
//     const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};
//     const requiredFields: (keyof ServiceFormData)[] = ["name"];

//     requiredFields.forEach((field) => {
//       if (!formData[field].trim()) newErrors[field] = "This field is required";
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!validate()) return;
//     try {
//       await callAPI({
//         endpoint:
//           mode === "edit"
//             ? `/api/admin/services/${userId}`
//             : "/api/admin/services",
//         method: mode === "edit" ? "put" : "post",
//         data: {
//           name: formData.name,
//           push_notification_status:
//             formData.pushNotificationTrigger === "Yes" ? true : false,
//           status: formData?.status === "Active" ? "active" : "inactive",
//         },
//       });
//       navigate(-1);
//     } catch (error) {
//       console.error("Error submitting subscription:", error);
//     }
//   };

//   const isViewMode = mode === "view";

//   return (
//     <Box sx={{ margin: "auto", pt: 2 }}>
//       {/* Header with back button - more compact and subtle */}
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
//           backgroundColor: "#fafafa",
//           borderRadius: "12px",
//         }}
//       >
//         <Typography variant="h6" fontWeight={500} mb={2}>
//           {mode === "new"
//             ? "Create New Service"
//             : mode === "edit"
//             ? "Edit Service"
//             : "View Service"}
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Service Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 variant="outlined"
//                 size="small"
//                 value={formData.name}
//                 onChange={handleTextChange("name")}
//                 disabled={isViewMode || mode === "edit"}
//                 // required
//                 error={Boolean(errors.name)}
//                 helperText={errors.name}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth size="small">
//                 <InputLabel>Push Notification</InputLabel>
//                 <Select
//                   value={formData.pushNotificationTrigger}
//                   label="Push Notification"
//                   onChange={handleSelectChange("pushNotificationTrigger")}
//                   disabled={isViewMode}
//                   // required
//                 >
//                   {pushNotificationOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
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
//                 onChange={handleTextChange("status")}
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
//                     {mode === "new" ? "Create Service" : "Update Service"}
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

// export default NewService;

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
  FormHelperText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";
import CustomSnackbar from "../../Elements/CustomSnackbar";

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
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

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
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  // For Select
  const handleSelectChange =
    (field: keyof ServiceFormData) => (event: SelectChangeEvent<string>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
      setSnackbar({
        open: true,
        message:
          mode === "edit"
            ? "Service updated successfully!"
            : "Service created successfully!",
        severity: "success",
      });
      navigate(-1);
    } catch (error) {
      console.error("Error submitting service:", error);
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
      {/* Header with back button */}
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
            color: "#06402B",
          }}
        >
          {mode === "new"
            ? "Create New Service"
            : mode === "edit"
            ? "Edit Service"
            : "View Service"}
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
                Service Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name *"
                variant="outlined"
                size="small"
                value={formData.name}
                onChange={handleTextChange("name")}
                disabled={isViewMode || mode === "edit"}
                error={Boolean(errors.name)}
                helperText={errors.name || ""}
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
              <FormControl
                fullWidth
                size="small"
                disabled={isViewMode}
                error={Boolean(errors.pushNotificationTrigger)}
              >
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                >
                  Push Notification
                </InputLabel>
                <Select
                  value={formData.pushNotificationTrigger}
                  label="Push Notification"
                  onChange={handleSelectChange("pushNotificationTrigger")}
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
                  {pushNotificationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ fontSize: "0.75rem" }}>
                  {errors.pushNotificationTrigger || ""}
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
                Subscription Status
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" disabled={isViewMode}>
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
                  label="Status"
                  onChange={handleSelectChange("status")}
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
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                    {mode === "new" ? "Create Service" : "Update Service"}
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

export default NewService;
