import React from 'react';
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  name: string;
  email: string;
  user_type: string;
  status: string;
  rasi: string;
  nakshatram: string;
  plan: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  
  const columns: TableColumn<UserData>[] = [
    { 
      id: 'name', 
      label: 'Name', 
      filterable: true,
      width: '200px' 
    },
    { 
      id: 'email', 
      label: 'Email',
      width: '250px' 
    },
    { 
      id: 'user_type', 
      label: 'User Type', 
      filterable: true
    },
    { 
      id: 'status', 
      label: 'Status',
      // filterable: true,
      render: (value) => (
        <Chip 
          label={value} 
          color={value === 'Active' ? 'success' : 'default'} 
        />
      )
    },
    { 
      id: 'rasi', 
      label: 'Rasi', 
      filterable: true
    },
    { 
      id: 'nakshatram', 
      label: 'Nakshatram', 
      filterable: true
    },
    { 
      id: 'plan', 
      label: 'Plan', 
      filterable: true
    }
  ];

  const userData: UserData[] = [
    {
      id: 1,
      name: "Rahul",
      email: "rahul@test.in",
      user_type: "Admin",
      status: "Active",
      rasi: "Thulam",
      nakshatram: "Rohini",
      plan: "Premium"
      // lastLogin: new Date("2024-01-01"),
    },
    {
      id: 2,
      name: "Sivakami",
      email: "sivakami@test.in",
      user_type: "User",
      status: "Active",
      rasi: "Mesham",
      nakshatram: "Hasta",
      plan: "Basic"
    },
    {
      id: 3,
      name: "Sheik",
      email: "sheik@test.in",
      user_type: "Astrologer",
      status: "Inactive",
      rasi: "Rishabam",
      nakshatram: "Chitra",
      plan: "Pro"
    },
    {
      id: 4,
      name: "Vasanth",
      email: "vasanth@test.in",
      user_type: "User",
      status: "Inactive",
      rasi: "Kanni",
      nakshatram: "Swati",
      plan: "Free"
    },
  ];

  const handleAdd = () => {
    navigate('/dashboard/users/new');
  };
  
  const handleStatus = () => {
    // Handle Status
  };

  const handleView = (row: UserData) => {
    navigate(`/dashboard/users/view/${row?.id}`);
  };

  const handleEdit = (row: UserData) => {
    navigate(`/dashboard/users/edit/${row?.id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // console.log('Selected:', selectedIds);
  };

  return (
    <GenericTable<UserData>
      title="Users Management"
      data={userData}
      columns={columns}
      onAdd={handleAdd}
      onStatus={handleStatus}
      onView={handleView}
      onEdit={handleEdit}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Users;