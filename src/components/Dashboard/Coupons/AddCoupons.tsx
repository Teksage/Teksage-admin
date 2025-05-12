// import React, { useState, useEffect, useRef } from "react";
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
//   // Refs to track cursor position
//   const couponPercentageRef = useRef<HTMLInputElement>(null);
//   const maxCapRef = useRef<HTMLInputElement>(null);

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
//     (field: "coupon_percentage" | "local_max_cap", inputRef: React.RefObject<HTMLInputElement>) =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const input = event.target;
//       const cursorPosition = input.selectionStart || 0;
//       let value = event.target.value.replace(/,/g, ""); // Remove commas for processing

//       // Allow empty input
//       if (value === "") {
//         setFormData((prev) => ({ ...prev, [field]: "" }));
//         setInputValues((prev) => ({ ...prev, [field]: "" }));
//         setErrors((prev: any) => ({ ...prev, [field]: "" }));
//         return;
//       }

//       // Validate input: numbers and one decimal point, up to 2 decimal places
//       if (!/^\d*\.?\d{0,2}$/.test(value)) return;

//       const numValue = Number(value);
//       if (isNaN(numValue)) return;

//       // Update formData with raw number
//       setFormData((prev) => ({ ...prev, [field]: numValue }));
//       // Update inputValues with raw string (without commas)
//       setInputValues((prev) => ({ ...prev, [field]: value }));
//       setErrors((prev: any) => ({ ...prev, [field]: "" }));

//       // Calculate new cursor position after formatting
//       const formattedValue = numValue.toLocaleString("en-US", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 2,
//       });
//       const commasBeforeCursor = (value.substring(0, cursorPosition).match(/,/g) || []).length;
//       const newCommasBeforeCursor = (formattedValue.substring(0, cursorPosition).match(/,/g) || []).length;
//       const cursorAdjustment = newCommasBeforeCursor - commasBeforeCursor;

//       // Set cursor position after formatting
//       setTimeout(() => {
//         if (inputRef.current) {
//           const newCursorPosition = cursorPosition + cursorAdjustment;
//           inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
//         }
//       }, 0);
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
//       console.log(formData, "formData");
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
//                 inputRef={couponPercentageRef}
//                 value={
//                   isViewMode
//                     ? formData.coupon_percentage === ""
//                       ? ""
//                       : Number(formData.coupon_percentage).toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                     : inputValues.coupon_percentage === ""
//                     ? ""
//                     : Number(inputValues.coupon_percentage).toLocaleString("en-US", {
//                         minimumFractionDigits: 0,
//                         maximumFractionDigits: 2,
//                       })
//                 }
//                 onChange={handleNumberChange("coupon_percentage", couponPercentageRef)}
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
//                 inputRef={maxCapRef}
//                 value={
//                   isViewMode
//                     ? formData.local_max_cap === ""
//                       ? ""
//                       : Number(formData.local_max_cap).toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                     : inputValues.local_max_cap === ""
//                     ? ""
//                     : Number(inputValues.local_max_cap).toLocaleString("en-US", {
//                         minimumFractionDigits: 0,
//                         maximumFractionDigits: 2,
//                       })
//                 }
//                 onChange={handleNumberChange("local_max_cap", maxCapRef)}
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
  TextFieldProps,
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
  local_max_cap: number | "";
  start_date: Date | null;
  end_date: Date | null;
  plan_id: number | null;
}

// Define type for textField props to fix TypeScript error
interface DatePickerTextFieldProps extends Omit<TextFieldProps, "variant"> {
  size?: "small" | "medium";
}

