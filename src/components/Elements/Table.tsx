// import React, { useState, useMemo } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   IconButton,
//   Button,
//   Autocomplete,
//   TextField,
//   FormControl,
//   InputLabel,
//   Box,
//   Typography,
//   alpha,
//   useMediaQuery,
//   useTheme,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Select,
//   MenuItem,
//   Badge,
//   CircularProgress,
//   TableSortLabel,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import {
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
//   Close as CloseIcon,
//   FilterList as FilterIcon,
//   Delete as DeleteIcon,
//   DateRange as DateRangeIcon,
//   FirstPage as FirstPageIcon,
//   LastPage as LastPageIcon,
//   Download as DownloadIcon,
// } from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { styled } from "@mui/material/styles";
// import {
//   format,
//   subDays,
//   startOfDay,
//   endOfDay,
//   subWeeks,
//   subMonths,
// } from "date-fns";

// // Styled components
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   height: "100%",
//   width: "100%",
//   maxWidth: "1400px",
//   margin: "0 auto",
//   borderRadius: "12px",
//   overflow: "hidden",
//   boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//   background:
//     "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 100%)",
//   backdropFilter: "blur(8px)",
//   [theme.breakpoints.down("sm")]: {
//     borderRadius: "0",
//     boxShadow: "none",
//     background: theme.palette.background.paper,
//     marginTop: "64px",
//     minHeight: "calc(100vh - 64px)",
//     paddingTop: 0,
//   },
// }));

// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   flex: 1,
//   overflow: "auto",
//   width: "100%",
//   "& .MuiTable-root": {
//     minWidth: "800px",
//   },
//   "& .MuiTableCell-head": {
//     background: `linear-gradient(180deg, ${alpha("#2e7d32", 0.9)} 0%, ${alpha(
//       "#1b4d3e",
//       0.9
//     )} 100%)`,
//     color: theme.palette.common.white,
//     fontWeight: 600,
//     fontSize: "0.875rem",
//     whiteSpace: "nowrap",
//     borderBottom: "none",
//     paddingLeft: theme.spacing(3),
//     "&:first-of-type": {
//       borderTopLeftRadius: "8px",
//     },
//     "&:last-of-type": {
//       borderTopRightRadius: "8px",
//       textAlign: "right",
//       paddingRight: theme.spacing(3),
//     },
//   },
//   "& .MuiTableRow-root": {
//     transition: "all 0.2s ease",
//     "&:hover": {
//       background: alpha(theme.palette.primary.light, 0.05),
//     },
//     "&.Mui-selected": {
//       background: alpha(theme.palette.primary.light, 0.15),
//     },
//   },
//   "& .MuiTableRow-root:nth-of-type(even)": {
//     background: alpha(theme.palette.action.hover, 0.05),
//   },
//   "& .MuiTableCell-root": {
//     padding: theme.spacing(1.5),
//     paddingLeft: theme.spacing(3),
//     borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//     "&:last-of-type": {
//       textAlign: "right",
//       paddingRight: theme.spacing(3),
//     },
//   },
// }));

// const SerialNumberCell = styled(TableCell)(({ theme }) => ({
//   width: "60px",
//   textAlign: "center",
//   fontWeight: 600,
//   color: theme.palette.text.secondary,
// }));

// const TableToolbar = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   background: `linear-gradient(90deg, ${alpha(
//     theme.palette.primary.main,
//     0.1
//   )} 0%, transparent 100%)`,
//   borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
// }));

// const PrimaryButton = styled(Button)(({ theme }) => ({
//   borderRadius: "8px",
//   textTransform: "none",
//   fontWeight: 600,
//   padding: theme.spacing(1, 2),
//   transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//   boxShadow: "none",
//   background:
//     "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
//   color: theme.palette.common.white,
//   "&:hover": {
//     transform: "translateY(-1px)",
//     boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
//   },
// }));

// const FiltersContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//   gap: theme.spacing(2),
//   borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
// }));

// const StyledFormControl = styled(FormControl)(({ theme }) => ({
//   "& .MuiInputBase-root": {
//     borderRadius: "8px",
//     background: alpha(theme.palette.background.paper, 0.9),
//     "&:hover": {
//       background: alpha(theme.palette.background.paper, 1),
//     },
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     borderColor: alpha(theme.palette.divider, 0.3),
//   },
// }));

// const DateFilterDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     borderRadius: "12px",
//     background: "linear-gradient(135deg, #6B5B95, #957DAD)",
//     color: theme.palette.common.white,
//     padding: 0,
//     overflow: "hidden",
//     width: "600px",
//     maxWidth: "90%",
//   },
//   "& .MuiDialogTitle-root": {
//     background: "transparent",
//     color: theme.palette.common.white,
//     fontWeight: 600,
//     padding: theme.spacing(2),
//     borderBottom: "none",
//   },
//   "& .MuiDialogContent-root": {
//     padding: 0,
//     display: "flex",
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(2),
//     background: "rgba(255, 255, 255, 0.1)",
//   },
//   "& .MuiButton-root": {
//     borderRadius: "8px",
//     textTransform: "none",
//     fontWeight: 600,
//     padding: theme.spacing(1, 2),
//     "&:hover": {
//       transform: "translateY(-1px)",
//     },
//   },
// }));

// const DateFilterSidebar = styled(Box)(({ theme }) => ({
//   width: "150px",
//   background: "rgba(255, 255, 255, 0.1)",
//   padding: theme.spacing(2),
//   display: "flex",
//   flexDirection: "column",
//   gap: theme.spacing(1),
//   borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
// }));

// const DateFilterPresetButton = styled(Button, {
//   shouldForwardProp: (prop) => prop !== "active",
// })<{ active?: boolean }>(({ theme, active }) => ({
//   textTransform: "none",
//   justifyContent: "flex-start",
//   color: active
//     ? theme.palette.common.white
//     : alpha(theme.palette.common.white, 0.7),
//   background: active ? alpha(theme.palette.primary.main, 0.3) : "transparent",
//   "&:hover": {
//     background: alpha(theme.palette.primary.main, 0.2),
//     color: theme.palette.common.white,
//   },
// }));

// const DateFilterCalendarContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: theme.spacing(2),
//   "& .MuiTextField-root": {
//     background: "rgba(255, 255, 255, 0.1)",
//     borderRadius: "8px",
//     "& .MuiOutlinedInput-root": {
//       color: theme.palette.common.white,
//     },
//     "& .MuiOutlinedInput-notchedOutline": {
//       borderColor: alpha(theme.palette.common.white, 0.3),
//     },
//     "&:hover .MuiOutlinedInput-notchedOutline": {
//       borderColor: theme.palette.common.white,
//     },
//     "& .MuiInputLabel-root": {
//       color: alpha(theme.palette.common.white, 0.7),
//     },
//     "& .MuiInputLabel-root.Mui-focused": {
//       color: theme.palette.common.white,
//     },
//   },
//   "& .MuiPickersDay-root": {
//     color: theme.palette.common.white,
//     "&.Mui-selected": {
//       backgroundColor: theme.palette.primary.main,
//     },
//     "&:hover": {
//       backgroundColor: alpha(theme.palette.primary.main, 0.2),
//     },
//   },
//   "& .MuiPickersDay-today": {
//     border: `1px solid ${theme.palette.common.white}`,
//   },
// }));

