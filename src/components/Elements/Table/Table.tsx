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
//   Stack,
//   Popper,
//   Theme
// } from "@mui/material";
// import {
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
//   Close as CloseIcon,
//   FilterList as FilterIcon,
//   Delete as DeleteIcon,
//   Download as DownloadIcon,
//   FirstPage as FirstPageIcon,
//   LastPage as LastPageIcon,
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
//   [theme.breakpoints.down("sm")]: {
//     flexDirection: "column",
//     gap: theme.spacing(1),
//     padding: theme.spacing(1),
//   },
// }));

// const PrimaryButton = styled(Button)(({ theme }: { theme: Theme }) => ({
//   borderRadius: "8px",
//   textTransform: "none",
//   fontWeight: 600,
//   padding: theme.spacing(1, 2), // Default padding for larger screens
//   fontSize: "0.875rem", // Default fontSize for larger screens
//   transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//   boxShadow: "none",
//   background:
//     "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
//   color: theme.palette.common.white,
//   "&:hover": {
//     transform: "translateY(-1px)",
//     boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
//   },
//   // Responsive styles using theme.breakpoints
//   [theme.breakpoints.down("sm")]: {
//     padding: theme.spacing(0.5, 1), // Smaller padding for xs screens
//     fontSize: "0.8rem", // Smaller fontSize for xs screens
//   },
// }));

// const FiltersContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   display: "flex",
//   flexWrap: "wrap",
//   gap: theme.spacing(2),
//   justifyContent: "flex-start",
//   borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//   [theme.breakpoints.down("sm")]: {
//     flexDirection: "column",
//     gap: theme.spacing(1),
//   },
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
//   [theme.breakpoints.down("sm")]: {
//     "& .MuiInputBase-root": {
//       fontSize: "0.8rem",
//     },
//   },
// }));

// // const CustomPaper = styled(Paper)(({ theme, width }:any) => ({
// //   width: width,
// //   borderRadius: "8px",
// //   boxShadow: `0 2px 8px ${alpha(theme.palette.grey[500], 0.2)}`,
// // }));

// export interface TableColumn<T> {
//   id: keyof T;
//   label: string;
//   filterable?: boolean;
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
//   onFetchFilterOptions?: (field: keyof T, searchValue: string) => Promise<string[]>;
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
//   onFetchFilterOptions,
//   loading = false,
// }: TableProps<T>) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [showFilters, setShowFilters] = useState(true);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);
//   const [tempDateRange, setTempDateRange] = useState<{
//     start: Date | null;
//     end: Date | null;
//   }>({
//     start: null,
//     end: null,
//   });
//   const [selectedPreset, setSelectedPreset] = useState<string>("");
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof T | null;
//     direction: "asc" | "desc";
//   }>({ key: null, direction: "asc" });
//   const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
//   const [filterLoading, setFilterLoading] = useState<Record<string, boolean>>({});
//   const [searchValues, setSearchValues] = useState<Record<string, string>>({});

//   const hasFilterableColumns = useMemo(
//     () => columns.some((col) => col.filterable),
//     [columns]
//   );

//   const hasDateData = useMemo(
//     () =>
//       data.some(
//         (item) =>
//           item["booking_date" as keyof T] ||
//           item["date" as keyof T] ||
//           item["sent_by_date" as keyof T] ||
//           item["start_time" as keyof T]
//       ),
//     [data]
//   );

//   const hasFeeData = useMemo(() => {
//     const feeValues = data
//       .map((item: any) => {
//         const value =
//           (item as any)["consultation_fee"] ||
//           (item as any)["fee"] ||
//           (item as any)["local_consulting_fee"];
//         return typeof value === "string"
//           ? parseInt(value.replace(/[^0-9]/g, "")) || null
//           : value;
//       })
//       .filter((value) => value !== null && value !== 0 && !isNaN(value));
//     return feeValues.length > 0;
//   }, [data]);

