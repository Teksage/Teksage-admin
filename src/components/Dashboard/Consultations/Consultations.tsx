import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { callAPI } from "../../../api/crudFactory";
import { Chip, Link } from "@mui/material";
import { format } from "date-fns";

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
    { id: "astrologer_name", label: "Astrologer", width: "180px", filterable: true },
    // {
    //   id: "user_horoscope",
    //   label: "Horoscope",
    //   render: (value) => (
    //     <Link href={value} target="_blank" rel="noopener">
    //       View
    //     </Link>
    //   ),
    // },
    { id: "category", label: "Category", filterable: true, width: "140px" },
    // {
    //   id: "languages",
    //   label: "Languages",
    //   render: (value) =>
    //     value?.length
    //       ? value.map((lang: string, idx: number) => (
    //           <Chip key={idx} label={lang} size="small" sx={{ mr: 0.5 }} />
    //         ))
    //       : "N/A",
    // },
    {
      id: "consultation_fee",
      label: "Consultation Fee",
      render: (value) => `₹${value}`,
      filterable: true
    },
    {
      id: "booking_date",
      label: "Consultation Date",
      render: (value) => format(new Date(value), "dd MMM yyyy"),
      filterable: true
    },
    // { id: "start_time", label: "Start Time", width: "120px" },
    // { id: "end_time", label: "End Time", width: "120px" },
    // {
    //   id: "rating",
    //   label: "Rating",
    //   render: (value) => `${value} ★`,
    // },
    // {
    //   id: "astrologer_share",
    //   label: "Astrologer Share",
    //   render: (value) => `₹${value}`,
    // },
    // {
    //   id: "astroprompt_share",
    //   label: "Astroprompt Share",
    //   render: (value) => `₹${value}`,
    // },
    {
      id: "status",
      label: "Status",
      render: (value) => (
        <Chip
          label={value}
          color={value === "Completed" ? "success" : value === "Pending" ? "warning" : "default"}
        />
      ),
      filterable: true
    },
    // { id: "consultation_duration", label: "Duration", width: "140px" },
    // {
    //   id: "question",
    //   label: "Question",
    //   width: "200px",
    //   render: (value) => value || "—",
    // },
    // {
    //   id: "answer",
    //   label: "Answer",
    //   width: "200px",
    //   render: (value) => value || "—",
    // },
  ];

  const handleSelectionChange = (selectedIds: number[]) => {
    // Optional: Handle row selection
  };

  return (
    <GenericTable<ConsultationData>
      title="Consultations"
      data={consultations}
      columns={columns}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
      showActions={false}
    />
  );
};

export default Consultations;
