import React from 'react';
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip, Avatar } from '@mui/material';
import { useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  name: string;
  languageSkills: string;
  areasOfExpertise: string;
  yearsOfExperience: number;
  profilePicture: string;
  email: string;
  mobile: string;
  status: string;
  plan: string;
}

const Astrologers: React.FC = () => {
  const navigate = useNavigate();
  
  const columns: TableColumn<UserData>[] = [
    { 
      id: 'profilePicture', 
      label: 'Profile', 
      width: '100px',
      render: (value) => (
        <Avatar src={value} alt="Profile" sx={{ width: 40, height: 40 }} />
      )
    },
    { 
      id: 'name', 
      label: 'Name', 
      filterable: true,
      width: '300px' 
    },
    { 
      id: 'languageSkills', 
      label: 'Language Skills', 
      filterable: true 
    },
    { 
      id: 'areasOfExpertise', 
      label: 'Areas of Expertise', 
      filterable: true
    },
    { 
      id: 'yearsOfExperience', 
      label: 'Yrs of Experience' 
    },
    { 
      id: 'email', 
      label: 'Email',
      width: '250px' 
    },
    { 
      id: 'mobile', 
      label: 'Mobile Number' 
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (value) => (
        <Chip 
          label={value} 
          color={value === 'Active' ? 'success' : 'default'} 
        />
      )
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
      profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "Rahul",
      languageSkills: "English, Hindi, Tamil",
      areasOfExpertise: "Vedic Astrology, Horoscope Analysis",
      yearsOfExperience: 10,
      email: "rahul@test.in",
      mobile: "+91 9876543210",
      status: "Active",
      plan: "Premium"
    },
    {
      id: 2,
      profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "Sivakami",
      languageSkills: "Tamil, Telugu, English",
      areasOfExpertise: "Numerology, Tarot Reading",
      yearsOfExperience: 8,
      email: "sivakami@test.in",
      mobile: "+91 9123456789",
      status: "Active",
      plan: "Basic"
    },
    {
      id: 3,
      profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
      name: "Sheik",
      languageSkills: "Urdu, English, Hindi",
      areasOfExpertise: "Palmistry, Face Reading",
      yearsOfExperience: 12,
      email: "sheik@test.in",
      mobile: "+91 8765432109",
      status: "Inactive",
      plan: "Pro"
    },
    {
      id: 4,
      profilePicture: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "Vasanth",
      languageSkills: "Kannada, English",
      areasOfExpertise: "Career Astrology, Horoscope Matching",
      yearsOfExperience: 6,
      email: "vasanth@test.in",
      mobile: "+91 9988776655",
      status: "Inactive",
      plan: "Free"
    }
  ];

  const handleAdd = () => {
    navigate('/dashboard/astrologers/new');
  };
  
  const handleStatus = () => {
    // Handle Status
  };

  const handleView = (row: UserData) => {
    navigate(`/dashboard/astrologers/view/${row?.id}`);
  };

  const handleEdit = (row: UserData) => {
    navigate(`/dashboard/astrologers/edit/${row?.id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // console.log('Selected:', selectedIds);
  };

  return (
    <GenericTable<UserData>
      title="Astrologer Management"
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

export default Astrologers;
