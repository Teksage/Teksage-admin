import { Typography } from "@mui/material";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { ASK_DETAIL_PAGE } from "./askAstrologerUi";
import type { AskAstrologerItem } from "../../../api/askAstrologerAdmin";

const blockLabelSx = {
  fontFamily: "Urbanist",
  fontWeight: 600,
  color: "text.secondary",
  fontSize: "0.85rem",
  mb: 0.5,
} as const;

const blockBodySx = {
  fontFamily: "Urbanist",
  fontWeight: 500,
  whiteSpace: "pre-wrap",
  mb: 2,
} as const;

export function AskAstrologerQaSection({ data }: { data: AskAstrologerItem }) {
  return (
    <DashboardSectionPaper title={ASK_DETAIL_PAGE.sectionQa}>
      <Typography sx={blockLabelSx}>{ASK_DETAIL_PAGE.labelQuestion}</Typography>
      <Typography variant="body1" sx={blockBodySx}>
        {data.user_question}
      </Typography>
      <Typography sx={blockLabelSx}>{ASK_DETAIL_PAGE.labelAiAnswer}</Typography>
      <Typography variant="body1" sx={{ ...blockBodySx, mb: 0 }}>
        {data.ai_response}
      </Typography>
    </DashboardSectionPaper>
  );
}
