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
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// interface FAQFormData {
//   name: string;
//   question: string;
//   answer: string;
//   status: string;
// }

// const statusOptions = ["Active", "Inactive"];

// const NewFAQ: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FAQFormData>({
//     name: "",
//     question: "",
//     answer: "",
//     status: "Active",
//   });

//   const handleChange =
//     (field: keyof FAQFormData) =>
//     (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: event.target.value,
//       }));
//     };

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     console.log(mode === "edit" ? "Updating FAQ" : "Creating FAQ", formData);
//   };

//   const isViewMode = mode === "view";

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h5">Go Back</Typography>
//       </Box>

//       <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
//           {mode === "new"
//             ? "Create New FAQ"
//             : mode === "edit"
//             ? "Edit FAQ"
//             : "View FAQ"}
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             {/* Name Field */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 variant="outlined"
//                 value={formData.name}
//                 onChange={handleChange("name")}
//                 disabled={isViewMode}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={formData.status}
//                   label="Status"
//                   onChange={handleChange("status")}
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

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Question"
//                 variant="outlined"
//                 value={formData.question}
//                 onChange={handleChange("question")}
//                 disabled={isViewMode}
//                 required
//                 multiline
//                 rows={3}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Answer"
//                 variant="outlined"
//                 value={formData.answer}
//                 onChange={handleChange("answer")}
//                 disabled={isViewMode}
//                 required
//                 multiline
//                 rows={4}
//               />
//             </Grid>

//             {!isViewMode && (
//               <Grid item xs={12}>
//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     size="large"
//                   >
//                     {mode === "new" ? "Create FAQ" : "Update FAQ"}
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

// export default NewFAQ;

import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { callAPI } from "../../../api/crudFactory"; // Make sure this path is correct

interface FAQFormData {
  question: string;
  answer: string;
  status: string;
}

const statusOptions = ["Active", "Inactive"];

const NewFAQ: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    status: "Active",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FAQFormData, string>>
  >({});

  const handleChange =
    (field: keyof FAQFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FAQFormData, string>> = {};
    if (!formData.question.trim()) newErrors.question = "Question is required";
    if (!formData.answer.trim()) newErrors.answer = "Answer is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      await callAPI({
        endpoint:
          mode === "edit" ? `/api/admin/faq/${userId}` : "/api/admin/faq",
        method: mode === "edit" ? "put" : "post",
        data: formData,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error submitting FAQ:", error);
    }
  };

  const isViewMode = mode === "view";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ margin: "0 auto" }}>
        {/* Back Button Bar */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Back
          </Typography>
        </Box>

        {/* Main Content Card */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#333" }}
          >
            {mode === "new"
              ? "Create New FAQ"
              : mode === "edit"
              ? "Edit FAQ"
              : "View FAQ"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Status Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={handleChange("status")}
                    disabled={isViewMode}
                    required
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}></Grid>

              {/* Question Field */}
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                >
                  Question
                </Typography>
                <TextField
                  fullWidth
                  label="Question"
                  variant="outlined"
                  size="small"
                  value={formData.question}
                  onChange={handleChange("question")}
                  disabled={isViewMode}
                  error={Boolean(errors.question)}
                  helperText={errors.question}
                />
              </Grid>

              {/* Answer Field */}
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                >
                  Answer
                </Typography>
                <TextField
                  fullWidth
                  label="Answer"
                  variant="outlined"
                  size="small"
                  value={formData.answer}
                  onChange={handleChange("answer")}
                  disabled={isViewMode}
                  multiline
                  rows={4}
                  error={Boolean(errors.answer)}
                  helperText={errors.answer}
                />
              </Grid>

              {/* Button Section */}
              {!isViewMode && (
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                  >
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
                      {mode === "new" ? "Add FAQ" : "Save Changes"}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default NewFAQ;
