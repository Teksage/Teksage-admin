import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { ASK_DETAIL_PAGE } from "./askAstrologerUi";
import type {
  AskAstrologerItem,
  MuhurthaDayResult,
  MuhurthaDaySegment,
} from "../../../api/askAstrologerAdmin";

function formatRange(start: string, end: string) {
  const s = new Date(`${start}T12:00:00`);
  const e = new Date(`${end}T12:00:00`);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(s)} – ${fmt(e)}`;
}

function formatWindows(windows?: string[], window?: string): string {
  if (windows && windows.length > 0) {
    return windows.map((w) => w.replace(/\bTo\b/g, "–")).join(", ");
  }
  if (window) return window.replace(/\bTo\b/g, "–");
  return "—";
}

function periodLabel(period: string): string {
  if (period === "Morning") return ASK_DETAIL_PAGE.labelEventPlanMorning;
  if (period === "Evening") return ASK_DETAIL_PAGE.labelEventPlanEvening;
  if (period === "Full day") return ASK_DETAIL_PAGE.labelEventPlanFullDay;
  return period;
}

function segmentDetails(segment: MuhurthaDaySegment): string {
  if (segment.is_suitable) {
    return formatWindows(segment.windows, segment.window);
  }
  const codes = segment.reason_codes ?? (segment.reason_code ? [segment.reason_code] : []);
  return codes.join(", ") || "—";
}

function StatusChips({ day }: { day: MuhurthaDayResult }) {
  const segments = day.segments && day.segments.length > 1 ? day.segments : null;
  if (segments) {
    return (
      <Stack spacing={0.75} alignItems="flex-start">
        {segments.map((segment) => (
          <Box key={`${day.iso_date}-${segment.period}`}>
            <Typography variant="caption" color="text.secondary" display="block">
              {periodLabel(segment.period)}
            </Typography>
            <Chip
              label={
                segment.is_suitable
                  ? `${ASK_DETAIL_PAGE.labelEventPlanSuitable}${segment.rating ? ` – ${segment.rating}` : ""}`
                  : ASK_DETAIL_PAGE.labelEventPlanNotSuitable
              }
              color={segment.is_suitable ? "success" : "error"}
              size="small"
              variant="outlined"
            />
          </Box>
        ))}
      </Stack>
    );
  }

  return day.is_suitable ? (
    <Chip
      label={`${ASK_DETAIL_PAGE.labelEventPlanSuitable}${day.rating ? ` – ${day.rating}` : ""}`}
      color="success"
      size="small"
      variant="outlined"
    />
  ) : (
    <Chip
      label={ASK_DETAIL_PAGE.labelEventPlanNotSuitable}
      color="error"
      size="small"
      variant="outlined"
    />
  );
}

function DetailsCell({ day }: { day: MuhurthaDayResult }) {
  const segments = day.segments && day.segments.length > 1 ? day.segments : null;
  if (segments) {
    return (
      <Stack spacing={0.75} alignItems="flex-start">
        {segments.map((segment) => (
          <Box key={`${day.iso_date}-${segment.period}-details`}>
            <Typography variant="caption" color="text.secondary" display="block">
              {periodLabel(segment.period)}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Urbanist", fontSize: "0.8rem" }}>
              {segmentDetails(segment)}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <>
      {day.is_suitable
        ? formatWindows(day.windows, day.window)
        : (day.reason_codes ?? (day.reason_code ? [day.reason_code] : [])).join(", ") || "—"}
    </>
  );
}

export function MuhurthaEventPlanSection({ data }: { data: AskAstrologerItem }) {
  const result = data.muhurtha_result;
  if (!result) return null;

  const rows = result.days?.length ? result.days : result.dates ?? [];

  return (
    <DashboardSectionPaper title={ASK_DETAIL_PAGE.sectionEventPlan}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1.5, fontFamily: "Urbanist", color: "text.secondary" }}
      >
        {result.event}
        {result.start_date && result.end_date ? (
          <span style={{ marginLeft: 8, fontWeight: 400 }}>
            {formatRange(result.start_date, result.end_date)}
          </span>
        ) : null}
        {result.location ? (
          <span style={{ marginLeft: 8, fontWeight: 400 }}>— {result.location}</span>
        ) : null}
      </Typography>

      <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2" sx={{ fontFamily: "Urbanist", fontWeight: 600 }}>
            {ASK_DETAIL_PAGE.labelEventPlanDate} / {ASK_DETAIL_PAGE.labelEventPlanStatus} /{" "}
            {ASK_DETAIL_PAGE.labelEventPlanDetails}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontFamily: "Urbanist", fontWeight: 600 }}>
                  {ASK_DETAIL_PAGE.labelEventPlanDate}
                </TableCell>
                <TableCell sx={{ fontFamily: "Urbanist", fontWeight: 600 }}>
                  {ASK_DETAIL_PAGE.labelEventPlanStatus}
                </TableCell>
                <TableCell sx={{ fontFamily: "Urbanist", fontWeight: 600 }}>
                  {ASK_DETAIL_PAGE.labelEventPlanDetails}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((day) => (
                <TableRow key={day.iso_date}>
                  <TableCell sx={{ fontFamily: "Urbanist" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {day.date}
                    </Typography>
                    {day.weekday ? (
                      <Typography variant="caption" color="text.secondary">
                        {day.weekday}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <StatusChips day={day} />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Urbanist", fontSize: "0.8rem" }}>
                    <DetailsCell day={day} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </DashboardSectionPaper>
  );
}
