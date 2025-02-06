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
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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

const StyledPaper = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
});

const FiltersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: "100%",
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",
  "& .MuiSelect-select": {
    width: "100%",
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
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  "& .MuiTableRow-root:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "& .MuiTableCell-root": {
    padding: theme.spacing(1.5),
  },
}));

const TableToolbar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Handlers
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

  return (
    <StyledPaper elevation={3}>
      <TableToolbar>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {onStatus && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<UpdateIcon />}
              onClick={onStatus}
              disabled={!selected.length}
              style={{
                opacity: !selected.length ? 0.8 : 1,
                minWidth: "120px",
              }}
            >
              Change Status
            </Button>
          )}

          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              style={{
                minWidth: "120px",
              }}
            >
              Add New
            </Button>
          )}
        </div>
      </TableToolbar>

      <FiltersContainer>
        {columns
          .filter((col) => col.filterable)
          .map((column) => (
            <StyledFormControl key={column.id as string} size="small">
              <InputLabel>{`Filter ${column.label}`}</InputLabel>
              <Select
                value={filters[column.id as string] || ""}
                label={`Filter ${column.label}`}
                onChange={(e) => handleFilterChange(column.id, e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
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
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  style={{ width: column.width }}
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
                        {onView && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onView(row)}
                          >
                            <ViewIcon />
                          </IconButton>
                        )}
                        {onEdit && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(row)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
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
