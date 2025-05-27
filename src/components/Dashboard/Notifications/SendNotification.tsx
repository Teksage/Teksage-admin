// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   InputAdornment,
//   Grid,
//   Collapse,
//   useTheme,
//   useMediaQuery,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import {
//   Send,
//   People,
//   PersonSearch,
//   Star,
//   Schema,
//   Close,
//   ExpandMore,
//   ExpandLess,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import { callAPI } from "../../../api/crudFactory";

// // Interfaces for TypeScript
// interface User {
//   id: number;
//   name: string; // Maps to first_name from API
//   email: string;
// }

// type Nakshatra = string;
// type Rashi = string;

// interface SnackbarState {
//   open: boolean;
//   message: string;
//   severity: "success" | "error";
// }

// // Styled Components
// const CelestialCard = styled(Card)(({ theme }) => ({
//   background:
//     "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,247,250,0.9) 100%)",
//   borderRadius: "16px",
//   boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//   border: "1px solid rgba(16, 177, 0, 0.2)",
//   overflow: "hidden",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-5px)",
//     boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
//   },
//   [theme.breakpoints.down("sm")]: {
//     borderRadius: "12px",
//   },
// }));

// const SectionHeader = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   padding: theme.spacing(2),
//   background:
//     "linear-gradient(135deg, rgba(16, 177, 0, 0.1) 0%, rgba(27, 77, 62, 0.1) 100%)",
//   borderBottom: "1px solid rgba(16, 177, 0, 0.1)",
//   cursor: "pointer",
//   "&:hover": {
//     background:
//       "linear-gradient(135deg, rgba(16, 177, 0, 0.15) 0%, rgba(27, 77, 62, 0.15) 100%)",
//   },
//   [theme.breakpoints.down("sm")]: {
//     padding: theme.spacing(1.5),
//   },
// }));

// const SendNotification: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
//   const navigate = useNavigate();

//   const [expandedSection, setExpandedSection] = useState<string | null>(null);
//   const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
//   const [selectedNakshatras, setSelectedNakshatras] = useState<Nakshatra[]>([]);
//   const [selectedRashis, setSelectedRashis] = useState<Rashi[]>([]);
//   const [showAllNakshatras, setShowAllNakshatras] = useState<boolean>(false);
//   const [userSearch, setUserSearch] = useState<string>("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [snackbar, setSnackbar] = useState<SnackbarState>({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // State for notification fields (title and body for each section)
//   const [allNotification, setAllNotification] = useState({ title: "", body: "" });
//   const [specificNotification, setSpecificNotification] = useState({ title: "", body: "" });
//   const [nakshatraNotification, setNakshatraNotification] = useState({ title: "", body: "" });
//   const [rashiNotification, setRashiNotification] = useState({ title: "", body: "" });

//   const nakshatras: Nakshatra[] = [
//     "Ashwini",
//     "Bharani",
//     "Krittika",
//     "Rohini",
//     "Mrigashira",
//     "Ardra",
//     "Punarvasu",
//     "Pushya",
//     "Ashlesha",
//     "Magha",
//     "Purva Phalguni",
//     "Uttara Phalguni",
//     "Hasta",
//     "Chitra",
//     "Swati",
//     "Vishaka",
//     "Anuradha",
//     "Jyeshta",
//     "Moola",
//     "Purva Ashadha",
//     "Uttara Ashadha",
//     "Shravana",
//     "Dhanishta",
//     "Shatabhisha",
//     "Purva Bhadrapada",
//     "Uttara Bhadrapada",
//     "Revati",
//   ];

//   const initialNakshatras: Nakshatra[] = [
//     "Ashwini",
//     "Bharani",
//     "Krittika",
//     "Rohini",
//     "Mrigashira",
//     "Ardra",
//     "Punarvasu",
//     "Pushya",
//     "Ashlesha",
//     "Magha",
//   ];

//   const rashis: Rashi[] = [
//     "Aries",
//     "Taurus",
//     "Gemini",
//     "Cancer",
//     "Leo",
//     "Virgo",
//     "Libra",
//     "Scorpio",
//     "Sagittarius",
//     "Capricorn",
//     "Aquarius",
//     "Pisces",
//   ];

//   const rashiSymbols: { [key: string]: string } = {
//     Aries: "♈",
//     Taurus: "♉",
//     Gemini: "♊",
//     Cancer: "♋",
//     Leo: "♌",
//     Virgo: "♍",
//     Libra: "♎",
//     Scorpio: "♏",
//     Sagittarius: "♐",
//     Capricorn: "♑",
//     Aquarius: "♒",
//     Pisces: "♓",
//   };

//   // Fetch users from API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);
//       try {
//         const response = await callAPI({
//           endpoint: "api/admin/users",
//           method: "get",
//         });
//         const responseData = response?.data?.data;
//         if (Array.isArray(responseData)) {
//           const mappedUsers: User[] = responseData.map((user: any) => ({
//             id: user.id,
//             name: user.first_name,
//             email: user.email,
//           }));
//           setUsers(mappedUsers);
//         } else {
//           throw new Error("Invalid users data");
//         }
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//         setSnackbar({
//           open: true,
//           message: "Failed to load users. Please try again.",
//           severity: "error",
//         });
//         setUsers([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const selectedUsers = users.filter((user) =>
//     selectedUserIds.includes(user.id)
//   );

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
//       user.email.toLowerCase().includes(userSearch.toLowerCase())
//   );

//   const toggleSection = (section: string): void => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   const toggleDropdown = (): void => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleUserSelect = (userId: number): void => {
//     setSelectedUserIds((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const handleSelectAll = (): void => {
//     const filteredUserIds = filteredUsers.map((user) => user.id);
//     setSelectedUserIds((prev) => [...new Set([...prev, ...filteredUserIds])]);
//   };

//   const handleDeselectAll = (): void => {
//     if (userSearch) {
//       const filteredUserIds = filteredUsers.map((user) => user.id);
//       setSelectedUserIds((prev) =>
//         prev.filter((id) => !filteredUserIds.includes(id))
//       );
//     } else {
//       setSelectedUserIds([]);
//     }
//   };

//   const removeUser = (userId: number): void => {
//     setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
//   };

//   const handleNakshatraSelect = (nakshatra: Nakshatra): void => {
//     if (selectedNakshatras.includes(nakshatra)) {
//       setSelectedNakshatras(selectedNakshatras.filter((n) => n !== nakshatra));
//     } else {
//       setSelectedNakshatras([...selectedNakshatras, nakshatra]);
//     }
//   };

//   const handleRashiSelect = (rashi: Rashi): void => {
//     if (selectedRashis.includes(rashi)) {
//       setSelectedRashis(selectedRashis.filter((r) => r !== rashi));
//     } else {
//       setSelectedRashis([...selectedRashis, rashi]);
//     }
//   };

