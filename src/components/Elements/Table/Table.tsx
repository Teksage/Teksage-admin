// import { useState, useMemo } from "react";
// import { useMediaQuery, useTheme } from "@mui/material";
// import TableHeader from "./TableHeader";
// import FilterSection from "./FilterSection";
// import TableContent from "./TableContent";
// import PaginationSection from "./PaginationSection";
// import MobileRowDetailDialog from "./MobileRowDetailDialog";
// import MobileFiltersDialog from "./MobileFiltersDialog";
// import { TableProps } from "./types";

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

//   // State for filters, sorting, and mobile dialogs
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [showFilters, setShowFilters] = useState(true);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof T | null;
//     direction: "asc" | "desc";
//   }>({ key: null, direction: "asc" });
//   const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>(
//     {}
//   );
//   const [filterLoading, setFilterLoading] = useState<Record<string, boolean>>(
//     {}
//   );
//   const [searchValues, setSearchValues] = useState<Record<string, string>>({});
//   const [tempDateRange, setTempDateRange] = useState<{
//     start: Date | null;
//     end: Date | null;
//   }>({ start: null, end: null });
//   const [selectedPreset, setSelectedPreset] = useState<string>("");

//   // Memoized calculations
//   const hasFilterableColumns = useMemo(
//     () => columns.some((col) => col.filterable),
//     [columns]
//   );

//   // const hasFeeData = useMemo(() => {
//   //   const feeValues = data
//   //     .map(
//   //       (item: any) =>
//   //         item["consultation_fee"] || item["fee"] || item["local_consulting_fee"]
//   //     )
//   //     .filter((value) => value !== null && value !== 0 && !isNaN(value));
//   //   return feeValues.length > 0;
//   // }, [data]);

//   // Handlers for filter, sort, and pagination
//   const handleSort = (columnId: keyof T) => {
//     const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
//     const newDirection = isAsc ? "desc" : "asc";
//     setSortConfig({ key: columnId, direction: newDirection });
//     onSortChange?.(columnId, newDirection);
//   };

//   const clearAllFilters = () => {
//     setFilters({});
//     setTempDateRange({ start: null, end: null });
//     setSelectedPreset("");
//     setFilterOptions({});
//     setSearchValues({});
//     onFilterChange?.({});
//   };

//   const handleExport = () => {
//     const csv = [
//       columns.map((col: any) => col.label).join(","),
//       ...data.map((row: any) =>
//         columns
//           .map((col: any) => {
//             const value = col.render
//               ? col.render(row[col.id], row)
//               : row[col.id]?.toString() || "";
//             return `"${value.toString().replace(/"/g, '""') || ""}"`;
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

