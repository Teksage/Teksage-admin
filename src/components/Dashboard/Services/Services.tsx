import React, { useState } from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Switch, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ServiceData {
  id: number;
  name: string;
  description: string;
  pushNotificationTrigger: boolean;
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<ServiceData[]>([
    { id: 1, name: "Consultation", description: "Expert advice", pushNotificationTrigger: true },
    { id: 2, name: "Tarot Reading", description: "Card-based predictions", pushNotificationTrigger: false },
    { id: 3, name: "Palmistry", description: "Reading of palm lines", pushNotificationTrigger: true },
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
    { id: "name", label: "Name", filterable: true, width: "200px" },
    { id: "description", label: "Description", width: "300px" },
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
  ];

  const handleAdd = () => navigate("/dashboard/services/new");
  const handleEdit = (row: ServiceData) => navigate(`/dashboard/services/edit/${row.id}`);

  return (
    <GenericTable<ServiceData>
      title="Service Management"
      data={serviceData}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Services;