//   const handleSendNotification = async (type: string): Promise<void> => {
//     setIsLoading(true);
//     let data: any;

//     // Determine the data to send based on the section
//     if (type === "all") {
//       data = {
//         title: allNotification.title,
//         body: allNotification.body,
//       };
//     } else if (type === "specific") {
//       data = {
//         title: specificNotification.title,
//         body: specificNotification.body,
//         user_ids: selectedUserIds,
//       };
//     } else if (type === "nakshatra") {
//       data = {
//         title: nakshatraNotification.title,
//         body: nakshatraNotification.body,
//         nakshatra: selectedNakshatras,
//       };
//     } else if (type === "rashi") {
//       data = {
//         title: rashiNotification.title,
//         body: rashiNotification.body,
//         rashi: selectedRashis,
//       };
//     }

//     // Validate required fields
//     if (!data.title || !data.body) {
//       setSnackbar({
//         open: true,
//         message: "Title and message are required.",
//         severity: "error",
//       });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await callAPI({
//         endpoint: "api/admin/send-notification",
//         method: "post",
//         data,
//       });
//       console.log(response, "response");
//       setSnackbar({
//         open: true,
//         message: "Notification sent successfully!",
//         severity: "success",
//       });

//       setTimeout(() => {
//         navigate(-1);
//       }, 1000);
//     } catch (err: any) {
//       console.error("API Error:", err);
//       setSnackbar({
//         open: true,
//         message: err.message || "Something went wrong. Please try again.",
//         severity: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
//       <Typography
//         variant="h5"
//         sx={{
//           mb: { xs: 3, sm: 4 },
//           color: "#2e7d32",
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//         }}
//         style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//       >
//         <Send sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
//         Celestial Notifications
//       </Typography>

//       <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
//         {/* All Users Section */}
//         <Grid item xs={12}>
//           <CelestialCard>
//             <SectionHeader onClick={() => toggleSection("all")}>
//               <People
//                 sx={{
//                   mr: 2,
//                   color: "#10B100",
//                   fontSize: { xs: "1.25rem", sm: "1.5rem" },
//                 }}
//               />
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   flexGrow: 1,
//                   fontSize: { xs: "0.875rem", sm: "1rem" },
//                 }}
//                 style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//               >
//                 Broadcast to All Users
//               </Typography>
//               {expandedSection === "all" ? <ExpandLess /> : <ExpandMore />}
//             </SectionHeader>

//             <Collapse in={expandedSection === "all"}>
//               <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     mb: 1,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//                 >
//                   Mass Notification
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     mb: 3,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   Send announcements or updates to all registered users
//                   instantly
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   label="Notification Subject"
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={allNotification.title}
//                   onChange={(e) =>
//                     setAllNotification({ ...allNotification, title: e.target.value })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           📢
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <TextField
//                   fullWidth
//                   label="Notification Message"
//                   multiline
//                   rows={isMobile ? 3 : isTablet ? 4 : 5}
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={allNotification.body}
//                   onChange={(e) =>
//                     setAllNotification({ ...allNotification, body: e.target.value })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           ✉️
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Send />}
//                     size={isMobile ? "small" : "medium"}
//                     onClick={() => handleSendNotification("all")}
//                     disabled={isLoading}
//                     sx={{
//                       fontFamily: "Urbanist",
//                       fontWeight: 800,
//                       background: isLoading
//                         ? "rgba(0, 0, 0, 0.12)"
//                         : "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)",
//                       color: isLoading ? "text.disabled" : "white",
//                       borderRadius: "50px",
//                       px: { xs: 3, sm: 4 },
//                       py: { xs: 1, sm: 1.5 },
//                       fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                       boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background: isLoading
//                           ? "rgba(0, 0, 0, 0.12)"
//                           : "linear-gradient(135deg, #388E3C 0%, #004D40 100%)",
//                         boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
//                         transform: "scale(1.02)",
//                       },
//                     }}
//                   >
//                     Send to All
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Collapse>
//           </CelestialCard>
//         </Grid>

//         {/* Specific User Section */}
//         <Grid item xs={12}>
//           <CelestialCard>
//             <SectionHeader onClick={() => toggleSection("specific")}>
//               <PersonSearch
//                 sx={{
//                   mr: 2,
//                   color: "#10B100",
//                   fontSize: { xs: "1.25rem", sm: "1.5rem" },
//                 }}
//               />
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   flexGrow: 1,
//                   fontSize: { xs: "0.875rem", sm: "1rem" },
//                 }}
//                 style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//               >
//                 Target Specific Users
//               </Typography>
//               {expandedSection === "specific" ? <ExpandLess /> : <ExpandMore />}
//             </SectionHeader>

//             <Collapse in={expandedSection === "specific"}>
//               <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     mb: 1,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//                 >
//                   Personalized Notifications
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     mb: 3,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   Select individual users for tailored messages or updates
//                 </Typography>

