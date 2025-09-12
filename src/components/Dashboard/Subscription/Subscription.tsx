import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { Chip } from "@mui/material";
import { callAPI } from "../../../api/crudFactory";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../Elements/ConfirmModal";

interface PlanData {
  plan_id: number;
  plan_name: string;
  local_plan_price: string;
  foreign_plan_price: string;
  plan_services: string;
  status: string;
  os_type: string;
  tenure: string;
  tenure_value: string;
  tenure_count: string;
}

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PlanData | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await callAPI({
        endpoint: "/api/admin/service-catalogs",
        method: "get",
      });
      const transformedPlans = response?.data?.map((plan: any) => ({
        ...plan,
        tenure: `${plan.tenure_value} ${plan.tenure_count}`,
      }));

      setPlans(transformedPlans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const columns: TableColumn<PlanData>[] = [
    {
      id: "plan_name",
      label: "Name",
      width: "200px",
    },
    {
      id: "local_plan_price",
      label: "Local Price",
      width: "150px",
      render: (value: number) => {
        if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
        return `₹ ${value.toLocaleString("en-US")}`; // Format with commas (e.g., 1234567 -> 1,234,567)
      },
    },
    {
      id: "foreign_plan_price",
      label: "Foreign Price",
      width: "150px",
      render: (value: number) => {
        if (value == null || isNaN(value)) return "N/A"; // Handle null/undefined/NaN
        return `$ ${value.toLocaleString("en-US")}`; // Format with commas (e.g., 1234567 -> 1,234,567)
      },
    },
    {
      id: "os_type",
      label: "Device Type",
      width: "250px",
    },
    {
      id: "tenure",
      label: "Tenure",
      width: "180px",
    },
    {
      id: "status",
      label: "Status",
      render: (value:any) => {
        if (!value) return <Chip label="N/A" color="default" />;
        const formatted =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return (
          <Chip
            label={formatted}
            color={formatted === "Active" ? "success" : "default"}
          />
        );
      },
    },
  ];

  const handleAdd = () => {
    navigate("/dashboard/subscription/new");
  };

  // const handleView = (row: PlanData) => {
  //   navigate(`/dashboard/subscription/view/${row?.plan_id}`);
  // };

  const handleEdit = (row: PlanData) => {
    navigate(`/dashboard/subscription/edit/${row?.plan_id}`);
  };

  // const handleSelectionChange = (selectedIds: number[]) => {
  //   // Handle selected row IDs here
  // };

  const handleDelete = (row: PlanData) => {
    console.log(row, "row");
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    console.log(selectedRow?.plan_id, "selectedRow?.plan_id");
    try {
      await callAPI({
        endpoint: `/api/admin/service-catalogs/${selectedRow?.plan_id}`,
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
      <GenericTable<PlanData>
        title="Subscription Plans"
        data={plans}
        columns={columns}
        onAdd={handleAdd}
        // onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        // onSelectionChange={handleSelectionChange}
        getRowId={(row) => row.plan_id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={10}
      />

      {/* 💬 Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${selectedRow?.plan_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default Subscription;
