import { Box, Button, IconButton, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { MarathonRow } from "../../../api/marathonAdmin";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { LabeledField, SLOT_MS, formatClock, formatDay, formatWhen, localDate } from "./marathonFields";

type SlotDraft = { date: string; time: string; seat_count: string };

type MarathonEventSlotsProps = {
  event: MarathonRow;
  slot: SlotDraft;
  onSlot: (next: SlotDraft) => void;
  onAdd: () => void;
  onEdit: (item: MarathonRow["slots"][number]) => void;
  onDelete: (item: MarathonRow["slots"][number]) => void;
};

export function MarathonEventSlots({ event, slot, onSlot, onAdd, onEdit, onDelete }: MarathonEventSlotsProps) {
  const slots = event.slots || [];
  const preview = slot.date && slot.time ? new Date(localDate(slot.date, slot.time).getTime() + SLOT_MS) : null;

  return (
    <DashboardSectionPaper title="Time slots">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "180px 180px 120px auto" },
          gap: 2,
          alignItems: "end",
        }}
      >
        <LabeledField label="Date" type="date" value={slot.date} onChange={(e) => onSlot({ ...slot, date: e.target.value })} />
        <LabeledField label="Start time" type="time" value={slot.time} onChange={(e) => onSlot({ ...slot, time: e.target.value })} />
        <LabeledField label="Seats" value={slot.seat_count} onChange={(e) => onSlot({ ...slot, seat_count: e.target.value })} />
        <Button
          variant="contained"
          onClick={onAdd}
          sx={{ height: 40, justifySelf: "start", textTransform: "none", whiteSpace: "nowrap", mb: "1px" }}
        >
          Add 10-minute slot
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        {preview
          ? `This seat ends at ${formatWhen(preview)}. It must sit inside ${formatWhen(event.starts_at)} – ${formatWhen(event.ends_at)}.`
          : "Pick a start time inside the event window. Each seat is 10 minutes."}
      </Typography>
      <TableContainer sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No slots yet. Add the first 10-minute seat above.
                </TableCell>
              </TableRow>
            ) : slots.map((item) => {
              const paid = item.paid_count || 0;
              const open = Math.max(item.seat_count - paid, 0);
              const full = paid >= item.seat_count;
              return (
                <TableRow key={item.id} hover>
                  <TableCell>
                    {formatDay(item.starts_at)} · {formatClock(item.starts_at)} – {formatClock(item.ends_at)}
                  </TableCell>
                  <TableCell>{paid}</TableCell>
                  <TableCell>{open}{full ? " · full" : ""}</TableCell>
                  <TableCell sx={{ minWidth: 140 }}>
                    <Typography variant="body2">{item.seat_count}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.seat_count ? Math.min(100, (paid / item.seat_count) * 100) : 0}
                      color={full ? "success" : "primary"}
                      sx={{ mt: 0.5, height: 6, borderRadius: 99 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit seats or time">
                      <IconButton aria-label="Edit slot" onClick={() => onEdit(item)}>
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={paid > 0 ? "A paid seat cannot be deleted" : "Delete this slot"}>
                      <span>
                        <IconButton aria-label="Delete slot" color="error" disabled={paid > 0} onClick={() => onDelete(item)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardSectionPaper>
  );
}
