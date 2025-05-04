// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Divider,
//   Grid,
//   Paper,
//   Button,
//   Skeleton,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate, useParams } from "react-router-dom";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { callAPI } from "../../../api/crudFactory"; // adjust path if needed
// import DescriptionIcon from "@mui/icons-material/Description";
// import StarIcon from "@mui/icons-material/Star";

// interface UserData {
//   astrologer_id: number;
//   name: string;
//   email: string;
//   user_type: string;
//   status: string;
//   rasi: string;
//   nakshatram: string;
//   plan: string;
//   user: any;
// }

// interface SubscriptionData {
//   plan_name: string;
//   date_of_subscription: string;
//   subscription_end_date: string;
// }

// interface ConsultationData {
//   user_horoscope: string;
//   category: string;
//   languages: string[];
//   booking_date: string;
//   start_time: string;
//   end_time: string;
//   consultation_fee: string;
//   rating: number;
//   astrologer_name: string;
// }

// const AstroUserView: React.FC<{ mode: "view" }> = ({ mode }) => {
//   const navigate = useNavigate();
//   const { userId } = useParams<{ userId: string }>();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [subscriptionData, setSubscriptionData] =
//     useState<SubscriptionData | null>(null);
//   const [consultationData, setConsultationData] =
//     useState<ConsultationData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await callAPI({
//           endpoint: `api/admin/astrologers/${userId}`,
//           method: "get",
//         });
//         console.log(res, "res")
//         setUserData(res?.data || null);
//         // setSubscriptionData(res?.data?.subscription || null);
//         // setConsultationData(res?.data?.consultation || null);
//         setSubscriptionData({
//           plan_name: "Premium Plan",
//           date_of_subscription: "2025-04-01",
//           subscription_end_date: "2025-07-01",
//         });
//         setConsultationData({
//           user_horoscope: "https://example.com/horoscope.pdf",
//           category: "Love & Relationship",
//           languages: ["English", "Hindi"],
//           booking_date: "2025-04-15",
//           start_time: "10:00 AM",
//           end_time: "10:30 AM",
//           consultation_fee: "500",
//           rating: 4.5,
//           astrologer_name: "Astro Suresh",
//         });
//       } catch (err) {
//         setUserData(null);
//         setSubscriptionData(null);
//         setConsultationData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUser();
//     }
//   }, [userId]);

//   const InfoItem = ({
//     label,
//     value,
//   }: {
//     label: string;
//     value: string | undefined;
//   }) => (
//     <Box sx={{ py: 1.5 }}>
//       <Typography
//         variant="subtitle2"
//         color="text.secondary"
//         sx={{ fontSize: "0.85rem" }}
//       >
//         {label}
//       </Typography>
//       <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
//         {value || <Typography color="text.disabled">—</Typography>}
//       </Typography>
//       <Divider sx={{ mt: 1.5 }} />
//     </Box>
//   );

//   const fullName = userData
//     ? `${userData?.user?.first_name} ${userData?.user?.last_name}`
//     : "";

//   return (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h5">Astro User Details</Typography>
//       </Box>

//       {/* Main Info */}
//       <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
//         <Grid container spacing={3}>
//           {/* Left Profile */}
//           <Grid item xs={12} md={4}>
//             <Card sx={{ height: "100%", textAlign: "center", py: 4, px: 2 }}>
//               {loading ? (
//                 <>
//                   <Skeleton
//                     variant="circular"
//                     width={100}
//                     height={100}
//                     sx={{ margin: "auto" }}
//                   />
//                   <Skeleton width="60%" sx={{ mx: "auto", mt: 2 }} />
//                   <Skeleton width="40%" sx={{ mx: "auto", mt: 1 }} />
//                   <Skeleton
//                     width="70%"
//                     sx={{ mx: "auto", mt: 3, height: 36 }}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <AccountCircleIcon
//                     sx={{ fontSize: 100, color: "grey.500", mb: 2 }}
//                   />
//                   <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
//                     {fullName || "N/A"}
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() =>
//                       navigate(
//                         `/dashboard/astrologers/edit/${userData?.astrologer_id}`
//                       )
//                     }
//                     size="large"
//                     disabled={!userData}
//                     sx={{
//                       borderRadius: "8px",
//                       padding: "10px 24px",
//                       fontWeight: 600,
//                       textTransform: "none",
//                       fontSize: "1rem",
//                       background:
//                         "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
//                       color: "#fff",
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
//                     Edit Profile
//                   </Button>
//                 </>
//               )}
//             </Card>
//           </Grid>