// const FilterTab = styled(Tab)(({ theme }) => ({
//   borderRadius: "8px",
//   textTransform: "none",
//   fontWeight: 600,
//   background: alpha(theme.palette.primary.light, 0.1),
//   "&.Mui-selected": {
//     background: theme.palette.primary.main,
//     color: theme.palette.common.white,
//   },
//   "&:hover": {
//     background: alpha(theme.palette.primary.main, 0.2),
//   },
// }));

// export interface TableColumn<T> {
//   id: keyof T;
//   label: string;
//   filterable?: boolean;
//   filterOptions?: string[];
//   sortable?: boolean;
//   width?: string;
//   render?: (value: any, row: T) => React.ReactNode;
// }

// export interface TableProps<T> {
//   data: T[];
//   columns: TableColumn<T>[];
//   title?: string;
//   onAdd?: () => void;
//   onView?: (row: T) => void;
//   onEdit?: (row: T) => void;
//   onDelete?: (row: T) => void;
//   showActions?: boolean;
//   getRowId: (row: T) => string | number;
//   initialRowsPerPage?: number;
//   tableHeight?: string;
//   totalCount?: number;
//   page?: number;
//   rowsPerPage?: number;
//   onPageChange?: (newPage: number) => void;
//   onRowsPerPageChange?: (newRowsPerPage: number) => void;
//   onFilterChange?: (filters: Record<string, string>) => void;
//   onSortChange?: (sortBy: keyof T, sortOrder: "asc" | "desc") => void;
//   loading?: boolean;
// }

// function GenericTable<T>({
//   data,
//   columns,
//   title = "Data Table",
//   onAdd,
//   onView,
//   onEdit,
//   onDelete,
//   showActions = true,
//   getRowId,
//   initialRowsPerPage = 10,
//   tableHeight = "calc(100vh - 250px)",
//   totalCount = data.length,
//   page = 0,
//   rowsPerPage = initialRowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
//   onFilterChange,
//   onSortChange,
//   loading = false,
// }: TableProps<T>) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [showFilters, setShowFilters] = useState(false);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);
//   // const [dateRange, setDateRange] = useState<{
//   //   start: Date | null;
//   //   end: Date | null;
//   // }>({
//   //   start: null,
//   //   end: null,
//   // });
//   const [tempDateRange, setTempDateRange] = useState<{
//     start: Date | null;
//     end: Date | null;
//   }>({
//     start: null,
//     end: null,
//   });
//   // const [feeRange, setFeeRange] = useState<{
//   //   min: number | null;
//   //   max: number | null;
//   // }>({
//   //   min: null,
//   //   max: null,
//   // });
//   const [dateFilterOpen, setDateFilterOpen] = useState(false);
//   const [selectedPreset, setSelectedPreset] = useState<string>("Custom");
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof T | null;
//     direction: "asc" | "desc";
//   }>({ key: null, direction: "asc" });
//   // const [isFocused, setIsFocused] = useState(false); // Moved to top level

//   // Define getFilterValues first
//   const getFilterValues = (column: TableColumn<T>) => {
//     return column.filterOptions?.length
//       ? column.filterOptions
//       : Array.from(
//           new Set(
//             data
//               .map((item) => {
//                 const value = item[column.id];
//                 return value?.toString() || "";
//               })
//               .filter(Boolean)
//           )
//         ).sort();
//   };

//   const hasFilterableColumns = useMemo(
//     () =>
//       columns.some((col) => {
//         if (!col.filterable) return false;
//         const values = getFilterValues(col);
//         return values.length > 0;
//       }),
//     [columns, data]
//   );

//   const hasDateData = useMemo(
//     () =>
//       data.some(
//         (item) => item["booking_date" as keyof T] || item["date" as keyof T]
//       ),
//     [data]
//   );

//   const hasFeeData = useMemo(() => {
//     const feeValues = data
//       .map((item: any) => {
//         const value =
//           (item as any)["consultation_fee"] ||
//           (item as any)["fee"] ||
//           (item as any)["consulting_fee"];
//         return typeof value === "string"
//           ? parseInt(value.replace(/[^0-9]/g, "")) || null
//           : value;
//       })
//       .filter((value) => value !== null && value !== 0 && !isNaN(value));
//     console.log(feeValues, "feeValues");
//     return feeValues.length > 0;
//   }, [data]);

//   const handleFilterChange = (columnId: keyof T, value: string) => {
//     const newFilters = { ...filters, [columnId as string]: value };
//     setFilters(newFilters);
//     onFilterChange?.(newFilters);
//   };

//   const handleDateRangeChange = (start: Date | null, end: Date | null) => {
//     // setDateRange({ start, end });
//     const newFilters = {
//       ...filters,
//       booking_date:
//         start || end
//           ? `${start?.toISOString() || ""}-${end?.toISOString() || ""}`
//           : "",
//     };
//     setFilters(newFilters);
//     onFilterChange?.(newFilters);
//   };

//   const handleTempDateRangeChange = (start: Date | null, end: Date | null) => {
//     setTempDateRange({ start, end });
//     setSelectedPreset("Custom");
//   };

//   const applyDateFilter = () => {
//     handleDateRangeChange(tempDateRange.start, tempDateRange.end);
//     setDateFilterOpen(false);
//   };

//   const clearDateFilter = () => {
//     setTempDateRange({ start: null, end: null });
//     handleDateRangeChange(null, null);
//     setSelectedPreset("Custom");
//     setDateFilterOpen(false);
//   };

//   const handlePresetChange = (preset: string) => {
//     const today = new Date();
//     let start: Date | null = null;
//     let end: Date | null = null;

//     switch (preset) {
//       case "Today":
//         start = startOfDay(today);
//         end = endOfDay(today);
//         break;
//       case "Yesterday":
//         start = startOfDay(subDays(today, 1));
//         end = endOfDay(subDays(today, 1));
//         break;
//       case "Last Week":
//         start = startOfDay(subWeeks(today, 1));
//         end = endOfDay(today);
//         break;
//       case "Last Month":
//         start = startOfDay(subMonths(today, 1));
//         end = endOfDay(today);
//         break;
//       case "Last 7 days":
//         start = startOfDay(subDays(today, 7));
//         end = endOfDay(today);
//         break;
//       case "Last 30 days":
//         start = startOfDay(subDays(today, 30));
//         end = endOfDay(today);
//         break;
//       case "Custom":
//       default:
//         start = tempDateRange.start;
//         end = tempDateRange.end;
//         break;
//     }

//     setTempDateRange({ start, end });
//     setSelectedPreset(preset);
//   };

//   // const handleFeeRangeChange = (min: number | null, max: number | null) => {
//   //   setFeeRange({ min, max });
//   //   const newFilters = {
//   //     ...filters,
//   //     consultation_fee:
//   //       min !== null || max !== null ? `${min || ""}-${max || ""}` : "",
//   //   };
//   //   setFilters(newFilters);
//   //   onFilterChange?.(newFilters);
//   // };

//   // const clearFeeFilter = () => {
//   //   setFeeRange({ min: null, max: null });
//   //   const newFilters = {
//   //     ...filters,
//   //     consultation_fee: "",
//   //   };
//   //   setFilters(newFilters);
//   //   onFilterChange?.(newFilters);
//   // };

//   const clearAllFilters = () => {
//     setFilters({});
//     // setDateRange({ start: null, end: null });
//     setTempDateRange({ start: null, end: null });
//     // setFeeRange({ min: null, max: null });
//     setSelectedPreset("Custom");
//     onFilterChange?.({});
//   };