//   const handleFilterChange = (columnId: keyof T, value: string) => {
//     const newFilters = { ...filters, [columnId as string]: value };
//     setFilters(newFilters);
//     onFilterChange?.(newFilters);
//   };

//   const handleSearchChange = async (columnId: keyof T, searchValue: string) => {
//     const columnIdStr = columnId as string;
//     setSearchValues((prev) => ({ ...prev, [columnIdStr]: searchValue }));

//     // Only fetch filter options if searchValue is non-empty
//     if (!searchValue.trim() || !onFetchFilterOptions) {
//       setFilterOptions((prev) => ({ ...prev, [columnIdStr]: [] }));
//       setFilterLoading((prev) => ({ ...prev, [columnIdStr]: false }));
//       return;
//     }

//     setFilterLoading((prev) => ({ ...prev, [columnIdStr]: true }));
//     try {
//       const options = await onFetchFilterOptions(columnId, searchValue);
//       setFilterOptions((prev) => ({ ...prev, [columnIdStr]: options }));
//     } catch (error:any) {
//       console.error(`Failed to fetch filter`, error);
//       setFilterOptions((prev) => ({ ...prev, [columnIdStr]: [] }));
//     } finally {
//       setFilterLoading((prev) => ({ ...prev, [columnIdStr]: false }));
//     }
//   };

//   const handleDatePresetChange = (preset: string) => {
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
//         start = tempDateRange.start;
//         end = tempDateRange.end;
//         break;
//       default:
//         start = null;
//         end = null;
//         break;
//     }

//     setSelectedPreset(preset);
//     setTempDateRange({ start, end });
//     handleDateRangeChange(start, end);
//   };

//   const handleDateRangeChange = (start: Date | null, end: Date | null) => {
//     const dateFilterValue =
//       start && end
//         ? `${format(start, "yyyy-MM-dd")}-${format(end, "yyyy-MM-dd")}`
//         : "";
//     const newFilters = { ...filters, booking_date: dateFilterValue };
//     setFilters(newFilters);
//     onFilterChange?.(newFilters);
//   };

//   const handleCustomDateChange = (start: Date | null, end: Date | null) => {
//     setTempDateRange({ start, end });
//     handleDateRangeChange(start, end);
//   };

//   const clearAllFilters = () => {
//     setFilters({});
//     setTempDateRange({ start: null, end: null });
//     setSelectedPreset("");
//     setFilterOptions({});
//     setSearchValues({});
//     onFilterChange?.({});
//   };

//   const handleSort = (columnId: keyof T) => {
//     const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
//     const newDirection = isAsc ? "desc" : "asc";
//     setSortConfig({ key: columnId, direction: newDirection });
//     onSortChange?.(columnId, newDirection);
//   };

//   const handleChangePage = (event: any, newPage: number) => {
//     console.log(event)
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

//   const renderDateFilter = () => {
//     if (!hasDateData) return null;

//     const datePresets = [
//       { value: "", label: "All Dates" },
//       { value: "Today", label: "Today" },
//       { value: "Yesterday", label: "Yesterday" },
//       { value: "Last Week", label: "Last Week" },
//       { value: "Last Month", label: "Last Month" },
//       { value: "Last 7 days", label: "Last 7 days" },
//       { value: "Last 30 days", label: "Last 30 days" },
//       { value: "Custom", label: "Custom" },
//     ];

