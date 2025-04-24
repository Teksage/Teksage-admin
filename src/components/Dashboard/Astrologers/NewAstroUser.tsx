// import React, { useState, FormEvent } from "react";
// import {
//   Box,
//   Button,
//   Grid,
//   TextField,
//   Typography,
//   Paper,
//   IconButton,
//   Rating,
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
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate, useParams } from "react-router-dom";
// import { callAPI } from "../../../api/crudFactory";
// import { styled } from "@mui/system";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// // Input styling
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
//   consulting_fee: string;
//   picture: File | string | null;
//   // customer_rating: number;
//   languages: string[];
//   expertises: string[];
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
//     consulting_fee: "",
//     picture: null,
//     // customer_rating: 0,
//     languages: [],
//     expertises: [],
//   });

//   const [inputLang, setInputLang] = useState<string>("");
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleChange = (field: keyof AstroFormData) => (e: any) => {
//     const value = e.target.value;

//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     // ✨ Clear the error if the new value is valid
//     if (field === "expertises" && value.length > 0) {
//       setErrors((prev) => ({ ...prev, expertises: "" }));
//     }
//   };

//   const handleTagAdd = (field) => (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const value = e.target.value.trim();
//       if (!value) return;

//       if (!formData[field].includes(value)) {
//         setFormData((prev) => ({
//           ...prev,
//           [field]: [...prev[field], value],
//         }));
//         setErrors((prev) => ({ ...prev, [field]: "" })); // clear error if added
//       }

//       setInputLang(""); // only for languages
//     }
//   };

//   const handleTagDelete =
//     (type: "languages" | "expertises", index: number) => () => {
//       setFormData((prev) => {
//         const updated = [...prev[type]];
//         updated.splice(index, 1);
//         return { ...prev, [type]: updated };
//       });
//     };

//   const validate = (): boolean => {
//     const newErrors: Record<string, string> = {};
//     const requiredFields: (keyof AstroFormData)[] = [
//       // "first_name",
//       // "last_name",
//       // "email",
//       // "mobile_number",
//       // "astrologer_profile_info",
//       "experience",
//       "consulting_fee",
//     ];
//     requiredFields.forEach((field) => {
//       if (!formData[field]) newErrors[field] = "This field is required";
//     });

//     if (!formData.languages.length)
//       newErrors.languages = "At least one language is required";
//     // if (!formData.picture) newErrors.picture = "Profile picture is required";

//     if (!formData.expertises.length) {
//       newErrors.expertises = "At least one expertise is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const payload = new FormData();
//     Object.keys(formData).forEach((key) => {
//       const val = formData[key as keyof AstroFormData];
//       if (Array.isArray(val)) {
//         val.forEach((v) => payload.append(`${key}[]`, v));
//       } else if (val !== null) {
//         payload.append(key, val as string | Blob);
//       }
//     });

//     await callAPI({
//       endpoint:
//         mode === "edit"
//           ? `api/admin/astrologers/${userId}`
//           : "api/admin/astrologers",
//       method: mode === "edit" ? "put" : "post",
//       formData: payload,
//     });
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
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
//           // maxWidth: "1000px",
//           mx: "auto",
//           backgroundColor: "#fafafa",
//           borderRadius: "12px",
//         }}
//       >
//         {/* Form title with consistent sizing */}
//         <Typography variant="h6" fontWeight={500} mb={2}>
//           {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} Astro
//           User
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {/* Profile Picture Section */}
//             <Grid item xs={12} sx={{ textAlign: "center", mb: 1 }}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Profile Picture
//               </Typography>
//               <Box sx={{ position: "relative", display: "inline-block" }}>
//                 <Avatar
//                   src={
//                     formData.picture
//                       ? typeof formData.picture === "string"
//                         ? formData.picture
//                         : URL.createObjectURL(formData.picture)
//                       : "https://res.cloudinary.com/cloudinary-marketing/images/w_2000,h_1100/f_auto,q_auto/v1647266871/Automated-Upload_Sharing/Automated-Upload_Sharing-png?_i=AA"
//                   }
//                   alt="Astrologer"
//                   sx={{
//                     width: 100,
//                     height: 100,
//                     mx: "auto",
//                     mb: 1,
//                     border: errors.picture ? "2px solid red" : "1px solid #ddd",
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
//                     <Tooltip title="Upload">
//                       <IconButton
//                         color="primary"
//                         aria-label="upload picture"
//                         component="span"
//                         size="small"
//                         sx={{
//                           position: "absolute",
//                           bottom: 0,
//                           right: -5,
//                           bgcolor: "#fff",
//                           borderRadius: "50%",
//                           boxShadow: 1,
//                           p: 0.5,
//                         }}
//                       >
//                         <PhotoCamera fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   </label>
//                 )}
//               </Box>
//               {errors.picture && (
//                 <Typography variant="caption" color="error">
//                   {errors.picture}
//                 </Typography>
//               )}
//             </Grid>

//             {/* Personal Information */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Personal Information
//               </Typography>
//             </Grid>

//             {/* Map through basic personal info fields */}
//             {["first_name", "last_name", "email", "mobile_number"].map(
//               (key) => (
//                 <Grid item xs={12} sm={6} key={key}>
//                   <TextField
//                     label={key
//                       .replace(/_/g, " ")
//                       .replace(/\b\w/g, (l) => l.toUpperCase())}
//                     fullWidth
//                     size="small"
//                     value={formData[key]}
//                     onChange={handleChange(key)}
//                     error={!!errors[key]}
//                     helperText={errors[key] || ""}
//                     disabled={isViewMode}
//                   />
//                 </Grid>
//               )
//             )}

//             {/* Professional Information */}
//             <Grid item xs={12} mt={1}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Professional Details
//               </Typography>
//             </Grid>

//             {/* Professional fields */}
//             {["astrologer_profile_info", "experience", "consulting_fee"].map(
//               (key) => (
//                 <Grid
//                   item
//                   xs={12}
//                   sm={key === "astrologer_profile_info" ? 12 : 6}
//                   key={key}
//                 >
//                   <TextField
//                     label={key
//                       .replace(/_/g, " ")
//                       .replace(/\b\w/g, (l) => l.toUpperCase())}
//                     fullWidth
//                     size="small"
//                     value={formData[key]}
//                     onChange={handleChange(key)}
//                     error={!!errors[key]}
//                     helperText={errors[key] || ""}
//                     disabled={isViewMode}
//                     multiline={key === "astrologer_profile_info"}
//                     minRows={key === "astrologer_profile_info" ? 4 : undefined}
//                   />
//                 </Grid>
//               )
//             )}

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth disabled={isViewMode} size="small">
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={formData.status}
//                   onChange={handleChange("status")}
//                   label="Status"
//                 >
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Inactive">Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* <Grid item xs={12} sm={6}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   textAlign: "center",
//                 }}
//               >
//                 <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                   Customer Rating
//                 </Typography>

//                 <Rating
//                   name="customer_rating"
//                   value={formData.customer_rating}
//                   onChange={(_, newValue) =>
//                     setFormData((prev: any) => ({
//                       ...prev,
//                       customer_rating: newValue,
//                     }))
//                   }
//                   disabled={isViewMode}
//                   sx={{ fontSize: 36, color: "#FFD700" }} // Optional: Make it pop!
//                 />

//                 {!isViewMode && (
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                     sx={{ mt: 0.5, fontStyle: "italic" }}
//                   >
//                     Click to rate from 1 to 5 stars
//                   </Typography>
//                 )}
//               </Box>
//             </Grid> */}

//             {/* Languages as Tags */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle2" color="text.secondary" mb={1}>
//                 Languages Known
//               </Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Add Language"
//                 value={inputLang}
//                 onChange={(e) => setInputLang(e.target.value)}
//                 onKeyDown={handleTagAdd("languages")}
//                 disabled={isViewMode}
//                 error={!!errors.languages}
//                 helperText={errors.languages || "Press Enter to add language"}
//               />
//               <Box sx={{ mt: 1 }}>
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
//                     sx={{ mr: 1, mb: 1 }}
//                   />
//                 ))}
//               </Box>
//             </Grid>

//             {/* Expertise as Dropdown */}
//             <Grid item xs={12}>
//               <FormControl fullWidth size="small" error={!!errors.expertises}>
//                 <InputLabel>Expertise Areas</InputLabel>
//                 <Select
//                   multiple
//                   value={formData.expertises}
//                   onChange={handleChange("expertises")}
//                   label="Expertise Areas"
//                   disabled={isViewMode}
//                   renderValue={(selected) => selected.join(", ")}
//                 >
//                   {["Career", "Health", "Wealth", "Relationship"].map(
//                     (option) => (
//                       <MenuItem key={option} value={option}>
//                         <Checkbox
//                           checked={formData.expertises.includes(option)}
//                         />
//                         <ListItemText primary={option} />
//                       </MenuItem>
//                     )
//                   )}
//                 </Select>
//                 {!!errors.expertises && (
//                   <FormHelperText>{errors.expertises}</FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>

//             {/* Submit Button */}
//             {!isViewMode && (
//               <Grid item xs={12} mt={1}>
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
//                     {mode === "new" ? "Create User" : "Update User"}
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

// export default NewAstroUser;

import React, { useState, FormEvent } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";
import { styled } from "@mui/system";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

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
  consulting_fee: string;
  picture: File | string | null;
  languages: string[];
  expertises: string[];
}

