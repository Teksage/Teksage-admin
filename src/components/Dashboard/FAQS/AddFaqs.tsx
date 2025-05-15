// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Grid,
//   Typography,
//   Paper,
//   IconButton,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { callAPI } from "../../../api/crudFactory"; // Make sure this path is correct

// interface FAQFormData {
//   question: string;
//   answer: string;
// }

// // const statusOptions = ["Active", "Inactive"];

// const NewFAQ: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [formData, setFormData] = useState<FAQFormData>({
//     question: "",
//     answer: "",
//     // status: "Active",
//   });
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof FAQFormData, string>>
//   >({});

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // If edit mode, fetch FAQ details
//         if (mode === "edit" && userId) {
//           const couponResponse = await callAPI({
//             endpoint: `/api/faq/${userId}`,
//             method: "get",
//           });
//           const data = couponResponse?.data;
//           console.log(data, "data");
//           setFormData({
//             ...data,
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchInitialData();
//   }, [mode, userId]);

//   const handleChange =
//     (field: keyof FAQFormData) =>
//     (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: event.target.value,
//       }));
//       setErrors((prev: any) => ({
//         ...prev,
//         [field]: "",
//       }));
//     };

//   const validate = (): boolean => {
//     const newErrors: Partial<Record<keyof FAQFormData, string>> = {};
//     if (!formData.question.trim()) newErrors.question = "Question is required";
//     if (!formData.answer.trim()) newErrors.answer = "Answer is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!validate()) return;
//     try {
//       await callAPI({
//         endpoint: mode === "edit" ? `/api/faq/${userId}` : "/api/faq",
//         method: mode === "edit" ? "put" : "post",
//         data: formData,
//       });
//       navigate(-1);
//     } catch (error) {
//       console.error("Error submitting FAQ:", error);
//     }
//   };

//   const isViewMode = mode === "view";

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       {/* Header with back button - compact and aligned */}
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
//           <ArrowBackIcon sx={{ fontSize: 24, color: "#06402B" }} />
//         </IconButton>
//         <Typography variant="body1" fontWeight={600} color="#06402B">
//           Back
//         </Typography>
//       </Box>

//       {/* Main Content Card */}
//       <Paper
//         elevation={2}
//         sx={{
//           p: { xs: 2, sm: 3 },
//           // maxWidth: "800px", // Constrain width for better alignment
//           mx: "auto",
//           width: { xs: "90%", md: "80%", lg: "70%"},
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
//           {mode === "new"
//             ? "Create FAQ"
//             : mode === "edit"
//             ? "Edit FAQ"
//             : "View FAQ"}
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {/* Question Field */}
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Question *"
//                 variant="outlined"
//                 size="small"
//                 value={formData.question}
//                 onChange={handleChange("question")}
//                 disabled={isViewMode}
//                 error={Boolean(errors.question)}
//                 helperText={errors.question || ""}
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

//             {/* Answer Field */}
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Answer *"
//                 variant="outlined"
//                 size="small"
//                 value={formData.answer}
//                 onChange={handleChange("answer")}
//                 disabled={isViewMode}
//                 multiline
//                 rows={4}
//                 error={Boolean(errors.answer)}
//                 helperText={errors.answer || ""}
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

//             {/* Button Section */}
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
//                     {mode === "new" ? "Add FAQ" : "Save Changes"}
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

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Fade,
  useTheme,
  useMediaQuery,
  Container,
  Tooltip
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { callAPI } from "../../../api/crudFactory"; // Make sure this path is correct

interface FAQFormData {
  question: string;
  answer: string;
}

