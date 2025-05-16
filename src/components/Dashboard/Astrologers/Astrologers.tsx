// import React, { useEffect, useState, useMemo } from "react";
// import GenericTable from "../../Elements/Table/Table";
// import { TableColumn } from "../../Elements/Table/types";
// import { Chip, Alert } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

// interface UserData {
//   astrologer_id: number;
//   local_consulting_fee: string;
//   foreign_consulting_fee: string;
//   consulting_fee_code: string;
//   customer_rating: string;
//   experience: number;
//   first_name: string;
//   status: string;
// }

// const Astrologers: React.FC = () => {
//   const navigate = useNavigate();
//   const [astrologers, setAstrologers] = useState<UserData[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [page, setPage] = useState<number>(0);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   console.log(filters, "filters")

//   const fetchAstrologers = async (
//     currentPage: number,
//     currentFilters: Record<string, string>
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Default pagination params
//       const params: Record<string, any> = {
//         page: currentPage + 1,
//         per_page: rowsPerPage,
//       };

//       // Add filters to params if they exist and are non-empty
//       const filterEntries = Object.entries(currentFilters).filter(
//         ([_, v]) => v.trim() !== ""
//       );
//       filterEntries.forEach(([field, value]) => {
//         params[field] = value.trim();
//       });

//       const endpoint = "api/admin/astrologers";

//       // console.log("fetchAstrologers params:", params);

//       const response = await callAPI({
//         endpoint,
//         method: "get",
//         params,
//       });

//       // console.log("fetchAstrologers response:", response);

//       // Handle response structure
//       const responseData = response?.data;
//       if (!responseData) {
//         throw new Error("No data in response");
//       }

//       // Ensure data is an array and total is a number
//       const fetchedAstrologers = Array.isArray(responseData.data)
//         ? responseData.data
//         : [];
//         const fetchedTotal =
//         typeof responseData.total === "number" ? responseData.total : 0;

//       setAstrologers(fetchedAstrologers);
//       setTotalCount(fetchedTotal);

//       // Reset page if out of range
//       if (currentPage * rowsPerPage >= fetchedTotal && fetchedTotal > 0) {
//         setPage(0);
//       }
//     } catch (error) {
//       console.error("Failed to fetch astrologers:", error);
//       setError("Failed to load astrologers. Please try again.");
//       setAstrologers([]);
//       setTotalCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFilterOptions = async (
//     field: keyof UserData,
//     searchValue: string
//   ) => {
//     // Only fetch filter options if searchValue is non-empty
//     if (!searchValue.trim()) {
//       return [];
//     }

//     try {
//       const uniqueValues = await fetchFilterValues(
//         // field === "first_name" ? "user" : "astrologer",
//         "astrologer",
//         field as string,
//         searchValue
//       );
//       return uniqueValues;
//     } catch (error) {
//       console.error(`Failed to fetch filter options for ${field}:`, error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     fetchAstrologers(page, filters);
//   }, [page, rowsPerPage, filters]);

//   const columns: TableColumn<UserData>[] = useMemo(
//     () => [
//       {
//         id: "first_name",
//         label: "Name",
//         filterable: true,
//         width: "300px",
//       },
//       {
//         id: "experience",
//         label: "Experience",
//         filterable: true,
//         filterOptions: [
//           "< 3 Years",
//           "3 - 5 Years",    
//           "5 - 10 Years",
//           "> 10 Years",
//         ], // Default dropdown options
//       },
//       {
//         id: "customer_rating",
//         label: "Rating",
//         filterable: true,
//         width: "250px",
//         filterOptions: ["1", "2", "3", "4", "5"],
//       },
//       {
//         id: "consulting_fee_code",
//         label: "Fee Code",
//         filterable: true,
//         filterOptions: ["INR", "USD"],
//         render: (value: number) => {
//           if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
//           return value.toLocaleString("en-US"); // Format with commas (e.g., 1234567 -> 1,234,567)
//         },
//       },
//       {
//         id: "local_consulting_fee",
//         label: "Local Fee",
//         filterable: true,
//         filterOptions: ["Less than 500", "500 - 1000", "Greater than 1000 "],
//         render: (value: number) => {
//           if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
//           return `₹ ${value.toLocaleString("en-US")}`; // Format with commas (e.g., 1234567 -> 1,234,567)
//         },
//       },
//       {
//         id: "foreign_consulting_fee",
//         label: "Foreign Fee",
//         width: "150px",
//         render: (value: number) => {
//           if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
//           return `$ ${value.toLocaleString("en-US")}`; // Format with commas (e.g., 1234567 -> 1,234,567)
//         },
//       },
//       {
//         id: "status",
//         label: "Status",
//         filterable: true,
//         filterOptions: ["Active", "Inactive"], // Default dropdown options
//         render: (value:any) => {
//           if (!value) {
//             return <Chip label="N/A" color="default" />;
//           }
//           const formattedValue =
//             value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
//           return (
//             <Chip
//               label={formattedValue}
//               color={formattedValue === "Active" ? "success" : "default"}
//             />
//           );
//         },
//       },
//     ],
//     []
//   );

