import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Avatar,
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
  Checkbox,
  ListItemText,
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
}));

const SendNotification: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedNakshatras, setSelectedNakshatras] = useState<Nakshatra[]>([]);
  const [selectedRashis, setSelectedRashis] = useState<Rashi[]>([]);
  const [showAllNakshatras, setShowAllNakshatras] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");

  // Responsive font sizes
  const titleVariant = isMobile ? "h5" : "h4";
  const subtitleVariant = isMobile ? "subtitle2" : "subtitle1";
  const bodyVariant = isMobile ? "body2" : "body1";
  const buttonSize = isMobile ? "small" : "medium";
  const chipSize = isMobile ? "small" : "medium";

  // Sample data
  const users: User[] = [
    { id: 1, name: "Rahul", email: "rahul@example.com" },
    { id: 2, name: "Priya", email: "priya@example.com" },
    { id: 3, name: "Manasa", email: "manasa@example.com" },
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

  // Update selectedUsers whenever selectedUserIds changes
  useEffect(() => {
    const newSelectedUsers = users.filter(user => selectedUserIds.includes(user.id));
    setSelectedUsers(newSelectedUsers);
  }, [selectedUserIds]);

  const toggleSection = (section: string): void => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleUserSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value as unknown as number[];
    setSelectedUserIds(value);
  };

  const handleSelectAll = (): void => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    setSelectedUserIds([...new Set([...selectedUserIds, ...filteredUserIds])]);
  };

  const handleDeselectAll = (): void => {
    if (userSearch) {
      const filteredUserIds = filteredUsers.map(user => user.id);
      setSelectedUserIds(selectedUserIds.filter(id => !filteredUserIds.includes(id)));
    } else {
      setSelectedUserIds([]);
    }
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

  const filteredUsers: User[] = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography
        variant={titleVariant}
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "#1B4D3E",
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Send fontSize="medium" />
        Celestial Notifications
      </Typography>
      
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* All Users Section */}
        <Grid item xs={12}>
          <CelestialCard>
            <SectionHeader onClick={() => toggleSection("all")}>
              <People sx={{ mr: 2, color: "#10B100", fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
              <Typography variant={subtitleVariant} sx={{ flexGrow: 1, fontWeight: 600 }}>
                Broadcast to All Users
              </Typography>
              {expandedSection === "all" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "all"}>
              <CardContent>
                <Typography variant={subtitleVariant} sx={{ fontWeight: 600, mb: 1 }}>
                  Mass Notification
                </Typography>
                <Typography variant={bodyVariant} sx={{ mb: 3 }}>
                  Send announcements or updates to all registered users instantly
                </Typography>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>📢</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Notification Message"
                  multiline
                  rows={isMobile ? 3 : 4}
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>✉️</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={buttonSize}
                    onClick={() => handleSendNotification("all")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)",
                      borderRadius: "50px",
                      px: isMobile ? 3 : 4,
                      py: isMobile ? 1 : 1.5,
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
              <PersonSearch sx={{ mr: 2, color: "#10B100", fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
              <Typography variant={subtitleVariant} sx={{ flexGrow: 1, fontWeight: 600 }}>
                Target Specific Users
              </Typography>
              {expandedSection === "specific" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "specific"}>
              <CardContent>
                <Typography variant={subtitleVariant} sx={{ fontWeight: 600, mb: 1 }}>
                  Personalized Notifications
                </Typography>
                <Typography variant={bodyVariant} sx={{ mb: 3 }}>
                  Select individual users for tailored messages or updates
                </Typography>

                {/* User selection with checkboxes */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="user-checkbox-label">Select Users</InputLabel>
                  <Select
                    labelId="user-checkbox-label"
                    id="user-checkbox"
                    multiple
                    value={selectedUserIds}
                    onChange={handleUserSelect}
                    renderValue={(selected) => `${selected.length} users selected`}
                    size={buttonSize}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center', // <-- align from center of anchor
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'center', // <-- appear centered under Select
                      },
                    }}                    
                  >
                    {/* Search field inside dropdown */}
                    <MenuItem 
                      sx={{ p: 1, position: "sticky", top: 0, background: "white", zIndex: 1 }}
                      disableRipple
                      onKeyDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TextField
                        fullWidth
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserSearch(e.target.value)}
                        size={buttonSize}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonSearch fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </MenuItem>
                    
                    {/* Select All / Deselect All buttons */}
                    <MenuItem 
                      sx={{ p: 1, position: "sticky", top: isMobile ? 56 : 64, background: "white", zIndex: 1 }}
                      disableRipple
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleSelectAll}
                          sx={{ color: '#10B100', borderColor: '#10B100', flex: 1, mr: 1 }}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleDeselectAll}
                          sx={{ color: '#1B4D3E', borderColor: '#1B4D3E', flex: 1 }}
                        >
                          Deselect All
                        </Button>
                      </Box>
                    </MenuItem>
                    
                    <Divider />
                    
                    {/* User options with checkboxes */}
                    {filteredUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Checkbox checked={selectedUserIds.includes(user.id)} />
                        <ListItemText 
                          primary={user.name} 
                          secondary={user.email}
                          primaryTypographyProps={{ variant: bodyVariant }}
                          secondaryTypographyProps={{ variant: isMobile ? 'caption' : bodyVariant }} 
                        />
                      </MenuItem>
                    ))}
                    
                    {filteredUsers.length === 0 && (
                      <MenuItem disabled>
                        <Typography variant={bodyVariant} sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                          No users found
                        </Typography>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Box sx={{ mb: 3 }}>
                  <Typography variant={bodyVariant} gutterBottom>
                    Selected Users ({selectedUsers.length})
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>📢</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Personalized Message"
                  multiline
                  rows={isMobile ? 3 : 4}
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>✉️</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={buttonSize}
                    disabled={selectedUsers.length === 0}
                    onClick={() => handleSendNotification("specific")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)",
                      borderRadius: "50px",
                      px: isMobile ? 3 : 4,
                      py: isMobile ? 1 : 1.5,
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
              <Star sx={{ mr: 2, color: "#10B100", fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
              <Typography variant={subtitleVariant} sx={{ flexGrow: 1, fontWeight: 600 }}>
                Nakshatra-Based Users
              </Typography>
              {expandedSection === "nakshatra" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "nakshatra"}>
              <CardContent>
                <Typography variant={subtitleVariant} sx={{ fontWeight: 600, mb: 1 }}>
                  Star-Based Targeting
                </Typography>
                <Typography variant={bodyVariant} sx={{ mb: 3 }}>
                  Reach users based on their birth nakshatras for astrologically relevant messages
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {selectedNakshatras.map((nakshatra) => (
                      <Chip
                        key={nakshatra}
                        label={nakshatra}
                        onDelete={() => handleNakshatraSelect(nakshatra)}
                        deleteIcon={<Close fontSize={chipSize} />}
                        size={chipSize}
                        sx={{
                          background: "rgba(16, 177, 0, 0.1)",
                          "& .MuiChip-label": {
                            fontWeight: 600,
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
                          startIcon={<Star fontSize={chipSize} />}
                          size={buttonSize}
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            borderRadius: "8px",
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
                      size={buttonSize}
                      onClick={() => setShowAllNakshatras(!showAllNakshatras)}
                      sx={{ color: "#10B100" }}
                    >
                      {showAllNakshatras ? "Show Less" : "Show More"}
                    </Button>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Notification Subject"
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>📢</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Celestial Message"
                  multiline
                  rows={isMobile ? 3 : 4}
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>🌌</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={buttonSize}
                    disabled={selectedNakshatras.length === 0}
                    onClick={() => handleSendNotification("nakshatra")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)",
                      borderRadius: "50px",
                      px: isMobile ? 3 : 4,
                      py: isMobile ? 1 : 1.5,
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
              <Schema sx={{ mr: 2, color: "#10B100", fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
              <Typography variant={subtitleVariant} sx={{ flexGrow: 1, fontWeight: 600 }}>
                Rashi-Based Users
              </Typography>
              {expandedSection === "rashi" ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>

            <Collapse in={expandedSection === "rashi"}>
              <CardContent>
                <Typography variant={subtitleVariant} sx={{ fontWeight: 600, mb: 1 }}>
                  Zodiac-Based Targeting
                </Typography>
                <Typography variant={bodyVariant} sx={{ mb: 3 }}>
                  Send messages to users based on their zodiac signs for personalized astrological content
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {selectedRashis.map((rashi) => (
                      <Chip
                        key={rashi}
                        label={rashi}
                        onDelete={() => handleRashiSelect(rashi)}
                        deleteIcon={<Close fontSize={chipSize} />}
                        size={chipSize}
                        sx={{
                          background: "rgba(16, 177, 0, 0.1)",
                          "& .MuiChip-label": {
                            fontWeight: 600,
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
                          size={buttonSize}
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            borderRadius: "8px",
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
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>📢</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Zodiac Message"
                  multiline
                  rows={isMobile ? 3 : 4}
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>♋️</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    size={buttonSize}
                    disabled={selectedRashis.length === 0}
                    onClick={() => handleSendNotification("rashi")}
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B100 0%, #1B4D3E 100%)",
                      borderRadius: "50px",
                      px: isMobile ? 3 : 4,
                      py: isMobile ? 1 : 1.5,
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