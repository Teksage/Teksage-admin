import React, {useEffect, useState} from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { Chip, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";

interface UserData {
  astrologer_id: number;
  first_name: string;
  languageSkills: string;
  areasOfExpertise: string;
  yearsOfExperience: number;
  // profilePicture: string;
  email: string;
  mobile: string;
  status: string;
  plan: string;
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
        console.log(response, "response");
        setAstrologers(response.data); // or response if your `callAPI` returns data directly
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
      id: "yearsOfExperience",
      label: "Yrs of Experience",
    },
    {
      id: "email",
      label: "Email",
      // width: "250px",
    },
    {
      id: "mobile",
      label: "Mobile Number",
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
    {
      id: "plan",
      label: "Plan",
      filterable: true,
    },
  ];

  const userData: UserData[] = [
    {
      id: 1,
      name: "Rahul",
      languageSkills: "English, Hindi, Tamil",
      areasOfExpertise: "Vedic Astrology, Horoscope Analysis",
      yearsOfExperience: 10,
      email: "rahul@test.in",
      mobile: "+91 9876543210",
      status: "Active",
      plan: "Premium",
    },
    {
      id: 2,
      name: "Sivakami",
      languageSkills: "Tamil, Telugu, English",
      areasOfExpertise: "Numerology, Tarot Reading",
      yearsOfExperience: 8,
      email: "sivakami@test.in",
      mobile: "+91 9123456789",
      status: "Active",
      plan: "Basic",
    },
    {
      id: 3,
      name: "Sheik",
      languageSkills: "Urdu, English, Hindi",
      areasOfExpertise: "Palmistry, Face Reading",
      yearsOfExperience: 12,
      email: "sheik@test.in",
      mobile: "+91 8765432109",
      status: "Inactive",
      plan: "Pro",
    },
    {
      id: 4,
      name: "Vasanth",
      languageSkills: "Kannada, English",
      areasOfExpertise: "Career Astrology, Horoscope Matching",
      yearsOfExperience: 6,
      email: "vasanth@test.in",
      mobile: "+91 9988776655",
      status: "Inactive",
      plan: "Free",
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
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.astrologer_id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
};

export default Astrologers;
