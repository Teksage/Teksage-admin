import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  CloudDownload as ExportIcon,
} from "@mui/icons-material";

interface TableHeaderProps {
  title: string;
  onAdd?: () => void;
  onExport?: () => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Record<string, string>;
  clearAllFilters: () => void;
  hasFilterableColumns: boolean;
  // hasFeeData: boolean;
  mobileFiltersOpen: boolean;
}

const TableHeader = ({
  title,
  onAdd,
  onExport,
  showFilters,
  setShowFilters,
  setMobileFiltersOpen,
  filters,
  clearAllFilters,
  hasFilterableColumns,
  // hasFeeData,
  mobileFiltersOpen,
}: TableHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const hasActiveFilters = Object.values(filters).some(
  //   (value) => value.trim() !== ""
  // );

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "currency" && value) {
      return false;
    }
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    // Special case: include currency even if it's not a string
    return false;
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
      }}
    >
      <Typography
        variant="h5"
        style={{ fontFamily: "Urbanist", fontWeight: 800 }}
        sx={{
          maxWidth: "50%", // Prevent title from pushing buttons too far
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          // fontWeight: 600, // Bolder font for emphasis
          // fontFamily: '"Poppins", sans-serif', // Modern font family
          color: theme.palette.mode === "light" ? "#10B100" : "#4CAF50", // Green shade, adjusted for light/dark mode
          letterSpacing: 0.5, // Slight spacing for readability
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: isMobile ? 0.5 : 1.5,
          alignItems: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            size={isMobile ? "small" : "medium"}
            style={{ fontFamily: "Urbanist", fontWeight: 600 }}
            sx={{
              px: isMobile ? 1 : 2,
              // background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
              background:
                "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)",
              color: "#fff",
              borderRadius: "8px",
              padding: "7px 22px",
              // fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                // background: "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
                background: "linear-gradient(135deg, #388E3C 0%, #004D40 100%)",
                boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                transform: "scale(1.02)",
              },
            }}
          >
            Add
          </Button>
        )}
        {onExport && (
          <IconButton onClick={onExport} size={isMobile ? "small" : "medium"}>
            <ExportIcon />
          </IconButton>
        )}
        {hasFilterableColumns && (
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? 0.5 : 1,
              alignItems: "center",
            }}
          >
            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                color="error"
                size={isMobile ? "small" : "medium"}
                sx={{ px: isMobile ? 1 : 2 }}
                style={{ fontFamily: "Urbanist", fontWeight: 600 }}
              >
                Clear
              </Button>
            )}
            <IconButton
              onClick={() => {
                if (isMobile) {
                  setMobileFiltersOpen((prev) => !prev);
                } else {
                  setShowFilters((prev) => !prev);
                }
              }}
              size={isMobile ? "small" : "medium"}
              sx={{
                backgroundColor: (isMobile ? mobileFiltersOpen : showFilters)
                  ? "rgba(76, 175, 80, 0.2)" // light green background
                  : "transparent",
                border: (isMobile ? mobileFiltersOpen : showFilters)
                  ? "2px solid #4CAF50" // green border
                  : "none",
                borderRadius: "8px",
                padding: "6px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(76, 175, 80, 0.3)",
                },
              }}
            >
              <FilterListIcon
                sx={{
                  color: (isMobile ? mobileFiltersOpen : showFilters)
                    ? "#4CAF50"
                    : "inherit",
                }}
              />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TableHeader;
