import React from "react";
import { Paper, Typography } from "@mui/material";

type DashboardSectionPaperProps = {
  title: string;
  children: React.ReactNode;
};

/** Shared elevated section card for dashboard detail pages. */
export function DashboardSectionPaper({ title, children }: DashboardSectionPaperProps) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontFamily: "Urbanist", fontWeight: 700, color: "#2e7d32" }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
