import { Fragment, useState } from "react";
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
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

const RELATIONSHIP_LABELS: Record<string, string> = {
  spouse: "Spouse",
  brother: "Brother",
  sister: "Sister",
  father: "Father",
  mother: "Mother",
  son: "Son",
  daughter: "Daughter",
  friend: "Friend",
  other: "Others",
};

function relationshipLabel(code: string) {
  return RELATIONSHIP_LABELS[code] || code;
}

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

type BookingTab = "upcoming" | "assigned" | "completed";

function bookingTab(status: string): BookingTab {
  if (status === "completed") return "completed";
  if (status === "assigned" || status === "accepted") return "assigned";
  return "upcoming";
}

const TAB_HINT: Record<BookingTab, string> = {
  upcoming: "Paid seats that still need an astrologer. Only people who confirmed this event can be assigned.",
  assigned: "These seats have an astrologer. The meeting link is created when you assign them.",
  completed: "These sessions are finished.",
};

const TAB_EMPTY: Record<BookingTab, string> = {
  upcoming: "No seats are waiting for an astrologer.",
  assigned: "No assigned seats yet.",
  completed: "No completed sessions yet.",
};

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
  const bookings = [...(event.bookings || [])].sort(
    (left, right) => new Date(left.starts_at || 0).getTime() - new Date(right.starts_at || 0).getTime()
  );
  const counts: Record<BookingTab, number> = {
    upcoming: bookings.filter((row) => bookingTab(row.status) === "upcoming").length,
    assigned: bookings.filter((row) => bookingTab(row.status) === "assigned").length,
    completed: bookings.filter((row) => bookingTab(row.status) === "completed").length,
  };
  const [tab, setTab] = useState<BookingTab>(counts.upcoming > 0 ? "upcoming" : "assigned");
  const visible = bookings.filter((row) => bookingTab(row.status) === tab);

  return (
    <DashboardSectionPaper title="Bookings">
      <Tabs
        value={tab}
        onChange={(_, value: BookingTab) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 40, mb: 1, "& .MuiTab-root": { fontFamily: "Urbanist", fontWeight: 700, textTransform: "none", minHeight: 40 } }}
      >
        <Tab value="upcoming" label={`Upcoming (${counts.upcoming})`} />
        <Tab value="assigned" label={`Assigned (${counts.assigned})`} />
        <Tab value="completed" label={`Completed (${counts.completed})`} />
      </Tabs>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {TAB_HINT[tab]}
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
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  {TAB_EMPTY[tab]}
                </TableCell>
              </TableRow>
            ) : visible.map((booking) => (
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
  const cellTop = { borderBottom: 0, verticalAlign: "top" as const, pt: 2, pb: 1 };
  const cellActions = { borderTop: 0, verticalAlign: "middle" as const, pt: 1, pb: 2.5 };
  return (
    <Fragment>
      <TableRow hover>
        <TableCell sx={cellTop}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{booking.user_name || "Customer"}</Typography>
          {booking.related_profile_id && booking.member_display_name ? (
            <Typography variant="body2" color="text.secondary">
              For: {booking.member_display_name}
              {booking.relationship ? ` (${relationshipLabel(booking.relationship)})` : ""}
            </Typography>
          ) : null}
          {booking.user_email ? (
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>{booking.user_email}</Typography>
          ) : null}
          {booking.preferred_language ? (
            <Typography variant="body2" sx={{ mt: 0.75 }}>
              <Box component="span" sx={{ fontWeight: 600 }}>Language: </Box>
              {booking.preferred_language.charAt(0).toUpperCase() + booking.preferred_language.slice(1)}
            </Typography>
          ) : null}
          {booking.customer_query ? (
            <Typography variant="body2" sx={{ mt: 0.75, whiteSpace: "pre-wrap" }}>
              <Box component="span" sx={{ fontWeight: 600 }}>Question: </Box>
              {booking.customer_query}
            </Typography>
          ) : null}
        </TableCell>
        <TableCell sx={cellTop}>
          {booking.starts_at && booking.ends_at ? (
            <>
              <Typography variant="body2">{formatDay(booking.starts_at)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatClock(booking.starts_at)} – {formatClock(booking.ends_at)}
              </Typography>
            </>
          ) : "—"}
        </TableCell>
        <TableCell sx={cellTop}>
          <Chip size="small" label={statusLabel(booking.status)} color={statusColor(booking.status)} />
        </TableCell>
        <TableCell sx={cellTop}>
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
        <TableCell colSpan={3} sx={cellActions}>
          <Box display="flex" gap={1.25} alignItems="center" flexWrap="wrap" sx={{ pr: 1 }}>
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
        </TableCell>
        <TableCell sx={{ ...cellActions, textAlign: "left" }}>
          {waiting && options.length > 0 ? (
            <Button
              size="small"
              variant="contained"
              disabled={!picked}
              startIcon={<PersonAddAlt1Icon />}
              onClick={onAssign}
              sx={actionSx(picked ? "#2e7d32" : "#9e9e9e")}
            >
              Assign
            </Button>
          ) : null}
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
