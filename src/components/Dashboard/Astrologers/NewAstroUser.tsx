// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Grid,
//   TextField,
//   Typography,
//   Paper,
//   IconButton,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Avatar,
//   Tooltip,
//   Checkbox,
//   ListItemText,
//   FormHelperText,
//   SelectChangeEvent,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate, useParams } from "react-router-dom";
// import { callAPI } from "../../../api/crudFactory";
// import { styled } from "@mui/system";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import CustomSnackbar from "../../Elements/CustomSnackbar";

// // Input styling for file upload
// const Input = styled("input")({
//   display: "none",
// });

// // Define props and types
// type Mode = "new" | "edit" | "view";

// interface AstroFormData {
//   first_name: string;
//   last_name: string;
//   email: string;
//   mobile_number: string;
//   status: string;
//   astrologer_profile_info: string;
//   experience: string;
//   local_consulting_fee: string;
//   picture: File | string | null;
//   languages: string[];
//   expertises: string[];
//   user_id: number | null;
// }

// interface DropdownAstrologer {
//   first_name: string;
//   last_name: string | null;
//   email: string;
//   mobile_number: string | null;
//   user_id: number;
// }

// interface Props {
//   mode: Mode;
// }

// const NewAstroUser: React.FC<Props> = ({ mode }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams<{ userId: string }>();
//   const isViewMode = mode === "view";

//   const [formData, setFormData] = useState<AstroFormData>({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile_number: "",
//     status: "Active",
//     astrologer_profile_info: "",
//     experience: "",
//     local_consulting_fee: "",
//     picture: null,
//     languages: [],
//     expertises: [],
//     user_id: null,
//   });

//   const [inputLang, setInputLang] = useState<string>("");
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof AstroFormData, string>>
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
//   const [astrologers, setAstrologers] = useState<DropdownAstrologer[]>([]);

//   // Fetch dropdown astrologers on mount
//   useEffect(() => {
//     const fetchAstrologers = async () => {
//       try {
//         const response = await callAPI({
//           endpoint: "api/admin/dropdown/astrologers",
//           method: "get",
//         });
//         setAstrologers(response.data);
//       } catch (err) {
//         console.error("Failed to fetch astrologers:", err);
//         setSnackbar({
//           open: true,
//           message: "Failed to load astrologer list.",
//           severity: "error",
//         });
//       }
//     };
//     fetchAstrologers();
//   }, []);

//   // Fetch astrologer data in edit/view mode
//   useEffect(() => {
//     if (mode === "edit" || mode === "view") {
//       const fetchAstrologer = async () => {
//         try {
//           const response = await callAPI({
//             endpoint: `api/admin/astrologers/${userId}`,
//             method: "get",
//           });
//           const data = response.data;
//           console.log(data, "data");
//           setFormData({
//             first_name: data.user.first_name || "",
//             last_name: data.user.last_name || "",
//             email: data.user.email || "",
//             mobile_number: data.user.mobile_number || "",
//             status: data.status === "inactive" ? "Inactive" : "Active",
//             astrologer_profile_info: data.astrologer_profile_info || "",
//             experience: data.experience || "",
//             local_consulting_fee: data.local_consulting_fee.toString() || "",
//             picture: data.picture || null,
//             languages: data.languages || [],
//             expertises: data.expertises.map((item:any) => item.toLowerCase()) || [],
//             user_id: data.user_id || null,
//           });
//         } catch (err) {
//           console.error("Failed to fetch astrologer data:", err);
//           setSnackbar({
//             open: true,
//             message: "Failed to load astrologer data.",
//             severity: "error",
//           });
//         }
//       };
//       fetchAstrologer();
//     }
//   }, [mode, userId]);

//   // Format local_consulting_fee for display with commas
//   const formatNumberWithCommas = (value: string): string => {
//     if (!value) return "";
//     const number = value.replace(/[^0-9]/g, "");
//     return Number(number).toLocaleString("en-IN");
//   };

//   // Remove commas for API submission
//   const removeCommas = (value: string): string => {
//     return value.replace(/,/g, "");
//   };

//   // Field-specific validation function
//   const validateField = (field: keyof AstroFormData, value: any) => {
//     let error = "";

//     // In edit mode, only validate first_name, last_name, email, and mobile_number
//     if (
//       mode === "edit" &&
//       !["first_name", "last_name", "email", "mobile_number"].includes(field)
//     ) {
//       return error;
//     }

