// import React, { useEffect, useState, useMemo } from "react";
// import GenericTable from "../../Elements/Table/Table";
// import { TableColumn } from "../../Elements/Table/types";
// import { Chip, Alert } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

// interface ConsultationData {
//   id: number;
//   astrologer_name: string;
//   category: string[] | null; // Updated to string[] | null
//   start_datetime: string;
//   status: string;
//   customer_name: string;
//   currency: string;
//   consultation_fee: string | number | null;
// }

// const Consultations: React.FC = () => {
//   const navigate = useNavigate();
//   const [consultations, setConsultations] = useState<ConsultationData[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [page, setPage] = useState<number>(0);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   console.log(filters, "filters")

//   const fetchConsultations = async (currentPage: number, currentFilters: Record<string, string>) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params: Record<string, any> = {
//         page: currentPage + 1,
//         page_size: rowsPerPage,
//       };

//       const filterEntries = Object.entries(currentFilters).filter(([_, v]) => v.trim() !== "");
//       filterEntries.forEach(([field, value]) => {
//         params[field] = value.trim();
//       });

//       const endpoint = "/api/admin/consultations";
//       const response = await callAPI({
//         endpoint,
//         method: "get",
//         params,
//       });

//       const responseData = response?.data;
//       console.log(responseData, "responseData")
//       if (!responseData) {
//         throw new Error("No data in response");
//       }

//       const fetchedConsultations = Array.isArray(responseData.data) ? responseData.data : [];
//       const fetchedTotal = typeof responseData.total === "number" ? responseData.total : 0;

//       // Ensure category is an array (handle edge cases if API returns inconsistent data)
//       const normalizedConsultations = fetchedConsultations.map((consultation: any) => ({
//         ...consultation,
//         category: Array.isArray(consultation.category)
//           ? consultation.category
//           : consultation.category
//           ? [consultation.category]
//           : null,
//       }));

//       setConsultations(normalizedConsultations);
//       setTotalCount(fetchedTotal);

//       if (currentPage * rowsPerPage >= fetchedTotal && fetchedTotal > 0) {
//         setPage(0);
//       }
//     } catch (error) {
//       console.error("Failed to fetch consultations:", error);
//       setError("Failed to load consultations. Please try again.");
//       setConsultations([]);
//       setTotalCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFilterOptions = async (field: keyof ConsultationData, searchValue: string) => {
//     if (!searchValue.trim()) {
//       return [];
//     }
//     try {
//       const uniqueValues = await fetchFilterValues("consultation", field as string, searchValue);
//       if (field === "start_datetime") {
//         return uniqueValues.map((value: string) =>
//           new Date(value).toISOString().split("T")[0]
//         ).filter((value: string) => value);
//       }
//       return uniqueValues;
//     } catch (error) {
//       console.error(`Failed to fetch filter options for ${field}:`, error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     fetchConsultations(page, filters);
//   }, [page, rowsPerPage, filters]);

//   const columns: TableColumn<ConsultationData>[] = useMemo(
//     () => [
//       {
//         id: "customer_name",
//         label: "User",
//         width: "180px",
//         filterable: true,
//       },
//       {
//         id: "astrologer_name",
//         label: "Astrologer",
//         width: "180px",
//         filterable: true,
//       },
//       {
//         id: "category",
//         label: "Category",
//         filterable: true,
//         width: "140px",
//         filterOptions: ["Career", "Health", "Wealth", "Relationship"],
//         render: (value: string[] | null) => (value && value.length > 0 ? value.map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(", ") : "N/A"),
//       },
//       {
//         id: "currency",
//         label: "Fee Code",
//         filterable: true,
//         filterOptions: ["INR", "DLR"],
//         render: (value: number) => {
//           if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
//           return value.toLocaleString("en-US"); // Format with commas (e.g., 1234567 -> 1,234,567)
//         },
//       },
//       {
//         id: "consultation_fee",
//         label: "Fee",
//         filterable: true,
//         width: "140px",
//         filterOptions: ["Less than 500", "500 - 1000", "Greater than 1000 "],
//         render: (value: number) => {
//           if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
//           return `₹ ${value.toLocaleString("en-US")}`; // Format with commas (e.g., 1234567 -> 1,234,567)
//         },
//       },
//       {
//         id: "start_datetime",
//         label: "Consultation Date",
//         filterable: false,
//         filterType: "date",
//         width: "140px",
//         render: (value) =>
//           value
//             ? new Date(value).toLocaleString("en-US", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "N/A",
//       },
//       {
//         id: "status",
//         label: "Status",
//         filterable: true,
//         filterOptions: ["New", "Confirmed", "Completed"],
//         render: (value) => (
//           <Chip
//             label={value}
//             color={
//               value === "Completed"
//                 ? "success"
//                 : value === "Pending"
//                 ? "warning"
//                 : value === "New"
//                 ? "info"
//                 : "default"
//             }
//           />
//         ),
//       },
//     ],
//     []
//   );

