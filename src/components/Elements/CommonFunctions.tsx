import React from "react";
import { Box, Typography, Divider, FormControl, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import { callAPI } from "../../api/crudFactory";
import { setCountriesList } from "../../redux/reducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export const formatYears = (years: number): string => {
  return `${years} Year${years === 1 ? "" : "s"}`;
};

export const normalizeYearText = (text: string) =>
  text.replace(/(Year)(s?)/gi, (_match, _y, s) => "year" + s.toLowerCase());

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

export const GlassSelect = styled(FormControl)(({ theme }) => ({
  width: "120px", // Increased width to accommodate country names
  position: "relative",
  "& .MuiInputLabel-root": {
    fontFamily: "Urbanist",
    fontSize: "0.85rem", // Slightly smaller to fit better
    fontWeight: 500,
    color: "#4caf50",
    background: `rgba(255, 255, 255, 0.9)`, // More opaque background
    padding: "2px 8px",
    borderRadius: "4px",
    transform: "translate(14px, -9px) scale(0.75)", // Always in shrunk position
    zIndex: 1,
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
      background: `rgba(255, 255, 255, 0.9)`,
      color: "#4caf50",
    },
  },
  "& .MuiSelect-select": {
    fontFamily: "Urbanist",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#4caf50",
    padding: theme.spacing(2), // Increased padding for better height
    minHeight: "40px", // Ensure a consistent minimum height
    borderRadius: "6px",
    background: `rgba(255, 255, 255, 0.05)`,
    backdropFilter: "blur(10px)",
    border: "2px solid transparent",
    borderImage: "linear-gradient(45deg, #1b4d3e, #4caf50, #1b4d3e) 1",
    boxShadow: `0 0 8px ${alpha("#4caf50", 0.3)}`,
    boxSizing: "border-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&:focus": {
      background: `rgba(255, 255, 255, 0.1)`,
      boxShadow: `0 0 12px ${alpha("#4caf50", 0.5)}`,
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderImage: "linear-gradient(45deg, #1b4d3e, #4caf50, #1b4d3e) 1",
      borderRadius: "6px",
    },
    "&:hover fieldset": {
      borderImage: "linear-gradient(45deg, #1b4d3e, #4caf50, #1b4d3e) 1",
    },
    "&.Mui-focused fieldset": {
      borderImage: "linear-gradient(45deg, #1b4d3e, #4caf50, #1b4d3e) 1",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "2px solid transparent",
      borderImage: "linear-gradient(45deg, #1b4d3e, #4caf50, #1b4d3e) 1",
    },
  },
  "&:hover .MuiSelect-select": {
    animation: "shimmer 2s infinite",
  },
  "@keyframes shimmer": {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
}));

export interface AppState {
  isAuthenticated: boolean;
  userInfo: Record<string, any>;
  users: any[];
  notification: { message: string; type: string; show: boolean };
  isLoading: boolean;
  countriesList: {
    dial_code: string;
    name: string;
    mobile_number_length: number;
  }[];
}

export type AppDispatch = ThunkDispatch<AppState, unknown, AnyAction>;

// export const fetchCountriesList = () => async (dispatch: AppDispatch) => {
//   try {
//     dispatch({ type: "setloading", payload: true });

//     const response = await callAPI({
//       endpoint: "/api/countries",
//       method: "get",
//     });

//     const countriesData = response?.data;
//     if (!Array.isArray(countriesData)) {
//       throw new Error("Invalid countries data");
//     }

//     // Deduplicate countries by countryCode
//     const uniqueCountriesMap = new Map<string, []>();
//     countriesData.forEach((country: any) => {
//       if (!uniqueCountriesMap.has(country.dial_code)) {
//         uniqueCountriesMap.set(country.dial_code, country);
//       }
//     });
//     const uniqueCountriesList = Array.from(uniqueCountriesMap.values());

//     dispatch(setCountriesList(uniqueCountriesList));
//   } catch (error) {
//     console.error("Failed to fetch countries:", error);
//     dispatch(setCountriesList([]));
//     dispatch({
//       type: "setnotification",
//       payload: {
//         message: "Failed to load countries. Please try again.",
//         type: "error",
//         show: true,
//       },
//     });
//   } finally {
//     dispatch({ type: "setloading", payload: false });
//   }
// };

export const fetchCountriesList = () => async (dispatch: AppDispatch, getState: () => AppState) => {
  const cachedCountries = localStorage.getItem("countriesList");
  if (cachedCountries) {
    const parsedCountries = JSON.parse(cachedCountries);
    dispatch(setCountriesList(parsedCountries));
    return;
  }

  try {
    dispatch({ type: "setloading", payload: true });

    const response = await callAPI({
      endpoint: "/api/countries",
      method: "get",
    });

    const countriesData = response?.data?.response;
    if (!Array.isArray(countriesData)) {
      throw new Error("Invalid countries data");
    }

    const uniqueCountriesMap = new Map<string, []>();
    countriesData.forEach((country: any) => {
      if (!uniqueCountriesMap.has(country.dial_code)) {
        uniqueCountriesMap.set(country.dial_code, country);
      }
    });
    const uniqueCountriesList = Array.from(uniqueCountriesMap.values());

    localStorage.setItem("countriesList", JSON.stringify(uniqueCountriesList));
    dispatch(setCountriesList(uniqueCountriesList));
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    dispatch(setCountriesList([]));
    dispatch({
      type: "setnotification",
      payload: {
        message: "Failed to load countries. Please try again.",
        type: "ERROR",
        show: true,
      },
    });
  } finally {
    dispatch({ type: "setloading", payload: false });
  }
};

export const transformDateKeys = (
  obj: Record<string, any>
): Record<string, any> => {
  const newObj = { ...obj };

  if ("start_datetime" in newObj) {
    newObj.start_time = newObj.start_datetime;
    delete newObj.start_datetime;
  }

  if ("end_datetime" in newObj) {
    newObj.end_time = newObj.end_datetime;
    delete newObj.end_datetime;
  }

  return newObj;
};

// Format number with commas and decimals for display
export const formatNumberWithCommas = (value: string | number): string => {
  if (value === "" || value == null) return "";
  const stringValue = String(value);
  // Remove any existing commas to avoid duplication
  const cleanValue = stringValue.replace(/,/g, "");
  const [integerPart, decimalPart] = cleanValue.split(".");
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Include decimal part if present, up to two places
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart.slice(0, 2)}`
    : formattedInteger;
};
