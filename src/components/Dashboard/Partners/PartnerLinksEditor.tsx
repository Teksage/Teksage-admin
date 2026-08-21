import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export type LinkRow = {
  id: number;
  code: string;
  label?: string | null;
  consult_discount_pct: number;
  yearly_discount_pct: number;
  valid_days: number;
  status: string;
  web_url: string;
  app_copy: string;
};

export type LinkDraft = {
  code: string;
  label: string;
  consultPct: string;
  yearlyPct: string;
  validDays: string;
  status: string;
};

type Props = {
  links: LinkRow[];
  drafts: Record<number, LinkDraft>;
  editingLinkId: number | null;
  newLink: LinkDraft;
  busy: boolean;
  onUpdateDraft: (linkId: number, patch: Partial<LinkDraft>) => void;
  onStartEdit: (link: LinkRow) => void;
  onCancelEdit: (link: LinkRow) => void;
  onSaveEdit: (linkId: number) => void;
  onDelete: (linkId: number) => void;
  onChangeNewLink: (patch: Partial<LinkDraft>) => void;
  onAdd: () => void;
};

function DraftFields({
  draft,
  onChange,
}: {
  draft: LinkDraft;
  onChange: (patch: Partial<LinkDraft>) => void;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 2fr 1fr 1fr 1fr 1fr" },
        alignItems: "start",
      }}
    >
      <TextField
        size="small"
        label="Code"
        value={draft.code}
        onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
      />
      <TextField
        size="small"
        label="Label"
        value={draft.label}
        onChange={(e) => onChange({ label: e.target.value })}
      />
      <TextField
        size="small"
        label="Consult %"
        value={draft.consultPct}
        onChange={(e) => onChange({ consultPct: e.target.value })}
      />
      <TextField
        size="small"
        label="Yearly %"
        value={draft.yearlyPct}
        onChange={(e) => onChange({ yearlyPct: e.target.value })}
      />
      <TextField
        size="small"
        label="Days"
        value={draft.validDays}
        onChange={(e) => onChange({ validDays: e.target.value })}
      />
      <TextField
        select
        size="small"
        label="Status"
        value={draft.status}
        onChange={(e) => onChange({ status: e.target.value })}
      >
        <MenuItem value="active">active</MenuItem>
        <MenuItem value="inactive">inactive</MenuItem>
      </TextField>
    </Box>
  );
}

export default function PartnerLinksEditor({
  links,
  drafts,
  editingLinkId,
  newLink,
  busy,
  onUpdateDraft,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onChangeNewLink,
  onAdd,
}: Props) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, gap: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "Urbanist" }}>
          {links.length} code{links.length === 1 ? "" : "s"} · set inactive to stop new applies and block
          unused discounts on the customer app
        </Typography>
        <Button
          size="small"
          variant={showAdd ? "outlined" : "contained"}
          endIcon={showAdd ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setShowAdd((v) => !v)}
          sx={{ fontFamily: "Urbanist", fontWeight: 700 }}
        >
          {showAdd ? "Hide form" : "Add code"}
        </Button>
      </Box>

      <Collapse in={showAdd}>
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 2, borderRadius: 2, borderColor: alpha("#2e7d32", 0.25) }}
        >
          <Typography sx={{ mb: 1.5, fontFamily: "Urbanist", fontWeight: 700, color: "#2e7d32" }}>
            New referral code
          </Typography>
          <DraftFields draft={newLink} onChange={onChangeNewLink} />
          <Box sx={{ mt: 1.5 }}>
            <Button
              variant="contained"
              size="small"
              disabled={busy || !newLink.code.trim()}
              onClick={onAdd}
            >
              Create code
            </Button>
          </Box>
        </Paper>
      </Collapse>

      <Paper sx={{ overflowX: "auto", borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontFamily: "Urbanist",
                  fontWeight: 800,
                  backgroundColor: alpha("#1b4d3e", 0.9),
                  color: "#fff",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableCell>Code</TableCell>
              <TableCell>Discounts</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((l) => {
              const draft = drafts[l.id];
              const isEditing = editingLinkId === l.id;
              return (
                <TableRow key={l.id} hover>
                  <TableCell colSpan={isEditing ? 4 : 1} sx={{ verticalAlign: "top" }}>
                    {isEditing && draft ? (
                      <Box sx={{ py: 1 }}>
                        <DraftFields
                          draft={draft}
                          onChange={(patch) => onUpdateDraft(l.id, patch)}
                        />
                        <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={busy || !draft.code.trim()}
                            onClick={() => onSaveEdit(l.id)}
                          >
                            Save
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => onCancelEdit(l)}>
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography sx={{ fontFamily: "Urbanist", fontWeight: 700 }}>
                          {l.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {l.label || "—"}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  {!isEditing ? (
                    <>
                      <TableCell>
                        <Chip
                          size="small"
                          label={`Consult ${l.consult_discount_pct}%`}
                          sx={{ mr: 0.5, mb: 0.5, fontFamily: "Urbanist" }}
                        />
                        <Chip
                          size="small"
                          label={`Yearly ${l.yearly_discount_pct}%`}
                          sx={{ mr: 0.5, mb: 0.5, fontFamily: "Urbanist" }}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${l.valid_days}d`}
                          sx={{ fontFamily: "Urbanist" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={l.status === "active" ? "success" : "default"}
                          label={l.status}
                          sx={{ fontFamily: "Urbanist", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <IconButton
                          size="small"
                          title="Copy web URL"
                          onClick={() => void navigator.clipboard.writeText(l.web_url)}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Edit"
                          onClick={() => onStartEdit(l)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          title="Delete"
                          onClick={() => onDelete(l.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </>
                  ) : null}
                </TableRow>
              );
            })}
            {!links.length ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 3, textAlign: "center" }}>
                  No codes yet — click Add code
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
