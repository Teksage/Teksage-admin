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
  Popover,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  subWeeks,
  subMonths,
} from "date-fns";
import { TableColumn } from "./types";

// Custom hook to calculate options list width
const useOptionsListWidth = (options: string[], theme: any) => {
  const [optionsListWidth, setOptionsListWidth] = useState(250);
  const textMeasureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options.length > 0 && textMeasureRef.current) {
      const allOptions = ["", ...options];
      const optionTexts = allOptions.map((option) =>
        option === "" ? "All" : capitalizeFirstLetter(option)
      );

      let maxWidth = 0;
      optionTexts.forEach((text) => {
        if (textMeasureRef.current) {
          textMeasureRef.current.textContent = text;
          const width = textMeasureRef.current.offsetWidth;
          maxWidth = Math.max(maxWidth, width);
        }
      });

      const finalWidth = Math.max(maxWidth + 30, 250);
      setOptionsListWidth(finalWidth);
    }
  }, [options]);

  return { optionsListWidth, textMeasureRef };
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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

type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface FilterSectionProps<T> {
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
  tempDateRange: DateRange;
  setTempDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  selectedPreset: string;
  setSelectedPreset: React.Dispatch<React.SetStateAction<string>>;
  onFilterChange?: (filters: Record<string, string>) => void;
  onFetchFilterOptions?: (
    field: keyof T,
    searchValue: string
  ) => Promise<string[]>;
}

interface FilterItemProps<T> {
  column: TableColumn<T>;
  filters: Record<string, string>;
  filterOptions: Record<string, string[]>;
  filterLoading: Record<string, boolean>;
  setSearchValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setFilterOptions: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  handleFilterChange: (columnId: keyof T, value: string) => void;
  handleSearchChange: (columnId: keyof T, searchValue: string) => Promise<void>;
}

