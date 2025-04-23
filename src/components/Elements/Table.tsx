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
  Select,
  MenuItem,
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
  Slider,
  TextField,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  DateRange as DateRangeIcon,
  AttachMoney as FeeIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { styled } from "@mui/material/styles";

// Enhanced responsive styled components
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

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  filterable?: boolean;
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
}: TableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [feeRange, setFeeRange] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

  const hasFilterableColumns = useMemo(
    () => columns.some((col) => col.filterable),
    [columns]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        const itemValue = item[key as keyof T];
        if (itemValue === undefined || itemValue === null) return false;

        // Handle fee range filter
        if (key === "consultation_fee" || key === "fee") {
          const [minStr, maxStr] = value.split("-");
          const feeValue =
            typeof itemValue === "string"
              ? parseInt(itemValue.replace(/[^0-9]/g, "")) || 0
              : Number(itemValue);
          const min = minStr ? Number(minStr) : null;
          const max = maxStr ? Number(maxStr) : null;

          if (min !== null && feeValue < min) return false;
          if (max !== null && feeValue > max) return false;
          return true;
        }

        // Handle date range filter
        if (key === "booking_date" || key.includes("date")) {
          const [startStr, endStr] = value.split("-");
          const dateValue = new Date(itemValue as any);
          const startDate = startStr ? new Date(startStr) : null;
          const endDate = endStr ? new Date(endStr) : null;

          if (startDate && dateValue < startDate) return false;
          if (endDate && dateValue > endDate) return false;
          return true;
        }

        // Default string filter
        return itemValue
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
  }, [data, filters]);

  const handleFilterChange = (columnId: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [columnId as string]: value }));
    setPage(0);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    setFilters((prev) => ({
      ...prev,
      booking_date:
        start || end
          ? `${start?.toISOString() || ""}-${end?.toISOString() || ""}`
          : "",
    }));
    setPage(0);
  };

  const handleFeeRangeChange = (min: number | null, max: number | null) => {
    setFeeRange({ min, max });
    setFilters((prev) => ({
      ...prev,
      consultation_fee:
        min !== null || max !== null ? `${min || ""}-${max || ""}` : "",
    }));
    setPage(0);
  };

  const clearAllFilters = () => {
    setFilters({});
    setDateRange({ start: null, end: null });
    setFeeRange({ min: null, max: null });
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderDateFilter = () => (
    <Box
      sx={{
        p: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <DateRangeIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1">Date Range</Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="From Date"
          value={dateRange.start}
          onChange={(newValue) =>
            handleDateRangeChange(newValue, dateRange.end)
          }
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth sx={{ mb: 2 }} />
          )}
        />
        <DatePicker
          label="To Date"
          value={dateRange.end}
          onChange={(newValue) =>
            handleDateRangeChange(dateRange.start, newValue)
          }
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth />
          )}
        />
      </LocalizationProvider>
    </Box>
  );

  const renderFeeFilter = () => {
    const feeValues = data
      .map((item) => {
        const value =
          (item as any)["consultation_fee"] || (item as any)["fee"] || 0;
        return typeof value === "string"
          ? parseInt(value.replace(/[^0-9]/g, "")) || 0
          : value;
      })
      .filter((value) => !isNaN(value));

    if (feeValues.length === 0) return null;

    const minFee = Math.min(...feeValues);
    const maxFee = Math.max(...feeValues);

    return (
      <Box
        sx={{
          p: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <FeeIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Fee Range</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Min"
            type="number"
            size="small"
            value={feeRange.min ?? ""}
            onChange={(e) =>
              handleFeeRangeChange(
                e.target.value ? Number(e.target.value) : null,
                feeRange.max
              )
            }
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
            }}
          />
          <TextField
            label="Max"
            type="number"
            size="small"
            value={feeRange.max ?? ""}
            onChange={(e) =>
              handleFeeRangeChange(
                feeRange.min,
                e.target.value ? Number(e.target.value) : null
              )
            }
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
            }}
          />
        </Box>
        <Slider
          value={[feeRange.min ?? minFee, feeRange.max ?? maxFee]}
          min={minFee}
          max={maxFee}
          onChange={(_, newValue) => {
            const [min, max] = newValue as number[];
            handleFeeRangeChange(min, max);
          }}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `₹${value}`}
        />
      </Box>
    );
  };

  const renderSelectFilter = (column: TableColumn<T>) => {
    const uniqueValues = Array.from(
      new Set(
        data
          .map((item) => {
            const value = item[column.id];
            return value?.toString() || "";
          })
          .filter(Boolean)
      )
    ).sort();

    return (
      <StyledFormControl key={column.id as string} size="small" fullWidth>
        <InputLabel>Filter {column.label}</InputLabel>
        <Select
          value={filters[column.id as string] || ""}
          label={`Filter ${column.label}`}
          onChange={(e) => handleFilterChange(column.id, e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {uniqueValues.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
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
        {/* Mobile Header */}
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

        {/* Mobile Filters Button */}
        {hasFilterableColumns && (
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
            <Button
              startIcon={<FilterIcon />}
              onClick={() => setMobileFiltersOpen(true)}
              size="small"
            >
              Filters
            </Button>
          </Box>
        )}

        {/* Mobile Data List */}
        <List sx={{ flex: 1, overflow: "auto", paddingBottom: 7 }}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              const id = getRowId(row);
              const serialNumber = page * rowsPerPage + index + 1;

              return (
                <React.Fragment key={id}>
                  <ListItem
                    button
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
                        columns[1].render
                          ? columns[1].render(row[columns[1].id], row)
                          : row[columns[1].id]?.toString()
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

        {/* Mobile Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
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
        />

        {/* Mobile Filters Dialog */}
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
                .map((column) => (
                  <FormControl key={column.id as string} size="small" fullWidth>
                    <InputLabel>{`Filter ${column.label}`}</InputLabel>
                    <Select
                      value={filters[column.id as string] || ""}
                      label={`Filter ${column.label}`}
                      onChange={(e) =>
                        handleFilterChange(column.id, e.target.value)
                      }
                    >
                      <MenuItem value="">All</MenuItem>
                      {Array.from(
                        new Set(
                          data
                            .map((item) => item[column.id]?.toString())
                            .filter(Boolean)
                        )
                      )
                        .sort()
                        .map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={clearAllFilters} color="error">
              Clear All
            </Button>
            <Button
              onClick={() => setMobileFiltersOpen(false)}
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

        {/* Mobile Row Detail Dialog */}
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
          {hasFilterableColumns && (
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

      {/* Filters Section */}
      {hasFilterableColumns && (
        <FiltersContainer>
          {columns.some((c) => c.id.toString().includes("date")) &&
            renderDateFilter()}
          {columns.some((c) => c.id.toString().includes("fee")) &&
            renderFeeFilter()}
          {columns
            .filter(
              (col) =>
                col.filterable &&
                !col.id.toString().includes("date") &&
                !col.id.toString().includes("fee")
            )
            .map((column) => renderSelectFilter(column))}
        </FiltersContainer>
      )}

      {/* Table Container */}
      <StyledTableContainer sx={{ height: tableHeight }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "60px", textAlign: "center" }}>
                S.No.
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id as string}>{column.label}</TableCell>
              ))}
              {showActions && (
                <TableCell sx={{ width: "150px" }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
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
      </StyledTableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </StyledPaper>
  );
}

export default GenericTable;
