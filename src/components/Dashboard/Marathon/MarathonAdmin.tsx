import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  createMarathon,
  deleteMarathon,
  listMarathons,
  updateMarathon,
  type MarathonRow,
} from "../../../api/marathonAdmin";
import GenericTable from "../../Elements/Table/Table";
import { TableColumn } from "../../Elements/Table/types";
import { LabeledField, MARATHON_CATEGORIES, formatClock, formatDay, localDate, marathonPhase, splitLocal } from "./marathonFields";

type EventForm = {
  name: string;
  description: string;
  showFrom: string;
  showUntil: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  fee: string;
  usdFee: string;
  categories: string[];
};

const emptyForm = (): EventForm => ({
  name: "",
  description: "",
  showFrom: "",
  showUntil: "",
  date: "",
  startTime: "",
  endTime: "",
  timezone: "Asia/Kolkata",
  fee: "199",
  usdFee: "9",
  categories: ["Career"],
});

function toPayload(form: EventForm) {
  return {
    visibleFrom: localDate(form.showFrom, "00:00"),
    visibleUntil: localDate(form.showUntil, "23:59"),
    starts: localDate(form.date, form.startTime),
    ends: localDate(form.date, form.endTime),
  };
}

const MarathonAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MarathonRow[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [lockedTimes, setLockedTimes] = useState(false);

  async function load() {
    setRows(await listMarathons());
  }

  useEffect(() => {
    void load().catch((err: Error) => setError(err.message));
  }, []);

  function startCreate() {
    setEditingId(null);
    setLockedTimes(false);
    setForm(emptyForm());
    setError("");
    setOpen(true);
  }

  function startEdit(row: MarathonRow) {
    const start = splitLocal(row.starts_at);
    const end = splitLocal(row.ends_at);
    const shownFrom = splitLocal(row.visible_from || row.starts_at);
    const shownUntil = splitLocal(row.visible_until || row.ends_at);
    setEditingId(row.id);
    setLockedTimes((row.paid_count || 0) > 0);
    setForm({
      name: row.name,
      description: row.description || "",
      showFrom: shownFrom.date,
      showUntil: shownUntil.date,
      date: start.date,
      startTime: start.time,
      endTime: end.time,
      timezone: row.timezone || "Asia/Kolkata",
      fee: String(row.fee),
      usdFee: row.usd_fee != null ? String(row.usd_fee) : "",
      categories: row.categories?.length ? [...row.categories] : ["Career"],
    });
    setError("");
    setOpen(true);
  }

  function save() {
    const { visibleFrom, visibleUntil, starts, ends } = toPayload(form);
    if (!form.name.trim()) {
      setError("Enter an event name.");
      return;
    }
    if (!form.description.trim()) {
      setError("Enter a description for this event.");
      return;
    }
    if (!form.usdFee || Number(form.usdFee) <= 0) {
      setError("Enter a US fee.");
      return;
    }
    if (!form.categories.length) {
      setError("Pick at least one category.");
      return;
    }
    if (Number.isNaN(visibleFrom.getTime()) || Number.isNaN(visibleUntil.getTime()) || visibleUntil < visibleFrom) {
      setError("Show until must be on or after show from.");
      return;
    }
    if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime()) || ends <= starts) {
      setError("End time must be after the start time on the event date.");
      return;
    }
    if (form.date < form.showFrom) {
      setError("The event date must be on or after the day users can first see it.");
      return;
    }
    const body = {
      name: form.name,
      description: form.description.trim(),
      timezone: form.timezone,
      categories: form.categories,
      fee: Number(form.fee),
      usd_fee: Number(form.usdFee),
      visible_from: visibleFrom.toISOString(),
      visible_until: visibleUntil.toISOString(),
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
    };
    setError("");
    const action = editingId ? updateMarathon(editingId, body) : createMarathon(body);
    void action
      .then(() => {
        setOpen(false);
        return load();
      })
      .catch((err: Error) => setError(err.message));
  }

  function remove(row: MarathonRow) {
    if ((row.paid_count || 0) > 0) {
      setError("You cannot delete an event that already has a paid booking.");
      return;
    }
    if (!window.confirm(`Delete ${row.name}?`)) return;
    setError("");
    void deleteMarathon(row.id)
      .then(load)
      .catch((err: Error) => setError(err.message));
  }

  function toggleCategory(name: string) {
    setForm({
      ...form,
      categories: form.categories.includes(name)
        ? form.categories.filter((item) => item !== name)
        : [...form.categories, name],
    });
  }

  const columns: TableColumn<MarathonRow>[] = [
    { id: "name", label: "Event", width: "220px" },
    {
      id: "categories",
      label: "Categories",
      width: "180px",
      render: (value: string[]) => (value || []).join(", ") || "—",
    },
    {
      id: "starts_at",
      label: "Session",
      width: "220px",
      render: (_value: string, row: MarathonRow) =>
        `${formatDay(row.starts_at)}, ${formatClock(row.starts_at)} – ${formatClock(row.ends_at)}`,
    },
    {
      id: "fee",
      label: "Fee",
      width: "140px",
      render: (_value: MarathonRow["fee"], row: MarathonRow) =>
        row.usd_fee != null ? `₹${row.fee} · $${row.usd_fee}` : `₹${row.fee}`,
    },
    {
      id: "status",
      label: "Status",
      width: "180px",
      render: (_value: string, row: MarathonRow) => {
        const phase = marathonPhase(row);
        return <Chip size="small" label={phase.label} color={phase.color} />;
      },
    },
    {
      id: "confirmed_count",
      label: "Confirmed",
      width: "110px",
      render: (value: number | undefined) => String(value ?? 0),
    },
    {
      id: "paid_count",
      label: "Paid seats",
      width: "110px",
      render: (value: number | undefined) => String(value ?? 0),
    },
  ];

  return (
    <>
      {error && !open ? <Alert severity="error" sx={{ mx: 2, mt: 2 }}>{error}</Alert> : null}
      <GenericTable<MarathonRow>
        title="Consultation marathon"
        data={rows}
        columns={columns}
        onAdd={startCreate}
        onView={(row) => navigate(`/dashboard/marathon/${row.id}`)}
        onEdit={startEdit}
        onDelete={remove}
        getRowId={(row) => row.id}
        tableHeight="calc(100vh - 250px)"
        initialRowsPerPage={10}
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit event" : "New event"}</DialogTitle>
        <DialogContent>
          {error && open ? <Typography color="error" sx={{ mb: 1 }}>{error}</Typography> : null}
          {lockedTimes ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              This event already has a paid booking, so the fees and the event date stay as they are.
            </Typography>
          ) : null}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Users see the event from Show from through Show until. The sessions happen on the event date.
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <LabeledField stack label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <LabeledField
                stack
                label="Description"
                value={form.description}
                multiline
                minRows={3}
                inputProps={{ maxLength: 500 }}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Box>
            <LabeledField stack label="Show from" type="date" value={form.showFrom} onChange={(e) => setForm({ ...form, showFrom: e.target.value })} />
            <LabeledField stack label="Show until" type="date" value={form.showUntil} onChange={(e) => setForm({ ...form, showUntil: e.target.value })} />
            <Box sx={{ gridColumn: "1 / -1" }}>
              <LabeledField stack label="Event date" type="date" value={form.date} disabled={lockedTimes} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Box>
            <LabeledField stack label="Start time" type="time" value={form.startTime} disabled={lockedTimes} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <LabeledField stack label="End time" type="time" value={form.endTime} disabled={lockedTimes} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            <LabeledField stack label="Fee (India)" value={form.fee} disabled={lockedTimes} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
            <LabeledField stack label="Fee (US)" value={form.usdFee} disabled={lockedTimes} onChange={(e) => setForm({ ...form, usdFee: e.target.value })} />
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
            {MARATHON_CATEGORIES.map((name) => (
              <Chip
                key={name}
                label={name}
                color={form.categories.includes(name) ? "primary" : "default"}
                onClick={() => toggleCategory(name)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>{editingId ? "Update" : "Create draft"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MarathonAdmin;