//   return (
//     <>
//       <TableHeader
//         title={title}
//         onAdd={onAdd}
//         onExport={handleExport}
//         showFilters={showFilters}
//         setShowFilters={setShowFilters}
//         setMobileFiltersOpen={setMobileFiltersOpen} // Pass setMobileFiltersOpen
//         filters={filters}
//         clearAllFilters={clearAllFilters}
//         hasFilterableColumns={hasFilterableColumns}
//         // hasFeeData={hasFeeData}
//         mobileFiltersOpen={mobileFiltersOpen}
//       />
//       {showFilters && (hasFilterableColumns) && (
//         <FilterSection
//           title={title}
//           columns={columns}
//           filters={filters}
//           setFilters={setFilters}
//           filterOptions={filterOptions}
//           setFilterOptions={setFilterOptions}
//           filterLoading={filterLoading}
//           setFilterLoading={setFilterLoading}
//           searchValues={searchValues}
//           setSearchValues={setSearchValues}
//           tempDateRange={tempDateRange}
//           setTempDateRange={setTempDateRange}
//           selectedPreset={selectedPreset}
//           setSelectedPreset={setSelectedPreset}
//           onFilterChange={onFilterChange}
//           onFetchFilterOptions={onFetchFilterOptions}
//         />
//       )}
//       <TableContent
//         data={data}
//         columns={columns}
//         showActions={showActions}
//         getRowId={getRowId}
//         onView={onView}
//         onEdit={onEdit}
//         onDelete={onDelete}
//         tableHeight={tableHeight}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         sortConfig={sortConfig}
//         handleSort={handleSort}
//         setMobileRowDetail={setMobileRowDetail}
//         loading={loading}
//       />
//       <PaginationSection
//         totalCount={totalCount}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         onPageChange={onPageChange}
//         onRowsPerPageChange={onRowsPerPageChange}
//       />
//       {isMobile && (
//         <>
//           <MobileRowDetailDialog
//             mobileRowDetail={mobileRowDetail}
//             setMobileRowDetail={setMobileRowDetail}
//             columns={columns}
//             onEdit={onEdit}
//             onDelete={onDelete}
//           />
//           <MobileFiltersDialog
//             mobileFiltersOpen={mobileFiltersOpen}
//             setMobileFiltersOpen={setMobileFiltersOpen}
//             columns={columns}
//             filters={filters}
//             setFilters={setFilters}
//             filterOptions={filterOptions}
//             setFilterOptions={setFilterOptions}
//             filterLoading={filterLoading}
//             setFilterLoading={setFilterLoading}
//             searchValues={searchValues}
//             setSearchValues={setSearchValues}
//             tempDateRange={tempDateRange}
//             setTempDateRange={setTempDateRange}
//             selectedPreset={selectedPreset}
//             setSelectedPreset={setSelectedPreset}
//             onFilterChange={onFilterChange}
//             onFetchFilterOptions={onFetchFilterOptions}
//             // hasFeeData={hasFeeData}
//             clearAllFilters={clearAllFilters}
//           />
//         </>
//       )}
//     </>
//   );
// }

// export default GenericTable;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableContent from "./TableContent";
import FilterSection from "./FilterSection";
import PaginationSection from "./PaginationSection";
import { Add as AddIcon } from "@mui/icons-material";
import { TableColumn, TableProps } from "./types";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.95),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  margin: "0 auto",
  width: "100%",
  maxWidth: "1400px",
  height: "calc(100vh - 80px)",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    borderRadius: 0,
    boxShadow: "none",
    height: "calc(100vh - 64px)",
    maxWidth: "100%",
  },
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 0),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
    alignItems: "flex-start",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontFamily: 'Urbanist',
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem",
  },
}));

const Table = <T,>({
  data,
  columns,
  title,
  onAdd,
  onView,
  onEdit,
  onDelete,
  getRowId,
  initialRowsPerPage = 10,
  tableHeight = "calc(100vh - 250px)",
  totalCount = 0,
  page = 0,
  rowsPerPage = initialRowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onFilterChange,
  onSortChange,
  onFetchFilterOptions,
  loading = false,
  filters = {}, // Add filters prop
}: TableProps<T> & { filters?: Record<string, string> }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  const [mobileRowDetail, setMobileRowDetail] = useState<T | null>(null);

  const handleSort = (columnId: keyof T) => {
    const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortConfig({ key: columnId, direction: newDirection });
    onSortChange?.(columnId, newDirection);
  };

  useEffect(() => {
    if (data.length > 0) {
      setMobileRowDetail(null);
    }
  }, [data]);

  return (
    <Container>
      <Header>
        <Title>{title || "Table"}</Title>
        {onAdd && (
          <IconButton
            onClick={onAdd}
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              "&:hover": { background: alpha(theme.palette.primary.main, 0.2) },
              "&:active": { transform: "scale(0.95)" },
            }}
          >
            <AddIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
        )}
      </Header>
      <FilterSection<T>
        columns={columns}
        filters={filters}
        setFilters={(newFilters) => onFilterChange?.(newFilters)}
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
        title={title}
      />
      <TableContent<T>
        data={data}
        columns={columns}
        showActions={Boolean(onView || onEdit || onDelete)}
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
        page={page}
        totalCount={totalCount}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        mobileRowDetail={mobileRowDetail}
        setMobileRowDetail={setMobileRowDetail}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Container>
  );
};

export default Table;