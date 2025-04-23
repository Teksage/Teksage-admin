import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip } from "@mui/material";
import { callAPI } from "../../../api/crudFactory";
import { useNavigate } from "react-router-dom";

interface PlanData {
  id: number;
  plan_name: string;
  plan_price: string;
  services: string;
  status: string;
  service_type: string;
  tenure: string;
  duration_value: string;
  duration_unit: string;
}

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanData[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await callAPI({
          endpoint: "/api/admin/plans",
          method: "get",
        });
        console.log(response, "Plans Response");
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const columns: TableColumn<PlanData>[] = [
    {
      id: "plan_name",
      label: "Name",
      width: "200px",
    },
    {
      id: "plan_price",
      label: "Price",
      width: "150px",
    },
    {
      id: "service_type",
      label: "Services Type",
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
      render: (value) => {
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

  const samplePlans: PlanData[] = [
    {
      id: 1,
      plan_name: "Basic Monthly",
      plan_price: "₹199",
      services: "Chat only",
      status: "active",
      service_type: "Chat Consultation",
      tenure: "1 Month",
      duration_value: "1",
      duration_unit: "month",
    },
    {
      id: 2,
      plan_name: "Premium Yearly",
      plan_price: "₹1999",
      services: "Chat + Call + Report",
      status: "inactive",
      service_type: "Full Access",
      tenure: "12 Months",
      duration_value: "12",
      duration_unit: "month",
    },
    {
      id: 3,
      plan_name: "Trial Pack",
      plan_price: "Free",
      services: "Chat (limited)",
      status: "active",
      service_type: "Chat Consultation",
      tenure: "7 Days",
      duration_value: "7",
      duration_unit: "day",
    },
  ];  

  const handleAdd = () => {
    navigate('/dashboard/subscription/new');
  };

  const handleView = (row: PlanData) => {
    navigate(`/dashboard/subscription/view/${row?.id}`);
  };

  const handleEdit = (row: PlanData) => {
    navigate(`/dashboard/subscription/edit/${row?.id}`);
  };

  const handleDelete = (row: PlanData) => {
    // navigate(`/dashboard/users/edit/${row?.id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // Handle selected row IDs here
  };

  return (
    <GenericTable<PlanData>
      title="Subscription Plans"
      data={samplePlans}
      columns={columns}
      onAdd={handleAdd}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Subscription;
