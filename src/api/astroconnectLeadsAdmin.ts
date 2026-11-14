import { callAPI } from "./crudFactory";

export type AstroConnectLeadRow = {
  id: number;
  name: string;
  mobile_e164: string;
  mobile_masked: string;
  categories: string[];
  source_marathon_id?: number | null;
  marathon_name?: string | null;
  user_id?: number | null;
  status: string;
  whatsapp_opt_in: boolean;
  /** Live WhatsApp consent: granted | pending | stopped */
  whatsapp_state?: "granted" | "pending" | "stopped" | string;
  consent_prompted_at?: string | null;
  created_at?: string | null;
  platform?: string | null;
};

export async function fetchAstroConnectLeads(params?: {
  status?: string;
  granted?: boolean;
  source_marathon_id?: number;
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}) {
  const res = await callAPI({
    endpoint: "api/admin/astroconnect/leads",
    method: "get",
    params,
  });
  return res.data as { data: AstroConnectLeadRow[]; total: number };
}

export async function notifyAstroConnectLeads(payload: {
  recipient_mode: "all_granted" | "selected";
  lead_ids?: number[];
  message_mode: "template" | "custom";
  template_id?: number;
  template_params?: string[];
  custom_text?: string;
}) {
  const res = await callAPI({
    endpoint: "api/admin/astroconnect/leads/notify",
    method: "post",
    data: payload,
  });
  return res.data as { log_id: number; total: number; sent: number; failed: number };
}
