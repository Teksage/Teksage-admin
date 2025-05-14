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
//   TextFieldProps,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers";
// import { callAPI } from "../../../api/crudFactory";

// interface CouponFormData {
//   coupon_name: string;
//   coupon_percentage: number | "";
//   local_max_cap: number | "";
//   start_date: Date | null;
//   end_date: Date | null;
//   plan_id: number | null;
// }

// // Define type for textField props to fix TypeScript error
// interface DatePickerTextFieldProps extends Omit<TextFieldProps, "variant"> {
//   size?: "small" | "medium";
// }

// const NewCoupon: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [formData, setFormData] = useState<CouponFormData>({
//     coupon_name: "",
//     coupon_percentage: "",
//     local_max_cap: "",
//     start_date: null,
//     end_date: null,
//     plan_id: null,
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [planData, setPlanData] = useState([]);
//   // State to hold raw input strings for typing
//   const [inputValues, setInputValues] = useState({
//     coupon_percentage: "",
//     local_max_cap: "",
//   });

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const serviceResponse = await callAPI({
//           endpoint: "/api/admin/service-catalogs",
//           method: "get",
//         });

//         const transformedPlans = serviceResponse?.data?.map((plan: any) => ({
//           id: plan?.plan_id,
//           name: `${plan.plan_name} (${plan.duration_value} ${plan.duration_unit})`,
//         }));

//         setPlanData(transformedPlans);

//         if (mode === "edit" && userId) {
//           const couponResponse = await callAPI({
//             endpoint: `/api/admin/coupons/${userId}`,
//             method: "get",
//           });
//           const data = couponResponse?.data;
//           const percentage =
//             data?.coupon_percentage != null
//               ? Number(data.coupon_percentage)
//               : "";
//           const maxCap = data?.local_max_cap != null ? Number(data.local_max_cap) : "";
//           setFormData({
//             coupon_name: data?.coupon_name || "",
//             coupon_percentage: percentage,
//             local_max_cap: maxCap,
//             start_date: data?.start_date ? new Date(data.start_date) : null,
//             end_date: data?.end_date ? new Date(data.end_date) : null,
//             plan_id: data?.plan_id || null,
//           });
//           // Set initial input values without commas
//           setInputValues({
//             coupon_percentage: percentage === "" ? "" : String(percentage),
//             local_max_cap: maxCap === "" ? "" : String(maxCap),
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchInitialData();
//   }, [mode, userId]);

//   const handleChange =
//     (field: keyof CouponFormData) =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const value = event.target.value;

//       setFormData((prev) => ({
//         ...prev,
//         [field]:
//           field === "plan_id"
//             ? value === ""
//               ? null
//               : Number(value)
//             : value,
//       }));

//       setErrors((prev: any) => ({
//         ...prev,
//         [field]: "",
//       }));
//     };

//   const handleNumberChange =
//     (field: "coupon_percentage" | "local_max_cap") =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       let value = event.target.value;
//       console.log(`Raw input for ${field}:`, value);

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

//       console.log(`Cleaned input for ${field}:`, value);

//       const numValue = Number(value);
//       if (isNaN(numValue)) {
//         console.log(`Input for ${field} is not a valid number, ignoring update`);
//         return;
//       }

//       // Update formData with the numeric value
//       setFormData((prev) => ({ ...prev, [field]: numValue }));
//       // Store the raw input for display while typing
//       setInputValues((prev) => ({ ...prev, [field]: value }));
//       setErrors((prev: any) => ({ ...prev, [field]: "" }));
//     };

//   const handleNumberBlur =
//     (field: "coupon_percentage" | "local_max_cap") =>
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

//       console.log(`Formatted value on blur for ${field}:`, formattedValue);
//       setInputValues((prev) => ({ ...prev, [field]: formattedValue }));
//     };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.coupon_name.trim())
//       newErrors.coupon_name = "Coupon name is required.";
//     if (
//       formData.coupon_percentage === "" ||
//       isNaN(formData.coupon_percentage as number) ||
//       formData.coupon_percentage < 0
//     )
//       newErrors.coupon_percentage = "Enter a valid percentage (0 or more).";
//     if (
//       formData.local_max_cap === "" ||
//       isNaN(formData.local_max_cap as number) ||
//       formData.local_max_cap < 0
//     )
//       newErrors.local_max_cap = "Enter a valid max cap (0 or more).";
//     if (!formData.start_date) newErrors.start_date = "Start date is required.";
//     if (!formData.end_date) newErrors.end_date = "End date is required.";
//     if (!formData.plan_id) newErrors.plan_id = "Plan name is required.";
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
//           mode === "edit" ? `/api/admin/coupons/${userId}` : "/api/admin/coupons",
//         method: mode === "edit" ? "put" : "post",
//         data: formData,
//       });
//       navigate(-1);
//     } catch (error) {
//       console.error("Error submitting coupon:", error);
//     }
//   };

//   const isViewMode = mode === "view";

//   // Define textField props for DatePickers with correct typing
//   const startDateTextFieldProps: DatePickerTextFieldProps = {
//     fullWidth: true,
//     size: "small",
//     error: !!errors.start_date,
//     helperText: errors.start_date || "",
//     InputLabelProps: {
//       sx: {
//         fontSize: "0.95rem",
//         fontWeight: 500,
//         color: "#455a64",
//       },
//     },
//     InputProps: {
//       sx: { fontSize: "0.9rem", borderRadius: "6px" },
//     },
//     sx: {
//       "& .MuiOutlinedInput-root": {
//         "& fieldset": { borderColor: "#cfd8dc" },
//         "&:hover fieldset": { borderColor: "#3f51b5" },
//         "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//       },
//       "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//     },
//   };

//   const endDateTextFieldProps: DatePickerTextFieldProps = {
//     fullWidth: true,
//     size: "small",
//     error: !!errors.end_date,
//     helperText: errors.end_date || "",
//     InputLabelProps: {
//       sx: {
//         fontSize: "0.95rem",
//         fontWeight: 500,
//         color: "#455a64",
//       },
//     },
//     InputProps: {
//       sx: { fontSize: "0.9rem", borderRadius: "6px" },
//     },
//     sx: {
//       "& .MuiOutlinedInput-root": {
//         "& fieldset": { borderColor: "#cfd8dc" },
//         "&:hover fieldset": { borderColor: "#3f51b5" },
//         "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//       },
//       "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//     },
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
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
//           }}
//         >
//           {mode === "new"
//             ? "Create Coupon"
//             : mode === "edit"
//             ? "Edit Coupon"
//             : "View Coupon"}
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
//                 Coupon Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Coupon Name *"
//                 fullWidth
//                 size="small"
//                 value={formData.coupon_name}
//                 onChange={handleChange("coupon_name")}
//                 disabled={isViewMode}
//                 error={!!errors.coupon_name}
//                 helperText={errors.coupon_name || ""}
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

//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 type="text"
//                 label="Coupon % *"
//                 fullWidth
//                 size="small"
//                 value={
//                   isViewMode
//                     ? formData.coupon_percentage === ""
//                       ? ""
//                       : Number(formData.coupon_percentage).toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                     : inputValues.coupon_percentage
//                 }
//                 onChange={handleNumberChange("coupon_percentage")}
//                 onBlur={handleNumberBlur("coupon_percentage")}
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
//                 error={!!errors.coupon_percentage}
//                 helperText={errors.coupon_percentage || ""}
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

//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 type="text"
//                 label="Max Cap *"
//                 fullWidth
//                 size="small"
//                 value={
//                   isViewMode
//                     ? formData.local_max_cap === ""
//                       ? ""
//                       : Number(formData.local_max_cap).toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                     : inputValues.local_max_cap
//                 }
//                 onChange={handleNumberChange("local_max_cap")}
//                 onBlur={handleNumberBlur("local_max_cap")}
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
//                 error={!!errors.local_max_cap}
//                 helperText={errors.local_max_cap || ""}
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

//             <Grid item xs={12} mt={1}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//               >
//                 Validity Period
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <DatePicker
//                 label="Start Date *"
//                 value={formData.start_date}
//                 onChange={(newValue) => {
//                   setFormData((prev) => ({ ...prev, start_date: newValue }));
//                   setErrors((prev) => ({ ...prev, start_date: "" }));
//                 }}
//                 disabled={isViewMode}
//                 slotProps={{ textField: startDateTextFieldProps }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <DatePicker
//                 label="End Date *"
//                 value={formData.end_date}
//                 onChange={(newValue) => {
//                   setFormData((prev) => ({ ...prev, end_date: newValue }));
//                   setErrors((prev) => ({ ...prev, end_date: "" }));
//                 }}
//                 disabled={isViewMode}
//                 slotProps={{ textField: endDateTextFieldProps }}
//               />
//             </Grid>

//             <Grid item xs={12} mt={1}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//               >
//                 Applicable Plan
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 label="Plan Name *"
//                 fullWidth
//                 size="small"
//                 value={formData.plan_id ?? ""}
//                 onChange={handleChange("plan_id")}
//                 disabled={isViewMode}
//                 error={!!errors.plan_id}
//                 helperText={errors.plan_id || ""}
//                 InputLabelProps={{
//                   sx: {
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   },
//                 }}
//                 SelectProps={{
//                   sx: {
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
//                   },
//                 }}
//                 sx={{
//                   "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//                 }}
//               >
//                 {planData.map((plan: any) => (
//                   <MenuItem key={plan.id} value={plan.id}>
//                     {plan.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
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
//                     {mode === "new" ? "Create Coupon" : "Update Coupon"}
//                   </Button>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>
//         </Box>
//       </Paper>
//     </LocalizationProvider>
//   );
// };

// export default NewCoupon;

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
//   Card,
//   CardContent,
//   Divider,
//   InputAdornment,
//   Chip,
//   Stack,
//   TextFieldProps,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers";
// import {
//   Percent as PercentIcon,
//   Calendar as CalendarIcon,
//   Tag as TagIcon,
//   Package as PackageIcon,
//   DollarSign as CurrencyIcon,
//   Info as InfoIcon,
// } from "lucide-react";
// import { callAPI } from "../../../api/crudFactory";

// interface CouponFormData {
//   coupon_name: string;
//   coupon_percentage: number | "";
//   local_max_cap: number | "";
//   start_date: Date | null;
//   end_date: Date | null;
//   plan_id: number | null;
// }

// // Define type for textField props to fix TypeScript error
// interface DatePickerTextFieldProps extends Omit<TextFieldProps, "variant"> {
//   size?: "small" | "medium";
// }

// const NewCoupon = ({ mode = "new" }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [formData, setFormData] = useState<CouponFormData>({
//     coupon_name: "",
//     coupon_percentage: "",
//     local_max_cap: "",
//     start_date: null,
//     end_date: null,
//     plan_id: null,
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [planData, setPlanData] = useState([]);
//   // State to hold raw input strings for typing
//   const [inputValues, setInputValues] = useState({
//     coupon_percentage: "",
//     local_max_cap: "",
//   });

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const serviceResponse = await callAPI({
//           endpoint: "/api/admin/service-catalogs",
//           method: "get",
//         });

//         const transformedPlans = serviceResponse?.data?.map((plan: any) => ({
//           id: plan?.plan_id,
//           name: `${plan.plan_name} (${plan.duration_value} ${plan.duration_unit})`,
//         }));

//         setPlanData(transformedPlans);

//         if (mode === "edit" && userId) {
//           const couponResponse = await callAPI({
//             endpoint: `/api/admin/coupons/${userId}`,
//             method: "get",
//           });
//           const data = couponResponse?.data;
//           const percentage =
//             data?.coupon_percentage != null
//               ? Number(data.coupon_percentage)
//               : "";
//           const maxCap =
//             data?.local_max_cap != null ? Number(data.local_max_cap) : "";
//           setFormData({
//             coupon_name: data?.coupon_name || "",
//             coupon_percentage: percentage,
//             local_max_cap: maxCap,
//             start_date: data?.start_date ? new Date(data.start_date) : null,
//             end_date: data?.end_date ? new Date(data.end_date) : null,
//             plan_id: data?.plan_id || null,
//           });
//           // Set initial input values without commas
//           setInputValues({
//             coupon_percentage: percentage === "" ? "" : String(percentage),
//             local_max_cap: maxCap === "" ? "" : String(maxCap),
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchInitialData();
//   }, [mode, userId]);

//   const handleChange =
//     (field: keyof CouponFormData) =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const value = event.target.value;

//       setFormData((prev) => ({
//         ...prev,
//         [field]:
//           field === "plan_id" ? (value === "" ? null : Number(value)) : value,
//       }));

//       setErrors((prev: any) => ({
//         ...prev,
//         [field]: "",
//       }));
//     };

//   const handleNumberChange =
//     (field: "coupon_percentage" | "local_max_cap") =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       let value = event.target.value;
//       console.log(`Raw input for ${field}:`, value);

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

//       console.log(`Cleaned input for ${field}:`, value);

//       const numValue = Number(value);
//       if (isNaN(numValue)) {
//         console.log(
//           `Input for ${field} is not a valid number, ignoring update`
//         );
//         return;
//       }

//       // Update formData with the numeric value
//       setFormData((prev) => ({ ...prev, [field]: numValue }));
//       // Store the raw input for display while typing
//       setInputValues((prev) => ({ ...prev, [field]: value }));
//       setErrors((prev: any) => ({ ...prev, [field]: "" }));
//     };

//   const handleNumberBlur =
//     (field: "coupon_percentage" | "local_max_cap") =>
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

//       console.log(`Formatted value on blur for ${field}:`, formattedValue);
//       setInputValues((prev) => ({ ...prev, [field]: formattedValue }));
//     };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.coupon_name.trim())
//       newErrors.coupon_name = "Coupon name is required.";
//     if (
//       formData.coupon_percentage === "" ||
//       isNaN(formData.coupon_percentage as number) ||
//       formData.coupon_percentage < 0
//     )
//       newErrors.coupon_percentage = "Enter a valid percentage (0 or more).";
//     if (
//       formData.local_max_cap === "" ||
//       isNaN(formData.local_max_cap as number) ||
//       formData.local_max_cap < 0
//     )
//       newErrors.local_max_cap = "Enter a valid max cap (0 or more).";
//     if (!formData.start_date) newErrors.start_date = "Start date is required.";
//     if (!formData.end_date) newErrors.end_date = "End date is required.";
//     if (!formData.plan_id) newErrors.plan_id = "Plan name is required.";
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
//             ? `/api/admin/coupons/${userId}`
//             : "/api/admin/coupons",
//         method: mode === "edit" ? "put" : "post",
//         data: formData,
//       });
//       navigate(-1);
//     } catch (error) {
//       console.error("Error submitting coupon:", error);
//     }
//   };

//   const isViewMode = mode === "view";

//   // Define textField props for DatePickers with correct typing
//   const startDateTextFieldProps: DatePickerTextFieldProps = {
//     fullWidth: true,
//     size: "small",
//     error: !!errors.start_date,
//     helperText: errors.start_date || "",
//     InputLabelProps: {
//       sx: {
//         fontSize: "0.95rem",
//         fontWeight: 500,
//         color: "#455a64",
//       },
//     },
//     InputProps: {
//       sx: { fontSize: "0.9rem", borderRadius: "6px" },
//     },
//     sx: {
//       "& .MuiOutlinedInput-root": {
//         "& fieldset": { borderColor: "#cfd8dc" },
//         "&:hover fieldset": { borderColor: "#3f51b5" },
//         "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//       },
//       "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//     },
//   };

//   const endDateTextFieldProps: DatePickerTextFieldProps = {
//     fullWidth: true,
//     size: "small",
//     error: !!errors.end_date,
//     helperText: errors.end_date || "",
//     InputLabelProps: {
//       sx: {
//         fontSize: "0.95rem",
//         fontWeight: 500,
//         color: "#455a64",
//       },
//     },
//     InputProps: {
//       sx: { fontSize: "0.9rem", borderRadius: "6px" },
//     },
//     sx: {
//       "& .MuiOutlinedInput-root": {
//         "& fieldset": { borderColor: "#cfd8dc" },
//         "&:hover fieldset": { borderColor: "#3f51b5" },
//         "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//       },
//       "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//     },
//   };

//   // Enhanced text field styling
//   const textFieldStyling = {
//     "& .MuiOutlinedInput-root": {
//       "& fieldset": { borderColor: "#cfd8dc" },
//       "&:hover fieldset": { borderColor: "#3f51b5" },
//       "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//       borderRadius: "8px",
//     },
//     "& .MuiInputLabel-root": {
//       fontSize: "0.95rem",
//       fontWeight: 500,
//       color: "#455a64",
//     },
//     "& .MuiInputBase-input": {
//       fontSize: "0.95rem",
//     },
//     "& .MuiFormHelperText-root": {
//       fontSize: "0.75rem",
//       marginTop: "3px",
//     },
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box
//         sx={{
//           maxWidth: "1200px",
//           mx: "auto",
//           px: { xs: 2, sm: 3 },
//           py: 2,
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             mb: 3,
//             background: "rgba(6, 64, 43, 0.03)",
//             borderRadius: "8px",
//             p: 1,
//           }}
//         >
//           <IconButton
//             onClick={() => navigate(-1)}
//             sx={{
//               mr: 1,
//               color: "#06402B",
//               "&:hover": {
//                 background: "rgba(6, 64, 43, 0.1)",
//               },
//             }}
//           >
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography
//             variant="body1"
//             fontWeight={600}
//             color="#06402B"
//             sx={{
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             Back to Coupons
//           </Typography>
//         </Box>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             {/* Left side - Main form */}
//             <Grid item xs={12} md={8}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: { xs: 2, sm: 3 },
//                   borderRadius: "12px",
//                   backgroundColor: "#fff",
//                   boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
//                   border: "1px solid #e0e0e0",
//                   position: "relative",
//                   overflow: "hidden",
//                   "&::before": {
//                     content: '""',
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "5px",
//                     background:
//                       "linear-gradient(90deg, #43a047 0%, #1b5e20 100%)",
//                   },
//                 }}
//               >
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     mb: 3,
//                     fontWeight: 600,
//                     color: "#2e7d32",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                   }}
//                 >
//                   <TagIcon size={24} />
//                   {mode === "new"
//                     ? "Create Coupon"
//                     : mode === "edit"
//                     ? "Edit Coupon"
//                     : "View Coupon"}
//                 </Typography>

//                 <Grid container spacing={3}>
//                   <Grid item xs={12}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{
//                         fontWeight: 600,
//                         color: "#455a64",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         mb: 2,
//                       }}
//                     >
//                       <InfoIcon size={18} />
//                       Coupon Details
//                     </Typography>
//                     <Divider sx={{ mb: 2 }} />
//                   </Grid>

//                   <Grid item xs={12}>
//                     <TextField
//                       label="Coupon Name *"
//                       fullWidth
//                       size="medium"
//                       value={formData.coupon_name}
//                       onChange={handleChange("coupon_name")}
//                       disabled={isViewMode}
//                       error={!!errors.coupon_name}
//                       helperText={errors.coupon_name || ""}
//                       sx={textFieldStyling}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <TagIcon size={20} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       type="text"
//                       label="Coupon Percentage *"
//                       fullWidth
//                       size="medium"
//                       value={inputValues.coupon_percentage}
//                       onChange={handleNumberChange("coupon_percentage")}
//                       onBlur={handleNumberBlur("coupon_percentage")}
//                       disabled={isViewMode}
//                       error={!!errors.coupon_percentage}
//                       helperText={errors.coupon_percentage || ""}
//                       sx={textFieldStyling}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <PercentIcon size={20} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       type="text"
//                       label="Maximum Cap *"
//                       fullWidth
//                       size="medium"
//                       value={inputValues.local_max_cap}
//                       onChange={handleNumberChange("local_max_cap")}
//                       onBlur={handleNumberBlur("local_max_cap")}
//                       disabled={isViewMode}
//                       error={!!errors.local_max_cap}
//                       helperText={errors.local_max_cap || ""}
//                       sx={textFieldStyling}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <CurrencyIcon size={20} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} mt={1}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{
//                         fontWeight: 600,
//                         color: "#455a64",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         mb: 2,
//                       }}
//                     >
//                       <CalendarIcon size={18} />
//                       Validity Period
//                     </Typography>
//                     <Divider sx={{ mb: 2 }} />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <DatePicker
//                       label="Start Date *"
//                       value={formData.start_date}
//                       onChange={(newValue) => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           start_date: newValue,
//                         }));
//                         setErrors((prev) => ({ ...prev, start_date: "" }));
//                       }}
//                       disabled={isViewMode}
//                       // slotProps={{
//                       //   textField: {
//                       //     fullWidth: true,
//                       //     size: "medium",
//                       //     error: !!errors.start_date,
//                       //     helperText: errors.start_date || "",
//                       //     sx: textFieldStyling,
//                       //   },
//                       // }}
//                       slotProps={{ textField: startDateTextFieldProps }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <DatePicker
//                       label="End Date *"
//                       value={formData.end_date}
//                       onChange={(newValue) => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           end_date: newValue,
//                         }));
//                         setErrors((prev) => ({ ...prev, end_date: "" }));
//                       }}
//                       disabled={isViewMode}
//                       // slotProps={{
//                       //   textField: {
//                       //     fullWidth: true,
//                       //     size: "medium",
//                       //     error: !!errors.end_date,
//                       //     helperText: errors.end_date || "",
//                       //     sx: textFieldStyling,
//                       //   },
//                       // }}
//                       slotProps={{ textField: endDateTextFieldProps }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} mt={1}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{
//                         fontWeight: 600,
//                         color: "#455a64",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         mb: 2,
//                       }}
//                     >
//                       <PackageIcon size={18} />
//                       Applicable Plan
//                     </Typography>
//                     <Divider sx={{ mb: 2 }} />
//                   </Grid>

//                   <Grid item xs={12}>
//                     <TextField
//                       select
//                       label="Plan Name *"
//                       fullWidth
//                       size="medium"
//                       value={formData.plan_id ?? ""}
//                       onChange={handleChange("plan_id")}
//                       disabled={isViewMode}
//                       error={!!errors.plan_id}
//                       helperText={errors.plan_id || ""}
//                       sx={textFieldStyling}
//                     >
//                       {planData.map((plan) => (
//                         <MenuItem key={plan.id} value={plan.id}>
//                           {plan.name}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>

//             {/* Right side - Info cards */}
//             <Grid item xs={12} md={4}>
//               <Stack spacing={3}>
//                 <Card
//                   elevation={0}
//                   sx={{
//                     borderRadius: "12px",
//                     backgroundColor: "#f1f8e9",
//                     border: "1px solid #c5e1a5",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                   }}
//                 >
//                   <CardContent>
//                     <Typography
//                       variant="h6"
//                       fontWeight={600}
//                       color="#33691e"
//                       mb={2}
//                     >
//                       Coupon Overview
//                     </Typography>
//                     <Typography variant="body2" color="#444" mb={2}>
//                       Create promotional coupons to attract new customers and
//                       reward existing ones. Coupons can be applied to specific
//                       plans during checkout.
//                     </Typography>
//                     <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
//                       <Chip
//                         label="Discount"
//                         size="small"
//                         color="success"
//                         sx={{ fontWeight: 500 }}
//                       />
//                       <Chip
//                         label="Promotion"
//                         size="small"
//                         color="success"
//                         sx={{ fontWeight: 500 }}
//                       />
//                       <Chip
//                         label="Marketing"
//                         size="small"
//                         color="success"
//                         sx={{ fontWeight: 500 }}
//                       />
//                     </Stack>
//                   </CardContent>
//                 </Card>

//                 <Card
//                   elevation={0}
//                   sx={{
//                     borderRadius: "12px",
//                     backgroundColor: "#fff",
//                     border: "1px solid #e0e0e0",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                   }}
//                 >
//                   <CardContent>
//                     <Typography
//                       variant="h6"
//                       fontWeight={600}
//                       color="#33691e"
//                       mb={2}
//                     >
//                       Coupon Tips
//                     </Typography>
//                     <Box component="ul" sx={{ pl: 2, mt: 0 }}>
//                       <Typography component="li" variant="body2" mb={1}>
//                         Set a reasonable discount percentage (5-30%).
//                       </Typography>
//                       <Typography component="li" variant="body2" mb={1}>
//                         Always set a maximum cap amount to avoid excessive
//                         discounts.
//                       </Typography>
//                       <Typography component="li" variant="body2" mb={1}>
//                         Choose validity periods that align with marketing
//                         campaigns.
//                       </Typography>
//                       <Typography component="li" variant="body2">
//                         Target specific plans for better conversion rates.
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>

//                 {!isViewMode && (
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     sx={{
//                       background:
//                         "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
//                       color: "#fff",
//                       borderRadius: "8px",
//                       padding: "12px 24px",
//                       fontWeight: 600,
//                       fontSize: "1rem",
//                       textTransform: "none",
//                       boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background:
//                           "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
//                         boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
//                         transform: "translateY(-2px)",
//                       },
//                     }}
//                   >
//                     {mode === "new" ? "Create Coupon" : "Update Coupon"}
//                   </Button>
//                 )}
//               </Stack>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default NewCoupon;

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
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Chip,
  Stack,
  TextFieldProps
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Percent as PercentIcon,
  Calendar as CalendarIcon,
  Tag as TagIcon,
  Package as PackageIcon,
  DollarSign as CurrencyIcon,
  Info as InfoIcon,
} from "lucide-react";
import { callAPI } from "../../../api/crudFactory";

interface CouponFormData {
  coupon_name: string;
  coupon_percentage: number | "";
  local_max_cap: number | "";
  foreign_max_cap: number | "";
  start_date: Date | null;
  end_date: Date | null;
  plan_id: number | null;
}

interface DatePickerTextFieldProps extends Omit<TextFieldProps, "variant"> {
  size?: "small" | "medium";
}

const NewCoupon = ({ mode = "new" }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<CouponFormData>({
    coupon_name: "",
    coupon_percentage: "",
    local_max_cap: "",
    foreign_max_cap: "",
    start_date: null,
    end_date: null,
    plan_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [planData, setPlanData] = useState([]);
  const [inputValues, setInputValues] = useState({
    coupon_percentage: "",
    local_max_cap: "",
    foreign_max_cap: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const serviceResponse = await callAPI({
          endpoint: "/api/admin/service-catalogs",
          method: "get",
        });

        const transformedPlans = serviceResponse?.data?.map((plan: any) => ({
          id: plan?.plan_id,
          name: `${plan.plan_name} (${plan.duration_value} ${plan.duration_unit})`,
        }));

        setPlanData(transformedPlans);

        if (mode === "edit" && userId) {
          const couponResponse = await callAPI({
            endpoint: `/api/admin/coupons/${userId}`,
            method: "get",
          });
          const data = couponResponse?.data;
          const percentage =
            data?.coupon_percentage != null
              ? Number(data.coupon_percentage)
              : "";
          const localMaxCap =
            data?.local_max_cap != null ? Number(data.local_max_cap) : "";
          const foreignMaxCap =
            data?.foreign_max_cap != null ? Number(data.foreign_max_cap) : "";
          setFormData({
            coupon_name: data?.coupon_name || "",
            coupon_percentage: percentage,
            local_max_cap: localMaxCap,
            foreign_max_cap: foreignMaxCap,
            start_date: data?.start_date ? new Date(data.start_date) : null,
            end_date: data?.end_date ? new Date(data.end_date) : null,
            plan_id: data?.plan_id || null,
          });
          setInputValues({
            coupon_percentage: percentage === "" ? "" : String(percentage),
            local_max_cap: localMaxCap === "" ? "" : String(localMaxCap),
            foreign_max_cap: foreignMaxCap === "" ? "" : String(foreignMaxCap),
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchInitialData();
  }, [mode, userId]);

  const handleChange =
    (field: keyof CouponFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "plan_id" ? (value === "" ? null : Number(value)) : value,
      }));

      setErrors((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    };

  const handleNumberChange =
    (field: "coupon_percentage" | "local_max_cap" | "foreign_max_cap") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;
      console.log(`Raw input for ${field}:`, value);

      if (value === "") {
        setFormData((prev) => ({ ...prev, [field]: "" }));
        setInputValues((prev) => ({ ...prev, [field]: "" }));
        setErrors((prev: any) => ({ ...prev, [field]: "" }));
        return;
      }

      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = `${parts[0]}.${parts.slice(1).join("")}`;
      }
      if (parts[1] && parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }

      console.log(`Cleaned input for ${field}:`, value);

      const numValue = Number(value);
      if (isNaN(numValue)) {
        console.log(
          `Input for ${field} is not a valid number, ignoring update`
        );
        return;
      }

      setFormData((prev) => ({ ...prev, [field]: numValue }));
      setInputValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    };

  const handleNumberBlur =
    (field: "coupon_percentage" | "local_max_cap" | "foreign_max_cap") =>
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === "") return;

      const numValue = Number(value.replace(/[^0-9.]/g, ""));
      if (isNaN(numValue)) return;

      const formattedValue = numValue.toLocaleString("en-US", {
        minimumFractionDigits: value.includes(".") ? 2 : 0,
        maximumFractionDigits: 2,
      });

      console.log(`Formatted value on blur for ${field}:`, formattedValue);
      setInputValues((prev) => ({ ...prev, [field]: formattedValue }));
    };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.coupon_name.trim())
      newErrors.coupon_name = "Coupon name is required.";
    if (
      formData.coupon_percentage === "" ||
      isNaN(formData.coupon_percentage as number) ||
      formData.coupon_percentage < 0
    )
      newErrors.coupon_percentage = "Enter a valid percentage (0 or more).";
    if (
      formData.local_max_cap === "" ||
      isNaN(formData.local_max_cap as number) ||
      formData.local_max_cap < 0
    )
      newErrors.local_max_cap = "Enter a valid local max cap (0 or more).";
    if (
      formData.foreign_max_cap === "" ||
      isNaN(formData.foreign_max_cap as number) ||
      formData.foreign_max_cap < 0
    )
      newErrors.foreign_max_cap = "Enter a valid foreign max cap (0 or more).";
    if (!formData.start_date) newErrors.start_date = "Start date is required.";
    if (!formData.end_date) newErrors.end_date = "End date is required.";
    if (!formData.plan_id) newErrors.plan_id = "Plan name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      console.log("Submitting formData:", formData);
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

  const startDateTextFieldProps: DatePickerTextFieldProps = {
    fullWidth: true,
    size: "small",
    error: !!errors.start_date,
    helperText: errors.start_date || "",
    InputLabelProps: {
      sx: {
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "#455a64",
      },
    },
    InputProps: {
      sx: { fontSize: "0.9rem", borderRadius: "6px" },
    },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#cfd8dc" },
        "&:hover fieldset": { borderColor: "#3f51b5" },
        "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
      },
      "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
    },
  };

  const endDateTextFieldProps: DatePickerTextFieldProps = {
    fullWidth: true,
    size: "small",
    error: !!errors.end_date,
    helperText: errors.end_date || "",
    InputLabelProps: {
      sx: {
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "#455a64",
      },
    },
    InputProps: {
      sx: { fontSize: "0.9rem", borderRadius: "6px" },
    },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#cfd8dc" },
        "&:hover fieldset": { borderColor: "#3f51b5" },
        "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
      },
      "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
    },
  };

  const textFieldStyling = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#cfd8dc" },
      "&:hover fieldset": { borderColor: "#3f51b5" },
      "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
      borderRadius: "8px",
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.95rem",
      fontWeight: 500,
      color: "#455a64",
    },
    "& .MuiInputBase-input": {
      fontSize: "0.95rem",
    },
    "& .MuiFormHelperText-root": {
      fontSize: "0.75rem",
      marginTop: "3px",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
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
            fontWeight={600}
            color="#06402B"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            Back to Coupons
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  border: "1px solid #e0e0e0",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "5px",
                    background:
                      "linear-gradient(90deg, #43a047 0%, #1b5e20 100%)",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#2e7d32",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <TagIcon size={24} />
                  {mode === "new"
                    ? "Create Coupon"
                    : mode === "edit"
                    ? "Edit Coupon"
                    : "View Coupon"}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#455a64",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <InfoIcon size={18} />
                      Coupon Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Coupon Name *"
                      fullWidth
                      size="medium"
                      value={formData.coupon_name}
                      onChange={handleChange("coupon_name")}
                      disabled={isViewMode}
                      error={!!errors.coupon_name}
                      helperText={errors.coupon_name || ""}
                      sx={textFieldStyling}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TagIcon size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="text"
                      label="Coupon Percentage *"
                      fullWidth
                      size="medium"
                      value={inputValues.coupon_percentage}
                      onChange={handleNumberChange("coupon_percentage")}
                      onBlur={handleNumberBlur("coupon_percentage")}
                      disabled={isViewMode}
                      error={!!errors.coupon_percentage}
                      helperText={errors.coupon_percentage || ""}
                      sx={textFieldStyling}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PercentIcon size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="text"
                      label="Local Maximum Cap *"
                      fullWidth
                      size="medium"
                      value={inputValues.local_max_cap}
                      onChange={handleNumberChange("local_max_cap")}
                      onBlur={handleNumberBlur("local_max_cap")}
                      disabled={isViewMode}
                      error={!!errors.local_max_cap}
                      helperText={errors.local_max_cap || ""}
                      sx={textFieldStyling}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyIcon size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="text"
                      label="Foreign Maximum Cap *"
                      fullWidth
                      size="medium"
                      value={inputValues.foreign_max_cap}
                      onChange={handleNumberChange("foreign_max_cap")}
                      onBlur={handleNumberBlur("foreign_max_cap")}
                      disabled={isViewMode}
                      error={!!errors.foreign_max_cap}
                      helperText={errors.foreign_max_cap || ""}
                      sx={textFieldStyling}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyIcon size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} mt={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#455a64",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarIcon size={18} />
                      Validity Period
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date *"
                      value={formData.start_date}
                      onChange={(newValue) => {
                        setFormData((prev) => ({
                          ...prev,
                          start_date: newValue,
                        }));
                        setErrors((prev) => ({ ...prev, start_date: "" }));
                      }}
                      disabled={isViewMode}
                      slotProps={{ textField: startDateTextFieldProps }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date *"
                      value={formData.end_date}
                      onChange={(newValue) => {
                        setFormData((prev) => ({
                          ...prev,
                          end_date: newValue,
                        }));
                        setErrors((prev) => ({ ...prev, end_date: "" }));
                      }}
                      disabled={isViewMode}
                      slotProps={{ textField: endDateTextFieldProps }}
                    />
                  </Grid>

                  <Grid item xs={12} mt={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#455a64",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <PackageIcon size={18} />
                      Applicable Plan
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Plan Name *"
                      fullWidth
                      size="medium"
                      value={formData.plan_id ?? ""}
                      onChange={handleChange("plan_id")}
                      disabled={isViewMode}
                      error={!!errors.plan_id}
                      helperText={errors.plan_id || ""}
                      sx={textFieldStyling}
                    >
                      {planData.map((plan:any) => (
                        <MenuItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#f1f8e9",
                    border: "1px solid #c5e1a5",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="#33691e"
                      mb={2}
                    >
                      Coupon Overview
                    </Typography>
                    <Typography variant="body2" color="#444" mb={2}>
                      Create promotional coupons to attract new customers and
                      reward existing ones. Coupons can be applied to specific
                      plans during checkout.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      <Chip
                        label="Discount"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip
                        label="Promotion"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip
                        label="Marketing"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 500 }}
                      />
                    </Stack>
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="#33691e"
                      mb={2}
                    >
                      Coupon Tips
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                      <Typography component="li" variant="body2" mb={1}>
                        Set a reasonable discount percentage (5-30%).
                      </Typography>
                      <Typography component="li" variant="body2" mb={1}>
                        Always set a maximum cap amount to avoid excessive
                        discounts.
                      </Typography>
                      <Typography component="li" variant="body2" mb={1}>
                        Choose validity periods that align with marketing
                        campaigns.
                      </Typography>
                      <Typography component="li" variant="body2">
                        Target specific plans for better conversion rates.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {!isViewMode && (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      background:
                        "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {mode === "new" ? "Create Coupon" : "Update Coupon"}
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default NewCoupon;
