import React, {useEffect, useState} from 'react';
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { callAPI } from '../../../api/crudFactory';

interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  user_type: string;
  status: string;
  rasi: string;
  nakshatram: string;
  plan: string;
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
        console.log(response, "response")
        setUsers(response.data); // or response if your `callAPI` returns data directly
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);
  
  const columns: TableColumn<UserData>[] = [
    { 
      id: 'first_name', 
      label: 'First Name', 
      filterable: true,
      width: '200px' 
    },
    // { 
    //   id: 'last_name', 
    //   label: 'Last Name', 
    //   filterable: true,
    //   width: '200px' 
    // },
    { 
      id: 'email', 
      label: 'Email',
      width: '250px' 
    },
    { 
      id: 'mobile_number', 
      label: 'Mobile Number',
      width: '250px' 
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
      }
    },
    // { 
    //   id: 'rasi', 
    //   label: 'Rasi', 
    //   filterable: true
    // },
    // { 
    //   id: 'nakshatram', 
    //   label: 'Nakshatram', 
    //   filterable: true
    // },
    // { 
    //   id: 'plan', 
    //   label: 'Plan', 
    //   filterable: true
    // }
  ];

  const handleAdd = () => {
    navigate('/dashboard/users/new');
  };
  
  const handleStatus = () => {
    // Handle Status
  };

  const handleView = (row: UserData) => {
    navigate(`/dashboard/users/view/${row?.user_id}`);
  };

  const handleEdit = (row: UserData) => {
    navigate(`/dashboard/users/edit/${row?.user_id}`);
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
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.user_id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Users;