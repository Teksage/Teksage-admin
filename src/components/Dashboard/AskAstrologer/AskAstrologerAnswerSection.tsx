import { Typography } from "@mui/material";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import VoiceAnswerPlayer from "./VoiceAnswerPlayer";
import { formatDateTimeDMY } from "../../../utils/formatDateTime";
import { ASK_DETAIL_PAGE } from "./askAstrologerUi";
import type { AskAstrologerItem } from "../../../api/askAstrologerAdmin";

export function AskAstrologerAnswerSection({ data }: { data: AskAstrologerItem }) {
  if (!data.answer_text && !data.answer_voice_url) return null;

  return (
    <DashboardSectionPaper title={ASK_DETAIL_PAGE.sectionAnswer}>
      {data.answer_text ? (
        <Typography
          variant="body1"
          sx={{ fontFamily: "Urbanist", fontWeight: 500, whiteSpace: "pre-wrap", mb: 2 }}
        >
          {data.answer_text}
        </Typography>
      ) : null}
      {data.answer_voice_url ? (
        <VoiceAnswerPlayer
          src={data.answer_voice_url}
          durationSec={data.answer_voice_duration_sec}
          style={{ marginBottom: 2 }}
        />
      ) : null}
      <Typography variant="caption" color="text.secondary">
        {ASK_DETAIL_PAGE.labelAnsweredAt}: {formatDateTimeDMY(data.answered_at)}
      </Typography>
    </DashboardSectionPaper>
  );
}
