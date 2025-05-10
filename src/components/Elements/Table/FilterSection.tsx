import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  TextField,
  alpha,
  useTheme,
  Popper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, subDays, startOfDay, endOfDay, subWeeks, subMonths } from "date-fns";
import { TableColumn } from "./types";

const FiltersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  justifyContent: "flex-start",
  background: alpha(theme.palette.grey[50], 0.5),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "8px",
    background: alpha(theme.palette.background.paper, 0.9),
    "&:hover": { background: alpha(theme.palette.background.paper, 1) },
    transition: "background 0.3s ease",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.divider, 0.3),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3f51b5",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3f51b5",
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiInputBase-root": { fontSize: "0.8rem" },
  },
}));

interface FilterSectionProps<T> {
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
}

const FilterSection = <T,>({
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
}: FilterSectionProps<T>) => {
  const theme = useTheme();

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFilterChange = (columnId: keyof T, value: string) => {
    const isNumber = !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
    const processedValue = value && !isNumber ? value.toLowerCase() : value;

    const newFilters = { ...filters, [columnId as string]: processedValue };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearchChange = async (columnId: keyof T, searchValue: string) => {
    const columnIdStr = columnId as string;
    setSearchValues((prev) => ({ ...prev, [columnIdStr]: searchValue }));
    if (!searchValue.trim() || !onFetchFilterOptions) {
      setFilterOptions((prev) => ({ ...prev, [columnIdStr]: [] }));
      setFilterLoading((prev) => ({ ...prev, [columnIdStr]: false }));
      return;
    }
    setFilterLoading((prev) => ({ ...prev, [columnIdStr]: true }));
    try {
      const options = await onFetchFilterOptions(columnId, searchValue);
      setFilterOptions((prev) => ({ ...prev, [columnIdStr]: options }));
    } catch (error) {
      console.error(`Failed to fetch filter`, error);
      setFilterOptions((prev) => ({ ...prev, [columnIdStr]: [] }));
    } finally {
      setFilterLoading((prev) => ({ ...prev, [columnIdStr]: false }));
    }
  };

  const handleDatePresetChange = (preset: string) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;
    switch (preset) {
      case "Today":
        start = startOfDay(today);
        end = endOfDay(today);
        break;
      case "Yesterday":
        start = startOfDay(subDays(today, 1));
        end = endOfDay(subDays(today, 1));
        break;
      case "Last Week":
        start = startOfDay(subWeeks(today, 1));
        end = endOfDay(today);
        break;
      case "Last Month":
        start = startOfDay(subMonths(today, 1));
        end = endOfDay(today);
        break;
      case "Last 7 days":
        start = startOfDay(subDays(today, 7));
        end = endOfDay(today);
        break;
      case "Last 30 days":
        start = startOfDay(subDays(today, 30));
        end = endOfDay(today);
        break;
      case "Custom":
        start = tempDateRange.start;
        end = tempDateRange.end;
        break;
      default:
        start = null;
        end = null;
        break;
    }
    setSelectedPreset(preset);
    setTempDateRange({ start, end });
    handleDateRangeChange(start, end);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    const dateFilterValue =
      start && end
        ? `${format(start, "yyyy-MM-dd")}-${format(end, "yyyy-MM-dd")}`
        : "";
    const newFilters = { ...filters, booking_date: dateFilterValue };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCustomDateChange = (start: Date | null, end: Date | null) => {
    setTempDateRange({ start, end });
    handleDateRangeChange(start, end);
  };

  const renderDateFilter = () => {
    if (!hasDateData) return null;
    const datePresets = [
      { value: "", label: "All Dates" },
      { value: "Today", label: "Today" },
      { value: "Yesterday", label: "Yesterday" },
      { value: "Last Week", label: "Last Week" },
      { value: "Last Month", label: "Last Month" },
      { value: "Last 7 days", label: "Last 7 days" },
      { value: "Last 30 days", label: "Last 30 days" },
      { value: "Custom", label: "Custom" },
    ];

    return (
      <Box sx={{ minWidth: { xs: "100%", sm: 150 }, maxWidth: { xs: "100%", sm: 200 } }}>
        <StyledFormControl size="small" sx={{ width: "100%", maxWidth: { xs: "100%", sm: 200 } }}>
          <InputLabel sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>Date Range</InputLabel>
          <Select
            value={selectedPreset}
            onChange={(e) => handleDatePresetChange(e.target.value as string)}
            label="Date Range"
            sx={{
              "& .MuiSelect-select": { padding: "6px 10px", fontSize: { xs: "0.8rem", sm: "0.9rem" } },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: selectedPreset ? "#4caf50" : alpha(theme.palette.divider, 0.3) },
              borderRadius: "8px",
            }}
          >
            {datePresets.map((preset) => (
              <MenuItem key={preset.value} value={preset.value}>
                {preset.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        {selectedPreset === "Custom" && (
          <Box
            sx={{
              p: 2,
              mt: 1,
              background: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              borderRadius: "8px",
              width: "100%",
              maxWidth: { xs: "100%", sm: 200 },
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
              Custom Date Range
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={tempDateRange.start}
                  onChange={(newValue) => handleCustomDateChange(newValue, tempDateRange.end)}
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          background: alpha(theme.palette.background.paper, 0.9),
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(theme.palette.divider, 0.3),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3f51b5",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3f51b5",
                        },
                        width: { xs: "100%", sm: 150 },
                      },
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={tempDateRange.end}
                  onChange={(newValue) => handleCustomDateChange(tempDateRange.start, newValue)}
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          background: alpha(theme.palette.background.paper, 0.9),
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(theme.palette.divider, 0.3),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3f51b5",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3f51b5",
                        },
                        width: { xs: "100%", sm: 150 },
                      },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        )}
      </Box>
    );
  };

  const renderFilter = (column: TableColumn<T>) => {
    const columnId = column.id as string;
    const options = column.filterOptions || filterOptions[columnId] || [];
    const isLoading = filterLoading[columnId] || false;

    // State to store the exact width of the longest option
    const [optionsListWidth, setOptionsListWidth] = useState(250); // Default minimum width

    // Ref for the hidden div used to measure text width
    const textMeasureRef = useRef<HTMLDivElement>(null);

    // Measure the exact width of the longest option (with capitalized text)
    useEffect(() => {
      if (options.length > 0 && textMeasureRef.current) {
        const allOptions = ["", ...options];
        const optionTexts = allOptions.map((option) => (option === "" ? "All" : capitalizeFirstLetter(option)));
        
        let maxWidth = 0;
        optionTexts.forEach((text) => {
          if (textMeasureRef.current) {
            textMeasureRef.current.textContent = text;
            const width = textMeasureRef.current.offsetWidth;
            maxWidth = Math.max(maxWidth, width);
          }
        });

        // Set the width with a small buffer, minimum 250px
        const finalWidth = Math.max(maxWidth + 30, 250); // Increased buffer to 30px for Material-UI padding
        setOptionsListWidth(finalWidth);
      }
    }, [options]);

    const CustomPopper = (props: any) => (
      <Popper
        {...props}
        placement="bottom-start"
        modifiers={[
          { name: "flip", enabled: true },
          { name: "preventOverflow", enabled: false },
          { name: "offset", options: { offset: [0, 8] } },
        ]}
        style={{ width: optionsListWidth }}
      />
    );

    return (
      <>
        {/* Hidden div to measure text width */}
        <div
          ref={textMeasureRef}
          style={{
            position: "absolute",
            visibility: "hidden",
            whiteSpace: "nowrap",
            fontSize: "0.9rem",
            fontWeight: 400,
            fontFamily: theme.typography.fontFamily,
            padding: "8px 12px", // Match the padding from renderOption
            lineHeight: "normal", // Match Material-UI's default line height
          }}
        />
        <StyledFormControl key={columnId} size="small" sx={{ minWidth: { xs: "100%", sm: 150 }, maxWidth: { xs: "100%", sm: 200 } }}>
          <Autocomplete
            options={["", ...options]}
            getOptionLabel={(option) => option} // Value remains unchanged for internal logic
            value={filters[columnId] || ""}
            onChange={(event, newValue) => {
              const selectedValue = newValue || "";
              handleFilterChange(column.id, selectedValue);
              setSearchValues((prev) => ({ ...prev, [columnId]: selectedValue }));
              setFilterOptions((prev) => ({ ...prev, [columnId]: selectedValue ? [selectedValue] : [] }));
            }}
            onInputChange={(event, newInputValue, reason) => {
              if (event && reason === "input" && !column.filterOptions) {
                handleSearchChange(column.id, newInputValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={column.label}
                size="small"
                variant="outlined"
                value={filters[columnId] || ""}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                  sx: {
                    "& .MuiInputBase-input": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: filters[columnId] ? "#4caf50" : alpha(theme.palette.divider, 0.3),
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li
                {...props}
                style={{
                  fontWeight: 400,
                  background: "transparent",
                  padding: "8px 12px",
                  whiteSpace: "nowrap",
                }}
              >
                {option === "" ? "All" : capitalizeFirstLetter(option)}
              </li>
            )}
            disableClearable={false}
            freeSolo={false}
            PopperComponent={CustomPopper}
            ListboxProps={{
              style: {
                width: optionsListWidth,
                overflowX: "visible",
              },
            }}
          />
        </StyledFormControl>
      </>
    );
  };

  return (
    <FiltersContainer>
      {columns.filter((col) => col.filterable).map((column) => renderFilter(column))}
      {hasDateData && renderDateFilter()}
    </FiltersContainer>
  );
};

export default FilterSection;