//     switch (field) {
//       case "first_name":
//       case "last_name":
//       case "experience":
//       case "local_consulting_fee":
//       case "status":
//       case "astrologer_profile_info":
//         if (!value) {
//           error = "This field is required";
//         }
//         break;
//       case "email":
//         if (!value) {
//           error = "This field is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           error = "Please enter a valid email address";
//         }
//         break;
//       case "mobile_number":
//         if (!value) {
//           error = "This field is required";
//         } else if (!/^\d{10}$/.test(value)) {
//           error = "Please enter a valid 10-digit mobile number";
//         }
//         break;
//       case "languages":
//         if (!value.length) {
//           error = "At least one language is required";
//         }
//         break;
//       case "expertises":
//         if (!value.length) {
//           error = "At least one expertise is required";
//         }
//         break;
//       case "user_id":
//         if (mode === "new" && value === null) {
//           error = "Please select an astrologer user";
//         }
//         break;
//       default:
//         break;
//     }

//     return error;
//   };

//   // Validate all mandatory fields on form submission
//   const validate = (): boolean => {
//     const newErrors: Partial<Record<keyof AstroFormData, string>> = {};

//     const fieldsToValidate: (keyof AstroFormData)[] =
//       mode === "edit"
//         ? ["first_name", "last_name", "email", "mobile_number"]
//         : [
//             // "first_name",
//             // "last_name",
//             // "email",
//             // "mobile_number",
//             "experience",
//             "local_consulting_fee",
//             "status",
//             // "astrologer_profile_info",
//             "languages",
//             "expertises",
//             "user_id",
//           ];

//     fieldsToValidate.forEach((field) => {
//       const error = validateField(field, formData[field]);
//       if (error) {
//         newErrors[field] = error;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange =
//     (field: keyof AstroFormData) =>
//     (
//       e:
//         | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//         | SelectChangeEvent<string | string[]>
//     ) => {
//       const value = e.target.value;

//       if (field === "local_consulting_fee") {
//         const rawValue = value.toString().replace(/[^0-9]/g, "");
//         setFormData((prev) => ({
//           ...prev,
//           [field]: rawValue,
//         }));
//       } else if (field === "picture") {
//         const files = (e.target as HTMLInputElement).files;
//         if (files && files[0]) {
//           setFormData((prev) => ({
//             ...prev,
//             [field]: files[0],
//           }));
//         }
//       } else if (field === "user_id" && mode === "new") {
//         const selectedUserId = Number(value);
//         const selectedAstrologer = astrologers.find(
//           (astrologer) => astrologer.user_id === selectedUserId
//         );
//         if (selectedAstrologer) {
//           setFormData((prev) => ({
//             ...prev,
//             user_id: selectedUserId,
//             first_name: selectedAstrologer.first_name ?? "",
//             last_name: selectedAstrologer.last_name ?? "",
//             email: selectedAstrologer.email ?? "",
//             mobile_number: selectedAstrologer.mobile_number ?? "",
//           }));
//         }
//       } else if (field === "expertises") {
//         setFormData((prev) => ({
//           ...prev,
//           [field]: value as string[],
//         }));
//         // Validate expertises on change
//         const error = validateField("expertises", value);
//         setErrors((prev) => ({ ...prev, expertises: error }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           [field]: value as string,
//         }));
//       }

//       // Clear error for the field when the user starts typing
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     };

//   // Handle blur to validate mandatory fields
//   const handleBlur =
//     (field: keyof AstroFormData) =>
//     (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       const value = event.target.value;
//       const error = validateField(field, value);
//       if (error) {
//         setErrors((prev) => ({ ...prev, [field]: error }));
//       }
//     };

//   const handleTagAdd =
//     (field: "languages" | "expertises") =>
//     (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === "Enter") {
//         e.preventDefault();
//         if (!e.target) return; // Add null check for e.target
//         const value = (e.target as HTMLInputElement).value.trim();
//         if (!value) return;

//         if (!formData[field].includes(value)) {
//           const updatedValues = [...formData[field], value];
//           setFormData((prev) => ({
//             ...prev,
//             [field]: updatedValues,
//           }));
//           // Validate languages on add
//           const error = validateField(field, updatedValues);
//           setErrors((prev) => ({ ...prev, [field]: error }));
//         }

//         setInputLang("");
//       }
//     };

//   const handleTagDelete =
//     (type: "languages" | "expertises", index: number) => () => {
//       const updated = [...formData[type]];
//       updated.splice(index, 1);
//       setFormData((prev) => ({
//         ...prev,
//         [type]: updated,
//       }));
//       // Validate languages or expertises on delete
//       const error = validateField(type, updated);
//       setErrors((prev) => ({ ...prev, [type]: error }));
//     };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validate()) return;

//     try {
//       const payload = new FormData();

//       // Append string/number fields
//       payload.append("first_name", formData.first_name);
//       payload.append("last_name", formData.last_name);
//       payload.append("email", formData.email);
//       payload.append("mobile_number", formData.mobile_number);
//       payload.append("status", formData.status);
//       if (formData.user_id !== null) {
//         payload.append("user_id", formData.user_id.toString());
//       }
//       payload.append(
//         "astrologer_profile_info",
//         formData.astrologer_profile_info
//       );
//       payload.append("experience", formData.experience);
//       payload.append("local_consulting_fee", removeCommas(formData.local_consulting_fee));