const FilterItem = <T,>({
  column,
  filters,
  filterOptions,
  filterLoading,
  setSearchValues,
  setFilterOptions,
  handleFilterChange,
  handleSearchChange,
}: FilterItemProps<T>) => {
  const theme = useTheme();
  const columnId = column.id as string;
  const options = column.filterOptions || filterOptions[columnId] || [];
  const isLoading = filterLoading[columnId] || false;

  const { optionsListWidth, textMeasureRef } = useOptionsListWidth(
    options,
    theme
  );

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
      <div
        ref={textMeasureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontSize: "0.9rem",
          fontWeight: 400,
          fontFamily: theme.typography.fontFamily,
          padding: "8px 12px",
          lineHeight: "normal",
        }}
      />
      <StyledFormControl
        key={columnId}
        size="small"
        sx={{
          minWidth: { xs: "100%", sm: 150 },
          maxWidth: { xs: "100%", sm: 200 },
        }}
      >
        <Autocomplete
          options={["", ...options]}
          getOptionLabel={(option) => option}
          value={filters[columnId] || ""}
          onChange={(event, newValue) => {
            const selectedValue = newValue || "";
            handleFilterChange(column.id, selectedValue);
            setSearchValues((prev) => ({ ...prev, [columnId]: selectedValue }));
            setFilterOptions((prev) => ({
              ...prev,
              [columnId]: selectedValue ? [selectedValue] : [],
            }));
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
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
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
                  borderColor: filters[columnId]
                    ? "#4caf50"
                    : alpha(theme.palette.divider, 0.3),
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
}: FilterSectionProps<T>) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const selectRef = useRef<HTMLElement | null>(null);

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
    if (preset !== "Custom") {
      setAnchorEl(null); // Close Popover if not Custom
      setTempDateRange({ start, end });
      handleDateRangeChange(start, end);
    }
  };

  const handleCustomClick = (event: React.MouseEvent<HTMLElement>) => {
    setSelectedPreset("Custom");
    setAnchorEl(selectRef.current); // Reopen Popover
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    const newFilters = { ...filters };
    if (start && end) {
      newFilters.start_time = format(start, "yyyy-MM-dd");
      newFilters.end_time = format(end, "yyyy-MM-dd");
    } else {
      delete newFilters.start_time;
      delete newFilters.end_time;
    }
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCustomDateChange = (start: Date | null, end: Date | null) => {
    setTempDateRange({ start, end });
    handleDateRangeChange(start, end);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    // Do not reset selectedPreset or tempDateRange to preserve the UI state
  };

  const renderDateFilter = () => {
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
      <Box
        sx={{
          minWidth: { xs: "100%", sm: 150 },
          maxWidth: { xs: "100%", sm: 200 },
        }}
      >
        <StyledFormControl
          size="small"
          sx={{ width: "100%", maxWidth: { xs: "100%", sm: 200 } }}
          ref={(el: HTMLElement | null) => (selectRef.current = el)}
        >
          <InputLabel sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
            Date Range
          </InputLabel>
          <Select
            value={selectedPreset}
            onChange={(e) => handleDatePresetChange(e.target.value as string)}
            label="Date Range"
            sx={{
              "& .MuiSelect-select": {
                padding: "6px 10px",
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: selectedPreset
                  ? "#4caf50"
                  : alpha(theme.palette.divider, 0.3),
              },
              borderRadius: "8px",
            }}
          >
            {datePresets.map((preset) => (
              <MenuItem
                key={preset.value}
                value={preset.value}
                onClick={
                  preset.value === "Custom" ? handleCustomClick : undefined
                }
              >
                {preset.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              p: 3,
              background: alpha(theme.palette.background.paper, 0.98),
              border: `2px solid ${theme.palette.success.main}`,
              borderRadius: "8px",
              width: { xs: "100%", sm: 400 },
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              Custom Date Range
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3,
                  alignItems: "center",
                }}
              >
                <DatePicker
                  label="Start Date"
                  value={tempDateRange.start}
                  onChange={(newValue) =>
                    handleCustomDateChange(newValue, tempDateRange.end)
                  }
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      size: "small",
                      InputLabelProps: {
                        shrink: true,
                        sx: {
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          color: theme.palette.text.secondary,
                        },
                      },
                      InputProps: {
                        sx: {
                          "& .MuiInputBase-root": {
                            minHeight: "40px",
                          },
                        },
                      },
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          background: alpha(
                            theme.palette.background.paper,
                            0.9
                          ),
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
                        width: { xs: "100%", sm: 180 },
                      },
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={tempDateRange.end}
                  onChange={(newValue) =>
                    handleCustomDateChange(tempDateRange.start, newValue)
                  }
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      size: "small",
                      InputLabelProps: {
                        shrink: true,
                        sx: {
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          color: theme.palette.text.secondary,
                        },
                      },
                      InputProps: {
                        sx: {
                          "& .MuiInputBase-root": {
                            minHeight: "40px",
                          },
                        },
                      },
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          background: alpha(
                            theme.palette.background.paper,
                            0.9
                          ),
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
                        width: { xs: "100%", sm: 180 },
                      },
                    },
                  }}
                />
              </Box>
              {tempDateRange.start && tempDateRange.end && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Selected Range: {format(tempDateRange.start, "MMM d, yyyy")} -{" "}
                  {format(tempDateRange.end, "MMM d, yyyy")}
                </Typography>
              )}
            </LocalizationProvider>
          </Box>
        </Popover>
      </Box>
    );
  };

  return (
    <FiltersContainer>
      {columns
        .filter((col) => col.filterable)
        .map((column) => (
          <FilterItem
            key={column.id as string}
            column={column}
            filters={filters}
            filterOptions={filterOptions}
            filterLoading={filterLoading}
            setSearchValues={setSearchValues}
            setFilterOptions={setFilterOptions}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
          />
        ))}
      {renderDateFilter()}
    </FiltersContainer>
  );
};

export default FilterSection;
