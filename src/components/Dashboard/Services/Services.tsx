import React, { useState, useEffect } from "react";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import { callAPI } from "../../../api/crudFactory";

interface ServiceData {
  id: number;
  name: string;
  push_notification_status: boolean;
  status: string;
  service_user_count: string;
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await callAPI({
          endpoint: "/api/admin/services",
          method: "get",
        });
        setServices(response?.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    fetchPlans();
  }, []);

  // const handleToggle = (id: number) => {
  //   setServiceData((prev) =>
  //     prev.map((service) =>
  //       service.id === id
  //         ? {
  //             ...service,
  //             pushNotificationTrigger: !service.pushNotificationTrigger,
  //           }
  //         : service
  //     )
  //   );
  // };

  const columns: TableColumn<ServiceData>[] = [
    { id: "name", label: "Name", width: "200px" },
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
    {
      id: "push_notification_status",
      label: "Push Notification",
      render: (value:any) => (
        <Switch
          checked={value}
          // disabled
          // onChange={() => handleToggle(row.id)}
          color="primary"
        />
      ),
    },
    { id: "service_user_count", label: "Usage", width: "200px" },
  ];

  // const handleAdd = () => navigate("/dashboard/services/new");
  const handleEdit = (row: ServiceData) =>
    navigate(`/dashboard/services/edit/${row.id}`);

  // const handleDelete = (row: ServiceData) => {
  //   // navigate(`/dashboard/users/edit/${row?.id}`);
  // };

  return (
    <GenericTable<ServiceData>
      title="Service Management"
      data={services}
      columns={columns}
      // onAdd={handleAdd}
      onEdit={handleEdit}
      // onDelete={handleDelete}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Services;
