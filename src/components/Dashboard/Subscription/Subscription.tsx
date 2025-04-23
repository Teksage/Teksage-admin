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

const Plans: React.FC = () => {
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

  const handleAdd = () => {
    navigate('/dashboard/users/new');
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
      data={plans}
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

export default Plans;
