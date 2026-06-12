import React, { useCallback, useEffect, useState } from "react";
import { Alert, Box, Chip, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardDetailHeader } from "../../Elements/DashboardDetailHeader";
import {
  assignAstrologer,
  fetchAskRequestDetail,
  sendWhatsAppStatus,
  type AskAstrologerItem,
} from "../../../api/askAstrologerAdmin";
import { callAPI } from "../../../api/crudFactory";
import { AskAssignAstrologerSection } from "./AskAssignAstrologerSection";
import { AskAstrologerAnswerSection } from "./AskAstrologerAnswerSection";
import { AskAstrologerClientSection } from "./AskAstrologerClientSection";
import { AskAstrologerQaSection } from "./AskAstrologerQaSection";
import { AskWhatsAppStatusSection } from "./AskWhatsAppStatusSection";
import {
  ASK_DETAIL_PAGE,
  ASK_STATUS_COLOR,
  ASK_WA_PRESET_MESSAGES,
  formatAskStatus,
} from "./askAstrologerUi";

type AstrologerOption = { astrologer_id: number; first_name: string; last_name: string };

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
  const [selectedPreset, setSelectedPreset] = useState<string>(ASK_WA_PRESET_MESSAGES[0]);
  const [customWaText, setCustomWaText] = useState("");
  const [snack, setSnack] = useState<{ open: boolean; msg: string; ok: boolean }>({
    open: false,
    msg: "",
    ok: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [detail, astroRes] = await Promise.all([
        fetchAskRequestDetail(id),
        callAPI({
          endpoint: "api/admin/astrologers",
          method: "get",
          params: { page: 1, page_size: 100 },
        }),
      ]);
      setData(detail);
      setAssignAstroId(detail.astrologer_id ?? "");
      const astroList = (astroRes.data?.data ?? astroRes.data?.astrologers ?? []) as AstrologerOption[];
      setAstrologers(astroList);
    } catch {
      setSnack({ open: true, msg: ASK_DETAIL_PAGE.loadFailed, ok: false });
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
      setSnack({ open: true, msg: ASK_DETAIL_PAGE.assignSuccess, ok: true });
      void load();
    } catch {
      setSnack({ open: true, msg: ASK_DETAIL_PAGE.assignFailed, ok: false });
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
      setSnack({ open: true, msg: ASK_DETAIL_PAGE.waSendSuccess, ok: true });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      const msg = err?.response?.data?.detail ?? ASK_DETAIL_PAGE.waSendFailed;
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
    <Box sx={{ p: 3, maxWidth: 960, mx: "auto" }}>
      <DashboardDetailHeader
        title={`Ask Astrologer — Request #${data.id}`}
        onBack={() => navigate(ASK_DETAIL_PAGE.backListPath)}
        trailing={
          <Chip
            label={formatAskStatus(data.status)}
            color={ASK_STATUS_COLOR[data.status] ?? "default"}
            size="small"
          />
        }
      />

      <AskAstrologerClientSection data={data} />
      <AskAstrologerQaSection data={data} />
      <AskAstrologerAnswerSection data={data} />

      <AskAssignAstrologerSection
        astrologers={astrologers}
        assignAstroId={assignAstroId}
        assignedAt={data.assigned_at}
        busy={busy}
        onSelect={setAssignAstroId}
        onAssign={() => void handleAssign()}
      />

      <AskWhatsAppStatusSection
        optedIn={Boolean(data.customer_whatsapp_opted_in)}
        waMode={waMode}
        selectedPreset={selectedPreset}
        customWaText={customWaText}
        busy={busy}
        onModeChange={setWaMode}
        onPresetChange={setSelectedPreset}
        onCustomChange={setCustomWaText}
        onSend={() => void handleSendWhatsApp()}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snack.ok ? "success" : "error"}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewAskAstrologer;
