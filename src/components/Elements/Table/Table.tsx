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

import { useState, useMemo, useEffect } from "react";
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

  // Initialize filters with default values, considering dependencies
  const initialFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    const dependencyMap: Record<string, keyof T> = {};

    // First pass: Set non-dependent default values and collect dependencies
    columns.forEach((column) => {
      if (column.filterable && column.defaultValue && !column.dependsOn) {
        filters[column.id as string] = column.defaultValue;
      }
      if (column.dependsOn) {
        dependencyMap[column.id as string] = column.dependsOn;
      }
    });

    // Second pass: Set default values for dependent columns
    columns.forEach((column) => {
      if (column.filterable && column.defaultValue && column.dependsOn) {
        const dependentValue = filters[column.dependsOn as string] || "";
        if (column.id === "local_consulting_fee" && column.dependsOn === "consulting_fee_code") {
          const code = dependentValue.toLowerCase();
          const options = column.dynamicFilterOptions?.(code) || [];
          const defaultValue = code === "dlr" && column.defaultValue === "Less than 500"
            ? "Less than 30"
            : code === "inr" && column.defaultValue === "Less than 30"
            ? "Less than 500"
            : column.defaultValue;
          const filterKey = typeof column.filterKey === "function"
            ? column.filterKey(filters)
            : column.filterKey || column.id;
          if (defaultValue && defaultValue !== "") {
            filters[filterKey as string] = defaultValue;
          }
        } else if (column.defaultValue !== "") {
          const filterKey = typeof column.filterKey === "function"
            ? column.filterKey(filters)
            : column.filterKey || column.id;
          filters[filterKey as string] = column.defaultValue;
        }
      }
    });

    return filters;
  }, [columns]);

  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
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

  const hasFilterableColumns = useMemo(
    () => columns.some((col) => col.filterable),
    [columns]
  );

  // Effect to call onFilterChange with initial filters on mount
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      onFilterChange?.(initialFilters);
    }
  }, [initialFilters, onFilterChange]);

  // Effect to update consulting_fee filter when consulting_fee_code changes
  useEffect(() => {
    const consultingFeeColumn = columns.find(
      (col) => col.id === "local_consulting_fee" && col.dependsOn === "consulting_fee_code"
    );
    if (consultingFeeColumn) {
      const code = (filters["consulting_fee_code"] || "INR").toLowerCase();
      const currentConsultingFee = filters["local_consulting_fee"] || filters["foreign_consulting_fee"];
      const options = consultingFeeColumn.dynamicFilterOptions?.(code) || [];
      const filterKey = typeof consultingFeeColumn.filterKey === "function"
        ? consultingFeeColumn.filterKey(filters)
        : consultingFeeColumn.filterKey || consultingFeeColumn.id;
      const otherKey = code === "dlr" ? "local_consulting_fee" : "foreign_consulting_fee";

      if (currentConsultingFee && !options.includes(currentConsultingFee)) {
        const newDefault = code === "dlr" ? "Less than 30" : "Less than 500";
        const newFilters = { ...filters };
        delete newFilters[otherKey];
        newFilters[filterKey as string] = newDefault;
        setFilters(newFilters);
        onFilterChange?.(newFilters);
      }
    }
  }, [filters["consulting_fee_code"], columns, onFilterChange]);

  const handleSort = (columnId: keyof T) => {
    const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortConfig({ key: columnId, direction: newDirection });
    onSortChange?.(columnId, newDirection);
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
    setTempDateRange({ start: null, end: null });
    setSelectedPreset("");
    setFilterOptions({});
    setSearchValues({});
    onFilterChange?.(initialFilters);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: tableHeight,
        position: "relative",
      }}
    >
      <TableHeader
        title={title}
        onAdd={onAdd}
        onExport={handleExport}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setMobileFiltersOpen={setMobileFiltersOpen}
        filters={filters}
        clearAllFilters={clearAllFilters}
        hasFilterableColumns={hasFilterableColumns}
        mobileFiltersOpen={mobileFiltersOpen}
      />
      {showFilters && hasFilterableColumns && (
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
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        <TableContent
          data={data}
          columns={columns}
          showActions={showActions}
          getRowId={getRowId}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          tableHeight="100%"
          page={page}
          rowsPerPage={rowsPerPage}
          sortConfig={sortConfig}
          handleSort={handleSort}
          setMobileRowDetail={setMobileRowDetail}
          loading={loading}
        />
      </div>
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
            clearAllFilters={clearAllFilters}
          />
        </>
      )}
    </div>
  );
}

export default GenericTable;