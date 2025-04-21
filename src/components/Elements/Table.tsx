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
//   Checkbox,
//   IconButton,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Box,
//   Typography,
// } from "@mui/material";
// import {
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
//   Update as UpdateIcon,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";

// export interface TableColumn<T> {
//   id: keyof T;
//   label: string;
//   filterable?: boolean;
//   filterOptions?: string[];
//   width?: string;
//   render?: (value: any, row: T) => React.ReactNode;
// }

// export interface TableProps<T> {
//   data: T[];
//   columns: TableColumn<T>[];
//   title?: string;
//   onAdd?: () => void;
//   onStatus?: () => void;
//   onView?: (row: T) => void;
//   onEdit?: (row: T) => void;
//   showCheckbox?: boolean;
//   showActions?: boolean;
//   onSelectionChange?: (selectedIds: any[]) => void;
//   getRowId: (row: T) => string | number;
//   initialRowsPerPage?: number;
//   tableHeight?: string;
// }

// const StyledPaper = styled(Paper)({
//   display: "flex",
//   flexDirection: "column",
//   height: "100%",
//   width: "100%",
//   maxWidth: "1400px",
//   margin: "0 auto",
// });

// const FiltersContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//   gap: theme.spacing(2),
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   width: "100%",
// }));

// const StyledFormControl = styled(FormControl)(({ theme }) => ({
//   width: "100%",
//   "& .MuiSelect-select": {
//     width: "100%",
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
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     fontWeight: "bold",
//     whiteSpace: "nowrap",
//   },
//   "& .MuiTableRow-root:nth-of-type(even)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   "& .MuiTableCell-root": {
//     padding: theme.spacing(1.5),
//   },
// }));

// const TableToolbar = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   backgroundColor: theme.palette.background.paper,
//   borderBottom: `1px solid ${theme.palette.divider}`,
// }));

// function GenericTable<T>({
//   data,
//   columns,
//   title = "Data Table",
//   onAdd,
//   onStatus,
//   onView,
//   onEdit,
//   showCheckbox = true,
//   showActions = true,
//   onSelectionChange,
//   getRowId,
//   initialRowsPerPage = 10,
//   tableHeight = "calc(100vh - 250px)",
// }: TableProps<T>) {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
//   const [selected, setSelected] = useState<(string | number)[]>([]);
//   const [filters, setFilters] = useState<Record<string, string>>({});

//   // Handlers
//   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const newSelected = data.map((item) => getRowId(item));
//       setSelected(newSelected);
//       onSelectionChange?.(newSelected);
//     } else {
//       setSelected([]);
//       onSelectionChange?.([]);
//     }
//   };

//   const handleRowSelect = (id: string | number) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected: (string | number)[] = [];

//     if (selectedIndex === -1) {
//       newSelected = [...selected, id];
//     } else {
//       newSelected = selected.filter((itemId) => itemId !== id);
//     }

