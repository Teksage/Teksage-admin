import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { formatDateTimeDMY } from "../../../utils/formatDateTime";
import { ASK_DETAIL_PAGE } from "./askAstrologerUi";

type AstrologerOption = { astrologer_id: number; first_name: string; last_name: string };

type AskAssignAstrologerSectionProps = {
  astrologers: AstrologerOption[];
  assignAstroId: number | "";
  assignedAt?: string | null;
  busy: boolean;
  onSelect: (id: number | "") => void;
  onAssign: () => void;
};

export function AskAssignAstrologerSection({
  astrologers,
  assignAstroId,
  assignedAt,
  busy,
  onSelect,
  onAssign,
}: AskAssignAstrologerSectionProps) {
  return (
    <DashboardSectionPaper title={ASK_DETAIL_PAGE.sectionAssign}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onAssign();
        }}
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-start" }}
      >
        <FormControl size="small" sx={{ minWidth: 280, flex: 1 }}>
          <InputLabel>{ASK_DETAIL_PAGE.labelSelectAstrologer}</InputLabel>
          <Select
            value={assignAstroId}
            label={ASK_DETAIL_PAGE.labelSelectAstrologer}
            onChange={(e) => onSelect(e.target.value as number)}
          >
            {astrologers.map((a) => (
              <MenuItem key={a.astrologer_id} value={a.astrologer_id}>
                {a.first_name} {a.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          disabled={!assignAstroId || busy}
          sx={{ minWidth: 120 }}
        >
          {busy ? ASK_DETAIL_PAGE.labelAssigning : ASK_DETAIL_PAGE.labelAssign}
        </Button>
      </Box>
      {assignedAt ? (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
          {ASK_DETAIL_PAGE.labelLastAssigned}: {formatDateTimeDMY(assignedAt)}
        </Typography>
      ) : null}
    </DashboardSectionPaper>
  );
}
