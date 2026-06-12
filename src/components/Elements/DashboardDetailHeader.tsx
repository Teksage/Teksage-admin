import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type DashboardDetailHeaderProps = {
  title: string;
  onBack: () => void;
  trailing?: React.ReactNode;
};

/** Shared detail-page header — matches Consultation Details styling. */
export function DashboardDetailHeader({
  title,
  onBack,
  trailing,
}: DashboardDetailHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
      <IconButton onClick={onBack} aria-label="Go back">
        <ArrowBackIcon />
      </IconButton>
      <Typography
        variant="h5"
        sx={{ flex: 1, fontFamily: "Urbanist", fontWeight: 800, color: "#2e7d32" }}
      >
        {title}
      </Typography>
      {trailing}
    </Box>
  );
}
