import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaymentsIcon from "@mui/icons-material/Payments";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardDetailHeader } from "../../Elements/DashboardDetailHeader";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { InfoItem } from "../../Elements/CommonFunctions";
import {
  addMarathonSlot,
  assignMarathonSeat,
  deleteMarathonSlot,
  endMarathon,
  getMarathon,
  publishMarathon,
  resumeMarathon,
  resendMarathonEmail,
  resendMarathonWhatsapp,
  retryMarathonLink,
  updateMarathonSlot,
  type MarathonRow,
} from "../../../api/marathonAdmin";
import { MarathonEventBookings } from "./MarathonEventBookings";
import { MarathonEventSlots } from "./MarathonEventSlots";
import { LabeledField, SLOT_MS, formatClock, formatDay, formatWhen, localDate, marathonPhase, splitLocal } from "./marathonFields";

type SlotDraft = { date: string; time: string; seat_count: string };
type SlotEdit = { id: number; date: string; time: string; seats: string; paid: number };

const MarathonEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { marathonId } = useParams();
  const id = Number(marathonId);
  const [event, setEvent] = useState<MarathonRow | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [slot, setSlot] = useState<SlotDraft>({ date: "", time: "", seat_count: "3" });
  const [picks, setPicks] = useState<Record<number, number | "">>({});
  const [editing, setEditing] = useState<SlotEdit | null>(null);
  const [endOpen, setEndOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  async function load() {
    const row = await getMarathon(id);
    setEvent(row);
    const start = splitLocal(row.starts_at);
    setSlot((current) => ({
      date: current.date || start.date,
      time: current.time || start.time,
      seat_count: current.seat_count || "3",
    }));
  }

  useEffect(() => {
    void load().catch((err: Error) => setError(err.message));
  }, [id]);

  function run(action: Promise<unknown>, done?: string) {
    setError("");
    void action
      .then((result) => {
        const warning = result && typeof result === "object" && "warning" in result
          ? (result as { warning?: string | null }).warning
          : null;
        if (warning) setError(warning);
        else if (done) setNotice(done);
        return load();
      })
      .catch((err: Error) => setError(err.message));
  }

  function addSlot() {
    if (!event) return;
    const starts = localDate(slot.date, slot.time);
    const ends = new Date(starts.getTime() + SLOT_MS);
    if (Number.isNaN(starts.getTime())) {
      setError("Choose a date and a start time.");
      return;
    }
    if (starts < new Date(event.starts_at) || ends > new Date(event.ends_at)) {
      setError(`This 10-minute seat (${formatWhen(starts)} – ${formatWhen(ends)}) is outside the event window.`);
      return;
    }
    run(addMarathonSlot(event.id, {
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      seat_count: Number(slot.seat_count),
    }), "Slot added.");
  }

  function saveSlot() {
    if (!editing || !event) return;
    const seats = Number(editing.seats);
    if (!seats || seats < editing.paid) {
      setError("You cannot lower the seats below the number already paid.");
      return;
    }
    const starts = localDate(editing.date, editing.time);
    const ends = new Date(starts.getTime() + SLOT_MS);
    if (editing.paid === 0 && (starts < new Date(event.starts_at) || ends > new Date(event.ends_at))) {
      setError("A slot must be 10 minutes and must sit inside the event start and end.");
      return;
    }
    setEditing(null);
    run(updateMarathonSlot(editing.id, {
      seat_count: seats,
      ...(editing.paid === 0 ? { starts_at: starts.toISOString(), ends_at: ends.toISOString() } : {}),
    }), "Slot updated.");
  }

  if (!event) {
    return (
      <Box sx={{ p: 3 }}>
        <DashboardDetailHeader title="Consultation marathon" onBack={() => navigate("/dashboard/marathon")} />
        {error ? <Alert severity="error">{error}</Alert> : (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    );
  }

  const people = event.participants || [];
  const shown = event.visible_from && event.visible_until
    ? `${formatDay(event.visible_from)} – ${formatDay(event.visible_until)}`
    : "Not set";
  const phase = marathonPhase(event);

  const fee = event.usd_fee != null ? `₹${event.fee} India · $${event.usd_fee} US` : `₹${event.fee}`;

  return (
    <Box sx={{ p: 3 }}>
      <DashboardDetailHeader
        title={event.name}
        onBack={() => navigate("/dashboard/marathon")}
        trailing={
          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            <Chip size="small" label={phase.label} color={phase.color} />
            {event.status === "draft" ? (
              <Button variant="contained" onClick={() => run(publishMarathon(event.id), "Event published. It is now on the consultation marathon page.")}>
                Publish
              </Button>
            ) : null}
            {event.status === "ended" ? (
              <Button variant="contained" onClick={() => setResumeOpen(true)}>Resume event</Button>
            ) : (
              <Button variant="outlined" color="warning" onClick={() => setEndOpen(true)}>End event</Button>
            )}
          </Box>
        }
      />

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <DashboardSectionPaper title="Event details">
        {event.description ? (
          <Typography sx={{ mb: 1, fontFamily: "Urbanist" }}>{event.description}</Typography>
        ) : null}
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Session"
              value={`${formatDay(event.starts_at)}, ${formatClock(event.starts_at)} – ${formatClock(event.ends_at)}`}
              icon={<AccessTimeIcon fontSize="small" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Shown on the marathon page" value={shown} icon={<CalendarTodayIcon fontSize="small" />} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Fees" value={fee} icon={<PaymentsIcon fontSize="small" />} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Paid seats"
              value={String(event.paid_count ?? (event.bookings || []).length)}
              icon={<EventSeatIcon fontSize="small" />}
            />
          </Grid>
        </Grid>
      </DashboardSectionPaper>

      <DashboardSectionPaper title="Confirmed astrologers">
        {people.length === 0 ? (
          <Alert severity="info">Publish stays off until at least one astrologer confirms participation.</Alert>
        ) : (
          <Box display="flex" gap={1} flexWrap="wrap">
            {people.map((person) => (
              <Chip key={person.user_id} label={person.name || `User ${person.user_id}`} />
            ))}
          </Box>
        )}
      </DashboardSectionPaper>

      <Box>
        <MarathonEventBookings
          event={event}
          picks={picks}
          onPick={(bookingId, userId) => setPicks((current) => ({ ...current, [bookingId]: userId }))}
          onAssign={(bookingId) => {
            const picked = picks[bookingId];
            if (picked) run(assignMarathonSeat(bookingId, Number(picked)), "Astrologer assigned.");
          }}
          onRetry={(bookingId) => run(retryMarathonLink(bookingId), "A new meeting link was saved.")}
          onEmail={(bookingId) => run(resendMarathonEmail(bookingId), "Email sent again.")}
          onWhatsapp={(bookingId) => run(resendMarathonWhatsapp(bookingId), "WhatsApp alert sent again.")}
        />
        <MarathonEventSlots
          event={event}
          slot={slot}
          onSlot={setSlot}
          onAdd={addSlot}
          onEdit={(item) => {
            const start = splitLocal(item.starts_at);
            setEditing({ id: item.id, date: start.date, time: start.time, seats: String(item.seat_count), paid: item.paid_count || 0 });
          }}
          onDelete={(item) => {
            if (window.confirm(`Delete the ${formatClock(item.starts_at)} slot?`)) run(deleteMarathonSlot(item.id), "Slot deleted.");
          }}
        />
      </Box>

      <Snackbar open={Boolean(notice)} autoHideDuration={4000} onClose={() => setNotice("")}>
        <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>
      </Snackbar>

      <Dialog open={resumeOpen} onClose={() => setResumeOpen(false)}>
        <DialogTitle>Resume this event?</DialogTitle>
        <DialogContent>
          <Typography>The event goes back on the marathon page. Booking still closes when the event day starts. Paid seats stay as they are, and nothing is refunded.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResumeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setResumeOpen(false); run(resumeMarathon(event.id), "Event resumed."); }}>
            Resume event
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={endOpen} onClose={() => setEndOpen(false)}>
        <DialogTitle>End this event?</DialogTitle>
        <DialogContent>
          <Typography>New bookings stop. Seats that are already paid stay, and nothing is refunded automatically.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndOpen(false)}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={() => { setEndOpen(false); run(endMarathon(event.id), "Event ended. New bookings are closed."); }}>
            End event
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="xs">
        <DialogTitle>Edit slot</DialogTitle>
        <DialogContent>
          {editing ? (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <LabeledField stack label="Date" type="date" value={editing.date} disabled={editing.paid > 0} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              <LabeledField stack label="Start time" type="time" value={editing.time} disabled={editing.paid > 0} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
              <LabeledField stack label="Seats" value={editing.seats} onChange={(e) => setEditing({ ...editing, seats: e.target.value })} />
              <Typography variant="body2">
                {editing.paid > 0
                  ? "This time already has a paid booking, so only the seat count can change."
                  : `Ends at ${formatWhen(new Date(localDate(editing.date, editing.time).getTime() + SLOT_MS))}.`}
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveSlot}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarathonEventPage;
