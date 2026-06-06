import React, { useState, useEffect } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
// import { Alert } from "@mui/material";
import { callAPI } from "../../../api/crudFactory";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../Elements/ConfirmModal";

interface FAQData {
  faq_id: number;
  question: string;
  answer: string;
  question_tamil: string;
  answer_tamil: string;
  question_telugu: string;
  answer_telugu: string;
  question_kannada: string;
  answer_kannada: string;
  question_malayalam: string;
  answer_malayalam: string;
  question_hindi: string;
  answer_hindi: string;
  question_marathi: string;
  answer_marathi: string;
  faq_status: string;
  created_at: string;
  updated_at: string;
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
      const transformedPlans = response?.data?.map((plan: any) => ({
        ...plan,
        tenure: `${plan.tenure_value} ${plan.tenure_count}`,
      }));

      setData(transformedPlans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  // const navigate = useNavigate();
  // const [data, setData] = useState<any[]>([]);
  // const [totalCount, setTotalCount] = useState<number>(0);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  // const [page, setPage] = useState<number>(0);
  // const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  // const [filters, setFilters] = useState<Record<string, string>>({});
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<FAQData | null>(null);

  // const fetchPlans = async (
  //   currentPage: number,
  //   currentFilters: Record<string, string>
  // ) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const params: Record<string, any> = {
  //       page: currentPage + 1,
  //       page_size: rowsPerPage,
  //     };

  //     const filterEntries = Object.entries(currentFilters).filter(
  //       ([_, v]) => v.trim() !== ""
  //     );
  //     filterEntries.forEach(([field, value]) => {
  //       console.log(field, value, "Plan Filters");
  //       params[field] = value.trim();
  //     });

  //     const endpoint = "/api/faq";
  //     const response = await callAPI({
  //       endpoint,
  //       method: "get",
  //       params,
  //     });
  //     console.log(response, "response")

  //     const responseData = response?.data;
  //     if (!responseData) {
  //       throw new Error("No data in response");
  //     }

  //     const fetchedPlans = Array.isArray(responseData.data)
  //       ? responseData.data.map((plan: any) => ({
  //           ...plan,
  //           tenure: `${plan.tenure_value} ${plan.tenure_count}`,
  //         }))
  //       : [];
  //     const fetchedTotal =
  //       typeof responseData.total === "number" ? responseData.total : 0;

  //     setData(fetchedPlans);
  //     setTotalCount(fetchedTotal);
  //   } catch (error) {
  //     console.error("Failed to fetch plans:", error);
  //     setError("Failed to load plans. Please try again.");
  //     setData([]);
  //     setTotalCount(0);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchFilterOptions = async (
  //   field: keyof FAQData,
  //   searchValue: string
  // ): Promise<string[]> => {
  //   if (!searchValue.trim()) {
  //     return [];
  //   }

  //   try {
  //     const uniqueValues = await fetchFilterValues(
  //       "faq",
  //       field as string,
  //       searchValue
  //     );
  //     return uniqueValues;
  //   } catch (error) {
  //     console.error(`Failed to fetch filter options for ${field}:`, error);
  //     return [];
  //   }
  // };

  // const fetchFilterValues = async (
  //   resource: string,
  //   field: string,
  //   searchValue: string
  // ): Promise<string[]> => {
  //   try {
  //     const response = await callAPI({
  //       endpoint: `/api/${resource}/filters`,
  //       method: "get",
  //       params: {
  //         field,
  //         search: searchValue,
  //       },
  //     });

  //     const responseData = response?.data;
  //     if (!responseData || !Array.isArray(responseData.values)) {
  //       throw new Error(`Invalid response for ${field} filter options`);
  //     }

  //     return responseData.values;
  //   } catch (error: any) {
  //     throw new Error(
  //       `Failed to fetch ${field} filter options: ${error.message}`
  //     );
  //   }
  // };

  // Fetch plans when page, rowsPerPage, or filters change
  // useEffect(() => {
  //   fetchPlans();
  // }, [page, rowsPerPage, filters]);

  const faqColumns: TableColumn<FAQData>[] = [
    { id: "question", label: "Question (English)", width: "250px" },
    { id: "answer", label: "Answer (English)", width: "300px" },
    { id: "question_tamil", label: "Question (Tamil)", width: "250px" },
    { id: "answer_tamil", label: "Answer (Tamil)", width: "300px" },
    { id: "question_telugu", label: "Question (Telugu)", width: "250px" },
    { id: "answer_telugu", label: "Answer (Telugu)", width: "300px" },
    { id: "question_kannada", label: "Question (Kannada)", width: "250px" },
    { id: "answer_kannada", label: "Answer (Kannada)", width: "300px" },
    { id: "question_malayalam", label: "Question (Malayalam)", width: "250px" },
    { id: "answer_malayalam", label: "Answer (Malayalam)", width: "300px" },
    { id: "question_hindi", label: "Question (Hindi)", width: "250px" },
    { id: "answer_hindi", label: "Answer (Hindi)", width: "300px" },
    { id: "question_marathi", label: "Question (Marathi)", width: "250px" },
    { id: "answer_marathi", label: "Answer (Marathi)", width: "300px" },
  ];

  const handleAdd = () => {
    navigate("/dashboard/faqs/new");
  };

  const handleEdit = (row: FAQData) => {
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

  // const handlePageChange = (newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleRowsPerPageChange = (newRowsPerPage: number) => {
  //   console.log(newRowsPerPage, "newRowsPerPage 123");
  //   setRowsPerPage(newRowsPerPage);
  //   setPage(0);
  // };

  // const handleFilterChange = (newFilters: Record<string, string>) => {
  //   setFilters(newFilters);
  //   setPage(0);
  // };

  return (
    <>
      {/* {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )} */}
      <GenericTable<FAQData>
        title="FAQ Management"
        data={data}
        columns={faqColumns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowId={(row) => row.faq_id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={10}
        // columns={faqColumns}
        // totalCount={totalCount}
        // onAdd={handleAdd}
        // onEdit={handleEdit}
        // onDelete={handleDelete}
        // getRowId={(row) => row.faq_id}
        // tableHeight="calc(100vh - 250px)"
        // initialRowsPerPage={rowsPerPage}
        // onPageChange={handlePageChange}
        // onRowsPerPageChange={handleRowsPerPageChange}
        // onFetchFilterOptions={fetchFilterOptions}
        // onFilterChange={handleFilterChange}
        // page={page}
        // rowsPerPage={rowsPerPage}
        // loading={loading}
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
