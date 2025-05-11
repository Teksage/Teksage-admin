import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { callAPI } from "../../../api/crudFactory";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../Elements/ConfirmModal";

interface CouponData {
  coupon_id: number;
  coupon_name: string;
  coupon_percentage: number;
  max_cap: number;
  start_date: string;
  end_date: string;
  plan_name: string;
}

const Coupons: React.FC = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CouponData | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await callAPI({
        endpoint: "/api/admin/coupons",
        method: "get",
      });
      setCoupons(response.data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    }
  };

  const columns: TableColumn<CouponData>[] = [
    { id: "coupon_name", label: "Name", width: "200px" },
    {
      id: "coupon_percentage",
      label: "Coupon (%)",
      width: "150px",
      render: (value:any) => `${value}%`,
    },
    {
      id: "max_cap",
      label: "Max Limit",
      width: "150px",
      render: (value: number) => {
        if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
        return `₹ ${value.toLocaleString("en-US")}`; // Format with commas (e.g., 1234567 -> 1,234,567)
      },
    },
    {
      id: "start_date",
      label: "Valid From",
      width: "180px",
      render: (value:any) => format(new Date(value), "dd MMM yyyy"),
    },
    {
      id: "end_date",
      label: "Valid Till",
      width: "180px",
      render: (value:any) => format(new Date(value), "dd MMM yyyy"),
    },
    { id: "plan_name", label: "Linked Plan", width: "200px" },
  ];

  const handleAdd = () => navigate("/dashboard/coupons/new");
  // const handleView = (row: CouponData) =>
  //   navigate(`/dashboard/coupons/view/${row.coupon_id}`);
  const handleEdit = (row: CouponData) =>
    navigate(`/dashboard/coupons/edit/${row.coupon_id}`);

  const handleDelete = (row: CouponData) => {
    console.log(row, "row")
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await callAPI({
        endpoint: `/api/admin/coupons/${selectedRow?.coupon_id}`,
        method: "delete",
      });
      setDeleteModalOpen(false);
      setSelectedRow(null);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  // const handleSelectionChange = (selectedIds: number[]) => {};

  return (
    <>
      <GenericTable<CouponData>
        title="Coupons Management"
        data={coupons}
        columns={columns}
        onAdd={handleAdd}
        // onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        // onSelectionChange={handleSelectionChange}
        getRowId={(row) => row.coupon_id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={10}
      />

      {/* 💬 Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${selectedRow?.coupon_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default Coupons;
