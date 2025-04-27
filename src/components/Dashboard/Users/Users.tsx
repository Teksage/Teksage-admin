// import React, { useEffect, useState } from "react";
// import GenericTable from "../../Elements/Table";
// import { TableColumn } from "../../Elements/Table";
// import { Chip } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { callAPI } from "../../../api/crudFactory";

// interface UserData {
//   id: number;
//   name: string;
//   email: string;
//   mobile_number: string;
//   status: string;
//   user_typeplan_names: string;
// }

// const Users: React.FC = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await callAPI({
//           endpoint: "api/admin/users",
//           method: "get",
//         });
//         console.log(response?.data, "response");
//         setUsers(response?.data?.data); // or response if your `callAPI` returns data directly
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const columns: TableColumn<UserData>[] = [
//     {
//       id: "name",
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
//       id: "user_typeplan_names",
//       label: "Subscription",
//       filterable: true,
//     },
//     {
//       id: "status",
//       label: "Status",
//       render: (value) => {
//         // Handle null/undefined cases safely
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
//       filterable: true,
//     },
//   ];

//   const handleAdd = () => {
//     navigate("/dashboard/users/new");
//   };

//   const handleStatus = () => {
//     // Handle Status
//   };

//   const handleView = (row: UserData) => {
//     navigate(`/dashboard/users/view/${row?.id}`);
//   };

//   const handleEdit = (row: UserData) => {
//     navigate(`/dashboard/users/edit/${row?.id}`);
//   };

//   const handleDelete = (row: UserData) => {
//     // navigate(`/dashboard/users/edit/${row?.id}`);
//   };

//   const handleSelectionChange = (selectedIds: number[]) => {
//     // console.log('Selected:', selectedIds);
//   };

//   return (
//     <GenericTable<UserData>
//       title="Users Management"
//       data={users}
//       columns={columns}
//       onAdd={handleAdd}
//       onStatus={handleStatus}
//       onView={handleView}
//       onEdit={handleEdit}
//       onDelete={handleDelete}
//       onSelectionChange={handleSelectionChange}
//       getRowId={(row) => row.id}
//       tableHeight="calc(100vh - 250px)"
//       initialRowsPerPage={10}
//     />
//   );
// };

// export default Users;

import React, { useEffect, useState } from "react";
import GenericTable, { TableColumn } from "../../Elements/Table";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";

interface UserData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  status: string;
  user_typeplan_names: string;
}

interface FilterOptions {
  name: string[];
  email: string[];
  mobile_number: string[];
  user_typeplan_names: string[];
  status: string[];
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0); // Total number of users for pagination
  const [page, setPage] = useState<number>(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Rows per page
  const [filters, setFilters] = useState<Record<string, string>>({}); // Filter state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    name: [],
    email: [],
    mobile_number: [],
    user_typeplan_names: [],
    status: [],
  }); // Unique filter values

  // Fetch users based on page and filters
  const fetchUsers = async (currentPage: number, currentFilters: Record<string, string>) => {
    try {
      const params = {
        page: currentPage + 1, // API expects 1-based indexing
        per_page: rowsPerPage,
        ...currentFilters, // Spread filters as query params
      };

      const response = await callAPI({
        endpoint: "api/admin/users",
        method: "get",
        params,
      });

      setUsers(response?.data?.data || []);
      setTotalCount(response?.data?.total || 0); // Assuming API returns total count
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Fetch unique filter options for all filterable columns
  const fetchFilterOptions = async () => {
    try {
      const response = await callAPI({
        endpoint: "api/admin/users", // New endpoint for filter options
        method: "get",
      });

      console.log(response?.data, "response?.data?.data")

      console.log(response?.data?.data || {
        name: [],
        email: [],
        mobile_number: [],
        user_typeplan_names: [],
        status: [],
      }, "response123")

      setFilterOptions(response?.data?.data || {
        name: [],
        email: [],
        mobile_number: [],
        user_typeplan_names: [],
        status: [],
      });
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    }
  };

  // Fetch data when component mounts or page/filters change
  useEffect(() => {
    fetchUsers(page, filters);
  }, [page, rowsPerPage, filters]);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const columns: TableColumn<UserData>[] = [
    {
      id: "name",
      label: "Name",
      filterable: true,
      filterOptions: filterOptions.name, // Pass unique filter options
      width: "200px",
    },
    {
      id: "email",
      label: "Email",
      filterable: true,
      filterOptions: filterOptions.email,
      width: "250px",
    },
    {
      id: "mobile_number",
      label: "Mobile Number",
      filterable: true,
      filterOptions: filterOptions.mobile_number,
      width: "250px",
    },
    {
      id: "user_typeplan_names",
      label: "Subscription",
      filterable: true,
      filterOptions: filterOptions.user_typeplan_names,
    },
    {
      id: "status",
      label: "Status",
      filterable: true,
      filterOptions: filterOptions.status,
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

  // const handleDelete = (row: UserData) => {
  //   // Implement delete logic
  // };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page
  };

  return (
    <GenericTable<UserData>
      title="User Management"
      data={users}
      columns={columns}
      totalCount={totalCount} // Pass total count for pagination
      onAdd={handleAdd}
      onView={handleView}
      onEdit={handleEdit}
      // onDelete={handleDelete}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={rowsPerPage}
      onPageChange={handlePageChange} // Pass page change handler
      onRowsPerPageChange={handleRowsPerPageChange} // Pass rows per page change handler
      onFilterChange={handleFilterChange} // Pass filter change handler
      page={page} // Controlled page
      rowsPerPage={rowsPerPage} // Controlled rows per page
    />
  );
};

export default Users;