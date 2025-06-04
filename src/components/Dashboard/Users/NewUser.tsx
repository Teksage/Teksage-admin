// import React, { useEffect, useState, useRef } from "react";
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
//   FormHelperText,
//   CircularProgress,
//   SelectChangeEvent,
//   // InputAdornment,
//   TextFieldProps
// } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { callAPI } from "../../../api/crudFactory"; // adjust path as per your project
// import CustomSnackbar from "../../Elements/CustomSnackbar";
// import PlaceAutocomplete from "../../Elements/LocationAutocomplete";
// import { Person } from "@mui/icons-material";
// // import ClearIcon from "@mui/icons-material/Clear";
// import { capitalizeFirstLetter } from "../../Elements/CommonFunctions";
// // import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// interface UserFormData {
//   first_name: string;
//   last_name: string;
//   email: string;
//   mobile: string;
//   dateOfBirth: Date | null;
//   timeOfBirth: Date | null;
//   placeOfBirth: string;
//   preferredLocation: string;
//   rashi: string;
//   nakshatra: string;
//   status: string;
//   user_type: string;
// }

// interface DatePickerTextFieldProps extends Omit<TextFieldProps, "variant"> {
//   size?: "small" | "medium";
// }

// const rasiOptions = [
//   "Aries",
//   "Taurus",
//   "Gemini",
//   "Cancer",
//   "Leo",
//   "Virgo",
//   "Libra",
//   "Scorpio",
//   "Sagittarius",
//   "Capricorn",
//   "Aquarius",
//   "Pisces",
// ];

// const nakshatramOptions: Record<string, string[]> = {
//   Aries: ["Ashwini", "Bharani", "Krittika"],
//   Taurus: ["Krittika", "Rohini", "Mrigashira"],
//   Gemini: ["Mrigashira", "Ardra", "Punarvasu"],
//   Cancer: ["Punarvasu", "Pushya", "Ashlesha"],
//   Leo: ["Magha", "Purva Phalguni", "Uttara Phalguni"],
//   Virgo: ["Uttara Phalguni", "Hasta", "Chitra"],
//   Libra: ["Chitra", "Swati", "Vishaka"],
//   Scorpio: ["Vishaka", "Anuradha", "Jyeshta"],
//   Sagittarius: ["Moola", "Purva Ashadha", "Uttara Ashadha"],
//   Capricorn: ["Uttara Ashadha", "Shravana", "Dhanishta"],
//   Aquarius: ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"],
//   Pisces: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
// };

// // Fetch Backend API for the above

// const userTypeOptions = ["Customer", "Astrologer", "Admin"];

// const NewUser: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams<{ userId: string }>();
//   const isViewMode = mode === "view";
//   const isFormInitialized = useRef(true);
//   const urbanistBoldText = {
//     fontFamily: "Urbanist",
//     fontWeight: 600,
//   };

//   const [formData, setFormData] = useState<UserFormData>({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile: "",
//     dateOfBirth: null,
//     timeOfBirth: null,
//     placeOfBirth: "",
//     preferredLocation: "",
//     rashi: "",
//     nakshatra: "",
//     status: "Active",
//     user_type: "Customer",
//   });

//   const [errors, setErrors] = useState<
//     Partial<Record<keyof UserFormData, string>>
//   >({});
//   const [loadingRasiNakshatram, setLoadingRasiNakshatram] = useState(false);
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: "success" | "error" | "info" | "warning";
//   }>({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (mode === "edit" && userId) {
//         setIsLoading(true);
//         try {
//           const res = await callAPI({
//             endpoint: `api/admin/users/${userId}`,
//             method: "get",
//           });

//           const user = res?.data;
//           console.log(user, "user 112");
//           setFormData({
//             first_name: user.first_name || "",
//             last_name: user.last_name || "",
//             email: user.email || "",
//             mobile: user.mobile_number || "",
//             dateOfBirth: user.date_of_birth
//               ? new Date(user.date_of_birth)
//               : null,
//             timeOfBirth: user.time_of_birth
//               ? new Date(`1970-01-01T${user.time_of_birth}`)
//               : null,
//             placeOfBirth: capitalizeFirstLetter(user.place_of_birth) || "",
//             preferredLocation:
//               capitalizeFirstLetter(user.preferred_location) || "",
//             rashi: user.rashi || "",
//             nakshatra: user.nakshatra || "",
//             status: user.status === "inactive" ? "Inactive" : "Active",
//             user_type:
//               user.user_type.charAt(0).toUpperCase() +
//                 user.user_type.slice(1).toLowerCase() || "Customer",
//           });

//           isFormInitialized.current = true;
//         } catch (err) {
//           console.error("Error fetching user data:", err);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     })();
//   }, [mode, userId]);

//   const dateOfBirthTextFieldProps: DatePickerTextFieldProps = {
//     fullWidth: true,
//     size: "small",
//     error: !!errors.dateOfBirth,
//     helperText: errors.dateOfBirth || "",
//     InputLabelProps: {
//       sx: {
//         fontSize: "0.95rem",
//         fontWeight: 500,
//         color: "#455a64",
//         fontFamily: "Urbanist",
//       },
//     },
//     InputProps: {
//       sx: {
//         fontSize: "0.9rem",
//         borderRadius: "6px",
//         fontFamily: "Urbanist",
//       },
//     },
//     sx: {
//       "& .MuiInputLabel-root": {
//         fontFamily: "Urbanist",
//         fontSize: "0.9rem",
//       },
//       "& .MuiOutlinedInput-root": {
//         "& fieldset": { borderColor: "#cfd8dc" },
//         "&:hover fieldset": { borderColor: "#3f51b5" },
//         "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//       },
//       "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//     },
//   };

