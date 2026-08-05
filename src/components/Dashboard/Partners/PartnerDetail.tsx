import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { callAPI } from "../../../api/crudFactory";
import PartnerAttributedUsers from "./PartnerAttributedUsers";
import PartnerLinksEditor, {
  type LinkDraft,
  type LinkRow,
} from "./PartnerLinksEditor";

type PartnerDetailData = {
  id: number;
  name: string;
  email?: string | null;
  status: string;
  youtube_channel_url?: string | null;
  has_password?: boolean;
  referral_links: LinkRow[];
};

const emptyLinkForm = (): LinkDraft => ({
  code: "",
  label: "",
  consultPct: "10",
  yearlyPct: "20",
  validDays: "7",
  status: "active",
});

function linkToDraft(l: LinkRow): LinkDraft {
  return {
    code: l.code,
    label: l.label || "",
    consultPct: String(l.consult_discount_pct),
    yearlyPct: String(l.yearly_discount_pct),
    validDays: String(l.valid_days),
    status: l.status || "active",
  };
}

function draftPayload(draft: LinkDraft) {
  return {
    code: draft.code.trim().toUpperCase(),
    label: draft.label || undefined,
    consult_discount_pct: Number(draft.consultPct) || 0,
    yearly_discount_pct: Number(draft.yearlyPct) || 0,
    valid_days: Number(draft.validDays) || 7,
    status: draft.status || "active",
  };
}

