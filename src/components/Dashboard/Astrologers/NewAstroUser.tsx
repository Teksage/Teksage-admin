// import React, { useState } from "react";
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
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// interface UserFormData {
//   name: string;
//   description: string;
//   languageSkills: string;
//   areasOfExpertise: string;
//   yearsOfExperience: string;
//   profilePicture: string;
//   email: string;
//   mobile: string;
//   status: string;
//   plan: string;
// }

// const statusOptions = ["Active", "Inactive"];
// const planOptions = ["Free", "Basic", "Premium", "Pro"];

// const NewAstroUser: React.FC<{ mode: "new" | "edit" | "view" }> = ({
//   mode,
// }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<UserFormData>({
//     name: "",
//     description: "",
//     languageSkills: "",
//     areasOfExpertise: "",
//     yearsOfExperience: "",
//     profilePicture: "",
//     email: "",
//     mobile: "",
//     status: "",
//     plan: "",
//   });

//   const handleChange =
//     (field: keyof UserFormData) =>
//     (
//       event: React.ChangeEvent<
//         HTMLInputElement | { name?: string; value: unknown }
//       >
//     ) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: event.target.value,
//       }));
//     };

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     console.log("Form Data:", formData);
//   };

//   const isViewMode = mode === "view";

//   return (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h5">Go Back</Typography>
//       </Box>
//       <Paper elevation={3} sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
//         <Typography variant="h5" gutterBottom>
//           {mode === "new"
//             ? "Create New Astro User"
//             : mode === "edit"
//             ? "Edit Astro User"
//             : "View Astro User"}
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 value={formData.name}
//                 onChange={handleChange("name")}
//                 disabled={isViewMode}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Description"
//                 value={formData.description}
//                 onChange={handleChange("description")}
//                 disabled={isViewMode}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Language Skills"
//                 value={formData.languageSkills}
//                 onChange={handleChange("languageSkills")}
//                 disabled={isViewMode}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Areas of Expertise"
//                 value={formData.areasOfExpertise}
//                 onChange={handleChange("areasOfExpertise")}
//                 disabled={isViewMode}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Years of Experience"
//                 value={formData.yearsOfExperience}
//                 onChange={handleChange("yearsOfExperience")}
//                 disabled={isViewMode}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Profile Picture URL"
//                 value={formData.profilePicture}
//                 onChange={handleChange("profilePicture")}
//                 disabled={isViewMode}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange("email")}
//                 disabled={isViewMode}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Mobile Number"
//                 value={formData.mobile}
//                 onChange={handleChange("mobile")}
//                 disabled={isViewMode}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={formData.status}
//                   label="Plan"
//                   //   onChange={handleChange('plan')}
//                   disabled={isViewMode}
//                   required
//                 >
//                   {statusOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Plan</InputLabel>
//                 <Select
//                   value={formData.Plan}
//                   label="Plan"
//                   //   onChange={handleChange('plan')}
//                   disabled={isViewMode}
//                   required
//                 >
//                   {planOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {!isViewMode && (
//               <Grid item xs={12}>
//                 <Box
//                   sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
//                 >
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     sx={{
//                       background:
//                         "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
//                       color: "#fff",
//                       borderRadius: "8px",
//                       padding: "10px 24px",
//                       fontWeight: 600,
//                       textTransform: "none",
//                       fontSize: "1rem",
//                       boxShadow: "none",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background:
//                           "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
//                         boxShadow: "0 4px 12px rgba(27, 77, 62, 0.3)",
//                         transform: "translateY(-2px)",
//                       },
//                       "&:active": {
//                         transform: "translateY(0)",
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
//     </Box>
//   );
// };

// export default NewAstroUser;

import React, { useState, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";
import { styled } from "@mui/system";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Input styling
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
  customer_rating: number;
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
    customer_rating: 0,
    languages: [],
    expertises: [],
  });

  const [inputLang, setInputLang] = useState<string>("");
  const [inputExpertise, setInputExpertise] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange =
    (field: keyof AstroFormData) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
      const value =
        field === "picture" && "files" in e.target
          ? (e.target as HTMLInputElement).files?.[0] ?? null
          : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleTagAdd =
    (type: "languages" | "expertises") =>
    (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();
      if (e.key === "Enter" && value) {
        e.preventDefault();
        setFormData((prev) => ({
          ...prev,
          [type]: [...prev[type], value],
        }));
        type === "languages" ? setInputLang("") : setInputExpertise("");
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
      // "first_name",
      // "last_name",
      // "email",
      // "mobile_number",
      // "astrologer_profile_info",
      // "experience",
      "consulting_fee",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required";
    });

    if (!formData.languages.length)
      newErrors.languages = "At least one language is required";
    if (!formData.expertises.length)
      newErrors.expertises = "At least one expertise is required";
    // if (!formData.picture) newErrors.picture = "Profile picture is required";

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
      {/* Header with back button - more compact and subtle */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={500}>
          Back
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          // maxWidth: "1000px",
          mx: "auto",
          backgroundColor: "#fafafa",
          borderRadius: "12px",
        }}
      >
        {/* Form title with consistent sizing */}
        <Typography variant="h6" fontWeight={500} mb={2}>
          {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"} Astro
          User
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Profile Picture Section */}
            <Grid item xs={12} sx={{ textAlign: "center", mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Profile Picture
              </Typography>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={
                    formData.picture
                      ? typeof formData.picture === "string"
                        ? formData.picture
                        : URL.createObjectURL(formData.picture)
                      : "https://res.cloudinary.com/cloudinary-marketing/images/w_2000,h_1100/f_auto,q_auto/v1647266871/Automated-Upload_Sharing/Automated-Upload_Sharing-png?_i=AA"
                  }
                  alt="Astrologer"
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 1,
                    border: errors.picture ? "2px solid red" : "1px solid #ddd",
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
                    <Tooltip title="Upload">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: -5,
                          bgcolor: "#fff",
                          borderRadius: "50%",
                          boxShadow: 1,
                          p: 0.5,
                        }}
                      >
                        <PhotoCamera fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </label>
                )}
              </Box>
              {errors.picture && (
                <Typography variant="caption" color="error">
                  {errors.picture}
                </Typography>
              )}
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Personal Information
              </Typography>
            </Grid>

            {/* Map through basic personal info fields */}
            {["first_name", "last_name", "email", "mobile_number"].map(
              (key) => (
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
                  />
                </Grid>
              )
            )}

            {/* Professional Information */}
            <Grid item xs={12} mt={1}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Professional Details
              </Typography>
            </Grid>

            {/* Professional fields */}
            {["astrologer_profile_info", "experience", "consulting_fee"].map(
              (key) => (
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
                    minRows={key === "astrologer_profile_info" ? 4 : undefined}
                  />
                </Grid>
              )
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isViewMode} size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Customer Rating
                </Typography>

                <Rating
                  name="customer_rating"
                  value={formData.customer_rating}
                  onChange={(_, newValue) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      customer_rating: newValue,
                    }))
                  }
                  disabled={isViewMode}
                  sx={{ fontSize: 36, color: "#FFD700" }} // Optional: Make it pop!
                />

                {!isViewMode && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, fontStyle: "italic" }}
                  >
                    Click to rate from 1 to 5 stars
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Languages and Expertise */}
            {["languages", "expertises"].map((field) => (
              <Grid item xs={12} key={field}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  {field === "languages"
                    ? "Languages Known"
                    : "Expertise Areas"}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label={`Add ${field}`}
                  value={field === "languages" ? inputLang : inputExpertise}
                  onChange={(e) =>
                    field === "languages"
                      ? setInputLang(e.target.value)
                      : setInputExpertise(e.target.value)
                  }
                  onKeyDown={handleTagAdd(field)}
                  disabled={isViewMode}
                  error={!!errors[field]}
                  helperText={
                    errors[field] || `Press Enter to add ${field.slice(0, -1)}`
                  }
                />
                <Box sx={{ mt: 1 }}>
                  {formData[field].map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      onDelete={
                        !isViewMode ? handleTagDelete(field, index) : undefined
                      }
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            ))}

            {/* Submit Button */}
            {!isViewMode && (
              <Grid item xs={12} mt={1}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "8px 22px",
                      fontWeight: 500,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
                        boxShadow: "0 3px 8px rgba(27, 77, 62, 0.25)",
                        transform: "translateY(-1px)",
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