interface Props {
  mode: Mode;
}

const NewAstroUser: React.FC<Props> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isViewMode = mode === "view";

  const [formData, setFormData] = useState<AstroFormData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    status: "Active",
    astrologer_profile_info: "",
    experience: "",
    consulting_fee: "",
    picture: null,
    languages: [],
    expertises: [],
  });

  const [inputLang, setInputLang] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof AstroFormData) => (e: any) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "expertises" && value.length > 0) {
      setErrors((prev) => ({ ...prev, expertises: "" }));
    }
  };

  const handleTagAdd = (field) => (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!value) return;

      if (!formData[field].includes(value)) {
        setFormData((prev) => ({
          ...prev,
          [field]: [...prev[field], value],
        }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }

      setInputLang("");
    }
  };

  const handleTagDelete =
    (type: "languages" | "expertises", index: number) => () => {
      setFormData((prev) => {
        const updated = [...prev[type]];
        updated.splice(index, 1);
        return { ...prev, [type]: updated };
      });
    };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredFields: (keyof AstroFormData)[] = [
      "experience",
      "consulting_fee",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required";
    });

    if (!formData.languages.length)
      newErrors.languages = "At least one language is required";

    if (!formData.expertises.length) {
      newErrors.expertises = "At least one expertise is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      const val = formData[key as keyof AstroFormData];
      if (Array.isArray(val)) {
        val.forEach((v) => payload.append(`${key}[]`, v));
      } else if (val !== null) {
        payload.append(key, val as string | Blob);
      }
    });

    await callAPI({
      endpoint:
        mode === "edit"
          ? `api/admin/astrologers/${userId}`
          : "api/admin/astrologers",
      method: mode === "edit" ? "put" : "post",
      formData: payload,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          sx={{ letterSpacing: "0.3px", textAlign: "center" }}
        >
          {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} Astro User
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Profile Picture Section - Centered and refined */}
            <Grid item xs={12} sx={{ textAlign: "center", mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={500} color="#546e7a" mb={1.5}>
                Profile Picture
              </Typography>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={
                    formData.picture
                      ? typeof formData.picture === "string"
                        ? formData.picture
                        : URL.createObjectURL(formData.picture)
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJaOl3vJfEJpJU4NLddWUUznNoM1LMu_9qAQ&s"
                  }
                  alt="Astrologer"
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 1,
                    border: errors.picture ? "2px solid #e57373" : "2px solid #e0e0e0",
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
                          bgcolor: "#3f51b5",
                          color: "#fff",
                          borderRadius: "50%",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                          p: 0.8,
                          "&:hover": { bgcolor: "#303f9f" },
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
              <Typography variant="subtitle1" fontWeight={500} color="#546e7a" mb={1.5}>
                Personal Information
              </Typography>
            </Grid>

            {/* Personal info fields - Compact and aligned */}
            {["first_name", "last_name", "email", "mobile_number"].map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  fullWidth
                  size="small"
                  value={formData[key]}
                  onChange={handleChange(key)}
                  error={!!errors[key]}
                  helperText={errors[key] || ""}
                  disabled={isViewMode}
                  InputLabelProps={{
                    sx: { fontSize: "0.95rem", fontWeight: 500, color: "#455a64" },
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
            ))}

            {/* Professional Information */}
            <Grid item xs={12} mt={1}>
              <Typography variant="subtitle1" fontWeight={500} color="#546e7a" mb={1.5}>
                Professional Details
              </Typography>
            </Grid>

            {/* Professional fields - Optimized spacing */}
            {["astrologer_profile_info", "experience", "consulting_fee"].map((key) => (
              <Grid
                item
                xs={12}
                sm={key === "astrologer_profile_info" ? 12 : 6}
                key={key}
              >
                <TextField
                  label={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  fullWidth
                  size="small"
                  value={formData[key]}
                  onChange={handleChange(key)}
                  error={!!errors[key]}
                  helperText={errors[key] || ""}
                  disabled={isViewMode}
                  multiline={key === "astrologer_profile_info"}
                  minRows={key === "astrologer_profile_info" ? 3 : undefined}
                  InputLabelProps={{
                    sx: { fontSize: "0.95rem", fontWeight: 500, color: "#455a64" },
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
            ))}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isViewMode} size="small">
                <InputLabel sx={{ fontSize: "0.95rem", fontWeight: 500, color: "#455a64" }}>
                  Status
                </InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Status"
                  sx={{
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Languages as Tags */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={500} color="#546e7a" mb={1.5}>
                Languages Known
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Add Language"
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                onKeyDown={handleTagAdd("languages")}
                disabled={isViewMode}
                error={!!errors.languages}
                helperText={errors.languages || "Press Enter to add language"}
                InputLabelProps={{
                  sx: { fontSize: "0.95rem", fontWeight: 500, color: "#455a64" },
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

            {/* Expertise as Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth size="small" error={!!errors.expertises}>
                <InputLabel sx={{ fontSize: "0.95rem", fontWeight: 500, color: "#455a64" }}>
                  Expertise Areas
                </InputLabel>
                <Select
                  multiple
                  value={formData.expertises}
                  onChange={handleChange("expertises")}
                  label="Expertise Areas"
                  disabled={isViewMode}
                  renderValue={(selected) => selected.join(", ")}
                  sx={{
                    fontSize: "0.9rem",
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
                  }}
                >
                  {["Career", "Health", "Wealth", "Relationship"].map((option) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={formData.expertises.includes(option)} />
                      <ListItemText primary={option} sx={{ "& .MuiTypography-root": { fontSize: "0.9rem" } }} />
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.expertises && (
                  <FormHelperText sx={{ fontSize: "0.75rem" }}>{errors.expertises}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Submit Button - Centered and styled */}
            {!isViewMode && (
              <Grid item xs={12} mt={2}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                    {mode === "new" ? "Create User" : "Update User"}
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

export default NewAstroUser;