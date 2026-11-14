import { useEffect, useMemo, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  fetchAstroConnectLeads,
  notifyAstroConnectLeads,
  type AstroConnectLeadRow,
} from "../../../api/astroconnectLeadsAdmin";
import { fetchWhatsAppTemplates, type WhatsAppTemplate } from "../../../api/whatsappAdmin";
import { MARATHON_CATEGORIES } from "./marathonFields";

const GREEN = "#2e7d32";
const HEAD =
  "linear-gradient(180deg, rgba(46,125,50,0.95) 0%, rgba(27,94,32,0.92) 100%)";

function statusChip(status: string) {
  if (status === "active") return { label: "Active", color: "success" as const };
  if (status === "unsubscribed") return { label: "Unsubscribed", color: "default" as const };
  return { label: "Pending consent", color: "warning" as const };
}

function whatsappChip(row: AstroConnectLeadRow) {
  const state = row.whatsapp_state || (row.whatsapp_opt_in ? "granted" : "pending");
  if (state === "granted") {
    return { label: "Granted", color: "success" as const, filled: true };
  }
  if (state === "stopped" || row.status === "unsubscribed") {
    return { label: "Stopped (STOP)", color: "error" as const, filled: false };
  }
  return { label: "Pending Yes", color: "warning" as const, filled: false };
}

export default function AstroConnectLeads() {
  const [rows, setRows] = useState<AstroConnectLeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [granted, setGranted] = useState<"all" | "yes" | "no">("all");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [templateId, setTemplateId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAstroConnectLeads({
        search: search || undefined,
        status: status || undefined,
        granted: granted === "all" ? undefined : granted === "yes",
        category: category || undefined,
        page: 1,
        page_size: 100,
      });
      setRows(res.data || []);
      setTotal(res.total || 0);
      setSelected([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    fetchWhatsAppTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, []);

  const grantedRows = useMemo(() => rows.filter((row) => row.whatsapp_opt_in), [rows]);
  const grantedIds = useMemo(() => grantedRows.map((row) => row.id), [grantedRows]);
  const allGrantedSelected =
    grantedIds.length > 0 && grantedIds.every((id) => selected.includes(id));

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllGranted = () => {
    setSelected((prev) =>
      allGrantedSelected
        ? prev.filter((id) => !grantedIds.includes(id))
        : Array.from(new Set([...prev, ...grantedIds]))
    );
  };

  const send = async (mode: "all_granted" | "selected") => {
    if (!templateId) {
      setError("Select a WhatsApp template first");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await notifyAstroConnectLeads({
        recipient_mode: mode,
        lead_ids: mode === "selected" ? selected : undefined,
        message_mode: "template",
        template_id: Number(templateId),
      });
      setMessage(`Sent ${res.sent}/${res.total} (failed ${res.failed})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, fontFamily: "Urbanist" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: GREEN }}>
            AstroConnect Leads
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Capture opt-ins, filter by interest, and notify granted WhatsApp contacts.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={`${total} total`} sx={{ fontWeight: 700 }} />
          <Chip
            label={`${grantedRows.length} granted`}
            color="success"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={`${selected.length} selected`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      ) : null}
      {message ? (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      ) : null}

      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2 }}>
        <Typography fontWeight={700} sx={{ color: GREEN, mb: 1.5 }}>
          Filters
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void load();
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { md: 280 } }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending_consent">Pending consent</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>WhatsApp</InputLabel>
            <Select
              label="WhatsApp"
              value={granted}
              onChange={(e) => setGranted(e.target.value as "all" | "yes" | "no")}
            >
              <MenuItem value="all">All</MenuItem>
            <MenuItem value="yes">Granted</MenuItem>
            <MenuItem value="no">Pending / Stopped</MenuItem>
          </Select>
        </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {MARATHON_CATEGORIES.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1} flexShrink={0}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => void load()}
              disabled={loading}
              sx={{ bgcolor: GREEN, "&:hover": { bgcolor: "#1b5e20" }, whiteSpace: "nowrap" }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void load()}
              disabled={loading}
              sx={{
                color: GREEN,
                borderColor: GREEN,
                "&:hover": { borderColor: "#1b5e20", bgcolor: "rgba(46,125,50,0.06)" },
                whiteSpace: "nowrap",
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Change filters, then click Search. Use Refresh to reload the same filters.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2 }}>
        <Typography fontWeight={700} sx={{ color: GREEN, mb: 1.5 }}>
          Notify on WhatsApp
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }}>
          <FormControl size="small" sx={{ minWidth: 260, flex: 1 }}>
            <InputLabel>Template</InputLabel>
            <Select
              label="Template"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as number | "")}
            >
              {templates.length === 0 ? (
                <MenuItem value="" disabled>
                  No templates loaded
                </MenuItem>
              ) : null}
              {templates.map((tpl) => (
                <MenuItem key={tpl.id} value={tpl.id}>
                  {tpl.display_name || tpl.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            disabled={loading || !templateId}
            onClick={() => void send("all_granted")}
            sx={{ bgcolor: GREEN, "&:hover": { bgcolor: "#1b5e20" }, whiteSpace: "nowrap" }}
          >
            Notify all granted
          </Button>
          <Button
            variant="outlined"
            startIcon={<SendIcon />}
            disabled={loading || !templateId || selected.length === 0}
            onClick={() => void send("selected")}
            sx={{ borderColor: GREEN, color: GREEN, whiteSpace: "nowrap" }}
          >
            Notify selected ({selected.length})
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {loading ? <LinearProgress color="success" /> : null}
        <TableContainer sx={{ maxHeight: "calc(100vh - 360px)" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  "",
                  "Lead",
                  "Status",
                  "WhatsApp",
                  "Interests",
                  "Event",
                  "Platform",
                ].map((label, index) => (
                  <TableCell
                    key={label || "check"}
                    sx={{
                      background: HEAD,
                      color: "#fff",
                      fontWeight: 700,
                      fontFamily: "Urbanist",
                      borderBottom: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {index === 0 ? (
                      <Checkbox
                        size="small"
                        checked={allGrantedSelected}
                        indeterminate={selected.length > 0 && !allGrantedSelected}
                        onChange={toggleAllGranted}
                        disabled={grantedIds.length === 0}
                        sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                      />
                    ) : (
                      label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const chip = statusChip(row.status);
                const wa = whatsappChip(row);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selected.includes(row.id)}
                    sx={{ "&:nth-of-type(even)": { bgcolor: "rgba(46,125,50,0.03)" } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={selected.includes(row.id)}
                        onChange={() => toggle(row.id)}
                        disabled={!row.whatsapp_opt_in || wa.label.startsWith("Stopped")}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700}>{row.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.mobile_masked}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={chip.label} color={chip.color} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={wa.color}
                        variant={wa.filled ? "filled" : "outlined"}
                        label={wa.label}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {(row.categories || []).map((item) => (
                          <Chip key={item} size="small" label={item} variant="outlined" />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.marathon_name || `Event #${row.source_marathon_id || "—"}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.platform || "—"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No leads match these filters.</Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
