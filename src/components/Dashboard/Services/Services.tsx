import React, { useState } from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";

interface ServiceData {
  id: number;
  name: string;
  status: string;
  pushNotificationTrigger: boolean;
  usage_count: string;
  plan_name: string; 
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<ServiceData[]>([
    { id: 1, name: "Consultation", status: "Active", pushNotificationTrigger: true, usage_count: "2", plan_name: "" },
    { id: 2, name: "Tarot Reading", status: "Active", pushNotificationTrigger: false, usage_count: "3", plan_name: "" },
    { id: 3, name: "Palmistry", status: "Active", pushNotificationTrigger: true, usage_count: "5", plan_name: "" },
  ]);

  const handleToggle = (id: number) => {
    setServiceData((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, pushNotificationTrigger: !service.pushNotificationTrigger }
          : service
      )
    );
  };

  const columns: TableColumn<ServiceData>[] = [
    { id: "name", label: "Name", width: "200px" },
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
    {
      id: "pushNotificationTrigger",
      label: "Push Notification",
      render: (value, row) => (
        <Switch
          checked={value}
          onChange={() => handleToggle(row.id)}
          color="primary"
        />
      ),
    },
    { id: "usage_count", label: "Usage", width: "200px" },
    { id: "plan_name", label: "Plan Name", width: "200px" },
  ];

  const handleAdd = () => navigate("/dashboard/services/new");
  const handleEdit = (row: ServiceData) => navigate(`/dashboard/services/edit/${row.id}`);
  const handleDelete = (row: ServiceData) => {
    // navigate(`/dashboard/users/edit/${row?.id}`);
  };

  return (
    <GenericTable<ServiceData>
      title="Service Management"
      data={serviceData}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Services;
