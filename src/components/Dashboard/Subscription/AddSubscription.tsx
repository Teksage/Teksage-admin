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
//   SelectChangeEvent,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { callAPI } from "../../../api/crudFactory";
// import CustomSnackbar from "../../Elements/CustomSnackbar";

// interface SubscriptionFormData {
//   plan_name: string;
//   local_plan_price: number | "";
//   services: string[];
//   status: "Active" | "Inactive";
//   service_type: "free" | "premium";
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
//     local_plan_price: "",
//     services: [],
//     status: "Active",
//     service_type: "free",
//     duration_value: "",
//     duration_unit: "months",
//   });
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: "success" | "error" | "info" | "warning";
//   }>({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const [errors, setErrors] = useState<
//     Partial<Record<keyof SubscriptionFormData, string>>
//   >({});
//   const [services, setServices] = useState([]);
//   // State to hold raw input string for local_plan_price
//   const [inputValues, setInputValues] = useState({
//     local_plan_price: "",
//   });

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const serviceResponse = await callAPI({
//           endpoint: "/api/admin/services",
//           method: "get",
//         });

//         console.log(serviceResponse, "serviceResponse");
//         setServices(serviceResponse?.data);

//         if (mode === "edit" && userId) {
//           const subscriptionResponse = await callAPI({
//             endpoint: `/api/admin/service-catalogs/${userId}`,
//             method: "get",
//           });
//           const data = subscriptionResponse?.data;
//           console.log(data, "data");
//           const price = data?.local_plan_price != null ? Number(data.local_plan_price) : "";
//           setFormData({
//             ...data,
//             status:
//               data?.status.charAt(0).toUpperCase() +
//               data?.status.slice(1).toLowerCase(),
//             local_plan_price: price,
//           });
//           // Set initial input value for local_plan_price
//           setInputValues({
//             local_plan_price: price === "" ? "" : String(price),
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchInitialData();
//   }, [mode, userId]);

//   const handleTextChange =
//     (field: keyof SubscriptionFormData) =>
//     (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       const value = event.target.value;
//       setFormData((prev) => ({
//         ...prev,
//         [field]:
//           field === "duration_value"
//             ? value === ""
//               ? ""
//               : Number(value) // Convert to number for duration_value
//             : value,
//       }));
//       setErrors((prev: any) => ({
//         ...prev,
//         [field]: "",
//       }));
//     };

//   const handleNumberChange =
//     (field: "local_plan_price") =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       let value = event.target.value;
//       console.log("Raw input for local_plan_price:", value);

//       // Allow empty input
//       if (value === "") {
//         setFormData((prev) => ({ ...prev, [field]: "" }));
//         setInputValues((prev) => ({ ...prev, [field]: "" }));
//         setErrors((prev: any) => ({ ...prev, [field]: "" }));
//         return;
//       }

//       // Remove any non-numeric characters except for a single decimal point
//       value = value.replace(/[^0-9.]/g, "");
//       const parts = value.split(".");
//       if (parts.length > 2) {
//         value = `${parts[0]}.${parts.slice(1).join("")}`; // Merge extra dots
//       }
//       if (parts[1] && parts[1].length > 2) {
//         value = `${parts[0]}.${parts[1].slice(0, 2)}`; // Limit to 2 decimal places
//       }

//       console.log("Cleaned input for local_plan_price:", value);

//       const numValue = Number(value);
//       if (isNaN(numValue)) {
//         console.log("Input is not a valid number, ignoring update");
//         return;
//       }

//       // Update formData with the numeric value
//       setFormData((prev) => ({ ...prev, [field]: numValue }));
//       // Store the raw input for display while typing
//       setInputValues((prev) => ({ ...prev, [field]: value }));
//       setErrors((prev: any) => ({ ...prev, [field]: "" }));
//     };

//   const handleNumberBlur =
//     (field: "local_plan_price") =>
//     (event: React.FocusEvent<HTMLInputElement>) => {
//       const value = event.target.value;
//       if (value === "") return;

//       const numValue = Number(value.replace(/[^0-9.]/g, ""));
//       if (isNaN(numValue)) return;

//       // Format the value for display after blur
//       const formattedValue = numValue.toLocaleString("en-US", {
//         minimumFractionDigits: value.includes(".") ? 2 : 0,
//         maximumFractionDigits: 2,
//       });

//       console.log("Formatted value on blur:", formattedValue);
//       setInputValues((prev) => ({ ...prev, [field]: formattedValue }));
//     };

//   const handleSelectChange =
//     <T extends string | string[]>(field: keyof SubscriptionFormData) =>
//     (e: SelectChangeEvent<T>) => {
//       const value = e.target.value as T;
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.plan_name.trim()) {
//       newErrors.plan_name = "Plan name is required.";
//     }
//     if (
//       formData.local_plan_price === "" ||
//       isNaN(formData.local_plan_price as number) ||
//       (formData.local_plan_price as number) <= 0
//     ) {
//       newErrors.local_plan_price =
//         "Plan price must be a valid number greater than 0.";
//     }
//     if (!formData.services.length) {
//       newErrors.services = "Services field is required.";
//     }
//     if (
//       formData.duration_value === "" ||
//       isNaN(formData.duration_value as number) ||
//       (formData.duration_value as number) <= 0
//     ) {
//       newErrors.duration_value =
//         "Duration value must be a valid number greater than 0.";
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
//       console.log("Submitting formData:", formData);
//       await callAPI({
//         endpoint:
//           mode === "edit"
//             ? `/api/admin/service-catalogs/${userId}`
//             : "/api/admin/service-catalogs",
//         method: mode === "edit" ? "put" : "post",
//         data: formData,
//       });

//       setSnackbar({
//         open: true,
//         message:
//           mode === "edit"
//             ? "Subscription updated successfully!"
//             : "Subscription created successfully!",
//         severity: "success",
//       });

//       navigate(-1);
//     } catch (error: any) {
//       console.error("Error submitting subscription:", error);
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
//           maxWidth: "800px",
//           mx: "auto",
//           backgroundColor: "#f9f9fb",
//           borderRadius: "12px",
//           boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
//           border: "1px solid #e0e0e0",
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
//           }}
//         >
//           {mode === "new"
//             ? "Create Subscription"
//             : mode === "edit"
//             ? "Edit Subscription"
//             : "View Subscription"}
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
//                 Plan Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Plan Name *"
//                 fullWidth
//                 size="small"
//                 value={formData.plan_name}
//                 onChange={handleTextChange("plan_name")}
//                 disabled={isViewMode}
//                 error={!!errors.plan_name}
//                 helperText={errors.plan_name || ""}
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
//               <TextField
//                 type="text"
//                 label="Plan Price *"
//                 fullWidth
//                 size="small"
//                 value={
//                   isViewMode
//                     ? formData.local_plan_price === ""
//                       ? ""
//                       : Number(formData.local_plan_price).toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                     : inputValues.local_plan_price
//                 }
//                 onChange={handleNumberChange("local_plan_price")}
//                 onBlur={handleNumberBlur("local_plan_price")}
//                 onKeyDown={(e) => {
//                   if (
//                     !/[0-9.]/.test(e.key) &&
//                     e.key !== "Backspace" &&
//                     e.key !== "Delete" &&
//                     e.key !== "ArrowLeft" &&
//                     e.key !== "ArrowRight" &&
//                     e.key !== "Tab"
//                   ) {
//                     e.preventDefault();
//                   }
//                 }}
//                 disabled={isViewMode}
//                 error={!!errors.local_plan_price}
//                 helperText={errors.local_plan_price || ""}
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

//             <Grid item xs={12}>
//               <FormControl
//                 fullWidth
//                 size="small"
//                 error={!!errors.services}
//                 disabled={isViewMode}
//               >
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                 >
//                   Services *
//                 </InputLabel>
//                 <Select<string[]>
//                   multiple
//                   value={formData.services}
//                   onChange={handleSelectChange("services")}
//                   input={<OutlinedInput label="Services *" />}
//                   renderValue={(selected) =>
//                     services
//                       .filter((item: any) => selected.includes(item.id))
//                       .map((item: any) => item.name)
//                       .join(", ")
//                   }
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
//                   {services.map((service: any) => (
//                     <MenuItem key={service.id} value={service.id}>
//                       <Checkbox
//                         checked={formData.services.includes(service.id)}
//                       />
//                       <ListItemText primary={service.name} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                   {errors.services || ""}
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
//                 Service Configuration
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl
//                 fullWidth
//                 disabled={isViewMode}
//                 size="small"
//                 error={!!errors.service_type}
//               >
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                 >
//                   Service Type
//                 </InputLabel>
//                 <Select
//                   value={formData.service_type}
//                   onChange={handleSelectChange("service_type")}
//                   label="Service Type"
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
//                   <MenuItem value="free">Free</MenuItem>
//                   <MenuItem value="premium">Premium</MenuItem>
//                 </Select>
//                 <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                   {errors.service_type || ""}
//                 </FormHelperText>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     type="number"
//                     label="Duration Value *"
//                     fullWidth
//                     size="small"
//                     value={formData.duration_value}
//                     onChange={handleTextChange("duration_value")}
//                     disabled={isViewMode}
//                     error={!!errors.duration_value}
//                     helperText={errors.duration_value || ""}
//                     InputLabelProps={{
//                       sx: {
//                         fontSize: "0.95rem",
//                         fontWeight: 500,
//                         color: "#455a64",
//                       },
//                     }}
//                     InputProps={{
//                       sx: { fontSize: "0.9rem", borderRadius: "6px" },
//                     }}
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         "& fieldset": { borderColor: "#cfd8dc" },
//                         "&:hover fieldset": { borderColor: "#3f51b5" },
//                         "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//                       },
//                       "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <FormControl
//                     fullWidth
//                     disabled={isViewMode}
//                     size="small"
//                     error={!!errors.duration_unit}
//                   >
//                     <InputLabel
//                       sx={{
//                         fontSize: "0.95rem",
//                         fontWeight: 500,
//                         color: "#455a64",
//                       }}
//                     >
//                       Duration Unit *
//                     </InputLabel>
//                     <Select
//                       value={formData.duration_unit}
//                       onChange={handleSelectChange("duration_unit")}
//                       label="Duration Unit *"
//                       sx={{
//                         fontSize: "0.9rem",
//                         borderRadius: "6px",
//                         "& .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#cfd8dc",
//                         },
//                         "&:hover .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#3f51b5",
//                         },
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                           borderColor: "#3f51b5",
//                         },
//                       }}
//                     >
//                       {["days", "months", "years"].map((unit) => (
//                         <MenuItem key={unit} value={unit}>
//                           {unit.charAt(0).toUpperCase() + unit.slice(1)}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                       {errors.duration_unit || ""}
//                     </FormHelperText>
//                   </FormControl>
//                 </Grid>
//               </Grid>
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
//               <FormControl fullWidth disabled={isViewMode} size="small">
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
//                   onChange={handleSelectChange("status")}
//                   label="Status"
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
//                 <Box sx={{ display: "flex", justifyContent: "end" }}>
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
//       <CustomSnackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//       />
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
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";
import CustomSnackbar from "../../Elements/CustomSnackbar";
import { Subscriptions } from "@mui/icons-material";
import { formatNumberWithCommas } from "../../Elements/CommonFunctions";

interface SubscriptionFormData {
  plan_name: string;
  local_plan_price: number | "";
  foreign_plan_price: number | ""; // Added foreign_plan_price
  plan_services: string[];
  status: "Active" | "Inactive";
  plan_type: "free" | "premium";
  tenure_value: number | "";
  tenure_count: "days" | "months" | "years";
}

const NewSubscription: React.FC<{ mode: "new" | "edit" | "view" }> = ({
  mode,
}) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    plan_name: "",
    local_plan_price: "",
    foreign_plan_price: "", // Added to state
    plan_services: [],
    status: "Active",
    plan_type: "free",
    tenure_value: "",
    tenure_count: "months",
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
  // State to hold raw input strings for price fields
  const [inputValues, setInputValues] = useState({
    local_plan_price: "",
    foreign_plan_price: "", // Added for foreign_plan_price
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const serviceResponse = await callAPI({
          endpoint: "/api/admin/services",
          method: "get",
        });

        // console.log(serviceResponse, "serviceResponse");
        setServices(serviceResponse?.data);

        if (mode === "edit" && userId) {
          setIsLoading(true);
          const subscriptionResponse = await callAPI({
            endpoint: `/api/admin/service-catalogs/${userId}`,
            method: "get",
          });
          const data = subscriptionResponse?.data;
          console.log(data, "data");
          const localPrice =
            data?.local_plan_price != null ? Number(data.local_plan_price) : "";
          const foreignPrice =
            data?.foreign_plan_price != null
              ? Number(data.foreign_plan_price)
              : ""; // Added for foreign_plan_price
          setFormData({
            ...data,
            status:
              data?.status.charAt(0).toUpperCase() +
              data?.status.slice(1).toLowerCase(),
            local_plan_price: localPrice,
            foreign_plan_price: foreignPrice, // Added for foreign_plan_price
          });
          // Set initial input values for price fields
          setInputValues({
            local_plan_price: localPrice === "" ? "" : String(localPrice),
            foreign_plan_price: foreignPrice === "" ? "" : String(foreignPrice), // Added for foreign_plan_price
          });
        }
      } catch (err:any) {
        console.error("Error fetching data:", err);
        setSnackbar({
          open: true,
          message: err.message || "Failed to load data. Please try again.",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
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
          field === "tenure_value"
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
    (field: "local_plan_price" | "foreign_plan_price") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      console.log(`Raw input for ${field}:`, value);

      // Allow empty input
      if (value === "") {
        setFormData((prev) => ({ ...prev, [field]: "" }));
        setInputValues((prev) => ({ ...prev, [field]: "" }));
        setErrors((prev: any) => ({ ...prev, [field]: "" }));
        return;
      }

      // Remove existing commas and allow only digits and one decimal point
      value = value.replace(/,/g, "");
      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = `${parts[0]}.${parts[1]}`; // Ensure only one decimal point
      }
      if (parts[1] && parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`; // Limit to 2 decimal places
      }

      console.log(`Cleaned input for ${field}:`, value);

      const numValue = Number(value);
      if (isNaN(numValue)) {
        console.log("Input is not a valid number, ignoring update");
        return;
      }

      // Update formData with the numeric value
      setFormData((prev) => ({ ...prev, [field]: numValue }));
      // Store the raw input for display while typing
      setInputValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    };

  const handleNumberBlur =
    (field: "local_plan_price" | "foreign_plan_price") =>
    (event: React.FocusEvent<HTMLInputElement>) => {
      console.log(event);
      const value = formData[field];
      if (value === "" || value == null) return;

      // Format the value for display after blur
      const formattedValue = formatNumberWithCommas(value);

      console.log(`Formatted value on blur for ${field}:`, formattedValue);
      setInputValues((prev) => ({ ...prev, [field]: formattedValue }));
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
      formData.local_plan_price === "" ||
      isNaN(formData.local_plan_price as number) ||
      (formData.local_plan_price as number) <= 0
    ) {
      newErrors.local_plan_price =
        "Enter a positive number like 100, 1000.23 or 1,000.23 (up to 2 decimal places).";
    }
    if (
      formData.foreign_plan_price === "" ||
      isNaN(formData.foreign_plan_price as number) ||
      (formData.foreign_plan_price as number) <= 0
    ) {
      newErrors.foreign_plan_price =
        "Enter a positive number like 100, 1000.23 or 1,000.23 (up to 2 decimal places).";
    }
    if (!formData.plan_services.length) {
      newErrors.plan_services = "Services field is required.";
    }
    // if (
    //   formData.tenure_value === "" ||
    //   isNaN(formData.tenure_value as number) ||
    //   (formData.tenure_value as number) < 0
    // ) {
    //   newErrors.tenure_value =
    //     "Duration value must be a valid number greater than 0.";
    // }
    if (
      formData.tenure_value === "" ||
      isNaN(formData.tenure_value as number) ||
      (formData.tenure_value as number) < 0 ||
      (formData.plan_type !== "free" && (formData.tenure_value as number) === 0)
    ) {
      newErrors.tenure_value =
        formData.plan_type === "free"
          ? "Duration value must be a valid number (0 or greater)."
          : "Duration value must be a valid number greater than 0.";
    }
    if (!formData.tenure_count) {
      newErrors.tenure_count = "Duration unit is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // console.log("Submitting formData:", {...formData, plan_type: formData.plan_type, status: formData.status.toLowerCase()});
      await callAPI({
        endpoint:
          mode === "edit"
            ? `/api/admin/service-catalogs/${userId}`
            : "/api/admin/service-catalogs",
        method: mode === "edit" ? "put" : "post",
        data: {...formData, plan_type: formData.plan_type, status: formData.status.toLowerCase()},
      });

      setSnackbar({
        open: true,
        message:
          mode === "edit"
            ? "Subscription updated successfully!"
            : "Subscription created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/subscription", { replace: true })
      }, 1000);
    } catch (err: any) {
      console.error("API Error:", err);
      setSnackbar({
        open: true,
        message: err.message || "Something went wrong. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isViewMode = mode === "view";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate("/dashboard/subscription", { replace: true })} sx={{ mr: 1 }}>
          <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
        </IconButton>
        <Typography
          variant="body1"
          fontWeight={600}
          color="#06402B"
          style={{ fontFamily: "Urbanist", fontWeight: 800 }}
        >
          Back
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: "800px", // Constrain width for better alignment
          mx: "auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
          border: "1px solid #e0e0e0",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #43a047 0%, #1b5e20 100%)",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: "#2e7d32",
            display: "flex", // Add flex to align icon and text
            alignItems: "center", // Center icon and text vertically
            gap: 1, // Space between icon and text
            maxWidth: "50%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: 0.5,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
          style={{ fontFamily: "Urbanist", fontWeight: 800 }}
        >
          <Subscriptions sx={{ fontSize: 24 }} />{" "}
          {/* Add the Subscriptions icon */}
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
                color="#546e7a"
                mb={1.5}
                style={{ fontFamily: "Urbanist", fontWeight: 600 }}
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
                    fontFamily: "Urbanist",
                  },
                }}
                InputProps={{
                  sx: {
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    fontFamily: "Urbanist",
                  },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#cfd8dc" },
                    "&:hover fieldset": { borderColor: "#3f51b5" },
                    "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6} /> Empty grid item for spacing */}

            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Local Plan Price (INR)*"
                fullWidth
                size="small"
                value={
                  isViewMode
                    ? formData.local_plan_price === ""
                      ? ""
                      : formatNumberWithCommas(formData.local_plan_price)
                    : inputValues.local_plan_price
                }
                onChange={handleNumberChange("local_plan_price")}
                onBlur={handleNumberBlur("local_plan_price")}
                disabled={isViewMode}
                error={!!errors.local_plan_price}
                helperText={errors.local_plan_price || ""}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                    fontFamily: "Urbanist",
                  },
                }}
                InputProps={{
                  sx: {
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    fontFamily: "Urbanist",
                  },
                  inputProps: {
                    pattern: "[0-9,.]*",
                    type: "text",
                  },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
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
                label="Foreign Plan Price (USD)*"
                fullWidth
                size="small"
                value={
                  isViewMode
                    ? formData.foreign_plan_price === ""
                      ? ""
                      : formatNumberWithCommas(formData.foreign_plan_price)
                    : inputValues.foreign_plan_price
                }
                onChange={handleNumberChange("foreign_plan_price")}
                onBlur={handleNumberBlur("foreign_plan_price")}
                disabled={isViewMode}
                error={!!errors.foreign_plan_price}
                helperText={errors.foreign_plan_price || ""}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                    fontFamily: "Urbanist",
                  },
                }}
                InputProps={{
                  sx: {
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    fontFamily: "Urbanist",
                  },
                  inputProps: {
                    pattern: "[0-9,.]*",
                    type: "text",
                  },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Urbanist",
                    fontSize: "0.9rem",
                  },
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
                error={!!errors.plan_services}
                disabled={isViewMode}
              >
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                  style={{ fontFamily: "Urbanist" }}
                >
                  Services *
                </InputLabel>
                <Select<string[]>
                  multiple
                  value={formData.plan_services}
                  onChange={handleSelectChange("plan_services")}
                  input={<OutlinedInput label="Services *" />}
                  renderValue={(selected) =>
                    services
                      .filter((item: any) => selected.includes(item.id))
                      .map((item: any) => item.name)
                      .join(", ")
                  }
                  sx={{
                    fontFamily: "Urbanist",
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
                    <MenuItem
                      key={service.id}
                      value={service.id}
                      style={{ fontFamily: "Urbanist" }}
                    >
                      <Checkbox
                        checked={formData.plan_services.includes(service.id)}
                      />
                      <ListItemText primary={service.name} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ fontSize: "0.75rem" }}>
                  {errors.plan_services || ""}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                color="#546e7a"
                mb={1.5}
                style={{ fontFamily: "Urbanist", fontWeight: 600 }}
              >
                Service Configuration
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                disabled={isViewMode}
                size="small"
                error={!!errors.plan_type}
              >
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  }}
                  style={{ fontFamily: "Urbanist" }}
                >
                  Service Type
                </InputLabel>
                <Select
                  value={formData.plan_type}
                  onChange={handleSelectChange("plan_type")}
                  label="Service Type"
                  sx={{
                    fontFamily: "Urbanist",
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
                  <MenuItem value="free" style={{ fontFamily: "Urbanist" }}>
                    Free
                  </MenuItem>
                  <MenuItem value="premium" style={{ fontFamily: "Urbanist" }}>
                    Premium
                  </MenuItem>
                </Select>
                <FormHelperText sx={{ fontSize: "0.75rem" }}>
                  {errors.plan_type || ""}
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
                    value={formData.tenure_value}
                    onChange={handleTextChange("tenure_value")}
                    disabled={isViewMode}
                    error={!!errors.tenure_value}
                    helperText={errors.tenure_value || ""}
                    InputLabelProps={{
                      sx: {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                        fontFamily: "Urbanist",
                      },
                    }}
                    InputProps={{
                      sx: {
                        fontSize: "0.9rem",
                        borderRadius: "6px",
                        fontFamily: "Urbanist",
                      },
                    }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        fontFamily: "Urbanist",
                        fontSize: "0.9rem",
                      },
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
                    error={!!errors.tenure_count}
                  >
                    <InputLabel
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                      }}
                      style={{ fontFamily: "Urbanist" }}
                    >
                      Duration Unit *
                    </InputLabel>
                    <Select
                      value={formData.tenure_count}
                      onChange={handleSelectChange("tenure_count")}
                      label="Duration Unit *"
                      sx={{
                        fontFamily: "Urbanist",
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
                        <MenuItem
                          key={unit}
                          value={unit}
                          style={{ fontFamily: "Urbanist" }}
                        >
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ fontSize: "0.75rem" }}>
                      {errors.tenure_count || ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                color="#546e7a"
                mb={1.5}
                style={{ fontFamily: "Urbanist", fontWeight: 600 }}
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
                  style={{ fontFamily: "Urbanist" }}
                >
                  Status
                </InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleSelectChange("status")}
                  label="Status"
                  sx={{
                    fontFamily: "Urbanist",
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
                  <MenuItem value="Active" style={{ fontFamily: "Urbanist" }}>
                    Active
                  </MenuItem>
                  <MenuItem value="Inactive" style={{ fontFamily: "Urbanist" }}>
                    Inactive
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {!isViewMode && (
              <Grid item xs={12} mt={2}>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "8px 24px",
                      fontFamily: "Urbanist",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        // background: "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
                        background:
                          "linear-gradient(135deg, #388E3C 0%, #004D40 100%)",
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
