import { useCallback, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { callAPI } from "../../../api/crudFactory";
import PartnerCustomersPanel, { type CustomerRow } from "./PartnerCustomersPanel";

type LinkTab = { id: number; code: string };

type Props = {
  partnerId: string | undefined;
  links: LinkTab[];
};

export default function PartnerAttributedUsers({ partnerId, links }: Props) {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<CustomerRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(
    async (linkId: number | null) => {
      if (!partnerId) return;
      setLoading(true);
      setError(null);
      try {
        const q = linkId != null ? `?link_id=${linkId}` : "";
        const res = await callAPI({
          endpoint: `/api/admin/partners/${partnerId}/attributed-users${q}`,
          method: "get",
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (e: unknown) {
        setUsers([]);
        setError(e instanceof Error ? e.message : "Failed to load customers");
      } finally {
        setLoading(false);
      }
    },
    [partnerId]
  );

  useEffect(() => {
    if (!links.length) {
      setUsers([]);
      return;
    }
    void loadUsers(links[tab]?.id ?? null);
  }, [links, tab, loadUsers]);

  if (!links.length) {
    return (
      <Typography color="text.secondary" sx={{ mt: 1, fontFamily: "Urbanist" }}>
        Add a referral code first. Customers who apply it will show here with
        consultation / yearly usage.
      </Typography>
    );
  }

  return (
    <PartnerCustomersPanel
      links={links}
      tab={tab}
      onTabChange={setTab}
      users={users}
      loading={loading}
      error={error}
      masked={false}
      showAmounts
    />
  );
}