//                 <FormControl fullWidth sx={{ mb: 2 }}>
//                   <InputLabel
//                     id="select-user-label"
//                     shrink={isDropdownOpen || selectedUserIds.length > 0}
//                     sx={{
//                       transform:
//                         isDropdownOpen || selectedUserIds.length > 0
//                           ? "translate(14px, -6px) scale(0.75)"
//                           : "translate(14px, 16px) scale(1)",
//                       backgroundColor: "white",
//                       padding: "0 4px",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                       fontFamily: "Urbanist",
//                     }}
//                   >
//                     Select Users
//                   </InputLabel>
//                   <Select
//                     labelId="select-user-label"
//                     open={isDropdownOpen}
//                     onOpen={toggleDropdown}
//                     onClose={toggleDropdown}
//                     value={selectedUserIds}
//                     multiple
//                     displayEmpty
//                     renderValue={() =>
//                       selectedUserIds.length === 0 ? (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             color: "text.secondary",
//                           }}
//                         >
//                           {/* Placeholder content */}
//                         </Box>
//                       ) : (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 1,
//                             alignItems: "center",
//                           }}
//                         >
//                           {selectedUsers.slice(0, 3).map((user) => (
//                             <Chip
//                               key={user.id}
//                               label={user.name}
//                               size={isMobile ? "small" : "medium"}
//                               onDelete={(e) => {
//                                 e.stopPropagation();
//                                 removeUser(user.id);
//                               }}
//                               deleteIcon={
//                                 <Close
//                                   sx={{
//                                     fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                                   }}
//                                 />
//                               }
//                               sx={{
//                                 backgroundColor: "rgba(16, 177, 0, 0.1)",
//                                 color: "#1B4D3E",
//                                 "& .MuiChip-label": {
//                                   fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                                 },
//                               }}
//                             />
//                           ))}
//                           {selectedUsers.length > 3 && (
//                             <Chip
//                               label={`+${selectedUsers.length - 3} more`}
//                               size={isMobile ? "small" : "medium"}
//                               sx={{
//                                 backgroundColor: "rgba(0, 0, 0, 0.08)",
//                                 color: "text.primary",
//                                 "& .MuiChip-label": {
//                                   fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                                 },
//                               }}
//                             />
//                           )}
//                         </Box>
//                       )
//                     }
//                     sx={{
//                       fontFamily: "Urbanist",
//                       fontSize: "0.9rem",
//                       "& .MuiSelect-select": {
//                         display: "flex",
//                         alignItems: "center",
//                         minHeight: { xs: "36px", sm: "40px" },
//                       },
//                       "& .MuiOutlinedInput-notchedOutline": {
//                         top: 0,
//                       },
//                       "& legend": {
//                         display: "none",
//                       },
//                     }}
//                     MenuProps={{
//                       PaperProps: {
//                         style: {
//                           maxHeight: 400,
//                           width: "auto",
//                         },
//                         sx: {
//                           display: "flex",
//                           flexDirection: "column",
//                         },
//                       },
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         position: "sticky",
//                         top: 0,
//                         backgroundColor: "white",
//                         zIndex: 1,
//                         borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
//                         p: 1,
//                       }}
//                     >
//                       <TextField
//                         fullWidth
//                         placeholder="Search users..."
//                         value={userSearch}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                           setUserSearch(e.target.value)
//                         }
//                         size={isMobile ? "small" : "medium"}
//                         variant="outlined"
//                         InputLabelProps={{
//                           sx: {
//                             fontWeight: 500,
//                             color: "#455a64",
//                             fontFamily: "Urbanist",
//                             fontSize: { xs: "0.875rem", sm: "1rem" },
//                           },
//                         }}
//                         InputProps={{
//                           sx: {
//                             fontSize: "0.95rem",
//                             borderRadius: "8px",
//                             fontFamily: "Urbanist",
//                           },
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <PersonSearch
//                                 sx={{
//                                   fontSize: { xs: "0.875rem", sm: "1rem" },
//                                 }}
//                               />
//                             </InputAdornment>
//                           ),
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                         onKeyDown={(e) => e.stopPropagation()}
//                       />
//                     </Box>
//                     <Box
//                       sx={{
//                         position: "sticky",
//                         top: 56,
//                         backgroundColor: "white",
//                         zIndex: 1,
//                         borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
//                         p: 1,
//                       }}
//                     >
//                       <MenuItem
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleSelectAll();
//                         }}
//                         sx={{ py: 0.5 }}
//                         style={{ fontFamily: "Urbanist" }}
//                       >
//                         <Typography
//                           sx={{
//                             color: "#10B100",
//                             fontSize: { xs: "0.875rem", sm: "1rem" },
//                           }}
//                         >
//                           Select All
//                         </Typography>
//                       </MenuItem>
//                       <MenuItem
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeselectAll();
//                         }}
//                         sx={{ py: 0.5 }}
//                         style={{ fontFamily: "Urbanist" }}
//                       >
//                         <Typography
//                           sx={{
//                             color: "#1B4D3E",
//                             fontSize: { xs: "0.875rem", sm: "1rem" },
//                           }}
//                         >
//                           Deselect All
//                         </Typography>
//                       </MenuItem>
//                     </Box>
//                     <Box sx={{ overflowY: "auto", maxHeight: 300 }}>
//                       {filteredUsers.length > 0 ? (
//                         filteredUsers.map((user) => (
//                           <MenuItem
//                             key={user.id}
//                             value={user.id}
//                             onClick={() => handleUserSelect(user.id)}
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               py: 1,
//                             }}
//                             style={{ fontFamily: "Urbanist" }}
//                           >
//                             <Box
//                               sx={{
//                                 width: 20,
//                                 height: 20,
//                                 border: selectedUserIds.includes(user.id)
//                                   ? "1px solid #10B100"
//                                   : "1px solid rgba(0, 0, 0, 0.23)",
//                                 borderRadius: "4px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 mr: 2,
//                                 backgroundColor: selectedUserIds.includes(
//                                   user.id
//                                 )
//                                   ? "#10B100"
//                                   : "transparent",
//                               }}
//                             >
//                               {selectedUserIds.includes(user.id) && (
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="14"
//                                   height="14"
//                                   fill="white"
//                                   viewBox="0 0 16 16"
//                                 >
//                                   <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L6 9.293 4.354 7.646a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l6-6z" />
//                                 </svg>
//                               )}
//                             </Box>
//                             <Box>
//                               <Typography
//                                 sx={{
//                                   fontSize: { xs: "0.875rem", sm: "1rem" },
//                                 }}
//                                 style={{
//                                   fontFamily: "Urbanist",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {user.name}
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                                 sx={{
//                                   fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                                 }}
//                                 style={{
//                                   fontFamily: "Urbanist",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {user.email}
//                               </Typography>
//                             </Box>
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>
//                           <Typography
//                             sx={{
//                               fontStyle: "italic",
//                               color: "text.secondary",
//                               fontSize: { xs: "0.875rem", sm: "1rem" },
//                             }}
//                             style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                           >
//                             No users found
//                           </Typography>
//                         </MenuItem>
//                       )}
//                     </Box>
//                   </Select>
//                 </FormControl>

//                 <Typography
//                   variant="body2"
//                   sx={{
//                     mb: 3,
//                     color: "text.secondary",
//                     fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 500 }}
//                 >
//                   {selectedUsers.length} users selected
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   label="Notification Subject"
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={specificNotification.title}
//                   onChange={(e) =>
//                     setSpecificNotification({
//                       ...specificNotification,
//                       title: e.target.value,
//                     })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           📢
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <TextField
//                   fullWidth
//                   label="Personalized Message"
//                   multiline
//                   rows={isMobile ? 3 : isTablet ? 4 : 5}
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={specificNotification.body}
//                   onChange={(e) =>
//                     setSpecificNotification({
//                       ...specificNotification,
//                       body: e.target.value,
//                     })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           ✉️
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Send />}
//                     size={isMobile ? "small" : "medium"}
//                     disabled={selectedUsers.length === 0 || isLoading}
//                     onClick={() => handleSendNotification("specific")}
//                     sx={{
//                       fontFamily: "Urbanist",
//                       fontWeight: 800,
//                       background:
//                         selectedUsers.length > 0 && !isLoading
//                           ? "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)"
//                           : "rgba(0, 0, 0, 0.12)",
//                       color:
//                         selectedUsers.length > 0 && !isLoading
//                           ? "white"
//                           : "text.disabled",
//                       borderRadius: "50px",
//                       px: { xs: 3, sm: 4 },
//                       py: { xs: 1, sm: 1.5 },
//                       fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                       boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background:
//                           selectedUsers.length > 0 && !isLoading
//                             ? "linear-gradient(135deg, #388E3C 0%, #004D40 100%)"
//                             : "rgba(0, 0, 0, 0.12)",
//                         boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
//                         transform: "scale(1.02)",
//                       },
//                     }}
//                   >
//                     Send to Selected
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Collapse>
//           </CelestialCard>
//         </Grid>

//         {/* Nakshatra-Based Section */}
//         <Grid item xs={12}>
//           <CelestialCard>
//             <SectionHeader onClick={() => toggleSection("nakshatra")}>
//               <Star
//                 sx={{
//                   mr: 2,
//                   color: "#10B100",
//                   fontSize: { xs: "1.25rem", sm: "1.5rem" },
//                 }}
//               />
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   flexGrow: 1,
//                   fontSize: { xs: "0.875rem", sm: "1rem" },
//                 }}
//                 style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//               >
//                 Nakshatra-Based Users
//               </Typography>
//               {expandedSection === "nakshatra" ? (
//                 <ExpandLess />
//               ) : (
//                 <ExpandMore />
//               )}
//             </SectionHeader>

//             <Collapse in={expandedSection === "nakshatra"}>
//               <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     mb: 1,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//                 >
//                   Star-Based Targeting
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     mb: 3,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   Reach users based on their birth nakshatras for astrologically
//                   relevant messages
//                 </Typography>

//                 <Box sx={{ mb: 3 }}>
//                   <Box
//                     sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
//                   >
//                     {selectedNakshatras.map((nakshatra) => (
//                       <Chip
//                         key={nakshatra}
//                         label={nakshatra}
//                         onDelete={() => handleNakshatraSelect(nakshatra)}
//                         deleteIcon={
//                           <Close
//                             sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                           />
//                         }
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                           fontFamily: "Urbanist",
//                           background: "rgba(16, 177, 0, 0.1)",
//                           "& .MuiChip-label": {
//                             fontWeight: 600,
//                             fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                           },
//                         }}
//                       />
//                     ))}
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   <Grid container spacing={1}>
//                     {(showAllNakshatras ? nakshatras : initialNakshatras).map(
//                       (nakshatra) => (
//                         <Grid item xs={6} sm={4} md={3} key={nakshatra}>
//                           <Button
//                             fullWidth
//                             variant={
//                               selectedNakshatras.includes(nakshatra)
//                                 ? "contained"
//                                 : "outlined"
//                             }
//                             onClick={() => handleNakshatraSelect(nakshatra)}
//                             startIcon={
//                               <Star
//                                 sx={{
//                                   fontSize: { xs: "0.875rem", sm: "1rem" },
//                                 }}
//                               />
//                             }
//                             size={isMobile ? "small" : "medium"}
//                             sx={{
//                               fontFamily: "Urbanist",
//                               justifyContent: "flex-start",
//                               textTransform: "none",
//                               borderRadius: "8px",
//                               fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                               ...(selectedNakshatras.includes(nakshatra) && {
//                                 background: "rgba(16, 177, 0, 0.1)",
//                                 borderColor: "rgba(16, 177, 0, 0.3)",
//                                 color: "#1B4D3E",
//                                 fontWeight: 600,
//                               }),
//                             }}
//                           >
//                             {nakshatra}
//                           </Button>
//                         </Grid>
//                       )
//                     )}
//                   </Grid>

//                   <Box
//                     sx={{ mt: 2, display: "flex", justifyContent: "center" }}
//                   >
//                     <Button
//                       variant="text"
//                       size={isMobile ? "small" : "medium"}
//                       onClick={() => setShowAllNakshatras(!showAllNakshatras)}
//                       sx={{
//                         color: "#10B100",
//                         fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                         fontFamily: "Urbanist",
//                         fontWeight: 800,
//                       }}
//                     >
//                       {showAllNakshatras ? "Show Less" : "Show More"}
//                     </Button>
//                   </Box>
//                 </Box>

//                 <TextField
//                   fullWidth
//                   label="Notification Subject"
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={nakshatraNotification.title}
//                   onChange={(e) =>
//                     setNakshatraNotification({
//                       ...nakshatraNotification,
//                       title: e.target.value,
//                     })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           📢
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <TextField
//                   fullWidth
//                   label="Celestial Message"
//                   multiline
//                   rows={isMobile ? 3 : isTablet ? 4 : 5}
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={nakshatraNotification.body}
//                   onChange={(e) =>
//                     setNakshatraNotification({
//                       ...nakshatraNotification,
//                       body: e.target.value,
//                     })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           🌌
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Send />}
//                     size={isMobile ? "small" : "medium"}
//                     disabled={selectedNakshatras.length === 0 || isLoading}
//                     onClick={() => handleSendNotification("nakshatra")}
//                     sx={{
//                       fontFamily: "Urbanist",
//                       fontWeight: 800,
//                       background:
//                         selectedNakshatras.length > 0 && !isLoading
//                           ? "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)"
//                           : "rgba(0, 0, 0, 0.12)",
//                       color:
//                         selectedNakshatras.length > 0 && !isLoading
//                           ? "white"
//                           : "text.disabled",
//                       borderRadius: "50px",
//                       px: { xs: 3, sm: 4 },
//                       py: { xs: 1, sm: 1.5 },
//                       fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                       boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background:
//                           selectedNakshatras.length > 0 && !isLoading
//                             ? "linear-gradient(135deg, #388E3C 0%, #004D40 100%)"
//                             : "rgba(0, 0, 0, 0.12)",
//                         boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
//                         transform: "scale(1.02)",
//                       },
//                     }}
//                   >
//                     Send to Nakshatra
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Collapse>
//           </CelestialCard>
//         </Grid>