const NewCoupon: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<CouponFormData>({
    coupon_name: "",
    coupon_percentage: "",
    local_max_cap: "",
    start_date: null,
    end_date: null,
    plan_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [planData, setPlanData] = useState([]);
  // State to hold raw input strings for typing
  const [inputValues, setInputValues] = useState({
    coupon_percentage: "",
    local_max_cap: "",
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
          const maxCap = data?.local_max_cap != null ? Number(data.local_max_cap) : "";
          setFormData({
            coupon_name: data?.coupon_name || "",
            coupon_percentage: percentage,
            local_max_cap: maxCap,
            start_date: data?.start_date ? new Date(data.start_date) : null,
            end_date: data?.end_date ? new Date(data.end_date) : null,
            plan_id: data?.plan_id || null,
          });
          // Set initial input values without commas
          setInputValues({
            coupon_percentage: percentage === "" ? "" : String(percentage),
            local_max_cap: maxCap === "" ? "" : String(maxCap),
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
          field === "plan_id"
            ? value === ""
              ? null
              : Number(value)
            : value,
      }));

      setErrors((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    };

  const handleNumberChange =
    (field: "coupon_percentage" | "local_max_cap") =>
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

      // Remove any non-numeric characters except for a single decimal point
      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = `${parts[0]}.${parts.slice(1).join("")}`; // Merge extra dots
      }
      if (parts[1] && parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`; // Limit to 2 decimal places
      }

      console.log(`Cleaned input for ${field}:`, value);

      const numValue = Number(value);
      if (isNaN(numValue)) {
        console.log(`Input for ${field} is not a valid number, ignoring update`);
        return;
      }

      // Update formData with the numeric value
      setFormData((prev) => ({ ...prev, [field]: numValue }));
      // Store the raw input for display while typing
      setInputValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    };

  const handleNumberBlur =
    (field: "coupon_percentage" | "local_max_cap") =>
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === "") return;

      const numValue = Number(value.replace(/[^0-9.]/g, ""));
      if (isNaN(numValue)) return;

      // Format the value for display after blur
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
      newErrors.local_max_cap = "Enter a valid max cap (0 or more).";
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
          mode === "edit" ? `/api/admin/coupons/${userId}` : "/api/admin/coupons",
        method: mode === "edit" ? "put" : "post",
        data: formData,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error submitting coupon:", error);
    }
  };

  const isViewMode = mode === "view";

  // Define textField props for DatePickers with correct typing
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            ? "Create Coupon"
            : mode === "edit"
            ? "Edit Coupon"
            : "View Coupon"}
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
                Coupon Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Coupon Name *"
                fullWidth
                size="small"
                value={formData.coupon_name}
                onChange={handleChange("coupon_name")}
                disabled={isViewMode}
                error={!!errors.coupon_name}
                helperText={errors.coupon_name || ""}
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

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                type="text"
                label="Coupon % *"
                fullWidth
                size="small"
                value={
                  isViewMode
                    ? formData.coupon_percentage === ""
                      ? ""
                      : Number(formData.coupon_percentage).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                    : inputValues.coupon_percentage
                }
                onChange={handleNumberChange("coupon_percentage")}
                onBlur={handleNumberBlur("coupon_percentage")}
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
                error={!!errors.coupon_percentage}
                helperText={errors.coupon_percentage || ""}
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

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                type="text"
                label="Max Cap *"
                fullWidth
                size="small"
                value={
                  isViewMode
                    ? formData.local_max_cap === ""
                      ? ""
                      : Number(formData.local_max_cap).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                    : inputValues.local_max_cap
                }
                onChange={handleNumberChange("local_max_cap")}
                onBlur={handleNumberBlur("local_max_cap")}
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
                error={!!errors.local_max_cap}
                helperText={errors.local_max_cap || ""}
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

            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
              >
                Validity Period
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date *"
                value={formData.start_date}
                onChange={(newValue) => {
                  setFormData((prev) => ({ ...prev, start_date: newValue }));
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
                  setFormData((prev) => ({ ...prev, end_date: newValue }));
                  setErrors((prev) => ({ ...prev, end_date: "" }));
                }}
                disabled={isViewMode}
                slotProps={{ textField: endDateTextFieldProps }}
              />
            </Grid>

            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
              >
                Applicable Plan
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Plan Name *"
                fullWidth
                size="small"
                value={formData.plan_id ?? ""}
                onChange={handleChange("plan_id")}
                disabled={isViewMode}
                error={!!errors.plan_id}
                helperText={errors.plan_id || ""}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                  },
                }}
                SelectProps={{
                  sx: {
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
                  },
                }}
                sx={{
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                }}
              >
                {planData.map((plan: any) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </TextField>
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