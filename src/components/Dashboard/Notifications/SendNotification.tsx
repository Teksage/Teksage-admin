import { useState } from "react";
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
  Paper,
  Grid,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Send,
  People,
  PersonSearch,
  Star,
  Schema,
  Close,
  CheckCircle,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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

const SendNotification = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedNakshatras, setSelectedNakshatras] = useState([]);
  const [selectedRashis, setSelectedRashis] = useState([]);

  // Responsive font sizes
  const titleVariant = isMobile ? "h5" : "h4";
  const subtitleVariant = isMobile ? "subtitle2" : "subtitle1";
  const bodyVariant = isMobile ? "body2" : "body1";
  const buttonSize = isMobile ? "small" : "medium";
  const chipSize = isMobile ? "small" : "medium";

  // Sample data
  const users = [
    { id: 1, name: "Rahul", email: "rahul@example.com" },
    { id: 2, name: "Priya", email: "priya@example.com" },
    { id: 3, name: "Manasa", email: "manasa@example.com" },
  ];

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha"
  ];

  const rashis = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleNakshatraSelect = (nakshatra) => {
    if (selectedNakshatras.includes(nakshatra)) {
      setSelectedNakshatras(selectedNakshatras.filter((n) => n !== nakshatra));
    } else {
      setSelectedNakshatras([...selectedNakshatras, nakshatra]);
    }
  };

  const handleRashiSelect = (rashi) => {
    if (selectedRashis.includes(rashi)) {
      setSelectedRashis(selectedRashis.filter((r) => r !== rashi));
    } else {
      setSelectedRashis([...selectedRashis, rashi]);
    }
  };

  const handleSendNotification = (type) => {
    console.log(`Sending ${type} notification`);
    // Add your notification sending logic here
  };

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
        <Send fontSize={"medium"} />
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
                <TextField
                  fullWidth
                  label="Notification Title"
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
                  label="Your Message"
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
                <TextField
                  fullWidth
                  label="Search Users"
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant={bodyVariant}>🔍</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ mb: 3 }}>
                  <Typography variant={bodyVariant} gutterBottom>
                    Selected Users ({selectedUsers.length})
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {selectedUsers.map((user) => (
                      <Chip
                        key={user.id}
                        label={user.name}
                        onDelete={() => handleUserSelect(user)}
                        deleteIcon={<Close fontSize={chipSize} />}
                        avatar={<Avatar sx={{ width: 24, height: 24 }}>{user.name.charAt(0)}</Avatar>}
                        size={chipSize}
                        sx={{ background: "rgba(16, 177, 0, 0.1)" }}
                      />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant={bodyVariant} gutterBottom>
                    Available Users
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                    {users.map((user) => (
                      <Paper
                        key={user.id}
                        elevation={0}
                        sx={{
                          p: isMobile ? 1 : 2,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          background: selectedUsers.some((u) => u.id === user.id)
                            ? "rgba(16, 177, 0, 0.05)"
                            : "transparent",
                          border: "1px solid rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          "&:hover": {
                            background: "rgba(16, 177, 0, 0.05)",
                          },
                        }}
                        onClick={() => handleUserSelect(user)}
                      >
                        <Avatar sx={{ mr: 2, bgcolor: "#10B100", width: 32, height: 32 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant={bodyVariant}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                        {selectedUsers.some((u) => u.id === user.id) && (
                          <CheckCircle color="success" fontSize={chipSize} />
                        )}
                      </Paper>
                    ))}
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Personalized Message"
                  multiline
                  rows={isMobile ? 3 : 4}
                  variant="outlined"
                  size={buttonSize}
                  sx={{ mb: 3 }}
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
                <Typography variant={bodyVariant} gutterBottom sx={{ mb: 2 }}>
                  Select one or more Nakshatras to target users born under these stars
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
                    {nakshatras.map((nakshatra) => (
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
                </Box>

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
                <Typography variant={bodyVariant} gutterBottom sx={{ mb: 2 }}>
                  Select Rashis to target users based on their moon signs
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