//         {/* Rashi-Based Section */}
//         <Grid item xs={12}>
//           <CelestialCard>
//             <SectionHeader onClick={() => toggleSection("rashi")}>
//               <Schema
//                 sx={{
//                   mr: 2,
//                   color: "#10B100",
//                   fontSize: { xs: "1.25rem", sm: "1.5rem" },
//                 }}
//               />
//               <Typography
//                 variant="subtitle1"
//                 sx={{
//                   flexGrow: 1,
//                   fontSize: { xs: "0.875rem", sm: "1rem" },
//                 }}
//                 style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//               >
//                 Rashi-Based Users
//               </Typography>
//               {expandedSection === "rashi" ? <ExpandLess /> : <ExpandMore />}
//             </SectionHeader>

//             <Collapse in={expandedSection === "rashi"}>
//               <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     mb: 1,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 800 }}
//                 >
//                   Zodiac-Based Targeting
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     mb: 3,
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                   }}
//                   style={{ fontFamily: "Urbanist", fontWeight: 600 }}
//                 >
//                   Send messages to users based on their zodiac signs for
//                   personalized astrological content
//                 </Typography>

//                 <Box sx={{ mb: 3 }}>
//                   <Box
//                     sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
//                   >
//                     {selectedRashis.map((rashi) => (
//                       <Chip
//                         key={rashi}
//                         label={rashi}
//                         onDelete={() => handleRashiSelect(rashi)}
//                         deleteIcon={
//                           <Close
//                             sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                           />
//                         }
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                           fontFamily: "Urbanist",
//                           background: "rgba(16, 177, 0, 0.1)",
//                           "& .MuiChip-label": {
//                             fontWeight: 600,
//                             fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                           },
//                         }}
//                       />
//                     ))}
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   <Grid container spacing={1}>
//                     {rashis.map((rashi) => (
//                       <Grid item xs={6} sm={4} md={3} key={rashi}>
//                         <Button
//                           fullWidth
//                           variant={
//                             selectedRashis.includes(rashi)
//                               ? "contained"
//                               : "outlined"
//                           }
//                           onClick={() => handleRashiSelect(rashi)}
//                           size={isMobile ? "small" : "medium"}
//                           sx={{
//                             fontFamily: "Urbanist",
//                             justifyContent: "flex-start",
//                             textTransform: "none",
//                             borderRadius: "8px",
//                             fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                             ...(selectedRashis.includes(rashi) && {
//                               background: "rgba(16, 177, 0, 0.1)",
//                               borderColor: "rgba(16, 177, 0, 0.3)",
//                               color: "#1B4D3E",
//                               fontWeight: 600,
//                             }),
//                           }}
//                         >
//                           {rashiSymbols[rashi]} {rashi}
//                         </Button>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Box>

