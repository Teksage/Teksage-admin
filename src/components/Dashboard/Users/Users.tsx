import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: Date;
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
      id: 'role', 
      label: 'Role', 
      filterable: true,
      filterOptions: ['Admin', 'User', 'Manager'] 
    },
    { 
      id: 'status', 
      label: 'Status',
      filterable: true,
      filterOptions: ['Active', 'Inactive'],
      render: (value) => (
        <Chip 
          label={value} 
          color={value === 'Active' ? 'success' : 'default'} 
        />
      )
    },
    {
      id: 'lastLogin',
      label: 'Last Login',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Sample data
const userData: UserData[] = [
  {
    id: 1,
    name: "Rahul",
    email: "rahul@test.in",
    role: "Admin",
    status: "Active",
    lastLogin: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Anand",
    email: "anand@test.in",
    role: "User",
    status: "Active",
    lastLogin: new Date("2024-01-15"),
  },
  {
    id: 3,
    name: "Sheik",
    email: "sheik@test.in",
    role: "Manager",
    status: "Inactive",
    lastLogin: new Date("2024-01-20"),
  },
  // Add more sample data as needed
];

  const handleAdd = () => {
    navigate('/users/add')
  };
  
  const handleStatus = () => {
    // Handle Status
  }

  const handleView = (row: UserData) => {
    // Handle view
  };

  const handleEdit = (row: UserData) => {
    // Handle edit
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
      // sx={{ 
      //   maxWidth: '1600px', // Override default max-width
      //   margin: '0 auto'
      // }}
    />
  );
};

export default Users;