const NewFAQ: React.FC<{ mode: "new" | "edit" | "view" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FAQFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (mode === "edit" && userId) {
        setIsLoading(true);
        try {
          const couponResponse = await callAPI({
            endpoint: `/api/faq/${userId}`,
            method: "get",
          });
          const data = couponResponse?.data;
          setFormData({
            ...data,
          });
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsLoading(false);
        }
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
    
    setIsLoading(true);
    try {
      await callAPI({
        endpoint: mode === "edit" ? `/api/faq/${userId}` : "/api/faq",
        method: mode === "edit" ? "put" : "post",
        data: formData,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error submitting FAQ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isViewMode = mode === "view";

  // Sample FAQ writing tips
  const faqTips = [
    "Keep questions concise and specific",
    "Use clear, simple language",
    "Answer with complete information",
    "Address the most common questions first"
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header with back button - compact and aligned */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 3,
          background: "rgba(6, 64, 43, 0.03)",
          borderRadius: "8px",
          p: 1
        }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              mr: 1,
              color: "#06402B",
              "&:hover": {
                background: "rgba(6, 64, 43, 0.1)",
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="body1" 
            color="#06402B"
            sx={{ 
              display: "flex", 
              alignItems: "center" 
            }}
            style={{ fontFamily: "Urbanist", fontWeight: 800 }}
          >
            Back to FAQs
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content Card */}
          <Grid item xs={12} md={showTips ? 8 : 12}>
            <Fade in={true} timeout={500}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
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
                  }
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <QuestionAnswerIcon sx={{ color: "#43a047", mr: 1.5, fontSize: 28 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 0.5,
                        color: "#2e7d32",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                      style={{ fontFamily: "Urbanist", fontWeight: 800 }}
                    >
                      {mode === "new"
                        ? "Create FAQ"
                        : mode === "edit"
                        ? "Edit FAQ"
                        : "View FAQ"}
                    </Typography>
                  </Box>
                  {!isMobile && (
                    <Tooltip title={showTips ? "Hide tips" : "Show tips"}>
                      <IconButton 
                        onClick={() => setShowTips(!showTips)}
                        sx={{ color: "#43a047" }}
                      >
                        <TipsAndUpdatesIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Divider sx={{ mb: 3, opacity: 0.6 }} />

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Question Field */}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <HelpOutlineIcon sx={{ color: "#43a047", mr: 1, mt: 0.5 }} />
                        <Typography fontWeight={500} color="#455a64" style={{fontFamily: "Urbanist"}}>Question</Typography>
                      </Box>
                      <TextField
                        fullWidth
                        placeholder="Enter your question here..."
                        variant="outlined"
                        size="small"
                        value={formData.question}
                        onChange={handleChange("question")}
                        disabled={isViewMode || isLoading}
                        error={Boolean(errors.question)}
                        helperText={errors.question || ""}
                        InputLabelProps={{
                          sx: {
                            fontWeight: 500,
                            color: "#455a64",
                            fontFamily: "Urbanist"
                          },
                        }}
                        InputProps={{
                          sx: { 
                            fontSize: "0.95rem", 
                            borderRadius: "8px",
                            fontFamily: "Urbanist"
                          },
                        }}
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontFamily: "Urbanist",
                            fontSize: "0.9rem",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#cfd8dc" },
                            "&:hover fieldset": { borderColor: "#43a047" },
                            "&.Mui-focused fieldset": { borderColor: "#43a047" },
                          },
                          "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                        }}
                      />
                    </Grid>

                    {/* Answer Field */}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <QuestionAnswerIcon sx={{ color: "#43a047", mr: 1, mt: 0.5 }} />
                        <Typography fontWeight={500} color="#455a64" style={{fontFamily: "Urbanist"}}>Answer</Typography>
                      </Box>
                      <TextField
                        fullWidth
                        placeholder="Provide a detailed answer..."
                        variant="outlined"
                        size="small"
                        value={formData.answer}
                        onChange={handleChange("answer")}
                        disabled={isViewMode || isLoading}
                        multiline
                        rows={6}
                        error={Boolean(errors.answer)}
                        helperText={errors.answer || ""}
                        InputLabelProps={{
                          sx: {
                            fontWeight: 500,
                            color: "#455a64",
                            fontFamily: "Urbanist"
                          },
                        }}
                        InputProps={{
                          sx: { 
                            fontSize: "0.95rem", 
                            borderRadius: "8px",
                            fontFamily: "Urbanist"
                          },
                        }}
                        sx={{
                          "& .MuiInputLabel-root": {
                            fontFamily: "Urbanist",
                            fontSize: "0.9rem",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#cfd8dc" },
                            "&:hover fieldset": { borderColor: "#43a047" },
                            "&.Mui-focused fieldset": { borderColor: "#43a047" },
                          },
                          "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
                        }}
                      />
                    </Grid>

                    {/* Button Section */}
                    {!isViewMode && (
                      <Grid item xs={12} mt={1}>
                        <Box sx={{ 
                          display: "flex", 
                          justifyContent: "flex-end",
                          mt: 2
                        }}>
                          <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                            sx={{
                              mr: 2,
                              color: "#555",
                              borderColor: "#ccc",
                              borderRadius: "8px",
                              padding: "8px 24px",
                              fontWeight: 800,
                              fontFamily: "Urbanist",
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "#999",
                                backgroundColor: "rgba(0,0,0,0.03)"
                              }
                            }}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                              background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "8px 24px",
                              fontWeight: 800,
                              fontFamily: "Urbanist",
                              fontSize: "0.95rem",
                              textTransform: "none",
                              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
                                boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                                transform: "scale(1.02)",
                              },
                              "&:disabled": {
                                background: "linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)",
                                color: "#fff",
                              }
                            }}
                          >
                            {isLoading ? "Saving..." : mode === "new" ? "Add FAQ" : "Save Changes"}
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Tips Section */}
          {showTips && (
            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={700}>
                <Card
                  elevation={1}
                  sx={{
                    height: "100%",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    backgroundColor: "rgba(67, 160, 71, 0.03)",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 80,
                      backgroundColor: "#06402B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "30%",
                        background: "linear-gradient(0deg, rgba(6,64,43,0.7) 0%, rgba(6,64,43,0) 100%)",
                      }
                    }}
                  >
                    <TipsAndUpdatesIcon sx={{ color: "#fff", fontSize: 38 }} />
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#06402B" }} style={{fontFamily: "Urbanist", fontWeight: 800}}>
                      Tips for Good FAQs
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      {faqTips.map((tip, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: "flex", 
                            mb: 2, 
                            alignItems: "center",
                            p: 1.5,
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: "50%", 
                              bgcolor: "#43a047", 
                              color: "#fff", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              mr: 2,
                              fontSize: "0.8rem",
                              fontWeight: 600
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Typography variant="body2" style={{fontFamily: "Urbanist", fontWeight: 600}}>{tip}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "8px", border: "1px dashed #43a047" }}>
                      <Typography variant="body2" sx={{ color: "#444", fontStyle: "italic" }} style={{fontFamily: "Urbanist", fontWeight: 500}}>
                        Well-written FAQs can significantly reduce customer support inquiries and improve user satisfaction.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          )}
          
          {/* Mobile Show/Hide Tips */}
          {isMobile && (
            <Grid item xs={12}>
              <Button 
                fullWidth
                variant="outlined"
                startIcon={<TipsAndUpdatesIcon />}
                onClick={() => setShowTips(!showTips)}
                sx={{
                  fontFamily: "Urbanist",
                  fontWeight: 800,
                  mt: 1,
                  color: "#43a047",
                  borderColor: "#43a047",
                  "&:hover": {
                    borderColor: "#2e7d32",
                    backgroundColor: "rgba(67, 160, 71, 0.04)"
                  }
                }}
              >
                {showTips ? "Hide FAQ Tips" : "Show FAQ Tips"}
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default NewFAQ;