//                 <TextField
//                   fullWidth
//                   label="Notification Subject"
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={rashiNotification.title}
//                   onChange={(e) =>
//                     setRashiNotification({
//                       ...rashiNotification,
//                       title: e.target.value,
//                     })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           📢
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <TextField
//                   fullWidth
//                   label="Zodiac Message"
//                   multiline
//                   rows={isMobile ? 3 : isTablet ? 4 : 5}
//                   variant="outlined"
//                   size={isMobile ? "small" : "medium"}
//                   sx={{ mb: 3 }}
//                   value={rashiNotification.body}
//                   onChange={(e) =>
//                     setRashiNotification({
//                       ...rashiNotification,
//                       body: e.target.value,
//                     })
//                   }
//                   InputLabelProps={{
//                     sx: {
//                       fontWeight: 500,
//                       color: "#455a64",
//                       fontFamily: "Urbanist",
//                       fontSize: { xs: "0.875rem", sm: "1rem" },
//                     },
//                   }}
//                   InputProps={{
//                     sx: {
//                       fontSize: "0.95rem",
//                       borderRadius: "8px",
//                       fontFamily: "Urbanist",
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Typography
//                           sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                         >
//                           ☉
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Send />}
//                     size={isMobile ? "small" : "medium"}
//                     disabled={selectedRashis.length === 0 || isLoading}
//                     onClick={() => handleSendNotification("rashi")}
//                     sx={{
//                       fontFamily: "Urbanist",
//                       fontWeight: 800,
//                       background:
//                         selectedRashis.length > 0 && !isLoading
//                           ? "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)"
//                           : "rgba(0, 0, 0, 0.12)",
//                       color:
//                         selectedRashis.length > 0 && !isLoading
//                           ? "white"
//                           : "text.disabled",
//                       borderRadius: "50px",
//                       px: { xs: 3, sm: 4 },
//                       py: { xs: 1, sm: 1.5 },
//                       fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                       boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background:
//                           selectedRashis.length > 0 && !isLoading
//                             ? "linear-gradient(135deg, #388E3C 0%, #004D40 100%)"
//                             : "rgba(0, 0, 0, 0.12)",
//                         boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
//                         transform: "scale(1.02)",
//                       },
//                     }}
//                   >
//                     Send to Rashi
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Collapse>
//           </CelestialCard>
//         </Grid>
//       </Grid>

//       {/* Snackbar for success/error messages */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default SendNotification;

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  Grid,
  Collapse,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import {
  Send,
  People,
  PersonSearch,
  Star,
  Schema,
  Close,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";

// Interfaces for TypeScript
interface User {
  id: number;
  name: string; // Maps to first_name from API
  email: string;
}

type Nakshatra = string;
type Rashi = string;

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

// Styled Components
const CelestialCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,247,250,0.9) 100%)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  border: "1px solid rgba(16, 177, 0, 0.2)",
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    borderRadius: "12px",
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  background:
    "linear-gradient(135deg, rgba(16, 177, 0, 0.1) 0%, rgba(27, 77, 62, 0.1) 100%)",
  borderBottom: "1px solid rgba(16, 177, 0, 0.1)",
  cursor: "pointer",
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(16, 177, 0, 0.15) 0%, rgba(27, 77, 62, 0.15) 100%)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

