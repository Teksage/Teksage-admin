// import React, { useEffect, useState } from "react";
// import GenericTable, { TableColumn } from "../../Elements/Table";
// import { Chip } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

// interface UserData {
//   id: number;
//   name: string;
//   email: string;
//   mobile_number: string;
//   status: string;
//   plan_names: string;
// }

// interface FilterOptions {
//   name: string[];
//   email: string[];
//   mobile_number: string[];
//   plan_names: string[];
//   status: string[];
// }

// const Users: React.FC = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0); // Total number of users for pagination
//   const [page, setPage] = useState<number>(0); // Current page
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Rows per page
//   const [filters, setFilters] = useState<Record<string, string>>({}); // Filter state
//   const [filterOptions, setFilterOptions] = useState<FilterOptions>({
//     name: [],
//     email: [],
//     mobile_number: [],
//     plan_names: [],
//     status: [],
//   }); // Unique filter values

//   // Fetch users based on page and filters
//   const fetchUsers = async (currentPage: number, currentFilters: Record<string, string>) => {
//     try {
//       const params = {
//         page: currentPage + 1, // API expects 1-based indexing
//         per_page: rowsPerPage,
//         ...currentFilters, // Spread filters as query params
//       };

//       const response = await callAPI({
//         endpoint: "api/admin/users",
//         method: "get",
//         params,
//       });

//       setUsers(response?.data?.data || []);
//       setTotalCount(response?.data?.total || 0); // Assuming API returns total count
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     }
//   };

//   // Fetch unique filter options for all filterable columns
//   const fetchFilterOptions = async () => {
//     try {
//       const fields = ["name", "email", "mobile_number", "plan_names", "status"];
//       const options: FilterOptions = {
//         name: [],
//         email: [],
//         mobile_number: [],
//         plan_names: [],
//         status: [],
//       };
  
//       // Fetch unique values for each field using fetchFilterValues
//       for (const field of fields) {
//         const uniqueValues = await fetchFilterValues("user", field);
//         options[field as keyof FilterOptions] = uniqueValues;
//       }
  
//       console.log("Derived filterOptions:", options);
//       setFilterOptions(options);
//     } catch (error) {
//       console.error("Failed to fetch filter options:", error);
//       setFilterOptions({
//         name: [],
//         email: [],
//         mobile_number: [],
//         plan_names: [],
//         status: [],
//       });
//     }
//   };

//   // Fetch data when component mounts or page/filters change
//   useEffect(() => {
//     fetchUsers(page, filters);
//   }, [page, rowsPerPage, filters]);

//   // Fetch filter options on mount
//   useEffect(() => {
//     fetchFilterOptions();
//   }, []);

//   const columns: TableColumn<UserData>[] = [
//     {
//       id: "name",
//       label: "Name",
//       filterable: true,
//       filterOptions: filterOptions.name, // Pass unique filter options
//       width: "200px",
//     },
//     {
//       id: "email",
//       label: "Email",
//       filterable: true,
//       filterOptions: filterOptions.email,
//       width: "250px",
//     },
//     {
//       id: "mobile_number",
//       label: "Mobile Number",
//       filterable: true,
//       filterOptions: filterOptions.mobile_number,
//       width: "250px",
//     },
//     {
//       id: "plan_names",
//       label: "Subscription",
//       filterable: true,
//       filterOptions: filterOptions.plan_names,
//     },
//     {
//       id: "status",
//       label: "Status",
//       filterable: true,
//       filterOptions: filterOptions.status,
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

//   // const handleDelete = (row: UserData) => {
//   //   // Implement delete logic
//   // };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (newRowsPerPage: number) => {
//     setRowsPerPage(newRowsPerPage);
//     setPage(0); // Reset to first page
//   };

//   const handleFilterChange = (newFilters: Record<string, string>) => {
//     setFilters(newFilters);
//     setPage(0); // Reset to first page
//   };

//   return (
//     <GenericTable<UserData>
//       title="User Management"
//       data={users}
//       columns={columns}
//       totalCount={totalCount} // Pass total count for pagination
//       onAdd={handleAdd}
//       onView={handleView}
//       onEdit={handleEdit}
//       // onDelete={handleDelete}
//       getRowId={(row) => row.id}
//       tableHeight="calc(100vh - 250px)"
//       initialRowsPerPage={rowsPerPage}
//       onPageChange={handlePageChange} // Pass page change handler
//       onRowsPerPageChange={handleRowsPerPageChange} // Pass rows per page change handler
//       onFilterChange={handleFilterChange} // Pass filter change handler
//       page={page} // Controlled page
//       rowsPerPage={rowsPerPage} // Controlled rows per page
//     />
//   );
// };

// export default Users;

import React, { useEffect, useState } from "react";
import GenericTable, { TableColumn } from "../../Elements/Table";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

interface UserData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  status: string;
  plan_names: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (currentPage: number, currentFilters: Record<string, string>) => {
    setLoading(true);
    try {
      // Default pagination params
      const params: Record<string, any> = {
        page: currentPage + 1,
        per_page: rowsPerPage,
      };

      let endpoint = "api/admin/users";

      // If filters are applied, use api/admin/query with table, field, value
      const filterEntries = Object.entries(currentFilters).filter(([_, v]) => v !== "");
      if (filterEntries.length > 0) {
        const [field, value] = filterEntries[0];
        // Only trim whitespace, preserve the exact case of the value
        const normalizedValue = value.trim();
        params.table = "user";
        params.field = field;
        params.value = normalizedValue;
        endpoint = "api/admin/query";
        console.log(`Applying filter: field=${field}, value=${normalizedValue}`);
      }

      // console.log("fetchUsers params:", params);

      const response = await callAPI({
        endpoint,
        method: "get",
        params,
      });

      // console.log("fetchUsers response:", response);

      // Handle response structure for both endpoints
      const responseData = response?.data;
      if (!responseData) {
        throw new Error("No data in response");
      }

      console.log(responseData, "responseData")

      // Ensure data is an array and total is a number
      const fetchedUsers = Array.isArray(responseData.data) ? responseData.data : [];
      const fetchedTotal = typeof responseData.total === "number" ? responseData.total : 0;

      console.log("Fetched users:", fetchedUsers);
      console.log("Fetched total:", fetchedTotal);

      setUsers(fetchedUsers);
      setTotalCount(fetchedTotal);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async (field: keyof UserData, searchValue: string) => {
    // Only fetch filter options if searchValue is non-empty
    if (!searchValue.trim()) {
      return [];
    }

    try {
      const uniqueValues = await fetchFilterValues("user", field as string, searchValue);
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
      id: "name",
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
      id: "plan_names",
      label: "Subscription",
      filterable: true,
    },
    {
      id: "status",
      label: "Status",
      filterable: true,
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
  );
};

export default Users;