//       // Append array fields (languages and expertises)
//       formData.languages.forEach((lang) => payload.append("languages[]", lang));
//       formData.expertises.forEach((exp) => payload.append("expertises[]", exp));

//       // Append file field (picture)
//       if (formData.picture instanceof File) {
//         payload.append("picture", formData.picture);
//       }

//       await callAPI({
//         endpoint:
//           mode === "edit"
//             ? `api/admin/astrologers/${userId}`
//             : "api/admin/astrologers",
//         method: mode === "edit" ? "put" : "post",
//         data: payload,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setSnackbar({
//         open: true,
//         message:
//           mode === "edit"
//             ? "Astrologer updated successfully!"
//             : "Astrologer created successfully!",
//         severity: "success",
//       });

//       navigate(-1);
//     } catch (err: any) {
//       console.error("API Error:", err);
//       let errorMessage = "Something went wrong. Please try again.";
//       if (err.response && err.response.data) {
//         errorMessage =
//           err.response.data.detail || JSON.stringify(err.response.data?.detail);
//       }
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: "error",
//       });
//     }
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
//           // color="#1a237e"
//           sx={{
//             maxWidth: "50%", // Prevent title from pushing buttons too far
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace: "nowrap",
//             fontWeight: 600, // Bolder font for emphasis
//             fontFamily: '"Poppins", sans-serif', // Modern font family
//             letterSpacing: 0.5, // Slight spacing for readability
//             textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
//           }}
//         >
//           {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} Astro
//           User
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {/* Profile Picture Section */}
//             <Grid item xs={12} sx={{ textAlign: "center", mb: 1 }}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//               >
//                 Profile Picture
//               </Typography>
//               <Box sx={{ position: "relative", display: "inline-block" }}>
//                 <Avatar
//                   src={
//                     formData.picture instanceof File
//                       ? URL.createObjectURL(formData.picture)
//                       : typeof formData.picture === "string" && formData.picture
//                       ? formData.picture
//                       : "https://img.freepik.com/free-photo/3d-cartoon-portrait-person-practicing-law-related-profession_23-2151419548.jpg?semt=ais_hybrid&w=740"
//                   }
//                   alt="Astrologer"
//                   sx={{
//                     width: 90,
//                     height: 90,
//                     mx: "auto",
//                     mb: 1,
//                     border: errors.picture
//                       ? "2px solid #e57373"
//                       : "2px solid #e0e0e0",
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                     transition: "transform 0.2s ease",
//                     "&:hover": { transform: "scale(1.05)" },
//                   }}
//                 />
//                 {!isViewMode && (
//                   <label htmlFor="icon-button-file">
//                     <Input
//                       accept="image/*"
//                       id="icon-button-file"
//                       type="file"
//                       onChange={handleChange("picture")}
//                     />
//                     <Tooltip title="Upload Profile Picture">
//                       <IconButton
//                         color="primary"
//                         aria-label="upload picture"
//                         component="span"
//                         sx={{
//                           position: "absolute",
//                           bottom: 0,
//                           right: -5,
//                           bgcolor: "#06402B",
//                           color: "#fff",
//                           borderRadius: "50%",
//                           boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
//                           p: 0.8,
//                           "&:hover": { bgcolor: "#90EE90" },
//                         }}
//                       >
//                         <PhotoCamera sx={{ fontSize: 20 }} />
//                       </IconButton>
//                     </Tooltip>
//                   </label>
//                 )}
//               </Box>
//               {errors.picture && (
//                 <Typography variant="caption" color="error" mt={0.5}>
//                   {errors.picture}
//                 </Typography>
//               )}
//             </Grid>

//             {/* Personal Information */}
//             <Grid item xs={12}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//               >
//                 Personal Information
//               </Typography>
//             </Grid>

//             {/* Astrologer User Dropdown */}
//             {mode !== "edit" && (
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth size="small" error={!!errors.user_id}>
//                   <InputLabel
//                     sx={{
//                       fontSize: "0.95rem",
//                       fontWeight: 500,
//                       color: "#455a64",
//                     }}
//                   >
//                     Astrologer User *
//                   </InputLabel>
//                   <Select
//                     value={
//                       formData.user_id !== null
//                         ? formData.user_id.toString()
//                         : ""
//                     }
//                     onChange={handleChange("user_id")}
//                     onBlur={() => {
//                       const error = validateField("user_id", formData.user_id);
//                       if (error) {
//                         setErrors((prev) => ({ ...prev, user_id: error }));
//                       }
//                     }}
//                     label="Astrologer User"
//                     disabled={isViewMode}
//                     sx={{
//                       fontSize: "0.9rem",
//                       borderRadius: "6px",
//                       "& .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#cfd8dc",
//                       },
//                       "&:hover .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#3f51b5",
//                       },
//                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "#3f51b5",
//                       },
//                     }}
//                   >
//                     {astrologers.map((astrologer) => (
//                       <MenuItem
//                         key={astrologer.user_id}
//                         value={astrologer.user_id.toString()}
//                       >
//                         {`${astrologer.first_name} (${astrologer.email})`}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {errors.user_id && (
//                     <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                       {errors.user_id}
//                     </FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//             )}