//           {/* Right Info */}
//           <Grid item xs={12} md={8}>
//             <Card sx={{ height: "100%" }}>
//               <CardContent>
//                 <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
//                   Account Information
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     {loading ? (
//                       <>
//                         <Skeleton height={30} />
//                         <Skeleton height={30} />
//                         <Skeleton height={30} />
//                       </>
//                     ) : (
//                       <>
//                         <InfoItem label="Email" value={userData?.email} />
//                         <InfoItem label="Status" value={userData?.status} />
//                         <InfoItem label="Plan" value={userData?.plan} />
//                       </>
//                     )}
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     {loading ? (
//                       <>
//                         <Skeleton height={30} />
//                         <Skeleton height={30} />
//                       </>
//                     ) : (
//                       <>
//                         <InfoItem label="Rasi" value={userData?.rasi} />
//                         <InfoItem
//                           label="Nakshatram"
//                           value={userData?.nakshatram}
//                         />
//                       </>
//                     )}
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Subscription Info */}
//       <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
//         <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
//           Subscription Details
//         </Typography>
//         {loading ? (
//           <Skeleton height={100} />
//         ) : subscriptionData ? (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={4}>
//               <InfoItem label="Plan Name" value={subscriptionData.plan_name} />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <InfoItem
//                 label="Subscribed On"
//                 value={subscriptionData.date_of_subscription}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <InfoItem
//                 label="Ends On"
//                 value={subscriptionData.subscription_end_date}
//               />
//             </Grid>
//           </Grid>
//         ) : (
//           <Typography color="text.disabled">
//             No subscription data available.
//           </Typography>
//         )}
//       </Paper>

//       {/* Consultation Info */}
//       <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
//         <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
//           Consultation Details
//         </Typography>
//         {loading ? (
//           <Skeleton height={120} />
//         ) : consultationData ? (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <InfoItem label="Category" value={consultationData.category} />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <InfoItem
//                 label="Booking Date"
//                 value={consultationData.booking_date}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <InfoItem
//                 label="Time"
//                 value={`${consultationData.start_time} - ${consultationData.end_time}`}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <InfoItem
//                 label="Fee"
//                 value={`₹${consultationData.consultation_fee}`}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <InfoItem
//                 label="Rating"
//                 value={
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <StarIcon sx={{ color: "#fbc02d", mr: 0.5 }} />{" "}
//                     {consultationData.rating}
//                   </Box>
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <InfoItem
//                 label="Languages"
//                 value={consultationData.languages.join(", ")}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Box sx={{ mt: 1 }}>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   startIcon={<DescriptionIcon />}
//                   href={consultationData.user_horoscope}
//                   target="_blank"
//                   sx={{ textTransform: "none", fontWeight: 500 }}
//                 >
//                   View Horoscope
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         ) : (
//           <Typography color="text.disabled">
//             No consultation data available.
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default AstroUserView;

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Paper,
  Button,
  Skeleton,
  Divider,
  CardActions,
  Modal,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { callAPI } from "../../../api/crudFactory";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";
import { dateFormat } from "../../Elements/DateFormat";

// Material Icons for Modal
import CloseIcon from "@mui/icons-material/Close";
import StarsIcon from "@mui/icons-material/Stars";
import PersonIcon from "@mui/icons-material/Person";
import DoneIcon from "@mui/icons-material/Done";
import LinkIcon from "@mui/icons-material/Link";

interface UserData {
  astrologer_id: number;
  name: string;
  email: string;
  user_type: string;
  status: string;
  rasi: string;
  nakshatram: string;
  plan: string;
  user: any;
}

interface SubscriptionData {
  plan_name: string;
  date_of_subscription: string;
  subscription_end_date: string;
}

interface ConsultationData {
  user_horoscope: string;
  category: string;
  languages: string[];
  booking_date: string;
  start_time: string;
  end_time: string;
  consultation_fee: string;
  rating: number;
  astrologer_name: string;
}

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode | undefined;
}) => (
  <Box sx={{ py: 1.5 }}>
    <Typography
      variant="subtitle2"
      color="text.secondary"
      sx={{ fontSize: "0.85rem" }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
      {value || <Typography color="text.disabled">—</Typography>}
    </Typography>
    <Divider sx={{ mt: 1.5 }} />
  </Box>
);

const AstroUserView: React.FC<{ mode: "view" }> = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await callAPI({
          endpoint: `api/admin/astrologers/${userId}`,
          method: "get",
        });
        console.log(res, "res");
        setUserData(res?.data || null);
        setSubscriptionData({
          plan_name: "Premium Plan",
          date_of_subscription: "2025-04-01",
          subscription_end_date: "2025-07-01",
        });
        setConsultationData({
          user_horoscope: "https://example.com/horoscope.pdf",
          category: "Love & Relationship",
          languages: ["English", "Hindi"],
          booking_date: "2025-04-15",
          start_time: "10:00 AM",
          end_time: "10:30 AM",
          consultation_fee: "500",
          rating: 4.5,
          astrologer_name: "Astro Suresh",
        });
      } catch (err) {
        setUserData(null);
        setSubscriptionData(null);
        setConsultationData(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fullName = userData
    ? `${userData?.user?.first_name} ${userData?.user?.last_name}`
    : "";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          Astro User Details
        </Typography>
      </Box>

      {/* Main Info */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Grid container spacing={3}>
          {/* Left Profile */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", textAlign: "center", py: 4, px: 2 }}>
              {loading ? (
                <>
                  <Skeleton
                    variant="circular"
                    width={100}
                    height={100}
                    sx={{ margin: "auto" }}
                  />
                  <Skeleton width="60%" sx={{ mx: "auto", mt: 2 }} />
                  <Skeleton width="40%" sx={{ mx: "auto", mt: 1 }} />
                  <Skeleton
                    width="70%"
                    sx={{ mx: "auto", mt: 3, height: 36 }}
                  />
                </>
              ) : (
                <>
                  <AccountCircleIcon
                    sx={{ fontSize: 100, color: "grey.500", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {fullName || "N/A"}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/dashboard/astrologers/edit/${userData?.astrologer_id}`)
                    }
                    size="large"
                    disabled={!userData}
                    sx={{
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      background:
                        "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                      color: "#fff",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
                        boxShadow: "0 4px 12px rgba(27, 77, 62, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </Card>
          </Grid>

          {/* Right Info */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Account Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {loading ? (
                      <>
                        <Skeleton height={30} />
                        <Skeleton height={30} />
                        <Skeleton height={30} />
                      </>
                    ) : (
                      <>
                        <InfoItem label="Email" value={userData?.email} />
                        <InfoItem label="Status" value={userData?.status} />
                        <InfoItem label="Plan" value={userData?.plan} />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {loading ? (
                      <>
                        <Skeleton height={30} />
                        <Skeleton height={30} />
                      </>
                    ) : (
                      <>
                        <InfoItem label="Rasi" value={userData?.rasi} />
                        <InfoItem label="Nakshatram" value={userData?.nakshatram} />
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Subscription Info */}
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Subscription Details
        </Typography>
        {loading ? (
          <Skeleton height={100} />
        ) : subscriptionData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <InfoItem label="Plan Name" value={subscriptionData.plan_name} />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoItem
                label="Subscribed On"
                value={dateFormat(subscriptionData.date_of_subscription, "DD MMM YYYY")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoItem
                label="Ends On"
                value={dateFormat(subscriptionData.subscription_end_date, "DD MMM YYYY")}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.disabled">
            No subscription data available.
          </Typography>
        )}
      </Paper>

      {/* Consultation Info */}
      <ConsultationDetails
        // fullName={fullName}
        loading={loading}
        consultationData={consultationData}
      />
    </Box>
  );
};

const ConsultationDetails = ({ loading, consultationData }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHoroscopeUrl, setSelectedHoroscopeUrl] = useState<string | null>(null);

  const handleOpenModal = (horoscopeUrl: string) => {
    setSelectedHoroscopeUrl(horoscopeUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedHoroscopeUrl(null);
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Consultation Details
        </Typography>
        {loading ? (
          <Skeleton height={120} />
        ) : consultationData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                  >
                    Consultation{" "}
                    <Box
                      component="span"
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        px: 1,
                        py: 0.2,
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {dateFormat(consultationData.booking_date, "DD-MMM-YYYY")}
                    </Box>
                  </Typography>

                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {consultationData.category}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Astrologer:</strong> {consultationData.astrologer_name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Booking Date:</strong> {consultationData.booking_date}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Time:</strong>{" "}
                      {consultationData.start_time && consultationData.end_time
                        ? `${consultationData.start_time} - ${consultationData.end_time}`
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fee:</strong> ₹{consultationData.consultation_fee || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Rating:</strong>{" "}
                    </Typography>
                    {typeof consultationData.rating === "number" ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 1,
                        }}
                      >
                        <StarIcon
                          sx={{ color: "#fbc02d", fontSize: 18, mr: 0.5 }}
                        />
                        <Typography variant="body2">{consultationData.rating}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Not Rated
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Languages:</strong> {consultationData.languages.join(", ")}
                    </Typography>
                  </Box>
                </CardContent>
                {consultationData.user_horoscope && (
                  <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<DescriptionIcon />}
                      onClick={() => handleOpenModal(consultationData.user_horoscope)}
                      sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                      View Horoscope
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.disabled">
            No consultation data available.
          </Typography>
        )}
      </Paper>

      {/* Modal for Horoscope Link */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="celestial-horoscope-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 650, md: 850 },
            maxHeight: "95vh",
            bgcolor: "transparent",
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            border: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Inner container that will scroll */}
          <Box
            sx={{
              overflowY: "auto",
              maxHeight: "calc(95vh - 64px)",
              width: "100%",
            }}
          >
            {/* Celestial Background Container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                minHeight: "400px",
                overflowY: "auto",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(16, 177, 0, 0.1) 0%, rgba(27, 77, 62, 0.2) 100%)",
                  zIndex: -1,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')",
                  opacity: 0.5,
                  zIndex: -1,
                },
              }}
            >
              {/* Cosmic Header */}
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                  color: "#fff",
                  p: 3,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    id="celestial-horoscope-modal"
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <StarsIcon fontSize="large" />
                    Celestial Horoscope
                  </Typography>
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      color: "#fff",
                      background: "rgba(255,255,255,0.2)",
                      "&:hover": {
                        background: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Stellar Content */}
              <Box
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  background:
                    "linear-gradient(160deg, rgba(245, 247, 250, 0.95) 0%, rgba(228, 233, 240, 0.95) 100%)",
                }}
              >
                {selectedHoroscopeUrl && (
                  <>
                    {/* Cosmic Profile */}
                    <Box
                      sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: 3,
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(240,247,250,0.8) 100%)",
                        boxShadow: `
                          0 4px 6px rgba(0,0,0,0.05),
                          inset 0 0 0 1px rgba(16, 177, 0, 0.2)
                        `,
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 80,
                          height: 80,
                          background:
                            "radial-gradient(circle, rgba(16,177,0,0.1) 0%, transparent 70%)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1.5,
                          color: "#1B4D3E",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <PersonIcon fontSize="small" />
                        Horoscope Access
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "15px",
                            color: "#00688B",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LinkIcon fontSize="small" sx={{ opacity: 0.7 }} />
                          <strong>Horoscope URL:</strong>{" "}
                          <a
                            href={selectedHoroscopeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#00688B", textDecoration: "underline" }}
                          >
                            {selectedHoroscopeUrl}
                          </a>
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>

              {/* Galactic Footer */}
              <Box
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(135deg, rgba(16, 177, 0, 0.9) 0%, rgba(27, 77, 62, 0.9) 100%)",
                  textAlign: "center",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  },
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.9) 100%)",
                    color: "#1B4D3E",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 50,
                    px: 4,
                    py: 1,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(230,230,230,1) 100%)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={handleCloseModal}
                  startIcon={<DoneIcon />}
                >
                  Return to Earth
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AstroUserView;