//   const handleSort = (columnId: keyof T) => {
//     const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
//     const newDirection = isAsc ? "desc" : "asc";
//     setSortConfig({ key: columnId, direction: newDirection });
//     onSortChange?.(columnId, newDirection);
//   };

//   const handleChangePage = (event: any, newPage: number) => {
//     console.log(event);
//     onPageChange?.(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     onRowsPerPageChange?.(newRowsPerPage);
//     onPageChange?.(0);
//   };

//   const handleExport = () => {
//     const csv = [
//       columns.map((col) => col.label).join(","),
//       ...data.map((row) =>
//         columns
//           .map((col) => {
//             const value = row[col.id];
//             return `"${value?.toString().replace(/"/g, '""') || ""}"`;
//           })
//           .join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${title}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const formatDateRange = (start: Date | null, end: Date | null) => {
//     if (!start || !end) return "Select Date Range";
//     return `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;
//   };

//   const renderDateFilterDialog = () => {
//     return (
//       <DateFilterDialog
//         open={dateFilterOpen}
//         onClose={() => setDateFilterOpen(false)}
//       >
//         <DialogTitle>
//           {formatDateRange(tempDateRange.start, tempDateRange.end)}
//         </DialogTitle>
//         <DialogContent>
//           <DateFilterSidebar>
//             {[
//               "Custom",
//               "Today",
//               "Yesterday",
//               "Last Week",
//               "Last Month",
//               "Last 7 days",
//               "Last 30 days",
//             ].map((preset) => (
//               <DateFilterPresetButton
//                 key={preset}
//                 active={selectedPreset === preset}
//                 onClick={() => handlePresetChange(preset)}
//               >
//                 {preset}
//               </DateFilterPresetButton>
//             ))}
//           </DateFilterSidebar>
//           <DateFilterCalendarContainer>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <Box sx={{ display: "flex", gap: 2 }}>
//                 <DatePicker
//                   label="Start Date"
//                   value={tempDateRange.start}
//                   onChange={(newValue) =>
//                     handleTempDateRangeChange(newValue, tempDateRange.end)
//                   }
//                   slots={{ textField: TextField }}
//                   slotProps={{ textField: { size: "small", sx: { flex: 1 } } }}
//                 />
//                 <DatePicker
//                   label="End Date"
//                   value={tempDateRange.end}
//                   onChange={(newValue) =>
//                     handleTempDateRangeChange(tempDateRange.start, newValue)
//                   }
//                   slots={{ textField: TextField }}
//                   slotProps={{ textField: { size: "small", sx: { flex: 1 } } }}
//                 />
//               </Box>
//             </LocalizationProvider>
//           </DateFilterCalendarContainer>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={clearDateFilter} color="error">
//             Clear
//           </Button>
//           <Button onClick={() => setDateFilterOpen(false)}>Cancel</Button>
//           <Button
//             onClick={applyDateFilter}
//             variant="contained"
//             disabled={!tempDateRange.start && !tempDateRange.end}
//           >
//             Apply
//           </Button>
//         </DialogActions>
//       </DateFilterDialog>
//     );
//   };

//   const renderFeeFilter = () => {
//     if (!hasFeeData) return null;

//     const feeRanges = ["< 500", "500 - 1000", "> 1000"];

//     const handleRangeSelect = (value: string) => {
//       console.log(value, "value");
//       handleFilterChange("consultation_fee" as keyof T, value);
//     };

//     return (
//       <StyledFormControl size="small" sx={{ minWidth: 150 }}>
//         <InputLabel>Fee Range</InputLabel>
//         <Select
//           value={filters["consultation_fee"] || ""}
//           onChange={(e) => handleRangeSelect(e.target.value as string)}
//           label="Fee Range"
//           sx={{
//             "& .MuiSelect-select": {
//               padding: "6px 10px",
//               fontSize: "0.9rem",
//             },
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#e0e0e0",
//             },
//             "&:hover .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#3f51b5",
//             },
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#3f51b5",
//             },
//             borderRadius: 1,
//           }}
//         >
//           <MenuItem value="">
//             <em>All</em>
//           </MenuItem>
//           {feeRanges.map((range) => (
//             <MenuItem key={range} value={range}>
//               {range}
//             </MenuItem>
//           ))}
//         </Select>
//       </StyledFormControl>
//     );
//   };

//   const renderSelectFilter = (column: TableColumn<T>) => {
//     const uniqueValues = getFilterValues(column);
//     if (uniqueValues.length === 0) return null;

//     return (
//       <StyledFormControl key={column.id as string} size="small" fullWidth>
//         <Autocomplete
//           options={["Select All", ...uniqueValues]}
//           getOptionLabel={(option) =>
//             option === "Select All" ? "Select All" : option
//           }
//           value={filters[column.id as string] || ""}
//           onChange={(event, newValue) => {
//             console.log(event);
//             handleFilterChange(
//               column.id,
//               newValue === "Select All" ? "" : newValue || ""
//             );
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label={`${column.label}`}
//               size="small"
//               variant="outlined"
//               value={
//                 filters[column.id as string] === ""
//                   ? ""
//                   : filters[column.id as string]
//               }
//             />
//           )}
//           renderOption={(props, option) => (
//             <li
//               {...props}
//               style={{
//                 fontWeight: option === "Select All" ? 600 : 400,
//                 background:
//                   option === "Select All" && !filters[column.id as string]
//                     ? alpha(theme.palette.primary.main, 0.1)
//                     : "transparent",
//               }}
//             >
//               {option}
//             </li>
//           )}
//           disableClearable={false}
//           freeSolo={false}
//         />
//       </StyledFormControl>
//     );
//   };

//   if (isMobile) {
//     return (
//       <StyledPaper
//         elevation={0}
//         sx={{
//           paddingTop: 0,
//           display: "flex",
//           flexDirection: "column",
//           height: "100%",
//         }}
//       >
//         <Box
//           sx={{
//             p: 2,
//             borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//             position: "sticky",
//             top: 0,
//             zIndex: 3,
//             background: theme.palette.background.paper,
//           }}
//         >
//           <Typography variant="h5" sx={{ fontWeight: 700, color: "#1b4d3e" }}>
//             {title}
//           </Typography>
//           {onAdd && (
//             <IconButton
//               color="primary"
//               onClick={onAdd}
//               sx={{
//                 background:
//                   "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
//                 color: "#fff",
//                 position: "absolute",
//                 right: 16,
//                 top: 16,
//               }}
//             >
//               <AddIcon />
//             </IconButton>
//           )}
//         </Box>

//         {(hasFilterableColumns || hasDateData || hasFeeData) && (
//           <Box
//             sx={{
//               p: 1,
//               display: "flex",
//               justifyContent: "flex-end",
//               position: "sticky",
//               top: "64px",
//               zIndex: 2,
//               background: theme.palette.background.paper,
//             }}
//           >
//             <Badge
//               badgeContent={Object.keys(filters).length}
//               color="primary"
//               invisible={Object.keys(filters).length === 0}
//             >
//               <Button
//                 startIcon={<FilterIcon />}
//                 onClick={() => setMobileFiltersOpen(true)}
//                 size="small"
//               >
//                 Filters
//               </Button>
//             </Badge>
//           </Box>
//         )}

