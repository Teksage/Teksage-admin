// import React, {useEffect, useState} from "react";
// import GenericTable from "../../Elements/Table";
// import { TableColumn } from "../../Elements/Table";
// import { Chip, Avatar } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { callAPI } from "../../../api/crudFactory";

// interface UserData {
//   astrologer_id: number;
//   consulting_fee: string;
//   customer_rating: string;
//   experience: number;
//   first_name: string;
//   status: string;
// }

// const Astrologers: React.FC = () => {
//   const navigate = useNavigate();
//   const [Astrologers, setAstrologers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await callAPI({
//           endpoint: "api/admin/astrologers",
//           method: "get",
//         });
//         console.log(response?.data?.astrologers, "response");
//         setAstrologers(response?.data?.astrologers); // or response if your `callAPI` returns data directly
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const columns: TableColumn<UserData>[] = [
//     {
//       id: "first_name",
//       label: "Name",
//       filterable: true,
//       // width: "300px",
//     },
//     {
//       id: "experience",
//       label: "Experience",
//       filterable: true,
//     },
//     {
//       id: "customer_rating",
//       label: "Rating",
//       filterable: true,
//       // width: "250px",
//     },
//     {
//       id: "consulting_fee",
//       label: "Consultation Fee",
//       filterable: true,
//     },
//     { 
//       id: 'status', 
//       label: 'Status',
//       render: (value) => {
//         // Handle null/undefined cases safely
//         if (!value) {
//           return <Chip label="N/A" color="default" />;
//         }
    
//         const formattedValue = 
//           value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    
//         return (
//           <Chip 
//             label={formattedValue} 
//             color={formattedValue === 'Active' ? 'success' : 'default'} 
//           />
//         );
//       },
//       filterable: true,
//     },
//   ];

//   const handleAdd = () => {
//     navigate("/dashboard/astrologers/new");
//   };

//   const handleStatus = () => {
//     // Handle Status
//   };

//   const handleView = (row: UserData) => {
//     navigate(`/dashboard/astrologers/view/${row?.astrologer_id}`);
//   };

//   const handleEdit = (row: UserData) => {
//     navigate(`/dashboard/astrologers/edit/${row?.astrologer_id}`);
//   };

//   const handleDelete = (row: UserData) => {
//     // navigate(`/dashboard/users/edit/${row?.id}`);
//   };

//   const handleSelectionChange = (selectedIds: number[]) => {
//     // console.log('Selected:', selectedIds);
//   };

//   return (
//     <GenericTable<UserData>
//       title="Astrologer Management"
//       data={Astrologers}
//       columns={columns}
//       onAdd={handleAdd}
//       onStatus={handleStatus}
//       onView={handleView}
//       onEdit={handleEdit}
//       onDelete={handleDelete}
//       onSelectionChange={handleSelectionChange}
//       getRowId={(row) => row.astrologer_id}
//       tableHeight="calc(100vh - 250px)"
//       initialRowsPerPage={10}
//     />
//   );
// };

// export default Astrologers;

import React, { useEffect, useState, useMemo } from "react";
import GenericTable, { TableColumn } from "../../Elements/Table";
import { Chip, Alert } from "@mui/material";
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

interface FilterOptions {
  first_name: string[];
  experience: string[];
  customer_rating: string[];
  consulting_fee: string[];
  status: string[];
}

const Astrologers: React.FC = () => {
  const navigate = useNavigate();
  const [astrologers, setAstrologers] = useState<UserData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    first_name: [],
    experience: [],
    customer_rating: [],
    consulting_fee: [],
    status: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAstrologers = async (currentPage: number, currentFilters: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage + 1, // API expects 1-based indexing
        per_page: rowsPerPage,
        ...Object.fromEntries(
          Object.entries(currentFilters).filter(([v]) => v !== "")
        ),
      };

      console.log("fetchAstrologers params:", params);

      const response = await callAPI({
        endpoint: "api/admin/astrologers",
        method: "get",
        params,
      });

      console.log("fetchAstrologers response:", response);

      const astrologerData = response?.data?.astrologers || [];
      const total = response?.data?.total || 0;

      if (!Array.isArray(astrologerData)) {
        throw new Error("Invalid astrologer data format");
      }

      setAstrologers(astrologerData);
      setTotalCount(Number(total));

      // Reset page if out of range
      if (currentPage * rowsPerPage >= total && total > 0) {
        setPage(0);
      }
    } catch (error) {
      console.error("Failed to fetch astrologers:", error);
      setError("Failed to load astrologers. Please try again.");
      setAstrologers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      let allAstrologers: UserData[] = [];
      let currentPage = 1;
      let total = 0;
      const perPage = 100;
      let astrologerData: UserData[] = []; // Declare outside the loop

      // Fetch all pages until all records are retrieved
      do {
        const response = await callAPI({
          endpoint: "api/admin/astrologers",
          method: "get",
          params: { per_page: perPage, page: currentPage },
        });

        console.log(`fetchFilterOptions response (page ${currentPage}):`, response);

        astrologerData = response?.data?.astrologers || [];
        total = response?.data?.total || 0;

        if (!Array.isArray(astrologerData)) {
          throw new Error("Invalid astrologer data format for filter options");
        }

        allAstrologers = [...allAstrologers, ...astrologerData];
        currentPage++;
      } while (allAstrologers.length < total && astrologerData.length > 0);

      // Extract unique values for each filterable field
      const options: FilterOptions = {
        first_name: [
          ...new Set(allAstrologers.map((astro) => astro.first_name).filter(Boolean)),
        ].sort(),
        experience: [
          ...new Set(allAstrologers.map((astro) => String(astro.experience)).filter(Boolean)),
        ].sort((a, b) => Number(a) - Number(b)),
        customer_rating: [
          ...new Set(allAstrologers.map((astro) => astro.customer_rating).filter(Boolean)),
        ].sort(),
        consulting_fee: [
          ...new Set(allAstrologers.map((astro) => astro.consulting_fee).filter(Boolean)),
        ].sort(),
        status: [
          ...new Set(allAstrologers.map((astro) => astro.status).filter(Boolean)),
        ].sort(),
      };

      console.log("Derived filterOptions:", options);
      setFilterOptions(options);
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
      setError("Failed to load filter options. Please try again.");
    }
  };

  useEffect(() => {
    fetchAstrologers(page, filters);
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Use useMemo to ensure columns update with filterOptions
  const columns: TableColumn<UserData>[] = useMemo(
    () => [
      {
        id: "first_name",
        label: "Name",
        filterable: true,
        filterOptions: filterOptions.first_name,
        width: "300px",
      },
      {
        id: "experience",
        label: "Experience",
        filterable: true,
        filterOptions: filterOptions.experience,
      },
      {
        id: "customer_rating",
        label: "Rating",
        filterable: true,
        filterOptions: filterOptions.customer_rating,
        width: "250px",
      },
      {
        id: "consulting_fee",
        label: "Consultation Fee",
        filterable: true,
        filterOptions: filterOptions.consulting_fee,
      },
      {
        id: "status",
        label: "Status",
        filterable: true,
        filterOptions: filterOptions.status,
        render: (value) => {
          if (!value) {
            return <Chip label="N/A" color="default" />;
          }
          const formattedValue =
            value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          return (
            <Chip
              label={formattedValue}
              color={formattedValue === "Active" ? "success" : "default"}
            />
          );
        },
      },
    ],
    [filterOptions]
  );

  const handleAdd = () => {
    navigate("/dashboard/astrologers/new");
  };

  const handleView = (row: UserData) => {
    navigate(`/dashboard/astrologers/view/${row?.astrologer_id}`);
  };

  const handleEdit = (row: UserData) => {
    navigate(`/dashboard/astrologers/edit/${row?.astrologer_id}`);
  };

  // const handleSelectionChange = (selectedIds: number[]) => {
  //   console.log("Selected:", selectedIds);
  // };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <GenericTable<UserData>
        title="Astrologer Management"
        data={astrologers}
        columns={columns}
        totalCount={totalCount}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        // onSelect={handleSelectionChange}
        getRowId={(row) => row.astrologer_id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={rowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onFilterChange={handleFilterChange}
        loading={loading}
      />
    </>
  );
};

export default Astrologers;