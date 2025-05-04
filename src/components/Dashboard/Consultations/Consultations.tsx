import React, { useEffect, useState, useMemo } from "react";
import GenericTable, { TableColumn } from "../../Elements/Table";
import { Chip, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";

interface ConsultationData {
  id: number;
  astrologer_name: string;
  category: string | null;
  start_time: string;
  status: string;
  customer_name: string;
  consultation_fee: string | number | null;
}

interface FilterOptions {
  astrologer_name: string[];
  category: string[];
  status: string[];
  customer_name: string[];
  consultation_fee: string[];
  start_time: string[];
}

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    astrologer_name: [],
    category: [],
    status: [],
    customer_name: [],
    consultation_fee: [],
    start_time: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchConsultations = async (currentPage: number, currentFilters: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage + 1, // API expects 1-based indexing
        per_page: rowsPerPage,
        ...Object.fromEntries(
          Object.entries(currentFilters).filter(([_, v]) => v !== "")
        ),
      };

      console.log("fetchConsultations params:", params); // Debug log

      const response = await callAPI({
        endpoint: "/api/admin/consultations",
        method: "get",
        params,
      });

      console.log("fetchConsultations response:", response); // Debug log

      const consultData = response?.data?.data || [];
      const total = response?.data?.total || 0;

      if (!Array.isArray(consultData)) {
        throw new Error("Invalid consultation data format");
      }

      setConsultations(consultData);
      setTotalCount(Number(total));

      // Reset page if out of range
      if (currentPage * rowsPerPage >= total && total > 0) {
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

  const fetchFilterOptions = async () => {
    try {
      let allConsultations: ConsultationData[] = [];
      let currentPage = 1;
      let total = 0;
      const perPage = 100; // Smaller per_page to avoid API limits

      // Fetch all pages until all records are retrieved
      do {
        const response = await callAPI({
          endpoint: "/api/admin/consultations",
          method: "get",
          params: { per_page: perPage, page: currentPage },
        });

        const consultData = response?.data?.data || [];
        total = response?.data?.total || 0;

        if (!Array.isArray(consultData)) {
          throw new Error("Invalid consultation data format for filter options");
        }

        allConsultations = [...allConsultations, ...consultData];
        currentPage++;
      } while (allConsultations.length < total);

      // Extract unique values for each filterable field, excluding null and empty values
      const options: FilterOptions = {
        astrologer_name: [
          ...new Set(allConsultations.map((consult) => consult.astrologer_name).filter((val): val is string => val !== null && val !== "")),
        ].sort(),
        category: [
          ...new Set(allConsultations.map((consult) => consult.category).filter((val): val is string => val !== null && val !== "")),
        ].sort(),
        status: [
          ...new Set(allConsultations.map((consult) => consult.status).filter((val): val is string => val !== null && val !== "")),
        ].sort(),
        customer_name: [
          ...new Set(allConsultations.map((consult) => consult.customer_name).filter((val): val is string => val !== null && val !== "")),
        ].sort(),
        consultation_fee: [
          ...new Set(
            allConsultations
              .map((consult) => (consult.consultation_fee !== null ? consult.consultation_fee.toString() : null))
              .filter((val): val is string => val !== null && val !== "")
          ),
        ].sort(),
        start_time: [
          ...new Set(
            allConsultations
              .map((consult) => new Date(consult.start_time).toISOString().split("T")[0])
              .filter((val): val is string => val !== null && val !== "")
          ),
        ].sort(),
      };

      console.log("Derived filterOptions:", options); // Debug log

      setFilterOptions(options);
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
      setError("Failed to load filter options. Please try again.");
    }
  };

  useEffect(() => {
    fetchConsultations(page, filters);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const columns: TableColumn<ConsultationData>[] = useMemo(
    () => [
      {
        id: "customer_name",
        label: "User",
        width: "180px",
        filterable: true,
        filterOptions: filterOptions.customer_name,
      },
      {
        id: "astrologer_name",
        label: "Astrologer",
        width: "180px",
        filterable: true,
        filterOptions: filterOptions.astrologer_name,
      },
      {
        id: "category",
        label: "Category",
        filterable: true,
        filterOptions: filterOptions.category,
        width: "140px",
        render: (value) => value || "N/A",
      },
      {
        id: "consultation_fee",
        label: "Consultation Fee",
        filterable: true,
        filterOptions: filterOptions.consultation_fee,
        width: "140px",
        render: (value) => (value !== null ? value.toString() : "N/A"),
      },
      {
        id: "start_time",
        label: "Consultation Date",
        filterable: true,
        filterType: "date",
        filterOptions: filterOptions.start_time,
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
        filterOptions: filterOptions.status,
        render: (value) => (
          <Chip
            label={value}
            color={
              value === "Completed"
                ? "success"
                : value === "Pending"
                ? "warning"
                : value === "new"
                ? "info"
                : "default"
            }
          />
        ),
      },
    ],
    [filterOptions]
  );

  const handleView = (row: ConsultationData) => {
    navigate(`/dashboard/consultations/view/${row?.id}`);
  };

  // const handleSelectionChange = (selectedIds: number[]) => {
  //   console.log("Selected:", selectedIds);
  // };

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
        // onSelectionChange={handleSelectionChange}
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
        showActions={true}
        loading={loading}
      />
    </>
  );
};

export default Consultations;