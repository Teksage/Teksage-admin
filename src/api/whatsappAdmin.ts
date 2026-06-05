import { callAPI } from "./crudFactory";

export type WhatsAppTemplate = {
  id: number;
  name: string;
  display_name: string;
  param_count: number;
  category?: string | null;
  role: string;
};

export type OptedInUser = {
  user_id: number;
  name: string;
  email?: string | null;
  phone_masked: string;
  granted_at?: string | null;
};

export async function fetchWhatsAppTemplates() {
  const res = await callAPI({
    endpoint: "api/admin/whatsapp/templates",
    method: "get",
  });
  return res.data as WhatsAppTemplate[];
}

export async function createWhatsAppTemplate(payload: {
  name: string;
  gupshup_template_id: string;
  display_name: string;
  param_count: number;
}) {
  const res = await callAPI({
    endpoint: "api/admin/whatsapp/templates",
    method: "post",
    data: payload,
  });
  return res.data as WhatsAppTemplate;
}

export async function fetchOptedInUsers(search?: string) {
  const res = await callAPI({
    endpoint: "api/admin/whatsapp/opted-in-users",
    method: "get",
    params: { page: 1, page_size: 200, search: search || undefined },
  });
  return res.data as { data: OptedInUser[]; total: number };
}

export async function sendWhatsAppBroadcast(payload: {
  recipient_mode: "all" | "selected";
  user_ids?: number[];
  message_mode: "template" | "custom";
  template_id?: number;
  template_params?: string[];
  custom_text?: string;
}) {
  const res = await callAPI({
    endpoint: "api/admin/whatsapp/send",
    method: "post",
    data: payload,
  });
  return res.data as { log_id: number; total: number; sent: number; failed: number };
}

export async function fetchWhatsAppBroadcastLogs(page = 1) {
  const res = await callAPI({
    endpoint: "api/admin/whatsapp/broadcast-logs",
    method: "get",
    params: { page, page_size: 20 },
  });
  return res.data as {
    data: Array<{
      id: number;
      sender_email: string;
      recipient_mode: string;
      message_mode: string;
      template_name?: string | null;
      recipient_count: number;
      sent_count: number;
      failed_count: number;
      created_at?: string | null;
    }>;
    total: number;
  };
}
