import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  fetchWhatsAppInbox,
  fetchWhatsAppThread,
  replyWhatsAppInbox,
  type WhatsAppInboxConversation,
  type WhatsAppInboxMessage,
} from "../../../api/whatsappAdmin";
import { getSessionStatus } from "./whatsappSession";

const POLL_MS = 3000;
const CLOCK_MS = 30000;

function sameMessages(a: WhatsAppInboxMessage[], b: WhatsAppInboxMessage[]) {
  if (a.length !== b.length) return false;
  if (!a.length) return true;
  const lastA = a[a.length - 1];
  const lastB = b[b.length - 1];
  return lastA.id === lastB.id && lastA.body === lastB.body;
}

function SessionChip({ lastInboundAt, nowMs }: { lastInboundAt?: string | null; nowMs: number }) {
  const status = getSessionStatus(lastInboundAt, nowMs);
  const color =
    status.urgency === "ok" ? "success" : status.urgency === "soon" ? "warning" : "default";
  return (
    <Chip
      size="small"
      color={color}
      label={status.label}
      sx={{ mr: 0.5, mb: 0.5 }}
    />
  );
}

export default function WhatsAppInbox() {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<WhatsAppInboxConversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [messages, setMessages] = useState<WhatsAppInboxMessage[]>([]);
  const [lastInboundAt, setLastInboundAt] = useState<string | null>(null);
  const [threadName, setThreadName] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; ok: boolean }>({
    open: false,
    msg: "",
    ok: true,
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const selectedPhoneRef = useRef<string | null>(null);
  const searchRef = useRef(search);

  selectedPhoneRef.current = selectedPhone;
  searchRef.current = search;

  const threadSession = getSessionStatus(lastInboundAt, nowMs);
  const sessionActive = threadSession.active;

  const loadInbox = useCallback(async () => {
    const res = await fetchWhatsAppInbox(searchRef.current);
    setConversations(res.data);
  }, []);

  const loadThread = useCallback(async (phone: string) => {
    const res = await fetchWhatsAppThread(phone);
    setMessages((prev) => (sameMessages(prev, res.messages) ? prev : res.messages));
    setLastInboundAt(res.last_inbound_at || null);
    setThreadName(res.name || null);
  }, []);

  const refreshAll = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setRefreshing(true);
      try {
        setError(null);
        setNowMs(Date.now());
        await loadInbox();
        const phone = selectedPhoneRef.current;
        if (phone) await loadThread(phone);
        if (showSpinner) {
          setSnack({ open: true, msg: "Inbox updated", ok: true });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to refresh";
        setError(msg);
        if (showSpinner) {
          setSnack({ open: true, msg, ok: false });
        }
      } finally {
        if (showSpinner) setRefreshing(false);
      }
    },
    [loadInbox, loadThread]
  );

  useEffect(() => {
    void refreshAll(false);
  }, [search, refreshAll]);

  useEffect(() => {
    if (!selectedPhone) {
      setMessages([]);
      setLastInboundAt(null);
      setThreadName(null);
      return;
    }
    void loadThread(selectedPhone).catch((e: Error) => setError(e.message));
  }, [selectedPhone, loadThread]);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), CLOCK_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "hidden") return;
      void refreshAll(false);
    };
    const id = window.setInterval(tick, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setNowMs(Date.now());
        void refreshAll(false);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshAll]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!selectedPhone || !reply.trim()) return;
    setBusy(true);
    try {
      await replyWhatsAppInbox(selectedPhone, reply.trim());
      setReply("");
      await refreshAll(false);
      setSnack({ open: true, msg: "Reply sent", ok: true });
    } catch (e) {
      setSnack({
        open: true,
        msg: e instanceof Error ? e.message : "Failed to send",
        ok: false,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
          WhatsApp Inbox
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
          disabled={refreshing}
          onClick={() => void refreshAll(true)}
        >
          Refresh
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Auto-updates every few seconds. Timer resets to 24h when the customer messages again;
        below 2h it turns orange; after expiry it shows inactive.
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0 }}>
        <Paper sx={{ width: 340, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Box sx={{ p: 1.5 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search name, phone, message"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Divider />
          <List dense sx={{ overflow: "auto", flex: 1 }}>
            {conversations.map((c) => (
              <ListItemButton
                key={c.phone_number}
                selected={selectedPhone === c.phone_number}
                onClick={() => setSelectedPhone(c.phone_number)}
              >
                <ListItemText
                  primary={c.name || c.phone_number}
                  secondary={
                    <>
                      <SessionChip lastInboundAt={c.last_inbound_at} nowMs={nowMs} />
                      <Typography variant="caption" display="block" noWrap>
                        {c.last_direction === "inbound" ? "← " : "→ "}
                        {c.last_message || "—"}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                />
              </ListItemButton>
            ))}
            {!conversations.length ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No messages yet. When a customer replies YES on WhatsApp, it will appear here.
              </Typography>
            ) : null}
          </List>
        </Paper>

        <Paper sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {!selectedPhone ? (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">Select a conversation</Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography fontWeight={700} noWrap>
                    {threadName || selectedPhone}
                  </Typography>
                  <SessionChip lastInboundAt={lastInboundAt} nowMs={nowMs} />
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {selectedPhone}
                  {" · "}
                  {sessionActive
                    ? `Session open — ${threadSession.label}`
                    : "Inactive — wait for customer reply to reopen 24h"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, overflow: "auto", p: 2, bgcolor: "grey.50" }}>
                {messages.map((m) => {
                  const mine = m.direction === "outbound";
                  return (
                    <Box
                      key={m.id}
                      sx={{
                        display: "flex",
                        justifyContent: mine ? "flex-end" : "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          px: 1.5,
                          py: 1,
                          borderRadius: 2,
                          bgcolor: mine ? "primary.main" : "common.white",
                          color: mine ? "primary.contrastText" : "text.primary",
                          boxShadow: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                          {m.body || "(empty)"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.75, display: "block", mt: 0.5 }}
                        >
                          {m.created_at || ""}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={bottomRef} />
              </Box>

              <Box sx={{ p: 2, display: "flex", gap: 1, borderTop: 1, borderColor: "divider" }}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  maxRows={4}
                  placeholder={
                    sessionActive
                      ? "Type a custom reply…"
                      : "Inactive — cannot send until customer replies"
                  }
                  value={reply}
                  disabled={!sessionActive || busy}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendReply();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  disabled={!sessionActive || busy || !reply.trim()}
                  onClick={() => void sendReply()}
                >
                  Send
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.ok ? "success" : "error"}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
