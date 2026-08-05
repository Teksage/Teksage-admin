import type { ReactNode } from "react";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";
import {
  formatAttributedAt,
  formatPaidAmount,
  initialsFromName,
  UsageStatusChip,
} from "./partnerUsageUi";

const money = formatPaidAmount;

export type CustomerRow = {
  user_id: number;
  name: string;
  email?: string | null;
  email_masked?: string | null;
  mobile_number?: string | null;
  phone_masked?: string | null;
  attributed_at?: string | null;
  consult_status?: string;
  yearly_status?: string;
  consult_pct?: number;
  yearly_pct?: number;
  consult_amount?: number | null;
  yearly_amount?: number | null;
  consult_discount_amount?: number | null;
  yearly_discount_amount?: number | null;
  bought_consultation?: boolean;
  bought_yearly_subscription?: boolean;
};

type LinkTab = { id: number; code: string; label?: string | null };

type Props = {
  links: LinkTab[];
  tab: number;
  onTabChange: (index: number) => void;
  users: CustomerRow[];
  loading?: boolean;
  error?: string | null;
  masked?: boolean;
  showAmounts?: boolean;
  headerRight?: ReactNode;
};

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        bgcolor: alpha("#10B100", 0.08),
        border: "1px solid",
        borderColor: alpha("#2e7d32", 0.15),
        minWidth: 88,
      }}
    >
      <Typography sx={{ fontFamily: "Urbanist", fontWeight: 800, color: "#1b4d3e", lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Urbanist" }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function PartnerCustomersPanel({
  links,
  tab,
  onTabChange,
  users,
  loading,
  error,
  masked,
  showAmounts,
  headerRight,
}: Props) {
  const consultUsed = users.filter((u) => u.bought_consultation).length;
  const yearlyUsed = users.filter((u) => u.bought_yearly_subscription).length;
  const available = users.filter(
    (u) =>
      u.consult_status === "active" ||
      u.yearly_status === "active"
  ).length;
  const consultDiscountTotal = showAmounts
    ? users.reduce(
        (sum, u) =>
          u.consult_status === "consumed"
            ? sum + (Number(u.consult_discount_amount) || 0)
            : sum,
        0
      )
    : 0;
  const yearlyDiscountTotal = showAmounts
    ? users.reduce(
        (sum, u) =>
          u.yearly_status === "consumed"
            ? sum + (Number(u.yearly_discount_amount) || 0)
            : sum,
        0
      )
    : 0;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => onTabChange(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              fontFamily: "Urbanist",
              fontWeight: 700,
              textTransform: "none",
              minHeight: 40,
            },
          }}
        >
          {links.map((l) => (
            <Tab key={l.id} label={l.label ? `${l.code} · ${l.label}` : l.code} />
          ))}
        </Tabs>
        {headerRight}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <StatPill label="Customers" value={users.length} />
        <StatPill label="Consult used" value={consultUsed} />
        <StatPill label="Yearly used" value={yearlyUsed} />
        <StatPill label="Still available" value={available} />
        {showAmounts && consultDiscountTotal > 0 ? (
          <StatPill
            label="Consult discount"
            value={money(consultDiscountTotal) || "—"}
          />
        ) : null}
        {showAmounts && yearlyDiscountTotal > 0 ? (
          <StatPill
            label="Yearly discount"
            value={money(yearlyDiscountTotal) || "—"}
          />
        ) : null}
      </Box>

      {error ? (
        <Typography color="error" sx={{ mb: 1.5, fontFamily: "Urbanist" }}>
          {error}
        </Typography>
      ) : null}

      <Paper
        elevation={0}
        sx={{
          overflowX: "auto",
          borderRadius: 3,
          border: "1px solid",
          borderColor: alpha("#1b4d3e", 0.12),
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontFamily: "Urbanist",
                  fontWeight: 800,
                  backgroundColor: "#1b4d3e",
                  color: "#fff",
                  borderBottom: 0,
                  py: 1.25,
                },
              }}
            >
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Consultation</TableCell>
              <TableCell>Yearly plan</TableCell>
              <TableCell>Attributed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 4, textAlign: "center" }}>
                  <Typography color="text.secondary" sx={{ fontFamily: "Urbanist" }}>
                    Loading customers…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {!loading &&
              users.map((u) => (
                <TableRow
                  key={u.user_id}
                  hover
                  sx={{
                    "& td": { borderColor: alpha("#1b4d3e", 0.08), py: 1.5 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: alpha("#10B100", 0.18),
                          color: "#1b4d3e",
                          fontFamily: "Urbanist",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        {initialsFromName(u.name)}
                      </Avatar>
                      <Typography sx={{ fontFamily: "Urbanist", fontWeight: 700 }}>
                        {u.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Urbanist", fontSize: 13 }}>
                      {(masked ? u.email_masked : u.email) || "—"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontFamily: "Urbanist" }}
                    >
                      {(masked ? u.phone_masked : u.mobile_number) || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <UsageStatusChip
                      label="Consult"
                      status={u.consult_status}
                      pct={u.consult_pct}
                      amount={u.consult_amount}
                      discountAmount={u.consult_discount_amount}
                      showAmount={showAmounts}
                    />
                  </TableCell>
                  <TableCell>
                    <UsageStatusChip
                      label="Yearly"
                      status={u.yearly_status}
                      pct={u.yearly_pct}
                      amount={u.yearly_amount}
                      discountAmount={u.yearly_discount_amount}
                      showAmount={showAmounts}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={formatAttributedAt(u.attributed_at)}
                      sx={{ fontFamily: "Urbanist", fontWeight: 600 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && !users.length ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 5, textAlign: "center" }}>
                  <Typography sx={{ fontFamily: "Urbanist", fontWeight: 700, color: "#1b4d3e" }}>
                    No customers yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, fontFamily: "Urbanist" }}
                  >
                    Customers who apply this referral code will appear here.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