//             {/* Personal info fields */}
//             {(
//               [
//                 "first_name",
//                 "last_name",
//                 "email",
//                 "mobile_number",
//               ] as (keyof AstroFormData)[]
//             ).map((key) => (
//               <Grid item xs={12} sm={6} key={key}>
//                 <TextField
//                   label={key
//                     .replace(/_/g, " ")
//                     .replace(/\b\w/g, (l) => l.toUpperCase())}
//                   fullWidth
//                   size="small"
//                   value={formData[key]}
//                   onChange={handleChange(key)}
//                   onBlur={handleBlur(key)} // Add onBlur for validation
//                   error={!!errors[key]}
//                   helperText={errors[key] || ""}
//                   disabled={
//                     isViewMode ||
//                     (mode === "new" &&
//                       (key === "first_name" ||
//                         key === "last_name" ||
//                         key === "email" ||
//                         key === "mobile_number"))
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       fontWeight: 500,
//                       color: "#455a64",
//                     },
//                   }}
//                   InputProps={{
//                     sx: { fontSize: "0.9rem", borderRadius: "6px" },
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "& fieldset": { borderColor: "#cfd8dc" },
//                       "&:hover fieldset": { borderColor: "#3f51b5" },
//                       "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//                     },
//                     "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//                   }}
//                 />
//               </Grid>
//             ))}

//             {/* Professional Information */}
//             <Grid item xs={12} mt={1}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight={500}
//                 color="#546e7a"
//                 mb={1.5}
//               >
//                 Professional Details
//               </Typography>
//             </Grid>

//             {/* Professional fields */}
//             {(
//               [
//                 "astrologer_profile_info",
//                 "experience",
//                 "local_consulting_fee",
//               ] as (keyof AstroFormData)[]
//             ).map((key) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={key === "astrologer_profile_info" ? 12 : 6}
//                 key={key}
//               >
//                 <TextField
//                   label={`${key
//                     .replace(/_/g, " ")
//                     .replace(/\b\w/g, (l) => l.toUpperCase())} ${key!=="astrologer_profile_info" ? "*" : ""}`} // Add asterisk to label
//                   fullWidth
//                   size="small"
//                   value={
//                     key === "local_consulting_fee"
//                       ? formatNumberWithCommas(formData.local_consulting_fee)
//                       : formData[key]
//                   }
//                   onChange={handleChange(key)}
//                   onBlur={handleBlur(key)}
//                   error={!!errors[key]}
//                   helperText={errors[key] || ""}
//                   disabled={isViewMode}
//                   multiline={key === "astrologer_profile_info"}
//                   minRows={key === "astrologer_profile_info" ? 3 : undefined}
//                   InputLabelProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       fontWeight: 500,
//                       color: "#455a64",
//                     },
//                   }}
//                   InputProps={{
//                     sx: { fontSize: "0.9rem", borderRadius: "6px" },
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "& fieldset": { borderColor: "#cfd8dc" },
//                       "&:hover fieldset": { borderColor: "#3f51b5" },
//                       "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
//                     },
//                     "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
//                   }}
//                 />
//               </Grid>
//             ))}

//             {/* Expertise as Dropdown */}
//             <Grid item xs={12}>
//               <FormControl fullWidth size="small" error={!!errors.expertises}>
//                 <InputLabel
//                   sx={{
//                     fontSize: "0.95rem",
//                     fontWeight: 500,
//                     color: "#455a64",
//                   }}
//                 >
//                   Expertise Areas *
//                 </InputLabel>
//                 <Select
//                   multiple
//                   value={formData.expertises}
//                   onChange={handleChange("expertises")}
//                   label="Expertise Areas"
//                   disabled={isViewMode}
//                   renderValue={(selected) => selected.join(", ")}
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
//                   {["Career", "Health", "Wealth", "Relationship"].map(
//                     (option) => (
//                       <MenuItem key={option} value={option.toLowerCase()}>
//                         <Checkbox
//                           checked={formData.expertises.includes(option.toLowerCase())}
//                         />
//                         <ListItemText
//                           primary={option}
//                           sx={{
//                             "& .MuiTypography-root": { fontSize: "0.9rem" },
//                           }}
//                         />
//                       </MenuItem>
//                     )
//                   )}
//                 </Select>
//                 {!!errors.expertises && (
//                   <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                     {errors.expertises}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>

