import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { callAPI } from "../../../api/crudFactory";

type PartnerRow = {
  id: number;
  name: string;
  email?: string | null;
  status: string;
  has_password?: boolean;
  referral_links: Array<{ id: number; code: string }>;
};

export default function PartnersList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PartnerRow[]>([]);

  const load = useCallback(async () => {
    const res = await callAPI({ endpoint: "/api/admin/partners", method: "get" });
    setRows(res.data || []);
  }, []);

  useEffect(() => {
    void load().catch((e) => console.error(e));
  }, [load]);

  const columns: TableColumn<PartnerRow>[] = [
    { id: "name", label: "Name", width: "180px" },
    { id: "email", label: "Login email", width: "220px" },
    { id: "status", label: "Status", width: "100px" },
    {
      id: "has_password",
      label: "Password",
      width: "110px",
      render: (value: boolean | undefined) => (value ? "Set" : "Missing"),
    },
    {
      id: "referral_links",
      label: "Codes",
      width: "100px",
      render: (value: PartnerRow["referral_links"]) => String(value?.length ?? 0),
    },
  ];

  return (
    <GenericTable<PartnerRow>
      title="Partners"
      data={rows}
      columns={columns}
      onAdd={() => navigate("/dashboard/partners/new")}
      onView={(row) => navigate(`/dashboard/partners/view/${row.id}`)}
      onEdit={(row) => navigate(`/dashboard/partners/view/${row.id}`)}
      onDelete={async (row) => {
        if (!window.confirm(`Delete partner "${row.name}"?`)) return;
        await callAPI({
          endpoint: `/api/admin/partners/${row.id}`,
          method: "delete",
        });
        await load();
      }}
      getRowId={(row) => row.id}
      tableHeight="calc(100vh - 250px)"
      initialRowsPerPage={10}
    />
  );
}