//     setSelected(newSelected);
//     onSelectionChange?.(newSelected);
//   };

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleFilterChange = (columnId: keyof T, value: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       [columnId as string]: value,
//     }));
//     setPage(0);
//   };

//   // Filter data
//   const filteredData = data.filter((item) => {
//     return Object.entries(filters).every(([key, value]) => {
//       if (!value) return true;
//       const itemValue = item[key as keyof T];
//       return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
//     });
//   });

//   const filterOptions = useMemo(() => {
//     const options: Record<string, Set<string>> = {};

//     columns.forEach((column) => {
//       if (column.filterable) {
//         options[column.id as string] = new Set(
//           data
//             .map((item) => {
//               const value = item[column.id];
//               return value?.toString() || "";
//             })
//             .filter(Boolean)
//         );
//       }
//     });

//     return options;
//   }, [data, columns]);

//   return (
//     <StyledPaper elevation={3}>
//       <TableToolbar>
//         <Typography variant="h6" component="div">
//           {title}
//         </Typography>
//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             flexWrap: "wrap",
//             justifyContent: "flex-end",
//           }}
//         >
//           {onStatus && (
//             <Button
//               variant="outlined"
//               color="secondary"
//               startIcon={<UpdateIcon />}
//               onClick={onStatus}
//               disabled={!selected.length}
//               style={{
//                 opacity: !selected.length ? 0.8 : 1,
//                 minWidth: "120px",
//               }}
//             >
//               Change Status
//             </Button>
//           )}

//           {onAdd && (
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={onAdd}
//               style={{
//                 minWidth: "120px",
//               }}
//             >
//               Add New
//             </Button>
//           )}
//         </div>
//       </TableToolbar>

//       <FiltersContainer>
//         {columns
//           .filter((col) => col.filterable)
//           .map((column) => (
//             <StyledFormControl key={column.id as string} size="small">
//               <InputLabel>{`Filter ${column.label}`}</InputLabel>
//               <Select
//                 value={filters[column.id as string] || ""}
//                 label={`Filter ${column.label}`}
//                 onChange={(e) => handleFilterChange(column.id, e.target.value)}
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       maxHeight: 300,
//                     },
//                   },
//                 }}
//               >
//                 <MenuItem value="">All</MenuItem>
//                 {Array.from(filterOptions[column.id as string] || [])
//                   .sort()
//                   .map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//               </Select>
//             </StyledFormControl>
//           ))}
//       </FiltersContainer>

//       <StyledTableContainer sx={{ height: tableHeight }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               {showCheckbox && (
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     indeterminate={
//                       selected.length > 0 && selected.length < data.length
//                     }
//                     checked={selected.length === data.length}
//                     onChange={handleSelectAllClick}
//                   />
//                 </TableCell>
//               )}
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id as string}
//                   style={{ width: column.width }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//               {showActions && <TableCell>Actions</TableCell>}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredData
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row) => {
//                 const id = getRowId(row);
//                 const isSelected = selected.indexOf(id) !== -1;
//                 return (
//                   <TableRow hover key={id} selected={isSelected}>
//                     {showCheckbox && (
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => handleRowSelect(id)}
//                         />
//                       </TableCell>
//                     )}
//                     {columns.map((column) => (
//                       <TableCell key={column.id as string}>
//                         {column.render
//                           ? column.render(row[column.id], row)
//                           : row[column.id]?.toString()}
//                       </TableCell>
//                     ))}
//                     {showActions && (
//                       <TableCell>
//                         {onView && (
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => onView(row)}
//                           >
//                             <ViewIcon />
//                           </IconButton>
//                         )}
//                         {onEdit && (
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => onEdit(row)}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         )}
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       </StyledTableContainer>

//       <TablePagination
//         component="div"
//         count={filteredData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         rowsPerPageOptions={[5, 10, 25, 50]}
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
  Checkbox,
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
  Chip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
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
  background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 100%)",
  backdropFilter: "blur(8px)",
  [theme.breakpoints.down('sm')]: {
    borderRadius: "0",
    boxShadow: "none",
    background: theme.palette.background.paper,
  },
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  background: alpha(theme.palette.background.paper, 0.8),
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
    "&:first-of-type": {
      borderTopLeftRadius: "8px",
    },
    "&:last-of-type": {
      borderTopRightRadius: "8px",
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
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  padding: theme.spacing(1, 2),
  transition: "all 0.2s ease",
  boxShadow: "none",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
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
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(16, 177, 0, 1) 0%, rgba(27, 77, 62, 1) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 6px rgba(27, 77, 62, 0.3)",
  },
  "& .MuiButton-startIcon": {
    position: "relative",
    zIndex: 1,
  },
  "& .MuiButton-label": {
    position: "relative",
    zIndex: 1,
  },
}));

const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.1),
  },
}));

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  filterable?: boolean;
  filterOptions?: string[];
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  onAdd?: () => void;
  onStatus?: () => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  showCheckbox?: boolean;
  showActions?: boolean;
  onSelectionChange?: (selectedIds: any[]) => void;
  getRowId: (row: T) => string | number;
  initialRowsPerPage?: number;
  tableHeight?: string;
}

