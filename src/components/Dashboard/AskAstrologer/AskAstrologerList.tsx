import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAskRequests, type AskAstrologerItem } from "../../../api/askAstrologerAdmin";
import { formatDateTimeDMY } from "../../../utils/formatDateTime";

const STATUS_OPTIONS = ["", "paid", "assigned", "answered", "cancelled"];

const STATUS_COLOR: Record<string, "warning" | "info" | "secondary" | "success" | "error" | "default"> = {
  pending_payment: "warning",
  paid: "info",
  assigned: "secondary",
  answered: "success",
  cancelled: "error",
};

const AskAstrologerList: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AskAstrologerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAskRequests(page, statusFilter || undefined);
      setRows(res.requests);
      setTotal(res.total);
    } catch {
      setError("Failed to load Ask Astrologer requests");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const pageCount = Math.ceil(total / 20);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Ask Astrologer Requests
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status filter"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>{s || "All"}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Languages</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid at</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.customer_name ?? "—"}</TableCell>
                    <TableCell>{(r.preferred_languages ?? []).join(", ") || "—"}</TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" noWrap>{r.user_question}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={r.status}
                        color={STATUS_COLOR[r.status] ?? "default"}
                      />
                    </TableCell>
                    <TableCell>
                      {formatDateTimeDMY(r.paid_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/dashboard/ask-astrologer/view/${r.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>

          {pageCount > 1 ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
              />
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
};

export default AskAstrologerList;
