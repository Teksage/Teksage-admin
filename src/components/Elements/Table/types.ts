export interface TableColumn<T> {
    id: keyof T;
    label: string;
    filterable?: boolean;
    sortable?: boolean;
    width?: string;
    render?: (value: any, row: T) => React.ReactNode;
    filterOptions?: string[];
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