import React, {useEffect, useState} from 'react';
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { callAPI } from '../../../api/crudFactory';

interface UserData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  status: string;
  user_typeplan_names: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await callAPI({
          endpoint: "api/admin/users",
          method: "get",
        });
        console.log(response?.data?.data, "response")
        setUsers(response?.data?.data); // or response if your `callAPI` returns data directly
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);
  
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
      filterable: true,
      width: '250px' 
    },
    { 
      id: 'mobile_number', 
      label: 'Mobile Number',
      filterable: true,
      width: '250px' 
    },
    { 
      id: 'user_typeplan_names', 
      label: 'Subscription', 
      filterable: true
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

  const handleDelete = (row: UserData) => {
    // navigate(`/dashboard/users/edit/${row?.id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // console.log('Selected:', selectedIds);
  };

  return (
    <GenericTable<UserData>
      title="Users Management"
      data={users}
      columns={columns}
      onAdd={handleAdd}
      onStatus={handleStatus}
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

export default Users;