//   const handleAdd = () => {
//     navigate("/dashboard/astrologers/new");
//   };

//   const handleView = (row: UserData) => {
//     navigate(`/dashboard/astrologers/view/${row?.astrologer_id}`);
//   };

//   const handleEdit = (row: UserData) => {
//     navigate(`/dashboard/astrologers/edit/${row?.astrologer_id}`);
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (newRowsPerPage: number) => {
//     setRowsPerPage(newRowsPerPage);
//     setPage(0);
//   };

//   const handleFilterChange = (newFilters: Record<string, string>) => {
//     setFilters(newFilters);
//     setPage(0);
//   };

//   return (
//     <>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       <GenericTable<UserData>
//         title="Astrologer Management"
//         data={astrologers}
//         columns={columns}
//         totalCount={totalCount}
//         onAdd={handleAdd}
//         onView={handleView}
//         onEdit={handleEdit}
//         getRowId={(row) => row.astrologer_id}
//         tableHeight="calc(100vh - 250px)"
//         initialRowsPerPage={rowsPerPage}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         onPageChange={handlePageChange}
//         onRowsPerPageChange={handleRowsPerPageChange}
//         onFilterChange={handleFilterChange}
//         onFetchFilterOptions={fetchFilterOptions}
//         loading={loading}
//       />
//     </>
//   );
// };

// export default Astrologers;

import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { Chip, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

interface UserData {
  astrologer_id: number;
  local_consulting_fee: string;
  foreign_consulting_fee: string;
  consulting_fee_code: string;
  customer_rating: string;
  experience: number;
  first_name: string;
  status: string;
  consulting_fee?: string;
}

const Astrologers: React.FC = () => {
  const navigate = useNavigate();
  const [astrologers, setAstrologers] = useState<UserData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({
    consulting_fee_code: "INR",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAstrologers = async (
    currentPage: number,
    currentFilters: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page: currentPage + 1,
        per_page: rowsPerPage,
      };

      const filterEntries = Object.entries(currentFilters).filter(
        ([_, v]) => v.trim() !== ""
      );
      filterEntries.forEach(([field, value]) => {
        if (field === "consulting_fee") {
          const feeCode = currentFilters.consulting_fee_code || "INR";
          const localOptions = [
            "Less than 500",
            "500 - 1000",
            "Greater than 1000",
          ];
          const foreignOptions = [
            "Less than 30",
            "30 - 100",
            "Greater than 100",
          ];
          if (feeCode === "All") {
            if (localOptions.includes(value)) {
              params["local_consulting_fee"] = value;
            } else if (foreignOptions.includes(value)) {
              params["foreign_consulting_fee"] = value;
            }
          } else {
            params[feeCode === "USD" ? "foreign_consulting_fee" : "local_consulting_fee"] = value;
          }
        } else {
          params[field] = value.trim();
        }
      });

      const endpoint = "api/admin/astrologers";

      const response = await callAPI({
        endpoint,
        method: "get",
        params,
      });

      const responseData = response?.data;
      if (!responseData) {
        throw new Error("No data in response");
      }

      const fetchedAstrologers = Array.isArray(responseData.data)
        ? responseData.data
        : [];
      const fetchedTotal =
        typeof responseData.total === "number" ? responseData.total : 0;

      setAstrologers(fetchedAstrologers);
      setTotalCount(fetchedTotal);

      if (currentPage * rowsPerPage >= fetchedTotal && fetchedTotal > 0) {
        setPage(0);
      }
    } catch (error) {
      console.error("Failed to fetch astrologers:", error);
      setError("Failed to load astrologers. Please try again.");
      setAstrologers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async (
    field: keyof UserData,
    searchValue: string
  ) => {
    if (!searchValue.trim()) {
      return [];
    }

    try {
      const uniqueValues = await fetchFilterValues(
        "astrologer",
        field as string,
        searchValue
      );
      return uniqueValues;
    } catch (error) {
      console.error(`Failed to fetch filter options for ${field}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchAstrologers(page, filters);
  }, [page, rowsPerPage, filters]);

  const columns: TableColumn<UserData>[] = useMemo(() => {
    const feeCode = filters.consulting_fee_code || "INR";
    const localOptions = ["Less than 500", "500 - 1000", "Greater than 1000"];
    const foreignOptions = ["Less than 30", "30 - 100", "Greater than 100"];
    let feeFilterOptions: string[] = [];

    if (feeCode === "USD") {
      feeFilterOptions = foreignOptions;
    } else if (feeCode === "All") {
      feeFilterOptions = [...localOptions, ...foreignOptions];
    } else {
      feeFilterOptions = localOptions;
    }

    return [
      {
        id: "first_name",
        label: "Name",
        filterable: true,
        width: "300px",
      },
      {
        id: "experience",
        label: "Experience",
        filterable: true,
        filterOptions: [
          "< 3 Years",
          "3 - 5 Years",
          "5 - 10 Years",
          "> 10 Years",
        ],
      },
      {
        id: "customer_rating",
        label: "Rating",
        filterable: true,
        width: "250px",
        filterOptions: ["1", "2", "3", "4", "5"],
      },
      {
        id: "consulting_fee",
        label: "Fee",
        filterable: true,
        filterOptions: feeFilterOptions,
        render: (_: any, row: UserData) => {
          const feeValue =
            row.consulting_fee_code === "USD"
              ? parseFloat(row.foreign_consulting_fee)
              : parseFloat(row.local_consulting_fee);
          if (isNaN(feeValue)) return "N/A";
          return row.consulting_fee_code === "USD"
            ? `$ ${feeValue.toLocaleString()}`
            : `₹ ${feeValue.toLocaleString()}`;
        },
      },
      {
        id: "status",
        label: "Status",
        filterable: true,
        filterOptions: ["Active", "Inactive"],
        render: (value: any) => {
          if (!value) {
            return <Chip label="N/A" color="default" />;
          }
          const formattedValue =
            value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          return (
            <Chip
              label={formattedValue}
              color={formattedValue === "Active" ? "success" : "default"}
            />
          );
        },
      },
      {
        id: "consulting_fee_code",
        label: "Fee Code",
        filterable: true,
        filterOptions: ["All", "INR", "USD"],
        filterOnly: true,
      },
    ];
  }, [filters.consulting_fee_code]);

  const handleAdd = () => {
    navigate("/dashboard/astrologers/new");
  };

  const handleView = (row: UserData) => {
    navigate(`/dashboard/astrologers/view/${row?.astrologer_id}`);
  };

  const handleEdit = (row: UserData) => {
    navigate(`/dashboard/astrologers/edit/${row?.astrologer_id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    const updatedFilters = { ...newFilters };
    if (newFilters.consulting_fee_code !== filters.consulting_fee_code) {
      delete updatedFilters.consulting_fee;
    }
    setFilters(updatedFilters);
    setPage(0);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <GenericTable<UserData>
        title="Astrologer Management"
        data={astrologers}
        columns={columns}
        totalCount={totalCount}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        getRowId={(row) => row.astrologer_id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={rowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onFilterChange={handleFilterChange}
        onFetchFilterOptions={fetchFilterOptions}
        loading={loading}
        filters={filters} // Pass filters to GenericTable
      />
    </>
  );
};

export default Astrologers;