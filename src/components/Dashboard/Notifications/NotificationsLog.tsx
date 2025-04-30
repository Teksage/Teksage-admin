import React, { useEffect, useState, useMemo } from "react";
import GenericTable, { TableColumn } from "../../Elements/Table";
import { Alert } from "@mui/material";

interface NotificationLogData {
  id: number;
  title: string;
  recipient_type: string;
  recipient_count: number;
  sender_email: string;
  sent_by_time: string; // ISO date string
}

interface FilterOptions {
  recipient_type: string[];
  sender_email: string[];
  sent_by_time: string[];
}

const NotificationLog: React.FC = () => {
  const [notificationLogs, setNotificationLogs] = useState<NotificationLogData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    recipient_type: [],
    sender_email: [],
    sent_by_time: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Sample data for testing
  const sampleData: NotificationLogData[] = [
    {
      id: 1,
      title: "Weekly Horoscope Update",
      recipient_type: "All Users",
      recipient_count: 1500,
      sender_email: "astrology@service.com",
      sent_by_time: "2025-04-28T10:30:00Z",
    },
    {
      id: 2,
      title: "New Moon Reminder",
      recipient_type: "Premium Users",
      recipient_count: 300,
      sender_email: "notifications@service.com",
      sent_by_time: "2025-04-27T15:45:00Z",
    },
    {
      id: 3,
      title: "Astrology Event Invite",
      recipient_type: "All Users",
      recipient_count: 2000,
      sender_email: "astrology@service.com",
      sent_by_time: "2025-04-26T09:00:00Z",
    },
    {
      id: 4,
      title: "Daily Horoscope",
      recipient_type: "Free Users",
      recipient_count: 800,
      sender_email: "daily@service.com",
      sent_by_time: "2025-04-29T08:00:00Z",
    },
    {
      id: 5,
      title: "Special Offer Alert",
      recipient_type: "Premium Users",
      recipient_count: 250,
      sender_email: "notifications@service.com",
      sent_by_time: "2025-04-25T14:20:00Z",
    },
  ];

  const fetchNotificationLogs = async (currentPage: number, currentFilters: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call with sample data
      let filteredData = sampleData;

      // Apply filters
      if (currentFilters.recipient_type) {
        filteredData = filteredData.filter(
          (log) => log.recipient_type === currentFilters.recipient_type
        );
      }
      if (currentFilters.sender_email) {
        filteredData = filteredData.filter(
          (log) => log.sender_email === currentFilters.sender_email
        );
      }
      if (currentFilters.sent_by_time) {
        filteredData = filteredData.filter(
          (log) =>
            new Date(log.sent_by_time).toISOString().split("T")[0] ===
            currentFilters.sent_by_time
        );
      }

      const start = currentPage * rowsPerPage;
      const paginatedData = filteredData.slice(start, start + rowsPerPage);

      setNotificationLogs(paginatedData);
      setTotalCount(filteredData.length);

      // Reset page if out of range
      if (currentPage * rowsPerPage >= filteredData.length && filteredData.length > 0) {
        setPage(0);
      }
    } catch (error) {
      console.error("Failed to fetch notification logs:", error);
      setError("Failed to load notification logs. Please try again.");
      setNotificationLogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      // Use sample data to derive filter options
      const options: FilterOptions = {
        recipient_type: [
          ...new Set(sampleData.map((log) => log.recipient_type).filter(Boolean)),
        ].sort(),
        sender_email: [
          ...new Set(sampleData.map((log) => log.sender_email).filter(Boolean)),
        ].sort(),
        sent_by_time: [
          ...new Set(
            sampleData
              .map((log) => new Date(log.sent_by_time).toISOString().split("T")[0])
              .filter(Boolean)
          ),
        ].sort(),
      };

      setFilterOptions(options);
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
      setError("Failed to load filter options. Please try again.");
    }
  };

  useEffect(() => {
    fetchNotificationLogs(page, filters);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

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
        filterOptions: filterOptions.recipient_type,
      },
      {
        id: "recipient_count",
        label: "Recipient Count",
        width: "150px",
      },
      {
        id: "sender_email",
        label: "Sender Email",
        width: "200px",
        filterable: true,
        filterOptions: filterOptions.sender_email,
      },
      {
        id: "sent_by_time",
        label: "Sent by Time",
        width: "200px",
        filterable: true,
        filterType: "date", // Specify as date type for GenericTable
        filterOptions: filterOptions.sent_by_time,
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
    ],
    [filterOptions]
  );

  const handleSelectionChange = (selectedIds: number[]) => {
    console.log("Selected:", selectedIds);
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
        onSelectionChange={handleSelectionChange}
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
        showActions={false}
        loading={loading}
      />
    </>
  );
};

export default NotificationLog;