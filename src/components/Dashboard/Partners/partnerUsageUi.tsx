import { Box, Chip, Typography, alpha } from "@mui/material";

export type UsageStatus = string;

const STATUS_LABEL: Record<string, string> = {
  consumed: "Used",
  active: "Available",
  expired: "Expired",
  revoked: "Inactive",
  na: "N/A",
};

const STATUS_SX: Record<string, { bg: string; color: string }> = {
  consumed: { bg: alpha("#2e7d32", 0.12), color: "#1b5e20" },
  active: { bg: alpha("#0288d1", 0.12), color: "#01579b" },
  expired: { bg: alpha("#ed6c02", 0.12), color: "#e65100" },
  revoked: { bg: alpha("#757575", 0.14), color: "#424242" },
  na: { bg: alpha("#9e9e9e", 0.1), color: "#616161" },
};

export function formatPaidAmount(value?: number | null) {
  if (value == null || Number.isNaN(Number(value))) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function MoneyRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        minWidth: 132,
        pl: 0.25,
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontFamily: "Urbanist", fontWeight: 600, color: "text.secondary" }}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontFamily: "Urbanist", fontWeight: 800, color: "#1b4d3e" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export function UsageStatusChip({
  label,
  status,
  pct,
  amount,
  discountAmount,
  showAmount,
}: {
  label: string;
  status?: UsageStatus | null;
  pct?: number | null;
  amount?: number | null;
  discountAmount?: number | null;
  showAmount?: boolean;
}) {
  const key = (status || "na").toLowerCase();
  const tone = STATUS_SX[key] || STATUS_SX.na;
  const isUsed = key === "consumed";
  const paid = showAmount && isUsed ? formatPaidAmount(amount) : null;
  const discount = showAmount && isUsed ? formatPaidAmount(discountAmount) : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "flex-start" }}>
      <Chip
        size="small"
        label={`${label}: ${STATUS_LABEL[key] || key}`}
        sx={{
          fontFamily: "Urbanist",
          fontWeight: 700,
          height: 24,
          bgcolor: tone.bg,
          color: tone.color,
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
      {showAmount ? (
        <>
          {discount ? <MoneyRow label="Discount" value={discount} /> : null}
          {paid ? <MoneyRow label="Paid" value={paid} /> : null}
          {!discount && !paid && pct != null && pct > 0 ? (
            <MoneyRow label="Discount" value={`${pct}%`} />
          ) : null}
        </>
      ) : pct != null && pct > 0 ? (
        <Typography
          variant="caption"
          sx={{ fontFamily: "Urbanist", fontWeight: 600, color: "text.secondary", pl: 0.25 }}
        >
          {pct}% off
        </Typography>
      ) : null}
    </Box>
  );
}

export function formatAttributedAt(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function initialsFromName(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
