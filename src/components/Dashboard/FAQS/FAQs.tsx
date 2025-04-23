import React from 'react';
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";

interface FAQData {
  id: number;
  question: string;
  answer: string;
  status: string;
}

const FAQs: React.FC = () => {
  const navigate = useNavigate();

  const faqColumns: TableColumn<FAQData>[] = [
    { id: 'question', label: 'Query', width: '300px' },
    { id: 'answer', label: 'Answer', width: '350px' },
    { 
      id: 'status', 
      label: 'Status',
      render: (value) => (
        <Chip label={value} color={value === 'Active' ? 'success' : 'default'} />
      )
    }
  ];

  const faqData: FAQData[] = [
    {
      id: 1,
      question: "How do I book a session with an astrologer?",
      answer: "You can book a session through our website or mobile app under the 'Book Now' section.",
      status: "Active"
    },
    {
      id: 2,
      question: "What are the benefits of a Premium plan?",
      answer: "The Premium plan gives you priority bookings, exclusive reports, and direct consultations.",
      status: "Active"
    }
  ];

  const handleAddFAQ = () => {
    navigate('/dashboard/faqs/new');
  };

  const handleEditFAQ = (row: FAQData) => {
    navigate(`/dashboard/faqs/edit/${row?.id}`);
  };

  const handleDelete = (row: FAQData) => {
    // navigate(`/dashboard/users/edit/${row?.id}`);
  };

  return (
    <GenericTable<FAQData>
      title="FAQ Management"
      data={faqData}
      columns={faqColumns}
      onAdd={handleAddFAQ}
      onEdit={handleEditFAQ}
      onDelete={handleDelete}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default FAQs;