//   // Field-specific validation function
//   const validateField = (field: keyof UserFormData, value: string) => {
//     let error = "";

//     switch (field) {
//       case "first_name":
//         if (!value.trim()) {
//           error = "First name is required";
//         }
//         break;
//       case "last_name":
//         if (!value.trim()) {
//           error = "Last name is required";
//         }
//         break;
//       case "email":
//         if (!value.trim()) {
//           error = "Email is required";
//         } else if (!/^\S+@\S+\.\S+$/.test(value)) {
//           error = "Please enter a valid email address";
//         }
//         break;
//       case "mobile":
//         if (!value.trim()) {
//           error = "Mobile number is required";
//         } else if (!/^\d{10}$/.test(value)) {
//           error = "Mobile number must be exactly 10 digits";
//         }
//         break;
//       default:
//         break;
//     }

//     return error;
//   };

//   // Validate all mandatory fields on form submission
//   const validate = () => {
//     const newErrors: typeof errors = {};

//     newErrors.first_name = validateField("first_name", formData.first_name);
//     newErrors.last_name = validateField("last_name", formData.last_name);
//     newErrors.email = validateField("email", formData.email);
//     newErrors.mobile = validateField("mobile", formData.mobile);

//     // Filter out empty errors to only include fields with validation issues
//     return Object.fromEntries(
//       Object.entries(newErrors).filter(([_, value]) => value)
//     );
//   };

//   // Helper function to update form data
//   const updateFormData = (field: keyof UserFormData, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     // Clear error for the field when the user starts typing
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   // Updated handleChange function
//   const handleChange =
//     (field: keyof UserFormData) =>
//     (
//       input:
//         | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//         | SelectChangeEvent<string | string[]>
//         | string
//     ) => {
//       let value: string | string[];
//       if (typeof input === "string") {
//         value = input;
//       } else {
//         value = input.target.value as string | string[];
//       }
//       updateFormData(field, value);
//     };

//   // Handle blur to validate mandatory fields
//   const handleBlur =
//     (field: keyof UserFormData) =>
//     (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       // const value = event.target.value;
//       console.log(event);
//       const value:any = formData[field];
//       const error = validateField(field, value);
//       if (error) {
//         setErrors((prev) => ({ ...prev, [field]: error }));
//       }
//     };

//   // const handleDateChange = (value: Date | null) => {
//   //   setFormData((prev) => ({ ...prev, dateOfBirth: value }));
//   //   setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
//   // };

//   const handleTimeChange = (value: Date | null) => {
//     setFormData((prev) => ({ ...prev, timeOfBirth: value }));
//     setErrors((prev) => ({ ...prev, timeOfBirth: "" }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       console.log({
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         preferred_location: formData.preferredLocation,
//         email: formData.email,
//         mobile_number: formData.mobile,
//         birth_location: formData.placeOfBirth,
//         date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
//         time_of_birth: formData.timeOfBirth?.toTimeString().slice(0, 5),
//         rashi: formData.rashi,
//         nakshatra: formData.nakshatra,
//         status: formData.status.toLowerCase(),
//         user_type: formData.user_type.toLowerCase(),
//       });
//       const response = await callAPI({
//         endpoint:
//           mode === "edit" ? `api/admin/users/${userId}` : "api/admin/users",
//         method: mode === "edit" ? "put" : "post",
//         data: {
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           preferred_location: formData.preferredLocation,
//           email: formData.email,
//           mobile_number: formData.mobile,
//           birth_location: formData.placeOfBirth,
//           date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
//           time_of_birth: formData.timeOfBirth?.toTimeString().slice(0, 5),
//           rashi: formData.rashi,
//           nakshatra: formData.nakshatra,
//           status: formData.status.toLowerCase(),
//           user_type: formData.user_type.toLowerCase(),
//         },
//       });
//       console.log(response, "response");
//       setSnackbar({
//         open: true,
//         message:
//           mode === "edit"
//             ? "User updated successfully!"
//             : "User created successfully!",
//         severity: "success",
//       });

//       setTimeout(() => {
//         navigate(-1);
//       }, 1000);
//     } catch (err: any) {
//       console.error("API Error:", err);
//       let errorMessage = err.response.data.detail || "Something went wrong. Please try again.";
//       if (err) {
//         errorMessage =
//           err.response.data.detail || JSON.stringify(err.response.data.detail);
//       }
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ⏳ Auto trigger rashi & nakshatra fetch
//   useEffect(() => {
//     if (mode === "edit" && !isFormInitialized.current) return;
//     const { dateOfBirth, timeOfBirth, placeOfBirth, preferredLocation } =
//       formData;

//     if (
//       dateOfBirth &&
//       timeOfBirth &&
//       placeOfBirth.trim() &&
//       preferredLocation.trim()
//     ) {
//       const fetchRasiNakshatra = async () => {
//         try {
//           setLoadingRasiNakshatram(true);
//           const response = await callAPI({
//             endpoint: "api/auth/rashi-nakshatra",
//             method: "post",
//             data: {
//               preferred_location: preferredLocation,
//               date_of_birth: dateOfBirth.toISOString().split("T")[0],
//               time_of_birth: timeOfBirth.toTimeString().slice(0, 5),
//               birth_location: placeOfBirth,
//             },
//           });

//           console.log(response.data, "response.data");

//           if (response?.data?.nakshatra && response?.data?.rashi) {
//             setFormData((prev) => ({
//               ...prev,
//               rashi: response.data.rashi,
//               nakshatra: response.data.nakshatra,
//             }));
//           }
//         } catch (err) {
//           console.error("Failed to fetch rashi and nakshatra:", err);
//         } finally {
//           setLoadingRasiNakshatram(false);
//         }
//       };

