import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import FilterSection from "./FilterSection";
import { TableColumn } from "./types";

interface MobileFiltersDialogProps<T> {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  columns: TableColumn<T>[];
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  filterOptions: Record<string, string[]>;
  setFilterOptions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  filterLoading: Record<string, boolean>;
  setFilterLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  searchValues: Record<string, string>;
  setSearchValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  tempDateRange: { start: Date | null; end: Date | null };
  setTempDateRange: React.Dispatch<React.SetStateAction<{ start: Date | null; end: Date | null }>>;
  selectedPreset: string;
  setSelectedPreset: React.Dispatch<React.SetStateAction<string>>;
  onFilterChange?: (filters: Record<string, string>) => void;
  onFetchFilterOptions?: (field: keyof T, searchValue: string) => Promise<string[]>;
  hasDateData: boolean;
  hasFeeData: boolean;
  clearAllFilters: () => void;
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
  hasDateData,
  hasFeeData,
  clearAllFilters,
}: MobileFiltersDialogProps<T>) => {
  return (
    <Dialog fullScreen open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif" }}>
          Filters
        </Typography>
        <IconButton onClick={() => setMobileFiltersOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <FilterSection
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
            hasDateData={hasDateData}
            hasFeeData={hasFeeData}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={clearAllFilters} color="error" sx={{ "&:active": { transform: "scale(0.95)" } }}>
          Clear All
        </Button>
        <Button
          onClick={() => {
            onFilterChange?.(filters);
            setMobileFiltersOpen(false);
          }}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
            color: "#fff",
            "&:active": { transform: "scale(0.95)" },
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileFiltersDialog;