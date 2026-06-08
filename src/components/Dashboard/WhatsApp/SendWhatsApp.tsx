import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  createWhatsAppTemplate,
  fetchOptedInUsers,
  fetchWhatsAppTemplates,
  sendWhatsAppBroadcast,
  type OptedInUser,
  type WhatsAppTemplate,
} from "../../../api/whatsappAdmin";
import { OptedInUserPicker } from "./OptedInUserPicker";

export default function SendWhatsApp() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [users, setUsers] = useState<OptedInUser[]>([]);
  const [recipientMode, setRecipientMode] = useState<"all" | "selected">("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [messageMode, setMessageMode] = useState<"template" | "custom">("template");
  const [templateId, setTemplateId] = useState<number | "">("");
  const [param1, setParam1] = useState("");
  const [customText, setCustomText] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; ok: boolean }>({
    open: false,
    msg: "",
    ok: true,
  });
  const [newTpl, setNewTpl] = useState({
    name: "",
    gupshup_template_id: "",
    display_name: "",
    param_count: "0",
  });

  const load = useCallback(async () => {
    const [tpls, userRes] = await Promise.all([
      fetchWhatsAppTemplates(),
      fetchOptedInUsers(search),
    ]);
    setTemplates(tpls);
    setUsers(userRes.data);
    if (tpls.length) {
      setTemplateId((prev) => (prev === "" ? tpls[0].id : prev));
    }
  }, [search]);

  useEffect(() => {
    void load().catch((e: Error) =>
      setSnack({ open: true, msg: e.message, ok: false })
    );
  }, [load]);

  const toggleUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllUsers = () => {
    setSelectedIds(users.map((u) => u.user_id));
  };

  const clearSelectedUsers = () => {
    setSelectedIds([]);
  };

  const handleSend = async () => {
    setBusy(true);
    try {
      const params =
        messageMode === "template" && param1.trim() ? [param1.trim()] : undefined;
      const res = await sendWhatsAppBroadcast({
        recipient_mode: recipientMode,
        user_ids: recipientMode === "selected" ? selectedIds : undefined,
        message_mode: messageMode,
        template_id: messageMode === "template" ? Number(templateId) : undefined,
        template_params: params,
        custom_text: messageMode === "custom" ? customText : undefined,
      });
      setSnack({
        open: true,
        ok: true,
        msg: `Queued for ${res.total} opted-in user(s). Check broadcast log shortly.`,
      });
    } catch (e: unknown) {
      setSnack({
        open: true,
        ok: false,
        msg: e instanceof Error ? e.message : "Send failed",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleAddTemplate = async () => {
    try {
      await createWhatsAppTemplate({
        name: newTpl.name.trim(),
        gupshup_template_id: newTpl.gupshup_template_id.trim(),
        display_name: newTpl.display_name.trim(),
        param_count: parseInt(newTpl.param_count, 10) || 0,
      });
      setNewTpl({ name: "", gupshup_template_id: "", display_name: "", param_count: "0" });
      await load();
      setSnack({ open: true, ok: true, msg: "Template registered." });
    } catch (e: unknown) {
      setSnack({
        open: true,
        ok: false,
        msg: e instanceof Error ? e.message : "Could not add template",
      });
    }
  };

  const selectedTpl = templates.find((t) => t.id === templateId);

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Send WhatsApp Messages
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Only users who opted in on the website (granted = true) receive messages.
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight={600} gutterBottom>
          Recipients
        </Typography>
        <RadioGroup
          row
          value={recipientMode}
          onChange={(e) => setRecipientMode(e.target.value as "all" | "selected")}
        >
          <FormControlLabel value="all" control={<Radio />} label="All opted-in" />
          <FormControlLabel value="selected" control={<Radio />} label="Select users" />
        </RadioGroup>
        {recipientMode === "selected" && (
          <>
            <TextField
              size="small"
              fullWidth
              label="Search by name, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 1.5 }}
            />
            <OptedInUserPicker
              users={users}
              selectedIds={selectedIds}
              onToggle={toggleUser}
              onSelectAll={selectAllUsers}
              onClear={clearSelectedUsers}
            />
          </>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight={600} gutterBottom>
          Message
        </Typography>
        <RadioGroup
          row
          value={messageMode}
          onChange={(e) => setMessageMode(e.target.value as "template" | "custom")}
        >
          <FormControlLabel value="template" control={<Radio />} label="Approved template" />
          <FormControlLabel value="custom" control={<Radio />} label="Custom text" />
        </RadioGroup>
        {messageMode === "template" ? (
          <>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Template</InputLabel>
              <Select
                label="Template"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value as number)}
              >
                {templates.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.display_name} ({t.name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedTpl && selectedTpl.param_count > 0 ? (
              <TextField
                size="small"
                fullWidth
                label="First param (optional; defaults to user name)"
                value={param1}
                onChange={(e) => setParam1(e.target.value)}
                sx={{ mt: 1 }}
              />
            ) : null}
          </>
        ) : (
          <>
            <TextField
              multiline
              minRows={3}
              fullWidth
              label="Custom message"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              sx={{ mt: 1 }}
            />
            <Alert severity="warning" sx={{ mt: 1 }}>
              Custom text may fail outside an active WhatsApp session. Prefer templates for
              campaigns.
            </Alert>
          </>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight={600} gutterBottom>
          Register new template (no redeploy)
        </Typography>
        <TextField
          size="small"
          fullWidth
          label="Gupshup template name"
          value={newTpl.name}
          onChange={(e) => setNewTpl({ ...newTpl, name: e.target.value })}
          sx={{ mb: 1 }}
        />
        <TextField
          size="small"
          fullWidth
          label="Gupshup template ID"
          value={newTpl.gupshup_template_id}
          onChange={(e) => setNewTpl({ ...newTpl, gupshup_template_id: e.target.value })}
          sx={{ mb: 1 }}
        />
        <TextField
          size="small"
          fullWidth
          label="Display name"
          value={newTpl.display_name}
          onChange={(e) => setNewTpl({ ...newTpl, display_name: e.target.value })}
          sx={{ mb: 1 }}
        />
        <TextField
          size="small"
          fullWidth
          label="Param count"
          value={newTpl.param_count}
          onChange={(e) => setNewTpl({ ...newTpl, param_count: e.target.value })}
          sx={{ mb: 1 }}
        />
        <Button variant="outlined" onClick={() => void handleAddTemplate()}>
          Add template
        </Button>
      </Paper>

      <Button variant="contained" disabled={busy} onClick={() => void handleSend()}>
        {busy ? "Sending…" : "Send WhatsApp"}
      </Button>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.ok ? "success" : "error"}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
