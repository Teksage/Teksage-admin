import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
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
import type { AskAstrologerItem, MuhurthaDayResult } from "../../../api/askAstrologerAdmin";

function formatRange(start: string, end: string) {
  const s = new Date(`${start}T12:00:00`);
  const e = new Date(`${end}T12:00:00`);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(s)} – ${fmt(e)}`;
}

function dayWindows(day: MuhurthaDayResult): string {
  if (day.windows && day.windows.length > 0) {
    return day.windows.map((w) => w.replace(/\bTo\b/g, "–")).join(", ");
  }
  if (day.window) return day.window.replace(/\bTo\b/g, "–");
  return "—";
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
            {ASK_DETAIL_PAGE.labelEventPlanDate} / {ASK_DETAIL_PAGE.labelEventPlanStatus} / {ASK_DETAIL_PAGE.labelEventPlanDetails}
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
                    {day.is_suitable ? (
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
                    )}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Urbanist", fontSize: "0.8rem" }}>
                    {day.is_suitable ? dayWindows(day) : (day.reason_codes ?? (day.reason_code ? [day.reason_code] : [])).join(", ") || "—"}
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