//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "100%",
//               my: 4,
//               gap: 1,
//             }}
//           >
//             <CircularProgress size={40} thickness={4} />
//             <Box sx={{ fontSize: 14, color: "#666" }}>Fetching data...</Box>
//           </Box>
//         ) : (
//           <List sx={{ flex: 1, overflow: "auto", paddingBottom: 7 }}>
//             {data
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row, index) => {
//                 const id = getRowId(row);
//                 const serialNumber = page * rowsPerPage + index + 1;

//                 return (
//                   <React.Fragment key={id}>
//                     <ListItem
//                       component="button"
//                       onClick={() => setMobileRowDetail(row)}
//                       sx={{ pl: 2, py: 1.5 }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontWeight: 600,
//                           color: theme.palette.text.secondary,
//                           minWidth: "24px",
//                           mr: 1,
//                         }}
//                       >
//                         {serialNumber}.
//                       </Typography>
//                       <ListItemText
//                         primary={
//                           columns[0].render
//                             ? columns[0].render(row[columns[0].id], row)
//                             : row[columns[0].id]?.toString()
//                         }
//                         secondary={
//                           columns[1]?.render
//                             ? columns[1].render(row[columns[1].id], row)
//                             : row[columns[1]?.id]?.toString()
//                         }
//                         primaryTypographyProps={{ fontWeight: 600 }}
//                       />
//                       {showActions && (
//                         <Box sx={{ display: "flex" }}>
//                           {onView && (
//                             <IconButton
//                               size="small"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 onView(row);
//                               }}
//                               sx={{ color: "#1976d2" }}
//                             >
//                               <ViewIcon fontSize="small" />
//                             </IconButton>
//                           )}
//                         </Box>
//                       )}
//                     </ListItem>
//                     <Divider component="li" />
//                   </React.Fragment>
//                 );
//               })}
//           </List>
//         )}

//         <TablePagination
//           component="div"
//           count={totalCount}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           rowsPerPageOptions={[5, 10, 25]}
//           sx={{
//             borderTop: `1px solid ${alpha("#ddd", 0.2)}`,
//             background: alpha("#f9f9f9", 0.95),
//             position: "sticky",
//             bottom: 0,
//             zIndex: 2,
//           }}
//           ActionsComponent={(props) => {
//             const { count, page, rowsPerPage, onPageChange } = props;
//             return (
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <IconButton
//                   onClick={() => onPageChange(null, 0)}
//                   disabled={page === 0}
//                   aria-label="first page"
//                 >
//                   <FirstPageIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => onPageChange(null, page - 1)}
//                   disabled={page === 0}
//                   aria-label="previous page"
//                 >
//                   {theme.direction === "rtl" ? ">" : "<"}
//                 </IconButton>
//                 <IconButton
//                   onClick={() => onPageChange(null, page + 1)}
//                   disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//                   aria-label="next page"
//                 >
//                   {theme.direction === "rtl" ? "<" : ">"}
//                 </IconButton>
//                 <IconButton
//                   onClick={() =>
//                     onPageChange(
//                       null,
//                       Math.max(0, Math.ceil(count / rowsPerPage) - 1)
//                     )
//                   }
//                   disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//                   aria-label="last page"
//                 >
//                   <LastPageIcon />
//                 </IconButton>
//               </Box>
//             );
//           }}
//         />

//         <Dialog
//           fullScreen
//           open={mobileFiltersOpen}
//           onClose={() => setMobileFiltersOpen(false)}
//         >
//           <DialogTitle
//             sx={{ display: "flex", justifyContent: "space-between" }}
//           >
//             <Typography variant="h6">Filters</Typography>
//             <IconButton onClick={() => setMobileFiltersOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <Box
//               sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
//             >
//               {columns
//                 .filter(
//                   (col) => col.filterable && getFilterValues(col).length > 0
//                 )
//                 .map((column) => (
//                   <Autocomplete
//                     key={column.id as string}
//                     options={["Select All", ...getFilterValues(column)]}
//                     getOptionLabel={(option) =>
//                       option === "Select All" ? "Select All" : option
//                     }
//                     value={filters[column.id as string] || ""}
//                     onChange={(event, newValue) => {
//                       console.log(event);
//                       handleFilterChange(
//                         column.id,
//                         newValue === "Select All" ? "" : newValue || ""
//                       );
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label={`${column.label}`}
//                         size="small"
//                         variant="outlined"
//                         value={
//                           filters[column.id as string] === ""
//                             ? ""
//                             : filters[column.id as string]
//                         }
//                       />
//                     )}
//                     renderOption={(props, option) => (
//                       <li
//                         {...props}
//                         style={{
//                           fontWeight: option === "Select All" ? 600 : 400,
//                           background:
//                             option === "Select All" &&
//                             !filters[column.id as string]
//                               ? alpha(theme.palette.primary.main, 0.1)
//                               : "transparent",
//                         }}
//                       >
//                         {option}
//                       </li>
//                     )}
//                     disableClearable={false}
//                     freeSolo={false}
//                     fullWidth
//                   />
//                 ))}
//               {hasDateData && (
//                 <Button
//                   startIcon={<DateRangeIcon />}
//                   onClick={() => setDateFilterOpen(true)}
//                   variant="outlined"
//                 >
//                   Date Filter
//                 </Button>
//               )}
//               {hasFeeData && renderFeeFilter()}
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={clearAllFilters} color="error">
//               Clear All
//             </Button>
//             <Button
//               onClick={() => {
//                 onFilterChange?.(filters);
//                 setMobileFiltersOpen(false);
//               }}
//               variant="contained"
//               sx={{
//                 background:
//                   "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
//                 color: "#fff",
//               }}
//             >
//               Apply
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {renderDateFilterDialog()}

//         {mobileRowDetail && (
//           <Dialog
//             fullScreen
//             open={Boolean(mobileRowDetail)}
//             onClose={() => setMobileRowDetail(null)}
//           >
//             <DialogTitle
//               sx={{ display: "flex", justifyContent: "space-between" }}
//             >
//               <Typography variant="h6">Details</Typography>
//               <IconButton onClick={() => setMobileRowDetail(null)}>
//                 <CloseIcon />
//               </IconButton>
//             </DialogTitle>
//             <DialogContent>
//               <List>
//                 {columns.map((column) => (
//                   <React.Fragment key={column.id as string}>
//                     <ListItem>
//                       <ListItemText
//                         primary={column.label}
//                         secondary={
//                           column.render
//                             ? column.render(
//                                 mobileRowDetail[column.id],
//                                 mobileRowDetail
//                               )
//                             : mobileRowDetail[column.id]?.toString()
//                         }
//                         primaryTypographyProps={{
//                           fontWeight: 600,
//                           color: "#1b4d3e",
//                         }}
//                       />
//                     </ListItem>
//                     <Divider />
//                   </React.Fragment>
//                 ))}
//               </List>
//             </DialogContent>
//             <DialogActions>
//               {onEdit && (
//                 <Button
//                   startIcon={<EditIcon />}
//                   onClick={() => {
//                     onEdit(mobileRowDetail);
//                     setMobileRowDetail(null);
//                   }}
//                   sx={{ color: "#ff9800" }}
//                 >
//                   Edit
//                 </Button>
//               )}
//               {onDelete && (
//                 <Button
//                   startIcon={<DeleteIcon />}
//                   onClick={() => {
//                     onDelete(mobileRowDetail);
//                     setMobileRowDetail(null);
//                   }}
//                   sx={{ color: "#f44336" }}
//                 >
//                   Delete
//                 </Button>
//               )}
//               <Button
//                 onClick={() => setMobileRowDetail(null)}
//                 sx={{ color: "#1b4d3e" }}
//               >
//                 Close
//               </Button>
//             </DialogActions>
//           </Dialog>
//         )}
//       </StyledPaper>
//     );
//   }

//   // Desktop View
//   return (
//     <StyledPaper elevation={3}>
//       <TableToolbar>
//         <Typography
//           variant="h6"
//           component="div"
//           sx={{
//             fontWeight: 700,
//             background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
//             backgroundClip: "text",
//             WebkitBackgroundClip: "text",
//             color: "transparent",
//           }}
//         >
//           {title}
//         </Typography>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<DownloadIcon />}
//             onClick={handleExport}
//             sx={{
//               borderColor: theme.palette.grey[400],
//               color: theme.palette.grey[700],
//             }}
//           >
//             Export
//           </Button>
//           {(hasFilterableColumns || hasDateData || hasFeeData) && (
//             <Button
//               variant="outlined"
//               startIcon={<FilterIcon />}
//               onClick={() => setShowFilters(!showFilters)}
//               sx={{
//                 borderColor: showFilters
//                   ? theme.palette.primary.main
//                   : theme.palette.grey[400],
//                 color: showFilters
//                   ? theme.palette.primary.main
//                   : theme.palette.grey[700],
//               }}
//             >
//               {!showFilters ? "Hide Filters" : "Show Filters"}
//             </Button>
//           )}
//           {(hasFilterableColumns || hasDateData || hasFeeData) && (
//             <Badge
//               badgeContent={Object.keys(filters).length}
//               color="primary"
//               invisible={Object.keys(filters).length === 0}
//             >
//               <Button
//                 variant="outlined"
//                 onClick={clearAllFilters}
//                 disabled={Object.keys(filters).length === 0}
//                 sx={{
//                   borderColor: theme.palette.error.main,
//                   color: theme.palette.error.main,
//                   "&:hover": {
//                     borderColor: theme.palette.error.dark,
//                   },
//                   "&:disabled": {
//                     borderColor: alpha(theme.palette.action.disabled, 0.12),
//                     color: alpha(theme.palette.action.disabled, 0.38),
//                   },
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </Badge>
//           )}
//           {onAdd && (
//             <PrimaryButton
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={onAdd}
//             >
//               Add New
//             </PrimaryButton>
//           )}
//         </Box>
//       </TableToolbar>

//       {!showFilters && (hasFilterableColumns || hasDateData || hasFeeData) && (
//         <FiltersContainer>
//           {hasDateData && (
//             <Tabs value={false} variant="scrollable" scrollButtons="auto">
//               <FilterTab
//                 label="Date Filter"
//                 icon={<DateRangeIcon />}
//                 onClick={() => setDateFilterOpen(true)}
//               />
//             </Tabs>
//           )}
//           {columns
//             .filter(
//               (col) =>
//                 col.filterable &&
//                 !col.id.toString().includes("date") &&
//                 !col.id.toString().includes("fee") &&
//                 getFilterValues(col).length > 0
//             )
//             .map((column) => renderSelectFilter(column))}
//           {hasFeeData && renderFeeFilter()}
//         </FiltersContainer>
//       )}

//       {renderDateFilterDialog()}

//       <StyledTableContainer sx={{ height: tableHeight }}>
//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "100%",
//               my: 4,
//               gap: 1,
//             }}
//           >
//             <CircularProgress size={40} thickness={4} />
//             <Box sx={{ fontSize: 14, color: "#666" }}>Fetching data...</Box>
//           </Box>
//         ) : (
//           <Table stickyHeader aria-label="data table">
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ width: "60px", textAlign: "center" }}>
//                   S.No.
//                 </TableCell>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id as string}
//                     sortDirection={
//                       sortConfig.key === column.id
//                         ? sortConfig.direction
//                         : false
//                     }
//                   >
//                     {column.sortable ? (
//                       <TableSortLabel
//                         active={sortConfig.key === column.id}
//                         direction={
//                           sortConfig.key === column.id
//                             ? sortConfig.direction
//                             : "asc"
//                         }
//                         onClick={() => handleSort(column.id)}
//                       >
//                         {column.label}
//                       </TableSortLabel>
//                     ) : (
//                       column.label
//                     )}
//                   </TableCell>
//                 ))}
//                 {showActions && (
//                   <TableCell sx={{ width: "150px" }}>Actions</TableCell>
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((row, index) => {
//                 const id = getRowId(row);
//                 const serialNumber = page * rowsPerPage + index + 1;

//                 return (
//                   <TableRow hover key={id}>
//                     <SerialNumberCell>{serialNumber}</SerialNumberCell>
//                     {columns.map((column) => (
//                       <TableCell key={column.id as string}>
//                         {column.render
//                           ? column.render(row[column.id], row)
//                           : row[column.id]?.toString()}
//                       </TableCell>
//                     ))}
//                     {showActions && (
//                       <TableCell>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             gap: 1,
//                             justifyContent: "flex-end",
//                           }}
//                         >
//                           {onView && (
//                             <IconButton
//                               size="small"
//                               onClick={() => onView(row)}
//                               sx={{
//                                 background: alpha("#1976d2", 0.1),
//                                 "&:hover": {
//                                   background: alpha("#1976d2", 0.2),
//                                 },
//                               }}
//                               aria-label="view"
//                             >
//                               <ViewIcon fontSize="small" />
//                             </IconButton>
//                           )}
//                           {onEdit && (
//                             <IconButton
//                               size="small"
//                               onClick={() => onEdit(row)}
//                               sx={{
//                                 background: alpha("#ff9800", 0.1),
//                                 "&:hover": {
//                                   background: alpha("#ff9800", 0.2),
//                                 },
//                               }}
//                               aria-label="edit"
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                           )}
//                           {onDelete && (
//                             <IconButton
//                               size="small"
//                               onClick={() => onDelete(row)}
//                               sx={{
//                                 background: alpha("#f44336", 0.1),
//                                 "&:hover": {
//                                   background: alpha("#f44336", 0.2),
//                                 },
//                               }}
//                               aria-label="delete"
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           )}
//                         </Box>
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         )}
//       </StyledTableContainer>

