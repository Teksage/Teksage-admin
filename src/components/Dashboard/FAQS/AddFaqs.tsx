import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
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
}

// const statusOptions = ["Active", "Inactive"];

const NewFAQ: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    // status: "Active",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FAQFormData, string>>
  >({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // If edit mode, fetch FAQ details
        if (mode === "edit" && userId) {
          const couponResponse = await callAPI({
            endpoint: `/api/faq/${userId}`,
            method: "get",
          });
          const data = couponResponse?.data;
          console.log(data, "data");
          setFormData({
            ...data,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchInitialData();
  }, [mode, userId]);

  const handleChange =
    (field: keyof FAQFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setErrors((prev: any) => ({
        ...prev,
        [field]: "",
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
        endpoint: mode === "edit" ? `/api/faq/${userId}` : "/api/faq",
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
      {/* Header with back button - compact and aligned */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
        </IconButton>
        <Typography variant="body1" fontWeight={600} color="#06402B">
          Back
        </Typography>
      </Box>

      {/* Main Content Card */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          // maxWidth: "800px", // Constrain width for better alignment
          mx: "auto",
          width: { xs: "90%", md: "80%", lg: "70%"},
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
          // color="#1a237e"
          sx={{
            maxWidth: "50%", // Prevent title from pushing buttons too far
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 600, // Bolder font for emphasis
            fontFamily: '"Poppins", sans-serif', // Modern font family
            letterSpacing: 0.5, // Slight spacing for readability
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          }}
        >
          {mode === "new"
            ? "Create FAQ"
            : mode === "edit"
            ? "Edit FAQ"
            : "View FAQ"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Question Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question *"
                variant="outlined"
                size="small"
                value={formData.question}
                onChange={handleChange("question")}
                disabled={isViewMode}
                error={Boolean(errors.question)}
                helperText={errors.question || ""}
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

            {/* Answer Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Answer *"
                variant="outlined"
                size="small"
                value={formData.answer}
                onChange={handleChange("answer")}
                disabled={isViewMode}
                multiline
                rows={4}
                error={Boolean(errors.answer)}
                helperText={errors.answer || ""}
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

            {/* Button Section */}
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
                    {mode === "new" ? "Add FAQ" : "Save Changes"}
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

export default NewFAQ;