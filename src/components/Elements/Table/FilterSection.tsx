import React from "react";
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
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
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
  hasFeeData: boolean;
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
  hasFeeData,
}: FilterSectionProps<T>) => {
  const theme = useTheme();

  const handleFilterChange = (columnId: keyof T, value: string) => {
    const newFilters = { ...filters, [columnId as string]: value };
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
      <Box sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 450 } }}>
        <StyledFormControl size="small" sx={{ width: "100%", maxWidth: { xs: "100%", sm: 450 } }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={selectedPreset}
            onChange={(e) => handleDatePresetChange(e.target.value as string)}
            label="Date Range"
            sx={{
              "& .MuiSelect-select": { padding: "6px 10px", fontSize: { xs: "0.8rem", sm: "0.9rem" } },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: selectedPreset ? "#4caf50" : "#e0e0e0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              borderRadius: 1,
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
              maxWidth: { xs: "100%", sm: 450 },
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
                        "& .MuiInputBase-root": { borderRadius: "8px", background: alpha(theme.palette.background.paper, 0.9) },
                        width: { xs: "100%", sm: 200 },
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
                        "& .MuiInputBase-root": { borderRadius: "8px", background: alpha(theme.palette.background.paper, 0.9) },
                        width: { xs: "100%", sm: 200 },
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

  const renderFeeFilter = () => {
    if (!hasFeeData) return null;
    const feeRanges = ["< 500", "500 - 1000", "> 1000"];
    const currencyCodes = ["INR", "USD"];

    const handleFeeRangeChange = (value: string) => {
      const currency = filters["consultation_fee"]?.split(" ")[1] || "INR";
      const newValue = value ? `${value} ${currency}` : currency;
      handleFilterChange("consultation_fee" as keyof T, newValue);
    };

    const handleCurrencyChange = (value: string) => {
      const feeRange = filters["consultation_fee"]?.split(" ")[0] || "";
      const newValue = feeRange ? `${feeRange} ${value}` : value;
      handleFilterChange("consultation_fee" as keyof T, newValue);
    };

    return (
      <Box sx={{ minWidth: { xs: "100%", sm: 300 }, maxWidth: { xs: "100%", sm: 500 }, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 0.5 } }}>
        <StyledFormControl size="small" sx={{ width: { xs: "100%", sm: 100 } }}>
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "2px" }}>
            <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 700, color: theme.palette.text.primary, backgroundColor: alpha(theme.palette.grey[100], 0.5), padding: "0 4px" }}>
              Currency
            </Typography>
          </Box>
          <Select
            value={filters["consultation_fee"]?.split(" ")[1] || "INR"}
            onChange={(e) => handleCurrencyChange(e.target.value as string)}
            label="Currency"
            sx={{
              "& .MuiSelect-select": { padding: "6px 8px", fontSize: { xs: "0.8rem", sm: "0.9rem" }, height: "38px", textAlign: "center" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: filters["consultation_fee"] ? "#4caf50" : "#e0e0e0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              borderRadius: "8px",
            }}
          >
            {currencyCodes.map((code) => (
              <MenuItem key={code} value={code} sx={{ justifyContent: "center", textAlign: "center" }}>
                {code}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <StyledFormControl size="small" sx={{ flex: { xs: "none", sm: 1 }, width: { xs: "100%", sm: "auto" } }}>
          <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" }, width: "100%", marginBottom: "2px" }}>
            <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 700, color: theme.palette.text.primary, backgroundColor: alpha(theme.palette.grey[100], 0.5), padding: "0 4px" }}>
              Fee Range
            </Typography>
          </Box>
          <Select
            value={filters["consultation_fee"]?.split(" ")[0] || ""}
            onChange={(e) => handleFeeRangeChange(e.target.value as string)}
            label="Fee Range"
            sx={{
              "& .MuiSelect-select": { padding: "6px 12px", fontSize: { xs: "0.8rem", sm: "0.9rem" }, height: "38px", textAlign: "left" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: filters["consultation_fee"] ? "#4caf50" : "#e0e0e0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              borderRadius: "8px",
            }}
          >
            <MenuItem value="" sx={{ textAlign: "left" }}>
              <em>All</em>
            </MenuItem>
            {feeRanges.map((range) => (
              <MenuItem key={range} value={range} sx={{ textAlign: "left" }}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </Box>
    );
  };

  const renderSelectFilter = (column: TableColumn<T>) => {
    const columnId = column.id as string;
    if (column.filterOptions && column.filterOptions.length > 0) {
      return (
        <StyledFormControl key={columnId} size="small" sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 450 } }}>
          <InputLabel>{column.label}</InputLabel>
          <Select
            value={filters[columnId] || ""}
            onChange={(e) => handleFilterChange(column.id, e.target.value as string)}
            label={column.label}
            sx={{
              "& .MuiSelect-select": { padding: "6px 12px", fontSize: { xs: "0.8rem", sm: "0.9rem" } },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: filters[columnId] ? "#4caf50" : "#e0e0e0" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3f51b5" },
              borderRadius: "8px",
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {column.filterOptions.map((option) => (
              <MenuItem key={option} value={option?.toLowerCase()}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      );
    }

    const options = filterOptions[columnId] || [];
    const isLoading = filterLoading[columnId] || false;
    const longestOptionLength = options.length > 0 ? Math.max(...options.map(opt => opt.length)) : 0;
    const estimatedWidth = longestOptionLength * 8;
    const optionsListWidth = Math.min(Math.max(estimatedWidth, 200), 450);

    const CustomPopper = (props: any) => (
      <Popper
        {...props}
        placement="bottom-start"
        modifiers={[
          { name: "flip", enabled: true },
          { name: "preventOverflow", enabled: true, options: { boundariesElement: "viewport" } },
        ]}
      />
    );

    return (
      <StyledFormControl key={columnId} size="small" sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 450 } }}>
        <Autocomplete
          options={[...options]}
          getOptionLabel={(option) => option}
          value={filters[columnId] || ""}
          onChange={(event, newValue) => {
            console.log(event)
            const selectedValue = newValue || "";
            handleFilterChange(column.id, selectedValue);
            setSearchValues((prev) => ({ ...prev, [columnId]: selectedValue }));
            setFilterOptions((prev) => ({ ...prev, [columnId]: selectedValue ? [selectedValue] : [] }));
          }}
          onInputChange={(event, newInputValue, reason) => {
            if (event && reason === "input") {
              handleSearchChange(column.id, newInputValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${column.label}`}
              size="small"
              variant="outlined"
              value={searchValues[columnId] || ""}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} style={{ fontWeight: 400, background: "transparent", padding: "8px 12px" }}>
              {option}
            </li>
          )}
          disableClearable={false}
          freeSolo={false}
          PopperComponent={CustomPopper}
          ListboxProps={{ style: { width: optionsListWidth } }}
        />
      </StyledFormControl>
    );
  };

  return (
    <FiltersContainer>
      {columns
        .filter(
          (col) =>
            col.filterable &&
            !col.id.toString().includes("date") &&
            !col.id.toString().includes("start_time") &&
            !col.id.toString().includes("fee")
        )
        .map((column) => renderSelectFilter(column))}
      {hasDateData && renderDateFilter()}
      {hasFeeData && renderFeeFilter()}
    </FiltersContainer>
  );
};

export default FilterSection;