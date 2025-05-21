// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Button,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";
// import FilterSection from "./FilterSection";
// import { TableColumn } from "./types";
// import { title } from "framer-motion/client";

// interface MobileFiltersDialogProps<T> {
//   mobileFiltersOpen: boolean;
//   setMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   columns: TableColumn<T>[];
//   filters: Record<string, string>;
//   setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   filterOptions: Record<string, string[]>;
//   setFilterOptions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
//   filterLoading: Record<string, boolean>;
//   setFilterLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   searchValues: Record<string, string>;
//   setSearchValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
//   tempDateRange: { start: Date | null; end: Date | null };
//   setTempDateRange: React.Dispatch<React.SetStateAction<{ start: Date | null; end: Date | null }>>;
//   selectedPreset: string;
//   setSelectedPreset: React.Dispatch<React.SetStateAction<string>>;
//   onFilterChange?: (filters: Record<string, string>) => void;
//   onFetchFilterOptions?: (field: keyof T, searchValue: string) => Promise<string[]>;
//   clearAllFilters: () => void;
// }

// const MobileFiltersDialog = <T,>({
//   mobileFiltersOpen,
//   setMobileFiltersOpen,
//   columns,
//   filters,
//   setFilters,
//   filterOptions,
//   setFilterOptions,
//   filterLoading,
//   setFilterLoading,
//   searchValues,
//   setSearchValues,
//   tempDateRange,
//   setTempDateRange,
//   selectedPreset,
//   setSelectedPreset,
//   onFilterChange,
//   onFetchFilterOptions,
//   clearAllFilters,
// }: MobileFiltersDialogProps<T>) => {
//   return (
//     <Dialog fullScreen open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif" }}>
//           Filters
//         </Typography>
//         <IconButton onClick={() => setMobileFiltersOpen(false)}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
//           <FilterSection
//             columns={columns}
//             filters={filters}
//             setFilters={setFilters}
//             filterOptions={filterOptions}
//             setFilterOptions={setFilterOptions}
//             filterLoading={filterLoading}
//             setFilterLoading={setFilterLoading}
//             searchValues={searchValues}
//             setSearchValues={setSearchValues}
//             tempDateRange={tempDateRange}
//             setTempDateRange={setTempDateRange}
//             selectedPreset={selectedPreset}
//             setSelectedPreset={setSelectedPreset}
//             onFilterChange={onFilterChange}
//             onFetchFilterOptions={onFetchFilterOptions}
//             title={title}
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={clearAllFilters} color="error" sx={{ "&:active": { transform: "scale(0.95)" } }}>
//           Clear All
//         </Button>
//         <Button
//           onClick={() => {
//             onFilterChange?.(filters);
//             setMobileFiltersOpen(false);
//           }}
//           variant="contained"
//           sx={{
//             background: "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
//             color: "#fff",
//             "&:active": { transform: "scale(0.95)" },
//           }}
//         >
//           Apply
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default MobileFiltersDialog;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import FilterSection from "./FilterSection";
import { TableColumn } from "./types";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    background: theme.palette.background.paper,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    margin: theme.spacing(2),
    maxWidth: "90vw",
    width: "100%",
    maxHeight: "80vh",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  fontFamily: "Urbanist",
  fontWeight: 700,
  fontSize: "1.2rem",
}));

interface MobileFiltersDialogProps<T> {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  columns: TableColumn<T>[];
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  filterOptions: Record<string, string[]>;
  setFilterOptions: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  filterLoading: Record<string, boolean>;
  setFilterLoading: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  searchValues: Record<string, string>;
  setSearchValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  tempDateRange: { start: Date | null; end: Date | null };
  setTempDateRange: React.Dispatch<
    React.SetStateAction<{ start: Date | null; end: Date | null }>
  >;
  selectedPreset: string;
  setSelectedPreset: React.Dispatch<React.SetStateAction<string>>;
  onFilterChange?: (filters: Record<string, string>) => void;
  onFetchFilterOptions?: (
    field: keyof T,
    searchValue: string
  ) => Promise<string[]>;
  clearAllFilters: () => void;
  title: string;
}

const MobileFiltersDialog = <T,>({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  columns,
  filters,
  setFilters,
  filterOptions,
  setFilterOptions,
  filterLoading,
  setFilterLoading,
  searchValues,
  setSearchValues,
  tempDateRange,
  setTempDateRange,
  selectedPreset,
  setSelectedPreset,
  onFilterChange,
  onFetchFilterOptions,
  clearAllFilters,
  title,
}: MobileFiltersDialogProps<T>) => {
  const theme = useTheme();

  const handleClose = () => {
    setMobileFiltersOpen(false);
  };

  const handleApplyFilters = () => {
    onFilterChange?.(filters);
    handleClose();
  };

  return (
    <StyledDialog
      open={mobileFiltersOpen}
      onClose={handleClose}
      aria-labelledby="mobile-filters-dialog"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography variant="h6">{title} Filters</Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: theme.palette.common.white }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent dividers sx={{ padding: theme.spacing(2) }}>
        <FilterSection
          title={title}
          columns={columns}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          filterLoading={filterLoading}
          setFilterLoading={setFilterLoading}
          searchValues={searchValues}
          setSearchValues={setSearchValues}
          tempDateRange={tempDateRange}
          setTempDateRange={setTempDateRange}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          onFilterChange={onFilterChange}
          onFetchFilterOptions={onFetchFilterOptions}
        />
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(2) }}>
        <Button
          onClick={clearAllFilters}
          color="error"
          sx={{
            fontFamily: "Urbanist",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Clear All
        </Button>
        <Button
          onClick={handleApplyFilters}
          color="primary"
          variant="contained"
          sx={{
            fontFamily: "Urbanist",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default MobileFiltersDialog;