// import React, { useEffect, useState } from "react";
// import GenericTable, { TableColumn } from "../../Elements/Table";
// import { Chip, Alert } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

// interface UserData {
//   id: number;
//   first_name: string;
//   email: string;
//   mobile_number: string;
//   status: string;
//   plan_name: string;
// }

// const Users: React.FC = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [page, setPage] = useState<number>(0);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const fetchUsers = async (
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

//       const endpoint = "api/admin/users";

//       // console.log("fetchUsers params:", params);

//       const response = await callAPI({
//         endpoint,
//         method: "get",
//         params,
//       });

//       // console.log("fetchUsers response:", response);

//       // Handle response structure
//       const responseData = response?.data;
//       if (!responseData) {
//         throw new Error("No data in response");
//       }

//       console.log(responseData, "responseData");

//       // Ensure data is an array and total is a number
//       const fetchedUsers = Array.isArray(responseData.data)
//         ? responseData.data
//         : [];
//       const fetchedTotal =
//         typeof responseData.total === "number" ? responseData.total : 0;

//       console.log("Fetched users:", fetchedUsers);
//       console.log("Fetched total:", fetchedTotal);

//       setUsers(fetchedUsers);
//       setTotalCount(fetchedTotal);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//       setError("Failed to load users. Please try again.");
//       setUsers([]);
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
//         "user",
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
//     fetchUsers(page, filters);
//   }, [page, rowsPerPage, filters]);

//   const columns: TableColumn<UserData>[] = [
//     {
//       id: "first_name",
//       label: "Name",
//       filterable: true,
//       width: "200px",
//     },
//     {
//       id: "email",
//       label: "Email",
//       filterable: true,
//       width: "250px",
//     },
//     {
//       id: "mobile_number",
//       label: "Mobile Number",
//       filterable: true,
//       width: "250px",
//     },
//     {
//       id: "plan_name",
//       label: "Subscription",
//       filterable: true,
//     },
//     {
//       id: "status",
//       label: "Status",
//       filterable: true,
//       render: (value) => {
//         if (!value) {
//           return <Chip label="N/A" color="default" />;
//         }
//         const formattedValue =
//           value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
//         return (
//           <Chip
//             label={formattedValue}
//             color={formattedValue === "Active" ? "success" : "default"}
//           />
//         );
//       },
//     },
//   ];

//   const handleAdd = () => {
//     navigate("/dashboard/users/new");
//   };

//   const handleView = (row: UserData) => {
//     navigate(`/dashboard/users/view/${row?.id}`);
//   };

//   const handleEdit = (row: UserData) => {
//     navigate(`/dashboard/users/edit/${row?.id}`);
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
//         title="User Management"
//         data={users}
//         columns={columns}
//         totalCount={totalCount}
//         onAdd={handleAdd}
//         onView={handleView}
//         onEdit={handleEdit}
//         getRowId={(row) => row.id}
//         tableHeight="calc(100vh - 250px)"
//         initialRowsPerPage={rowsPerPage}
//         onPageChange={handlePageChange}
//         onRowsPerPageChange={handleRowsPerPageChange}
//         onFetchFilterOptions={fetchFilterOptions}
//         onFilterChange={handleFilterChange}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         loading={loading}
//       />
//     </>
//   );
// };

// export default Users;

import React, { useEffect, useState } from "react";
import GenericTable, { TableColumn } from "../../Elements/Table/Table";
import { Chip, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

interface UserData {
  id: number;
  first_name: string;
  email: string;
  mobile_number: string;
  status: string;
  plan_name: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (
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
        // Ensure status is sent in lowercase to match backend expectations
        if (field === "status") {
          params[field] = value.toLowerCase();
        } else {
          params[field] = value.trim();
        }
      });

      const endpoint = "api/admin/users";
      const response = await callAPI({
        endpoint,
        method: "get",
        params,
      });

      const responseData = response?.data;
      if (!responseData) {
        throw new Error("No data in response");
      }

      const fetchedUsers = Array.isArray(responseData.data)
        ? responseData.data
        : [];
      const fetchedTotal =
        typeof responseData.total === "number" ? responseData.total : 0;

      setUsers(fetchedUsers);
      setTotalCount(fetchedTotal);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users. Please try again.");
      setUsers([]);
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
        "user",
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
    fetchUsers(page, filters);
  }, [page, rowsPerPage, filters]);

  const columns: TableColumn<UserData>[] = [
    {
      id: "first_name",
      label: "Name",
      filterable: true,
      width: "200px",
    },
    {
      id: "email",
      label: "Email",
      filterable: true,
      width: "250px",
    },
    {
      id: "mobile_number",
      label: "Mobile Number",
      filterable: true,
      width: "250px",
    },
    {
      id: "plan_name",
      label: "Subscription",
      filterable: true,
      filterOptions: ["Free", "Premium"], // Default dropdown options
    },
    {
      id: "status",
      label: "Status",
      filterable: true,
      filterOptions: ["Active", "Inactive"], // Default dropdown options
      render: (value) => {
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
  ];

  const handleAdd = () => {
    navigate("/dashboard/users/new");
  };

  const handleView = (row: UserData) => {
    navigate(`/dashboard/users/view/${row?.id}`);
  };

  const handleEdit = (row: UserData) => {
    navigate(`/dashboard/users/edit/${row?.id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
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
        title="User Management"
        data={users}
        columns={columns}
        totalCount={totalCount}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        getRowId={(row) => row.id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onFetchFilterOptions={fetchFilterOptions}
        onFilterChange={handleFilterChange}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
      />
    </>
  );
};

export default Users;