import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  Skeleton,
  Tooltip,
  Typography,
  TableHead,
  TableSortLabel,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { TableColumn } from "./types";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledPaper = styled(Box)(({ theme }) => ({
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
  "& .MuiTable-root": { minWidth: "800px" },
  "& .MuiTableCell-head": {
    background: `linear-gradient(180deg, ${alpha("#2e7d32", 0.9)} 0%, ${alpha("#1b4d3e", 0.9)} 100%)`,
    color: theme.palette.common.white + " !important",
    fontWeight: 700,
    fontSize: "1rem",
    fontFamily: "Poppins, sans-serif",
    whiteSpace: "nowrap",
    borderBottom: "none",
    padding: theme.spacing(2, 3),
    textAlign: "center",
    "&:first-of-type": { borderTopLeftRadius: "8px" },
    "&:last-of-type": { borderTopRightRadius: "8px" },
    "& .MuiTableSortLabel-root": {
      color: theme.palette.common.white + " !important",
      "&.Mui-active": {
        color: theme.palette.common.white + " !important",
      },
      "&:hover": {
        color: theme.palette.common.white + " !important",
      },
      "& .MuiTableSortLabel-icon": {
        color: theme.palette.common.white + " !important",
      },
    },
  },
  "& .MuiTableRow-root": {
    transition: "all 0.3s ease",
    "&:hover": {
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
      background: alpha(theme.palette.primary.light, 0.05),
    },
    animation: `${fadeIn} 0.5s ease-in-out`,
  },
  "& .MuiTableRow-root:nth-of-type(even)": {
    background: alpha(theme.palette.action.hover, 0.05),
  },
  "& .MuiTableCell-root": {
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    fontFamily: "Roboto, sans-serif",
    fontSize: "0.95rem",
    color: theme.palette.text.primary,
    textAlign: "left", // Default alignment for cells
    "&:first-of-type": { textAlign: "center" }, // Center-align S.No. column
    "&:last-of-type": { textAlign: "right" }, // Right-align Actions column
  },
}));

const SerialNumberCell = styled(TableCell)(({ theme }) => ({
  width: "60px",
  textAlign: "center",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontFamily: "Roboto, sans-serif",
  fontSize: "0.95rem",
}));

interface TableContentProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  showActions: boolean;
  getRowId: (row: T) => string | number;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  tableHeight: string;
  page: number;
  rowsPerPage: number;
  sortConfig: { key: keyof T | null; direction: "asc" | "desc" };
  handleSort: (columnId: keyof T) => void;
  setMobileRowDetail: React.Dispatch<React.SetStateAction<T | null>>;
  loading: boolean;
}

const TableContent = <T,>({
  data,
  columns,
  showActions,
  getRowId,
  onView,
  onEdit,
  onDelete,
  tableHeight,
  page,
  rowsPerPage,
  sortConfig,
  handleSort,
  setMobileRowDetail,
  loading,
}: TableContentProps<T>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const safeRenderValue = (value: any, row: T, render?: (value: any, row: T) => React.ReactNode) => {
    if (render) {
      return render(value, row) || "N/A";
    }
    if (value && typeof value === "object" && "first_name" in value) {
      return `${value.first_name || ""} ${value.last_name || ""}`.trim() || "N/A";
    }
    return value?.toString() || "N/A";
  };

  if (isMobile) {
    return (
      <StyledPaper sx={{ paddingTop: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        {loading ? (
          <Box sx={{ flex: 1, overflow: "auto", paddingBottom: 7 }}>
            {[...Array(rowsPerPage)].map((_, index) => (
              <Box key={index} sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            ))}
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: "auto", paddingBottom: 7 }}>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const id = getRowId(row);
              const serialNumber = page * rowsPerPage + index + 1;
              return (
                <React.Fragment key={id}>
                  <ListItem
                    component="button"
                    onClick={() => setMobileRowDetail(row)}
                    sx={{
                      pl: 2,
                      py: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        border: `2px solid ${theme.palette.primary.main}`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                        background: alpha(theme.palette.primary.light, 0.05),
                      },
                      animation: `${fadeIn} 0.5s ease-in-out`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: theme.palette.text.secondary, minWidth: "24px", mr: 1, textAlign: "center" }}
                    >
                      {serialNumber}.
                    </Typography>
                    <ListItemText
                      primary={safeRenderValue(row[columns[0].id], row, columns[0].render)}
                      secondary={
                        columns[1] ? safeRenderValue(row[columns[1].id], row, columns[1].render) : undefined
                      }
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "1rem",
                        textAlign: columns[0].align ?? "left", // Use column alignment or default to "left"
                      }}
                      secondaryTypographyProps={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "0.85rem",
                        textAlign: columns[1]?.align ?? "left", // Use column alignment or default to "left"
                      }}
                    />
                    {showActions && onView && (
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          sx={{ color: "#1976d2", "&:active": { transform: "scale(0.95)" } }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <StyledTableContainer sx={{ height: tableHeight }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            {[...Array(rowsPerPage)].map((_, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, py: 1 }}>
                <Skeleton variant="text" width="40px" height={30} />
                {columns.map((_, colIndex) => (
                  <Skeleton key={colIndex} variant="text" width="100px" height={30} />
                ))}
              </Box>
            ))}
          </Box>
        ) : (
          <Table stickyHeader aria-label="data table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "60px", textAlign: "center" }}>S.No</TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id as string}
                    sortDirection={sortConfig.key === column.id ? sortConfig.direction : false}
                    sx={{ width: column.width, textAlign: column.align }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortConfig.key === column.id}
                        direction={sortConfig.key === column.id ? sortConfig.direction : "asc"}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {showActions && <TableCell sx={{ width: "150px", textAlign: "center" }}>Actions</TableCell>}
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
                      <TableCell
                        key={column.id as string}
                        sx={{ textAlign: column.align ?? "left" }} // Use column alignment or default to "left"
                      >
                        {safeRenderValue(row[column.id], row, column.render)}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          {onView && (
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => onView(row)}
                                sx={{
                                  background: alpha("#1976d2", 0.1),
                                  "&:hover": { background: alpha("#1976d2", 0.2) },
                                  "&:active": { transform: "scale(0.95)" },
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onEdit && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => onEdit(row)}
                                sx={{
                                  background: alpha("#ff9800", 0.1),
                                  "&:hover": { background: alpha("#ff9800", 0.2) },
                                  "&:active": { transform: "scale(0.95)" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => onDelete(row)}
                                sx={{
                                  background: alpha("#f44336", 0.1),
                                  "&:hover": { background: alpha("#f44336", 0.2) },
                                  "&:active": { transform: "scale(0.95)" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
    </StyledPaper>
  );
};

export default TableContent;