//             {/* Languages as Tags */}
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Add Language *"
//                 value={inputLang}
//                 onChange={(e) => setInputLang(e.target.value)}
//                 onKeyDown={handleTagAdd("languages")}
//                 disabled={isViewMode}
//                 error={!!errors.languages}
//                 helperText={errors.languages || "Press Enter to add language"}
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
//               <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
//                 {formData.languages.map((item, index) => (
//                   <Chip
//                     key={index}
//                     label={item}
//                     size="small"
//                     onDelete={
//                       !isViewMode
//                         ? handleTagDelete("languages", index)
//                         : undefined
//                     }
//                     sx={{
//                       fontSize: "0.85rem",
//                       backgroundColor: "#e8eaf6",
//                       color: "#3f51b5",
//                       "&:hover": { backgroundColor: "#c5cae9" },
//                       borderRadius: "16px",
//                       transition: "background-color 0.2s ease",
//                     }}
//                   />
//                 ))}
//               </Box>
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
//                   onChange={handleChange("status")}
//                   onBlur={() => {
//                     const error = validateField("status", formData.status);
//                     if (error) {
//                       setErrors((prev) => ({ ...prev, status: error }));
//                     }
//                   }}
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
//                 {errors.status && (
//                   <FormHelperText sx={{ fontSize: "0.75rem" }}>
//                     {errors.status}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>

//             {/* Submit Button */}
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
//                     {mode === "new" ? "Create Astrologer" : "Update Astrologer"}
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

// export default NewAstroUser;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Checkbox,
  ListItemText,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";
import { styled } from "@mui/system";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CustomSnackbar from "../../Elements/CustomSnackbar";
import { Star } from "@mui/icons-material";

// Input styling for file upload
const Input = styled("input")({
  display: "none",
});

// Define props and types
type Mode = "new" | "edit" | "view";

interface AstroFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  status: string;
  astrologer_profile_info: string;
  experience: string;
  local_consulting_fee: string;
  foreign_consulting_fee: string;
  picture: File | string | null;
  languages: string[];
  expertise: string[];
  user_id: number | null;
}

interface DropdownAstrologer {
  first_name: string;
  last_name: string | null;
  email: string;
  mobile_number: string | null;
  user_id: number;
}

interface Props {
  mode: Mode;
}

