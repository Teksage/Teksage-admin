import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { callAPI } from "../../../api/crudFactory";
import { Chip, Link } from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ConsultationData {
  id: number;
  first_name: string;
  astrologer_name: string;
  user_horoscope: string; // URL
  category: string;
  languages: string[];
  booking_date: string;
  start_time: string;
  end_time: string;
  consultation_fee: number;
  rating: number;
  astrologer_share: number;
  astroprompt_share: number;
  status: string;
  consultation_duration: string;
  question: string;
  answer: string;
}

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await callAPI({
          endpoint: "/api/admin/consultations", // 🔁 Update this if your actual API path is different
          method: "get",
        });
        console.log("Consultations Response", response);
        setConsultations(response.data);
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
      }
    };

    fetchConsultations();
  }, []);

  const columns: TableColumn<ConsultationData>[] = [
    { id: "first_name", label: "User", width: "160px", filterable: true },
    {
      id: "astrologer_name",
      label: "Astrologer",
      width: "180px",
      filterable: true,
    },
    { id: "category", label: "Category", filterable: true, width: "140px" },
    {
      id: "consultation_fee",
      label: "Consultation Fee",
      render: (value) => `₹${value}`,
      filterable: true,
    },
    {
      id: "booking_date",
      label: "Consultation Date",
      render: (value) => format(new Date(value), "dd MMM yyyy"),
      filterable: true,
    },
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

  const sampleConsultations: ConsultationData[] = [
    {
      id: 1,
      first_name: "Rahul Sharma",
      astrologer_name: "Astro Meera",
      user_horoscope: "https://example.com/horo1.pdf",
      category: "Career Guidance",
      languages: ["English", "Tamil"],
      booking_date: "2025-04-20",
      start_time: "14:00",
      end_time: "14:30",
      consultation_fee: 750,
      rating: 4.5,
      astrologer_share: 525,
      astroprompt_share: 225,
      status: "Completed",
      consultation_duration: "30 mins",
      question: "Will I get a job abroad?",
      answer: "Yes, there are chances after June 2025 based on your planetary positions.",
    },
    {
      id: 2,
      first_name: "Priya Kannan",
      astrologer_name: "Astro Surya",
      user_horoscope: "https://example.com/horo2.pdf",
      category: "Marriage",
      languages: ["Hindi", "English"],
      booking_date: "2025-04-21",
      start_time: "16:00",
      end_time: "16:15",
      consultation_fee: 500,
      rating: 3.8,
      astrologer_share: 350,
      astroprompt_share: 150,
      status: "Pending",
      consultation_duration: "15 mins",
      question: "Will I get married this year?",
      answer: "",
    },
    {
      id: 3,
      first_name: "Vikram Raj",
      astrologer_name: "Astro Lakshmi",
      user_horoscope: "https://example.com/horo3.pdf",
      category: "Health",
      languages: ["Kannada"],
      booking_date: "2025-04-19",
      start_time: "10:00",
      end_time: "10:45",
      consultation_fee: 1000,
      rating: 4.9,
      astrologer_share: 700,
      astroprompt_share: 300,
      status: "Completed",
      consultation_duration: "45 mins",
      question: "Any serious health concerns in my chart?",
      answer: "Avoid stress and take regular health checkups, especially around November.",
    },
  ];
  

  const handleView = (row: UserData) => {
    navigate(`/dashboard/consultations/view/${row?.astrologer_id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // Optional: Handle row selection
  };

  return (
    <GenericTable<ConsultationData>
      title="Consultations"
      data={sampleConsultations}
      columns={columns}
      onView={handleView}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
      showActions={false}
    />
  );
};

export default Consultations;