//       <TablePagination
//         component="div"
//         count={totalCount}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         rowsPerPageOptions={[5, 10, 25, 50]}
//         ActionsComponent={(props) => {
//           const { count, page, rowsPerPage, onPageChange } = props;
//           return (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <IconButton
//                 onClick={() => onPageChange(null, 0)}
//                 disabled={page === 0}
//                 aria-label="first page"
//               >
//                 <FirstPageIcon />
//               </IconButton>
//               <IconButton
//                 onClick={() => onPageChange(null, page - 1)}
//                 disabled={page === 0}
//                 aria-label="previous page"
//               >
//                 {theme.direction === "rtl" ? ">" : "<"}
//               </IconButton>
//               <IconButton
//                 onClick={() => onPageChange(null, page + 1)}
//                 disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//                 aria-label="next page"
//               >
//                 {theme.direction === "rtl" ? "<" : ">"}
//               </IconButton>
//               <IconButton
//                 onClick={() =>
//                   onPageChange(
//                     null,
//                     Math.max(0, Math.ceil(count / rowsPerPage) - 1)
//                   )
//                 }
//                 disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//                 aria-label="last page"
//               >
//                 <LastPageIcon />
//               </IconButton>
//             </Box>
//           );
//         }}
//       />
//     </StyledPaper>
//   );
// }

