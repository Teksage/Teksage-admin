import React from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";

const Profile = () => {
    const user = {
        name: "John Doe",
        mobileNumber: "+1 234 567 890",
        email: "johndoe@example.com",
        address: "123 Main St, Springfield, USA",
    };
  return (
    <Box
      sx={{
        padding: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          padding: 3,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          Profile Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Name:
            </Typography>
            <Typography variant="body1">{user?.name}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Mobile Number:
            </Typography>
            <Typography variant="body1">{user?.mobileNumber}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Email:
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Address:
            </Typography>
            <Typography variant="body1">{user?.address}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
