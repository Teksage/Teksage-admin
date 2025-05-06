import { useState } from "react";
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

// Interfaces for TypeScript
interface User {
  id: number;
  name: string;
  email: string;
}

type Nakshatra = string;
type Rashi = string;

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

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedNakshatras, setSelectedNakshatras] = useState<Nakshatra[]>([]);
  const [selectedRashis, setSelectedRashis] = useState<Rashi[]>([]);
  const [showAllNakshatras, setShowAllNakshatras] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Sample data
  const users: User[] = [
    { id: 1, name: "Rahul", email: "rahul@example.com" },
    { id: 2, name: "Priya", email: "priya@example.com" },
    { id: 3, name: "Manasa", email: "manasa@example.com" },
    { id: 4, name: "Arjun", email: "arjun@example.com" },
    { id: 5, name: "Divya", email: "divya@example.com" },
    { id: 6, name: "Sandeep", email: "sandeep@example.com" },
  ];

  const nakshatras: Nakshatra[] = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishaka", "Anuradha",
    "Jyeshta", "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana",
    "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada",
    "Revati",
  ];

  const initialNakshatras: Nakshatra[] = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha",
  ];

  const rashis: Rashi[] = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
  ];

  const selectedUsers = users.filter((user) => selectedUserIds.includes(user.id));

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
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
    const filteredUserIds = filteredUsers.map((user) => user.id);
    setSelectedUserIds((prev) => [...new Set([...prev, ...filteredUserIds])]);
  };

  const handleDeselectAll = (): void => {
    if (userSearch) {
      const filteredUserIds = filteredUsers.map((user) => user.id);
      setSelectedUserIds((prev) => prev.filter((id) => !filteredUserIds.includes(id)));
    } else {
      setSelectedUserIds([]);
    }
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

  const handleSendNotification = (type: string): void => {
    console.log(`Sending ${type} notification`);
    // Add your notification sending logic here
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#1B4D3E",
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.6rem" },
        }}
      >
        <Send sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
        Celestial Notifications
      </Typography>
      
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* All Users Section */}
        <Grid item xs={12}>
          <CelestialCard>
            <SectionHeader onClick={() => toggleSection("all")}>
              <People sx={{ mr: 2, color: "#10B100", fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
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
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Mass Notification
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Send announcements or updates to all registered users instantly
                </Typography>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  InputProps={{
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
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
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
                  InputProps={{
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
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleSendNotification("all")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
              <PersonSearch sx={{ mr: 2, color: "#10B100", fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
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
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Personalized Notifications
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
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
                        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                          {/* <People sx={{ mr: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }} /> */}
                          {/* <Typography
                            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                          >
                            Select users...
                          </Typography> */}
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                          {selectedUsers.slice(0, 3).map((user) => (
                            <Chip
                              key={user.id}
                              label={user.name}
                              size={isMobile ? "small" : "medium"}
                              onDelete={(e) => {
                                e.stopPropagation();
                                removeUser(user.id);
                              }}
                              deleteIcon={<Close sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />}
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
                      "& .MuiSelect-select": { display: "flex", alignItems: "center", minHeight: { xs: "36px", sm: "40px" } },
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setUserSearch(e.target.value)
                        }
                        size={isMobile ? "small" : "medium"}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonSearch sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }} />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </Box>
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
                    <Box sx={{ overflowY: "auto", maxHeight: 300 }}>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <MenuItem
                            key={user.id}
                            value={user.id}
                            onClick={() => handleUserSelect(user.id)}
                            sx={{ display: "flex", alignItems: "center", py: 1 }}
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
                                backgroundColor: selectedUserIds.includes(user.id)
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
                                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                              >
                                {user.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                              >
                                {user.email}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              color: "text.secondary",
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            No users found
                          </Typography>
                        </MenuItem>
                      )}
                    </Box>
                  </Select>
                </FormControl>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 3,
                    color: "text.secondary",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {selectedUsers.length} users selected
                </Typography>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ mb: 3 }}
                  InputProps={{
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
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
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
                  InputProps={{
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
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    disabled={selectedUsers.length === 0}
                    onClick={() => handleSendNotification("specific")}
                    sx={{
                      background:
                        selectedUsers.length > 0
                          ? "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)"
                          : "rgba(0, 0, 0, 0.12)",
                      color: selectedUsers.length > 0 ? "white" : "text.disabled",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
              <Star sx={{ mr: 2, color: "#10B100", fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Nakshatra-Based Users
              </Typography>
              {expandedSection === "nakshatra" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "nakshatra"}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Star-Based Targeting
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Reach users based on their birth nakshatras for astrologically relevant messages
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {selectedNakshatras.map((nakshatra) => (
                      <Chip
                        key={nakshatra}
                        label={nakshatra}
                        onDelete={() => handleNakshatraSelect(nakshatra)}
                        deleteIcon={<Close sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />}
                        size={isMobile ? "small" : "medium"}
                        sx={{
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
                    {(showAllNakshatras ? nakshatras : initialNakshatras).map((nakshatra) => (
                      <Grid item xs={6} sm={4} md={3} key={nakshatra}>
                        <Button
                          fullWidth
                          variant={
                            selectedNakshatras.includes(nakshatra)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleNakshatraSelect(nakshatra)}
                          startIcon={<Star sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }} />}
                          size={isMobile ? "small" : "medium"}
                          sx={{
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
                    ))}
                  </Grid>

                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="text"
                      size={isMobile ? "small" : "medium"}
                      onClick={() => setShowAllNakshatras(!showAllNakshatras)}
                      sx={{
                        color: "#10B100",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                  InputProps={{
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
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
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
                  InputProps={{
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
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    disabled={selectedNakshatras.length === 0}
                    onClick={() => handleSendNotification("nakshatra")}
                    sx={{
                      background:
                        selectedNakshatras.length > 0
                          ? "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)"
                          : "rgba(0, 0, 0, 0.12)",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
              <Schema sx={{ mr: 2, color: "#10B100", fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
              <Typography
                variant="subtitle1"
                sx={{
                  flexGrow: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
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
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Zodiac-Based Targeting
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Send messages to users based on their zodiac signs for personalized astrological content
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {selectedRashis.map((rashi) => (
                      <Chip
                        key={rashi}
                        label={rashi}
                        onDelete={() => handleRashiSelect(rashi)}
                        deleteIcon={<Close sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />}
                        size={isMobile ? "small" : "medium"}
                        sx={{
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
                          {rashi}
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
                  InputProps={{
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
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          ♋️
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: "0.875rem", sm: "1rem" } },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={isMobile ? "small" : "medium"}
                    disabled={selectedRashis.length === 0}
                    onClick={() => handleSendNotification("rashi")}
                    sx={{
                      background:
                        selectedRashis.length > 0
                          ? "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)"
                          : "rgba(0, 0, 0, 0.12)",
                      borderRadius: "50px",
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
    </Box>
  );
};

export default SendNotification;