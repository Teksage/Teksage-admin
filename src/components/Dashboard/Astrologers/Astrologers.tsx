import React, {useEffect, useState} from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";

interface UserData {
  astrologer_id: number;
  consulting_fee: string;
  customer_rating: string;
  experience: number;
  first_name: string;
  status: string;
}

const Astrologers: React.FC = () => {
  const navigate = useNavigate();
  const [Astrologers, setAstrologers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await callAPI({
          endpoint: "api/admin/astrologers",
          method: "get",
        });
        console.log(response?.data?.astrologers, "response");
        setAstrologers(response?.data?.astrologers); // or response if your `callAPI` returns data directly
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns: TableColumn<UserData>[] = [
    {
      id: "first_name",
      label: "Name",
      filterable: true,
      // width: "300px",
    },
    {
      id: "experience",
      label: "Experience",
      filterable: true,
    },
    {
      id: "customer_rating",
      label: "Rating",
      filterable: true,
      // width: "250px",
    },
    {
      id: "consulting_fee",
      label: "Consultation Fee",
      filterable: true,
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (value) => {
        // Handle null/undefined cases safely
        if (!value) {
          return <Chip label="N/A" color="default" />;
        }
    
        const formattedValue = 
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    
        return (
          <Chip 
            label={formattedValue} 
            color={formattedValue === 'Active' ? 'success' : 'default'} 
          />
        );
      },
      filterable: true,
    },
  ];

  const handleAdd = () => {
    navigate("/dashboard/astrologers/new");
  };

  const handleStatus = () => {
    // Handle Status
  };

  const handleView = (row: UserData) => {
    navigate(`/dashboard/astrologers/view/${row?.astrologer_id}`);
  };

  const handleEdit = (row: UserData) => {
    navigate(`/dashboard/astrologers/edit/${row?.astrologer_id}`);
  };

  const handleDelete = (row: UserData) => {
    // navigate(`/dashboard/users/edit/${row?.id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // console.log('Selected:', selectedIds);
  };

  return (
    <GenericTable<UserData>
      title="Astrologer Management"
      data={Astrologers}
      columns={columns}
      onAdd={handleAdd}
      onStatus={handleStatus}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.astrologer_id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Astrologers;
