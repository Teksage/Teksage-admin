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
//   FormHelperText,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { callAPI } from "../../../api/crudFactory";
// import CustomSnackbar from "../../Elements/CustomSnackbar";

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
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: "success" | "error" | "info" | "warning";
//   }>({
//     open: false,
//     message: "",
//     severity: "success",
//   });

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
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     };

//   // For Select
//   const handleSelectChange =
//     (field: keyof ServiceFormData) => (event: SelectChangeEvent<string>) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: event.target.value,
//       }));
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     };

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
//       setSnackbar({
//         open: true,
//         message:
//           mode === "edit"
//             ? "Service updated successfully!"
//             : "Service created successfully!",
//         severity: "success",
//       });
//       navigate(-1);
//     } catch (error:any) {
//       console.error("Error submitting service:", error);
//       let errorMessage = "Something went wrong. Please try again.";
//       if (error.response && error.response.data) {
//         errorMessage =
//           error.response.data.detail ||
//           JSON.stringify(error.response.data?.detail);
//       }
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: "error",
//       });
//     }
//   };

//   const isViewMode = mode === "view";

//   return (
//     <Box>
//       {/* Header with back button */}
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
//           <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
//         </IconButton>
//         <Typography variant="body1" fontWeight={600} color="#06402B">
//           Back
//         </Typography>
//       </Box>

//       <Paper
//         elevation={2}
//         sx={{
//           p: { xs: 2, sm: 3 },
//           maxWidth: "800px", // Constrain width for better alignment
//           mx: "auto",
//           backgroundColor: "#fff",
//           borderRadius: "12px",
//           boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
//           border: "1px solid #e0e0e0",
//           position: "relative",
//           overflow: "hidden",
//           "&::before": {
//             content: '""',
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "4px",
//             background: "linear-gradient(90deg, #43a047 0%, #1b5e20 100%)",
//           }
//         }}
//       >
//         <Typography
//           variant="h5"
//           fontWeight={600}
//           mb={3}
//           sx={{
//             maxWidth: "50%",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace: "nowrap",
//             fontWeight: 600,
//             fontFamily: '"Poppins", sans-serif',
//             letterSpacing: 0.5,
//             textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
//             color: "#06402B",
//           }}
//         >
//           {mode === "new"
//             ? "Create New Service"
//             : mode === "edit"
//             ? "Edit Service"
//             : "View Service"}
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//               >
//                 Service Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Name *"
//                 variant="outlined"
//                 size="small"
//                 value={formData.name}
//                 onChange={handleTextChange("name")}
//                 disabled={isViewMode || mode === "edit"}
//                 error={Boolean(errors.name)}
//                 helperText={errors.name || ""}
//                 InputLabelProps={{
//                   sx: {
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   },
//                 }}
//                 InputProps={{
//                   sx: { fontSize: "0.9rem", borderRadius: "6px" },
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": { borderColor: "#cfd8dc" },
//                     "&:hover fieldset": { borderColor: "#3f51b5" },
//                     "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//                   },
//                   "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl
//                 fullWidth
//                 size="small"
//                 disabled={isViewMode}
//                 error={Boolean(errors.pushNotificationTrigger)}
//               >
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                 >
//                   Push Notification
//                 </InputLabel>
//                 <Select
//                   value={formData.pushNotificationTrigger}
//                   label="Push Notification"
//                   onChange={handleSelectChange("pushNotificationTrigger")}
//                   sx={{
//                     fontSize: "0.9rem",
//                     borderRadius: "6px",
//                     "& .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#cfd8dc",
//                     },
//                     "&:hover .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#3f51b5",
//                     },
//                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#3f51b5",
//                     },
//                   }}
//                 >
//                   {pushNotificationOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                   {errors.pushNotificationTrigger || ""}
//                 </FormHelperText>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} mt={1}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//               >
//                 Subscription Status
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth size="small" disabled={isViewMode}>
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                 >
//                   Status
//                 </InputLabel>
//                 <Select
//                   value={formData.status}
//                   label="Status"
//                   onChange={handleSelectChange("status")}
//                   sx={{
//                     fontSize: "0.9rem",
//                     borderRadius: "6px",
//                     "& .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#cfd8dc",
//                     },
//                     "&:hover .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#3f51b5",
//                     },
//                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#3f51b5",
//                     },
//                   }}
//                 >
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Inactive">Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {!isViewMode && (
//               <Grid item xs={12} mt={2}>
//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     sx={{
//                       background:
//                         "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
//                       color: "#fff",
//                       borderRadius: "8px",
//                       padding: "8px 24px",
//                       fontWeight: 600,
//                       fontSize: "0.95rem",
//                       textTransform: "none",
//                       boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background:
//                           "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
//                         boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
//                         transform: "scale(1.02)",
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

