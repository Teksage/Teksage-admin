import React, { useEffect, useState } from "react";
import GenericTable from "../../Elements/Table";
import { TableColumn } from "../../Elements/Table";
import { callAPI } from "../../../api/crudFactory";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface CouponData {
  id: number;
  coupon_name: string;
  coupon_percentage: number;
  max_cap: number;
  start_date: string; // ISO format assumed
  end_date: string;
  plan_name: string;
}

const Coupons: React.FC = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<CouponData[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await callAPI({
          endpoint: "/api/admin/coupons",
          method: "get",
        });
        console.log(response, "Coupons Response");
        setCoupons(response.data);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const columns: TableColumn<CouponData>[] = [
    {
      id: "coupon_name",
      label: "Name",
      width: "200px",
      // filterable: true,
    },
    {
      id: "coupon_percentage",
      label: "Coupon (%)",
      width: "150px",
      render: (value) => `${value}%`,
    },
    {
      id: "max_cap",
      label: "Max Limit",
      width: "150px",
      render: (value) => `₹${value}`,
    },
    {
      id: "start_date",
      label: "Valid From",
      width: "180px",
      render: (value) => format(new Date(value), "dd MMM yyyy"),
    },
    {
      id: "end_date",
      label: "Valid Till",
      width: "180px",
      render: (value) => format(new Date(value), "dd MMM yyyy"),
    },
    {
      id: "plan_name",
      label: "Linked Plan",
      width: "200px",
    },
  ];

  const handleAdd = () => {
    navigate('/dashboard/coupons/new');
  };

  const handleView = (row: CouponData) => {
    navigate(`/dashboard/users/view/${row?.id}`);
  };

  const handleEdit = (row: CouponData) => {
    navigate(`/dashboard/users/edit/${row?.id}`);
  };

  const handleDelete = (row: CouponData) => {
    // navigate(`/dashboard/users/edit/${row?.id}`);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    // Handle selected row IDs here
  };

  return (
    <GenericTable<CouponData>
      title="Coupons Management"
      data={coupons}
      columns={columns}
      onAdd={handleAdd}
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

export default Coupons;
