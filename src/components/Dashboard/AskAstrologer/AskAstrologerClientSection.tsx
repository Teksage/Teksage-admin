import React from "react";
import { Box, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import LanguageIcon from "@mui/icons-material/Language";
import PaymentsIcon from "@mui/icons-material/Payments";
import EventIcon from "@mui/icons-material/Event";
import {
  InfoItem,
  capitalizeCommaSeparated,
} from "../../Elements/CommonFunctions";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { formatDateTimeDMY } from "../../../utils/formatDateTime";
import { ASK_DETAIL_PAGE } from "./askAstrologerUi";
import type { AskAstrologerItem } from "../../../api/askAstrologerAdmin";

export function AskAstrologerClientSection({ data }: { data: AskAstrologerItem }) {
  const languages = (data.preferred_languages ?? []).join(", ");
  const fee =
    data.currency && data.base_price != null
      ? `${data.currency} ${data.base_price}`
      : undefined;

  return (
    <DashboardSectionPaper title={ASK_DETAIL_PAGE.sectionClient}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <InfoItem label="Name" value={data.customer_name} icon={<PersonIcon fontSize="small" />} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            label="Date of Birth"
            value={data.date_of_birth}
            icon={<CalendarTodayIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            label="Time of Birth"
            value={data.time_of_birth}
            icon={<AccessTimeIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            label="Place of Birth"
            value={data.place_of_birth}
            icon={<LocationOnIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            label="Rasi / Moon Sign"
            value={data.rashi}
            icon={<ScatterPlotIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            label="Nakshatra"
            value={data.nakshatra}
            icon={<StarOutlineIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            label="Languages"
            value={languages ? capitalizeCommaSeparated(languages) : undefined}
            icon={<LanguageIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem label="Fee" value={fee} icon={<PaymentsIcon fontSize="small" />} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            label="Paid at"
            value={data.paid_at ? formatDateTimeDMY(data.paid_at) : undefined}
            icon={<EventIcon fontSize="small" />}
          />
        </Grid>
      </Grid>
    </DashboardSectionPaper>
  );
}