export default function PartnerDetail() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<PartnerDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [partnerName, setPartnerName] = useState("");
  const [youtube, setYoutube] = useState("");
  const [partnerStatus, setPartnerStatus] = useState("active");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [linkDrafts, setLinkDrafts] = useState<Record<number, LinkDraft>>({});
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [newLink, setNewLink] = useState<LinkDraft>(emptyLinkForm());

  const load = useCallback(async () => {
    const res = await callAPI({
      endpoint: `/api/admin/partners/${partnerId}`,
      method: "get",
    });
    setData(res.data);
    setPartnerName(res.data.name || "");
    setYoutube(res.data.youtube_channel_url || "");
    setPartnerStatus(res.data.status || "active");
    const drafts: Record<number, LinkDraft> = {};
    for (const l of res.data.referral_links as LinkRow[]) {
      drafts[l.id] = linkToDraft(l);
    }
    setLinkDrafts(drafts);
  }, [partnerId]);

  useEffect(() => {
    void load().catch((e: Error) => setError(e.message));
  }, [load]);

  async function savePartner() {
    if (newPassword) {
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    setBusy(true);
    setError(null);
    setOkMsg(null);
    try {
      await callAPI({
        endpoint: `/api/admin/partners/${partnerId}`,
        method: "put",
        data: {
          name: partnerName.trim(),
          youtube_channel_url: youtube || null,
          status: partnerStatus,
          ...(newPassword ? { password: newPassword } : {}),
        },
      });
      setNewPassword("");
      setConfirmPassword("");
      await load();
      setOkMsg(newPassword ? "Partner updated (password set)" : "Partner updated");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update partner");
    } finally {
      setBusy(false);
    }
  }

  async function deletePartner() {
    if (!window.confirm("Delete this partner and all referral links?")) return;
    setBusy(true);
    setError(null);
    try {
      await callAPI({
        endpoint: `/api/admin/partners/${partnerId}`,
        method: "delete",
      });
      navigate("/dashboard/partners");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete partner");
      setBusy(false);
    }
  }

  async function saveExistingLink(linkId: number) {
    const draft = linkDrafts[linkId];
    if (!draft?.code.trim()) {
      setError("Referral code is required");
      return;
    }
    setBusy(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await callAPI({
        endpoint: `/api/admin/partners/links/${linkId}`,
        method: "put",
        data: draftPayload(draft),
      });
      setEditingLinkId(null);
      const saved = res.data as LinkRow | undefined;
      if (saved && data) {
        setData({
          ...data,
          referral_links: data.referral_links.map((l) =>
            l.id === linkId ? { ...l, ...saved } : l
          ),
        });
        setLinkDrafts((prev) => ({
          ...prev,
          [linkId]: linkToDraft(saved),
        }));
      }
      try {
        await load();
      } catch {
        /* keep optimistic row */
      }
      setOkMsg("Referral link saved");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save referral link");
    } finally {
      setBusy(false);
    }
  }

  async function addLink() {
    if (!newLink.code.trim()) {
      setError("Referral code is required");
      return;
    }
    setBusy(true);
    setError(null);
    setOkMsg(null);
    try {
      await callAPI({
        endpoint: `/api/admin/partners/${partnerId}/links`,
        method: "post",
        data: draftPayload(newLink),
      });
      setNewLink(emptyLinkForm());
      await load();
      setOkMsg("Referral link created");
      setTab(1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create referral link");
    } finally {
      setBusy(false);
    }
  }

  async function deleteLink(linkId: number) {
    if (!window.confirm("Delete this referral code?")) return;
    setBusy(true);
    setError(null);
    try {
      await callAPI({
        endpoint: `/api/admin/partners/links/${linkId}`,
        method: "delete",
      });
      if (editingLinkId === linkId) setEditingLinkId(null);
      await load();
      setOkMsg("Referral link deleted");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete referral link");
    } finally {
      setBusy(false);
    }
  }

  function updateDraft(linkId: number, patch: Partial<LinkDraft>) {
    setLinkDrafts((prev) => ({
      ...prev,
      [linkId]: { ...(prev[linkId] || emptyLinkForm()), ...patch },
    }));
  }

  if (!data) {
    return <Box sx={{ p: 3 }}>{error || "Loading…"}</Box>;
  }

  const codesCount = data.referral_links.length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box>
          <Button size="small" onClick={() => navigate("/dashboard/partners")} sx={{ mb: 0.5 }}>
            ← Back
          </Button>
          <Typography
            variant="h5"
            sx={{ fontFamily: "Urbanist", fontWeight: 800, color: "#10B100" }}
          >
            {data.name}
          </Typography>
          <Typography color="text.secondary" sx={{ fontFamily: "Urbanist" }}>
            {data.email || "—"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: { xs: 0, sm: 3 } }}>
          <Chip
            size="small"
            color={data.status === "active" ? "success" : "default"}
            label={`Partner: ${data.status}`}
            sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
          />
          <Chip
            size="small"
            variant="outlined"
            label={data.has_password ? "Password set" : "Password missing"}
            color={data.has_password ? "success" : "warning"}
            sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
          />
          {data.referral_links.map((l) => (
            <Chip
              key={l.id}
              size="small"
              color={l.status === "active" ? "success" : "warning"}
              variant={l.status === "active" ? "filled" : "outlined"}
              label={`${l.code}: ${l.status}`}
              onClick={() => setTab(1)}
              sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
            />
          ))}
          {!codesCount ? (
            <Chip
              size="small"
              variant="outlined"
              label="No codes"
              sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
            />
          ) : null}
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : null}
      {okMsg ? (
        <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setOkMsg(null)}>
          {okMsg}
        </Alert>
      ) : null}

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 1,
            borderBottom: 1,
            borderColor: "divider",
            background: alpha("#10B100", 0.04),
            "& .MuiTab-root": {
              fontFamily: "Urbanist",
              fontWeight: 700,
              textTransform: "none",
            },
          }}
        >
          <Tab label="Profile" />
          <Tab label={`Codes (${codesCount})`} />
          <Tab label="Customers" />
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          {tab === 0 ? (
            <Box>
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                <TextField
                  size="small"
                  label="Name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
                <TextField
                  select
                  size="small"
                  label="Partner account status"
                  value={partnerStatus}
                  onChange={(e) => setPartnerStatus(e.target.value)}
                  helperText="This is login access only. Customer discounts use each code’s status under Codes."
                >
                  <MenuItem value="active">active</MenuItem>
                  <MenuItem value="inactive">inactive</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  label="YouTube channel URL"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  sx={{ gridColumn: { md: "1 / -1" } }}
                />
                <TextField
                  size="small"
                  label={data.has_password ? "New password (optional)" : "Set login password"}
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Partner login: email + password on admin Partner tab"
                />
                {newPassword ? (
                  <TextField
                    size="small"
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                ) : (
                  <Box />
                )}
              </Box>
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  disabled={busy || !partnerName.trim()}
                  onClick={() => void savePartner()}
                >
                  Save profile
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  disabled={busy}
                  onClick={() => void deletePartner()}
                >
                  Delete partner
                </Button>
                <Button variant="text" onClick={() => setTab(1)}>
                  Manage codes →
                </Button>
              </Box>
            </Box>
          ) : null}

          {tab === 1 ? (
            <PartnerLinksEditor
              links={data.referral_links}
              drafts={linkDrafts}
              editingLinkId={editingLinkId}
              newLink={newLink}
              busy={busy}
              onUpdateDraft={updateDraft}
              onStartEdit={(l) => {
                setEditingLinkId(l.id);
                updateDraft(l.id, linkToDraft(l));
                setError(null);
                setOkMsg(null);
              }}
              onCancelEdit={(l) => {
                setEditingLinkId(null);
                updateDraft(l.id, linkToDraft(l));
              }}
              onSaveEdit={(id) => void saveExistingLink(id)}
              onDelete={(id) => void deleteLink(id)}
              onChangeNewLink={(patch) => setNewLink((f) => ({ ...f, ...patch }))}
              onAdd={() => void addLink()}
            />
          ) : null}

          {tab === 2 ? (
            <PartnerAttributedUsers
              partnerId={partnerId}
              links={data.referral_links.map((l) => ({ id: l.id, code: l.code }))}
            />
          ) : null}
        </Box>
      </Paper>
    </Box>
  );
}