//       <CustomSnackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//       />
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
  IconButton,
  SelectChangeEvent,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";
import CustomSnackbar from "../../Elements/CustomSnackbar";
import { MiscellaneousServices } from '@mui/icons-material';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (mode === "edit" && userId) {
          setIsLoading(true);
          const couponResponse = await callAPI({
            endpoint: `/api/admin/services/${userId}`,
            method: "get",
          });
          const data = couponResponse?.data;
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [mode, userId]);

  const handleTextChange =
    (field: keyof ServiceFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

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
    setIsLoading(true);
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
    } catch (error: any) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const isViewMode = mode === "view";
  // const pageTitle =
  //   mode === "new"
  //     ? "Create New Service"
  //     : mode === "edit"
  //     ? "Edit Service"
  //     : "View Service";

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header with back button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            background: "rgba(6, 64, 43, 0.03)",
            borderRadius: "8px",
            p: 1,
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mr: 1,
              color: "#06402B",
              "&:hover": {
                background: "rgba(6, 64, 43, 0.1)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="body1"
            color="#06402B"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            style={{ fontFamily: "Urbanist", fontWeight: 800 }}
          >
            Back to Services
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Form Card */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #43a047 0%, #1b5e20 100%)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      color: "#2e7d32",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                    style={{ fontFamily: "Urbanist", fontWeight: 800 }}
                  >
                    <MiscellaneousServices sx={{ fontSize: 24 }} />{" "}
                    {/* Add the MiscellaneousServices icon */}
                    Service Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Service Name *"
                        placeholder="Enter service name"
                        variant="outlined"
                        size="medium"
                        value={formData.name}
                        onChange={handleTextChange("name")}
                        disabled={isViewMode || mode === "edit"}
                        error={Boolean(errors.name)}
                        helperText={errors.name || ""}
                        InputLabelProps={{
                          sx: {
                            fontWeight: 500,
                            color: "#455a64",
                            fontFamily: "Urbanist"
                          },
                        }}
                        InputProps={{
                          sx: { fontSize: "0.9rem", borderRadius: "6px", fontFamily: "Urbanist" },
                        }}
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontFamily: "Urbanist",
                            fontSize: "0.9rem",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#cfd8dc" },
                            "&:hover fieldset": { borderColor: "#3f51b5" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#06402B",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography
                        variant="subtitle1"
                        color="#546e7a"
                        sx={{ mt: 2, mb: 2 }}
                        style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                      >
                        Notification Settings
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        size="medium"
                        disabled={isViewMode}
                        error={Boolean(errors.pushNotificationTrigger)}
                      >
                        <InputLabel
                          sx={{
                            fontWeight: 500,
                            color: "#455a64",
                          }}
                        >
                          Push Notification
                        </InputLabel>
                        <Select
                          value={formData.pushNotificationTrigger}
                          label="Push Notification"
                          onChange={handleSelectChange(
                            "pushNotificationTrigger"
                          )}
                          sx={{
                            fontFamily: "Urbanist",
                            fontSize: "0.9rem",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#cfd8dc",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#3f51b5",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#06402B",
                            },
                          }}
                        >
                          {pushNotificationOptions.map((option) => (
                            <MenuItem key={option} value={option} style={{ fontFamily: "Urbanist" }}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.pushNotificationTrigger || ""}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography
                        variant="subtitle1"
                        color="#546e7a"
                        sx={{ mt: 2, mb: 2 }}
                        style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                      >
                        Service Status
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        size="medium"
                        disabled={isViewMode}
                      >
                        <InputLabel
                          sx={{
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
                            fontFamily: "Urbanist",
                            fontSize: "0.9rem",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#cfd8dc",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#3f51b5",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#06402B",
                            },
                          }}
                        >
                          <MenuItem value="Active" style={{ fontFamily: "Urbanist" }}>Active</MenuItem>
                          <MenuItem value="Inactive" style={{ fontFamily: "Urbanist" }}>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {!isViewMode && (
                      <Grid item xs={12} mt={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                            sx={{
                              mr: 2,
                              color: "#555",
                              borderColor: "#ccc",
                              borderRadius: "8px",
                              padding: "8px 24px",
                              fontFamily: 'Urbanist',
                              fontWeight: 800,
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "#999",
                                backgroundColor: "rgba(0,0,0,0.03)",
                              },
                            }}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                              background:
                                "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "8px 24px",
                              fontFamily: 'Urbanist',
                              fontWeight: 800,
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
                              "&:disabled": {
                                background:
                                  "linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)",
                                color: "#fff",
                              },
                            }}
                          >
                            {mode === "new"
                              ? "Create Service"
                              : "Update Service"}
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Info Panel */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fff",
                  height: "fit-content",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #43a047 0%, #1b5e20 100%)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      letterSpacing: 0.5,
                      color: "#06402B",
                      mb: 2,
                    }}
                    style={{fontFamily: 'Urbanist', fontWeight: 800}}
                  >
                    About Services
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph style={{fontFamily: 'Urbanist', fontWeight: 500}}>
                    Services are core offerings that your platform provides to
                    users. Each service can have push notifications enabled or
                    disabled.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    color="#06402B"
                    mb={1}
                    style={{fontFamily: 'Urbanist', fontWeight: 600}}
                  >
                    Important Notes:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 0, mb: 1 }}>
                    <Typography
                      component="li"
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                      style={{fontFamily: 'Urbanist', fontWeight: 500}}
                    >
                      Service names must be unique across the platform
                    </Typography>
                    <Typography
                      component="li"
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                      style={{fontFamily: 'Urbanist', fontWeight: 500}}
                    >
                      Push notifications can be toggled on or off for each
                      service
                    </Typography>
                    <Typography
                      component="li"
                      variant="body2"
                      color="text.secondary"
                      style={{fontFamily: 'Urbanist', fontWeight: 500}}
                    >
                      Inactive services won't be visible to users
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "rgba(6, 64, 43, 0.03)",
                  position: "relative",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      color: "#06402B",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#43a047",
                        mr: 1,
                      }}
                      style={{fontFamily: 'Urbanist', fontWeight: 800}}
                    />
                    Service Status Indicator
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          backgroundColor: "rgba(67, 160, 71, 0.1)",
                          color: "#2e7d32",
                          fontWeight: 800,
                          minWidth: "80px",
                          fontFamily: 'Urbanist'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" style={{fontFamily: 'Urbanist', fontWeight: 500}}>
                        Service is visible and available to users
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label="Inactive"
                        size="small"
                        sx={{
                          backgroundColor: "rgba(158, 158, 158, 0.1)",
                          color: "#757575",
                          fontWeight: 800,
                          minWidth: "80px",
                          fontFamily: 'Urbanist'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" style={{fontFamily: 'Urbanist', fontWeight: 500}}>
                        Service is hidden from users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

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
