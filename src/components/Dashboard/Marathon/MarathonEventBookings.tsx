import { Fragment } from "react";
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import type { MarathonRow } from "../../../api/marathonAdmin";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { formatClock, formatDay } from "./marathonFields";

type Booking = MarathonRow["bookings"][number];
type ConfirmedAstrologer = { user_id: number; name: string };

type MarathonEventBookingsProps = {
  event: MarathonRow;
  picks: Record<number, number | "">;
  onPick: (bookingId: number, userId: number | "") => void;
  onAssign: (bookingId: number) => void;
  onRetry: (bookingId: number) => void;
  onEmail: (bookingId: number) => void;
  onWhatsapp: (bookingId: number) => void;
};

function statusLabel(status: string) {
  if (status === "paid") return "Needs an astrologer";
  if (status === "accepted") return "Accepted";
  if (status === "assigned") return "Assigned";
  if (status === "completed") return "Completed";
  return status;
}

function actionSx(background: string) {
  return {
    textTransform: "none" as const,
    whiteSpace: "nowrap" as const,
    bgcolor: background,
    color: "#fff",
    boxShadow: "none",
    "&:hover": { bgcolor: background, filter: "brightness(0.92)", boxShadow: "none" },
  };
}

function statusColor(status: string): "warning" | "success" | "default" {
  if (status === "paid") return "warning";
  if (status === "completed") return "default";
  return "success";
}

export function MarathonEventBookings({
  event,
  picks,
  onPick,
  onAssign,
  onRetry,
  onEmail,
  onWhatsapp,
}: MarathonEventBookingsProps) {
  const options: ConfirmedAstrologer[] = event.participants || [];
  const bookings = [...(event.bookings || [])].sort((left, right) => {
    if (left.status === "paid" && right.status !== "paid") return -1;
    if (right.status === "paid" && left.status !== "paid") return 1;
    return new Date(left.starts_at || 0).getTime() - new Date(right.starts_at || 0).getTime();
  });
  const waiting = bookings.filter((row) => row.status === "paid").length;

  return (
    <DashboardSectionPaper title="Bookings">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {waiting
          ? `${waiting} paid ${waiting === 1 ? "seat needs" : "seats need"} an astrologer. Only people who confirmed this event can be assigned.`
          : "Assign an astrologer after payment. The meeting link is created when someone accepts or you assign them."}
      </Typography>
      <TableContainer sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <Table size="small" sx={{ width: "100%", tableLayout: "fixed", "& th, & td": { verticalAlign: "middle" } }}>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Astrologer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No paid seats yet.
                </TableCell>
              </TableRow>
            ) : bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                options={options}
                picked={picks[booking.id] ?? ""}
                onPick={(userId) => onPick(booking.id, userId)}
                onAssign={() => onAssign(booking.id)}
                onRetry={() => onRetry(booking.id)}
                onEmail={() => onEmail(booking.id)}
                onWhatsapp={() => onWhatsapp(booking.id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardSectionPaper>
  );
}

function BookingRow({
  booking,
  options,
  picked,
  onPick,
  onAssign,
  onRetry,
  onEmail,
  onWhatsapp,
}: {
  booking: Booking;
  options: ConfirmedAstrologer[];
  picked: number | "";
  onPick: (userId: number | "") => void;
  onAssign: () => void;
  onRetry: () => void;
  onEmail: () => void;
  onWhatsapp: () => void;
}) {
  const waiting = booking.status === "paid";
  return (
    <Fragment>
      <TableRow hover>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{booking.user_name || "Customer"}</Typography>
          {booking.user_email ? (
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>{booking.user_email}</Typography>
          ) : null}
        </TableCell>
        <TableCell>
          {booking.starts_at && booking.ends_at ? (
            <>
              <Typography variant="body2">{formatDay(booking.starts_at)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatClock(booking.starts_at)} – {formatClock(booking.ends_at)}
              </Typography>
            </>
          ) : "—"}
        </TableCell>
        <TableCell>
          <Chip size="small" label={statusLabel(booking.status)} color={statusColor(booking.status)} />
        </TableCell>
        <TableCell>
          {waiting ? (
            options.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No confirmed astrologer yet.</Typography>
            ) : (
              <FormControl size="small" fullWidth>
                <InputLabel>Select astrologer</InputLabel>
                <Select value={picked} label="Select astrologer" onChange={(e) => onPick(e.target.value as number)}>
                  {options.map((person) => (
                    <MenuItem key={person.user_id} value={person.user_id}>
                      {person.name || `User ${person.user_id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          ) : (
            <>
              <Typography variant="body2">{booking.astrologer_name || "Astrologer assigned"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.meeting_link ? "Meeting link ready" : "No meeting link yet"}
              </Typography>
            </>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ pt: 0, pb: 1.5, borderTop: 0 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              columnGap: 2,
              alignItems: "center",
            }}
          >
            <Box sx={{ gridColumn: "1 / 4" }} display="flex" gap={1} alignItems="center" flexWrap="wrap">
              {booking.meeting_link ? (
                <Button size="small" variant="contained" startIcon={<VideocamOutlinedIcon />} href={booking.meeting_link} target="_blank" rel="noopener noreferrer" sx={actionSx("#1565c0")}>
                  Open meeting
                </Button>
              ) : null}
              {!waiting ? (
                <>
                  <Tooltip title="Creates a new Google Meet link and saves it on this booking">
                    <Button size="small" variant="contained" startIcon={<RefreshIcon />} onClick={onRetry} sx={actionSx("#ef6c00")}>Retry Meet link</Button>
                  </Tooltip>
                  <Tooltip title="Emails the astrologer and the customer again">
                    <Button size="small" variant="contained" startIcon={<EmailOutlinedIcon />} onClick={onEmail} sx={actionSx("#6a1b9a")}>Resend email</Button>
                  </Tooltip>
                </>
              ) : null}
              <Tooltip title="Sends the payment alert again to the admin WhatsApp number">
                <Button size="small" variant="contained" startIcon={<WhatsAppIcon />} onClick={onWhatsapp} sx={actionSx("#128C7E")}>Resend WhatsApp</Button>
              </Tooltip>
            </Box>
            <Box sx={{ gridColumn: "4" }}>
              {waiting && options.length > 0 ? (
                <Button
                  size="small"
                  variant="contained"
                  disabled={!picked}
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={onAssign}
                  sx={{ textTransform: "none", ...(picked ? actionSx("#2e7d32") : {}) }}
                >
                  Assign
                </Button>
              ) : null}
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