function GenericTable<T>({
  data,
  columns,
  title = "Data Table",
  onAdd,
  onStatus,
  onView,
  onEdit,
  showCheckbox = true,
  showActions = true,
  onSelectionChange,
  getRowId,
  initialRowsPerPage = 10,
  tableHeight = "calc(100vh - 250px)",
}: TableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((item) => getRowId(item));
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleRowSelect = (id: string | number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((itemId) => itemId !== id);
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
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

  const handleFilterChange = (columnId: keyof T, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId as string]: value,
    }));
    setPage(0);
  };

  // Filter data
  const filteredData = data.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const itemValue = item[key as keyof T];
      return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
    });
  });

  const filterOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    columns.forEach((column) => {
      if (column.filterable) {
        options[column.id as string] = new Set(
          data
            .map((item) => {
              const value = item[column.id];
              return value?.toString() || "";
            })
            .filter(Boolean)
        );
      }
    });

    return options;
  }, [data, columns]);

  // Mobile row click handler
  const handleMobileRowClick = (row: T) => {
    setMobileRowDetail(row);
  };

  // Mobile view
  if (isMobile) {
    return (
      <StyledPaper elevation={0}>
        {/* Mobile Toolbar */}
        <TableToolbar sx={{ flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              background: "linear-gradient(45deg, #1b4d3e, #4caf50)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}>
              {title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={() => setMobileFiltersOpen(true)}>
                <FilterIcon />
              </IconButton>
              {onAdd && (
                <IconButton 
                  color="primary" 
                  onClick={onAdd}
                  sx={{ 
                    background: "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
                    color: "#fff"
                  }}
                >
                  <AddIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          
          {selected.length > 0 && onStatus && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UpdateIcon />}
              onClick={onStatus}
              sx={{
                borderColor: "#2e7d32",
                color: "#1b4d3e",
                "&:hover": {
                  borderColor: "#1b4d3e",
                },
              }}
            >
              Update {selected.length} selected
            </Button>
          )}
        </TableToolbar>

        {/* Mobile Data List */}
        <List sx={{ flex: 1, overflow: "auto" }}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              const id = getRowId(row);
              const isSelected = selected.indexOf(id) !== -1;
              
              return (
                <React.Fragment key={id}>
                  <ListItem 
                    button 
                    onClick={() => handleMobileRowClick(row)}
                    sx={{
                      backgroundColor: isSelected ? alpha("#1b4d3e", 0.1) : "inherit",
                      borderLeft: isSelected ? `4px solid #1b4d3e` : "none",
                    }}
                  >
                    {showCheckbox && (
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(id);
                        }}
                        color="primary"
                        sx={{ mr: 2 }}
                      />
                    )}
                    <ListItemText
                      primary={columns[0].render ? columns[0].render(row[columns[0].id], row) : row[columns[0].id]?.toString()}
                      secondary={columns[1].render ? columns[1].render(row[columns[1].id], row) : row[columns[1].id]?.toString()}
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
                            <ViewIcon />
                          </IconButton>
                        )}
                        {onEdit && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            sx={{ color: "#ff9800" }}
                          >
                            <EditIcon />
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
            background: alpha("#f9f9f9", 0.8),
          }}
        />

        {/* Mobile Filters Dialog */}
        <Dialog
          fullScreen
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              {columns
                .filter((col) => col.filterable)
                .map((column) => (
                  <FormControl key={column.id as string} size="small" fullWidth>
                    <InputLabel>{`Filter ${column.label}`}</InputLabel>
                    <Select
                      value={filters[column.id as string] || ""}
                      label={`Filter ${column.label}`}
                      onChange={(e) => handleFilterChange(column.id, e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {Array.from(filterOptions[column.id as string] || [])
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
            <Button 
              onClick={() => {
                setFilters({});
                setMobileFiltersOpen(false);
              }}
              color="error"
            >
              Clear All
            </Button>
            <Button 
              onClick={() => setMobileFiltersOpen(false)}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, rgba(16, 177, 0, 0.8) 0%, rgba(27, 77, 62, 0.9) 100%)",
                color: "#fff"
              }}
            >
              Apply Filters
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
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
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
                        secondary={column.render 
                          ? column.render(mobileRowDetail[column.id], mobileRowDetail) 
                          : mobileRowDetail[column.id]?.toString()}
                        primaryTypographyProps={{ fontWeight: 600, color: "#1b4d3e" }}
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

  // Desktop view (keep your existing desktop implementation)
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
          {onStatus && (
            <Button
              variant="outlined"
              startIcon={<UpdateIcon />}
              onClick={onStatus}
              disabled={!selected.length}
              sx={{
                minWidth: "140px",
                borderColor: "#2e7d32",
                color: "#1b4d3e",
                "&:hover": {
                  borderColor: "#1b4d3e",
                  backgroundColor: alpha("#2e7d32", 0.08),
                },
                "&.Mui-disabled": {
                  borderColor: alpha("#2e7d32", 0.3),
                  color: alpha("#1b4d3e", 0.3),
                },
                opacity: !selected.length ? 0.7 : 1,
              }}
            >
              Change Status
            </Button>
          )}

          {onAdd && (
            <PrimaryButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{ minWidth: "140px" }}
            >
              Add New
            </PrimaryButton>
          )}
        </Box>
      </TableToolbar>

      <FiltersContainer>
        {columns
          .filter((col) => col.filterable)
          .map((column) => (
            <StyledFormControl key={column.id as string} size="small">
              <InputLabel
                sx={{ fontSize: "0.875rem" }}
              >{`Filter ${column.label}`}</InputLabel>
              <Select
                value={filters[column.id as string] || ""}
                label={`Filter ${column.label}`}
                onChange={(e) => handleFilterChange(column.id, e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      borderRadius: "8px",
                      marginTop: 1,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                {Array.from(filterOptions[column.id as string] || [])
                  .sort()
                  .map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {option}
                    </MenuItem>
                  ))}
              </Select>
            </StyledFormControl>
          ))}
      </FiltersContainer>

      <StyledTableContainer sx={{ height: tableHeight }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {showCheckbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={selected.length === data.length}
                    onChange={handleSelectAllClick}
                    sx={{
                      color: alpha("#fff", 0.8),
                      "&.Mui-checked": {
                        color: "#fff",
                      },
                    }}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  sx={{ width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
              {showActions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const id = getRowId(row);
                const isSelected = selected.indexOf(id) !== -1;
                return (
                  <TableRow hover key={id} selected={isSelected}>
                    {showCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleRowSelect(id)}
                          color="primary"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id as string}>
                        {column.render
                          ? column.render(row[column.id], row)
                          : row[column.id]?.toString()}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {onView && (
                            <IconButton
                              size="small"
                              sx={{
                                background: alpha("#1976d2", 0.1), // Soft blue background
                                "&:hover": {
                                  background: alpha("#1976d2", 0.2),
                                  transform: "scale(1.1)",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "#1565c0", // Deeper blue icon
                                },
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => onView(row)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          )}
                          {onEdit && (
                            <IconButton
                              size="small"
                              sx={{
                                background: alpha("#ff9800", 0.1), // Soft orange background
                                "&:hover": {
                                  background: alpha("#ff9800", 0.2),
                                  transform: "scale(1.1)",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "#fb8c00", // Deeper orange icon
                                },
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => onEdit(row)}
                            >
                              <EditIcon fontSize="small" />
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
        sx={{
          borderTop: `1px solid ${alpha("#ddd", 0.2)}`,
          background: alpha("#f9f9f9", 0.8),
        }}
      />
    </StyledPaper>
  );
}

export default GenericTable;