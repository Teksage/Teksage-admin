import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { Chip, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI, fetchFilterValues } from "../../../api/crudFactory";

interface ConsultationData {
  id: number;
  astrologer_name: string;
  category: string[] | null; // Updated to string[] | null
  start_time: string;
  status: string;
  customer_name: string;
  consultation_fee: string | number | null;
}

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(filters, "filters")

  const fetchConsultations = async (currentPage: number, currentFilters: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page: currentPage + 1,
        per_page: rowsPerPage,
      };

      const filterEntries = Object.entries(currentFilters).filter(([_, v]) => v.trim() !== "");
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

      const fetchedConsultations = Array.isArray(responseData.data) ? responseData.data : [];
      const fetchedTotal = typeof responseData.total === "number" ? responseData.total : 0;

      // Ensure category is an array (handle edge cases if API returns inconsistent data)
      const normalizedConsultations = fetchedConsultations.map((consultation: any) => ({
        ...consultation,
        category: Array.isArray(consultation.category)
          ? consultation.category
          : consultation.category
          ? [consultation.category]
          : null,
      }));

      setConsultations(normalizedConsultations);
      setTotalCount(fetchedTotal);

      if (currentPage * rowsPerPage >= fetchedTotal && fetchedTotal > 0) {
        setPage(0);
      }
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
      setError("Failed to load consultations. Please try again.");
      setConsultations([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async (field: keyof ConsultationData, searchValue: string) => {
    if (!searchValue.trim()) {
      return [];
    }
    try {
      const uniqueValues = await fetchFilterValues("consultation", field as string, searchValue);
      if (field === "start_time") {
        return uniqueValues.map((value: string) =>
          new Date(value).toISOString().split("T")[0]
        ).filter((value: string) => value);
      }
      return uniqueValues;
    } catch (error) {
      console.error(`Failed to fetch filter options for ${field}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchConsultations(page, filters);
  }, [page, rowsPerPage, filters]);

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
        render: (value: string[] | null) => (value && value.length > 0 ? value.map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(", ") : "N/A"),
      },
      {
        id: "consultation_fee",
        label: "Fee",
        filterable: true,
        width: "140px",
        render: (value) => (value !== null ? value.toString() : "N/A"),
      },
      {
        id: "start_time",
        label: "Consultation Date",
        filterable: false,
        filterType: "date",
        width: "140px",
        render: (value) =>
          value
            ? new Date(value).toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
      },
      {
        id: "status",
        label: "Status",
        filterable: true,
        filterOptions: ["New", "Confirmed", "Completed"],
        render: (value) => (
          <Chip
            label={value}
            color={
              value === "Completed"
                ? "success"
                : value === "Pending"
                ? "warning"
                : value === "New"
                ? "info"
                : "default"
            }
          />
        ),
      },
    ],
    []
  );

  const handleView = (row: ConsultationData) => {
    navigate(`/dashboard/consultations/view/${row?.id}`);
  };

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
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setPage(0);
        }}
        onFetchFilterOptions={fetchFilterOptions}
        showActions={true}
        loading={loading}
      />
    </>
  );
};

export default Consultations;