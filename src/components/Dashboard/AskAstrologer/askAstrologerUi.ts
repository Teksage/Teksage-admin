/** Shared Ask Astrologer admin UI tokens. */

export const ASK_STATUS_COLOR: Record<
  string,
  "warning" | "info" | "secondary" | "success" | "error" | "default"
> = {
  pending_payment: "warning",
  paid: "info",
  assigned: "secondary",
  answered: "success",
  cancelled: "error",
};

export const ASK_STATUS_LABEL: Record<string, string> = {
  pending_payment: "Pending payment",
  paid: "Paid",
  assigned: "Assigned",
  answered: "Answered",
  cancelled: "Cancelled",
};

export function formatAskStatus(status: string): string {
  return ASK_STATUS_LABEL[status] ?? status.replace(/_/g, " ");
}

export const ASK_WA_PRESET_MESSAGES = [
  "We have received your question. Our astrologer will respond shortly.",
  "Your response will be ready in the Teksage app shortly.",
  "Our astrologer has been assigned to your question and is reviewing it now.",
] as const;

export const ASK_DETAIL_PAGE = {
  backListPath: "/dashboard/ask-astrologer",
  loadFailed: "Failed to load request details",
  assignSuccess: "Astrologer assigned successfully",
  assignFailed: "Assignment failed",
  waSendSuccess: "WhatsApp message sent",
  waSendFailed: "Send failed",
  waNotOptedIn:
    "Customer has not opted into WhatsApp updates — status messages are not available.",
  sectionClient: "Client Information",
  sectionQa: "Question & AI Answer",
  sectionAnswer: "Astrologer Answer",
  sectionAssign: "Assign Astrologer",
  sectionWhatsApp: "Send WhatsApp Status to Customer",
  labelQuestion: "Client Question",
  labelAiAnswer: "AI Answer",
  labelAnsweredAt: "Answered",
  labelLastAssigned: "Last assigned",
  labelSelectAstrologer: "Select astrologer",
  labelAssigning: "Assigning…",
  labelAssign: "Assign",
  labelSending: "Sending…",
  labelSendWa: "Send WhatsApp",
  labelPreset: "Preset",
  labelCustom: "Custom",
  labelMessage: "Message",
  labelCustomMessage: "Custom message",
} as const;
