import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";

interface ReviewRow {
  id: number;
  source?: "consultation" | "ask" | string;
  customer_name: string;
  astrologer_name: string;
  rating: number | null;
  feedback: string | null;
  review_status: string | null;
  status: string | null;
  start_datetime: string | null;
}

const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const columns: TableColumn<ReviewRow>[] = useMemo(
    () => [
      {
        id: "source",
        label: "Type",
        width: "130px",
        render: (value: any) => {
          const source = String(value || "consultation").toLowerCase();
          const isAsk = source === "ask";
          return (
            <Chip
              size="small"
              label={isAsk ? "SINGLE-QUERY" : "30 MINS"}
              color={isAsk ? "info" : "default"}
              sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
            />
          );
        },
      },
      {
        id: "customer_name",
        label: "User",
        width: "160px",
      },
      {
        id: "astrologer_name",
        label: "Astrologer",
        width: "160px",
        render: (value: any) => value || "—",
      },
      {
        id: "rating",
        label: "Rating",
        width: "90px",
        render: (value: any) =>
          value != null ? `${value} ★` : "—",
      },
      {
        id: "feedback",
        label: "Feedback",
        width: "280px",
        render: (value: any) => {
          const text = typeof value === "string" ? value.trim() : "";
          if (!text) return "—";
          return text.length > 80 ? `${text.slice(0, 80)}…` : text;
        },
      },
      {
        id: "review_status",
        label: "Review Status",
        width: "140px",
        filterable: true,
        filterOptions: ["pending", "approved", "rejected"],
        defaultValue: "pending",
        render: (value: any) => {
          const status = String(value || "none").toLowerCase();
          const color =
            status === "approved"
              ? "success"
              : status === "pending"
                ? "warning"
                : status === "rejected"
                  ? "error"
                  : "default";
          return (
            <Chip
              size="small"
              label={status.toUpperCase()}
              color={color as "success" | "warning" | "error" | "default"}
              sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
            />
          );
        },
      },
      {
        id: "start_datetime",
        label: "Date",
        width: "160px",
        render: (value: any) => {
          if (!value) return "N/A";
          try {
            return new Date(value).toLocaleString();
          } catch {
            return String(value);
          }
        },
      },
    ],
    []
  );

  const initialFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    columns.forEach((col) => {
      if (col.filterable && col.defaultValue) {
        filters[col.id as string] = col.defaultValue;
      }
    });
    return filters;
  }, [columns]);

  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);

  const fetchReviews = async (
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
      Object.entries(currentFilters)
        .filter(([, v]) => v.trim() !== "")
        .forEach(([field, value]) => {
          params[field] = value.trim();
        });

      const response = await callAPI({
        endpoint: "/api/admin/consultation-reviews",
        method: "get",
        params,
      });
      const responseData = response?.data;
      if (!responseData) throw new Error("No data in response");

      setRows(Array.isArray(responseData.data) ? responseData.data : []);
      setTotalCount(
        typeof responseData.total === "number" ? responseData.total : 0
      );
    } catch {
      setError("Failed to load reviews. Please try again.");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    if (isInitialLoad) setIsInitialLoad(false);
  }, [isInitialLoad]);

  const handleFilterChange = useCallback(
    (newFilters: Record<string, string>) => {
      setFilters(newFilters);
      if (!isInitialLoad) setPage(0);
    },
    [isInitialLoad]
  );

  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <GenericTable<ReviewRow>
        title="Reviews"
        data={rows}
        columns={columns}
        totalCount={totalCount}
        onView={(row) => {
          if (row.source === "ask") {
            navigate(`/dashboard/ask-astrologer/view/${row.id}`);
            return;
          }
          navigate(`/dashboard/consultations/view/${row.id}`);
        }}
        getRowId={(row) => `${row.source || "consultation"}-${row.id}`}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={rowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setPage(0);
        }}
        onFilterChange={handleFilterChange}
        loading={loading}
        showActions={true}
      />
    </>
  );
};

export default Reviews;
