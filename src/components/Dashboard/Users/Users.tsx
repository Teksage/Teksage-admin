import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { Chip, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

interface UserData {
  id: number;
  first_name: string;
  email: string;
  mobile_number: string;
  status: string;
  plan_type: string;
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

  console.log(filters, "filters")

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
      align: "left", // Left-align name
    },
    {
      id: "email",
      label: "Email",
      filterable: true,
      width: "250px",
      align: "left", // Left-align email
    },
    {
      id: "mobile_number",
      label: "Mobile",
      filterable: true,
      width: "250px",
      align: "left", // Center-align mobile number
    },
    {
      id: "plan_type",
      label: "Subscription",
      filterable: true,
      filterOptions: ["Free", "Premium"],
      align: "center", // Center-align subscription
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
      align: "center", // Center-align status chip
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