//       fetchRasiNakshatra();
//     }
//   }, [
//     formData.dateOfBirth,
//     formData.timeOfBirth,
//     formData.placeOfBirth,
//     formData.preferredLocation,
//     mode,
//   ]);

//   const availableNakshatrams = nakshatramOptions[formData.rashi] || [];

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       {/* Header with back button - compact and aligned */}
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
//           <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
//         </IconButton>
//         <Typography
//           variant="body1"
//           style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//           color="#06402B"
//         >
//           Back
//         </Typography>
//       </Box>

//       <Paper
//         elevation={2}
//         sx={{
//           p: { xs: 2, sm: 3 },
//           maxWidth: "800px", // Constrain width for better alignment
//           mx: "auto",
//           height: "100%",
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
//           },
//         }}
//       >
//         {/* Form title - balanced size and styling */}
//         <Typography
//           variant="h5"
//           sx={{
//             mb: 3,
//             color: "#2e7d32",
//             display: "flex", // Add flex to align icon and text
//             alignItems: "center", // Center icon and text vertically
//             gap: 1, // Space between icon and text
//             maxWidth: "50%", // Prevent title from pushing buttons too far
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace: "nowrap",
//             fontFamily: '"Poppins", sans-serif', // Modern font family
//             letterSpacing: 0.5, // Slight spacing for readability
//             textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
//           }}
//           style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//         >
//           <Person sx={{ fontSize: 24 }} /> {/* Add the icon */}
//           {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} User
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {/* Personal Information */}
//             <Grid item xs={12}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//                 style={urbanistBoldText}
//               >
//                 Personal Information
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="First Name *"
//                 fullWidth
//                 size="small"
//                 value={formData.first_name}
//                 onChange={handleChange("first_name")}
//                 onBlur={handleBlur("first_name")} // Add onBlur for validation
//                 error={!!errors.first_name}
//                 helperText={errors.first_name || ""}
//                 disabled={isViewMode}
//                 InputLabelProps={{
//                   sx: {
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 InputProps={{
//                   sx: {
//                     fontSize: "0.9rem",
//                     borderRadius: "6px",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 sx={{
//                   "& .MuiInputLabel-root": {
//                     fontFamily: "Urbanist",
//                     fontSize: "0.9rem",
//                   },
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
//                 label="Last Name *"
//                 fullWidth
//                 size="small"
//                 value={formData.last_name}
//                 onChange={handleChange("last_name")}
//                 onBlur={handleBlur("last_name")} // Add onBlur for validation
//                 error={!!errors.last_name}
//                 helperText={errors.last_name || ""}
//                 disabled={isViewMode}
//                 InputLabelProps={{
//                   sx: {
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 InputProps={{
//                   sx: {
//                     fontSize: "0.9rem",
//                     borderRadius: "6px",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 sx={{
//                   "& .MuiInputLabel-root": {
//                     fontFamily: "Urbanist",
//                     fontSize: "0.9rem",
//                   },
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
//                 label="Email *"
//                 fullWidth
//                 size="small"
//                 value={formData.email}
//                 onChange={handleChange("email")}
//                 onBlur={handleBlur("email")} // Add onBlur for validation
//                 error={!!errors.email}
//                 helperText={errors.email || ""}
//                 disabled={isViewMode}
//                 InputLabelProps={{
//                   sx: {
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 InputProps={{
//                   sx: {
//                     fontSize: "0.9rem",
//                     borderRadius: "6px",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 sx={{
//                   "& .MuiInputLabel-root": {
//                     fontFamily: "Urbanist",
//                     fontSize: "0.9rem",
//                   },
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
//                 label="Mobile Number *"
//                 fullWidth
//                 size="small"
//                 value={formData.mobile}
//                 onChange={(e) => {
//                   const numericValue = e.target.value.replace(/\D/g, "");
//                   handleChange("mobile")(numericValue);
//                 }}
//                 onBlur={handleBlur("mobile")} // Add onBlur for validation
//                 error={!!errors.mobile}
//                 helperText={errors.mobile || ""}
//                 disabled={isViewMode}
//                 InputLabelProps={{
//                   sx: {
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 InputProps={{
//                   sx: {
//                     fontSize: "0.9rem",
//                     borderRadius: "6px",
//                     fontFamily: "Urbanist",
//                   },
//                 }}
//                 sx={{
//                   "& .MuiInputLabel-root": {
//                     fontFamily: "Urbanist",
//                     fontSize: "0.9rem",
//                   },
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": { borderColor: "#cfd8dc" },
//                     "&:hover fieldset": { borderColor: "#3f51b5" },
//                     "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//                   },
//                   "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//                 }}
//               />
//             </Grid>

//             {/* Birth Information */}
//             <Grid item xs={12} mt={1}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//                 style={urbanistBoldText}
//               >
//                 Birth Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4}>
//               <DatePicker
//                 label="Date of Birth *"
//                 value={formData.dateOfBirth}
//                 onChange={(newValue) => {
//                   const today = new Date();
//                   today.setHours(23, 59, 59, 999); // Set to end of today for comparison
//                   // Check if newValue is valid and not in the future
//                   if (newValue && newValue <= today) {
//                     setFormData((prev) => ({
//                       ...prev,
//                       dateOfBirth: newValue,
//                     }));
//                     setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
//                   } else if (newValue && newValue > today) {
//                     // Handle invalid future date
//                     setErrors((prev) => ({
//                       ...prev,
//                       dateOfBirth: "Date of Birth cannot be in the future",
//                     }));
//                     // Optionally reset to null or today
//                     setFormData((prev) => ({
//                       ...prev,
//                       dateOfBirth: null, // Or set to today: new Date()
//                     }));
//                   } else {
//                     // Handle null or invalid date
//                     setFormData((prev) => ({
//                       ...prev,
//                       dateOfBirth: null,
//                     }));
//                     setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
//                   }
//                 }}
//                 disabled={isViewMode}
//                 maxDate={new Date()} // Restrict future dates
//                 slotProps={{ textField: dateOfBirthTextFieldProps }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <TimePicker
//                 label="Time of Birth"
//                 value={formData.timeOfBirth}
//                 onChange={handleTimeChange}
//                 disabled={isViewMode}
//                 format="HH:mm" // Set 24-hour format without AM/PM
//                 slotProps={{
//                   textField: {
//                     fullWidth: true,
//                     size: "small",
//                     error: !!errors.timeOfBirth,
//                     helperText: errors.timeOfBirth || "",
//                     InputLabelProps: {
//                       sx: {
//                         fontSize: "0.95rem",
//                         fontWeight: 500,
//                         color: "#455a64",
//                         fontFamily: "Urbanist",
//                       },
//                     },
//                     InputProps: {
//                       sx: {
//                         fontSize: "0.9rem",
//                         borderRadius: "6px",
//                         fontFamily: "Urbanist",
//                       },
//                     },
//                     sx: {
//                       "& .MuiInputLabel-root": {
//                         fontFamily: "Urbanist",
//                         fontSize: "0.9rem",
//                       },
//                       "& .MuiOutlinedInput-root": {
//                         "& fieldset": { borderColor: "#cfd8dc" },
//                         "&:hover fieldset": { borderColor: "#3f51b5" },
//                         "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//                       },
//                       "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//                     },
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <PlaceAutocomplete
//                 label="Place of Birth"
//                 value={formData.placeOfBirth}
//                 onChange={(val) => {
//                   setFormData((prev) => ({ ...prev, placeOfBirth: val }));
//                   // setErrors((prev) => ({ ...prev, placeOfBirth: "" }));
//                 }}
//                 error={!!errors.placeOfBirth}
//                 helperText={errors.placeOfBirth}
//                 disabled={isViewMode}
//               />
//             </Grid>

//             {/* Additional Information */}
//             <Grid item xs={12} mt={1}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//                 style={urbanistBoldText}
//               >
//                 Additional Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <PlaceAutocomplete
//                 label="Preferred Location"
//                 value={formData.preferredLocation}
//                 onChange={(val) => {
//                   setFormData((prev) => ({ ...prev, preferredLocation: val }));
//                   // setErrors((prev) => ({ ...prev, preferredLocation: "" }));
//                 }}
//                 error={!!errors.preferredLocation}
//                 helperText={errors.preferredLocation}
//                 disabled={isViewMode}
//               />
//             </Grid>

//             {loadingRasiNakshatram && (
//               <Grid item xs={12}>
//                 <Typography
//                   variant="caption"
//                   color="primary"
//                   display="flex"
//                   alignItems="center"
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   <CircularProgress size={14} sx={{ mr: 1 }} />
//                   Fetching rashi & nakshatra based on your input...
//                 </Typography>
//               </Grid>
//             )}

//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl
//                 fullWidth
//                 error={!!errors.rashi}
//                 disabled={isViewMode}
//                 size="small"
//               >
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                   style={{ fontFamily: "Urbanist" }}
//                 >
//                   Rashi
//                 </InputLabel>
//                 <Select
//                   value={formData.rashi}
//                   onChange={handleChange("rashi")}
//                   label="Rashi"
//                   sx={{
//                     fontFamily: "Urbanist",
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
//                   {rasiOptions.map((option) => (
//                     <MenuItem
//                       key={option}
//                       value={option}
//                       style={{ fontFamily: "Urbanist" }}
//                     >
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.rashi && (
//                   <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                     {errors.rashi}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl
//                 fullWidth
//                 error={!!errors.nakshatra}
//                 disabled={isViewMode}
//                 size="small"
//               >
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                   style={{ fontFamily: "Urbanist" }}
//                 >
//                   Nakshatra
//                 </InputLabel>
//                 <Select
//                   value={formData.nakshatra}
//                   onChange={handleChange("nakshatra")}
//                   label="Nakshatra"
//                   sx={{
//                     fontFamily: "Urbanist",
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
//                   {availableNakshatrams.map((option) => (
//                     <MenuItem
//                       key={option}
//                       value={option}
//                       style={{ fontFamily: "Urbanist" }}
//                     >
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.nakshatra && (
//                   <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                     {errors.nakshatra}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <FormControl fullWidth disabled={isViewMode} size="small">
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                   style={{ fontFamily: "Urbanist" }}
//                 >
//                   User Type
//                 </InputLabel>
//                 <Select
//                   value={formData.user_type}
//                   onChange={handleChange("user_type")}
//                   label="User Type"
//                   sx={{
//                     fontFamily: "Urbanist",
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
//                   {userTypeOptions.map((option) => (
//                     <MenuItem
//                       key={option}
//                       value={option}
//                       style={{ fontFamily: "Urbanist" }}
//                     >
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
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
//                   onChange={handleChange("status")}
//                   label="Status"
//                   sx={{
//                     fontFamily: "Urbanist",
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
//                   <MenuItem value="Active" style={{ fontFamily: "Urbanist" }}>
//                     Active
//                   </MenuItem>
//                   <MenuItem value="Inactive" style={{ fontFamily: "Urbanist" }}>
//                     Inactive
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Submit Button - Centered and styled */}
//             {!isViewMode && (
//               <Grid item xs={12} mt={2}>
//                 <Box sx={{ display: "flex", justifyContent: "end" }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     disabled={isLoading}
//                     sx={{
//                       // background:
//                       //   "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
//                       background:
//                         "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)",
//                       color: "#fff",
//                       borderRadius: "8px",
//                       padding: "8px 24px",
//                       fontFamily: "Urbanist",
//                       fontWeight: 800,
//                       fontSize: "0.95rem",
//                       textTransform: "none",
//                       boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         // background: "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
//                         background:
//                           "linear-gradient(135deg, #388E3C 0%, #004D40 100%)",
//                         boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
//                         transform: "scale(1.02)",
//                       },
//                     }}
//                   >
//                     {mode === "new" ? "Create User" : "Update User"}
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
//     </LocalizationProvider>
//   );
// };

// export default NewUser;

import React, { useEffect, useState, useRef, useMemo } from "react";
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
  FormHelperText,
  CircularProgress,
  SelectChangeEvent,
  TextFieldProps,
  Skeleton,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { callAPI } from "../../../api/crudFactory";
import CustomSnackbar from "../../Elements/CustomSnackbar";
import PlaceAutocomplete from "../../Elements/LocationAutocomplete";
import { Person } from "@mui/icons-material";
import { capitalizeFirstLetter } from "../../Elements/CommonFunctions";
import { useSelector } from "react-redux";
import { AppState } from "../../Elements/CommonFunctions";

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile: string;
  dateOfBirth: Date | null;
  timeOfBirth: Date | null;
  placeOfBirth: string;
  preferredLocation: string;
  rashi: string;
  nakshatra: string;
  status: string;
  user_type: string;
}

interface DatePickerTextFieldProps extends Omit<TextFieldProps, "variant"> {
  size?: "small" | "medium";
}

const rasiOptions = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const nakshatramOptions: Record<string, string[]> = {
  Aries: ["Ashwini", "Bharani", "Krithika"],
  Taurus: ["Krithika", "Rohini", "Mrigasira"],
  Gemini: ["Mrigasira", "Ardra", "Punarvasu"],
  Cancer: ["Punarvasu", "Pushyami", "Ashlesha"],
  Leo: ["Magha", "Purva Phalguni", "Uttra Phalguni"],
  Virgo: ["Uttra Phalguni", "Hasta", "Chitra"],
  Libra: ["Chitra", "Swathi", "Vishakha"],
  Scorpio: ["Vishakha", "Anuradha", "Jyeshta"],
  Sagittarius: ["Moola", "Purva Ashadha", "Uttra Ashadha"],
  Capricorn: ["Uttra Ashadha", "Shravana", "Dhanishta"],
  Aquarius: ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"],
  Pisces: ["Purva Bhadrapada", "Uttra Bhadrapada", "Revathi"],
};

const userTypeOptions = ["Customer", "Astrologer", "Admin"];

const NewUser: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId: userIdParam } = useParams<{ userId: string }>();
  const isViewMode = mode === "view";
  const isFormInitialized = useRef(false);
  const isInitialEditRender = useRef(mode === "edit");
  const hasFetchedUserData = useRef(false); // Guard against multiple API calls
  const urbanistBoldText = {
    fontFamily: "Urbanist",
    fontWeight: 600,
  };

  // Memoize userId to prevent unnecessary useEffect triggers
  const userId = useMemo(() => userIdParam, [userIdParam]);

  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    country_code: "+91", // Add this field with a default value
    mobile: "",
    dateOfBirth: null,
    timeOfBirth: null,
    placeOfBirth: "",
    preferredLocation: "",
    rashi: "",
    nakshatra: "",
    status: "Active",
    user_type: "Customer",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});
  const [loadingRasiNakshatram, setLoadingRasiNakshatram] = useState(false);
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
  const loadingTemplate = useSelector((state: AppState) => state.isLoading); // Use Redux isLoading instead of local state

  const countriesList = useSelector((state: AppState) => state.countriesList);

  // Fetch user data in edit mode
  useEffect(() => {
    (async () => {
      // Prevent multiple API calls
      if (hasFetchedUserData.current) return;

      if (mode === "edit" && userId) {
        setIsLoading(true);
        try {
          hasFetchedUserData.current = true; // Mark as fetched
          const res = await callAPI({
            endpoint: `api/admin/users/${userId}`,
            method: "get",
          });

          const user = res?.data;
          console.log(user, "user 112", user.time_of_birth);
          setFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            country_code: user.country_code || "+91", // Adjust based on API response
            mobile: user.mobile_number || "",
            dateOfBirth: user.date_of_birth
              ? new Date(user.date_of_birth)
              : null,
            // timeOfBirth: user.time_of_birth
            //   ? new Date(`1970-01-01T${user.time_of_birth}`)
            //   : null,
            // timeOfBirth: user.time_of_birth
            //   ? (() => {
            //       const timeParts = user.time_of_birth.split(":");
            //       if (timeParts.length === 2) {
            //         const hours = parseInt(timeParts[0], 10);
            //         const minutes = parseInt(timeParts[1], 10);
            //         const date = new Date(1970, 0, 1, hours, minutes);
            //         return isNaN(date.getTime()) ? null : date;
            //       }
            //       return null;
            //     })()
            //   : null,
            timeOfBirth: user.time_of_birth
              ? (() => {
                  const date = new Date(`1970-01-01T${user.time_of_birth}`);
                  return isNaN(date.getTime()) ? null : date;
                })()
              : null,
            placeOfBirth: capitalizeFirstLetter(user.place_of_birth) || "",
            preferredLocation:
              capitalizeFirstLetter(user.preferred_location) || "",
            rashi: user.rashi || "",
            nakshatra: user.nakshatra || "",
            status: user.status === "inactive" ? "Inactive" : "Active",
            user_type:
              user.user_type.charAt(0).toUpperCase() +
                user.user_type.slice(1).toLowerCase() || "Customer",
          });

          isFormInitialized.current = true;
        } catch (err: any) {
          console.error("Error fetching user data:", err);
          setSnackbar({
            open: true,
            message:
              err.message || "Failed to load user data. Please try again.",
            severity: "error",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        isFormInitialized.current = true;
      }
    })();
  }, [mode, userId]);

  const dateOfBirthTextFieldProps: DatePickerTextFieldProps = {
    fullWidth: true,
    size: "small",
    error: !!errors.dateOfBirth,
    helperText: errors.dateOfBirth || "",
    InputLabelProps: {
      sx: {
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "#455a64",
        fontFamily: "Urbanist",
      },
    },
    InputProps: {
      sx: {
        fontSize: "0.9rem",
        borderRadius: "6px",
        fontFamily: "Urbanist",
      },
    },
    sx: {
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
    },
  };

  // Field-specific validation function
  const validateField = (field: keyof UserFormData, value: string) => {
    let error = "";

    switch (field) {
      case "first_name":
        if (!value.trim()) {
          error = "First name is required";
        }
        break;
      case "last_name":
        if (!value.trim()) {
          error = "Last name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (value && !/^\S+@\S+\.\S+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      // case "mobile":
      //   if (!value.trim()) {
      //     error = "Mobile number is required";
      //   } else if (value && !/^\d{10}$/.test(value)) {
      //     error = "Mobile number must be exactly 10 digits";
      //   }
      //   break;
      case "mobile":
        if (!value.trim()) {
          error = "Mobile number is required";
        } else {
          const selectedCountry = countriesList.find(
            (country: any) => country.dial_code === formData.country_code
          );

          if (selectedCountry) {
            const expectedLength = selectedCountry.mobile_number_length;

            if (value.length !== expectedLength) {
              error = `Mobile number must be exactly ${expectedLength} digits for ${selectedCountry.name}`;
            }
          } else {
            // Fallback validation: default to 10 digits
            if (value.length !== 10) {
              error = "Mobile number must be exactly 10 digits";
            }
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate all mandatory fields on form submission
  const validate = () => {
    const newErrors: typeof errors = {};

    newErrors.first_name = validateField("first_name", formData.first_name);
    newErrors.last_name = validateField("last_name", formData.last_name);
    newErrors.email = validateField("email", formData.email);
    newErrors.mobile = validateField("mobile", formData.mobile);

    return Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value)
    );
  };

  // Helper function to update form data
  const updateFormData = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (typeof value === "string") {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle input changes with real-time validation
  const handleChange =
    (field: keyof UserFormData) =>
    (
      input:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | string[]>
        | string
    ) => {
      let value: string | string[];
      if (typeof input === "string") {
        value = input;
      } else {
        value = input.target.value as string | string[];
      }
      updateFormData(field, value);
    };

  // Handle blur to validate mandatory fields
  const handleBlur =
    (field: keyof UserFormData) =>
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(event);
      const value: any = formData[field];
      const error = validateField(field, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    };

  // const handleTimeChange = (value: Date | null) => {
  //   setFormData((prev) => ({ ...prev, timeOfBirth: value }));
  //   setErrors((prev) => ({ ...prev, timeOfBirth: "" }));
  // };

  const handleTimeChange = (newTime: Date | null) => {
    if (newTime && !isNaN(newTime.getTime())) {
      // Ensure the date is valid before updating
      updateFormData("timeOfBirth", newTime);
    } else {
      // If the time is invalid, set it to null
      updateFormData("timeOfBirth", null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      console.log({
        first_name: formData.first_name,
        last_name: formData.last_name,
        preferred_location: formData.preferredLocation,
        email: formData.email,
        mobile_number: formData.mobile,
        birth_location: formData.placeOfBirth,
        date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
        time_of_birth: formData.timeOfBirth?.toTimeString().slice(0, 5),
        rashi: formData.rashi,
        nakshatra: formData.nakshatra,
        status: formData.status.toLowerCase(),
        user_type: formData.user_type.toLowerCase(),
      });
      const response = await callAPI({
        endpoint:
          mode === "edit" ? `api/admin/users/${userId}` : "api/admin/users",
        method: mode === "edit" ? "put" : "post",
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          preferred_location: formData.preferredLocation,
          email: formData.email,
          country_code: formData.country_code,
          mobile_number: formData.mobile,
          // mobile_number: `${formData.country_code}${formData.mobile}`, // Combine country code and mobile number
          birth_location: formData.placeOfBirth,
          date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
          // time_of_birth: formData.timeOfBirth?.toTimeString().slice(0, 5),
          time_of_birth: formData.timeOfBirth
            ? formData.timeOfBirth.toTimeString().slice(0, 5) // Extracts "HH:mm"
            : null,
          rashi: formData.rashi,
          nakshatra: formData.nakshatra,
          status: formData.status.toLowerCase(),
          user_type: formData.user_type.toLowerCase(),
        },
      });
      console.log(response, "response");
      setSnackbar({
        open: true,
        message:
          mode === "edit"
            ? "User updated successfully!"
            : "User created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/users", { replace: true });
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

  // Track previous values to avoid unnecessary fetches
  const prevFormData = useRef({
    dateOfBirth: formData.dateOfBirth,
    timeOfBirth: formData.timeOfBirth,
    placeOfBirth: formData.placeOfBirth,
    preferredLocation: formData.preferredLocation,
  });

  // Auto trigger rashi & nakshatra fetch
  useEffect(() => {
    // Skip if form is not initialized
    if (!isFormInitialized.current) return;

    // Skip on initial render in edit mode
    if (isInitialEditRender.current && mode === "edit") {
      isInitialEditRender.current = false;
      prevFormData.current = {
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        placeOfBirth: formData.placeOfBirth,
        preferredLocation: formData.preferredLocation,
      };
      return;
    }

    const { dateOfBirth, timeOfBirth, placeOfBirth, preferredLocation } =
      formData;

    // Check if any relevant field has actually changed
    const hasChanged =
      dateOfBirth?.toISOString() !==
        prevFormData.current.dateOfBirth?.toISOString() ||
      timeOfBirth?.toISOString() !==
        prevFormData.current.timeOfBirth?.toISOString() ||
      placeOfBirth !== prevFormData.current.placeOfBirth ||
      preferredLocation !== prevFormData.current.preferredLocation;

    // Update previous values
    prevFormData.current = {
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      preferredLocation,
    };

    // Only fetch if fields are present and something has changed
    if (
      dateOfBirth &&
      timeOfBirth &&
      placeOfBirth.trim() &&
      preferredLocation.trim() &&
      hasChanged
    ) {
      const fetchRasiNakshatra = async () => {
        try {
          setLoadingRasiNakshatram(true);
          const response = await callAPI({
            endpoint: "api/auth/rashi-nakshatra",
            method: "post",
            data: {
              preferred_location: preferredLocation,
              date_of_birth: dateOfBirth.toISOString().split("T")[0],
              time_of_birth: timeOfBirth.toTimeString().slice(0, 5),
              birth_location: placeOfBirth,
            },
          });

          console.log("Rashi-Nakshatra API Response:", response);

          const apiData = response?.data || {};
          const rashi = apiData.rashi || apiData.Rashi || "";
          const nakshatra = apiData.nakshatra || apiData.Nakshatra || "";

          if (rashi && nakshatra) {
            const normalizedRashi = rasiOptions.find(
              (option) => option.toLowerCase() === rashi.toLowerCase()
            );
            const availableNakshatrams =
              nakshatramOptions[normalizedRashi || ""] || [];
            const normalizedNakshatra = availableNakshatrams.find(
              (option) => option.toLowerCase() === nakshatra.toLowerCase()
            );

            if (normalizedRashi && normalizedNakshatra) {
              setFormData((prev) => ({
                ...prev,
                rashi: normalizedRashi,
                nakshatra: normalizedNakshatra,
              }));
            } else {
              console.warn(
                "Fetched rashi or nakshatra not found in available options:",
                { rashi, nakshatra }
              );
              setSnackbar({
                open: true,
                message:
                  "Fetched rashi or nakshatra not found in available options.",
                severity: "warning",
              });
            }
          } else {
            console.warn(
              "Rashi or Nakshatra missing in API response:",
              apiData
            );
            setSnackbar({
              open: true,
              message:
                "Unable to fetch rashi and nakshatra. Please check the input data.",
              severity: "error",
            });
          }
        } catch (err: any) {
          console.error("Failed to fetch rashi and nakshatra:", err);
          setSnackbar({
            open: true,
            message: err.message || "Failed to fetch rashi and nakshatra.",
            severity: "error",
          });
        } finally {
          setLoadingRasiNakshatram(false);
        }
      };

      fetchRasiNakshatra();
    }
  }, [
    formData.dateOfBirth,
    formData.timeOfBirth,
    formData.placeOfBirth,
    formData.preferredLocation,
  ]);

  const availableNakshatrams = nakshatramOptions[formData.rashi] || [];

  const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
    const newCountryCode = event.target.value as string;
    updateFormData("country_code", newCountryCode);

    // Revalidate mobile number with new country code
    if (formData.mobile) {
      const error = validateField("mobile", formData.mobile);
      setErrors((prev) => ({
        ...prev,
        mobile: error,
      }));
    }
  };

  return (
    <>
      {loadingTemplate ? (
        <Box sx={{ flex: 1, overflow: "auto", paddingBottom: 7 }}>
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        </Box>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* Header with back button - compact and aligned */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              onClick={() => navigate("/dashboard/users", { replace: true })}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
            </IconButton>
            <Typography
              variant="body1"
              style={{ fontFamily: "Urbanist", fontWeight: 800 }}
              color="#06402B"
            >
              Back
            </Typography>
          </Box>

          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              maxWidth: "800px",
              mx: "auto",
              height: "100%",
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
            {/* Form title - balanced size and styling */}
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: "#2e7d32",
                display: "flex",
                alignItems: "center",
                gap: 1,
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
              <Person sx={{ fontSize: 24 }} />
              {mode === "new"
                ? "Create"
                : mode === "edit"
                ? "Edit"
                : "View"}{" "}
              User
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color="#546e7a"
                    mb={1.5}
                    style={urbanistBoldText}
                  >
                    Personal Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name *"
                    fullWidth
                    size="small"
                    value={formData.first_name}
                    onChange={handleChange("first_name")}
                    onBlur={handleBlur("first_name")}
                    error={!!errors.first_name}
                    helperText={errors.first_name || ""}
                    disabled={isViewMode}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name *"
                    fullWidth
                    size="small"
                    value={formData.last_name}
                    onChange={handleChange("last_name")}
                    onBlur={handleBlur("last_name")}
                    error={!!errors.last_name}
                    helperText={errors.last_name || ""}
                    disabled={isViewMode}
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

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email *"
                    fullWidth
                    size="small"
                    value={formData.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={!!errors.email}
                    helperText={errors.email || ""}
                    disabled={isViewMode}
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
                {/* <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number *"
                fullWidth
                size="small"
                value={formData.mobile}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange("mobile")(numericValue);
                }}
                onBlur={handleBlur("mobile")}
                error={!!errors.mobile}
                helperText={errors.mobile || ""}
                disabled={isViewMode}
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
            </Grid> */}

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {/* Country Code Dropdown */}
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <InputLabel
                        sx={{
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          color: "#455a64",
                          fontFamily: "Urbanist",
                        }}
                      >
                        Code
                      </InputLabel>
                      <Select
                        value={formData.country_code || "+91"}
                        onChange={handleCountryCodeChange}
                        label="Code"
                        disabled={isViewMode}
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
                        {countriesList.map((option: any) => (
                          <MenuItem
                            // key={option.countryCode}
                            key={`${option.dial_code}-${option.name}`}
                            value={option.dial_code}
                            sx={{
                              fontFamily: "Urbanist",
                              fontSize: "0.9rem",
                            }}
                          >
                            {`${option.dial_code} (${option.name})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Mobile Number Input */}
                    <TextField
                      label="Mobile Number *"
                      fullWidth
                      size="small"
                      value={formData.mobile}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleChange("mobile")(numericValue);
                      }}
                      onBlur={handleBlur("mobile")}
                      error={!!errors.mobile}
                      helperText={errors.mobile || ""}
                      disabled={isViewMode}
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
                  </Box>
                </Grid>

                {/* Birth Information */}
                <Grid item xs={12} mt={1}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color="#546e7a"
                    mb={1.5}
                    style={urbanistBoldText}
                  >
                    Birth Details
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(newValue) => {
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      if (newValue && newValue <= today) {
                        setFormData((prev) => ({
                          ...prev,
                          dateOfBirth: newValue,
                        }));
                        setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                      } else if (newValue && newValue > today) {
                        setErrors((prev) => ({
                          ...prev,
                          dateOfBirth: "Date of Birth cannot be in the future",
                        }));
                        setFormData((prev) => ({
                          ...prev,
                          dateOfBirth: null,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          dateOfBirth: null,
                        }));
                        setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                      }
                    }}
                    disabled={isViewMode}
                    maxDate={new Date()}
                    slotProps={{ textField: dateOfBirthTextFieldProps }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TimePicker
                    label="Time of Birth"
                    value={formData.timeOfBirth}
                    onChange={handleTimeChange}
                    disabled={isViewMode}
                    views={["hours", "minutes"]}
                    ampm={false}
                    format="HH:mm"
                    slotProps={{
                      actionBar: {
                        actions: [], // From your previous request to remove "OK" button
                      },
                      popper: {
                        placement: "top", // Force the dialog/popover to open above the input
                      },
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.timeOfBirth,
                        helperText: errors.timeOfBirth || "",
                        InputLabelProps: {
                          sx: {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: "#455a64",
                            fontFamily: "Urbanist",
                          },
                        },
                        InputProps: {
                          sx: {
                            fontSize: "0.9rem",
                            borderRadius: "6px",
                            fontFamily: "Urbanist",
                          },
                        },
                        sx: {
                          "& .MuiInputLabel-root": {
                            fontFamily: "Urbanist",
                            fontSize: "0.9rem",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#cfd8dc" },
                            "&:hover fieldset": { borderColor: "#3f51b5" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3f51b5",
                            },
                          },
                          "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <PlaceAutocomplete
                    label="Place of Birth"
                    value={formData.placeOfBirth}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, placeOfBirth: val }));
                    }}
                    error={!!errors.placeOfBirth}
                    helperText={errors.placeOfBirth}
                    disabled={isViewMode}
                  />
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12} mt={1}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color="#546e7a"
                    mb={1.5}
                    style={urbanistBoldText}
                  >
                    Additional Details
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PlaceAutocomplete
                    label="Preferred Location"
                    value={formData.preferredLocation}
                    onChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        preferredLocation: val,
                      }));
                    }}
                    error={!!errors.preferredLocation}
                    helperText={errors.preferredLocation}
                    disabled={isViewMode}
                  />
                </Grid>

                {loadingRasiNakshatram && (
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="primary"
                      display="flex"
                      alignItems="center"
                      style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                    >
                      <CircularProgress size={14} sx={{ mr: 1 }} />
                      Fetching rashi & nakshatra based on your input...
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl
                    fullWidth
                    error={!!errors.rashi}
                    disabled={isViewMode}
                    size="small"
                  >
                    <InputLabel
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                      }}
                      style={{ fontFamily: "Urbanist" }}
                    >
                      Rashi
                    </InputLabel>
                    <Select
                      value={formData.rashi}
                      onChange={handleChange("rashi")}
                      label="Rashi"
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
                      {rasiOptions.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          style={{ fontFamily: "Urbanist" }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.rashi && (
                      <FormHelperText sx={{ fontSize: "0.75rem" }}>
                        {errors.rashi}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl
                    fullWidth
                    error={!!errors.nakshatra}
                    disabled={isViewMode}
                    size="small"
                  >
                    <InputLabel
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                      }}
                      style={{ fontFamily: "Urbanist" }}
                    >
                      Nakshatra
                    </InputLabel>
                    <Select
                      value={formData.nakshatra}
                      onChange={handleChange("nakshatra")}
                      label="Nakshatra"
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
                      {availableNakshatrams.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          style={{ fontFamily: "Urbanist" }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.nakshatra && (
                      <FormHelperText sx={{ fontSize: "0.75rem" }}>
                        {errors.nakshatra}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth disabled={isViewMode} size="small">
                    <InputLabel
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#455a64",
                      }}
                      style={{ fontFamily: "Urbanist" }}
                    >
                      User Type
                    </InputLabel>
                    <Select
                      value={formData.user_type}
                      onChange={handleChange("user_type")}
                      label="User Type"
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
                      {userTypeOptions.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          style={{ fontFamily: "Urbanist" }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                      onChange={handleChange("status")}
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
                      <MenuItem
                        value="Active"
                        style={{ fontFamily: "Urbanist" }}
                      >
                        Active
                      </MenuItem>
                      <MenuItem
                        value="Inactive"
                        style={{ fontFamily: "Urbanist" }}
                      >
                        Inactive
                      </MenuItem>
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
                            background:
                              "linear-gradient(135deg, #388E3C 0%, #004D40 100%)",
                            boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        {mode === "new" ? "Create User" : "Update User"}
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
        </LocalizationProvider>
      )}
    </>
  );
};

export default NewUser;