const NewAstroUser: React.FC<Props> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isViewMode = mode === "view";
  const urbanistBoldText = {
    fontFamily: "Urbanist",
    fontWeight: 600,
  };

  const [formData, setFormData] = useState<AstroFormData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    status: "Active",
    astrologer_profile_info: "",
    experience: "",
    local_consulting_fee: "",
    foreign_consulting_fee: "",
    picture: null,
    languages: [],
    expertise: [],
    user_id: null,
  });

  const [inputLang, setInputLang] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof AstroFormData, string>>
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
  const [astrologers, setAstrologers] = useState<DropdownAstrologer[]>([]);

  // Fetch dropdown astrologers on mount
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await callAPI({
          endpoint: "api/admin/dropdown/astrologers",
          method: "get",
        });
        setAstrologers(response.data);
      } catch (err) {
        console.error("Failed to fetch astrologers:", err);
        setSnackbar({
          open: true,
          message: "Failed to load astrologer list.",
          severity: "error",
        });
      }
    };
    fetchAstrologers();
  }, []);

  // Fetch astrologer data in edit/view mode
  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      const fetchAstrologer = async () => {
        try {
          const response = await callAPI({
            endpoint: `api/admin/astrologers/${userId}`,
            method: "get",
          });
          const data = response.data;
          setFormData({
            first_name: data.user.first_name || "",
            last_name: data.user.last_name || "",
            email: data.user.email || "",
            mobile_number: data.user.mobile_number || "",
            status: data.status === "inactive" ? "Inactive" : "Active",
            astrologer_profile_info: data.astrologer_profile_info || "",
            experience: data.experience || "",
            local_consulting_fee: data.local_consulting_fee?.toString() || "",
            foreign_consulting_fee:
              data.foreign_consulting_fee?.toString() || "",
            picture: data.picture || null,
            languages: data.languages || [],
            expertise:
              data.expertise.map((item: any) => item.toLowerCase()) || [],
            user_id: data.user_id || null,
          });
        } catch (err) {
          console.error("Failed to fetch astrologer data:", err);
          setSnackbar({
            open: true,
            message: "Failed to load astrologer data.",
            severity: "error",
          });
        }
      };
      fetchAstrologer();
    }
  }, [mode, userId]);

  // Format number with commas and decimals for display
  const formatNumberWithCommas = (value: string): string => {
    if (!value) return "";
    // Remove any existing commas to avoid duplication
    const cleanValue = value.replace(/,/g, "");
    const [integerPart, decimalPart] = cleanValue.split(".");
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Include decimal part if present, up to two places
    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart.slice(0, 2)}`
      : formattedInteger;
  };

  const handleAddLanguage = (newLang: string) => {
    const trimmedLower = newLang.trim().toLowerCase();
  
    // Avoid adding duplicates
    if (
      !formData.languages
        .map((lang) => lang.trim().toLowerCase())
        .includes(trimmedLower)
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLang.trim()],
      }));
    }
  };  

  // Field-specific validation function
  const validateField = (field: keyof AstroFormData, value: any) => {
    let error = "";

    // In edit mode, only validate first_name, last_name, email, and mobile_number
    if (
      mode === "edit" &&
      !["first_name", "last_name", "email", "mobile_number"].includes(field)
    ) {
      return error;
    }

    switch (field) {
      case "first_name":
      case "last_name":
      case "experience":
      case "local_consulting_fee":
      case "foreign_consulting_fee":
      case "status":
      case "astrologer_profile_info":
        if (!value) {
          error = "This field is required";
        } else if (
          field === "local_consulting_fee" ||
          field === "foreign_consulting_fee"
        ) {
          // Remove commas for validation
          const rawValue = value.replace(/,/g, "").trim();
          if (
            !/^\d+(\.\d{0,2})?$/.test(rawValue) ||
            parseFloat(rawValue) <= 0
          ) {
            error =
              "Enter a positive number like 1000.23 or 1,000.23 (up to 2 decimal places)";
          }
        }
        break;
      case "email":
        if (!value) {
          error = "This field is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "mobile_number":
        if (!value) {
          error = "This field is required";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Please enter a valid 10-digit mobile number";
        }
        break;
      case "languages":
          if (!Array.isArray(value) || value.length === 0) {
            error = "At least one language is required";
          } else {
            const trimmedLowerCased = value.map((v: string) => v.trim().toLowerCase());
            console.log(trimmedLowerCased, "trimmedLowerCased")
            const hasDuplicates = new Set(trimmedLowerCased).size !== trimmedLowerCased.length;
            console.log(hasDuplicates, "hasDuplicates")
            if (hasDuplicates) {
              error = "Languages must not contain duplicates";
            }
          }
          break;        
      case "expertise":
        if (!value.length) {
          error = "At least one expertise is required";
        }
        break;
      case "user_id":
        if (mode === "new" && value === null) {
          error = "Please select an astrologer user";
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Validate all mandatory fields on form submission
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AstroFormData, string>> = {};

    const fieldsToValidate: (keyof AstroFormData)[] = [
      "first_name",
      "last_name",
      "email",
      "mobile_number",
      ...(mode === "new"
        ? ([
            "experience",
            "local_consulting_fee",
            "foreign_consulting_fee",
            "status",
            "languages",
            "expertise",
            "user_id",
          ] as (keyof AstroFormData)[])
        : (["languages", "expertise"] as (keyof AstroFormData)[])),
    ];   

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof AstroFormData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | string[]>
    ) => {
      let value: any = e.target.value;

      if (
        field === "local_consulting_fee" ||
        field === "foreign_consulting_fee"
      ) {
        // Remove existing commas to handle raw input
        value = value.replace(/,/g, "");
        // Allow digits and one decimal point
        value = value.replace(/[^0-9.]/g, "");
        const parts = value.split(".");
        if (parts.length > 2) {
          value = `${parts[0]}.${parts[1]}`;
        }
        // Limit decimal to two places
        if (parts[1] && parts[1].length > 2) {
          value = `${parts[0]}.${parts[1].slice(0, 2)}`;
        }
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      } else if (field === "picture") {
        const files = (e.target as HTMLInputElement).files;
        if (files && files[0]) {
          setFormData((prev) => ({
            ...prev,
            [field]: files[0],
          }));
        }
      } else if (field === "user_id" && mode === "new") {
        const selectedUserId = Number(value);
        const selectedAstrologer = astrologers.find(
          (astrologer) => astrologer.user_id === selectedUserId
        );
        if (selectedAstrologer) {
          setFormData((prev) => ({
            ...prev,
            user_id: selectedUserId,
            first_name: selectedAstrologer.first_name ?? "",
            last_name: selectedAstrologer.last_name ?? "",
            email: selectedAstrologer.email ?? "",
            mobile_number: selectedAstrologer.mobile_number ?? "",
          }));
        }
      } else if (field === "expertise") {
        setFormData((prev) => ({
          ...prev,
          [field]: value as string[],
        }));
        const error = validateField("expertise", value);
        setErrors((prev) => ({ ...prev, expertise: error }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value as string,
        }));
      }

      // Clear error on change
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleBlur =
    (field: keyof AstroFormData) =>
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log(event);
      const value = formData[field]; // Use raw value from formData
      const error = validateField(field, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    };

    const handleTagAdd = (field: "languages" | "expertise") => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputLang.trim()) {
        e.preventDefault();
        const normalizedValue = inputLang.trim().toLowerCase();
    
        const existingValues = formData[field].map((v) => v.trim().toLowerCase());
    
        if (existingValues.includes(normalizedValue)) {
          setErrors((prev) => ({
            ...prev,
            [field]: `${field === "languages" ? "Language" : "Expertise"} already added`,
          }));
          return;
        }
    
        const updatedTags = [...formData[field], inputLang.trim()];
    
        setFormData((prev) => ({
          ...prev,
          [field]: updatedTags,
        }));
    
        setInputLang("");
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };    

  const handleTagDelete =
    (type: "languages" | "expertise", index: number) => () => {
      const updated = [...formData[type]];
      updated.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        [type]: updated,
      }));
      const error = validateField(type, updated);
      setErrors((prev) => ({ ...prev, [type]: error }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const payload = new FormData();

      payload.append("first_name", formData.first_name);
      payload.append("last_name", formData.last_name);
      payload.append("email", formData.email);
      payload.append("mobile_number", formData.mobile_number);
      payload.append("status", formData.status);
      if (formData.user_id !== null) {
        payload.append("user_id", formData.user_id.toString());
      }
      payload.append("experience", formData.experience);
      payload.append("local_consulting_fee", formData.local_consulting_fee);
      payload.append("foreign_consulting_fee", formData.foreign_consulting_fee);

      formData.languages.forEach((lang) => payload.append("languages[]", lang));
      formData.expertise.forEach((exp) => payload.append("expertise[]", exp));

      if (formData.picture instanceof File) {
        payload.append("picture", formData.picture);
      }

      await callAPI({
        endpoint:
          mode === "edit"
            ? `api/admin/astrologers/${userId}`
            : "api/admin/astrologers",
        method: mode === "edit" ? "put" : "post",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        open: true,
        message:
          mode === "edit"
            ? "Astrologer updated successfully!"
            : "Astrologer created successfully!",
        severity: "success",
      });

      navigate(-1);
    } catch (err: any) {
      console.error("API Error:", err);
      let errorMessage = "Something went wrong. Please try again.";
      if (err.response && err.response.data) {
        errorMessage =
          err.response.data.detail || JSON.stringify(err.response.data?.detail);
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
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
          <Star sx={{ fontSize: 24 }} /> {/* Add the Star icon */}
          {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} Astro
          User
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Profile Picture Section */}
            <Grid item xs={12} sx={{ textAlign: "center", mb: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
                style={urbanistBoldText}
              >
                Profile Picture
              </Typography>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={
                    formData.picture instanceof File
                      ? URL.createObjectURL(formData.picture)
                      : typeof formData.picture === "string" && formData.picture
                      ? formData.picture
                      : "https://img.freepik.com/free-photo/3d-cartoon-portrait-person-practicing-law-related-profession_23-2151419548.jpg?semt=ais_hybrid&w=740"
                  }
                  alt="Astrologer"
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 1,
                    border: errors.picture
                      ? "2px solid #e57373"
                      : "2px solid #e0e0e0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
                {!isViewMode && (
                  <label htmlFor="icon-button-file">
                    <Input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      onChange={handleChange("picture")}
                    />
                    <Tooltip title="Upload Profile Picture">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: -5,
                          bgcolor: "#06402B",
                          color: "#fff",
                          borderRadius: "50%",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                          p: 0.8,
                          "&:hover": { bgcolor: "#90EE90" },
                        }}
                      >
                        <PhotoCamera sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </label>
                )}
              </Box>
              {errors.picture && (
                <Typography variant="caption" color="error" mt={0.5}>
                  {errors.picture}
                </Typography>
              )}
            </Grid>

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

            {/* Astrologer User Dropdown */}
            {mode !== "edit" && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={!!errors.user_id}>
                  <InputLabel
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                    }}
                  >
                    Astrologer User *
                  </InputLabel>
                  <Select
                    value={
                      formData.user_id !== null
                        ? formData.user_id.toString()
                        : ""
                    }
                    onChange={handleChange("user_id")}
                    onBlur={() => {
                      const error = validateField("user_id", formData.user_id);
                      if (error) {
                        setErrors((prev) => ({ ...prev, user_id: error }));
                      }
                    }}
                    label="Astrologer User"
                    disabled={isViewMode}
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
                    {astrologers.map((astrologer) => (
                      <MenuItem
                        key={astrologer.user_id}
                        value={astrologer.user_id.toString()}
                        style={{ fontFamily: "Urbanist" }}
                      >
                        {`${astrologer.first_name} (${astrologer.email})`}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.user_id && (
                    <FormHelperText sx={{ fontSize: "0.75rem" }}>
                      {errors.user_id}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            {/* Personal info fields */}
            {(
              [
                "first_name",
                "last_name",
                "email",
                "mobile_number",
              ] as (keyof AstroFormData)[]
            ).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  fullWidth
                  size="small"
                  value={formData[key]}
                  onChange={handleChange(key)}
                  onBlur={handleBlur(key)}
                  error={!!errors[key]}
                  helperText={errors[key] || ""}
                  disabled={
                    isViewMode ||
                    (mode === "new" &&
                      (key === "first_name" ||
                        key === "last_name" ||
                        key === "email" ||
                        key === "mobile_number"))
                  }
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
            ))}

            {/* Professional Information */}
            <Grid item xs={12} mt={1}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="#546e7a"
                mb={1.5}
                style={urbanistBoldText}
              >
                Professional Details
              </Typography>
            </Grid>

            {/* Astrologer Profile Info */}
            <Grid item xs={12}>
              <TextField
                label="Astrologer Profile Info"
                fullWidth
                size="small"
                value={formData.astrologer_profile_info}
                onChange={handleChange("astrologer_profile_info")}
                onBlur={handleBlur("astrologer_profile_info")}
                disabled={isViewMode}
                multiline
                minRows={3}
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

            {/* Expertise as Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth size="small" error={!!errors.expertise}>
                <InputLabel
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#455a64",
                    fontFamily: "Urbanist",
                  }}
                >
                  Expertise Areas *
                </InputLabel>
                <Select
                  multiple
                  value={formData.expertise}
                  onChange={handleChange("expertise")}
                  label="Expertise Areas"
                  disabled={isViewMode}
                  renderValue={(selected) => selected.join(", ")}
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
                  {["Career", "Health", "Wealth", "Relationship"].map(
                    (option) => (
                      <MenuItem
                        key={option}
                        value={option.toLowerCase()}
                        style={{ fontFamily: "Urbanist" }}
                      >
                        <Checkbox
                          checked={formData.expertise.includes(
                            option.toLowerCase()
                          )}
                        />
                        <ListItemText
                          primary={option}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: "0.9rem",
                              fontFamily: "Urbanist",
                            },
                          }}
                        />
                      </MenuItem>
                    )
                  )}
                </Select>
                {!!errors.expertise && (
                  <FormHelperText sx={{ fontSize: "0.75rem" }}>
                    {errors.expertise}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Languages as Tags */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Add Language *"
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                onKeyDown={handleTagAdd("languages")}
                disabled={isViewMode}
                error={!!errors.languages}
                helperText={errors.languages || "Press Enter to add language"}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    // color: "#455a64",
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
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.languages.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    size="small"
                    onDelete={
                      !isViewMode
                        ? handleTagDelete("languages", index)
                        : undefined
                    }
                    sx={{
                      fontFamily: "Urbanist",
                      fontSize: "0.85rem",
                      backgroundColor: "#e8eaf6",
                      color: "#3f51b5",
                      "&:hover": { backgroundColor: "#c5cae9" },
                      borderRadius: "16px",
                      transition: "background-color 0.2s ease",
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Experience, Local Consulting Fee, Foreign Consulting Fee, Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience *"
                fullWidth
                size="small"
                value={formData.experience}
                onChange={handleChange("experience")}
                onBlur={handleBlur("experience")}
                error={!!errors.experience}
                helperText={errors.experience || ""}
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
                label="Local Consulting Fee (INR)*"
                fullWidth
                size="small"
                value={
                  formData.local_consulting_fee
                    ? formatNumberWithCommas(formData.local_consulting_fee)
                    : ""
                }
                onChange={handleChange("local_consulting_fee")}
                onBlur={handleBlur("local_consulting_fee")}
                error={!!errors.local_consulting_fee}
                helperText={errors.local_consulting_fee || ""}
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
                label="Foreign Consulting Fee (USD)*"
                fullWidth
                size="small"
                value={
                  formData.foreign_consulting_fee
                    ? formatNumberWithCommas(formData.foreign_consulting_fee)
                    : ""
                }
                onChange={handleChange("foreign_consulting_fee")}
                onBlur={handleBlur("foreign_consulting_fee")}
                error={!!errors.foreign_consulting_fee}
                helperText={errors.foreign_consulting_fee || ""}
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
                  onBlur={() => {
                    const error = validateField("status", formData.status);
                    if (error) {
                      setErrors((prev) => ({ ...prev, status: error }));
                    }
                  }}
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
                {errors.status && (
                  <FormHelperText sx={{ fontSize: "0.75rem" }}>
                    {errors.status}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Submit Button */}
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
                      fontFamily: "Urbanist",
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
                    }}
                  >
                    {mode === "new" ? "Create Astrologer" : "Update Astrologer"}
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
  );
};

export default NewAstroUser;