const SendNotification: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedNakshatras, setSelectedNakshatras] = useState<Nakshatra[]>([]);
  const [selectedRashis, setSelectedRashis] = useState<Rashi[]>([]);
  const [showAllNakshatras, setShowAllNakshatras] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(0);
  // const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  // console.log(setRowsPerPage(10))

  // State for notification fields
  const [allNotification, setAllNotification] = useState({
    title: "",
    body: "",
  });
  const [specificNotification, setSpecificNotification] = useState({
    title: "",
    body: "",
  });
  const [nakshatraNotification, setNakshatraNotification] = useState({
    title: "",
    body: "",
  });
  const [rashiNotification, setRashiNotification] = useState({
    title: "",
    body: "",
  });

  const nakshatras: Nakshatra[] = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishaka",
    "Anuradha",
    "Jyeshta",
    "Moola",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
  ];

  const initialNakshatras: Nakshatra[] = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
  ];

  const rashis: Rashi[] = [
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

  const rashiSymbols: { [key: string]: string } = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  };

  // Fetch users based on search and pagination
  const fetchUsers = useCallback(
    async (page: number, searchQuery: string) => {
      if (expandedSection !== "specific") return; // Only fetch when section is expanded

      setIsLoading(true);
      try {
        const params: Record<string, any> = {
          page: page + 1,
          page_size: rowsPerPage,
        };

        // Add search query as filters for "name" and "email"
        if (searchQuery.trim()) {
          params.name = searchQuery.trim();
          params.email = searchQuery.trim();
        }

        const endpoint = "api/admin/users";
        const response = await callAPI({
          endpoint,
          method: "get",
          params,
        });

        const responseData = response?.data;
        if (!responseData) {
          throw new Error("No data in response");
        }

        const fetchedUsers = Array.isArray(responseData.data)
          ? responseData.data.map((user: any) => ({
              id: user.id,
              name: user.first_name,
              email: user.email,
            }))
          : [];
        const fetchedTotal =
          typeof responseData.total === "number" ? responseData.total : 0;

        setUsers(fetchedUsers);
        setTotalCount(fetchedTotal);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setSnackbar({
          open: true,
          message: "Failed to load users. Please try again.",
          severity: "error",
        });
        setUsers([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [expandedSection, rowsPerPage]
  );

  // Trigger fetch when section is expanded or search/pagination changes
  useEffect(() => {
    if (expandedSection === "specific") {
      fetchUsers(currentPage, userSearch);
    }
  }, [expandedSection, currentPage, userSearch, fetchUsers]);

  const selectedUsers = users.filter((user) =>
    selectedUserIds.includes(user.id)
  );

  const toggleSection = (section: string): void => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserSelect = (userId: number): void => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (): void => {
    const currentPageUserIds = users.map((user) => user.id);
    setSelectedUserIds((prev) => [
      ...new Set([...prev, ...currentPageUserIds]),
    ]);
  };

  const handleDeselectAll = (): void => {
    const currentPageUserIds = users.map((user) => user.id);
    setSelectedUserIds((prev) =>
      prev.filter((id) => !currentPageUserIds.includes(id))
    );
  };

  const removeUser = (userId: number): void => {
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleNakshatraSelect = (nakshatra: Nakshatra): void => {
    if (selectedNakshatras.includes(nakshatra)) {
      setSelectedNakshatras(selectedNakshatras.filter((n) => n !== nakshatra));
    } else {
      setSelectedNakshatras([...selectedNakshatras, nakshatra]);
    }
  };

  const handleRashiSelect = (rashi: Rashi): void => {
    if (selectedRashis.includes(rashi)) {
      setSelectedRashis(selectedRashis.filter((r) => r !== rashi));
    } else {
      setSelectedRashis([...selectedRashis, rashi]);
    }
  };

  const handleSendNotification = async (type: string): Promise<void> => {
    setIsLoading(true);
    let data: any;

    if (type === "all") {
      data = {
        title: allNotification.title,
        body: allNotification.body,
      };
    } else if (type === "specific") {
      data = {
        title: specificNotification.title,
        body: specificNotification.body,
        user_ids: selectedUserIds,
      };
    } else if (type === "nakshatra") {
      data = {
        title: nakshatraNotification.title,
        body: nakshatraNotification.body,
        nakshatra: selectedNakshatras,
      };
    } else if (type === "rashi") {
      data = {
        title: rashiNotification.title,
        body: rashiNotification.body,
        rashi: selectedRashis,
      };
    }

    if (!data.title || !data.body) {
      setSnackbar({
        open: true,
        message: "Title and message are required.",
        severity: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await callAPI({
        endpoint: "api/admin/send-notification",
        method: "post",
        data,
      });
      console.log(response, "response");
      setSnackbar({
        open: true,
        message: "Notification sent successfully!",
        severity: "success",
      });

      setTimeout(() => {
        // navigate(-1);
        navigate("/dashboard/notifications/send", { replace: true });
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, sm: 4 },
          color: "#2e7d32",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
        style={{ fontFamily: "Urbanist", fontWeight: 800 }}
      >
        <Send sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
        Celestial Notifications
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* All Users Section */}
        <Grid item xs={12}>
          <CelestialCard>
            <SectionHeader onClick={() => toggleSection("all")}>
              <People
                sx={{
                  mr: 2,
                  color: "#10B100",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
                style={{ fontFamily: "Urbanist", fontWeight: 800 }}
              >
                Broadcast to All Users
              </Typography>
              {expandedSection === "all" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "all"}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 800 }}
                >
                  Mass Notification
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                >
                  Send announcements or updates to all registered users
                  instantly
                </Typography>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={allNotification.title}
                  onChange={(e) =>
                    setAllNotification({
                      ...allNotification,
                      title: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          📢
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Notification Message"
                  multiline
                  rows={isMobile ? 3 : isTablet ? 4 : 5}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={allNotification.body}
                  onChange={(e) =>
                    setAllNotification({
                      ...allNotification,
                      body: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          ✉️
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleSendNotification("all")}
                    disabled={isLoading}
                    sx={{
                      fontFamily: "Urbanist",
                      fontWeight: 800,
                      background: isLoading
                        ? "rgba(0, 0, 0, 0.12)"
                        : "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)",
                      color: isLoading ? "text.disabled" : "white",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: isLoading
                          ? "rgba(0, 0, 0, 0.12)"
                          : "linear-gradient(135deg, #388E3C 0%, #004D40 100%)",
                        boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Send to All
                  </Button>
                </Box>
              </CardContent>
            </Collapse>
          </CelestialCard>
        </Grid>

        {/* Specific User Section */}
        <Grid item xs={12}>
          <CelestialCard>
            <SectionHeader onClick={() => toggleSection("specific")}>
              <PersonSearch
                sx={{
                  mr: 2,
                  color: "#10B100",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
                style={{ fontFamily: "Urbanist", fontWeight: 800 }}
              >
                Target Specific Users
              </Typography>
              {expandedSection === "specific" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "specific"}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 800 }}
                >
                  Personalized Notifications
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                >
                  Select individual users for tailored messages or updates
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel
                    id="select-user-label"
                    shrink={isDropdownOpen || selectedUserIds.length > 0}
                    sx={{
                      transform:
                        isDropdownOpen || selectedUserIds.length > 0
                          ? "translate(14px, -6px) scale(0.75)"
                          : "translate(14px, 16px) scale(1)",
                      backgroundColor: "white",
                      padding: "0 4px",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontFamily: "Urbanist",
                    }}
                  >
                    Select Users
                  </InputLabel>
                  <Select
                    labelId="select-user-label"
                    open={isDropdownOpen}
                    onOpen={toggleDropdown}
                    onClose={toggleDropdown}
                    value={selectedUserIds}
                    multiple
                    displayEmpty
                    renderValue={() =>
                      selectedUserIds.length === 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                          }}
                        >
                          {/* Placeholder content */}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          {selectedUsers.slice(0, 3).map((user) => (
                            <Chip
                              key={user.id}
                              label={user.name}
                              size={isMobile ? "small" : "medium"}
                              onDelete={(e) => {
                                e.stopPropagation();
                                removeUser(user.id);
                              }}
                              deleteIcon={
                                <Close
                                  sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                  }}
                                />
                              }
                              sx={{
                                backgroundColor: "rgba(16, 177, 0, 0.1)",
                                color: "#1B4D3E",
                                "& .MuiChip-label": {
                                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                },
                              }}
                            />
                          ))}
                          {selectedUsers.length > 3 && (
                            <Chip
                              label={`+${selectedUsers.length - 3} more`}
                              size={isMobile ? "small" : "medium"}
                              sx={{
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                                color: "text.primary",
                                "& .MuiChip-label": {
                                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                },
                              }}
                            />
                          )}
                        </Box>
                      )
                    }
                    sx={{
                      fontFamily: "Urbanist",
                      fontSize: "0.9rem",
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        minHeight: { xs: "36px", sm: "40px" },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        top: 0,
                      },
                      "& legend": {
                        display: "none",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                          width: "auto",
                        },
                        sx: {
                          display: "flex",
                          flexDirection: "column",
                        },
                      },
                    }}
                  >
                    {/* Search Bar */}
                    <Box
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "white",
                        zIndex: 1,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        p: 1,
                      }}
                    >
                      <TextField
                        fullWidth
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setUserSearch(e.target.value);
                          setCurrentPage(0); // Reset to first page on search
                        }}
                        size={isMobile ? "small" : "medium"}
                        variant="outlined"
                        InputLabelProps={{
                          sx: {
                            fontWeight: 500,
                            color: "#455a64",
                            fontFamily: "Urbanist",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                        InputProps={{
                          sx: {
                            fontSize: "0.95rem",
                            borderRadius: "8px",
                            fontFamily: "Urbanist",
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonSearch
                                sx={{
                                  fontSize: { xs: "0.875rem", sm: "1rem" },
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </Box>

                    {/* Select All / Deselect All Buttons */}
                    <Box
                      sx={{
                        position: "sticky",
                        top: 56,
                        backgroundColor: "white",
                        zIndex: 1,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        p: 1,
                      }}
                    >
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAll();
                        }}
                        sx={{ py: 0.5 }}
                        style={{ fontFamily: "Urbanist" }}
                      >
                        <Typography
                          sx={{
                            color: "#10B100",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          Select All
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeselectAll();
                        }}
                        sx={{ py: 0.5 }}
                        style={{ fontFamily: "Urbanist" }}
                      >
                        <Typography
                          sx={{
                            color: "#1B4D3E",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          Deselect All
                        </Typography>
                      </MenuItem>
                    </Box>

                    {/* User List */}
                    <Box sx={{ overflowY: "auto", maxHeight: 250 }}>
                      {isLoading ? (
                        // Display multiple skeleton placeholders to match the number of items per page
                        Array.from({ length: rowsPerPage }).map((_, index) => (
                          <MenuItem
                            key={`loading-${index}`}
                            disabled
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 1,
                              minHeight: 48, // Match the height of a user list item
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                borderRadius: "4px",
                                mr: 2,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Box
                                sx={{
                                  width: "60%",
                                  height: 16,
                                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                                  borderRadius: 2,
                                  mb: 0.5,
                                }}
                              />
                              <Box
                                sx={{
                                  width: "40%",
                                  height: 12,
                                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                                  borderRadius: 2,
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))
                      ) : users.length > 0 ? (
                        users.map((user) => (
                          <MenuItem
                            key={user.id}
                            value={user.id}
                            onClick={() => handleUserSelect(user.id)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 1,
                              minHeight: 48, // Ensure consistent height for user items
                            }}
                            style={{ fontFamily: "Urbanist" }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                border: selectedUserIds.includes(user.id)
                                  ? "1px solid #10B100"
                                  : "1px solid rgba(0, 0, 0, 0.23)",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                                backgroundColor: selectedUserIds.includes(
                                  user.id
                                )
                                  ? "#10B100"
                                  : "transparent",
                              }}
                            >
                              {selectedUserIds.includes(user.id) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  fill="white"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L6 9.293 4.354 7.646a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l6-6z" />
                                </svg>
                              )}
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: { xs: "0.875rem", sm: "1rem" },
                                }}
                                style={{
                                  fontFamily: "Urbanist",
                                  fontWeight: 600,
                                }}
                              >
                                {user.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                }}
                                style={{
                                  fontFamily: "Urbanist",
                                  fontWeight: 600,
                                }}
                              >
                                {user.email}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem
                          disabled
                          sx={{
                            py: 1,
                            minHeight: 48, // Match the height of a user list item
                          }}
                        >
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              color: "text.secondary",
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                            style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                          >
                            No users found
                          </Typography>
                        </MenuItem>
                      )}
                    </Box>

                    {/* Pagination Inside Dropdown */}
                    {totalCount > rowsPerPage && (
                      <Box
                        sx={{
                          position: "sticky",
                          bottom: 0,
                          backgroundColor: "white",
                          zIndex: 1,
                          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                          p: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Pagination
                          count={Math.ceil(totalCount / rowsPerPage)}
                          page={currentPage + 1}
                          onChange={(event, page) => {
                            setCurrentPage(page - 1);
                            event.stopPropagation();
                          }}
                          color="primary"
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            "& .MuiPaginationItem-root": {
                              fontFamily: "Urbanist",
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Select>
                </FormControl>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 3,
                    color: "text.secondary",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 500 }}
                >
                  {selectedUsers.length} users selected
                </Typography>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={specificNotification.title}
                  onChange={(e) =>
                    setSpecificNotification({
                      ...specificNotification,
                      title: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          📢
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Personalized Message"
                  multiline
                  rows={isMobile ? 3 : isTablet ? 4 : 5}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={specificNotification.body}
                  onChange={(e) =>
                    setSpecificNotification({
                      ...specificNotification,
                      body: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          ✉️
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    disabled={selectedUsers.length === 0 || isLoading}
                    onClick={() => handleSendNotification("specific")}
                    sx={{
                      fontFamily: "Urbanist",
                      fontWeight: 800,
                      background:
                        selectedUsers.length > 0 && !isLoading
                          ? "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)"
                          : "rgba(0, 0, 0, 0.12)",
                      color:
                        selectedUsers.length > 0 && !isLoading
                          ? "white"
                          : "text.disabled",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          selectedUsers.length > 0 && !isLoading
                            ? "linear-gradient(135deg, #388E3C 0%, #004D40 100%)"
                            : "rgba(0, 0, 0, 0.12)",
                        boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Send to Selected
                  </Button>
                </Box>
              </CardContent>
            </Collapse>
          </CelestialCard>
        </Grid>

        {/* Nakshatra-Based Section */}
        <Grid item xs={12}>
          <CelestialCard>
            <SectionHeader onClick={() => toggleSection("nakshatra")}>
              <Star
                sx={{
                  mr: 2,
                  color: "#10B100",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
                style={{ fontFamily: "Urbanist", fontWeight: 800 }}
              >
                Nakshatra-Based Users
              </Typography>
              {expandedSection === "nakshatra" ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </SectionHeader>

            <Collapse in={expandedSection === "nakshatra"}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 800 }}
                >
                  Star-Based Targeting
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                >
                  Reach users based on their birth nakshatras for astrologically
                  relevant messages
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {selectedNakshatras.map((nakshatra) => (
                      <Chip
                        key={nakshatra}
                        label={nakshatra}
                        onDelete={() => handleNakshatraSelect(nakshatra)}
                        deleteIcon={
                          <Close
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          />
                        }
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          fontFamily: "Urbanist",
                          background: "rgba(16, 177, 0, 0.1)",
                          "& .MuiChip-label": {
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1}>
                    {(showAllNakshatras ? nakshatras : initialNakshatras).map(
                      (nakshatra) => (
                        <Grid item xs={6} sm={4} md={3} key={nakshatra}>
                          <Button
                            fullWidth
                            variant={
                              selectedNakshatras.includes(nakshatra)
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => handleNakshatraSelect(nakshatra)}
                            startIcon={
                              <Star
                                sx={{
                                  fontSize: { xs: "0.875rem", sm: "1rem" },
                                }}
                              />
                            }
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              fontFamily: "Urbanist",
                              justifyContent: "flex-start",
                              textTransform: "none",
                              borderRadius: "8px",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              ...(selectedNakshatras.includes(nakshatra) && {
                                background: "rgba(16, 177, 0, 0.1)",
                                borderColor: "rgba(16, 177, 0, 0.3)",
                                color: "#1B4D3E",
                                fontWeight: 600,
                              }),
                            }}
                          >
                            {nakshatra}
                          </Button>
                        </Grid>
                      )
                    )}
                  </Grid>

                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="text"
                      size={isMobile ? "small" : "medium"}
                      onClick={() => setShowAllNakshatras(!showAllNakshatras)}
                      sx={{
                        color: "#10B100",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        fontFamily: "Urbanist",
                        fontWeight: 800,
                      }}
                    >
                      {showAllNakshatras ? "Show Less" : "Show More"}
                    </Button>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={nakshatraNotification.title}
                  onChange={(e) =>
                    setNakshatraNotification({
                      ...nakshatraNotification,
                      title: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          📢
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Celestial Message"
                  multiline
                  rows={isMobile ? 3 : isTablet ? 4 : 5}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={nakshatraNotification.body}
                  onChange={(e) =>
                    setNakshatraNotification({
                      ...nakshatraNotification,
                      body: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          🌌
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    disabled={selectedNakshatras.length === 0 || isLoading}
                    onClick={() => handleSendNotification("nakshatra")}
                    sx={{
                      fontFamily: "Urbanist",
                      fontWeight: 800,
                      background:
                        selectedNakshatras.length > 0 && !isLoading
                          ? "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)"
                          : "rgba(0, 0, 0, 0.12)",
                      color:
                        selectedNakshatras.length > 0 && !isLoading
                          ? "white"
                          : "text.disabled",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          selectedNakshatras.length > 0 && !isLoading
                            ? "linear-gradient(135deg, #388E3C 0%, #004D40 100%)"
                            : "rgba(0, 0, 0, 0.12)",
                        boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Send to Nakshatra
                  </Button>
                </Box>
              </CardContent>
            </Collapse>
          </CelestialCard>
        </Grid>

        {/* Rashi-Based Section */}
        <Grid item xs={12}>
          <CelestialCard>
            <SectionHeader onClick={() => toggleSection("rashi")}>
              <Schema
                sx={{
                  mr: 2,
                  color: "#10B100",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
                style={{ fontFamily: "Urbanist", fontWeight: 800 }}
              >
                Rashi-Based Users
              </Typography>
              {expandedSection === "rashi" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "rashi"}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 800 }}
                >
                  Zodiac-Based Targeting
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                  style={{ fontFamily: "Urbanist", fontWeight: 600 }}
                >
                  Send messages to users based on their zodiac signs for
                  personalized astrological content
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {selectedRashis.map((rashi) => (
                      <Chip
                        key={rashi}
                        label={rashi}
                        onDelete={() => handleRashiSelect(rashi)}
                        deleteIcon={
                          <Close
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          />
                        }
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          fontFamily: "Urbanist",
                          background: "rgba(16, 177, 0, 0.1)",
                          "& .MuiChip-label": {
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1}>
                    {rashis.map((rashi) => (
                      <Grid item xs={6} sm={4} md={3} key={rashi}>
                        <Button
                          fullWidth
                          variant={
                            selectedRashis.includes(rashi)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleRashiSelect(rashi)}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            fontFamily: "Urbanist",
                            justifyContent: "flex-start",
                            textTransform: "none",
                            borderRadius: "8px",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            ...(selectedRashis.includes(rashi) && {
                              background: "rgba(16, 177, 0, 0.1)",
                              borderColor: "rgba(16, 177, 0, 0.3)",
                              color: "#1B4D3E",
                              fontWeight: 600,
                            }),
                          }}
                        >
                          {rashiSymbols[rashi]} {rashi}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={rashiNotification.title}
                  onChange={(e) =>
                    setRashiNotification({
                      ...rashiNotification,
                      title: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          📢
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Zodiac Message"
                  multiline
                  rows={isMobile ? 3 : isTablet ? 4 : 5}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  value={rashiNotification.body}
                  onChange={(e) =>
                    setRashiNotification({
                      ...rashiNotification,
                      body: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                      color: "#455a64",
                      fontFamily: "Urbanist",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      fontFamily: "Urbanist",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          ☉
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    disabled={selectedRashis.length === 0 || isLoading}
                    onClick={() => handleSendNotification("rashi")}
                    sx={{
                      fontFamily: "Urbanist",
                      fontWeight: 800,
                      background:
                        selectedRashis.length > 0 && !isLoading
                          ? "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)"
                          : "rgba(0, 0, 0, 0.12)",
                      color:
                        selectedRashis.length > 0 && !isLoading
                          ? "white"
                          : "text.disabled",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          selectedRashis.length > 0 && !isLoading
                            ? "linear-gradient(135deg, #388E3C 0%, #004D40 100%)"
                            : "rgba(0, 0, 0, 0.12)",
                        boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Send to Rashi
                  </Button>
                </Box>
              </CardContent>
            </Collapse>
          </CelestialCard>
        </Grid>
      </Grid>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SendNotification;