//     return (
//       <Box sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 450 } }}>
//         <StyledFormControl
//           size="small"
//           sx={{
//             width: "100%",
//             maxWidth: { xs: "100%", sm: 450 },
//             boxSizing: "border-box",
//           }}
//         >
//           <InputLabel>Date Range</InputLabel>
//           <Select
//             value={selectedPreset}
//             onChange={(e) => handleDatePresetChange(e.target.value as string)}
//             label="Date Range"
//             sx={{
//               "& .MuiSelect-select": {
//                 padding: "6px 10px",
//                 fontSize: { xs: "0.8rem", sm: "0.9rem" },
//               },
//               "& .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#e0e0e0",
//               },
//               "&:hover .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#3f51b5",
//               },
//               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#3f51b5",
//               },
//               borderRadius: 1,
//             }}
//           >
//             {datePresets.map((preset) => (
//               <MenuItem key={preset.value} value={preset.value}>
//                 {preset.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </StyledFormControl>
//         {selectedPreset === "Custom" && (
//           <Box
//             sx={{
//               p: 2,
//               mt: 1,
//               background: alpha(theme.palette.background.paper, 0.5),
//               border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
//               borderRadius: "8px",
//               width: "100%",
//               maxWidth: { xs: "100%", sm: 450 },
//               boxSizing: "border-box",
//               overflow: "visible",
//             }}
//           >
//             <Typography
//               variant="subtitle2"
//               sx={{
//                 mb: 1,
//                 fontWeight: 600,
//                 color: theme.palette.text.primary,
//               }}
//             >
//               Custom Date Range
//             </Typography>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   gap: 2,
//                   justifyContent: { xs: "flex-start", sm: "space-between" },
//                   alignItems: { xs: "stretch", sm: "center" },
//                 }}
//               >
//                 <DatePicker
//                   label="Start Date"
//                   value={tempDateRange.start}
//                   onChange={(newValue) =>
//                     handleCustomDateChange(newValue, tempDateRange.end)
//                   }
//                   slots={{ textField: TextField }}
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       sx: {
//                         "& .MuiInputBase-root": {
//                           borderRadius: "8px",
//                           background: alpha(theme.palette.background.paper, 0.9),
//                           fontSize: { xs: "0.8rem", sm: "0.9rem" },
//                         },
//                         "& .MuiOutlinedInput-notchedOutline": {
//                           borderColor: alpha(theme.palette.divider, 0.3),
//                         },
//                         width: { xs: "100%", sm: 200 },
//                       },
//                     },
//                   }}
//                 />
//                 <DatePicker
//                   label="End Date"
//                   value={tempDateRange.end}
//                   onChange={(newValue) =>
//                     handleCustomDateChange(tempDateRange.start, newValue)
//                   }
//                   slots={{ textField: TextField }}
//                   slotProps={{
//                     textField: {
//                       size: "small",
//                       sx: {
//                         "& .MuiInputBase-root": {
//                           borderRadius: "8px",
//                           background: alpha(theme.palette.background.paper, 0.9),
//                           fontSize: { xs: "0.8rem", sm: "0.9rem" },
//                         },
//                         "& .MuiOutlinedInput-notchedOutline": {
//                           borderColor: alpha(theme.palette.divider, 0.3),
//                         },
//                         width: { xs: "100%", sm: 200 },
//                       },
//                     },
//                   }}
//                 />
//               </Box>
//             </LocalizationProvider>
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   const renderFeeFilter = () => {
//     if (!hasFeeData) return null;

//     const feeRanges = ["< 500", "500 - 1000", "> 1000"];
//     const currencyCodes = ["INR", "USD", "EUR"];

//     const handleFeeRangeChange = (value: string) => {
//       const currency = filters["consultation_fee"]?.split(" ")[1] || "INR";
//       const newValue = value ? `${value} ${currency}` : currency;
//       handleFilterChange("consultation_fee" as keyof T, newValue);
//     };

//     const handleCurrencyChange = (value: string) => {
//       const feeRange = filters["consultation_fee"]?.split(" ")[0] || "";
//       const newValue = feeRange ? `${feeRange} ${value}` : value;
//       handleFilterChange("consultation_fee" as keyof T, newValue);
//     };

//     return (
//       <Box
//         sx={{
//           minWidth: { xs: "100%", sm: 300 },
//           maxWidth: { xs: "100%", sm: 500 },
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           gap: { xs: 1, sm: 0.5 },
//         }}
//       >
//         <StyledFormControl
//           size="small"
//           sx={{
//             width: { xs: "100%", sm: 100 },
//             "& .MuiInputBase-root": {
//               background: alpha(theme.palette.grey[100], 0.3),
//             },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               width: "100%",
//               marginBottom: "2px",
//             }}
//           >
//             <Typography
//               variant="caption"
//               sx={{
//                 fontSize: { xs: "0.75rem", sm: "0.75rem" },
//                 fontWeight: 700,
//                 color: theme.palette.text.primary,
//                 display: "inline-block",
//                 borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//                 backgroundColor: alpha(theme.palette.grey[100], 0.5),
//                 padding: "0 4px",
//               }}
//             >
//               Currency
//             </Typography>
//           </Box>
//           <Select
//             value={filters["consultation_fee"]?.split(" ")[1] || "INR"}
//             onChange={(e) => handleCurrencyChange(e.target.value as string)}
//             label="Currency"
//             sx={{
//               "& .MuiSelect-select": {
//                 padding: "6px 8px",
//                 fontSize: { xs: "0.8rem", sm: "0.9rem" },
//                 height: "38px",
//                 display: "flex",
//                 alignItems: "center",
//                 textAlign: "center",
//               },
//               "& .MuiOutlinedInput-notchedOutline": {
//                 borderColor: alpha(theme.palette.divider, 0.3),
//               },
//               "&:hover .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#3f51b5",
//               },
//               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#3f51b5",
//               },
//               borderRadius: "8px",
//             }}
//           >
//             {currencyCodes.map((code) => (
//               <MenuItem
//                 key={code}
//                 value={code}
//                 sx={{
//                   justifyContent: "center",
//                   textAlign: "center",
//                 }}
//               >
//                 {code}
//               </MenuItem>
//             ))}
//           </Select>
//         </StyledFormControl>
//         <StyledFormControl
//           size="small"
//           sx={{
//             flex: { xs: "none", sm: 1 },
//             width: { xs: "100%", sm: "auto" },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: { xs: "center", sm: "flex-start" },
//               width: "100%",
//               marginBottom: "2px",
//             }}
//           >
//             <Typography
//               variant="caption"
//               sx={{
//                 fontSize: { xs: "0.75rem", sm: "0.75rem" },
//                 fontWeight: 700,
//                 color: theme.palette.text.primary,
//                 display: "inline-block",
//                 borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
//                 backgroundColor: alpha(theme.palette.grey[100], 0.5),
//                 padding: "0 4px",
//               }}
//             >
//               Fee Range
//             </Typography>
//           </Box>
//           <Select
//             value={filters["consultation_fee"]?.split(" ")[0] || ""}
//             onChange={(e) => handleFeeRangeChange(e.target.value as string)}
//             label="Fee Range"
//             sx={{
//               "& .MuiSelect-select": {
//                 padding: "6px 12px",
//                 fontSize: { xs: "0.8rem", sm: "0.9rem" },
//                 height: "38px",
//                 display: "flex",
//                 alignItems: "center",
//                 textAlign: "left",
//               },
//               "& .MuiOutlinedInput-notchedOutline": {
//                 borderColor: alpha(theme.palette.divider, 0.3),
//               },
//               "&:hover .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#3f51b5",
//               },
//               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#3f51b5",
//               },
//               borderRadius: "8px",
//             }}
//           >
//             <MenuItem
//               value=""
//               sx={{
//                 textAlign: "left",
//               }}
//             >
//               <em>All</em>
//             </MenuItem>
//             {feeRanges.map((range) => (
//               <MenuItem
//                 key={range}
//                 value={range}
//                 sx={{
//                   textAlign: "left",
//                 }}
//               >
//                 {range}
//               </MenuItem>
//             ))}
//           </Select>
//         </StyledFormControl>
//       </Box>
//     );
//   };

//   const renderSelectFilter = (column: TableColumn<T>) => {
//     const columnId = column.id as string;
//     const options = filterOptions[columnId] || [];
//     const isLoading = filterLoading[columnId] || false;

//     // Calculate dynamic width for the options list (dropdown menu)
//     const longestOptionLength = options.length > 0 ? Math.max(...options.map(opt => opt.length)) : 0;
//     const estimatedWidth = longestOptionLength * 8; // 8px per character approximation
//     const optionsListWidth = Math.min(Math.max(estimatedWidth, 200), 450); // Clamp between 200px and 450px

//     // Custom Popper to left-align the dropdown menu
//     const CustomPopper = (props:any) => (
//       <Popper
//         {...props}
//         placement="bottom-start"
//         modifiers={[
//           {
//             name: "flip",
//             enabled: true,
//           },
//           {
//             name: "preventOverflow",
//             enabled: true,
//             options: {
//               boundariesElement: "viewport",
//             },
//           },
//         ]}
//       />
//     );

//     return (
//       <StyledFormControl
//         key={columnId}
//         size="small"
//         sx={{
//           minWidth: { xs: "100%", sm: 200 },
//           maxWidth: { xs: "100%", sm: 450 },
//         }}
//       >
//         <Autocomplete
//           options={[...options]}
//           getOptionLabel={(option) => option}
//           value={filters[columnId] || ""}
//           onChange={(event, newValue) => {
//             console.log(event, "event")
//             const selectedValue = newValue || "";
//             handleFilterChange(column.id, selectedValue);
//             setSearchValues((prev) => ({ ...prev, [columnId]: selectedValue }));
//             setFilterOptions((prev) => ({
//               ...prev,
//               [columnId]: selectedValue ? [selectedValue] : [],
//             }));
//           }}
//           onInputChange={(event, newInputValue, reason) => {
//             if (event && reason === "input") {
//               handleSearchChange(column.id, newInputValue);
//             }
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label={`${column.label}`}
//               size="small"
//               variant="outlined"
//               value={searchValues[columnId] || ""}
//               InputProps={{
//                 ...params.InputProps,
//                 endAdornment: (
//                   <>
//                     {isLoading ? (
//                       <CircularProgress color="inherit" size={20} />
//                     ) : null}
//                     {params.InputProps.endAdornment}
//                   </>
//                 ),
//               }}
//             />
//           )}
//           renderOption={(props, option) => (
//             <li
//               {...props}
//               style={{
//                 fontWeight: 400,
//                 background: "transparent",
//                 padding: "8px 12px",
//               }}
//             >
//               {option}
//             </li>
//           )}
//           disableClearable={false}
//           freeSolo={false}
//           PopperComponent={CustomPopper}
//           // PaperComponent={(props) => <CustomPaper {...props} width={optionsListWidth} />}
//           ListboxProps={{
//             style: {
//               width: optionsListWidth,
//             },
//           }}
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
//                 .filter((col) => col.filterable)
//                 .map((column) => renderSelectFilter(column))}
//               {hasDateData && renderDateFilter()}
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
//             </IconButton>
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
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           spacing={{ xs: 1, sm: 2 }}
//           sx={{ flexWrap: "wrap", alignItems: "center" }}
//         >
//           <Button
//             variant="outlined"
//             startIcon={<DownloadIcon />}
//             onClick={handleExport}
//             size="medium"
//             sx={{
//               borderColor: theme.palette.grey[400],
//               color: theme.palette.grey[700],
//               fontSize: { xs: "0.8rem", sm: "0.875rem" },
//               padding: { xs: "4px 8px", sm: "6px 16px" },
//             }}
//           >
//             Export
//           </Button>
//           {(hasFilterableColumns || hasDateData || hasFeeData) && (
//             <Button
//               variant="outlined"
//               startIcon={<FilterIcon />}
//               onClick={() => setShowFilters(!showFilters)}
//               size="medium"
//               sx={{
//                 borderColor: showFilters
//                   ? theme.palette.primary.main
//                   : theme.palette.grey[400],
//                 color: showFilters
//                   ? theme.palette.primary.main
//                   : theme.palette.grey[700],
//                 fontSize: { xs: "0.8rem", sm: "0.875rem" },
//                 padding: { xs: "4px 8px", sm: "6px 16px" },
//               }}
//             >
//               {showFilters ? "Hide Filters" : "Show Filters"}
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
//                 size="medium"
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
//                   fontSize: { xs: "0.8rem", sm: "0.875rem" },
//                   padding: { xs: "4px 8px", sm: "6px 16px" },
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
//         </Stack>
//       </TableToolbar>

//       {showFilters && (hasFilterableColumns || hasDateData || hasFeeData) && (
//         <FiltersContainer>
//           {columns
//             .filter(
//               (col) =>
//                 col.filterable &&
//                 !col.id.toString().includes("date") &&
//                 !col.id.toString().includes("start_time") &&
//                 !col.id.toString().includes("fee")
//             )
//             .map((column) => renderSelectFilter(column))}
//           {hasDateData && renderDateFilter()}
//           {hasFeeData && renderFeeFilter()}
//         </FiltersContainer>
//       )}

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

import { useState, useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import TableHeader from "./TableHeader";
import FilterSection from "./FilterSection";
import TableContent from "./TableContent";
import PaginationSection from "./PaginationSection";
import MobileRowDetailDialog from "./MobileRowDetailDialog";
import MobileFiltersDialog from "./MobileFiltersDialog";
import { TableProps } from "./types";

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

  // State for filters, sorting, and mobile dialogs
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>(
    {}
  );
  const [filterLoading, setFilterLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [tempDateRange, setTempDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Memoized calculations
  const hasFilterableColumns = useMemo(
    () => columns.some((col) => col.filterable),
    [columns]
  );

  // const hasFeeData = useMemo(() => {
  //   const feeValues = data
  //     .map(
  //       (item: any) =>
  //         item["consultation_fee"] || item["fee"] || item["local_consulting_fee"]
  //     )
  //     .filter((value) => value !== null && value !== 0 && !isNaN(value));
  //   return feeValues.length > 0;
  // }, [data]);

  // Handlers for filter, sort, and pagination
  const handleSort = (columnId: keyof T) => {
    const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortConfig({ key: columnId, direction: newDirection });
    onSortChange?.(columnId, newDirection);
  };

  const clearAllFilters = () => {
    setFilters({});
    setTempDateRange({ start: null, end: null });
    setSelectedPreset("");
    setFilterOptions({});
    setSearchValues({});
    onFilterChange?.({});
  };

  const handleExport = () => {
    const csv = [
      columns.map((col: any) => col.label).join(","),
      ...data.map((row: any) =>
        columns
          .map((col: any) => {
            const value = col.render
              ? col.render(row[col.id], row)
              : row[col.id]?.toString() || "";
            return `"${value.toString().replace(/"/g, '""') || ""}"`;
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

  return (
    <>
      <TableHeader
        title={title}
        onAdd={onAdd}
        onExport={handleExport}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setMobileFiltersOpen={setMobileFiltersOpen} // Pass setMobileFiltersOpen
        filters={filters}
        clearAllFilters={clearAllFilters}
        hasFilterableColumns={hasFilterableColumns}
        // hasFeeData={hasFeeData}
        mobileFiltersOpen={mobileFiltersOpen}
      />
      {showFilters && (hasFilterableColumns) && (
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
      )}
      <TableContent
        data={data}
        columns={columns}
        showActions={showActions}
        getRowId={getRowId}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        tableHeight={tableHeight}
        page={page}
        rowsPerPage={rowsPerPage}
        sortConfig={sortConfig}
        handleSort={handleSort}
        setMobileRowDetail={setMobileRowDetail}
        loading={loading}
      />
      <PaginationSection
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
      {isMobile && (
        <>
          <MobileRowDetailDialog
            mobileRowDetail={mobileRowDetail}
            setMobileRowDetail={setMobileRowDetail}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <MobileFiltersDialog
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
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
            // hasFeeData={hasFeeData}
            clearAllFilters={clearAllFilters}
          />
        </>
      )}
    </>
  );
}

export default GenericTable;
