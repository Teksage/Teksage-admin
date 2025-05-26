import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { Alert } from "@mui/material";
import { callAPI, fetchFilterValues } from "../../../api/crudFactory";
import NotificationLogViewModal from "./NotificationLogViewModal";
import { transformDateKeys } from "../../Elements/CommonFunctions";

interface NotificationLogData {
  id: number;
  title: string;
  body: string;
  recipient_type: string;
  sender_id: number;
  sent_at: string;
  email: string;
  recipient_count: number;
}

const NotificationLog: React.FC = () => {
  const [notificationLogs, setNotificationLogs] = useState<
    NotificationLogData[]
  >([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<NotificationLogData | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);

  console.log(filters, "filters in NotificationLog");

  const fetchNotificationLogs = async (
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
        if (field === "sent_at") {
          params["sent_at"] = value; // Send date as-is (ISO format)
        } else {
          params[field] = value.trim();
        }
      });

      const endpoint = "api/admin/notifications/logs";
      const response = await callAPI({
        endpoint,
        method: "get",
        params,
      });

      const responseData = response?.data;
      if (!responseData) {
        throw new Error("No data in response");
      }

      const fetchedLogs = Array.isArray(responseData.data)
        ? responseData.data
        : [];
      const fetchedTotal =
        typeof responseData.total === "number" ? responseData.total : 0;

      setNotificationLogs(fetchedLogs);
      setTotalCount(fetchedTotal);
    } catch (error) {
      console.error("Failed to fetch notification logs:", error);
      setError("Failed to load notification logs. Please try again.");
      setNotificationLogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async (
    field: keyof NotificationLogData,
    searchValue: string
  ) => {
    if (!searchValue.trim()) {
      return [];
    }

    try {
      const uniqueValues = await fetchFilterValues(
        "notifications/logs",
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
    fetchNotificationLogs(page, filters);
  }, [page, rowsPerPage, filters]);

  const columns: TableColumn<NotificationLogData>[] = useMemo(
    () => [
      {
        id: "title",
        label: "Title",
        width: "200px",
      },
      {
        id: "recipient_type",
        label: "Recipient Type",
        width: "150px",
        filterable: true,
        filterOptions: ["All", "Custom", "Nakshatra", "Rashi"],
      },
      {
        id: "recipient_count",
        label: "Recipient Count",
        width: "300px",
      },
      {
        id: "email",
        label: "Email",
        filterable: true,
        width: "300px",
      },
      {
        id: "sent_at",
        label: "Sent At",
        width: "200px",
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
    ],
    []
  );

  const handleView = (row: NotificationLogData) => {
    setSelectedLog(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLog(null);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <GenericTable<NotificationLogData>
        title="Notification Logs"
        data={notificationLogs}
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
          setFilters(transformDateKeys(newFilters));
          setPage(0);
        }}
        onFetchFilterOptions={fetchFilterOptions}
        showActions={true}
        loading={loading}
      />
      {/* Render the modal */}
      <NotificationLogViewModal
        open={openModal}
        onClose={handleCloseModal}
        log={selectedLog}
      />
    </>
  );
};

export default NotificationLog;