// export default GenericTable;

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Box,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  Badge,
  CircularProgress,
  TableSortLabel,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  DateRange as DateRangeIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { styled } from "@mui/material/styles";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  subWeeks,
  subMonths,
} from "date-fns";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 100%)",
  backdropFilter: "blur(8px)",
  [theme.breakpoints.down("sm")]: {
    borderRadius: "0",
    boxShadow: "none",
    background: theme.palette.background.paper,
    marginTop: "64px",
    minHeight: "calc(100vh - 64px)",
    paddingTop: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  width: "100%",
  "& .MuiTable-root": {
    minWidth: "800px",
  },
  "& .MuiTableCell-head": {
    background: `linear-gradient(180deg, ${alpha("#2e7d32", 0.9)} 0%, ${alpha(
      "#1b4d3e",
      0.9
    )} 100%)`,
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    borderBottom: "none",
    paddingLeft: theme.spacing(3),
    "&:first-of-type": {
      borderTopLeftRadius: "8px",
    },
    "&:last-of-type": {
      borderTopRightRadius: "8px",
      textAlign: "right",
      paddingRight: theme.spacing(3),
    },
  },
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease",
    "&:hover": {
      background: alpha(theme.palette.primary.light, 0.05),
    },
    "&.Mui-selected": {
      background: alpha(theme.palette.primary.light, 0.15),
    },
  },
  "& .MuiTableRow-root:nth-of-type(even)": {
    background: alpha(theme.palette.action.hover, 0.05),
  },
  "& .MuiTableCell-root": {
    padding: theme.spacing(1.5),
    paddingLeft: theme.spacing(3),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    "&:last-of-type": {
      textAlign: "right",
      paddingRight: theme.spacing(3),
    },
  },
}));

