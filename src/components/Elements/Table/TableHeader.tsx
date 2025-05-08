import React from "react";
import { Box, Typography, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Add as AddIcon, FilterList as FilterListIcon, CloudDownload as ExportIcon } from "@mui/icons-material";

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
  hasDateData: boolean;
  hasFeeData: boolean;
}

const TableHeader = ({
  title,
  onAdd,
  onExport,
  setShowFilters,
  setMobileFiltersOpen,
  filters,
  clearAllFilters,
  hasFilterableColumns,
  hasDateData,
  hasFeeData,
}: TableHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const hasActiveFilters = Object.values(filters).some((value) => value.trim() !== "");

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
      <Typography
        variant="h5"
        sx={{
          maxWidth: "50%", // Prevent title from pushing buttons too far
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: 600, // Bolder font for emphasis
          fontFamily: '"Poppins", sans-serif', // Modern font family
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
            sx={{
                px: isMobile ? 1 : 2,
                background:
                  "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 24px",
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
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
        {(hasFilterableColumns || hasDateData || hasFeeData) && (
          <Box sx={{ display: "flex", gap: isMobile ? 0.5 : 1, alignItems: "center" }}>
            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                color="error"
                size={isMobile ? "small" : "medium"}
                sx={{ px: isMobile ? 1 : 2 }}
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
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TableHeader;