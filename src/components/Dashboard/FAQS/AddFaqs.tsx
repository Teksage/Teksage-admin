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
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface FAQFormData {
  name: string;
  question: string;
  answer: string;
  status: string;
}

const statusOptions = ["Active", "Inactive"];

const NewFAQ: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FAQFormData>({
    name: "",
    question: "",
    answer: "",
    status: "Active",
  });

  const handleChange =
    (field: keyof FAQFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(mode === "edit" ? "Updating FAQ" : "Creating FAQ", formData);
  };

  const isViewMode = mode === "view";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Go Back</Typography>
      </Box>

      {/* Form Container */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          {mode === "new"
            ? "Create New FAQ"
            : mode === "edit"
            ? "Edit FAQ"
            : "View FAQ"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange("name")}
                disabled={isViewMode}
                required
              />
            </Grid>

            {/* Status Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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

            {/* Question Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question"
                variant="outlined"
                value={formData.question}
                onChange={handleChange("question")}
                disabled={isViewMode}
                required
                multiline
                rows={3}
              />
            </Grid>

            {/* Answer Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Answer"
                variant="outlined"
                value={formData.answer}
                onChange={handleChange("answer")}
                disabled={isViewMode}
                required
                multiline
                rows={4}
              />
            </Grid>

            {/* Submit Button */}
            {!isViewMode && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    {mode === "new" ? "Create FAQ" : "Update FAQ"}
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
