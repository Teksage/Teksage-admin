import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Box, Chip, Paper, Typography, alpha } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CardMembershipOutlinedIcon from "@mui/icons-material/CardMembershipOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import { callAPI } from "../../../api/crudFactory";
import PartnerCustomersPanel, { type CustomerRow } from "./PartnerCustomersPanel";

type LinkTab = {
  id: number;
  code: string;
  label?: string | null;
  consult_discount_pct?: number;
  yearly_discount_pct?: number;
  valid_days?: number;
};

type Summary = {
  total_customers: number;
  consultations_used: number;
  yearly_used: number;
  pending_active: number;
  codes_count: number;
};

function StatCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: number | string;
  icon: ReactNode;
  hint: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: alpha("#2e7d32", 0.18),
        background: `linear-gradient(145deg, ${alpha("#10B100", 0.08)}, #fff)`,
        minHeight: 118,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
        >
          {title}
        </Typography>
        <Box sx={{ color: "#2e7d32" }}>{icon}</Box>
      </Box>
      <Typography
        variant="h4"
        sx={{ fontFamily: "Urbanist", fontWeight: 800, color: "#1b4d3e" }}
      >
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Urbanist" }}>
        {hint}
      </Typography>
    </Paper>
  );
}

export default function PartnerDashboard() {
  const [links, setLinks] = useState<LinkTab[]>([]);
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<CustomerRow[]>([]);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState<Summary>({
    total_customers: 0,
    consultations_used: 0,
    yearly_used: 0,
    pending_active: 0,
    codes_count: 0,
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeLink = links[tab];

  const loadUsers = useCallback(async (linkId: number) => {
    setLoadingUsers(true);
    setError(null);
    try {
      const res = await callAPI({
        endpoint: `/api/partner/links/${linkId}/users`,
        method: "get",
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e: unknown) {
      setUsers([]);
      setError(e instanceof Error ? e.message : "Failed to load customers");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    void callAPI({ endpoint: "/api/partner/me", method: "get" })
      .then((res) => {
        setName(res.data.name || "Partner");
        const list = res.data.referral_links || [];
        setLinks(list);
        if (res.data.summary) setSummary(res.data.summary);
        if (list[0]) void loadUsers(list[0].id);
      })
      .catch(console.error);
  }, [loadUsers]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h5"
        sx={{ fontFamily: "Urbanist", fontWeight: 800, color: "#10B100" }}
      >
        {name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3, fontFamily: "Urbanist" }}>
        Track customers who used your referral codes, and see whether they booked a
        consultation or bought yearly subscription.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          mb: 3,
        }}
      >
        <StatCard
          title="Customers"
          value={summary.total_customers}
          icon={<PeopleAltOutlinedIcon />}
          hint="Total who applied your codes"
        />
        <StatCard
          title="Consultations"
          value={summary.consultations_used}
          icon={<ChatBubbleOutlineIcon />}
          hint="Discount used on consultation"
        />
        <StatCard
          title="Yearly plans"
          value={summary.yearly_used}
          icon={<CardMembershipOutlinedIcon />}
          hint="Discount used on yearly plan"
        />
        <StatCard
          title="Active windows"
          value={summary.pending_active}
          icon={<HourglassEmptyOutlinedIcon />}
          hint="Still have unused discount"
        />
      </Box>

      {!links.length ? (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ fontFamily: "Urbanist" }} color="text.secondary">
            No referral codes yet. Ask Teksage admin to add codes for your channel.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontFamily: "Urbanist", fontWeight: 700, color: "#2e7d32" }}
          >
            Customers by code
          </Typography>
          <PartnerCustomersPanel
            links={links}
            tab={tab}
            onTabChange={(v) => {
              setTab(v);
              void loadUsers(links[v].id);
            }}
            users={users}
            loading={loadingUsers}
            error={error}
            masked
            headerRight={
              activeLink ? (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    size="small"
                    label={`Consult ${activeLink.consult_discount_pct ?? 0}%`}
                    sx={{ fontFamily: "Urbanist", fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label={`Yearly ${activeLink.yearly_discount_pct ?? 0}%`}
                    sx={{ fontFamily: "Urbanist", fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label={`${activeLink.valid_days ?? 0} days`}
                    variant="outlined"
                    sx={{ fontFamily: "Urbanist", fontWeight: 600 }}
                  />
                </Box>
              ) : null
            }
          />
        </Paper>
      )}
    </Box>
  );
}
