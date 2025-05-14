import React from "react";
import {
  Box,
  Typography,
  Divider,
} from "@mui/material";

export const capitalizeFirstLetter = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => {
  let displayValue: React.ReactNode = value;

  if (typeof value === "string") {
    displayValue = capitalizeFirstLetter(value);
  }

  return (
    <Box sx={{ py: 1.5 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ fontSize: "0.85rem" }}
      >
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
        {displayValue ?? <Typography color="text.disabled">—</Typography>}
      </Typography>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};
