import React, { useState, useEffect } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { callAPI } from "../../../api/crudFactory";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../Elements/ConfirmModal";

interface FAQData {
  faq_id: number;
  question: string;
  answer: string;
}

const FAQs: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<FAQData[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FAQData | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await callAPI({
        endpoint: "/api/faq",
        method: "get",
      });
      console.log(response, "Plans Response");
      const transformedPlans = response?.data?.map((plan: any) => ({
        ...plan,
        tenure: `${plan.tenure_value} ${plan.tenure_count}`,
      }));

      setData(transformedPlans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const faqColumns: TableColumn<FAQData>[] = [
    { id: "question", label: "Query", width: "300px" },
    { id: "answer", label: "Answer", width: "350px" }
  ];

  const handleAddFAQ = () => {
    navigate("/dashboard/faqs/new");
  };

  const handleEditFAQ = (row: FAQData) => {
    navigate(`/dashboard/faqs/edit/${row?.faq_id}`);
  };

  const handleDelete = (row: FAQData) => {
    console.log(row, "row");
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    console.log(selectedRow?.faq_id, "selectedRow?.id");
    try {
      await callAPI({
        endpoint: `/api/faq/${selectedRow?.faq_id}`,
        method: "delete",
      });
      setDeleteModalOpen(false);
      setSelectedRow(null);
      fetchPlans();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <>
      <GenericTable<FAQData>
        title="FAQ Management"
        data={data}
        columns={faqColumns}
        onAdd={handleAddFAQ}
        onEdit={handleEditFAQ}
        onDelete={handleDelete}
        getRowId={(row) => row.faq_id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={10}
      />

      {/* 💬 Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${selectedRow?.question}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default FAQs;
