// // export interface TableColumn<T> {
// //   id: keyof T;
// //   label: string;
// //   filterable?: boolean;
// //   sortable?: boolean;
// //   width?: string;
// //   render?: (value: any, row: T) => React.ReactNode;
// //   filterOptions?: string[];
// //   align?: string;
// // }

// // export interface TableProps<T> {
// //   data: T[];
// //   columns: TableColumn<T>[];
// //   title?: string;
// //   onAdd?: () => void;
// //   onView?: (row: T) => void;
// //   onEdit?: (row: T) => void;
// //   onDelete?: (row: T) => void;
// //   showActions?: boolean;
// //   getRowId: (row: T) => string | number;
// //   initialRowsPerPage?: number;
// //   tableHeight?: string;
// //   totalCount?: number;
// //   page?: number;
// //   rowsPerPage?: number;
// //   onPageChange?: (newPage: number) => void;
// //   onRowsPerPageChange?: (newRowsPerPage: number) => void;
// //   onFilterChange?: (filters: Record<string, string>) => void;
// //   onSortChange?: (sortBy: keyof T, sortOrder: "asc" | "desc") => void;
// //   onFetchFilterOptions?: (
// //     field: keyof T,
// //     searchValue: string
// //   ) => Promise<string[]>;
// //   loading?: boolean;
// // }

// export interface TableColumn<T> {
//   id: keyof T | string; // Allow string for filter-only virtual columns
//   label: string;
//   filterable?: boolean;
//   sortable?: boolean;
//   width?: string;
//   filterOptions?: string[];
//   filterOnly?: boolean;
//   defaultValue?: string;
//   dependsOn?: keyof T;
//   dynamicFilterOptions?: (value: string) => string[];
//   filterKey?: keyof T | ((filters: Record<string, string>) => string);
//   render?: (value: any, row: T) => React.ReactNode; // Relaxed to any for compatibility
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
//   onPageChange?: (page: number) => void;
//   onRowsPerPageChange?: (rowsPerPage: number) => void;
//   onFilterChange?: (filters: Record<string, string>) => void;
//   onSortChange?: (key: keyof T, direction: "asc" | "desc") => void;
//   onFetchFilterOptions?: (
//     field: keyof T,
//     searchValue: string
//   ) => Promise<string[]>;
//   loading?: boolean;
// }

import React from "react";

interface BaseColumn<T> {
  label: string;
  filterable?: boolean;
  sortable?: boolean;
  width?: string;
  filterOptions?: string[];
  defaultValue?: string;
  dependsOn?: keyof T;
  dynamicFilterOptions?: (value: string) => string[];
  filterKey?: keyof T | ((filters: Record<string, string>) => string);
}

interface DataColumn<T> extends BaseColumn<T> {
  id: keyof T;
  filterOnly?: false;
  render?: (value: any, row: T) => React.ReactNode;
}

interface FilterColumn<T> extends BaseColumn<T> {
  id: string;
  filterOnly: true;
  render?: undefined; // Filter-only columns don't render in table
}

export type TableColumn<T> = DataColumn<T> | FilterColumn<T>;

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
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSortChange?: (key: keyof T, direction: "asc" | "desc") => void;
  onFetchFilterOptions?: (
    field: keyof T,
    searchValue: string
  ) => Promise<string[]>;
  loading?: boolean;
}