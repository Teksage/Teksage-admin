import React from "react";
import { Box, Typography, Divider } from "@mui/material";

export const formatYears = (years: number): string => {
  return `${years} Year${years === 1 ? "" : "s"}`;
}

export const normalizeYearText = (text: string) =>
  text.replace(/(Year)(s?)/gi, (_match, _y, s) => 'year' + s.toLowerCase());

// export const capitalizeFirstLetter = (text: string) =>
//   text?.charAt(0).toUpperCase() + text.slice(1);

export const capitalizeFirstLetter = (text?: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const capitalizeCommaSeparated = (str: string) =>
  str
    .split(",")
    .map((s) => s.trim())
    .map((s) => capitalizeFirstLetter(s))
    .join(", ");

export const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  let displayValue: React.ReactNode = value;

  if (typeof value === "string") {
    const isEmailLabel = label.toLowerCase() === "email";
    const hasComma = value.includes(",");

    if (!isEmailLabel && hasComma) {
      displayValue = capitalizeCommaSeparated(value);
    } else if (!isEmailLabel) {
      displayValue = capitalizeFirstLetter(value);
    }
  }

  return (
    <Box sx={{ py: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon && (
          <Box sx={{ display: "flex", alignItems: "center", color: "#90EE90" }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontSize: "0.85rem" }}
          style={{ fontFamily: "Urbanist", fontWeight: 500 }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{ mt: 0.5, fontWeight: 500, pl: icon ? 4 : 0 }}
        style={{ fontFamily: "Urbanist", fontWeight: 500 }}
      >
        {displayValue ?? <Typography color="text.disabled">—</Typography>}
      </Typography>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};
