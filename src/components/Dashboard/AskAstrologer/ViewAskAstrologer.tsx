import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import {
  assignAstrologer,
  fetchAskRequestDetail,
  sendWhatsAppStatus,
  type AskAstrologerItem,
} from "../../../api/askAstrologerAdmin";
import { callAPI } from "../../../api/crudFactory";
import VoiceAnswerPlayer from "./VoiceAnswerPlayer";
import { formatDateTimeDMY } from "../../../utils/formatDateTime";

type AstrologerOption = { astrologer_id: number; first_name: string; last_name: string };

const STATUS_COLOR: Record<string, "warning" | "info" | "secondary" | "success" | "error" | "default"> = {
  pending_payment: "warning",
  paid: "info",
  assigned: "secondary",
  answered: "success",
  cancelled: "error",
};

const PRESET_MESSAGES = [
  "We have received your question. Our astrologer will respond shortly.",
  "Your response will be ready in the Teksage app shortly.",
  "Our astrologer has been assigned to your question and is reviewing it now.",
];

const InfoRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <Box sx={{ display: "flex", gap: 2, py: 0.5 }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value || "—"}
    </Typography>
  </Box>
);

const ViewAskAstrologer: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const id = Number(requestId);

  const [data, setData] = useState<AskAstrologerItem | null>(null);
  const [astrologers, setAstrologers] = useState<AstrologerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [assignAstroId, setAssignAstroId] = useState<number | "">("");
  const [waMode, setWaMode] = useState<"preset" | "custom">("preset");
  const [selectedPreset, setSelectedPreset] = useState(PRESET_MESSAGES[0]);
  const [customWaText, setCustomWaText] = useState("");
  const [snack, setSnack] = useState<{ open: boolean; msg: string; ok: boolean }>({
    open: false, msg: "", ok: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [detail, astroRes] = await Promise.all([
        fetchAskRequestDetail(id),
        callAPI({ endpoint: "api/admin/astrologers", method: "get", params: { page: 1, page_size: 100 } }),
      ]);
      setData(detail);
      setAssignAstroId(detail.astrologer_id ?? "");
      const astroList = (astroRes.data?.data ?? astroRes.data?.astrologers ?? []) as AstrologerOption[];
      setAstrologers(astroList);
    } catch {
      setSnack({ open: true, msg: "Failed to load request details", ok: false });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAssign() {
    if (!assignAstroId) return;
    setBusy(true);
    try {
      await assignAstrologer(id, Number(assignAstroId));
      setSnack({ open: true, msg: "Astrologer assigned successfully", ok: true });
      void load();
    } catch {
      setSnack({ open: true, msg: "Assignment failed", ok: false });
    } finally {
      setBusy(false);
    }
  }

  async function handleSendWhatsApp() {
    const text = waMode === "preset" ? selectedPreset : customWaText.trim();
    if (!text) return;
    setBusy(true);
    try {
      await sendWhatsAppStatus(id, { message_mode: "custom", custom_text: text });
      setSnack({ open: true, msg: "WhatsApp message sent", ok: true });
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? "Send failed";
      setSnack({ open: true, msg, ok: false });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard/ask-astrologer")}
        sx={{ mb: 2 }}
      >
        Back to list
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Ask Astrologer — Request #{data.id}
        </Typography>
        <Chip
          label={data.status}
          color={STATUS_COLOR[data.status] ?? "default"}
          size="small"
        />
      </Box>

      {/* Client summary — allowed fields only; no horoscope JSON */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Client Information
        </Typography>
        <InfoRow label="Name" value={data.customer_name} />
        <InfoRow label="Date of Birth" value={data.date_of_birth} />
        <InfoRow label="Time of Birth" value={data.time_of_birth} />
        <InfoRow label="Place of Birth" value={data.place_of_birth} />
        <InfoRow label="Rasi/Moon Sign" value={data.rashi} />
        <InfoRow label="Nakshatra" value={data.nakshatra} />
        <InfoRow
          label="Languages"
          value={(data.preferred_languages ?? []).join(", ")}
        />
        <Divider sx={{ my: 1.5 }} />
        <InfoRow label="Fee" value={data.currency && data.base_price ? `${data.currency} ${data.base_price}` : undefined} />
        <InfoRow label="Paid at" value={data.paid_at ? formatDateTimeDMY(data.paid_at) : undefined} />
      </Paper>

      {/* Q&A */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Question &amp; AI Answer
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          Client Question
        </Typography>
        <Typography variant="body2" mb={2}>{data.user_question}</Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          AI Answer
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{data.ai_response}</Typography>
      </Paper>

      {/* Astrologer answer (if present) */}
      {data.answer_text || data.answer_voice_url ? (
        <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Astrologer Answer
          </Typography>
          {data.answer_text ? (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }} mb={1}>
              {data.answer_text}
            </Typography>
          ) : null}
          {data.answer_voice_url ? (
            <VoiceAnswerPlayer src={data.answer_voice_url} />
          ) : null}
          <Typography variant="caption" color="text.secondary">
            Answered: {formatDateTimeDMY(data.answered_at)}
          </Typography>
        </Paper>
      ) : null}

      {/* Assign astrologer */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Assign Astrologer
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel>Select astrologer</InputLabel>
            <Select
              value={assignAstroId}
              label="Select astrologer"
              onChange={(e) => setAssignAstroId(e.target.value as number)}
            >
              {astrologers.map((a) => (
                <MenuItem key={a.astrologer_id} value={a.astrologer_id}>
                  {a.first_name} {a.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={!assignAstroId || busy}
            onClick={() => void handleAssign()}
          >
            {busy ? "Assigning…" : "Assign"}
          </Button>
        </Box>
        {data.assigned_at ? (
          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            Last assigned: {formatDateTimeDMY(data.assigned_at)}
          </Typography>
        ) : null}
      </Paper>

      {/* WhatsApp status message */}
      {data.customer_whatsapp_opted_in ? (
        <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Send WhatsApp Status to Customer
          </Typography>
          <RadioGroup
            row
            value={waMode}
            onChange={(e) => setWaMode(e.target.value as "preset" | "custom")}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="preset" control={<Radio size="small" />} label="Preset" />
            <FormControlLabel value="custom" control={<Radio size="small" />} label="Custom" />
          </RadioGroup>

          {waMode === "preset" ? (
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Message</InputLabel>
              <Select
                value={selectedPreset}
                label="Message"
                onChange={(e) => setSelectedPreset(e.target.value)}
              >
                {PRESET_MESSAGES.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={3}
              label="Custom message"
              value={customWaText}
              onChange={(e) => setCustomWaText(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <Button
            variant="contained"
            disabled={busy || (waMode === "custom" && !customWaText.trim())}
            onClick={() => void handleSendWhatsApp()}
          >
            {busy ? "Sending…" : "Send WhatsApp"}
          </Button>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Customer has not opted into WhatsApp updates — status messages are not available.
        </Alert>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.ok ? "success" : "error"} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewAskAstrologer;
