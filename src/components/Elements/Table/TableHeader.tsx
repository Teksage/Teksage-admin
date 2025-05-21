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
  mobileFiltersOpen,
}: TableHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "currency" && value) {
      return false;
    }
    return typeof value === "string" && value.trim() !== "";
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
        sx={{
          maxWidth: "50%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: "Urbanist",
          fontWeight: 800,
          color: theme.palette.mode === "light" ? "#10B100" : "#4CAF50",
          letterSpacing: 0.5,
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
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
                "linear-gradient(135deg, #43A047 0%, #1B5E20 50%, #FDD835 150%)",
              color: "#fff",
              borderRadius: "8px",
              padding: "7px 22px",
              fontFamily: "Urbanist",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
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
                sx={{ px: isMobile ? 1 : 2, fontFamily: "Urbanist", fontWeight: 600 }}
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
                  ? "rgba(76, 175, 80, 0.2)"
                  : "transparent",
                border: (isMobile ? mobileFiltersOpen : showFilters)
                  ? "2px solid #4CAF50"
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