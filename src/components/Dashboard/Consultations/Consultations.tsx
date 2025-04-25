import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { callAPI } from "../../../api/crudFactory";
import { Chip, Link } from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ConsultationData {
  id: number;
  astrologer_name: string;
  category: string;
  // booking_date: string;
  start_time: string;
  // consultation_fee: number;
  status: string;
}

// "id": 2,
// "astrologer_name": "First name",
// "category": null,
// "customer_name": "Astrolger" -->
// "start_time": "2025-05-15T09:00:00", -->
// "status": "new",

// astrologer_name
// category
// consultation_fee
// booking_date
// status

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await callAPI({
          endpoint: "/api/admin/consultations",
          method: "get",
        });
        console.log(response?.data?.data);
        setConsultations(response.data?.data);
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
      }
    };
    fetchConsultations();
  }, []);

  const columns: TableColumn<ConsultationData>[] = [
    // { id: "first_name", label: "User", width: "160px", filterable: true },
    {
      id: "astrologer_name",
      label: "Astrologer",
      width: "180px",
      filterable: true,
    },
    { id: "category", label: "Category", filterable: true, width: "140px" },
    // {
    //   id: "consultation_fee",
    //   label: "Consultation Fee",
    //   render: (value) => `₹${value}`,
    //   filterable: true,
    // },
    // {
    //   id: "booking_date",
    //   label: "Consultation Date",
    //   render: (value) => format(new Date(value), "MM/dd/yyyy"), 
    //   filterable: true,
    // },
    {
      id: "status",
      label: "Status",
      render: (value) => (
        <Chip
          label={value}
          color={
            value === "Completed"
              ? "success"
              : value === "Pending"
              ? "warning"
              : "default"
          }
        />
      ),
      filterable: true,
    },
  ];

  const handleView = (row: ConsultationData) => {
    navigate(`/dashboard/consultations/view/${row?.id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // Optional: Handle row selection
  };

  return (
    <GenericTable<ConsultationData>
      title="Consultations"
      data={consultations}
      columns={columns}
      onView={handleView}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
      showActions={true}
    />
  );
};

export default Consultations;
