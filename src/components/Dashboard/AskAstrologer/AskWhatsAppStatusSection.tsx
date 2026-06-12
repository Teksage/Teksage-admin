import React from "react";
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DashboardSectionPaper } from "../../Elements/DashboardSectionPaper";
import { ASK_DETAIL_PAGE, ASK_WA_PRESET_MESSAGES } from "./askAstrologerUi";

type AskWhatsAppStatusSectionProps = {
  optedIn: boolean;
  waMode: "preset" | "custom";
  selectedPreset: string;
  customWaText: string;
  busy: boolean;
  onModeChange: (mode: "preset" | "custom") => void;
  onPresetChange: (message: string) => void;
  onCustomChange: (text: string) => void;
  onSend: () => void;
};

export function AskWhatsAppStatusSection({
  optedIn,
  waMode,
  selectedPreset,
  customWaText,
  busy,
  onModeChange,
  onPresetChange,
  onCustomChange,
  onSend,
}: AskWhatsAppStatusSectionProps) {
  if (!optedIn) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        {ASK_DETAIL_PAGE.waNotOptedIn}
      </Alert>
    );
  }

  return (
    <DashboardSectionPaper title={ASK_DETAIL_PAGE.sectionWhatsApp}>
      <RadioGroup
        row
        value={waMode}
        onChange={(e) => onModeChange(e.target.value as "preset" | "custom")}
        sx={{ mb: 2 }}
      >
        <FormControlLabel
          value="preset"
          control={<Radio size="small" />}
          label={ASK_DETAIL_PAGE.labelPreset}
        />
        <FormControlLabel
          value="custom"
          control={<Radio size="small" />}
          label={ASK_DETAIL_PAGE.labelCustom}
        />
      </RadioGroup>

      {waMode === "preset" ? (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>{ASK_DETAIL_PAGE.labelMessage}</InputLabel>
          <Select
            value={selectedPreset}
            label={ASK_DETAIL_PAGE.labelMessage}
            onChange={(e) => onPresetChange(e.target.value)}
          >
            {ASK_WA_PRESET_MESSAGES.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          fullWidth
          size="small"
          multiline
          minRows={3}
          label={ASK_DETAIL_PAGE.labelCustomMessage}
          value={customWaText}
          onChange={(e) => onCustomChange(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      <Button
        variant="contained"
        disabled={busy || (waMode === "custom" && !customWaText.trim())}
        onClick={onSend}
      >
        {busy ? ASK_DETAIL_PAGE.labelSending : ASK_DETAIL_PAGE.labelSendWa}
      </Button>
    </DashboardSectionPaper>
  );
}