const SerialNumberCell = styled(TableCell)(({ theme }) => ({
  width: "60px",
  textAlign: "center",
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

const TableToolbar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.main,
    0.1
  )} 0%, transparent 100%)`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "none",
  background:
    "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
  color: theme.palette.common.white,
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "8px",
    background: alpha(theme.palette.background.paper, 0.9),
    "&:hover": {
      background: alpha(theme.palette.background.paper, 1),
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.divider, 0.3),
  },
}));

const DateFilterDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6B5B95, #957DAD)",
    color: theme.palette.common.white,
    padding: 0,
    overflow: "hidden",
    width: "600px",
    maxWidth: "90%",
  },
  "& .MuiDialogTitle-root": {
    background: "transparent",
    color: theme.palette.common.white,
    fontWeight: 600,
    padding: theme.spacing(2),
    borderBottom: "none",
  },
  "& .MuiDialogContent-root": {
    padding: 0,
    display: "flex",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
    background: "rgba(255, 255, 255, 0.1)",
  },
  "& .MuiButton-root": {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    padding: theme.spacing(1, 2),
    "&:hover": {
      transform: "translateY(-1px)",
    },
  },
}));

const DateFilterSidebar = styled(Box)(({ theme }) => ({
  width: "150px",
  background: "rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
}));

const DateFilterPresetButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  textTransform: "none",
  justifyContent: "flex-start",
  color: active
    ? theme.palette.common.white
    : alpha(theme.palette.common.white, 0.7),
  background: active ? alpha(theme.palette.primary.main, 0.3) : "transparent",
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.common.white,
  },
}));

const DateFilterCalendarContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  "& .MuiTextField-root": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      color: theme.palette.common.white,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.white, 0.3),
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.common.white,
    },
    "& .MuiInputLabel-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.common.white,
    },
  },
  "& .MuiPickersDay-root": {
    color: theme.palette.common.white,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  },
  "& .MuiPickersDay-today": {
    border: `1px solid ${theme.palette.common.white}`,
  },
}));

const FilterTab = styled(Tab)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 600,
  background: alpha(theme.palette.primary.light, 0.1),
  "&.Mui-selected": {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.2),
  },
}));

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  filterable?: boolean;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  onAdd?: () => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  showActions?: boolean;
  getRowId: (row: T) => string | number;
  initialRowsPerPage?: number;
  tableHeight?: string;
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSortChange?: (sortBy: keyof T, sortOrder: "asc" | "desc") => void;
  onFetchFilterOptions?: (field: keyof T, searchValue: string) => Promise<string[]>;
  loading?: boolean;
}

function GenericTable<T>({
  data,
  columns,
  title = "Data Table",
  onAdd,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  getRowId,
  initialRowsPerPage = 10,
  tableHeight = "calc(100vh - 250px)",
  totalCount = data.length,
  page = 0,
  rowsPerPage = initialRowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onFilterChange,
  onSortChange,
  onFetchFilterOptions,
  loading = false,
}: TableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);
  const [tempDateRange, setTempDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("Custom");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
  const [filterLoading, setFilterLoading] = useState<Record<string, boolean>>({});
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});

  const hasFilterableColumns = useMemo(
    () => columns.some((col) => col.filterable),
    [columns]
  );

  const hasDateData = useMemo(
    () =>
      data.some(
        (item) => item["booking_date" as keyof T] || item["date" as keyof T]
      ),
    [data]
  );

  const hasFeeData = useMemo(() => {
    const feeValues = data
      .map((item: any) => {
        const value =
          (item as any)["consultation_fee"] ||
          (item as any)["fee"] ||
          (item as any)["consulting_fee"];
        return typeof value === "string"
          ? parseInt(value.replace(/[^0-9]/g, "")) || null
          : value;
      })
      .filter((value) => value !== null && value !== 0 && !isNaN(value));
    return feeValues.length > 0;
  }, [data]);

  const handleFilterChange = (columnId: keyof T, value: string) => {
    const newFilters = { ...filters, [columnId as string]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearchChange = async (columnId: keyof T, searchValue: string) => {
    const columnIdStr = columnId as string;
    setSearchValues((prev) => ({ ...prev, [columnIdStr]: searchValue }));

    // Only fetch filter options if searchValue is non-empty
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
      console.error(`Failed to fetch filter options for ${columnId}:`, error);
      setFilterOptions((prev) => ({ ...prev, [columnIdStr]: [] }));
    } finally {
      setFilterLoading((prev) => ({ ...prev, [columnIdStr]: false }));
    }
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    const newFilters = {
      ...filters,
      booking_date:
        start || end
          ? `${start?.toISOString() || ""}-${end?.toISOString() || ""}`
          : "",
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTempDateRangeChange = (start: Date | null, end: Date | null) => {
    setTempDateRange({ start, end });
    setSelectedPreset("Custom");
  };

  const applyDateFilter = () => {
    handleDateRangeChange(tempDateRange.start, tempDateRange.end);
    setDateFilterOpen(false);
  };

  const clearDateFilter = () => {
    setTempDateRange({ start: null, end: null });
    handleDateRangeChange(null, null);
    setSelectedPreset("Custom");
    setDateFilterOpen(false);
  };

  const handlePresetChange = (preset: string) => {
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
      default:
        start = tempDateRange.start;
        end = tempDateRange.end;
        break;
    }

    setTempDateRange({ start, end });
    setSelectedPreset(preset);
  };

  const clearAllFilters = () => {
    setFilters({});
    setTempDateRange({ start: null, end: null });
    setSelectedPreset("Custom");
    setFilterOptions({});
    setSearchValues({});
    onFilterChange?.({});
  };

  const handleSort = (columnId: keyof T) => {
    const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortConfig({ key: columnId, direction: newDirection });
    onSortChange?.(columnId, newDirection);
  };

  const handleChangePage = (event: any, newPage: number) => {
    console.log(event);
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onRowsPerPageChange?.(newRowsPerPage);
    onPageChange?.(0);
  };

  const handleExport = () => {
    const csv = [
      columns.map((col) => col.label).join(","),
      ...data.map((row) =>
        columns
          .map((col) => {
            const value = row[col.id];
            return `"${value?.toString().replace(/"/g, '""') || ""}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "Select Date Range";
    return `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;
  };

  const renderDateFilterDialog = () => {
    return (
      <DateFilterDialog
        open={dateFilterOpen}
        onClose={() => setDateFilterOpen(false)}
      >
        <DialogTitle>
          {formatDateRange(tempDateRange.start, tempDateRange.end)}
        </DialogTitle>
        <DialogContent>
          <DateFilterSidebar>
            {[
              "Custom",
              "Today",
              "Yesterday",
              "Last Week",
              "Last Month",
              "Last 7 days",
              "Last 30 days",
            ].map((preset) => (
              <DateFilterPresetButton
                key={preset}
                active={selectedPreset === preset}
                onClick={() => handlePresetChange(preset)}
              >
                {preset}
              </DateFilterPresetButton>
            ))}
          </DateFilterSidebar>
          <DateFilterCalendarContainer>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={tempDateRange.start}
                  onChange={(newValue) =>
                    handleTempDateRangeChange(newValue, tempDateRange.end)
                  }
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { size: "small", sx: { flex: 1 } } }}
                />
                <DatePicker
                  label="End Date"
                  value={tempDateRange.end}
                  onChange={(newValue) =>
                    handleTempDateRangeChange(tempDateRange.start, newValue)
                  }
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { size: "small", sx: { flex: 1 } } }}
                />
              </Box>
            </LocalizationProvider>
          </DateFilterCalendarContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearDateFilter} color="error">
            Clear
          </Button>
          <Button onClick={() => setDateFilterOpen(false)}>Cancel</Button>
          <Button
            onClick={applyDateFilter}
            variant="contained"
            disabled={!tempDateRange.start && !tempDateRange.end}
          >
            Apply
          </Button>
        </DialogActions>
      </DateFilterDialog>
    );
  };

  const renderFeeFilter = () => {
    if (!hasFeeData) return null;

    const feeRanges = ["< 500", "500 - 1000", "> 1000"];

    const handleRangeSelect = (value: string) => {
      handleFilterChange("consultation_fee" as keyof T, value);
    };

    return (
      <StyledFormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Fee Range</InputLabel>
        <Select
          value={filters["consultation_fee"] || ""}
          onChange={(e) => handleRangeSelect(e.target.value as string)}
          label="Fee Range"
          sx={{
            "& .MuiSelect-select": {
              padding: "6px 10px",
              fontSize: "0.9rem",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3f51b5",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3f51b5",
            },
            borderRadius: 1,
          }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {feeRanges.map((range) => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    );
  };

  const renderSelectFilter = (column: TableColumn<T>) => {
    const columnId = column.id as string;
    const options = filterOptions[columnId] || [];
    const isLoading = filterLoading[columnId] || false;

    return (
      <StyledFormControl key={columnId} size="small" fullWidth>
        <Autocomplete
          options={["Select All", ...options]}
          getOptionLabel={(option) =>
            option === "Select All" ? "Select All" : option
          }
          value={filters[columnId] || ""}
          onChange={(event, newValue) => {
            const selectedValue = newValue === "Select All" ? "" : newValue || "";
            handleFilterChange(column.id, selectedValue);
            // Reset search input if a value is selected or cleared
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
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li
              {...props}
              style={{
                fontWeight: option === "Select All" ? 600 : 400,
                background:
                  option === "Select All" && !filters[columnId]
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
              }}
            >
              {option}
            </li>
          )}
          disableClearable={false}
          freeSolo={false}
        />
      </StyledFormControl>
    );
  };

  if (isMobile) {
    return (
      <StyledPaper
        elevation={0}
        sx={{
          paddingTop: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            position: "sticky",
            top: 0,
            zIndex: 3,
            background: theme.palette.background.paper,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1b4d3e" }}>
            {title}
          </Typography>
          {onAdd && (
            <IconButton
              color="primary"
              onClick={onAdd}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
                color: "#fff",
                position: "absolute",
                right: 16,
                top: 16,
              }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>

        {(hasFilterableColumns || hasDateData || hasFeeData) && (
          <Box
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "flex-end",
              position: "sticky",
              top: "64px",
              zIndex: 2,
              background: theme.palette.background.paper,
            }}
          >
            <Badge
              badgeContent={Object.keys(filters).length}
              color="primary"
              invisible={Object.keys(filters).length === 0}
            >
              <Button
                startIcon={<FilterIcon />}
                onClick={() => setMobileFiltersOpen(true)}
                size="small"
              >
                Filters
              </Button>
            </Badge>
          </Box>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              my: 4,
              gap: 1,
            }}
          >
            <CircularProgress size={40} thickness={4} />
            <Box sx={{ fontSize: 14, color: "#666" }}>Fetching data...</Box>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: "auto", paddingBottom: 7 }}>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const id = getRowId(row);
                const serialNumber = page * rowsPerPage + index + 1;

                return (
                  <React.Fragment key={id}>
                    <ListItem
                      component="button"
                      onClick={() => setMobileRowDetail(row)}
                      sx={{ pl: 2, py: 1.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          minWidth: "24px",
                          mr: 1,
                        }}
                      >
                        {serialNumber}.
                      </Typography>
                      <ListItemText
                        primary={
                          columns[0].render
                            ? columns[0].render(row[columns[0].id], row)
                            : row[columns[0].id]?.toString()
                        }
                        secondary={
                          columns[1]?.render
                            ? columns[1].render(row[columns[1].id], row)
                            : row[columns[1]?.id]?.toString()
                        }
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      {showActions && (
                        <Box sx={{ display: "flex" }}>
                          {onView && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(row);
                              }}
                              sx={{ color: "#1976d2" }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                );
              })}
          </List>
        )}

        <TablePagination
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            borderTop: `1px solid ${alpha("#ddd", 0.2)}`,
            background: alpha("#f9f9f9", 0.95),
            position: "sticky",
            bottom: 0,
            zIndex: 2,
          }}
          ActionsComponent={(props) => {
            const { count, page, rowsPerPage, onPageChange } = props;
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => onPageChange(null, 0)}
                  disabled={page === 0}
                  aria-label="first page"
                >
                  <FirstPageIcon />
                </IconButton>
                <IconButton
                  onClick={() => onPageChange(null, page - 1)}
                  disabled={page === 0}
                  aria-label="previous page"
                >
                  {theme.direction === "rtl" ? ">" : "<"}
                </IconButton>
                <IconButton
                  onClick={() => onPageChange(null, page + 1)}
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label="next page"
                >
                  {theme.direction === "rtl" ? "<" : ">"}
                </IconButton>
                <IconButton
                  onClick={() =>
                    onPageChange(
                      null,
                      Math.max(0, Math.ceil(count / rowsPerPage) - 1)
                    )
                  }
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label="last page"
                >
                  <LastPageIcon />
                </IconButton>
              </Box>
            );
          }}
        />

        <Dialog
          fullScreen
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              {columns
                .filter((col) => col.filterable)
                .map((column) => {
                  const columnId = column.id as string;
                  const options = filterOptions[columnId] || [];
                  const isLoading = filterLoading[columnId] || false;

                  return (
                    <Autocomplete
                      key={columnId}
                      options={["Select All", ...options]}
                      getOptionLabel={(option) =>
                        option === "Select All" ? "Select All" : option
                      }
                      value={filters[columnId] || ""}
                      onChange={(event, newValue) => {
                        const selectedValue = newValue === "Select All" ? "" : newValue || "";
                        handleFilterChange(column.id, selectedValue);
                        // Reset search input if a value is selected or cleared
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
                                {isLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            fontWeight: option === "Select All" ? 600 : 400,
                            background:
                              option === "Select All" && !filters[columnId]
                                ? alpha(theme.palette.primary.main, 0.1)
                                : "transparent",
                          }}
                        >
                          {option}
                        </li>
                      )}
                      disableClearable={false}
                      freeSolo={false}
                      fullWidth
                    />
                  );
                })}
              {hasDateData && (
                <Button
                  startIcon={<DateRangeIcon />}
                  onClick={() => setDateFilterOpen(true)}
                  variant="outlined"
                >
                  Date Filter
                </Button>
              )}
              {hasFeeData && renderFeeFilter()}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={clearAllFilters} color="error">
              Clear All
            </Button>
            <Button
              onClick={() => {
                onFilterChange?.(filters);
                setMobileFiltersOpen(false);
              }}
              variant="contained"
              sx={{
                background:
                  "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
                color: "#fff",
              }}
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {renderDateFilterDialog()}

        {mobileRowDetail && (
          <Dialog
            fullScreen
            open={Boolean(mobileRowDetail)}
            onClose={() => setMobileRowDetail(null)}
          >
            <DialogTitle
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h6">Details</Typography>
              <IconButton onClick={() => setMobileRowDetail(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <List>
                {columns.map((column) => (
                  <React.Fragment key={column.id as string}>
                    <ListItem>
                      <ListItemText
                        primary={column.label}
                        secondary={
                          column.render
                            ? column.render(
                                mobileRowDetail[column.id],
                                mobileRowDetail
                              )
                            : mobileRowDetail[column.id]?.toString()
                        }
                        primaryTypographyProps={{
                          fontWeight: 600,
                          color: "#1b4d3e",
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              {onEdit && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => {
                    onEdit(mobileRowDetail);
                    setMobileRowDetail(null);
                  }}
                  sx={{ color: "#ff9800" }}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    onDelete(mobileRowDetail);
                    setMobileRowDetail(null);
                  }}
                  sx={{ color: "#f44336" }}
                >
                  Delete
                </Button>
              )}
              <Button
                onClick={() => setMobileRowDetail(null)}
                sx={{ color: "#1b4d3e" }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </StyledPaper>
    );
  }

  // Desktop View
  return (
    <StyledPaper elevation={3}>
      <TableToolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{
              borderColor: theme.palette.grey[400],
              color: theme.palette.grey[700],
            }}
          >
            Export
          </Button>
          {(hasFilterableColumns || hasDateData || hasFeeData) && (
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderColor: showFilters
                  ? theme.palette.primary.main
                  : theme.palette.grey[400],
                color: showFilters
                  ? theme.palette.primary.main
                  : theme.palette.grey[700],
              }}
            >
              {!showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          )}
          {(hasFilterableColumns || hasDateData || hasFeeData) && (
            <Badge
              badgeContent={Object.keys(filters).length}
              color="primary"
              invisible={Object.keys(filters).length === 0}
            >
              <Button
                variant="outlined"
                onClick={clearAllFilters}
                disabled={Object.keys(filters).length === 0}
                sx={{
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  "&:hover": {
                    borderColor: theme.palette.error.dark,
                  },
                  "&:disabled": {
                    borderColor: alpha(theme.palette.action.disabled, 0.12),
                    color: alpha(theme.palette.action.disabled, 0.38),
                  },
                }}
              >
                Clear Filters
              </Button>
            </Badge>
          )}
          {onAdd && (
            <PrimaryButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
            >
              Add New
            </PrimaryButton>
          )}
        </Box>
      </TableToolbar>

      {!showFilters && (hasFilterableColumns || hasDateData || hasFeeData) && (
        <FiltersContainer>
          {hasDateData && (
            <Tabs value={false} variant="scrollable" scrollButtons="auto">
              <FilterTab
                label="Date Filter"
                icon={<DateRangeIcon />}
                onClick={() => setDateFilterOpen(true)}
              />
            </Tabs>
          )}
          {columns
            .filter(
              (col) =>
                col.filterable &&
                !col.id.toString().includes("date") &&
                !col.id.toString().includes("fee")
            )
            .map((column) => renderSelectFilter(column))}
          {hasFeeData && renderFeeFilter()}
        </FiltersContainer>
      )}

      {renderDateFilterDialog()}

      <StyledTableContainer sx={{ height: tableHeight }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              my: 4,
              gap: 1,
            }}
          >
            <CircularProgress size={40} thickness={4} />
            <Box sx={{ fontSize: 14, color: "#666" }}>Fetching data...</Box>
          </Box>
        ) : (
          <Table stickyHeader aria-label="data table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "60px", textAlign: "center" }}>
                  S.No.
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id as string}
                    sortDirection={
                      sortConfig.key === column.id
                        ? sortConfig.direction
                        : false
                    }
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortConfig.key === column.id}
                        direction={
                          sortConfig.key === column.id
                            ? sortConfig.direction
                            : "asc"
                        }
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell sx={{ width: "150px" }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => {
                const id = getRowId(row);
                const serialNumber = page * rowsPerPage + index + 1;

                return (
                  <TableRow hover key={id}>
                    <SerialNumberCell>{serialNumber}</SerialNumberCell>
                    {columns.map((column) => (
                      <TableCell key={column.id as string}>
                        {column.render
                          ? column.render(row[column.id], row)
                          : row[column.id]?.toString()}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          {onView && (
                            <IconButton
                              size="small"
                              onClick={() => onView(row)}
                              sx={{
                                background: alpha("#1976d2", 0.1),
                                "&:hover": {
                                  background: alpha("#1976d2", 0.2),
                                },
                              }}
                              aria-label="view"
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          )}
                          {onEdit && (
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row)}
                              sx={{
                                background: alpha("#ff9800", 0.1),
                                "&:hover": {
                                  background: alpha("#ff9800", 0.2),
                                },
                              }}
                              aria-label="edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {onDelete && (
                            <IconButton
                              size="small"
                              onClick={() => onDelete(row)}
                              sx={{
                                background: alpha("#f44336", 0.1),
                                "&:hover": {
                                  background: alpha("#f44336", 0.2),
                                },
                              }}
                              aria-label="delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </StyledTableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        ActionsComponent={(props) => {
          const { count, page, rowsPerPage, onPageChange } = props;
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => onPageChange(null, 0)}
                disabled={page === 0}
                aria-label="first page"
              >
                <FirstPageIcon />
              </IconButton>
              <IconButton
                onClick={() => onPageChange(null, page - 1)}
                disabled={page === 0}
                aria-label="previous page"
              >
                {theme.direction === "rtl" ? ">" : "<"}
              </IconButton>
              <IconButton
                onClick={() => onPageChange(null, page + 1)}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
              >
                {theme.direction === "rtl" ? "<" : ">"}
              </IconButton>
              <IconButton
                onClick={() =>
                  onPageChange(
                    null,
                    Math.max(0, Math.ceil(count / rowsPerPage) - 1)
                  )
                }
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
              >
                <LastPageIcon />
              </IconButton>
            </Box>
          );
        }}
      />
    </StyledPaper>
  );
}

export default GenericTable;