//   const handleView = (row: ConsultationData) => {
//     navigate(`/dashboard/consultations/view/${row?.id}`);
//   };

//   return (
//     <>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       <GenericTable<ConsultationData>
//         title="Consultations"
//         data={consultations}
//         columns={columns}
//         totalCount={totalCount}
//         onView={handleView}
//         getRowId={(row) => row.id}
//         tableHeight="calc(100vh - 250px)"
//         initialRowsPerPage={rowsPerPage}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         onPageChange={(newPage) => setPage(newPage)}
//         onRowsPerPageChange={(newRowsPerPage) => {
//           setRowsPerPage(newRowsPerPage);
//           setPage(0);
//         }}
//         onFilterChange={(newFilters) => {
//           setFilters(newFilters);
//           setPage(0);
//         }}
//         onFetchFilterOptions={fetchFilterOptions}
//         showActions={true}
//         loading={loading}
//       />
//     </>
//   );
// };

// export default Consultations;

import React, { useEffect, useState, useMemo, useCallback } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { Chip, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

interface ConsultationData {
  id: number;
  astrologer_name: string;
  category: string[] | null;
  start_datetime: string;
  status: string;
  customer_name: string;
  currency: string;
  consultation_fee: string | number | null;
  cgst: string | number | null;
  sgst: string | number | null;
}

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const columns: TableColumn<ConsultationData>[] = useMemo(
    () => [
      {
        id: "customer_name",
        label: "User",
        width: "180px",
        filterable: true,
      },
      {
        id: "astrologer_name",
        label: "Astrologer",
        width: "180px",
        filterable: true,
      },
      {
        id: "category",
        label: "Category",
        filterable: true,
        width: "140px",
        filterOptions: ["Career", "Health", "Wealth", "Relationship"],
        render: (value: any) => {
          const categories = Array.isArray(value)
            ? value
            : value
            ? [value]
            : null;
          return categories && categories.length > 0
            ? categories
                .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                .join(", ")
            : "N/A";
        },
      },
      {
        id: "currency",
        label: "Fee Code",
        filterable: true,
        filterOptions: ["INR", "USD"],
        defaultValue: "INR",
      },
      {
        id: "consultation_fee_filter", // Renamed to avoid duplicate id
        label: "Consulting Fee",
        filterable: true,
        filterOnly: true,
        dependsOn: "currency",
        dynamicFilterOptions: (code) => {
          return code.toUpperCase() === "USD"
            ? ["<30", "30-100", ">100"]
            : ["<500", "500-1000", ">1000"];
        },
        filterKey: (filters: Record<string, string>) =>
          filters["currency"]?.toUpperCase() === "USD"
            ? "consultation_fee"
            : "consultation_fee",
      },
      {
        id: "consultation_fee",
        label: "Fee",
        width: "140px",
        render: (value: any, row: ConsultationData) => {
          if (value == null || isNaN(Number(value))) return "N/A";
          const currency = row.currency || "INR";
          const symbol = currency.toUpperCase() === "DLR" ? "$" : "₹";
          return `${symbol} ${Number(value).toLocaleString("en-US")}`;
        },
      },
      {
        id: "cgst",
        label: "CGST",
        width: "140px",
        render: (value: any, row: ConsultationData) => {
          if (value == null || isNaN(Number(value))) return "0";
          const currency = row.currency || "INR";
          const symbol = currency.toUpperCase() === "DLR" ? "$" : "₹";
          return `${symbol} ${Number(value).toLocaleString("en-US")}`;
        },
      },
      {
        id: "sgst",
        label: "SGST",
        width: "140px",
        render: (value: any, row: ConsultationData) => {
          if (value == null || isNaN(Number(value))) return "0";
          const currency = row.currency || "INR";
          const symbol = currency.toUpperCase() === "DLR" ? "$" : "₹";
          return `${symbol} ${Number(value).toLocaleString("en-US")}`;
        },
      },
      {
        id: "start_datetime",
        label: "Consultation Date",
        filterable: false,
        width: "140px",
        render: (value: any) => {
          if (typeof value !== "string" || !value) return "N/A";
          try {
            return new Date(value).toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch {
            return "N/A";
          }
        },
      },
      {
        id: "status",
        label: "Status",
        filterable: true,
        filterOptions: ["failed", "confirmed", "completed"],
        render: (value: any) => {
          const lowerValue = value?.toLowerCase();

          const displayLabel =
            lowerValue === "new"
              ? "Failed"
              : lowerValue === "confirmed"
              ? "Confirmed"
              : lowerValue === "completed"
              ? "Completed"
              : value?.toString()?.toUpperCase() ?? "";

          const color =
            lowerValue === "new"
              ? "error"
              : lowerValue === "completed"
              ? "success"
              : lowerValue === "confirmed"
              ? "info"
              : "default";

          return (
            <Chip
              label={displayLabel}
              color={color as any}
              sx={{
                fontWeight: 600,
                fontFamily: "Urbanist",
                textTransform: "capitalize",
              }}
            />
          );
        },
      },
    ],
    []
  );

  const initialFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    columns.forEach((column) => {
      if (column.filterable && column.defaultValue && !column.dependsOn) {
        filters[column.id as string] = column.defaultValue.toUpperCase();
      }
    });
    return filters;
  }, [columns]);

  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // console.log(filters, "filters");

  const fetchConsultations = async (
    currentPage: number,
    currentFilters: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page: currentPage + 1,
        page_size: rowsPerPage,
      };

      const filterEntries = Object.entries(currentFilters).filter(
        ([_, v]) => v.trim() !== ""
      );
      filterEntries.forEach(([field, value]) => {
        params[field] = value.trim();
      });

      const endpoint = "/api/admin/consultations";
      const response = await callAPI({
        endpoint,
        method: "get",
        params,
      });

      const responseData = response?.data;
      if (!responseData) {
        throw new Error("No data in response");
      }

      const fetchedConsultations = Array.isArray(responseData.data)
        ? responseData.data
        : [];
      const fetchedTotal =
        typeof responseData.total === "number" ? responseData.total : 0;

      const normalizedConsultations = fetchedConsultations.map(
        (consultation: any) => ({
          ...consultation,
          category: Array.isArray(consultation.category)
            ? consultation.category
            : consultation.category
            ? [consultation.category]
            : null,
        })
      );

      setConsultations(normalizedConsultations);
      setTotalCount(fetchedTotal);

      if (currentPage * rowsPerPage >= fetchedTotal && fetchedTotal > 0) {
        setPage(0);
      }
    } catch (error) {
      setError("Failed to load consultations. Please try again.");
      setConsultations([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async (
    field: keyof ConsultationData,
    searchValue: string
  ) => {
    if (!searchValue.trim()) {
      return [];
    }
    try {
      const uniqueValues = await fetchFilterValues(
        "consultation",
        field as string,
        searchValue
      );
      console.log(uniqueValues, "uniqueValues");
      if (field === "start_datetime") {
        return uniqueValues
          .map((value: string) => new Date(value).toISOString().split("T")[0])
          .filter((value: string) => value);
      }
      return uniqueValues;
    } catch (error: any) {
      return [];
    }
  };

  useEffect(() => {
    fetchConsultations(page, filters);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  const handleView = (row: ConsultationData) => {
    navigate(`/dashboard/consultations/view/${row?.id}`);
  };

  const handleFilterChange = useCallback(
    (newFilters: Record<string, string>) => {
      console.log("Filter change:", { newFilters, isInitialLoad });
      const normalizedFilters = {
        ...newFilters,
        ...(newFilters.status &&
          typeof newFilters.status === "string" && {
            status:
              newFilters.status.toLowerCase() === "failed"
                ? "new"
                : newFilters.status.toLowerCase(),
          }),
      };
      setFilters(normalizedFilters);
      if (!isInitialLoad) {
        setPage(0);
      }
    },
    [isInitialLoad]
  );

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <GenericTable<ConsultationData>
        title="Consultations"
        data={consultations}
        columns={columns}
        totalCount={totalCount}
        onView={handleView}
        getRowId={(row) => row.id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={rowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        // onFilterChange={(newFilters) => {
        //   setFilters(newFilters);
        //   setPage(0);
        // }}
        onFilterChange={handleFilterChange}
        onFetchFilterOptions={fetchFilterOptions}
        showActions={true}
        loading={loading}
      />
    </>
  );
};

export default Consultations;
